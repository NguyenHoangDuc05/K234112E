const express = require('express');
const app = express();
const port = 3002;
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
const { MongoClient, ObjectId } = require('mongodb');
const bcrypt = require('bcrypt');

app.use(morgan("combined"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const corsOptions = {
  origin: ['http://localhost:4200', 'http://localhost:4002'], // Thêm các port frontend của bạn vào đây
  credentials: true
};
app.use(cors(corsOptions));

const client = new MongoClient("mongodb://127.0.0.1:27017");
client.connect();
const database = client.db("FashionData");
const fashionCollection = database.collection("Fashion");
const usersCollection = database.collection("users");

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