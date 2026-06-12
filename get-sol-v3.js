const { Connection, LAMPORTS_PER_SOL, PublicKey } = require('@solana/web3.js');
const fs = require('fs');

async function getFreeSol() {
    const walletData = JSON.parse(fs.readFileSync('my-wallet.json'));
    const publicKey = new PublicKey(walletData.publicKey);
    
    // Try different RPC endpoints
    const endpoints = [
        "https://api.devnet.solana.com",
        "https://devnet.solana.com",
        "https://solana-devnet.g.alchemy.com/v2/demo"
    ];
    
    for (const url of endpoints) {
        try {
            console.log(`\nTrying: ${url}`);
            const connection = new Connection(url);
            
            console.log(`Requesting 1 SOL...`);
            const signature = await connection.requestAirdrop(
                publicKey,
                1 * LAMPORTS_PER_SOL
            );
            await connection.confirmTransaction(signature);
            console.log(`✅ Success! Check balance:`);
            
            const balance = await connection.getBalance(publicKey);
            console.log(`💰 Balance: ${balance / LAMPORTS_PER_SOL} SOL`);
            return;
        } catch (e) {
            console.log(`Failed: ${e.message}`);
        }
    }
    console.log("\n❌ All endpoints failed. Let's try a faucet website instead.");
    console.log("Go to: https://faucet.solana.com/");
    console.log("Paste your address:", publicKey.toString());
}

getFreeSol();
