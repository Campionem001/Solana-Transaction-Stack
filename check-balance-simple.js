const { Connection, LAMPORTS_PER_SOL, PublicKey } = require('@solana/web3.js');
const fs = require('fs');

async function checkBalance() {
    // Use public RPC for balance check
    const connection = new Connection("https://api.devnet.solana.com");
    
    const walletData = JSON.parse(fs.readFileSync('my-wallet.json'));
    const publicKey = new PublicKey(walletData.publicKey);
    
    console.log("Wallet:", publicKey.toString());
    
    try {
        const balance = await connection.getBalance(publicKey);
        console.log(`💰 Balance: ${balance / LAMPORTS_PER_SOL} SOL`);
        
        if (balance < 1000000) {
            console.log("\n⚠️ Low balance! Need more SOL.");
            console.log("Go to: https://faucet.solana.com/");
            console.log("Paste your address:", publicKey.toString());
        } else {
            console.log("\n✅ Sufficient balance!");
        }
    } catch (e) {
        console.log("Error:", e.message);
    }
}

checkBalance();
