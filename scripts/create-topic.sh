#!/bin/bash
set -e

echo "Creating new HCS topic without submitKey..."
echo "This will allow ANY Hedera account to submit messages to the topic"

# Load environment variables
export $(grep -v '^#' /home/arroz/projects/web3/hedera/test/chacra-chain/.env.local | xargs)

n# Run the TypeScript using ts-node
cd /home/arroz/projects/web3/hedera/test/chacra-chain
npx ts-node scripts/create-topic.ts
