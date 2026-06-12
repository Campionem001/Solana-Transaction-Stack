const { Connection } = require('@solana/web3.js');
const fs = require('fs');

// PASTE YOUR ACTUAL CREDENTIALS HERE
const RPC_URL =  // https://fra.rpc.solinfra.dev/sol?api_key=YHZM97cezEKDiAEF
const API_KEY = "932e0f4ffaac39109955e05f2ed8e370fda43a1eafb0cdf97253b1cf5b298338";  // 

async function testAuthMethods() {
    console.log("🔐 Testing different auth methods for SolInfra...\n");
    
    // Method 1: Bearer token (most common)
    console.log("Method 1: Bearer Token");
    try {
        const conn1 = new Connection(RPC_URL, {
            httpHeaders: { 'Authorization': `Bearer ${API_KEY}` }
        });
        await conn1.getVersion();
        console.log("✅ Bearer token works!\n");
        return;
    } catch(e) {
        console.log(`❌ Failed: ${e.message}\n`);
    }
    
    // Method 2: API Key as header
    console.log("Method 2: x-api-key header");
    try {
        const conn2 = new Connection(RPC_URL, {
            httpHeaders: { 'x-api-key': API_KEY }
        });
        await conn2.getVersion();
        console.log("✅ x-api-key works!\n");
        return;
    } catch(e) {
        console.log(`❌ Failed: ${e.message}\n`);
    }
    
    // Method 3: No auth (just URL)
    console.log("Method 3: No authentication");
    try {
        const conn3 = new Connection(RPC_URL);
        await conn3.getVersion();
        console.log("✅ No auth needed!\n");
        return;
    } catch(e) {
        console.log(`❌ Failed: ${e.message}\n`);
    }
    
    // Method 4: Basic auth (username:password)
    console.log("Method 4: Basic Auth (API key as password)");
    try {
        const auth = Buffer.from(`sol:${API_KEY}`).toString('base64');
        const conn4 = new Connection(RPC_URL, {
            httpHeaders: { 'Authorization': `Basic ${auth}` }
        });
        await conn4.getVersion();
        console.log("✅ Basic auth works!\n");
        return;
    } catch(e) {
        console.log(`❌ Failed: ${e.message}\n`);
    }
    
    console.log("❌ All auth methods failed.");
    console.log("\n📧 Please check with SolInfra support:");
    console.log("   - What is the correct authentication format?");
    console.log("   - Is your API key active?");
    console.log("   - Do you need to whitelist your IP?");
}

testAuthMethods();
