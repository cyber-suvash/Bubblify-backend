const express = require("express");
const path = require("path");
const cors = require("cors");
const methodOverride = require("method-override");

const ConnectDB = require("./config/db");
const productRoutes = require("./routes/productRoutes");
const authRoutes = require("./routes/authRoutes");
const imageRoutes = require("./routes/imageRoutes");

require("dotenv").config(); // Make sure .env is loaded early

const app = express();
const port = process.env.PORT || 4000;

// 📌 Connect to MongoDB
ConnectDB();

// 📁 Static Files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/css', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')));
app.use('/js', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js')));

// 🛠 View Engine (Optional, mostly for testing server-rendered pages)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// 🧩 Middlewares
app.use(cors({
  origin: ['http://localhost:5173', 'https://bubblify-e-commerce.vercel.app'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

// 🛣️ API Routes
app.get("/", (req, res) => {
  res.send("Welcome to Ecommerce server");
});

app.use("/api/products", productRoutes);
app.use("/api/user", authRoutes);
app.use("/api/images", imageRoutes);

// 🚀 Start Server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
