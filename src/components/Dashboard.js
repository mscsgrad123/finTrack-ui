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
  responsive: true,
  plugins: {
    legend: {
      position: "top",
      align: "center",
      labels: {
        boxWidth: 10,
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

  const [selectedChart, setSelectedChart] = useState("line");

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

  const generateColors = (numColors) => {
    const colors = [];
    for (let i = 0; i < numColors; i++) {
      const hue = Math.floor((360 / numColors) * i); // Distribute hues evenly
      colors.push(`hsl(${hue}, 70%, 60%)`); // Create colors in HSL format
    }
    return colors;
  };

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
    const colors = generateColors(Object.keys(expenseTotals).length);
    return {
      labels: Object.keys(expenseTotals),
      datasets: [
        {
          data: Object.values(expenseTotals),
          backgroundColor: colors,
        },
      ],
    };
  };

  const calculateExpensesByPaymentMethod = () => {
    const paymentTotals = paymentMethods.reduce(
      (acc, method) => ({ ...acc, [method]: 0 }),
      {}
    );
    transactions.forEach(({ type, method, amount, date }) => {
      if (type === "expense" && date >= startDate && date <= endDate) {
        paymentTotals[method] += amount;
      }
    });
    const colors = generateColors(Object.keys(paymentTotals).length);
    return {
      labels: Object.keys(paymentTotals),
      datasets: [
        {
          data: Object.values(paymentTotals),
          backgroundColor: colors,
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
    const colors = generateColors(Object.keys(incomeTotals).length);
    return {
      labels: Object.keys(incomeTotals),
      datasets: [
        {
          data: Object.values(incomeTotals),
          backgroundColor: colors,
        },
      ],
    };
  };

  const calculateIncomeByPaymentMethod = () => {
    const incomePaymentTotals = paymentMethods.reduce(
      (acc, method) => ({ ...acc, [method]: 0 }),
      {}
    );
    transactions.forEach(({ type, method, amount, date }) => {
      if (type === "income" && date >= startDate && date <= endDate) {
        incomePaymentTotals[method] += amount;
      }
    });
    const colors = generateColors(Object.keys(incomePaymentTotals).length);
    return {
      labels: Object.keys(incomePaymentTotals),
      datasets: [
        {
          data: Object.values(incomePaymentTotals),
          backgroundColor: colors,
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

  const renderSelectedChart = () => {
    const chart = () => {
      switch (selectedChart) {
        case "expensesByCategory":
          return (
            <Pie
              data={calculateExpensesByCategory()}
              options={pieChartOptions}
            />
          );
        case "expensesByPaymentMethod":
          return (
            <Pie
              data={calculateExpensesByPaymentMethod()}
              options={pieChartOptions}
            />
          );
        case "incomeByCategory":
          return (
            <Pie data={calculateIncomeByCategory()} options={pieChartOptions} />
          );
        case "incomeByPaymentMethod":
          return (
            <Pie
              data={calculateIncomeByPaymentMethod()}
              options={pieChartOptions}
            />
          );
        case "line":
        default:
          return <Line data={calculateExpensesOverTime()} />;
      }
    };
    return <div className={styles.chartItem}>{chart()}</div>;
  };

  // const chartOptions = [
  //   "expensesByCategory",
  //   "IncomeByCategory",
  //   "expensesByPaymentMethod",
  //   "incomeByPaymentMethod",
  //   "line",
  // ];

  return (
    <div className={styles.dashboard}>
      <h2>
        {getGreeting()} Your Financial Analysis during the following time period
      </h2>
      <div className={styles.dateFilter}>
        <label htmlFor="startDate">From:</label>
        <input
          id="startDate"
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <label htmlFor="endDate">To:</label>
        <input
          id="endDate"
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </div>
      <div className={styles.totals}>
        <div className={styles.totalItem}>
          <h4>
            Income: ${totals.totalIncome} | Expenses: ${totals.totalExpenses} |
            Net:${totals.netIncome}
          </h4>
        </div>
      </div>

      <div className={styles.chartFilter}>
        <label htmlFor="chartSelect">Analysis Chart:</label>
        <select
          id="chartSelect"
          value={selectedChart}
          onChange={(e) => setSelectedChart(e.target.value)}
        >
          <option value="line">Expenses Over Time</option>
          <option value="expensesByCategory">Expenses by Category</option>
          <option value="expensesByPaymentMethod">
            Expenses by Payment Method
          </option>
          <option value="incomeByCategory">Income by Category</option>
          <option value="incomeByPaymentMethod">
            Income by Payment Method
          </option>
        </select>
      </div>
      <div className={styles.chartContainer}>{renderSelectedChart()}</div>
    </div>
  );
};

export default Dashboard;
