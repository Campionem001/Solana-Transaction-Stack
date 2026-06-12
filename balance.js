const { Connection, LAMPORTS_PER_SOL, PublicKey } = require('@solana/web3.js');
const fs = require('fs');

async function checkBalance() {
    const walletData = JSON.parse(fs.readFileSync('my-wallet.json'));
    const publicKey = new PublicKey(walletData.publicKey);
    const connection = new Connection("https://api.devnet.solana.com");
    
    const balance = await connection.getBalance(publicKey);
    console.log("💰 Your balance:", balance / LAMPORTS_PER_SOL, "SOL");
}

checkBalance();
