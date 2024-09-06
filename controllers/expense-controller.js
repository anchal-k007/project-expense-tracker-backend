const DUMMY_EXPENSES = [
  {
    paymentId: 1,
    date: new Date(2024, 7, 29),
    amount: 100,
    paymentMode: "Cash",
    reason: "Milk",
  },
  {
    paymentId: 2,
    date: new Date(2024, 7, 25),
    amount: 150,
    paymentMode: "Cash",
    reason: "Eggs",
  },
  {
    paymentId: 3,
    date: new Date(2024, 7, 29),
    amount: 249,
    paymentMode: "UPI",
    reason: "Food",
  },
  {
    paymentId: 4,
    date: new Date(2024, 7, 25),
    amount: 1000,
    paymentMode: "UPI",
    reason: "Party",
  },
];

exports.getAllExpenses = (req, res, next) => {
  const { year, month, date } = req.query;
  let filteredExpenses;
  if (!year || !month || !date) {
    filteredExpenses = DUMMY_EXPENSES;
  } else {
    const createdDate = new Date(year, month, date);
    filteredExpenses = DUMMY_EXPENSES.filter(
      (expense) => expense.date.getTime() === createdDate.getTime()
    );
  }

  res.status(200).json({
    statusCode: 200,
    data: {
      expenses: filteredExpenses,
    },
  });
};
