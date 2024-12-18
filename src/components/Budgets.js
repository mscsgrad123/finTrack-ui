import React, { useState, useEffect } from "react";
import styles from "../stylesheet/budgets.module.css";
import { mockCategories, mockTransactions, mockCatBudgets } from "./MockData";

const Budgets = ({ userId }) => {
  const [categoryBudgets, setCategoryBudgets] = useState(mockCatBudgets);
  const [monthlyExpenses, setMonthlyExpenses] = useState({});
  const [notifications, setNotifications] = useState([]);
  const [isEditing, setIsEditing] = useState(false);

  const categories = mockCategories;

  // Calculate current month's expenses by category
  useEffect(() => {
    const expensesByCategory = {};
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    mockTransactions.forEach((transaction) => {
      const transactionDate = new Date(transaction.date);
      if (
        transaction.type === "expense" &&
        transactionDate.getMonth() === currentMonth &&
        transactionDate.getFullYear() === currentYear
      ) {
        expensesByCategory[transaction.category] =
          (expensesByCategory[transaction.category] || 0) + transaction.amount;
      }
    });

    setMonthlyExpenses(expensesByCategory);

    // Generate notifications after calculating expenses
    const newNotifications = [];
    for (const category in mockCatBudgets) {
      if (
        mockCatBudgets[category] &&
        expensesByCategory[category] &&
        expensesByCategory[category] > mockCatBudgets[category]
      ) {
        newNotifications.push(
          `Your expenses for ${category} this month (${expensesByCategory[category]}) have exceeded your initial budget of ${mockCatBudgets[category]}!`
        );
      }
    }

    setNotifications(newNotifications);
  }, []); // Empty dependency array to run once on mount

  // Handle budget input changes
  const handleCategoryBudgetChange = (category, value) => {
    setCategoryBudgets((prev) => ({
      ...prev,
      [category]: parseFloat(value) || 0,
    }));
  };

  // Handle save budgets and generate notifications
  const handleSaveBudgets = () => {
    const newNotifications = [];
    for (const category in categoryBudgets) {
      if (
        categoryBudgets[category] &&
        monthlyExpenses[category] &&
        monthlyExpenses[category] > categoryBudgets[category]
      ) {
        newNotifications.push(
          `Your expenses for ${category} this month (${monthlyExpenses[category]}) have exceeded your updated budget of ${categoryBudgets[category]}!`
        );
      }
    }

    setNotifications(newNotifications);
    setIsEditing(false); // Exit editing mode
  };

  return (
    <div className={styles.budgetsContainer}>
      <h2>Set Budgets</h2>

      <div className={styles.budgetSection}>
        <h3>Budgets and Expenses</h3>
        {categories.map((category) => (
          <div key={category} className={styles.budgetItem}>
            <label>{category}:</label>
            <input
              type="number"
              placeholder="Enter budget"
              value={categoryBudgets[category] || ""}
              onChange={(e) =>
                handleCategoryBudgetChange(category, e.target.value)
              }
              disabled={!isEditing}
            />
            <span className={styles.expenses}>
              Total Expenses: {monthlyExpenses[category] || 0}
            </span>
          </div>
        ))}
      </div>

      {!isEditing ? (
        <button onClick={() => setIsEditing(true)}>Edit Budgets</button>
      ) : (
        <button onClick={handleSaveBudgets}>Submit</button>
      )}

      <div className={styles.notificationSection}>
        <h3>Notifications</h3>
        {notifications.length > 0 ? (
          notifications.map((note, index) => (
            <div key={index} className={styles.notification}>
              {note}
            </div>
          ))
        ) : (
          <p>No notifications</p>
        )}
      </div>
    </div>
  );
};

export default Budgets;
