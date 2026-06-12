// SOLINFRA WEBSOCKET - EXACTLY AS DOCUMENTED
const { Connection } = require('@solana/web3.js');

const API_KEY = "932e0f4ffaac39109955e05f2ed8e370fda43a1eafb0cdf97253b1cf5b298338";
// EXACT format from documentation
const RPC_URL = `https://fra.rpc.solinfra.dev/sol?api_key=${API_KEY}`;
const WS_URL = `wss://fra.rpc.solinfra.dev/sol?api_key=${API_KEY}`;

console.log("📡 SOLINFRA WEBSOCKET - As per documentation\n");
console.log(`RPC URL: ${RPC_URL.substring(0, 70)}...`);
console.log(`WS URL: ${WS_URL.substring(0, 70)}...\n`);

try {
    const connection = new Connection(RPC_URL, { 
        wsEndpoint: WS_URL,
        commitment: 'confirmed'
    });
    
    console.log("✅ Connection object created");
    console.log("🎧 Subscribing to slot changes...\n");
    
    let slotCount = 0;
    
    // Exactly as documentation shows
    connection.onSlotChange((slotInfo) => {
        slotCount++;
        console.log(`🎰 Slot: ${slotInfo.slot}`);
        console.log(`   Parent: ${slotInfo.parent}`);
        console.log(`   Timestamp: ${new Date().toISOString()}\n`);
    });
    
    console.log("📡 Waiting for slot updates...");
    console.log("⏳ This runs for 30 seconds\n");
    
    setTimeout(() => {
        console.log(`\n✅ Received ${slotCount} slot updates via SolInfra WebSocket!`);
        if (slotCount > 0) {
            console.log("🎉 SUCCESS! SolInfra WebSocket works!");
        } else {
            console.log("⚠️ No slots received. Possible reasons:");
            console.log("   1. Termux network limitations");
            console.log("   2. Need to run on mainnet (not devnet)");
            console.log("   3. WebSocket port blocked on mobile network");
        }
        process.exit(0);
    }, 30000);
    
} catch (error) {
    console.log("❌ Error:", error.message);
}
