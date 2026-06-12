const { Connection } = require('@solana/web3.js');

async function main() {
    console.log("🔗 Connecting to Solana...");
    
    // Try these endpoints one at a time if the first fails
    const endpoints = [
        "https://api.devnet.solana.com",
        "https://devnet.solana.com",
        "https://solana-devnet.g.alchemy.com/v2/demo"
    ];
    
    for (const url of endpoints) {
        try {
            console.log(`Trying: ${url}`);
            const connection = new Connection(url);
            const version = await connection.getVersion();
            console.log("✅ Connected successfully!");
            console.log("Network version:", version);
            const slot = await connection.getSlot();
            console.log("Current slot:", slot);
            return;
        } catch (e) {
            console.log(`Failed: ${e.message}`);
        }
    }
    console.log("❌ All endpoints failed");
}

main();
