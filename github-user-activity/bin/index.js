#!/usr/bin/env node
const args = process.argv.slice(2);

if (args.length < 1) {
  console.error("Invalid Input: Pass in a username");
  return;
}

const username = args[0];

fetchGithubUser(username);

function translateEvent(event) {
  switch (event.type) {
    case "PushEvent": {
      return `Pushed ${event.payload.commits.length} commits to ${event.repo.name}`;
    }
    case "CreateEvent": {
      return `Created ${event.payload.ref_type} for ${event.repo.name}`;
    }
    default: {
      return null;
    }
  }
}

async function fetchGithubUser(username) {
  const response = await fetch(
    `https://api.github.com/users/${username}/events`,
  );
  const json = await response.json();
  const descriptions = json.map(translateEvent).filter(Boolean);

  printDescriptions(descriptions);
}

function printDescriptions(descriptions) {
  for (const description of descriptions) {
    console.log(description);
  }
}
