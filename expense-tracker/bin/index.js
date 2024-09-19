#!/usr/bin/env node
const fs = require("node:fs");
const path = require("node:path");

const [operation, ...restArgs] = process.argv.slice(2);

function readData() {
  const filePath = path.join(__dirname, "../data.json");
  const data = fs.readFileSync(filePath, "utf-8");
  const json = JSON.parse(data);
  return json.data;
}

function writeData(newData) {
  const filePath = path.join(__dirname, "../data.json");
  fs.writeFileSync(filePath, JSON.stringify({ data: newData }), "utf-8");
}

function pairArgs(args) {
  let i = 0;
  const res = [];

  while (i < args.length) {
    const arg1 = args[i];
    if (arg1.includes("--")) {
      const cleanArg1 = arg1.replace("--", "");
      res.push([cleanArg1, args[i + 1]]);
      i += 2;
    } else {
      res.push(args[i]);
      i += 1;
    }
  }
  return res;
}

function nextId() {
  let maxId = 0;
  const data = readData();
  data.forEach((row) => {
    maxId = Math.max(row.id, maxId);
  });

  return ++maxId;
}

function add(args) {
  const data = readData();
  const newExpense = {
    id: nextId(),
    description: "",
    amount: 0,
    date: new Date().toISOString(),
  };

  for (const [field, val] of args) {
    newExpense[field] = field === "amount" ? Number(val) : val;
  }

  data.push(newExpense);
  writeData(data);
}

function list() {
  const data = readData();
  const cols = ["ID", "Date", "Description", "Amount"];
  console.log(cols.join("    "));
  data.forEach((row) => {
    const date = new Date(row.date);
    const dateStr =
      date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDay();

    const amountStr = `$${row.amount.toString()}`;
    const r = [row.id, dateStr, row.description, amountStr];
    console.log(r.join("    "));
  });
}

function summary(args) {
  const data = readData();
  if (args.length === 0) {
    const totalAmount = data
      .map((row) => row.amount)
      .reduce((acc, cur) => acc + cur, 0);
    console.log(`Total expenses: $${totalAmount}`);
  } else {
    const [flag, value] = args[0];
    if (flag === "month") {
      const monthAmount = data
        .filter((row) => {
          const date = new Date(row.date);
          return date.getMonth() + 1 === Number(value);
        })
        .map((row) => row.amount)
        .reduce((acc, cur) => acc + cur, 0);

      console.log(`Total expenses for month #${value} : $${monthAmount}`);
    }
  }
}

function deleteExpense(args) {
  const data = readData();
  const [_, id] = args[0];
  const newData = data.filter((row) => row.id !== Number(id));
  writeData(newData);
}

(function main() {
  const args = pairArgs(restArgs);
  switch (operation) {
    case "add": {
      add(args);
      break;
    }
    case "list": {
      list();
      break;
    }
    case "summary": {
      summary(args);
      break;
    }
    case "delete": {
      deleteExpense(args);
    }
  }

  readData();
})();
