const express = require('express');
const { initializeApp, applicationDefault } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const cors = require('cors');

const app = express();
const port = 3001; // Choose a different port than your React app

// Initialize Firebase Admin
initializeApp({
    credential: applicationDefault(),
});

const db = getFirestore();

// Middleware
app.use(cors());
app.use(express.json());

// API endpoint to get nannies within proximity
app.get('/api/nannies', async (req, res) => {
    const { lat, lng, radius } = req.query;
    const proximity = parseFloat(radius) || 20; // Default to 20 miles if radius is not provided

    try {
        const geofirestore = require('geofirestore').GeoFirestore;
        const geoCollection = new geofirestore(db.collection('nannies'));

        const query = geoCollection.near({
            center: new firebase.firestore.GeoPoint(parseFloat(lat), parseFloat(lng)),
            radius: proximity,
        });

        const nanniesSnapshot = await query.get();
        const nannies = nanniesSnapshot.docs.map(doc => doc.data());
        res.json(nannies);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch nannies' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});