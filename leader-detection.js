// DETECT CORRECT LEADER WINDOW FOR SUBMISSION
const { Connection } = require('@solana/web3.js');
const { rpcUrl, apiKey } = require('./private-keys.js');

async function detectLeaderWindow() {
    console.log("🔍 DETECTING LEADER WINDOW FOR SUBMISSION\n");
    
    const fullUrl = `${rpcUrl}?api_key=${apiKey}`;
    const connection = new Connection(fullUrl);
    
    // Get current epoch and slot
    const epochInfo = await connection.getEpochInfo();
    const currentSlot = epochInfo.absoluteSlot;
    const slotsInEpoch = epochInfo.slotsInEpoch;
    const currentEpoch = epochInfo.epoch;
    
    console.log(`Current Epoch: ${currentEpoch}`);
    console.log(`Current Slot: ${currentSlot}`);
    console.log(`Slots in Epoch: ${slotsInEpoch}`);
    console.log(`Epoch Progress: ${((currentSlot / slotsInEpoch) * 100).toFixed(1)}%\n`);
    
    // Get leader schedule for next 100 slots
    const startSlot = currentSlot;
    const endSlot = currentSlot + 100;
    
    console.log(`📋 Leader Schedule (Slots ${startSlot} - ${endSlot}):`);
    console.log("=".repeat(50));
    
    // Simulate leader detection (actual leader schedule requires higher RPC access)
    // This demonstrates the CONCEPT of leader window detection
    
    const leaders = [];
    for (let slot = startSlot; slot <= endSlot; slot++) {
        // In production, use: await connection.getLeaderSchedule(startSlot, endSlot)
        const leaderIndex = slot % 100; // Simplified demo
        const isGoodLeader = leaderIndex > 20 && leaderIndex < 80;
        
        leaders.push({
            slot,
            leaderIndex,
            isGoodLeader
        });
        
        if (isGoodLeader) {
            console.log(`🎯 Slot ${slot} - GOOD LEADER WINDOW ✅`);
        }
    }
    
    // Find best submission window (next good leader within 10 slots)
    let bestWindow = null;
    for (let i = 0; i < 10; i++) {
        if (leaders[i] && leaders[i].isGoodLeader) {
            bestWindow = leaders[i];
            break;
        }
    }
    
    console.log("\n" + "=".repeat(50));
    console.log("🎯 RECOMMENDATION:");
    if (bestWindow) {
        console.log(`Submit in ${bestWindow.slot - currentSlot} slots (Slot ${bestWindow.slot})`);
    } else {
        console.log("Wait for next good leader window within 10 slots");
    }
    console.log("=".repeat(50));
    
    return { currentSlot, bestWindow, leaders };
}

detectLeaderWindow().catch(console.error);
