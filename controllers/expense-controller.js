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

/**
 * 
 * @returns {Promise<Array>}
 */
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

exports.putUpdateExpense = async (req, res, next) => {
  const validProperties = ["paymentMode", "amount", "date", "reason"];
  const paymentId = req.params.paymentId;
  const dataToUpdate = req.body;
  // filter unnecessary fields
  Object.keys(dataToUpdate).forEach(
    (key) => !validProperties.includes(key) && delete dataToUpdate[key]
  );

  const fileData = await readDataFile();
  const index = fileData.findIndex(expense => expense.paymentId === paymentId);
  if(index === -1) {
    console.log("Could not find the expense with the paymentId=" + paymentId);
    res.status(404).json({
      "status": "fail",
      message: "Could not find the expense with the paymentId=" + paymentId
    });
  }

  fileData[index] = {
    ...fileData[index],
    ...dataToUpdate,
  }

  
  const filePath = path.join(__dirname, "..", "utils", "data.json");
  fs.writeFile(filePath, JSON.stringify(fileData))
    .then(() => {
      console.log("Updated expense with paymentId=" + paymentId);
      res.status(200).json({
        status: "success",
        data: fileData[index]
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
