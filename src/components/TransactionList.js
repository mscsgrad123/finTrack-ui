import React, { useState } from "react";
import styles from "../stylesheet/transactionlist.module.css";
import {
  mockTransactions,
  mockCategories,
  mockPaymentMethods,
} from "./MockData";

const TransactionList = () => {
  const sortedMockTransactions = [...mockTransactions].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );
  const [transactions, setTransactions] = useState(sortedMockTransactions);
  const [categories] = useState(mockCategories);
  const [paymentMethods] = useState(mockPaymentMethods);
  const [formData, setFormData] = useState({
    id: null,
    date: "",
    category: categories[0] || "",
    amount: "",
    paymentMethod: paymentMethods[0] || "",
    description: "",
    type: "expense", // Updated to use 'type'
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isFormVisible, setIsFormVisible] = useState(false); // Track visibility of the form

  // Filter states
  const [categoryFilter, setCategoryFilter] = useState("");
  const [paymentMethodFilter, setPaymentMethodFilter] = useState("");
  const [startDateFilter, setStartDateFilter] = useState("");
  const [endDateFilter, setEndDateFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const transactionsPerPage = 20;

  const [successMessage, setSuccessMessage] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isNaN(formData.amount) || formData.amount <= 0) {
      alert("Please enter a valid amount.");
      return;
    }

    if (!formData.category || !formData.paymentMethod) {
      alert("Please select both a category and a payment method.");
      return;
    }

    if (isEditing) {
      const updatedTransactions = transactions.map((transaction) =>
        transaction.id === formData.id ? formData : transaction
      );
      setTransactions(
        updatedTransactions.sort((a, b) => new Date(b.date) - new Date(a.date))
      );
      setSuccessMessage("Transaction updated successfully!");
    } else {
      const newTransaction = {
        ...formData,
        id: transactions.length + 1,
        amount: parseFloat(formData.amount),
      };
      setTransactions(
        [...transactions, newTransaction].sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        )
      );
      setSuccessMessage("Transaction added successfully!");
    }
    resetForm();
  };

  const handleEdit = (transaction) => {
    setFormData(transaction);
    setIsEditing(true);
    setIsFormVisible(true); // Show the form when editing
  };

  const handleDelete = (id) => {
    setTransactions(
      transactions.filter((transaction) => transaction.id !== id)
    );
    setSuccessMessage("Transaction deleted successfully!");
    setTimeout(() => {
      setSuccessMessage(""); // Clear message after 3 seconds
    }, 3000);
  };

  const resetForm = () => {
    setFormData({
      id: null,
      date: "",
      category: categories[0] || "",
      amount: "",
      paymentMethod: paymentMethods[0] || "",
      description: "",
      type: "expense", // Updated to use 'type'
    });
    setIsEditing(false);
    setIsFormVisible(false); // Hide the form after resetting
    setTimeout(() => {
      setSuccessMessage(""); // Clear message after 3 seconds
    }, 3000);
  };

  const downloadCSV = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      transactions
        .map(
          (transaction) =>
            `${transaction.date},${transaction.type},${transaction.category},${
              transaction.paymentMethod
            },${transaction.type === "income" ? "+" : "-"}${
              transaction.amount
            },${transaction.description}`
        )
        .join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "transactions.csv");
    document.body.appendChild(link); // Required for FF

    link.click(); // This will download the data file named "transactions.csv".
  };

  // Filter transactions based on selected filters
  const filteredTransactions = transactions
    .filter((transaction) => {
      const matchesCategory = categoryFilter
        ? transaction.category === categoryFilter
        : true;
      const matchesPaymentMethod = paymentMethodFilter
        ? transaction.paymentMethod === paymentMethodFilter
        : true;
      const matchesDateRange =
        (!startDateFilter ||
          new Date(transaction.date) >= new Date(startDateFilter)) &&
        (!endDateFilter ||
          new Date(transaction.date) <= new Date(endDateFilter));

      return matchesCategory && matchesPaymentMethod && matchesDateRange;
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort by date

  // Pagination logic
  const paginatedTransactions = filteredTransactions.slice(
    currentPage * transactionsPerPage,
    (currentPage + 1) * transactionsPerPage
  );

  // Get today's date in YYYY-MM-DD format
  const today = new Date();
  const formattedToday = today.toISOString().split("T")[0]; // YYYY-MM-DD

  return (
    <div className={styles.tableWrapper}>
      <h2>Transaction Log</h2>
      {/* Button Group Section */}
      <div className={styles.buttonGroup}>
        {/* Filter Section */}
        <div className={styles.filterSection}>
          <label>Category</label>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>

          <label>Payment Method</label>
          <select
            value={paymentMethodFilter}
            onChange={(e) => setPaymentMethodFilter(e.target.value)}
          >
            <option value="">All Payment Methods</option>
            {paymentMethods.map((method) => (
              <option key={method} value={method}>
                {method}
              </option>
            ))}
          </select>

          <label>Start Date</label>
          <input
            type="date"
            value={startDateFilter}
            onChange={(e) => setStartDateFilter(e.target.value)}
          />

          <label>End Date</label>
          <input
            type="date"
            value={endDateFilter}
            onChange={(e) => setEndDateFilter(e.target.value)}
          />
        </div>

        {/* Button Section */}
        <div>
          <button
            className={styles.addButton}
            onClick={() => setIsFormVisible(true)}
          >
            Add Transaction
          </button>
          <button className={styles.downloadButton} onClick={downloadCSV}>
            Download CSV
          </button>
        </div>
      </div>

      {successMessage && (
        <div className={styles.successMessage}>{successMessage}</div>
      )}
      {/* Form Popup */}
      {isFormVisible && (
        <div className={styles.formPopup}>
          <form onSubmit={handleSubmit}>
            <label>Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              max={formattedToday} // Limit date to today or earlier
              required
            />

            <label>Type</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleInputChange}
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>

            <label>Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              required
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>

            <label>Payment Method</label>
            <select
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleInputChange}
              required
            >
              {paymentMethods.map((method) => (
                <option key={method} value={method}>
                  {method}
                </option>
              ))}
            </select>

            <label>Amount</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleInputChange}
              required
            />

            <label>Notes</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
            ></textarea>

            <button type="submit" className={styles.submitButton}>
              {isEditing ? "Update" : "Add"} Transaction
            </button>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={resetForm}
            >
              Cancel
            </button>
          </form>
        </div>
      )}

      {/* Transaction Table */}
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Date</th>
            <th>Amount</th>
            <th>Category</th>
            <th>Payment Method</th>
            <th>Notes</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedTransactions.map((transaction) => (
            <tr key={transaction.id}>
              <td>{transaction.date}</td>
              <td
                className={
                  transaction.type === "income" ? styles.income : styles.expense
                }
              >
                {transaction.type === "income"
                  ? `+${transaction.amount}`
                  : `-${transaction.amount}`}
              </td>
              <td>{transaction.category}</td>
              <td>{transaction.paymentMethod}</td>
              <td>{transaction.description}</td>
              <td>
                <button
                  className={styles.editButton}
                  onClick={() => handleEdit(transaction)}
                >
                  Edit
                </button>
                <button
                  className={styles.deleteButton}
                  onClick={() => handleDelete(transaction.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Section */}
      <div className={styles.pagination}>
        {Array.from(
          {
            length: Math.ceil(
              filteredTransactions.length / transactionsPerPage
            ),
          },
          (_, index) => (
            <button
              key={index}
              onClick={() => setCurrentPage(index)}
              className={currentPage === index ? styles.activePage : ""}
            >
              {index + 1}
            </button>
          )
        )}
      </div>
    </div>
  );
};

export default TransactionList;
