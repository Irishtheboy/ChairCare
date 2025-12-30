#!/usr/bin/env node

/**
 * Deploy Firestore indexes
 * Usage: node scripts/deploy-indexes.js
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔥 Deploying Firestore indexes...');

try {
  // Check if firestore.indexes.json exists
  const indexesPath = path.join(process.cwd(), 'firestore.indexes.json');
  if (!fs.existsSync(indexesPath)) {
    console.error('❌ firestore.indexes.json not found');
    process.exit(1);
  }

  // Read and validate the indexes file
  const indexesContent = fs.readFileSync(indexesPath, 'utf8');
  const indexes = JSON.parse(indexesContent);
  
  console.log(`📋 Found ${indexes.indexes.length} indexes to deploy`);
  
  // Deploy indexes
  execSync('firebase deploy --only firestore:indexes', { 
    stdio: 'inherit',
    cwd: process.cwd()
  });
  
  console.log('✅ Firestore indexes deployed successfully!');
  console.log('');
  console.log('📝 Note: It may take a few minutes for indexes to build in Firebase Console');
  console.log('🔗 Check status: https://console.firebase.google.com/project/chairecaredemo/firestore/indexes');
  
} catch (error) {
  console.error('❌ Error deploying indexes:', error.message);
  process.exit(1);
}