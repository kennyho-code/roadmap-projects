import express from "express";
import authRouter from "./routes/auth.js";
import workoutRouter from "./routes/workout.js";
import exercisesRouter from "./routes/exercises.js";
import authMiddleware from "./utils/authMiddlware.js";
import workoutExerciseDetailsRouter from "./routes/workout-exercise-details.js";
import workoutPlanRouter from "./routes/workout-plan.js";
import scheduleWorkoutRouter from "./routes/schedule-workout.js";
import generateReportRouter from "./routes/generate-report.js";

const app = express();
app.use(express.json());

app.use("/auth", authRouter);
app.use("/api/workout", authMiddleware, workoutRouter);
app.use("/api/exercises", authMiddleware, exercisesRouter);
app.use(
  "/api/workout-exercise-details",
  authMiddleware,
  workoutExerciseDetailsRouter,
);
app.use("/api/workout-plan", authMiddleware, workoutPlanRouter);
app.use("/api/schedule-workout", authMiddleware, scheduleWorkoutRouter);
app.use("/api/generate-report", authMiddleware, generateReportRouter);

app.listen(3000, () => {
  console.log("listening on http://localhost:3000");
});
