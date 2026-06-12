// SIMPLE SOLINFRA TEST
// Change the values below to match YOUR credentials

const YOUR_RPC_URL = "https://YOUR_USERNAME_HERE.sollinfra.com";
const YOUR_API_KEY = "YOUR_API_KEY_HERE";

console.log("=" .repeat(50));
console.log("SOLINFRA CONNECTION TEST");
console.log("=" .repeat(50));
console.log("RPC URL:", YOUR_RPC_URL);
console.log("API Key:", YOUR_API_KEY.substring(0, 10) + "...");
console.log("");

// Test with fetch (no complex libraries)
async function test() {
    console.log("📡 Sending test request...");
    
    try {
        const response = await fetch(YOUR_RPC_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${YOUR_API_KEY}`
            },
            body: JSON.stringify({
                jsonrpc: "2.0",
                id: 1,
                method: "getVersion",
                params: []
            })
        });
        
        console.log("Response status:", response.status);
        
        if (response.status === 200) {
            const data = await response.json();
            console.log("✅ SUCCESS!");
            console.log("Solana version:", data.result);
        } else if (response.status === 401) {
            console.log("❌ Auth Failed - Wrong API key format");
            console.log("\nTry changing Authorization to:");
            console.log('  "x-api-key": YOUR_API_KEY');
            console.log('  OR no auth at all');
        } else {
            const text = await response.text();
            console.log("Response:", text);
        }
        
    } catch (error) {
        console.log("❌ Connection failed:", error.message);
        console.log("\nPossible issues:");
        console.log("1. Wrong URL format");
        console.log("2. No internet");
        console.log("3. Need VPN (some regions blocked)");
    }
}

test();
