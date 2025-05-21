const { MongoClient } = require('mongodb');

// Your MongoDB connection string - this should be the one from your MongoDB Atlas dashboard
const uri = "mongodb+srv://damodark818:246813579daM%40@newsharks.xif4ym2.mongodb.net/?retryWrites=true&w=majority&appName=newsharks";

async function createCollections() {
  const client = new MongoClient(uri);

  try {
    // Connect to the MongoDB cluster
    await client.connect();
    console.log("Connected to MongoDB Atlas");

    // Get reference to the database
    const db = client.db('newsharks');
    
    // Create collections - even if they don't exist yet, this will initialize them
    await db.createCollection('users');
    console.log("Users collection created");
    
    await db.createCollection('pitches');
    console.log("Pitches collection created");
    
    await db.createCollection('messages');
    console.log("Messages collection created");
    
    await db.createCollection('offers');
    console.log("Offers collection created");
    
    // Add a sample document to each collection
    await db.collection('users').insertOne({
      name: 'Test User',
      email: 'test@example.com',
      role: 'admin',
      createdAt: new Date()
    });
    console.log("Added sample user");
    
    await db.collection('pitches').insertOne({
      title: 'Test Pitch',
      description: 'This is a test pitch',
      createdAt: new Date()
    });
    console.log("Added sample pitch");
    
    await db.collection('messages').insertOne({
      content: 'Test message',
      createdAt: new Date()
    });
    console.log("Added sample message");
    
    await db.collection('offers').insertOne({
      amount: 10000,
      equity: 10,
      createdAt: new Date()
    });
    console.log("Added sample offer");
    
    console.log("All collections created and sample data added!");
    
  } catch (err) {
    console.error("Error:", err);
  } finally {
    // Close the connection
    await client.close();
    console.log("MongoDB connection closed");
  }
}

createCollections().catch(console.error); 