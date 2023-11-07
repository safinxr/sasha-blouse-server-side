const express = require('express');
const cors = require('cors')
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
        const allFoodItems = client.db("sashaDB").collection("allFoodItems");

        // const alu = async()=>{
        //     const result = await allFoodItems
        //         .find({ food_name: { $regex: "bbq" }})
        //         .toArray()
        //     console.log(result);
        // }
        // alu()


        // All Food Items==================
        app.get('/allfooditems', async (req, res) => {
            try {
                const page = parseInt(req.query.page) || 1;
                const perPage = 9;
                const skip = (page - 1) * perPage;
                const count = await allFoodItems.estimatedDocumentCount()
                const result = await allFoodItems
                    .find()
                    .skip(skip)
                    .limit(perPage)
                    .toArray()
                res.send({ count, result })
            }
            catch (err) {
                console.error(err);
                res.status(500).send('An error occurred while fetching');
            }

        })

        app.get('/searchfood', async (req, res) => {
            try {
                const name = req.query.name;
                const result = await allFoodItems
                    .find({ food_name: { $regex: name } })
                    .toArray()
                res.send(result);
            }
            catch (err) {
                console.error(err);
                res.status(500).send('An error occurred while fetching');
            }

        })

        app.get('/singlefood', async (req, res) => {
            try {
                const id = req.query.id;
                const result = await allFoodItems
                    .findOne({ _id: new ObjectId(id) })
                res.send(result)
            }
            catch (err) {
                console.error(err);
                res.status(500).send('An error occurred while fetching');
            }
        })


        app.get('/myaddedfood', async (req, res) => {
            try {
                const email = req.query.email;
                const result = await allFoodItems
                    .find({ email: email })
                    .toArray()
                res.send(result)
            }
            catch (err) {
                console.error(err);
                res.status(500).send('An error occurred while fetching');
            }
        })

        app.post('/addfood', async (req, res) => {
            try {
                const data = req.body
                const result = await allFoodItems
                .insertOne(data);
                res.send(data);

            }
            catch (err) {
                console.error(err);
                res.status(500).send('An error occurred while fetching');
            }

        })

        // Top 8 Dishes========================
        app.get('/topdishes', async (req, res) => {
            try {

                const topDishes = await allFoodItems
                    .find()
                    .sort({ ordered: -1 })
                    .limit(8)
                    .toArray()

                res.send(topDishes)
            } catch (err) {
                console.error(err);
                res.status(500).send('An error occurred while fetching ');
            }
        });

        // All Users========================
        app.post('/allusers', async (req, res) => {
            try {
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
            }
            catch (err) {
                console.error(err);
                res.status(500).send('An error occurred while fetching');
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