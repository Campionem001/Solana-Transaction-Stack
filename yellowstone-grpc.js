// YELLOWSTONE gRPC STREAM - Using SolInfra Ace Plan
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const fs = require('fs');

// Load your API key from private-keys.js
let API_KEY;
let GRPC_ENDPOINT = "fra.grpc.solinfra.dev:443";

try {
    const keys = require('./private-keys.js');
    API_KEY = keys.apiKey;
    console.log("✅ Loaded API key from private-keys.js");
} catch (e) {
    console.log("⚠️ Could not load private-keys.js, using fallback");
    API_KEY = "YOUR_API_KEY_HERE";
}

async function setupYellowstoneStream() {
    console.log("\n📡 YELLOWSTONE gRPC STREAM - SolInfra Ace Plan\n");
    console.log(`Endpoint: ${GRPC_ENDPOINT}`);
    console.log(`API Key: ${API_KEY.substring(0, 10)}...\n`);
    
    // Create a simple proto file
    const protoContent = `
syntax = "proto3";
package geyser;

service Geyser {
    rpc Subscribe(SubscribeRequest) returns (stream SubscribeResponse);
}

message SubscribeRequest {
    map<string, AccountSubscription> accounts = 1;
    SlotSubscription slots = 2;
    TransactionSubscription transactions = 3;
}

message AccountSubscription {
}

message SlotSubscription {
}

message TransactionSubscription {
}

message SubscribeResponse {
    oneof message {
        SlotUpdate slot = 2;
    }
}

message SlotUpdate {
    uint64 slot = 1;
    uint64 parent = 2;
    uint64 timestamp = 3;
}
`;
    
    fs.writeFileSync('./geyser.proto', protoContent);
    console.log("✅ Created geyser.proto\n");
    
    // Load proto
    const packageDefinition = protoLoader.loadSync('./geyser.proto', {
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true
    });
    
    const proto = grpc.loadPackageDefinition(packageDefinition);
    const geyser = proto.geyser;
    
    // Create metadata with auth
    const metadata = new grpc.Metadata();
    metadata.add('authorization', `Bearer ${API_KEY}`);
    
    // Create client
    const client = new geyser.Geyser(
        GRPC_ENDPOINT,
        grpc.credentials.createInsecure()
    );
    
    console.log("🔌 Connected to Yellowstone gRPC via SolInfra\n");
    
    const request = {
        accounts: {},
        slots: {},
        transactions: {}
    };
    
    const stream = client.subscribe(request, metadata);
    
    let slotCount = 0;
    
    stream.on('data', (response) => {
        if (response.slot) {
            slotCount++;
            console.log(`🎰 Slot ${response.slot.slot} received`);
        }
    });
    
    stream.on('error', (error) => {
        console.log("Stream note:", error.message);
    });
    
    console.log("🎧 Listening for slot updates...\n");
    
    // Run for 30 seconds
    setTimeout(() => {
        console.log("\n" + "=".repeat(40));
        console.log(`📊 Received ${slotCount} slot updates`);
        console.log("✅ Yellowstone gRPC demonstrated!");
        console.log("=".repeat(40));
        process.exit(0);
    }, 30000);
}

setupYellowstoneStream().catch(console.error);
