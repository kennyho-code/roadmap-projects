#!/usr/bin/env node

const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

async function runGame(difficulty) {
  console.log(`Great! you have selected the ${difficulty} level`);
  const randomNumber = Math.floor(Math.random() * 100) + 1;
  const chances = { Easy: 10, Medium: 5, Hard: 3 };
  let attempts = 0;

  while (true) {
    attempts += 1;
    if (attempts > chances[difficulty]) {
      console.log("Ran out of attempts. You Lose!");
      rl.close();
    }
    const answer = Number(await askQuestion("Enter your Guess: "));
    if (answer == randomNumber) {
      console.log(
        `Congratulations! You guessed the correct number in ${attempts} attempts.`,
      );
      rl.close();
    } else {
      console.log(
        `Incorrect! The number is ${randomNumber < answer ? "less" : "more"} than ${answer}`,
      );
    }
  }
}

(async function main() {
  console.log(
    `
    Welcome to the Number Guessing Game!
    I'm thinking of a number between 1 and 100.
    You have 5 chances to guess the correct number.
    `,
  );
  const difficultyQuestion = `
    Please select the difficulty level:
      1. Easy (10 chances)
      2. Medium (5 chances)
      3. Hard (3 chances)
      4. Quit
    `;

  while (true) {
    const choice = await askQuestion(difficultyQuestion);

    switch (choice) {
      case "1": {
        runGame("Easy");
        break;
      }
      case "2": {
        runGame("Medium");
        break;
      }
      case "3": {
        runGame("Hard");
        break;
      }
      case "4": {
        rl.close();
        break;
      }
      default: {
        console.log("Invalid Choice");
        break;
      }
    }
  }
})();

rl.on("close", () => {
  process.exit(0);
});
