const { Connection, LAMPORTS_PER_SOL, PublicKey } = require('@solana/web3.js');
const fs = require('fs');
const { rpcUrl, apiKey } = require('./private-keys.js');

async function checkAndFund() {
    const fullUrl = `${rpcUrl}?api_key=${apiKey}`;
    const connection = new Connection(fullUrl);
    
    const walletData = JSON.parse(fs.readFileSync('my-wallet.json'));
    const publicKey = new PublicKey(walletData.publicKey);
    
    console.log("Wallet:", publicKey.toString());
    
    // Check balance
    let balance = await connection.getBalance(publicKey);
    console.log(`Current balance: ${balance / 1e9} SOL`);
    
    if (balance < 0.01 * 1e9) {
        console.log("\n⚠️ Low balance! Requesting airdrop...");
        
        try {
            // Try SolInfra airdrop
            const sig = await connection.requestAirdrop(publicKey, 2 * LAMPORTS_PER_SOL);
            await connection.confirmTransaction(sig);
            
            balance = await connection.getBalance(publicKey);
            console.log(`✅ New balance: ${balance / 1e9} SOL`);
        } catch (e) {
            console.log("❌ Airdrop failed via RPC.");
            console.log("\nUse web faucet instead:");
            console.log("1. Go to: https://faucet.solana.com/");
            console.log("2. Paste:", publicKey.toString());
            console.log("3. Click 'Request Airdrop'");
        }
    } else {
        console.log("\n✅ Sufficient balance!");
    }
}

checkAndFund();
