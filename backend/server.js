const express = require('express');
const cors = require('cors');
const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore, GeoPoint } = require('firebase-admin/firestore');

const app = express();
const port = process.env.PORT || 3001;

// Load Firebase service account from environment or file
let serviceAccount;
if (process.env.FIREBASE_SERVICE_ACCOUNT) {
  // In production, parse from environment variable
  serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
} else {
  // In development, load from file
  serviceAccount = require('./serviceAccountKey.json');
}

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = process.env.ALLOWED_ORIGINS
      ? process.env.ALLOWED_ORIGINS.split(',')
      : ['http://localhost:3000'];

    // Allow requests with no origin (like mobile apps or Postman)
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
};

// Middleware
app.use(cors(corsOptions));
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

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy', timestamp: new Date().toISOString() });
});

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

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  if (err.message === 'Not allowed by CORS') {
    res.status(403).json({ error: 'CORS policy violation' });
  } else {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
