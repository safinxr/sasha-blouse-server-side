const express = require('express');
const cors = require('cors')
require('dotenv').config()
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000

// Middleware
app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wywsbgq.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});



async function run() {
    try {
        await client.connect();

        const allUsers = client.db("sashaDB").collection("allUsers");


        // All Users========================
        app.post('/allusers', async (req, res) => {
            const userData = req.body
            const resultOne = await allUsers
                .find({ email: userData.email })
                .toArray()
            if (resultOne.length > 0) {
                res.send("done")
            }
            else {
                const resultTwo = await allUsers.insertOne(userData);
                res.send(resultTwo);
            }

        })



        await client.db("admin").command({ ping: 1 });
        console.log("Sasha is eating mango ✅✅✅✅✅✅✅✅✅");
    } finally {

        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send("Sasha is eating")
})

app.listen(port)