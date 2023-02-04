import express from "express";
import cors from "cors";
import axios from "axios";

const app = express();
const corsOptions = {
  origin: ["https://switchapp.info", "http://localhost:3000"],
  credentials: true,
};

setInterval(async () => {
  await axios.get("https://call-t1ur.onrender.com/api/test");
}, 600000);

app.use(cors(corsOptions));
import * as http from "http";
const httpClient = http.createServer(app);
// Express App Config
app.use(express.json());

// routes
import userRoutes from "./api/user/user.routes";
import authRoutes from "./api/auth/auth.routes";
import calendarRoutes from "./api/calendar/calendar.routes";

app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/calendar", calendarRoutes);

const port = process.env.PORT || 3030;
httpClient.listen(port, () => {
  console.log("Server connected to port: " + port);
});
