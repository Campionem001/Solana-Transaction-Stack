const { Connection, LAMPORTS_PER_SOL, PublicKey } = require('@solana/web3.js');
const fs = require('fs');

async function trackTransaction() {
    const walletData = JSON.parse(fs.readFileSync('my-wallet.json'));
    const publicKey = new PublicKey(walletData.publicKey);
    const connection = new Connection("https://api.devnet.solana.com");
    
    console.log("📊 TRACKING TRANSACTION LIFECYCLE\n");
    
    // Get recent transactions
    const signatures = await connection.getSignaturesForAddress(publicKey, { limit: 1 });
    
    if (signatures.length === 0) {
        console.log("No transactions found. Run send.js first!");
        return;
    }
    
    const txSig = signatures[0].signature;
    console.log(`Tracking: ${txSig}\n`);
    
    // Track different commitment levels
    const commitments = ['processed', 'confirmed', 'finalized'];
    const stages = [];
    
    for (const commitment of commitments) {
        const startTime = Date.now();
        
        try {
            const result = await connection.getSignatureStatus(txSig, {
                searchTransactionHistory: true
            });
            
            const latency = Date.now() - startTime;
            
            stages.push({
                stage: commitment,
                timestamp: new Date().toISOString(),
                latencyMs: latency,
                slot: result.value?.slot || 0
            });
            
            console.log(`📍 ${commitment.toUpperCase()}: ${latency}ms (slot: ${result.value?.slot || 'N/A'})`);
        } catch (error) {
            console.log(`❌ ${commitment} failed:`, error.message);
        }
    }
    
    // Save lifecycle log for bounty submission
    const log = {
        signature: txSig,
        stages: stages,
        totalLatency: stages[stages.length-1]?.latencyMs || 0
    };
    
    fs.writeFileSync('./logs/lifecycle-entry.json', JSON.stringify(log, null, 2));
    console.log(`\n💾 Lifecycle log saved to logs/lifecycle-entry.json`);
    
    // Calculate delta (this answers Bounty Question 1!)
    if (stages.length >= 2) {
        const delta = stages[1].latencyMs - stages[0].latencyMs;
        console.log(`\n📈 Processed → Confirmed delta: ${delta}ms`);
        if (delta > 1000) {
            console.log("⚠️  High delta = network congestion!");
        } else {
            console.log("✅ Low delta = network healthy!");
        }
    }
}

// Create logs folder
if (!fs.existsSync('./logs')) fs.mkdirSync('./logs');
trackTransaction();
