const { Connection } = require('@solana/web3.js');
const fs = require('fs');

// IMPORTANT: Replace these with YOUR actual SolInfra credentials
const SOLINFRA_RPC_URL = "https://fra.rpc.solinfra.dev/sol?api_key=";
const SOLINFRA_API_KEY = "932e0f4ffaac39109955e05f2ed8e370fda43a1eafb0cdf97253b1cf5b298338";

async function testSolInfra() {
    console.log("🔗 Connecting to Solana via SolInfra Ace Plan...");
    
    // Create connection with API key header
    const connection = new Connection(SOLINFRA_RPC_URL, {
        httpHeaders: {
            'Authorization': `Bearer ${SOLINFRA_API_KEY}`
        }
    });
    
    try {
        // Test the connection
        const version = await connection.getVersion();
        console.log("✅ Connected via SolInfra!");
        console.log("Network version:", version);
        
        const slot = await connection.getSlot();
        console.log("Current slot:", slot);
        
        // Check your balance (using your existing wallet)
        const walletData = JSON.parse(fs.readFileSync('my-wallet.json'));
        const publicKey = walletData.publicKey;
        const balance = await connection.getBalance(publicKey);
        console.log(`💰 Balance: ${balance / 1e9} SOL`);
        
        console.log("\n🎉 SolInfra Ace Plan is working!");
        return connection;
        
    } catch (error) {
        console.error("❌ SolInfra connection failed:", error.message);
        console.log("\n⚠️ Check your:");
        console.log("1. RPC URL - should be like https://username.sollinfra.com");
        console.log("2. API Key - should be a long string");
        console.log("3. Internet connection");
        return null;
    }
}

testSolInfra();
