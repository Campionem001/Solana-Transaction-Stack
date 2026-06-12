// This file loads your keys from the private file
const { rpcUrl, apiKey } = require('./private-keys.js');

// Build the full URL with API key as parameter
const fullUrl = `${rpcUrl}?api_key=${apiKey}`;

async function test() {
    console.log("🔗 Testing SolInfra Connection...");
    console.log("URL:", rpcUrl);
    console.log("API Key:", apiKey.substring(0, 10) + "...");
    console.log("");
    
    const { Connection } = require('@solana/web3.js');
    const connection = new Connection(fullUrl);
    
    try {
        const version = await connection.getVersion();
        console.log("✅ SUCCESS!");
        console.log("Solana version:", version);
        
        const slot = await connection.getSlot();
        console.log("Current slot:", slot);
        
        console.log("\n🎉 SolInfra is working correctly!");
        console.log("Your private keys are safe (stored only on your phone)");
        
    } catch (error) {
        console.log("❌ Failed:", error.message);
        console.log("\nCheck that your API key is correct.");
    }
}

test();
