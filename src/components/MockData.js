// src/mockData.js

const generateTransaction = (id, isExpense, category, method, date) => ({
  id,
  amount: Math.floor(Math.random() * 100) + 1, // Random amount between 1 and 100
  category,
  type: isExpense ? "expense" : "income",
  method,
  date,
  notes: `Sample note for transaction ${id}`, // Add notes for the transaction
});

export const user = { name: "Kranthi", email: "kranthikusal@gmail.com" };

const categories = ["Food", "Transport", "Entertainment", "Utilities"];
const paymentMethods = ["Cash", "Credit Card", "Debit Card", "Bank Transfer"];

// Generate transactions for the last 3 months
const createTransactionsForMonths = (months) => {
  const transactions = [];
  const today = new Date();

  for (let i = 0; i < months; i++) {
    const monthDate = new Date(today.getFullYear(), today.getMonth() - i, 1);

    // Generate 25 expenses and 25 income transactions for each month
    for (let j = 0; j < 25; j++) {
      let day;
      if (i === 0) {
        // If it's the current month, limit days to before today
        day = Math.floor(Math.random() * (today.getDate() - 1)) + 1; // Random day between 1 and (today - 1)
      } else {
        // For past months, allow any day between 1 and 28
        day = Math.floor(Math.random() * 28) + 1;
      }
      const date = new Date(monthDate.getFullYear(), monthDate.getMonth(), day)
        .toISOString()
        .split("T")[0];

      transactions.push(
        generateTransaction(
          transactions.length + 1,
          true,
          categories[Math.floor(Math.random() * categories.length)],
          paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
          date
        )
      ); // Expense
      transactions.push(
        generateTransaction(
          transactions.length + 1,
          false,
          categories[Math.floor(Math.random() * categories.length)],
          paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
          date
        )
      ); // Income
    }
  }
  return transactions;
};

export const mockTransactions = createTransactionsForMonths(3); // Generate transactions for the last 3 months
export const mockCategories = categories; // Export categories as mockCategories
export const mockPaymentMethods = paymentMethods; // Export payment methods as mockPaymentMethods
export const mockCatBudgets = {
  Food: 500,
  Transport: 500,
  Entertainment: 500,
  Utilities: 10,
};
