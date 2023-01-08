const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("node:path");
const generalGetRequestRateLimiter = require("./middleware/rateLimit/generalGetRequestRateLimiter");
const security = require("./routes/security");
const routes = require("./routes/routes");
const login = require("./routes/login");
const dashboard = require("./routes/dashboard");
require("dotenv").config();
const app = express();
const port = 3001;

app.use(express.static(path.join(__dirname, "static")));
app.use(cookieParser(process.env.COOKIE_SIGNATURE));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.set("view engine", "pug");

app.use(generalGetRequestRateLimiter);

app.use(security);

app.use(routes);

app.use("/login", login);

app.use("/dashboard", dashboard);

app.listen(port);