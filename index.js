const express = require("express");
const cors = require("cors");
require("./db/config");
const User = require('./db/User');
const Product = require("./db/Product")
const Notification = require("./db/Notification")
const Jwt = require('jsonwebtoken');
const jwtKey = 'e-com';
const app = express();

app.use(express.json());
app.use(cors());
var loginUser;
var productId;
var notOperation;

app.post("/register", async (req, resp) => {
    let user = new User(req.body);
    console.log("register user :- ", user);
    let result = await user.save();
    result = result.toObject();
    delete result.password
    Jwt.sign({ result }, jwtKey, { expiresIn: "2h" }, (err, token) => {
        if (err) {
            resp.send("Something went wrong")
        }
        resp.send({ result, auth: token })
    })
})

app.post("/login", async (req, resp) => {
    if (req.body.password && req.body.email) {
        let user = await User.findOne(req.body).select("-password");
        loginUser = user;
        console.log("login user :- ", user);
        if (user) {
            Jwt.sign({ user }, jwtKey, { expiresIn: "2h" }, (err, token) => {
                if (err) {
                    resp.send("Something went wrong")
                }
                resp.send({ user, auth: token })
            })
        } else {
            resp.send({ result: "No User found" })
        }
    } else {
        resp.send({ result: "No User found" })
    }
});

app.post("/add-product", async (req, resp) => {
    let product = new Product(req.body);
    let result = await product.save();
    productId =  result._id;
    notOperation = "Product Added";
    resp.send({result, notOperation, loginUser, productId});
});

app.get("/products", async (req, resp) => {
    const products = await Product.find();
    if (products.length > 0) {
        resp.send(products)
    } else {
        resp.send({ result: "No Product found" })
    }
});

app.delete("/product/:id", async (req, resp) => {
    let result = await Product.deleteOne({ _id: req.params.id });
    notOperation = "Product Deleted";
    console.log(notOperation);
    resp.send(result)
});

app.get("/product/:id", async (req, resp) => {
    let result = await Product.findOne({ _id: req.params.id })
    if (result) {
        resp.send(result)
    } else {
        resp.send({ "result": "No Record Found." })
    }
})

app.put("/product/:id", async (req, resp) => {
    let result = await Product.updateOne(
        { _id: req.params.id },
        { $set: req.body }
    )
    notOperation = "Product Updated";
    productId = req.params.id;
    resp.send({result, notOperation, productId});
});

app.get('/notification', async (req, res) => {
    const notifications = await Notification.find();
    if (notifications.length > 0) {
        res.send(notifications)
    } else {
        res.send({ result: "No Notification found" })
    }
});

app.get("/category-list", async(req,res)=>{
    const products = await Product.find();
    const categories = products.map((x)=>{
        return  x.category;
    })
    if (categories.length > 0) {
        res.send(categories)
    } else {
        res.send({ result: "No Product found" })
    }
})

app.post('/add-notification', async (req, res) => {
    let notifications = new Notification(req.body);
    let result = await notifications.save();
    res.send({result, notOperation, loginUser, productId});
});

app.get("/search/:key", async (req, resp) => {
    let result = await Product.find({
        "$or": [
            {
                name: { $regex: req.params.key }
            },
            {
                company: { $regex: req.params.key }
            },
            {
                category: { $regex: req.params.key }
            }
        ]
    });
    resp.send(result);
})

app.listen(5000);