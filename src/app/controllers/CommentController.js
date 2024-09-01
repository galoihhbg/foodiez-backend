import firebase from '../../config/db/index.js';
import Comment from '../models/Comment.js';
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
  startAfter
} from 'firebase/firestore';

const db = getFirestore(firebase)

class CommentController {

    // [GET] 
    getComments = async (req, res, next) => {
        try {
            const comments = await getDocs(query(collection(db, `${req.query.city}/food/items/${req.query.restaurant}/comments`)));
            const commentArray = [];
        
            if (comments.empty) {
              return res.status(400).send('No comment');
            } else {
              const returnComments = comments.docs.map(doc => ({
                  id: doc.id,
                  ...doc.data()
              })).slice(0);
              returnComments.forEach((doc) => {
                const comment = new Comment(
                  doc.id,
                  doc.user_CmtOfCmt,
                  doc.user_avatar,
                  doc.user_comment,
                  doc.user_hashtag,
                  doc.user_href,
                  doc.user_imgReview,
                  doc.user_name,
                  doc.user_options,
                  doc.user_rating,
                  doc.user_tbscore,
                  doc.user_timec,
                );
                commentArray.push(comment);
              });
        
              return res.status(200).send(commentArray);
            }
        } catch (error) {
            return res.status(400).send(error.message);
        }
    }
}

export default new CommentController;