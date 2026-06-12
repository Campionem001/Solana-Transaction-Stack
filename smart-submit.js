// SMART SUBMIT - Waits for optimal leader window
const { Connection, Keypair, Transaction, SystemProgram } = require('@solana/web3.js');
const fs = require('fs');

async function findOptimalLeaderWindow() {
    const connection = new Connection("https://api.devnet.solana.com");
    const currentSlot = await connection.getSlot();
    
    // Find next 10 slots to find optimal submission window
    console.log(`Current slot: ${currentSlot}`);
    console.log("Scanning next 10 slots for optimal submission window...\n");
    
    // In production, you'd fetch actual leader schedule
    // For demo, we simulate leader quality
    const bestSlots = [];
    
    for (let i = 1; i <= 10; i++) {
        const targetSlot = currentSlot + i;
        // Simulate leader quality (in reality, fetch from leader schedule)
        const isGoodWindow = (targetSlot % 4 !== 0); // Simple heuristic
        
        if (isGoodWindow) {
            bestSlots.push(targetSlot);
            console.log(`🎯 Slot ${targetSlot} - GOOD window (${i} slots from now)`);
        } else {
            console.log(`   Slot ${targetSlot} - skip (not optimal)`);
        }
    }
    
    if (bestSlots.length > 0) {
        const waitSlots = bestSlots[0] - currentSlot;
        const waitTimeMs = waitSlots * 400; // ~400ms per slot
        
        console.log(`\n📊 RECOMMENDATION:`);
        console.log(`   Wait ${waitSlots} slots (~${waitTimeMs}ms) for slot ${bestSlots[0]}`);
        console.log(`   Then submit transaction for best landing probability`);
        
        return { waitMs: waitTimeMs, targetSlot: bestSlots[0] };
    }
    
    return { waitMs: 0, targetSlot: currentSlot + 1 };
}

async function smartSubmit() {
    console.log("🚀 SMART SUBMISSION - Leader Window Optimized\n");
    
    // Find best window
    const { waitMs, targetSlot } = await findOptimalLeaderWindow();
    
    if (waitMs > 0) {
        console.log(`\n⏳ Waiting ${waitMs}ms for optimal leader window...`);
        await new Promise(r => setTimeout(r, waitMs));
    }
    
    console.log(`\n📤 Submitting at slot ${targetSlot}...`);
    
    // Load and send transaction
    const walletData = JSON.parse(fs.readFileSync('my-wallet.json'));
    const secretKey = Uint8Array.from(walletData.secretKey);
    const wallet = Keypair.fromSecretKey(secretKey);
    
    const connection = new Connection("https://api.devnet.solana.com");
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
    console.log(`✅ Submitted! Signature: ${signature.substring(0, 40)}...`);
    
    // Confirm via stream
    connection.onSignature(signature, () => {
        console.log(`✅ Confirmed at optimal slot!`);
        process.exit(0);
    }, 'confirmed');
}

smartSubmit();
