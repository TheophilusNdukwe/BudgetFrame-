// Data storage
let incomeData = [];
let expenseData = [];

// Get references to forms and display areas
const incomeForm = document.getElementById('income-form');
const expenseForm = document.getElementById('expense-form');
const totalIncomeDisplay = document.getElementById('total-income');
const totalExpensesDisplay = document.getElementById('total-expenses');
const netBalanceDisplay = document.getElementById('net-balance');
const incomeList = document.getElementById('income-list');
const expenseList = document.getElementById('expense-list');
const financialAdviceDisplay = document.getElementById('financial-advice');
const financialAdviceTitleDisplay = document.getElementById('financial-advice-title');

document.addEventListener('DOMContentLoaded', function() {
    const profileForm = document.querySelector('.edit-form');
    
    if (profileForm) {
        profileForm.addEventListener('submit', function(event) {
            event.preventDefault(); // Prevent default form submission
    
            const profileNameInput = document.getElementById('profileName');
            const newProfileName = profileNameInput.value;
    
            fetch('/profile/update', { // Changed the URL
                method: 'PUT', // Changed the method to PUT
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ profileName: newProfileName }),
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
              console.log('Profile name updated successfully:', data);
               // Update the profile name in the DOM without reloading the page
                profileNameInput.value = data.profileName;
                
            })
            .catch(error => {
                console.error('There has been a problem with your fetch operation:', error);
                alert('Failed to update profile name.');
            });
        });
    }
});
document.addEventListener('DOMContentLoaded', function() {
    const profileUserForm = document.querySelector('.edit-form');
    
    if (profileUserForm) {
        profileUserForm.addEventListener('submit', function(event) {
            event.preventDefault(); // Prevent default form submission
    
            const usernameInput = document.getElementById('username');
            const newUserName =  usernameInput.value;
    
            fetch('/profile/updateUsername', { // Changed the URL
                method: 'PUT', // Changed the method to PUT
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username: newUserName }),
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
              console.log('Profile name updated successfully:', data);
               // Update the profile name in the DOM without reloading the page
                usernameInput.value = data.username;
                
            })
            .catch(error => {
                console.error('There has been a problem with your fetch operation:', error);
                alert('Failed to update username.');
            });
        });
    }
});
// Get references to charts
const pieChartCanvas = document.getElementById("expense-pie-chart");
const barChartCanvas = document.getElementById("income-expense-bar-chart");

let pieChart;
let barChart;

// Function to load initial data on page load
function loadInitialData() {
  // Check if data exists in local storage
  const storedIncomeData = localStorage.getItem('incomeData');
  const storedExpenseData = localStorage.getItem('expenseData');

  if (storedIncomeData) {
    incomeData = JSON.parse(storedIncomeData);
  }
  if (storedExpenseData) {
    expenseData = JSON.parse(storedExpenseData);
  }

  // First, update from local storage
  updateUI();
  // Then, load from the server
  fetch('/dashboard')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      // Assuming the response has income and expense data
      if (data.transactions) {
        //Reset data from server
        incomeData = [];
        expenseData = [];

        data.transactions.forEach(transaction => {
          if (transaction.source) { // Check if it's an income
            incomeData.push(transaction);
          } else if (transaction.description) { // Check if it's an expense
            expenseData.push(transaction);
          }
        });

        //Save data in local storage
        saveDataToLocalStorage();

        // Update UI with initial data
        updateUI();
      }
    })
    .catch(error => {
      console.error('There has been a problem with your fetch operation:', error);
    });
}

// Form submission handling (Income)
incomeForm.addEventListener('submit', (event) => {
  event.preventDefault(); // Prevent page refresh
  console.log('Submitting income form');

  // Get values from input fields
  const source = document.getElementById('income-source').value;
  const amount = parseFloat(document.getElementById('income-amount').value);
  const date = document.getElementById('income-date').value;

  // Process the income data and send to server
  const income = { source, amount, date };
  fetch('/income', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(income),
  })
    .then(response => {
      if (response.ok) {
        // Process the income data
        processIncomeData(source, amount, date);
      } else {
        console.error('Error saving income:', response.status);
      }
    })
    .catch(error => console.error('Error:', error));
});

// Form submission handling (Expense)
expenseForm.addEventListener('submit', (event) => {
  event.preventDefault(); // Prevent page refresh
  console.log('Submitting expense form');
  // Get values from input fields
  const description = document.getElementById('expense-description').value;
  const amount = parseFloat(document.getElementById('expense-amount').value);
  const category = document.getElementById('expense-category').value;
  const date = document.getElementById('expense-date').value;

  // Process the expense data and send to server
  const expense = { description, amount, category, date };
  fetch('/expense', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(expense),
  })
    .then(response => {
      if (response.ok) {
        // Process the expense data
        processExpenseData(description, amount, category, date);
      } else {
        console.error('Error saving expense:', response.status);
      }
    })
    .catch(error => console.error('Error:', error));
});

// Process Income data
function processIncomeData(source, amount, date) {
  //Add data to income data array
  incomeData.push({ source, amount, date });

  //Save data in local storage
  saveDataToLocalStorage();

  // Update UI
  updateUI();
}

// Process Expense data
function processExpenseData(description, amount, category, date) {
  //Add data to expense data array
  expenseData.push({ description, amount, category, date });

  //Save data in local storage
  saveDataToLocalStorage();

  // Update UI
  updateUI();
}

// Save data to local storage
function saveDataToLocalStorage() {
  localStorage.setItem('incomeData', JSON.stringify(incomeData));
  localStorage.setItem('expenseData', JSON.stringify(expenseData));
}

// Calculate total income
function calculateTotalIncome() {
  return incomeData.reduce((sum, entry) => sum + entry.amount, 0);
}

// Calculate total expenses
function calculateTotalExpenses() {
  return expenseData.reduce((sum, entry) => sum + entry.amount, 0);
}

// Calculate net balance
function calculateNetBalance() {
  return calculateTotalIncome() - calculateTotalExpenses();
}

// Update total income display
function updateTotalIncome(totalIncome) {
  totalIncomeDisplay.textContent = totalIncome.toFixed(2);
}

//Update income list
function updateIncomeList() {
  incomeData.forEach((entry, index) => { // Get the index
        const listItem = document.createElement("li");
        listItem.textContent = `Source: ${entry.source}, Amount: ${entry.amount}, Date: ${entry.date}`;

        // Create a delete button (trash icon)
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "🗑️"; // You can use an actual icon here
        deleteButton.classList.add("delete-button");
        
        // Add event listener to delete button
        deleteButton.addEventListener("click", () => {
            deleteIncomeEntry(index);
        });

        listItem.appendChild(deleteButton);
        incomeList.appendChild(listItem);
    });
}
function deleteIncomeEntry(index) {
    incomeData.splice(index, 1); // Remove the entry from the array
    saveDataToLocalStorage();
    updateUI();
}

// Update total expenses display
function updateTotalExpenses(totalExpenses) {
  totalExpensesDisplay.textContent = totalExpenses.toFixed(2);
}

//Update expense list
function updateExpenseList() {
  expenseList.innerHTML = "";

  expenseData.forEach((entry, index) => { // Get the index
        const listItem = document.createElement("li");
        listItem.textContent = `Description: ${entry.description}, Amount: ${entry.amount}, Category: ${entry.category}, Date: ${entry.date}`;

        // Create a delete button (trash icon)
        const deleteButton = document.createElement("button");
        deleteButton.innerHTML = "<i class='fa fa-trash-o'></i>"; // You can use an actual icon here
        deleteButton.classList.add("delete-button");

        // Add event listener to delete button
        deleteButton.addEventListener("click", () => {
            deleteExpenseEntry(index);
        });

        listItem.appendChild(deleteButton);
        expenseList.appendChild(listItem);
    });
}


function deleteExpenseEntry(index) {
    expenseData.splice(index, 1); // Remove the entry from the array
    saveDataToLocalStorage();
    updateUI();
}

// Update net balance display
function updateNetBalance() {
  netBalanceDisplay.textContent = calculateNetBalance().toFixed(2);
}

// Update the UI
function updateUI() {
  updateTotalIncome(calculateTotalIncome());
  updateTotalExpenses(calculateTotalExpenses());
  updateNetBalance();
  updateIncomeList();
  updateExpenseList();
  updateFinancialAdvice();
  updatePieChart();
  updateBarChart();
}

// Function to calculate and display financial advice
function updateFinancialAdvice() {
  const netBalance = calculateNetBalance();
  const totalIncome = calculateTotalIncome();
  const totalExpenses = calculateTotalExpenses();
  financialAdviceTitleDisplay.style.display = 'block';
  if (netBalance >= 0) {
    financialAdviceDisplay.textContent = 'Your financial situation is balanced.';
  } else {
    financialAdviceDisplay.textContent = 'Your expenses exceed your income. Consider increasing your income and reducing your expenses.';
    if (totalExpenses > totalIncome) {
        const categoryExpenses = {};
        expenseData.forEach(entry => {
            if (categoryExpenses[entry.category]) {
                categoryExpenses[entry.category] += entry.amount;
            } else {
                categoryExpenses[entry.category] = entry.amount;
            }
        });
        let maxCategory = '';
        let maxAmount = 0;

        for (const category in categoryExpenses) {
            if (categoryExpenses[category] > maxAmount) {
                maxAmount = categoryExpenses[category];
                maxCategory = category;
            }
        }
        financialAdviceDisplay.textContent += ` You are spending the most on ${maxCategory}. Consider reducing your spending in this category.`;
    }
    
  }
}
// Function to update the pie chart
function updatePieChart() {
  const categoryExpenses = {};
  expenseData.forEach((entry) => {
    if (categoryExpenses[entry.category]) {
      categoryExpenses[entry.category] += entry.amount;
    } else {
      categoryExpenses[entry.category] = entry.amount;
    }
  });
  const categories = Object.keys(categoryExpenses);
  const amounts = Object.values(categoryExpenses);
  if (pieChart) {
    pieChart.destroy(); // Destroy the previous chart instance
  }
  pieChart = new Chart(pieChartCanvas, {
    type: "pie",
    data: {
      labels: categories,
      datasets: [
        {
          label: "Expenses by Category",
          data: amounts,
          backgroundColor: [
            "#FF6384",
            "#36A2EB",
            "#FFCE56",
            "#4BC0C0",
            "#9966FF",
            "#FF9F40",
          ],
        },
      ],
    },
  });
}

// Function to update the bar chart
function updateBarChart() {
  const totalIncome = calculateTotalIncome();
  const totalExpenses = calculateTotalExpenses();

  if (barChart) {
    barChart.destroy(); // Destroy the previous chart instance
  }
  barChart = new Chart(barChartCanvas, {
    type: "bar",
    data: {
      labels: ["Total"],
      datasets: [
        {
          label: "Income",
          data: [totalIncome],
          backgroundColor: "#36A2EB",
        },
        {
          label: "Expenses",
          data: [totalExpenses],
          backgroundColor: "#FF6384",
        },
      ],
    },
  });
}

// Update the UI

loadInitialData();