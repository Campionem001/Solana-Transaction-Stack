const { Connection, Keypair, Transaction, SystemProgram, LAMPORTS_PER_SOL, PublicKey } = require('@solana/web3.js');
const fs = require('fs');

async function sendFirstTransaction() {
    // Load your wallet
    const walletData = JSON.parse(fs.readFileSync('my-wallet.json'));
    const secretKey = Uint8Array.from(walletData.secretKey);
    const fromWallet = Keypair.fromSecretKey(secretKey);
    
    const connection = new Connection("https://api.devnet.solana.com");
    
    console.log("🚀 STARTING FIRST TRANSACTION!");
    console.log("From:", fromWallet.publicKey.toString());
    console.log("To (same wallet - self send):", fromWallet.publicKey.toString());
    
    // Check balance
    const balance = await connection.getBalance(fromWallet.publicKey);
    console.log(`💰 Balance: ${balance / LAMPORTS_PER_SOL} SOL`);
    
    // Get fresh blockhash
    const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
    console.log(`📦 Blockhash: ${blockhash}`);
    
    // Create transaction (send 0.001 SOL to yourself)
    const transaction = new Transaction().add(
        SystemProgram.transfer({
            fromPubkey: fromWallet.publicKey,
            toPubkey: fromWallet.publicKey,  // Sending to yourself
            lamports: 1000,  // 0.000001 SOL (very tiny)
        })
    );
    
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = fromWallet.publicKey;
    
    // Sign the transaction
    transaction.sign(fromWallet);
    
    // Send it!
    const signature = await connection.sendRawTransaction(transaction.serialize());
    console.log(`\n✅ TRANSACTION SENT!`);
    console.log(`🔗 Signature: ${signature}`);
    
    // Wait for confirmation
    console.log(`\n⏳ Waiting for confirmation...`);
    await connection.confirmTransaction({
        signature,
        blockhash,
        lastValidBlockHeight
    });
    
    console.log(`🎉 TRANSACTION CONFIRMED ON SOLANA!`);
    console.log(`\n📊 View on explorer:`);
    console.log(`https://explorer.solana.com/tx/${signature}?cluster=devnet`);
}

sendFirstTransaction().catch(console.error);
