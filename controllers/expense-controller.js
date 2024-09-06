const fs = require("fs/promises");
const path = require("path");

exports.getAllExpenses = (req, res, next) => {
  const filePath = path.join(__dirname, "..", "utils", "data.json");
  fs.readFile(filePath)
    .then((data) => {
      console.log("Data loaded successfully");
      return JSON.parse(data);
    })
    .catch((err) => {
      console.log("Eror in loading file");
      console.log(err);
    })
    .then((DUMMY_EXPENSES) => {
      const { year, month, date } = req.query;
      let filteredExpenses;
      if (!year || !month || !date) {
        filteredExpenses = DUMMY_EXPENSES;
      } else {
        const createdDate = new Date(year, month, date);
        console.log(createdDate.toISOString());
        filteredExpenses = DUMMY_EXPENSES.filter(
          (expense) => expense.date === createdDate.toISOString()
        );
      }

      res.status(200).json({
        expenses: filteredExpenses,
      });
    });
};

exports.postAddNewExpense = (req, res, next) => {
  const { date, amount, paymentMode, reason } = req.body;
  const newExpense = {
    paymentId: new Date().getTime().toString(),
    date: new Date(date),
    amount: +amount,
    paymentMode,
    reason,
  };
  const filePath = path.join(__dirname, "..", "utils", "data.json");
  fs.readFile(filePath)
    .then((data) => {
      console.log("Data loaded successfully");
      return JSON.parse(data);
    })
    .catch((err) => {
      console.log("Eror in loading file");
      console.log(err);
    })
    .then((loadedExpenses) => {
      loadedExpenses.push(newExpense);
      fs.writeFile(filePath, JSON.stringify(loadedExpenses))
        .then(() => {
          console.log("Data written to file successfully");
          res.status(201).json({
            status: "success",
            expense: newExpense,
          });
        })
        .catch((err) => {
          console.log("Error in writing data");
          console.log(err);
          res.status(500).json({
            status: "error",
            message: "internal server error",
          });
        });
    });
};

const readDataFile = async () => {
  const filePath = path.join(__dirname, "..", "utils", "data.json");
  return fs
    .readFile(filePath)
    .then((data) => {
      console.log("Data loaded successfully");
      return JSON.parse(data);
    })
    .catch((err) => {
      console.log("Eror in loading file");
      console.log(err);
    });
};

exports.deleteRemoveExpense = async (req, res, next) => {
  const paymentId = req.params.paymentId;
  const fileData = await readDataFile();

  const updatedData = fileData.filter(
    (expense) => expense.paymentId !== paymentId
  );

  const filePath = path.join(__dirname, "..", "utils", "data.json");
  fs.writeFile(filePath, JSON.stringify(updatedData))
    .then(() => {
      console.log("Item deleted");
      res.status(204).json({
        status: "success",
        message: "done",
      });
    })
    .catch((err) => {
      console.log("error occured while writing");
      console.log(err);
      res.status(500).json({
        status: "error",
        message: "Internal server error",
      });
    });
};
