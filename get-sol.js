const { Connection, LAMPORTS_PER_SOL, PublicKey } = require('@solana/web3.js');
const fs = require('fs');

async function getFreeSol() {
    // Load your wallet
    const walletData = JSON.parse(fs.readFileSync('my-wallet.json'));
    const publicKey = new PublicKey(walletData.publicKey);
    
    const connection = new Connection("https://api.devnet.solana.com");
    
    console.log("💰 Requesting FREE Solana...");
    console.log("Address:", publicKey.toString());
    
    // Request 2 SOL (free on devnet)
    const signature = await connection.requestAirdrop(
        publicKey,
        2 * LAMPORTS_PER_SOL
    );
    
    console.log("✅ Airdrop requested!");
    console.log("Transaction:", signature);
    
    // Wait for confirmation
    await connection.confirmTransaction(signature);
    
    // Check balance
    const balance = await connection.getBalance(publicKey);
    console.log(`💎 New balance: ${balance / LAMPORTS_PER_SOL} SOL`);
}

getFreeSol();
