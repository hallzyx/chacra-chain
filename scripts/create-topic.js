/* eslint-disable @typescript-eslint/no-require-imports */
const { Client, AccountId, PrivateKey, TopicCreateTransaction } = require("@hashgraph/sdk");
const dotenv = require("dotenv");

dotenv.config({ path: ".env.local" });

async function createNewTopic() {
  const operatorAccountId = process.env.HEDERA_ACCOUNT_ID;
  const operatorPrivateKey = process.env.HEDERA_PRIVATE_KEY;
  
  if (!operatorAccountId || !operatorPrivateKey) {
    throw new Error("HEDERA_ACCOUNT_ID and HEDERA_PRIVATE_KEY are required in .env.local");
  }
  
  console.log("Creating new HCS topic without submitKey...");
  console.log("This will allow ANY Hedera account to submit messages to the topic");
  
  try {
    const client = Client.forTestnet();
    client.setOperator(
      AccountId.fromString(operatorAccountId),
      PrivateKey.fromString(operatorPrivateKey)
    );
    const tx = await new TopicCreateTransaction()
      .setTopicMemo("ChacraChain Agricultural Sales - Open Submission")
      // NO setSubmitKey — anyone can submit messages
      .execute(client);
    
    const receipt = await tx.getReceipt(client);
    const newTopicId = receipt.topicId;
    
    console.log("\n✅ New topic created successfully!");
    console.log("Topic ID:", newTopicId?.toString());
    console.log("\n📝 IMPORTANT: Update your .env.local file with:");
    console.log(`   HEDERA_HCS_TOPIC_ID=${newTopicId?.toString()}`);
  } catch (error) {
    console.error("\n❌ Failed to create topic:", error);
    process.exit(1);
  }
}

createNewTopic();
