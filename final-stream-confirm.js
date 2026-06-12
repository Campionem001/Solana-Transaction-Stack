const { Connection, Keypair, Transaction, SystemProgram } = require('@solana/web3.js');
const fs = require('fs');

async function streamConfirm() {
    const connection = new Connection("https://api.devnet.solana.com");
    const walletData = JSON.parse(fs.readFileSync('my-wallet.json'));
    const secretKey = Uint8Array.from(walletData.secretKey);
    const wallet = Keypair.fromSecretKey(secretKey);
    
    const { blockhash } = await connection.getLatestBlockhash();
    const tx = new Transaction().add(
        SystemProgram.transfer({ fromPubkey: wallet.publicKey, toPubkey: wallet.publicKey, lamports: 1000 })
    );
    tx.recentBlockhash = blockhash;
    tx.feePayer = wallet.publicKey;
    tx.sign(wallet);
    const signature = await connection.sendRawTransaction(tx.serialize());
    console.log(`📤 Sent: ${signature.substring(0, 40)}...`);
    
    // WebSocket stream confirmation
    connection.onSignature(signature, (result) => {
        console.log(`✅ STREAM CONFIRMATION: ${result.err ? 'FAILED' : 'SUCCESS'}`);
        process.exit(0);
    }, 'confirmed');
    console.log("🎧 Waiting for stream confirmation...");
}
streamConfirm();
