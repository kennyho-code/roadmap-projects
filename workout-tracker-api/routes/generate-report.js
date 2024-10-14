import express from "express";
const router = express.Router();
import supabase from "../utils/supabase.js";
import { v4 as uuidv4 } from "uuid";

router.get("/:id", async (req, res) => {
  const { id } = req.params;

  const userId = req.user.user.id;

  const { data, error } = await supabase
    .from("schedule_workout")
    .select(
      `
      *,
      scheduled_date,
      workout_plans (
        id,
        name,
        description,
        workout_exercise_details (
          id,
          sets,
          repetitions,
          weight,
          exercises (
            id,
            name,
            description,
            categories (
              id,
              name
            )
          )
        )
      )
    `,
    )
    .eq("id", id)
    .single();

  if (error) {
    return res.status(404).json({ error: error.message });
  }

  const htmlReport = generateHtmlReport(data);
  const { data: uploadData, error: uploadError } = await uploadHtmlToStorage(
    htmlReport,
    `${userId}/${uuidv4()}.html`,
  );

  console.log("uploadData: ", uploadData);

  if (uploadError) {
    return res.status(500).json({ error: uploadError.message });
  }

  res.status(200).send(htmlReport);
});

const generateHtmlReport = (data) => {
  const { scheduled_date, workout_plans } = data;
  const workoutPlan = workout_plans; // Assuming there's only one workout plan per schedule_workout

  let html = `
    <html>
      <head>
        <title>Workout Report</title>
        <style>
          body { font-family: Arial, sans-serif; }
          .workout-plan { margin-bottom: 20px; }
          .exercise { margin-bottom: 10px; }
          .category { font-style: italic; }
        </style>
      </head>
      <body>
        <h1>Workout Report</h1>
        <div class="workout-plan">
          <h2>Workout Plan: ${workoutPlan.name}</h2>
          <p>${workoutPlan.description}</p>
          <p><strong>Scheduled Date:</strong> ${new Date(scheduled_date).toLocaleDateString()}</p>
          <h3>Exercises:</h3>
          <ul>
  `;

  workoutPlan.workout_exercise_details.forEach((detail) => {
    html += `
      <li class="exercise">
        <strong>${detail.exercises.name}</strong> (${detail.exercises.description})
        <ul>
          <li>Sets: ${detail.sets}</li>
          <li>Repetitions: ${detail.repetitions}</li>
          <li>Weight: ${detail.weight}</li>
          <li>Category: ${detail.exercises.categories.name}</li>
        </ul>
      </li>
    `;
  });

  html += `
          </ul>
        </div>
      </body>
    </html>
  `;

  return html;
};

const uploadHtmlToStorage = async (htmlContent, filePath) => {
  const { data, error } = await supabase.storage
    .from("workout-plan-reports") // Replace with your actual bucket name
    .upload(filePath, Buffer.from(htmlContent), {
      contentType: "text/html",
    });

  return { data, error };
};

export default router;
