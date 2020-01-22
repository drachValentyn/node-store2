const express = require("express");
const router = express.Router();
const Pusher = require("pusher");

const pusher = new Pusher({
  appId: "933999",
  key: "0a8f937aef4cad7b92ea",
  secret: "e890f8beaa8ee654859e",
  cluster: "eu",
  encrypted: true
});

let expensesList = {
  data: [
    {
      date: "April 15th 2017",
      expense: 100,
      income: 4000
    },
    {
      date: "April 22nd 2017",
      expense: 500,
      income: 2000
    },
    {
      date: "April 24th 2017",
      expense: 1000,
      income: 2300
    },
    {
      date: "April 29th 2017",
      expense: 2000,
      income: 1234
    },
    {
      date: "May 1st 2017",
      expense: 500,
      income: 4180
    },
    {
      date: "May 5th 2017",
      expense: 4000,
      income: 5000
    }
  ]
};

router.get("/", (req, res) => {
  res.send(expensesList);
});

router.post("/", (req, res) => {
  let expense = Number(req.body.expense);
  let income = Number(req.body.income);
  let date = req.body.date;

  let newExpense = {
    date: date,
    expense: expense,
    income: income
  };

  expensesList.data.push(newExpense);

  pusher.trigger("finance", "new-expense", {
    newExpense: expensesList
  });

  res.send({
    success: true,
    income: income,
    expense: expense,
    date: date,
    data: expensesList
  });
});

module.exports = router;
