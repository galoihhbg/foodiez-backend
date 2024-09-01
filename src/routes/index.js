import restaurantRouter from "./restaurants.js";
import commentRouter from "./comment.js";

function route(app) {

    // Curb Cores Error by adding a header here
    app.use((req, res, next) => {
        res.setHeader("Access-Control-Allow-Origin", "*")
        res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
        );
        res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, DELETE, PATCH, OPTIONS"
        );
        next();
    })
    
    app.use('/restaurants', restaurantRouter)
    app.use('/comments', commentRouter)
    app.use('/', (req, res) => {res.send('abc')})
}

export default route;