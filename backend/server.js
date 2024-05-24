import bcrypt from "bcrypt";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import expressListEndpoints from "express-list-endpoints";
import session from "express-session";
import mongoose from "mongoose";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";

dotenv.config();
const { Schema } = mongoose;

// MongoDB
const mongoUrl = process.env.MONGO_URL || "mongodb://localhost:27017/project-auth-session";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected to project-auth-session database.'))
  .catch(err => console.log(err));

const userSchema = new Schema({
  username: { type: String, unique: true, required: true, minLength: 8 },
  email: {
    type: String,
    unique: true,
    required: true,
    match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  },
  password: { type: String, required: true },
  accessToken: { type: String, default: () => bcrypt.genSaltSync() },
});

const User = mongoose.model("User", userSchema);

const port = process.env.PORT || 8080;
const app = express();

const authUser = async (username, password, done) => {
  try {
    const user = await User.findOne({ username });

    if (user && bcrypt.compareSync(password, user.password)) {
      return done(null, user);
    } else {
      return done("error comparing passwords", false);
    }
  } catch (error) {
    return done("error logging in", false);
  }
};

// Function for authenticate by session
const checkAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).send();
};

// Function for authenticate by token
const authToken = async (req, res, next) => {
  const user = await User.findOne({ accessToken: req.header("Authorization") });
  if (user) {
    req.user = user;
    next();
  } else {
    res
      .status(401)
      .json({ message: "You are not allowed to see our top secret message!" });
  }
};

// Middleware for initializing session
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: true,
      httpOnly: true, // Make session cookie unavailable to read in frontend for security
    },
  })
);
// init passport on every route call
app.use(passport.initialize());
// allow passport to use "express-session"
app.use(passport.session());
// Add middlewares to enable cors and json body parsing
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST"],
  }) // Allow sending credentials from frontend to backend
);
app.use(express.json());

// Start defining your routes here
app.get("/", (req, res) => {
  const endpoints = expressListEndpoints(app);
  res.json(endpoints);
});

// Sign-up
app.post("/signup", async (req, res) => {
  //  if (!username || !email || !password) {
  //    return res.status(400).json({ message: "All fields are required." });
  //  }
  //  if (username.length < 5) {
  //    return res
  //      .status(400)
  //      .json({ message: "Username must be at least 5 characters long." });
  //  }
  //  if (!email.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)) {
  //    return res.status(400).json({ message: "Invalid email format." });
  //  }
  //  if (password.length < 8) {
  //    return res
  //      .status(400)
  //      .json({ message: "Password must be at least 8 characters long." });
  //  }
  try {
    const { username, email, password } = req.body;
    const user = new User({
      username,
      email,
      password: bcrypt.hashSync(password, 10),
    });
    console.log(user);

    await user.save();
    res.status(201).json({ id: user._id, accessToken: user.accessToken });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Could not sign up.", error: error.errors });
  }
});

// Log-in
app.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user) => {
    if (err) return next(err);
    if (!user) return res.status(401).end();

    req.logIn(user, err => {
      if (err) return next(err);
      return res.status(200).end();
    });
  })(req, res, next);
});

// sessions - Authentication method 1 - by session
app.get("/sessions", checkAuthenticated, (req, res) => {
  res.json({
    ID: req.user._id,
    name: req.user.username,
    AccessToken: req.user.accessToken,
  });
});

// secrets - Authentication method 2 - by Token
app.get("/secrets", authToken);
app.get("/secrets", (req, res) => {
  res.json({ secret: "This is a super secret message" });
});

passport.use(new LocalStrategy(authUser));
passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((user, done) => {
  done(null, user);
});
// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
