// Import necessary packages
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
require('dotenv').config(); // Load environment variables

// Import routes
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

// Utility files for async error handling
const wrapAsync = require("./utils/wrapAsync.js");
const expressErrors = require("./utils/expressErrors.js");

// MongoDB connection string
const dbUrl = process.env.ATLASDB_URL;

// Set up EJS-mate for enhanced EJS templating
const engine = require('ejs-mate');
const app = express();
app.engine('ejs', engine);

// Set static directory for serving static files
app.use(express.static(path.join(__dirname, "/public")));

// Enable method override
app.use(methodOverride('_method'));

// Middleware to parse request body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set up view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Function to connect to MongoDB
async function main() {
  try {
    await mongoose.connect(dbUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1); // Exit the application if connection fails
  }
}

// Connect to the database
main();

// Enable Mongoose debug mode
mongoose.set('debug', true);

// Session store configuration
const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret: 'mySuperCode'
  },
  touchAfter: 24 * 3600,
});

store.on("error", (error) => {
  console.log("Error in MONGO SESSION STORE:", error);
});

// Session configuration
const sessionOption = {
  store,
  secret: "mySuperCode",
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000, // Set expiration time for cookies
  }
};

app.use(session(sessionOption));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

// Passport configuration
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Middleware for flash messages and user info
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

// Use the routes
app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

// Catch-all route for undefined paths (404 error)
app.all("*", (req, res, next) => {
  next(new expressErrors(404, "Page not found!"));
});

// Error-handling middleware
app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong" } = err;
  res.status(statusCode).render("listings/error.ejs", { message, statusCode });
});

// Start the server
const PORT = process.env.PORT || 3000; // Use environment variable for port
app.listen(PORT, () => {
  console.log(`App is working on port ${PORT}`);
});
