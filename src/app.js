import express from 'express';
import methodOverride from 'method-override';
import cors from 'cors';
import route from './routes/index.js';

const app = express();

// Add middleware
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));

route(app)


// app.get('/restaurants', async (req, res) => {
//     const collectionRef = collection(db, "ca-mau/food/items");
//     try {
//         const querySnapshot = await getDocs(collectionRef);
//         const restaurants = [];
//         querySnapshot.forEach((doc) => {
//             restaurants.push({ id: doc.id, ...doc.data() });
//         });
//         res.send(restaurants);
//     } catch (error) {
//         res.send({ error: error.message });
//     }
// });

const PORT = 10000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
