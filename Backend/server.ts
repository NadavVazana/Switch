import express from "express";
import cors from "cors";

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

app.use((err, req, res, next) => {
  // because err.status is undefined
  res.status(404).json({
    error: {
      message: err.message,
    },
  });
});
