const express = require('express');
const app = express();
const port = 3002;
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
const { MongoClient, ObjectId } = require('mongodb');
const bcrypt = require('bcrypt');
const session = require('express-session');

app.use(morgan("combined"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const corsOptions = {
  origin: ['http://localhost:4200', 'http://localhost:4002'], // Thêm các port frontend của bạn vào đây
  credentials: true
};
app.use(cors(corsOptions));
app.use(session({
  secret: "Shh, its a secret!",
  resave: false,
  saveUninitialized: false
}));

const client = new MongoClient("mongodb://127.0.0.1:27017");
client.connect();
const database = client.db("FashionData");
const fashionCollection = database.collection("Fashion");
const usersCollection = database.collection("users");
const productCollection = database.collection("Product");

app.listen(port, () => {
  console.log(`My Server listening on port ${port}`);
});

// Insert sample users
app.post("/insert-sample-users", async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash("password123", 10);
    await usersCollection.insertMany([
      { username: "user1", password: hashedPassword },
      { username: "user2", password: hashedPassword }
    ]);
    res.json({ success: true, message: "Sample users inserted" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error inserting sample users" });
  }
});

app.get("/", (req, res) => {
  res.send("This Web server is processed for MongoDB");
});

// API đăng ký (tạo user mới với password đã hash)
app.post("/register", cors(corsOptions), async (req, res) => {
  const { username, password } = req.body;

  try {
    // Kiểm tra username đã tồn tại chưa
    const existingUser = await usersCollection.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "Username already exists" });
    }

    // Hash password với salt rounds = 10
    const hashedPassword = await bcrypt.hash(password, 10);

    // Lưu user vào database
    await usersCollection.insertOne({
      username,
      password: hashedPassword,
      createdAt: new Date()
    });

    res.json({ success: true, message: "User created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// API đăng nhập (so sánh password với hash trong database)
app.post("/login", cors(corsOptions), async (req, res) => {
  const { username, password } = req.body;

  try {
    // Tìm user theo username
    const user = await usersCollection.findOne({ username });
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    // So sánh password nhập vào với hash đã lưu
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (isPasswordValid) {
      // Set cookie with login info
      res.cookie('loginCookie', JSON.stringify({ username, password }), { maxAge: 24 * 60 * 60 * 1000 }); // 1 day
      res.json({ success: true, message: "Login successful" });
    } else {
      res.status(401).json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Các API Fashion giữ nguyên
app.get("/fashions", cors(corsOptions), async (req, res) => {
  try {
    const result = await fashionCollection.find({}).toArray();
    res.send(result);
  } catch (error) {
    res.status(500).send("Error fetching fashions");
  }
});

app.get("/fashions/:id", cors(corsOptions), async (req, res) => {
  try {
    const o_id = new ObjectId(req.params["id"]);
    const result = await fashionCollection.find({ _id: o_id }).toArray();
    res.send(result[0]);
  } catch (error) {
    res.status(500).send("Error fetching fashion");
  }
});

var cookieParser = require("cookie-parser");
app.use(cookieParser());

// Exercise 61
app.get("/read-login-cookie", (req, res) => {
  const loginCookie = req.cookies.loginCookie;
  if (!loginCookie) {
    return res.json({ username: "", password: "" });
  }
  try {
    const data = JSON.parse(loginCookie);
    res.json({
      username: data.username || "",
      password: data.password || "",
    });
  } catch {
    res.json({ username: "", password: "" });
  }
});
app.get("/clear-login-cookie", (req, res) => {
  res.clearCookie("loginCookie");
  res.json({ success: true });
});

app.get("/create-cookie", cors(corsOptions), (req, res) => {
  res.cookie("username", "Nguyen Hoang Duc");
  res.cookie("password", "123456");
  account = { username: "nguyenhoangduc", password: "011205HD" };
  res.cookie("account", account);
  res.send("cookies are created");
});
app.get("/read-cookie", cors(corsOptions), (req, res) => {
  //cookie is stored in client, so we use req
  username = req.cookies.username;
  password = req.cookies.password;
  account = req.cookies.account;
  infor = "username = " + username + "<br/>";
  infor += "password = " + password + "<br/>";
  if (account != null) {
    infor += "account.username = " + account.username + "<br/>"
    infor += "account.password = " + account.password + "<br/>"
  }
  res.send(infor);
  //Expires after 360000 ms from the time it is set.
  res.cookie("infor_limit1", "I am limited Cookie - way 1", { expire: 360000 + Date.now() });
  res.cookie("infor_limit2", "I am limited Cookie - way 2", { maxAge: 360000 });
});
app.get("/clear-cookie", cors(corsOptions), (req, res) => {
  res.clearCookie("account")
  res.send("[account] Cookie is removed")
})

// Session contact demo
app.get("/contact", cors(corsOptions), (req, res) => {
  if (req.session.visited != null) {
    req.session.visited++
    res.send("You visited this page " + req.session.visited + " times")
  } else {
    req.session.visited = 1
    res.send("Welcome to this page for the first time!")
  }
})

// ===== Exercise 63: Products & Session Cart =====

// POST seed sample products
app.post("/insert-sample-products", cors(corsOptions), async (req, res) => {
  try {
    const sampleProducts = [
      { name: "Diamond Promise Ring 14ct Round Baguette 10K White Gold", price: 245, image: "assets/Exercise63/Diamond Promise Ring 14 ct tw RoundBaguette 10K White Gold.jpg", description: "Elegant promise ring with round baguette diamonds in 10K white gold.", category: "Rings" },
      { name: "Diamond Promise Ring 15ct Round-cut Sterling Silver", price: 279, image: "assets/Exercise63/Diamond Promise Ring 15 ct tw Round-cut Sterling Silver.jpg", description: "Delicate sterling silver ring with sparkling round-cut diamonds.", category: "Rings" },
      { name: "Diamond Promise Ring 1.55ct Round-cut Sterling Silver", price: 299, image: "assets/Exercise63/Diamond Promise Ring 155 ct tw Round-cut Sterling Silver.jpg", description: "Premium sterling silver ring with stunning round-cut diamond design.", category: "Rings" },
      { name: "Diamond Promise Ring 16ct Black & White Sterling Silver", price: 315, image: "assets/Exercise63/Diamond Promise Ring 16 ct tw BlackWhite Sterling Silver.jpg", description: "Modern ring featuring black and white diamonds for a bold look.", category: "Rings" },
      { name: "Diamond Promise Ring 16ct Round-cut 10K White Gold", price: 338, image: "assets/Exercise63/Diamond Promise Ring 16 ct tw Round-cut 10K White Gold.jpg", description: "Classic round-cut diamond ring crafted in 10K white gold.", category: "Rings" },
      { name: "Diamond Promise Ring 18ct Round-cut Sterling Silver", price: 367, image: "assets/Exercise63/Diamond Promise Ring 18 ct tw Round-cut Sterling Silver Ring.jpg", description: "Sophisticated sterling silver promise ring with round-cut diamonds.", category: "Rings" }
    ];
    await productCollection.deleteMany({});
    await productCollection.insertMany(sampleProducts);
    res.json({ success: true, message: "Sample products inserted", count: sampleProducts.length });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error inserting products" });
  }
});

// GET all products
app.get("/products", cors(corsOptions), async (req, res) => {
  try {
    const result = await productCollection.find({}).toArray();
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: "Error fetching products" });
  }
});

// POST add product to session cart
app.post("/cart/add", cors(corsOptions), (req, res) => {
  const product = req.body; // { _id, name, price, image, description, category }
  if (!req.session.cart) req.session.cart = [];
  const existing = req.session.cart.find(p => String(p._id) === String(product._id));
  if (existing) {
    existing.quantity += 1;
  } else {
    req.session.cart.push({ ...product, quantity: 1 });
  }
  res.json({ success: true, cart: req.session.cart });
});

// GET session cart
app.get("/cart", cors(corsOptions), (req, res) => {
  res.json({ cart: req.session.cart || [] });
});

// POST update cart (update quantities and remove checked items)
app.post("/cart/update", cors(corsOptions), (req, res) => {
  const { items } = req.body; // [{ _id, quantity, remove }]
  if (!req.session.cart) req.session.cart = [];
  // Filter out removed items, then update quantities
  req.session.cart = req.session.cart
    .filter(p => {
      const incoming = items.find(i => String(i._id) === String(p._id));
      return incoming ? !incoming.remove : true;
    })
    .map(p => {
      const incoming = items.find(i => String(i._id) === String(p._id));
      if (incoming && incoming.quantity > 0) p.quantity = incoming.quantity;
      return p;
    });
  res.json({ success: true, cart: req.session.cart });
});

// DELETE clear cart
app.delete("/cart/clear", cors(corsOptions), (req, res) => {
  req.session.cart = [];
  res.json({ success: true });
});