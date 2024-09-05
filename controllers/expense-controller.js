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
  console.log("Functio getAllExpenses called");
  res.status(200).json({
    statusCode: 200,
    data: {
      expenses: DUMMY_EXPENSES
    }
  });
}