import connectToMongoDb from "./utils/DB/connection.js";
import express from "express";
import dotenv from "dotenv";
import userRoutes from "./routes/user.routes.js";
import cors from "cors";
import agentRoutes from "./routes/agent.route.js";
import cookieParser from "cookie-parser";
import packageRoutes from "./routes/package.route.js";
import dematRoutes from "./routes/demat.route.js";
import adminRoutes from "./routes/admin.route.js"
dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: (origin, callback) => {
      const allowedOrigins = ["http://localhost:8899"];
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    allowedHeaders: [
      "Origin",
      "X-Requested-With",
      "Content-Type",
      "Authorization",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    optionsSuccessStatus: 200, // For legacy browser support
  })
);

// routes
app.use("/user", userRoutes);
app.use("/admin/agent", agentRoutes);
app.use("/package", packageRoutes);
app.use("/demat", dematRoutes);
app.use("/admin", adminRoutes);

// Start the server
connectToMongoDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(() => {
    console.error("Failed to connect to MongoDB");
  });
