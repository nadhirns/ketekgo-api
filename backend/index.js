import express from "express";
import cors from "cors";
import session from "express-session";
import dotenv from "dotenv";
import db from "./config/database.js";
import SqlStore from "connect-session-sequelize";

import TransactionRoute from "./routes/transactionRoute.js";
import DriverRoute from "./routes/driverRoute.js";
import PlaceRoute from "./routes/placeRoute.js";
import UserRoute from "./routes/userRoute.js";
import RoleRoute from "./routes/roleRoute.js";
import AuthRoute from "./routes/authRoute.js";

dotenv.config();

const app = express();

const sessionStr = SqlStore(session.Store);
const store = new sessionStr({
  db: db,
});

// (async () => {
//   await db.sync();
// })();

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: store,
    cookie: {
      // kalo pake https nilainya true, sebaliknya
      secure: "auto",
    },
  })
);

app.use(
  cors({
    credentials: true,
    origin: "http://localhost:3000",
  })
);

app.use(express.json());

app.use(UserRoute);
app.use(RoleRoute);
app.use(AuthRoute);
app.use(TransactionRoute);
app.use(DriverRoute);
app.use(PlaceRoute);

// store.sync();

app.listen(process.env.APP_PORT, () => {
  console.log("Server up and running ...");
});
