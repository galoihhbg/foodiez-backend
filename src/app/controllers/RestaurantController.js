import firebase from '../../config/db/index.js';
import Restaurant from '../models/Restaurant.js';
import City from '../models/Restaurant.js';
import client from '../services/elastic.js';
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
            const {
                city,
                constraints
            } = req.body;

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

    // [GET] /restaurants/search?input&city&offset&limit
    getSearchResult = async (req, res, next) => {
        try {
            const page = req.query.page || 1
            const limit = req.query.limit || 10
            const searchRes = await client.search({
                index: `${req.query.city}_restaurants`,
                query: {
                    multi_match: {
                        query: req.query.input,
                        fields: ['name', 'address'],
                        fuzziness: 'AUTO'
                    }
                },
                from: (page - 1) * limit,
                size: limit
            });
            if (searchRes.hits.hits.empty) {
                return res.status(404).send('No restaurants satisfy your input!')
            } else {
                return res.status(200).send({data: searchRes.hits.hits, total: searchRes.hits.total.value, page, limit})
            }
        } catch (error) {
            console.error('Error fetching or indexing data:', error);
            res.status(500).send('Internal Server Error');
        }
    }

    //[GET] post data to elasticsearch
    postToElastic = async (req, res, next) => {
        try {
          const snapshot = await getDocs(collection(db,`${req.query.city}/food/items`))
        if (snapshot.empty) {
          return res.status(404).send('No restaurants found!')
        } else {
          let restaurants = [];
          snapshot.forEach(doc => {
            const data = doc.data()
              restaurants.push({ 
                id: doc.id,
                name: data.name,
                address: data.address,
                image: data.src || 'https://www.fdicreative.com/images/easyblog_articles/2/b2ap3_large_placeholder-image.png',
                reviewCount: data.comment,
                score: data.info ? data.info.point_overall / 2 : null
               });
          });
          for (const restaurant of restaurants) {
            await client.index({
                index: `${req.query.city}_restaurants`,
                id: restaurant.id,
                body: restaurant,
            });
          }
          res.status(200).json({ message: 'Dữ liệu đã được gửi vào Elastic Search', restaurants });
        }
        } catch (error) {
          res.status(400).send(error)
        }
    }
}

export default new RestaurantController;