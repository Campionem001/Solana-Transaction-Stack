const { Connection, LAMPORTS_PER_SOL, PublicKey } = require('@solana/web3.js');
const fs = require('fs');

async function checkPublic() {
    // Use public devnet RPC (more reliable for balance checks)
    const connection = new Connection("https://api.devnet.solana.com");
    
    const walletData = JSON.parse(fs.readFileSync('my-wallet.json'));
    const publicKey = new PublicKey(walletData.publicKey);
    
    console.log("Wallet:", publicKey.toString());
    
    const balance = await connection.getBalance(publicKey);
    console.log(`Balance (public RPC): ${balance / 1e9} SOL`);
    
    if (balance === 0) {
        console.log("\n⚠️ Still 0 SOL. Let's try a different faucet.");
        console.log("\nAlternative faucets:");
        console.log("1. https://solfaucet.com/");
        console.log("2. https://faucet.solana.com/ (try again)");
        console.log("3. Or wait 2-3 minutes - devnet is slow sometimes");
    }
}

checkPublic();
