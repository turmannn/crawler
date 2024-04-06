// import {JSONFilePreset} from "lowdb/node";
import express from "express";
import routes from './api/routes/index.js'
import config from './api/config/index.js';
import {startScoutService} from "./services/scoutsService.js";
import {PersistDb} from "./api/database.js";
import productService from "./services/productService.js";

PersistDb(); //TODO: probably i dont need this. Check how it works without it!

export const { inputsQueueAmazon, inputsQueueEbay} = productService.initStoreQueus();
productService.spreadProducts();

startScoutService(inputsQueueAmazon, inputsQueueEbay);

// express app
const app = express();

//Middleware // TODO: do i need it? several examples used it!
app.use(express.json())

app.use((req, res, next) => {
    const apiKey = req.headers['x-api-key'];
    if (apiKey === process.env.API_KEY) {
        next();
    } else res.status(403).send('Unauthorized');
})

// Routes
// app.use('/api/users', routes)
app.use('/api', routes)

const PORT =  process.env.PORT || config.server.port;

app.listen(PORT, () => {console.log(`Server is running on port ${PORT}`)})
