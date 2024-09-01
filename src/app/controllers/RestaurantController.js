import firebase from '../../config/db/index.js';
import Restaurant from '../models/Restaurant.js';
import City from '../models/Restaurant.js';
import {
  getFirestore,
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  limit,
  orderBy,
  where,
  startAt
} from 'firebase/firestore';

const db = getFirestore(firebase);

class RestaurantController {

    funcMapping = {
      startAt: (args) => {
          if (!Array.isArray(args) || args.length === 0) {
              throw new Error('Invalid input: args must be a non-empty array.');
          }
          return startAt(args[0]);
      },
      orderBy: (args) => orderBy(...args)
    }

    // [POST] /index
    getRestaurants = async (req, res, next) => {
      try {
        const { city, constraints } = req.body;
    
        if (!city || !constraints) {
          return res.status(400).send('City and constraints are required!');
        }
    
        const queryConstraints = constraints.map(c => {
          const func = this.funcMapping[Object.keys(c)[0]];
          return func ? func(Object.values(c)[0]) : null;
        }).filter(Boolean);

        const pageNum = req.body.pageNum || 1

        if (req.body.limit) {
          queryConstraints.push(limit(req.body.limit * pageNum))
        }
    
        const restaurants = await getDocs(query(collection(db, `${req.body.city}/food/items`), ...queryConstraints));
        const resData = [];
    
        if (restaurants.empty) {
          return res.status(404).send('No restaurants found!');
        }
    
        restaurants.docs.slice(req.body.limit ? (pageNum - 1) * req.body.limit : 0).forEach(doc => {
          const data = doc.data();
          resData.push({
            id: doc.id,
            image: data.src,
            reviewCount: data.comment,
            score: data.info.point_overall / 2,
            type: data.info.type_1_shop === 'Quán ăn' ? 'food' : 'drink',
            name: data.info.name_shop,
            address: data.address,
            description: data.info.price_avg_shop,
            city: req.body.city,
          });
        });
    
        return res.status(200).send(resData);
      } catch (error) {
        console.error(error);
        return res.status(500).send('Internal Server Error');
      }
    }
    

    // [GET] /reviews
    getRestaurantByID = async (req, res, next) => {
      try {
        const restaurant = doc(db, `${req.query.city}/food/items`, req.query.restaurant)
        const data = await getDoc(restaurant)
        if (data.exists()) {
          return res.status(200).send(data.data())
        } else {
          return res.status(404).send('Restaurant not found!')
        }
      } catch (error) {
        return res.status(400).send(error.message)
      }
    }
}

export default new RestaurantController;