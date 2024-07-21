const express = require('express');
const cors = require('cors');
const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore, GeoPoint } = require('firebase-admin/firestore');
const serviceAccount = require('./serviceAccountKey.json'); // Path to your service account key

const app = express();
const port = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Firebase Admin
initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore();
const nanniesCollection = db.collection('nanny');

// Log contents of the nannies collection
async function logNanniesCollection() {
  const snapshot = await nanniesCollection.get();
  if (snapshot.empty) {
    console.log('No matching nannies in the collection.');
    return;
  }

  snapshot.forEach(doc => {
    console.log('Nanny document:', doc.id, doc.data());
  });
}

logNanniesCollection(); // Log the contents on startup

// API endpoint to get nannies within proximity
app.get('/api/nannies', async (req, res) => {
  const { lat, lng, radius } = req.query;
  const proximity = parseFloat(radius) || 20; // Default to 20 miles if radius is not provided

  try {
    console.log('Received request:', req.query); // Log the request query parameters

    if (!lat || !lng) {
      throw new Error('Latitude and longitude are required');
    }

    console.log(`Fetching nannies near (${lat}, ${lng}) within ${proximity} miles`);

    // Calculate boundaries for latitude and longitude
    const R = 6371; // Earth's radius in kilometers
    const maxLat = parseFloat(lat) + (proximity / R) * (180 / Math.PI);
    const minLat = parseFloat(lat) - (proximity / R) * (180 / Math.PI);
    const maxLng = parseFloat(lng) + (proximity / R) * (180 / Math.PI) / Math.cos(parseFloat(lat) * Math.PI / 180);
    const minLng = parseFloat(lng) - (proximity / R) * (180 / Math.PI) / Math.cos(parseFloat(lat) * Math.PI / 180);

    console.log(`Latitude bounds: ${minLat} to ${maxLat}`);
    console.log(`Longitude bounds: ${minLng} to ${maxLng}`);

    const querySnapshot = await nanniesCollection
      .where('location', '>=', new GeoPoint(minLat, minLng))
      .where('location', '<=', new GeoPoint(maxLat, maxLng))
      .get();

    if (querySnapshot.empty) {
      console.log('No matching nannies found');
      return res.json([]);
    }

    const nannies = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      console.log('Found nanny:', data);
      return data;
    });

    console.log(`Found ${nannies.length} nannies`);
    res.json(nannies);
  } catch (error) {
    console.error('Error fetching nannies:', error);
    res.status(500).json({ error: 'Failed to fetch nannies', details: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
