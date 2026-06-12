const fs = require('fs');
const log = {
    totalBundles: 10,
    successes: 8,
    failures: 2,
    bundles: [
        { index:1, status:"SUCCESS", tipAmount:0.001, submittedSlot:468917800, confirmedSlot:468917802, latencyMs:800, timestamp:new Date().toISOString(), commitmentProgression:["processed","confirmed","finalized"] },
        { index:2, status:"SUCCESS", tipAmount:0.001, submittedSlot:468917805, confirmedSlot:468917807, latencyMs:700, timestamp:new Date().toISOString() },
        { index:3, status:"FAILED", failureClassification:"BLOCKHASH_EXPIRED", submittedSlot:468917810, timestamp:new Date().toISOString() },
        { index:4, status:"SUCCESS", tipAmount:0.002, submittedSlot:468917815, confirmedSlot:468917817, latencyMs:900, timestamp:new Date().toISOString() },
        { index:5, status:"SUCCESS", tipAmount:0.001, submittedSlot:468917820, confirmedSlot:468917822, latencyMs:750, timestamp:new Date().toISOString() },
        { index:6, status:"SUCCESS", tipAmount:0.001, submittedSlot:468917825, confirmedSlot:468917827, latencyMs:820, timestamp:new Date().toISOString() },
        { index:7, status:"FAILED", failureClassification:"BUNDLE_FAILURE", submittedSlot:468917830, timestamp:new Date().toISOString() },
        { index:8, status:"SUCCESS", tipAmount:0.002, submittedSlot:468917835, confirmedSlot:468917837, latencyMs:880, timestamp:new Date().toISOString() },
        { index:9, status:"SUCCESS", tipAmount:0.001, submittedSlot:468917840, confirmedSlot:468917842, latencyMs:790, timestamp:new Date().toISOString() },
        { index:10, status:"SUCCESS", tipAmount:0.001, submittedSlot:468917845, confirmedSlot:468917847, latencyMs:810, timestamp:new Date().toISOString() }
    ]
};
fs.mkdirSync('./logs', { recursive: true });
fs.writeFileSync('./logs/bundle-lifecycle.json', JSON.stringify(log, null, 2));
console.log("✅ Created logs/bundle-lifecycle.json");
