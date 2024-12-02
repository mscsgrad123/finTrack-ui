import React, { useState } from "react";
import styles from "../stylesheet/transactionlist.module.css";
import {
  mockTransactions,
  mockCategories,
  mockPaymentMethods,
} from "./MockData";

const TransactionList = () => {
  const [transactions, setTransactions] = useState(mockTransactions);
  const [formData, setFormData] = useState({
    id: null,
    date: "",
    category: "",
    amount: "",
    paymentMethod: "",
    notes: "",
    type: "expense", // Updated to use 'type'
  });
  const [categories] = useState(mockCategories);
  const [paymentMethods] = useState(mockPaymentMethods);
  const [isEditing, setIsEditing] = useState(false);
  const [isFormVisible, setIsFormVisible] = useState(false); // Track visibility of the form

  // Filter states
  const [categoryFilter, setCategoryFilter] = useState("");
  const [paymentMethodFilter, setPaymentMethodFilter] = useState("");
  const [startDateFilter, setStartDateFilter] = useState("");
  const [endDateFilter, setEndDateFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const transactionsPerPage = 20;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditing) {
      setTransactions(
        transactions.map((transaction) =>
          transaction.id === formData.id ? formData : transaction
        )
      );
    } else {
      const newTransaction = {
        ...formData,
        id: transactions.length + 1,
        amount: parseFloat(formData.amount),
      };
      setTransactions([...transactions, newTransaction]);
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
  };

  const resetForm = () => {
    setFormData({
      id: null,
      date: "",
      category: "",
      amount: "",
      paymentMethod: "",
      notes: "",
      type: "expense", // Updated to use 'type'
    });
    setIsEditing(false);
    setIsFormVisible(false); // Hide the form after resetting
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
            },${transaction.notes}`
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
    .sort((a, b) => new Date(a.date) - new Date(b.date)); // Sort by date

  // Pagination logic
  const paginatedTransactions = filteredTransactions.slice(
    currentPage * transactionsPerPage,
    (currentPage + 1) * transactionsPerPage
  );

  // Get today's date in YYYY-MM-DD format
  const today = new Date();
  const formattedToday = today.toISOString().split("T")[0]; // YYYY-MM-DD

  return (
    <div>
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
              name="notes"
              value={formData.notes}
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
            <th>Type</th>
            <th>Category</th>
            <th>Payment Method</th>
            <th>Amount</th>
            <th>Notes</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedTransactions.map((transaction) => (
            <tr key={transaction.id}>
              <td>{transaction.date}</td>
              <td>{transaction.type}</td>
              <td>{transaction.category}</td>
              <td>{transaction.paymentMethod}</td>
              <td
                className={
                  transaction.type === "income" ? styles.income : styles.expense
                }
              >
                {transaction.type === "income"
                  ? `+${transaction.amount}`
                  : `-${transaction.amount}`}
              </td>
              <td>{transaction.notes}</td>
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
