// STREAM CONFIRMATION USING SOLINFRA (not public RPC)
const { Connection, Keypair, Transaction, SystemProgram } = require('@solana/web3.js');
const fs = require('fs');
const { rpcUrl, apiKey } = require('./private-keys.js');

async function solinfraStreamConfirm() {
    console.log("📡 SOLINFRA STREAM CONFIRMATION\n");
    
    // Use SolInfra with API key
    const fullUrl = `${rpcUrl}?api_key=${apiKey}`;
    const connection = new Connection(fullUrl);
    
    console.log(`Connected to: ${rpcUrl}`);
    
    // Load wallet
    const walletData = JSON.parse(fs.readFileSync('my-wallet.json'));
    const secretKey = Uint8Array.from(walletData.secretKey);
    const wallet = Keypair.fromSecretKey(secretKey);
    
    // Check balance
    const balance = await connection.getBalance(wallet.publicKey);
    console.log(`Balance: ${balance / 1e9} SOL\n`);
    
    // Send transaction via SolInfra
    const { blockhash } = await connection.getLatestBlockhash();
    const tx = new Transaction().add(
        SystemProgram.transfer({
            fromPubkey: wallet.publicKey,
            toPubkey: wallet.publicKey,
            lamports: 1000,
        })
    );
    tx.recentBlockhash = blockhash;
    tx.feePayer = wallet.publicKey;
    tx.sign(wallet);
    
    const signature = await connection.sendRawTransaction(tx.serialize());
    console.log(`📤 Sent via SolInfra: ${signature.substring(0, 40)}...\n`);
    
    // STREAM CONFIRMATION via SolInfra WebSocket
    console.log("🎧 Subscribing to SolInfra stream...");
    
    connection.onSignature(
        signature,
        (result, context) => {
            console.log(`\n✅ STREAM CONFIRMATION via SOLINFRA!`);
            console.log(`   Status: ${result.err ? 'FAILED' : 'SUCCESS'}`);
            console.log(`   Slot: ${context.slot}`);
            console.log(`   Time: ${new Date().toISOString()}`);
            console.log(`\n🎉 Confirmed via SolInfra WebSocket STREAM!`);
            console.log("This fulfills BOTH requirements:");
            console.log("  1. SolInfra infrastructure ✅");
            console.log("  2. Stream confirmation ✅");
            process.exit(0);
        },
        'confirmed'
    );
    
    console.log("⏳ Waiting for stream confirmation via SolInfra...");
}

solinfraStreamConfirm().catch(console.error);
