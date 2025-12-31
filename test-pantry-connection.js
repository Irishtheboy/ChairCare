// Simple test to verify Pantry Cloud Storage connection
const PANTRY_ID = '2a62dd90-4a3a-417e-a262-c6a54d5f8aef';
const BASE_URL = 'https://getpantry.cloud/apiv1/pantry';

async function testPantryConnection() {
  console.log('Testing Pantry Cloud Storage connection...');
  console.log(`Pantry ID: ${PANTRY_ID}`);
  
  try {
    // Test basic connection with a simple POST
    const testData = {
      test: true,
      timestamp: new Date().toISOString(),
      message: 'Connection test from Chair Care app'
    };
    
    const response = await fetch(`${BASE_URL}/${PANTRY_ID}/basket/connectionTest`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData),
    });
    
    if (response.ok) {
      console.log('✅ SUCCESS: Pantry connection is working!');
      console.log(`Response status: ${response.status}`);
      
      // Test retrieving the data
      const getResponse = await fetch(`${BASE_URL}/${PANTRY_ID}/basket/connectionTest`);
      if (getResponse.ok) {
        const data = await getResponse.json();
        console.log('✅ SUCCESS: Data retrieval working!');
        console.log('Retrieved data:', data);
      } else {
        console.log('⚠️  WARNING: Could not retrieve data');
      }
      
    } else {
      console.log(`❌ ERROR: Connection failed with status ${response.status}`);
      const errorText = await response.text();
      console.log('Error details:', errorText);
    }
    
  } catch (error) {
    console.log('❌ ERROR: Connection test failed');
    console.log('Error:', error.message);
  }
}

// Run the test
testPantryConnection();