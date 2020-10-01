const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vss5k.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express();

app.use(bodyParser.json());
app.use(cors());

const port = 5000;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const productsCollection = client.db('emaJohn').collection("Products");
    const ordersCollection = client.db('emaJohn').collection("orders");
    console.log('data base connected')

    app.post('/addProducts', (req, res) => {
        const products = req.body;
        productsCollection.insertOne(products)
            .then(result => {
                res.send(result.insertedCount);
            })
    })

    app.get('/products', (req, res) => {
        productsCollection.find({})
            .toArray((err, documents) => {
                res.send(documents);
            })
    })

    app.get('/product/:key', (req, res) => {
        productsCollection.find({ key: req.params.key })
            .toArray((err, documents) => {
                res.send(documents[0]);
            })
    })

    app.post('/productByKeys', (req, res) => {
        const productKeys = req.body;
        productsCollection.find({ key: { $in: productKeys } })
            .toArray((err, documents) => {
                res.send(documents);
            })
    })

    app.post('/addOrders', (req, res) => {
        const orders = req.body;
        ordersCollection.insertOne(orders)
            .then(result => {
                res.send(result.insertedCount > 0);
            })
    })

});


app.get('/', (req, res) => {
    res.send("Ema john watson")
})


app.listen(process.env.PORT || port);