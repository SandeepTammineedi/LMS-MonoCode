import express from "express";
import cors from "cors";
import helmet from "helmet";
import { errorHandler } from "./middleware/error.middleware";
import { notFoundHandler } from "./middleware/not-found.middleware";
import { checkJwt } from "./middleware/authz.middleware";
import morgan from "morgan";
import { getConfig } from "./common/config";
import healthchecksRouter from "./healthchecks";
import coursesRouter from "./courses/courses.router";
import usersRouter from "./users/users.router";

const app = express();

/**
 * Middlewares
 */
app.use(morgan("dev"));
app.use(helmet());

app.use(
  cors({
    origin: {
      local: "http://localhost:3000",
      staging: "https://staging.konamars.com",
      production: "https://learn.konamars.com",
    }[getConfig("MODE") as string],
  })
);
app.use(express.json());

// Auth
// Keeping it before authentication middleware to get server status without having a access token
app.use("/", healthchecksRouter);
app.use(checkJwt);

// Routers
app.use("/courses", coursesRouter);
app.use("/users", usersRouter);

// Error and 404
app.use(errorHandler);
app.use(notFoundHandler);

export default app;
