import {
  AccountCreateTransaction,
  AccountId,
  Client,
  Hbar,
  PrivateKey,
  TopicMessageSubmitTransaction,
} from "@hashgraph/sdk";
import { decryptSensitiveValue } from "@/lib/auth";

export interface CreatedHederaAccount {
  accountId: string;
  publicKey: string;
  privateKey: string;
}

export interface SubmittedHcsMessage {
  transactionId: string;
  consensusTimestamp: string;
  topicId: string;
}

let cachedClient: Client | null = null;

/**
 * Returns the configured Hedera Testnet client for backend operations.
 * @returns Hedera client with operator credentials loaded.
 * @throws {Error} When required env vars are missing.
 */
export function getServerHederaClient(): Client {
  if (cachedClient) {
    return cachedClient;
  }

  const operatorAccountId = process.env.HEDERA_ACCOUNT_ID;
  const operatorPrivateKey = process.env.HEDERA_PRIVATE_KEY;

  if (!operatorAccountId || !operatorPrivateKey) {
    throw new Error("HEDERA_ACCOUNT_ID and HEDERA_PRIVATE_KEY are required in env");
  }

  const client = Client.forTestnet();
  client.setOperator(AccountId.fromString(operatorAccountId), PrivateKey.fromString(operatorPrivateKey));
  cachedClient = client;

  return client;
}

/**
 * Creates a real Hedera account in Testnet and returns its credentials.
 * @returns Created account details including private key (for custodial storage).
 */
export async function createHederaTestnetAccount(): Promise<CreatedHederaAccount> {
  const client = getServerHederaClient();
  const privateKey = PrivateKey.generateED25519();
  const publicKey = privateKey.publicKey;

  const tx = await new AccountCreateTransaction()
    .setKey(publicKey)
    .setInitialBalance(new Hbar(5))
    .execute(client);

  const receipt = await tx.getReceipt(client);
  const accountId = receipt.accountId;

  if (!accountId) {
    throw new Error("Failed to create Hedera account: missing accountId in receipt");
  }

  return {
    accountId: accountId.toString(),
    publicKey: publicKey.toString(),
    privateKey: privateKey.toString(),
  };
}

/**
 * Publishes a sale payload to Hedera Consensus Service signed by the user's wallet.
 * @param messagePayload - Serialized JSON payload representing a sale.
 * @param userAccountId - The user's Hedera account ID.
 * @param userPrivateKey - The user's PrivateKey for signing.
 * @returns HCS submission metadata (transaction ID and consensus timestamp).
 * @throws {Error} When HEDERA_HCS_TOPIC_ID is not configured.
 */
export async function submitSaleToHcs(
  messagePayload: string,
  userAccountId: string,
  userPrivateKey: PrivateKey
): Promise<SubmittedHcsMessage> {
  const topicId = process.env.HEDERA_HCS_TOPIC_ID;
  if (!topicId) {
    throw new Error("HEDERA_HCS_TOPIC_ID is required in env");
  }

  // Create a client for this specific user (not the operator)
  const client = Client.forTestnet();
  client.setOperator(AccountId.fromString(userAccountId), userPrivateKey);

  try {
    const response = await new TopicMessageSubmitTransaction()
      .setTopicId(topicId)
      .setMessage(messagePayload)
      .execute(client);

    const receipt = await response.getReceipt(client);

    return {
      transactionId: response.transactionId.toString(),
      consensusTimestamp: receipt.topicSequenceNumber
        ? `${receipt.topicSequenceNumber.toString()}@${new Date().toISOString()}`
        : new Date().toISOString(),
      topicId,
    };
  } finally {
    // Always close the client to free resources
    client.close();
  }
}
