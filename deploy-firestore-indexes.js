#!/usr/bin/env node

/**
 * Firebase Firestore Index Deployment Script
 * 
 * This script helps deploy the required Firestore indexes for the Chair Care application.
 * Run this script to automatically create all necessary composite indexes.
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔥 Firebase Firestore Index Deployment');
console.log('=====================================\n');

// Check if Firebase CLI is installed
try {
  execSync('firebase --version', { stdio: 'pipe' });
  console.log('✅ Firebase CLI is installed');
} catch (error) {
  console.error('❌ Firebase CLI is not installed. Please install it first:');
  console.error('   npm install -g firebase-tools');
  process.exit(1);
}

// Check if firebase.json exists
if (!fs.existsSync('firebase.json')) {
  console.error('❌ firebase.json not found. Please run this script from the project root.');
  process.exit(1);
}

// Check if firestore.indexes.json exists
if (!fs.existsSync('firestore.indexes.json')) {
  console.error('❌ firestore.indexes.json not found. Please ensure the file exists.');
  process.exit(1);
}

console.log('✅ Configuration files found');

// Read and display the indexes that will be deployed
try {
  const indexesContent = fs.readFileSync('firestore.indexes.json', 'utf8');
  const indexes = JSON.parse(indexesContent);
  
  console.log(`\n📋 Found ${indexes.indexes.length} indexes to deploy:`);
  indexes.indexes.forEach((index, i) => {
    const fields = index.fields.map(f => `${f.fieldPath} (${f.order})`).join(', ');
    console.log(`   ${i + 1}. ${index.collectionGroup}: ${fields}`);
  });
  
} catch (error) {
  console.error('❌ Error reading firestore.indexes.json:', error.message);
  process.exit(1);
}

console.log('\n🚀 Deploying Firestore indexes...');
console.log('This may take a few minutes...\n');

try {
  // Deploy only the Firestore indexes
  execSync('firebase deploy --only firestore:indexes', { 
    stdio: 'inherit',
    cwd: process.cwd()
  });
  
  console.log('\n✅ Firestore indexes deployed successfully!');
  console.log('\n📝 Next steps:');
  console.log('   1. Wait for indexes to build (this can take several minutes)');
  console.log('   2. Check index status in Firebase Console');
  console.log('   3. Test your application queries');
  console.log('\n🔗 Monitor index building progress:');
  console.log('   https://console.firebase.google.com/project/chairecaredemo/firestore/indexes');
  
} catch (error) {
  console.error('\n❌ Error deploying indexes:', error.message);
  console.error('\n🔧 Troubleshooting:');
  console.error('   1. Make sure you are logged in: firebase login');
  console.error('   2. Make sure you have the correct project: firebase use chairecaredemo');
  console.error('   3. Check your Firebase project permissions');
  process.exit(1);
}