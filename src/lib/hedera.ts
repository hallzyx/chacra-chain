import { Client, TransferTransaction, Hbar, AccountId, PrivateKey } from "@hashgraph/sdk";

/**
 * Hedera client configuration for testnet.
 * Uses environment variables for account credentials.
 * - NEXT_PUBLIC_HEDERA_ACCOUNT_ID: The account ID (e.g., "0.0.1234567")
 * - NEXT_PUBLIC_HEDERA_PK: The private key (auto-detects ECDSA or ED25519)
 */

function getAccountId(): string {
  const id = process.env.NEXT_PUBLIC_HEDERA_ACCOUNT_ID;
  if (!id) {
    throw new Error("NEXT_PUBLIC_HEDERA_ACCOUNT_ID not set in .env.local");
  }
  return id;
}

function getPrivateKey(): PrivateKey {
  const pk = process.env.NEXT_PUBLIC_HEDERA_PK;
  if (!pk) {
    throw new Error("NEXT_PUBLIC_HEDERA_PK not set in .env.local");
  }
  // fromString() auto-detects ECDSA or ED25519
  return PrivateKey.fromString(pk);
}

let client: Client | null = null;

export function getHederaClient(): Client {
  if (!client) {
    client = Client.forTestnet();
    const accountId = AccountId.fromString(getAccountId());
    const privateKey = getPrivateKey();
    client.setOperator(accountId, privateKey);
  }
  return client;
}

export function getDemoAccountId(): string {
  return getAccountId();
}

export function getReceiverAccountId(): string {
  return "0.0.3";
}

/**
 * Fetches the current HBAR balance using Mirror Node API.
 */
export async function getAccountBalance(): Promise<number> {
  const accountId = getAccountId();
  try {
    const mirrorNodeUrl = `https://testnet.mirrornode.hedera.com/api/v1/balances?account.id=${accountId}`;
    const response = await fetch(mirrorNodeUrl);
    if (!response.ok) {
      throw new Error(`Mirror Node error: ${response.status}`);
    }
    const data = await response.json();
    if (data.balances && data.balances.length > 0) {
      const balanceInTinybars = data.balances[0].balance;
      return balanceInTinybars / 100_000_000;
    }
    return 0;
  } catch (error) {
    console.error("Error fetching balance:", error);
    return 0;
  }
}

/**
 * Transfers HBAR from the user's account to another account.
 */
export async function transferHbar(
  toAccountId: string,
  amount: number
): Promise<string> {
  const client = getHederaClient();

  try {
    const fromAccountId = AccountId.fromString(getAccountId());
    const toAccountIdParsed = AccountId.fromString(toAccountId);

    // Use Hbar objects directly - this is the key fix!
    const transaction = new TransferTransaction()
      .addHbarTransfer(fromAccountId, new Hbar(-amount))
      .addHbarTransfer(toAccountIdParsed, new Hbar(amount))
      .setMaxTransactionFee(new Hbar(1)); // 1 HBAR max fee

    const response = await transaction.execute(client);
    const txId = response.transactionId.toString();
    console.log(`Transfer successful: ${txId}`);

    return txId;
  } catch (error) {
    console.error("Transfer error:", error);
    throw error;
  }
}
