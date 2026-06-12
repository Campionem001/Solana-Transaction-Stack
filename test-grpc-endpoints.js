const { apiKey } = require('./private-keys.js');

// Possible SolInfra gRPC endpoints to try
const endpoints = [
    "fra.grpc.solinfra.dev:443",
    "grpc.solinfra.dev:443", 
    "fra.rpc.solinfra.dev:443",
    "api.solinfra.dev:443"
];

console.log("🔍 Testing gRPC endpoints...\n");

async function testEndpoint(endpoint) {
    const grpc = require('@grpc/grpc-js');
    
    return new Promise((resolve) => {
        console.log(`Testing: ${endpoint}`);
        
        const deadline = new Date();
        deadline.setSeconds(deadline.getSeconds() + 3);
        
        const conn = new grpc.Client(endpoint, grpc.credentials.createSsl(), {
            'grpc.keepalive_time_ms': 3000
        });
        
        const deadlineReached = setTimeout(() => {
            console.log(`   ❌ Timeout\n`);
            conn.close();
            resolve(false);
        }, 3000);
        
        conn.waitForReady(deadline, (err) => {
            clearTimeout(deadlineReached);
            if (!err) {
                console.log(`   ✅ CONNECTED!\n`);
                conn.close();
                resolve(true);
            } else {
                console.log(`   ❌ Failed\n`);
                conn.close();
                resolve(false);
            }
        });
    });
}

async function run() {
    for (const endpoint of endpoints) {
        const success = await testEndpoint(endpoint);
        if (success) {
            console.log(`\n🎯 WORKING ENDPOINT: ${endpoint}`);
            console.log(`\nAdd this to your code: GRPC_ENDPOINT = "${endpoint}"`);
            return;
        }
    }
    console.log("\n❌ No gRPC endpoints worked.");
    console.log("Please check with SolInfra for their correct gRPC endpoint.");
}

run();
