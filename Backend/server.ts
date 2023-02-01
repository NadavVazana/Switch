import * as express from "express";
import * as cors from "cors";

const app = express();
const corsOptions = {
  origin: ["http://localhost:3000"],
  credentials: true,
};
app.use(cors(corsOptions));
import * as http from "http";
const httpClient = http.createServer(app);
// Express App Config
app.use(express.json());

// routes
const authRoutes = require("api/auth/auth.routes");
const userRoutes = require("api/user/user.routes");
const calendarRoutes = require("api/calendar/calendar.routes");

app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/calendar", calendarRoutes);

const port = process.env.PORT || 3030;
httpClient.listen(port, () => {
  console.log("Server connected to port: " + port);
});
