// Budgets.js
import React, { useState, useEffect } from "react";
import styles from "../stylesheet/budgets.module.css";
import { mockCategories, mockPaymentMethods } from "./MockData";
import { jwtDecode } from "jwt-decode";

const Budgets = ({ userId }) => {
  const [categoryBudgets, setCategoryBudgets] = useState({});
  const categories = mockCategories;
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState(null);

  const handleCategoryBudgetChange = (category, value) => {
    setCategoryBudgets((prev) => ({
      ...prev,
      [category]: value,
    }));
  };

  const handleSaveBudgets = async () => {
    const budgetsToSave = Object.entries(categoryBudgets).map(
      ([category, amount]) => ({
        category,
        amount: parseFloat(amount),
        userId: 1,
      })
    );

    // try {
    //   const response = await fetch(
    //     "http://localhost:8080/api/budgets/save?userId=" + userId,
    //     {
    //       method: "POST",
    //       headers: {
    //         "Content-Type": "application/json",
    //       },
    //       body: JSON.stringify(budgetsToSave),
    //     }
    //   );

    //   if (response.ok) {
    //     console.log("Budgets saved successfully.");
    //     setIsEditing(false);
    //   } else {
    //     console.error("Failed to save budgets:", response.status);
    //     setError("Failed to save budgets. Please try again later.");
    //   }
    // } catch (err) {
    //   console.error("Error saving budgets:", err);
    //   setError("Failed to save budgets. Please try again later.");
    // }
    setIsEditing(false);
  };

  // if (isLoading) {
  //   return <div>Loading budgets...</div>;
  // }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

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
              disabled={!isEditing}
            />
          </div>
        ))}
      </div>

      {!isEditing ? (
        <button onClick={() => setIsEditing(true)}>Edit Budgets</button>
      ) : (
        <button onClick={handleSaveBudgets}>Save Budgets</button>
      )}
    </div>
  );
};

export default Budgets;
