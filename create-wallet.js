const { Keypair } = require('@solana/web3.js');
const fs = require('fs');

// Generate a new wallet
const wallet = Keypair.generate();

console.log("🎉 NEW WALLET CREATED!");
console.log("📤 Public Key (your address):", wallet.publicKey.toString());
console.log("🔐 Private Key (KEEP SECRET!):", wallet.secretKey);

// Save wallet to file (so you can use it again)
const walletData = {
    publicKey: wallet.publicKey.toString(),
    secretKey: Array.from(wallet.secretKey)
};

fs.writeFileSync('my-wallet.json', JSON.stringify(walletData));
console.log("\n💾 Wallet saved to my-wallet.json");
console.log("⚠️  NEVER share this file with anyone!");
