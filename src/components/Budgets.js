// Budgets.js
import React, { useState } from "react";
import styles from "../stylesheet/budgets.module.css";
import { mockCategories, mockPaymentMethods } from "./MockData";

const Budgets = () => {
  const [categoryBudgets, setCategoryBudgets] = useState({});
  const [paymentMethodBudgets, setPaymentMethodBudgets] = useState({});
  const categories = mockCategories;
  const paymentMethods = mockPaymentMethods;

  const handleCategoryBudgetChange = (category, value) => {
    setCategoryBudgets((prev) => ({
      ...prev,
      [category]: value,
    }));
  };

  const handlePaymentMethodBudgetChange = (method, value) => {
    setPaymentMethodBudgets((prev) => ({
      ...prev,
      [method]: value,
    }));
  };

  const handleSaveBudgets = () => {
    // Logic to save budgets, e.g., send to backend
    console.log("Category Budgets:", categoryBudgets);
    console.log("Payment Method Budgets:", paymentMethodBudgets);
  };

  return (
    <div className={styles.budgetsContainer}>
      <h2>Set Budgets</h2>

      <div className={styles.budgetSection}>
        <h3>Category Budgets</h3>
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
            />
          </div>
        ))}
      </div>

      <div className={styles.budgetSection}>
        <h3>Payment Method Budgets</h3>
        {paymentMethods.map((method) => (
          <div key={method} className={styles.budgetItem}>
            <label>{method}:</label>
            <input
              type="number"
              placeholder="Enter budget"
              value={paymentMethodBudgets[method] || ""}
              onChange={(e) =>
                handlePaymentMethodBudgetChange(method, e.target.value)
              }
            />
          </div>
        ))}
      </div>

      <button onClick={handleSaveBudgets}>Save Budgets</button>
    </div>
  );
};

export default Budgets;
