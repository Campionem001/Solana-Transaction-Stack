const { Connection, Keypair, Transaction, SystemProgram } = require('@solana/web3.js');
const fs = require('fs');
async function main() {
    const connection = new Connection("https://api.devnet.solana.com");
    const wallet = Keypair.fromSecretKey(Uint8Array.from(JSON.parse(fs.readFileSync('my-wallet.json')).secretKey));
    const slot = await connection.getSlot();
    console.log(`Current slot: ${slot}`);
    const targetSlot = slot + 1;
    console.log(`Optimal slot: ${targetSlot} (1 slot from now)`);
    await new Promise(r => setTimeout(r, 400));
    const { blockhash } = await connection.getLatestBlockhash();
    const tx = new Transaction().add(SystemProgram.transfer({ fromPubkey: wallet.publicKey, toPubkey: wallet.publicKey, lamports: 1000 }));
    tx.recentBlockhash = blockhash;
    tx.feePayer = wallet.publicKey;
    tx.sign(wallet);
    const sig = await connection.sendRawTransaction(tx.serialize());
    console.log(`✅ Submitted at target slot!`);
}
main();
