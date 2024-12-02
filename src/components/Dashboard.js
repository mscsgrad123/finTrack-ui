import React, { useState } from "react";
import { Pie, Line } from "react-chartjs-2";
import { Chart } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import "chart.js/auto";
import styles from "../stylesheet/dashboard.module.css";
import {
  mockTransactions,
  mockCategories,
  mockPaymentMethods,
} from "./MockData";

// Register the plugin
Chart.register(ChartDataLabels);

const pieChartOptions = {
  plugins: {
    legend: {
      position: "right",
      align: "center",
      labels: {
        boxWidth: 15,
        font: {
          size: 12,
        },
      },
    },
    datalabels: {
      formatter: (value, context) => {
        const total = context.dataset.data.reduce((acc, cur) => acc + cur, 0);
        const percentage = ((value / total) * 100).toFixed(1);
        return value > 0 ? `${percentage}%` : "";
      },
      color: "#000",
      font: { size: 12 },
    },
  },
};

const Dashboard = () => {
  // Mock data
  const categories = mockCategories;
  const paymentMethods = mockPaymentMethods;
  const transactions = mockTransactions;

  // Calculate default start and end dates for the last 30 days
  const today = new Date();
  const last30Days = new Date(today);
  last30Days.setDate(today.getDate() - 30);

  const [startDate, setStartDate] = useState(
    last30Days.toISOString().split("T")[0]
  );
  const [endDate, setEndDate] = useState(today.toISOString().split("T")[0]);

  // Function to get greeting based on the time of day
  const getGreeting = () => {
    const hour = today.getHours();
    if (hour < 12) {
      return "Good Morning!";
    } else if (hour < 18) {
      return "Good Afternoon!";
    } else {
      return "Good Evening!";
    }
  };

  // Function to calculate total income, expenses, and net income within the date range
  const calculateTotals = () => {
    let totalIncome = 0;
    let totalExpenses = 0;

    transactions.forEach(({ type, amount, date }) => {
      if (date >= startDate && date <= endDate) {
        if (type === "income") {
          totalIncome += amount;
        } else if (type === "expense") {
          totalExpenses += amount;
        }
      }
    });

    return {
      totalIncome,
      totalExpenses,
      netIncome: totalIncome - totalExpenses,
    };
  };

  const totals = calculateTotals();

  const calculateExpensesByCategory = () => {
    const expenseTotals = categories.reduce(
      (acc, category) => ({ ...acc, [category]: 0 }),
      {}
    );
    transactions.forEach(({ type, category, amount, date }) => {
      if (type === "expense" && date >= startDate && date <= endDate) {
        expenseTotals[category] += amount;
      }
    });
    return {
      labels: Object.keys(expenseTotals),
      datasets: [
        {
          data: Object.values(expenseTotals),
          backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"],
        },
      ],
    };
  };

  const calculateExpensesByPaymentMethod = () => {
    const paymentTotals = paymentMethods.reduce(
      (acc, method) => ({ ...acc, [method]: 0 }),
      {}
    );
    transactions.forEach(({ type, paymentMethod, amount, date }) => {
      if (type === "expense" && date >= startDate && date <= endDate) {
        paymentTotals[paymentMethod] += amount;
      }
    });
    return {
      labels: Object.keys(paymentTotals),
      datasets: [
        {
          data: Object.values(paymentTotals),
          backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"],
        },
      ],
    };
  };

  const calculateIncomeByCategory = () => {
    const incomeTotals = categories.reduce(
      (acc, category) => ({ ...acc, [category]: 0 }),
      {}
    );
    transactions.forEach(({ type, category, amount, date }) => {
      if (type === "income" && date >= startDate && date <= endDate) {
        incomeTotals[category] += amount;
      }
    });
    return {
      labels: Object.keys(incomeTotals),
      datasets: [
        {
          data: Object.values(incomeTotals),
          backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"],
        },
      ],
    };
  };

  const calculateIncomeByPaymentMethod = () => {
    const incomePaymentTotals = paymentMethods.reduce(
      (acc, method) => ({ ...acc, [method]: 0 }),
      {}
    );
    transactions.forEach(({ type, paymentMethod, amount, date }) => {
      if (type === "income" && date >= startDate && date <= endDate) {
        incomePaymentTotals[paymentMethod] += amount;
      }
    });
    return {
      labels: Object.keys(incomePaymentTotals),
      datasets: [
        {
          data: Object.values(incomePaymentTotals),
          backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"],
        },
      ],
    };
  };

  const calculateExpensesOverTime = () => {
    const expenseData = {};
    transactions.forEach(({ type, date, amount }) => {
      if (type === "expense" && date >= startDate && date <= endDate) {
        const formattedDate = new Date(date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        });
        expenseData[formattedDate] = (expenseData[formattedDate] || 0) + amount;
      }
    });
    return {
      labels: Object.keys(expenseData),
      datasets: [
        {
          label: "Expenses Over Time",
          data: Object.values(expenseData),
          borderColor: "#FF6384",
          backgroundColor: "rgba(255, 99, 132, 0.2)",
          fill: true,
        },
      ],
    };
  };

  return (
    <div className={styles.dashboard}>
      <h2>
        {getGreeting()} Your Financial Analysis during the following time period
      </h2>
      <div className={styles.dateFilter}>
        <label htmlFor="startDate">Start Date:</label>
        <input
          id="startDate"
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <label htmlFor="endDate">End Date:</label>
        <input
          id="endDate"
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </div>
      <div className={styles.totals}>
        <div className={styles.totalItem}>
          <h4>Total Income: ${totals.totalIncome}</h4>
        </div>
        <div className={styles.totalItem}>
          <h4>Total Expenses: ${totals.totalExpenses}</h4>
        </div>
        <div className={styles.totalItem}>
          <h4>Net Income: ${totals.netIncome}</h4>
        </div>
      </div>
      <div className={styles.pieChartsRow}>
        <div className={styles.chartContainer}>
          <h3 className={styles.pieChartTitle}>Expenses by Category</h3>
          <Pie data={calculateExpensesByCategory()} options={pieChartOptions} />
        </div>
        <div className={styles.chartContainer}>
          <h3 className={styles.pieChartTitle}>Expenses by Payment Method</h3>
          <Pie
            data={calculateExpensesByPaymentMethod()}
            options={pieChartOptions}
          />
        </div>
        <div className={styles.chartContainer}>
          <h3 className={styles.pieChartTitle}>Income by Category</h3>
          <Pie data={calculateIncomeByCategory()} options={pieChartOptions} />
        </div>
        <div className={styles.chartContainer}>
          <h3 className={styles.pieChartTitle}>Income by Payment Method</h3>
          <Pie
            data={calculateIncomeByPaymentMethod()}
            options={pieChartOptions}
          />
        </div>
      </div>
      <div className={styles.lineChartContainer}>
        <h3>Expenses Over Time</h3>
        <Line data={calculateExpensesOverTime()} />
      </div>
    </div>
  );
};

export default Dashboard;
