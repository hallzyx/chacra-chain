#!/usr/bin/env ts-node
/**
 * Script to create a new Hedera Consensus Service (HCS) topic.
 * Run this once to get your topic ID for HEDERA_HCS_TOPIC_ID environment variable.
 *
 * Prerequisites:
 *   1. Set HEDERA_ACCOUNT_ID and HEDERA_PRIVATE_KEY in .env.local
 *   2. Ensure the account has testnet HBAR (get from https://hedera.com/faucet)
 *   3. Install ts-node if needed: npm install -g ts-node
 *
 * Usage:
 *   npx ts-node scripts/create-hcs-topic.ts
 */

import { Client, TopicCreateTransaction, PrivateKey, AccountId } from "@hashgraph/sdk";
import dotenv from "dotenv";

// Load environment variables from .env.local
dotenv.config({ path: ".env.local" });

// Simple function to get Hedera client for testnet (replicating the logic from hedera-server.ts)
function getServerHederaClient(): Client {
  const operatorAccountId = process.env.HEDERA_ACCOUNT_ID;
  const operatorPrivateKey = process.env.HEDERA_PRIVATE_KEY;

  if (!operatorAccountId || !operatorPrivateKey) {
    throw new Error("HEDERA_ACCOUNT_ID and HEDERA_PRIVATE_KEY are required in env");
  }

  const client = Client.forTestnet();
  client.setOperator(
    AccountId.fromString(operatorAccountId),
    PrivateKey.fromString(operatorPrivateKey)
  );

  return client;
}

async function main() {
  try {
    console.log("🔗 Connecting to Hedera Testnet...");
    const client = getServerHederaClient();
    console.log(`💳 Using operator account: ${client.operatorAccountId?.toString()}`);

    console.log("\n📝 Creating HCS topic for ChacraChain...");
    if (!client.operatorPublicKey) {
      throw new Error("Operator public key is not available. Ensure HEDERA_ACCOUNT_ID and HEDERA_PRIVATE_KEY are set correctly.");
    }
    const transaction = await new TopicCreateTransaction()
      .setTopicMemo("ChacraChain Agricultural Sales - Permanent Topic")
      .setAdminKey(client.operatorPublicKey)
      .setSubmitKey(client.operatorPublicKey)
      .execute(client);

    console.log("⏳ Waiting for transaction to be processed...");
    const receipt = await transaction.getReceipt(client);
    const topicId = receipt.topicId;

    if (topicId === null) {
      throw new Error("Failed to create HCS topic: no topicId in receipt");
    }

    const topicIdStr = topicId.toString();
    console.log("\n✅ SUCCESS! HCS Topic created:");
    console.log(`   📌 Topic ID: ${topicIdStr}`);
    console.log(`   🌐 View on HashScan: https://hashscan.io/testnet/topic/${topicIdStr}`);

    console.log("\n📝 Next steps:");
    console.log(`   1. Add this to your .env.local:`);
    console.log(`      HEDERA_HCS_TOPIC_ID=${topicIdStr}`);
    console.log(`   2. Restart your development server if running`);
    console.log(`   3. You're now ready to register real sales to HCS!`);

    process.exit(0);
  } catch (error) {
    console.error("\n❌ ERROR creating HCS topic:");
    console.error(error instanceof Error ? error.message : String(error));
    console.error("\n🔧 Troubleshooting:");
    console.log(`   - Verify HEDERA_ACCOUNT_ID and HEDERA_PRIVATE_KEY are set in .env.local`);
    console.log(`   - Ensure account has sufficient testnet HBAR (use Hedera faucet)`);
    console.log(`   - Check network connection to Hedera Testnet nodes`);
    process.exit(1);
  }
}

main();