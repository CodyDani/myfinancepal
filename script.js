const inputEl = document.getElementById("input-amount");
const ruleEl = document.getElementById("rule");
const categoriesUl = document.getElementById("categories-ul");
const inputSubmitBtn = document.getElementById("input-submit");
const allocationSection = document.getElementById("allocation-section");
const recordBtn = document.getElementById("record-btn");
const homePage = document.getElementById("home-page");
const balancePage = document.getElementById("balance-page");
const budgetPage = document.getElementById("budget-page");
const expensesPage = document.getElementById("expenses-page");
const budgetForm = document.getElementById("budget-form");
const budgetAvailableEl = document.getElementById("budget-available");
const budgetedNeedsList = document.getElementById("budgeted-needs-list");
const expenseForm = document.getElementById("expense-form");
const expenseAccountEl = document.getElementById("expense-account");
const expenseAmountEl = document.getElementById("expense-amount");
const expensesList = document.getElementById("expenses-list");

let balanceArr = [
  { portion: "Tithe", amount: 0, destination: "Church Acc" },
  { portion: "Giving", amount: 0, destination: "Blazz Acc" },
  {
    portion: "Investment & Saving for Budgeted Needs",
    amount: 0,
    destination: "Moniepoint Acc",
  },
  { portion: "House needs", amount: 0, destination: "Kuda Acc" },
  { portion: "Data & Airtime", amount: 0, destination: "Smartcash Acc" },
  {
    portion: "Transportation & Emergencies",
    amount: 0,
    destination: "Opay Acc",
  },
];

let categoriesArr = [];
let budgetNeeds = [];
let expenses = [];

let rules = [
  "10% Tithe from every income",
  "Never Borrow to spend on Liability (Bad debt)",
  "Never Spend outside budget when opay cannot comfortably take it",
];

function saveData() {
  localStorage.setItem("balanceArr", JSON.stringify(balanceArr));
  localStorage.setItem("budgetNeeds", JSON.stringify(budgetNeeds));
  localStorage.setItem("expenses", JSON.stringify(expenses));
}

function loadData() {
  const balanceData = localStorage.getItem("balanceArr");
  if (balanceData) balanceArr = JSON.parse(balanceData);
  const budgetData = localStorage.getItem("budgetNeeds");
  if (budgetData) budgetNeeds = JSON.parse(budgetData);
  const expensesData = localStorage.getItem("expenses");
  if (expensesData) expenses = JSON.parse(expensesData);
}

function getPortionConfig(income) {
  return [
    {
      portion: "Tithe",
      amount: (income * 10) / 100,
      destination: "Church Acc",
    },
    {
      portion: "Giving",
      amount: (income * 30) / 100,
      destination: "Blazz Acc",
    },
    {
      portion: "Investment & Saving for Budgeted Needs",
      amount: (income * 30) / 100,
      destination: "Moniepoint Acc",
    },
    {
      portion: "House needs",
      amount: (income * 10) / 100,
      destination: "Kuda Acc",
    },
    {
      portion: "Data & Airtime",
      amount: (income * 10) / 100,
      destination: "Smartcash Acc",
    },
    {
      portion: "Transportation & Emergencies",
      amount: (income * 10) / 100,
      destination: "Opay Acc",
    },
  ];
}

function formatMoney(amount) {
  return Number(amount).toLocaleString("en-US");
}

function getVisiblePage() {
  return document.querySelector('.container:not([style*="display: none"])');
}

function getVisibleNav() {
  return document.querySelector(
    ".container:not([style*='display: none']) .nav-links",
  );
}

function setActiveNavItem(currentPage) {
  const allButtons = document.querySelectorAll(".nav-links li button");
  allButtons.forEach((btn) => btn.classList.remove("active"));

  let activeButtonText = "";
  if (currentPage === homePage) activeButtonText = "Home";
  else if (currentPage === balancePage) activeButtonText = "Balance";
  else if (currentPage === budgetPage) activeButtonText = "Budgeted Needs";
  else if (currentPage === expensesPage) activeButtonText = "Expenses";

  if (activeButtonText) {
    const activeButton = Array.from(allButtons).find(
      (btn) => btn.textContent === activeButtonText,
    );
    if (activeButton) activeButton.classList.add("active");
  }
}

function closeAllMenus() {
  document
    .querySelectorAll(".nav-links.active")
    .forEach((nav) => nav.classList.remove("active"));
}

function hideAllPages() {
  closeAllMenus();
  homePage.style.display = "none";
  balancePage.style.display = "none";
  budgetPage.style.display = "none";
  expensesPage.style.display = "none";
}

function showPage(page) {
  hideAllPages();
  page.style.display = "block";

  // Close the menu if it's open on the visible page
  const nav = getVisibleNav();
  if (nav && nav.classList.contains("active")) {
    nav.classList.remove("active");
  }

  // Highlight active menu item on desktop
  setActiveNavItem(page);

  if (page === balancePage) {
    displayBalance();
  }

  if (page === budgetPage) {
    updateBudgetPage();
  }

  if (page === expensesPage) {
    renderExpenseAccounts();
    renderExpenses();
  }
}

function showHomePage() {
  showPage(homePage);
}

function showBalance() {
  showPage(balancePage);
}

function showBudgetPage() {
  showPage(budgetPage);
}

function showExpenses() {
  showPage(expensesPage);
}

function displayPortions() {
  categoriesUl.innerHTML = categoriesArr
    .map(
      (item) =>
        `<li><span>${item.portion}</span><span>#${formatMoney(item.amount)}</span><span>${item.destination}</span></li>`,
    )
    .join("");
}

function displayBalance() {
  const portionCardContainer = document.getElementById("portion-cards");
  portionCardContainer.innerHTML = balanceArr
    .map(
      (item) =>
        `<section class="portion-card"><p>${item.portion}</p><p><span>Total:</span><span class="portion-amount">#${formatMoney(item.amount)}</span></p></section>`,
    )
    .join("");
}

function recordCategories() {
  if (!categoriesArr.length) {
    return;
  }

  categoriesArr.forEach((category) => {
    const existing = balanceArr.find(
      (item) => item.portion === category.portion,
    );
    if (existing) {
      existing.amount += category.amount;
    }
  });

  categoriesArr = [];
  allocationSection.style.display = "none";
  displayBalance();
  renderExpenseAccounts();
  updateBudgetPage();
  saveData();
}

function renderExpenseAccounts() {
  expenseAccountEl.innerHTML = balanceArr
    .map((item) => `<option value="${item.portion}">${item.portion}</option>`)
    .join("");
}

function getInvestmentAvailable() {
  const investment = balanceArr.find(
    (item) => item.portion === "Investment & Saving for Budgeted Needs",
  );
  return investment ? investment.amount : 0;
}

function computeBudgetStatuses() {
  const priorities = { High: 1, Medium: 2, Low: 3 };
  const needs = [...budgetNeeds].sort((a, b) => {
    const priorityDiff = priorities[a.priority] - priorities[b.priority];
    return priorityDiff || a.addedAt - b.addedAt;
  });

  let available = getInvestmentAvailable();
  return needs.map((need) => {
    if (need.completed) {
      return { ...need, status: "Completed" };
    }

    const status = available >= need.amount ? "Can cover" : "Pending";
    if (status === "Can cover") {
      available -= need.amount;
    }
    return { ...need, status };
  });
}

function editBudgetNeed(index) {
  const need = budgetNeeds[index];
  const updatedName = prompt("Edit need name:", need.name)?.trim();
  if (!updatedName) return;

  const updatedAmount = Number(
    prompt("Edit need amount:", need.amount?.toString()),
  );
  if (!updatedAmount || updatedAmount <= 0) {
    alert("Please enter a valid amount.");
    return;
  }

  const updatedPriority = prompt(
    "Edit priority (High, Medium, Low):",
    need.priority,
  )?.trim();
  if (
    !updatedPriority ||
    !["High", "Medium", "Low"].includes(updatedPriority)
  ) {
    alert("Priority must be High, Medium, or Low.");
    return;
  }

  budgetNeeds[index] = {
    ...need,
    name: updatedName,
    amount: updatedAmount,
    priority: updatedPriority,
  };
  updateBudgetPage();
  saveData();
}

function toggleBudgetComplete(index) {
  budgetNeeds[index].completed = !budgetNeeds[index].completed;
  updateBudgetPage();
  saveData();
}

function deleteBudgetNeed(index) {
  if (!confirm("Delete this budget need?")) return;
  budgetNeeds.splice(index, 1);
  updateBudgetPage();
  saveData();
}

function displayBudgetNeeds() {
  const needsWithStatus = computeBudgetStatuses();
  budgetedNeedsList.innerHTML = needsWithStatus
    .map((need, index) => {
      const completedClass = need.completed ? " budget-completed" : "";
      const actionLabel = need.completed ? "Unmark" : "Complete";
      return `
        <li class="budget-item${completedClass}">
          <span>${need.name}</span>
          <span>#${formatMoney(need.amount)}</span>
          <span>${need.status}</span>
          <span class="action-buttons">
            <button class="edit-btn" onclick="editBudgetNeed(${index})">
              Edit
            </button>
            <button class="toggle-complete-btn" onclick="toggleBudgetComplete(${index})">
              ${actionLabel}
            </button>
            <button class="delete-btn" onclick="deleteBudgetNeed(${index})">
              Delete
            </button>
          </span>
        </li>
      `;
    })
    .join("");

  if (!budgetNeeds.length) {
    budgetedNeedsList.innerHTML = `<li style="grid-template-columns: 1fr;">No needs saved yet.</li>`;
  }
}

function updateBudgetPage() {
  budgetAvailableEl.textContent = `#${formatMoney(getInvestmentAvailable())}`;
  displayBudgetNeeds();
}

function recordExpense(event) {
  event.preventDefault();

  const amount = Number(expenseAmountEl.value);
  const account = expenseAccountEl.value;
  const description = document
    .getElementById("expense-description")
    .value.trim();

  if (!amount || amount <= 0 || !description) {
    alert("Please enter a valid expense amount and description.");
    return;
  }

  const accountItem = balanceArr.find((item) => item.portion === account);
  if (!accountItem) {
    alert("Please select a valid account.");
    return;
  }

  if (amount > accountItem.amount) {
    alert("Not enough funds in that portion to cover this expense.");
    return;
  }

  accountItem.amount -= amount;
  expenses.push({
    account,
    amount,
    description,
    date: new Date().toLocaleString(),
  });

  expenseForm.reset();
  displayBalance();
  renderExpenses();
  updateBudgetPage();
  saveData();
}

function renderExpenses() {
  expensesList.innerHTML = expenses
    .map(
      (item) =>
        `<li><span>${item.account}</span><span>#${formatMoney(item.amount)}</span><span>${item.description}</span></li>`,
    )
    .join("");

  if (!expenses.length) {
    expensesList.innerHTML = `<li style="grid-template-columns: 1fr;">No expenses recorded yet.</li>`;
  }
}

function toggleMenu() {
  const nav = getVisibleNav();
  if (!nav) {
    return;
  }

  nav.classList.toggle("active");
}

inputEl.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    inputSubmitBtn.click();
  }
});

inputSubmitBtn.addEventListener("click", () => {
  const income = Number(inputEl.value);
  if (!income || income <= 0) {
    alert("Enter a valid income amount.");
    return;
  }

  categoriesArr = getPortionConfig(income);
  allocationSection.style.display = "block";
  displayPortions();
  inputEl.value = "";
});

recordBtn.addEventListener("click", recordCategories);
budgetForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const name = document.getElementById("budget-name").value.trim();
  const amount = Number(document.getElementById("budget-amount").value);
  const priority = document.getElementById("budget-priority").value;

  if (!name || !amount || amount <= 0) {
    alert("Please add a valid need name and amount.");
    return;
  }

  budgetNeeds.push({
    name,
    amount,
    priority,
    completed: false,
    addedAt: Date.now(),
  });
  budgetForm.reset();
  updateBudgetPage();
  saveData();
});

expenseForm.addEventListener("submit", recordExpense);

function displayRules() {
  setInterval(() => {
    const randomIdx = Math.floor(Math.random() * rules.length);
    ruleEl.textContent = `-- ${rules[randomIdx]} --`;
  }, 6000);
}

loadData();
displayBalance();
updateBudgetPage();
renderExpenses();
renderExpenseAccounts();
displayRules();
