const { Connection, LAMPORTS_PER_SOL, PublicKey } = require('@solana/web3.js');
const fs = require('fs');

async function getFreeSol() {
    const walletData = JSON.parse(fs.readFileSync('my-wallet.json'));
    const publicKey = new PublicKey(walletData.publicKey);
    const connection = new Connection("https://api.devnet.solana.com");
    
    console.log("💰 Requesting FREE Solana...");
    console.log("Address:", publicKey.toString());
    
    // Try smaller amounts (0.5 SOL first)
    const amounts = [0.5, 0.5, 1.0]; // Total 2 SOL in pieces
    
    for (const amount of amounts) {
        try {
            console.log(`Requesting ${amount} SOL...`);
            const signature = await connection.requestAirdrop(
                publicKey,
                amount * LAMPORTS_PER_SOL
            );
            await connection.confirmTransaction(signature);
            console.log(`✅ Received ${amount} SOL`);
        } catch (e) {
            console.log(`Failed for ${amount} SOL:`, e.message);
        }
    }
    
    const balance = await connection.getBalance(publicKey);
    console.log(`\n💎 Total balance: ${balance / LAMPORTS_PER_SOL} SOL`);
}

getFreeSol();
