#!/usr/bin/env node

/**
 * Chair ClientId Migration Script
 * 
 * This script fixes the field name mismatch where chairs were created with 'userId' 
 * but client queries look for 'clientId'. It updates all existing chairs to use 
 * the correct 'clientId' field.
 */

const admin = require('firebase-admin');
const path = require('path');

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  // You'll need to download your service account key from Firebase Console
  // and place it in the project root as 'firebase-service-account.json'
  const serviceAccount = require('../firebase-service-account.json');
  
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: 'chairecaredemo'
  });
}

const db = admin.firestore();

async function migrateChairFields() {
  console.log('🔄 Starting Chair ClientId Migration...');
  console.log('=====================================\n');

  try {
    // Get all chairs from the collection
    const chairsSnapshot = await db.collection('chairs').get();
    
    if (chairsSnapshot.empty) {
      console.log('ℹ️  No chairs found in the database.');
      return;
    }

    console.log(`📋 Found ${chairsSnapshot.size} chairs to check...`);
    
    let migratedCount = 0;
    let alreadyCorrectCount = 0;
    const batch = db.batch();

    chairsSnapshot.forEach((doc) => {
      const data = doc.data();
      
      // Check if chair has userId but not clientId
      if (data.userId && !data.clientId) {
        console.log(`🔧 Migrating chair ${doc.id}: ${data.chairNumber || 'Unknown'}`);
        
        // Update the document to use clientId instead of userId
        const chairRef = db.collection('chairs').doc(doc.id);
        batch.update(chairRef, {
          clientId: data.userId,
          userId: admin.firestore.FieldValue.delete() // Remove the old userId field
        });
        
        migratedCount++;
      } else if (data.clientId) {
        console.log(`✅ Chair ${doc.id} already has correct clientId field`);
        alreadyCorrectCount++;
      } else {
        console.log(`⚠️  Chair ${doc.id} has neither userId nor clientId - needs manual review`);
      }
    });

    if (migratedCount > 0) {
      console.log(`\n🚀 Committing ${migratedCount} chair updates...`);
      await batch.commit();
      console.log('✅ Migration completed successfully!');
    } else {
      console.log('\n✅ No chairs needed migration - all are already correct!');
    }

    console.log('\n📊 Migration Summary:');
    console.log(`   • Migrated: ${migratedCount} chairs`);
    console.log(`   • Already correct: ${alreadyCorrectCount} chairs`);
    console.log(`   • Total processed: ${chairsSnapshot.size} chairs`);

  } catch (error) {
    console.error('\n❌ Error during migration:', error);
    process.exit(1);
  }
}

// Run the migration
migrateChairFields()
  .then(() => {
    console.log('\n🎉 Migration completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Migration failed:', error);
    process.exit(1);
  });