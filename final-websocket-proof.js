const { Connection } = require('@solana/web3.js');
async function monitor() {
    const connection = new Connection("https://api.devnet.solana.com", { wsEndpoint: "wss://api.devnet.solana.com/" });
    console.log("🎧 Monitoring live slots...\n");
    let count = 0;
    connection.onSlotChange((slot) => {
        count++;
        console.log(`🎰 Slot ${slot.slot}`);
        if (slot.slot % 10 > 7) console.log(`   👑 GOOD LEADER WINDOW`);
    });
    setTimeout(() => console.log(`\n✅ ${count} slots received`), 30000);
}
monitor();
