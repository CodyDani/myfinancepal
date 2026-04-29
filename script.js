/**
 * FinancePal - A personal finance management application
 * Handles income allocation, budgeting, and expense tracking
 */

// Configuration constants
const CONFIG = {
  STORAGE_KEYS: {
    BALANCE: 'balanceArr',
    BUDGET_NEEDS: 'budgetNeeds',
    EXPENSES: 'expenses'
  },
  PORTION_CONFIG: [
    { portion: "Tithe", percentage: 10, destination: "Church Acc" },
    { portion: "Giving", percentage: 30, destination: "Palmpay Acc" },
    { portion: "Investment & Saving for Budgeted Needs", percentage: 30, destination: "Moniepoint Acc" },
    { portion: "House needs", percentage: 10, destination: "Kuda Acc" },
    { portion: "Data & Airtime", percentage: 10, destination: "Smartcash Acc" },
    { portion: "Transportation & Emergencies", percentage: 10, destination: "Opay Acc" }
  ],
  RULES: [
    "10% Tithe from every income",
    "Never Borrow to spend on Liability (Bad debt)",
    "Never Spend outside budget when opay cannot comfortably take it"
  ],
  PRIORITY_ORDER: { High: 1, Medium: 2, Low: 3 }
};

// Utility functions
class Utils {
  static formatMoney(amount) {
    return Number(amount).toLocaleString("en-US");
  }

  static validateAmount(amount) {
    return Number(amount) > 0 && !isNaN(amount);
  }

  static showAlert(message) {
    alert(message); // Could be replaced with a custom modal
  }
}

// Data management class
class DataManager {
  constructor() {
    this.balanceArr = [];
    this.budgetNeeds = [];
    this.expenses = [];
    this.categoriesArr = []; // Temporary categories before recording
    this.loadData();
  }

  // Load data from localStorage
  loadData() {
    try {
      const balanceData = localStorage.getItem(CONFIG.STORAGE_KEYS.BALANCE);
      if (balanceData) this.balanceArr = JSON.parse(balanceData);

      const budgetData = localStorage.getItem(CONFIG.STORAGE_KEYS.BUDGET_NEEDS);
      if (budgetData) this.budgetNeeds = JSON.parse(budgetData);

      const expensesData = localStorage.getItem(CONFIG.STORAGE_KEYS.EXPENSES);
      if (expensesData) this.expenses = JSON.parse(expensesData);
    } catch (error) {
      console.error('Error loading data:', error);
      Utils.showAlert('Error loading saved data. Starting fresh.');
    }
  }

  // Save data to localStorage
  saveData() {
    try {
      localStorage.setItem(CONFIG.STORAGE_KEYS.BALANCE, JSON.stringify(this.balanceArr));
      localStorage.setItem(CONFIG.STORAGE_KEYS.BUDGET_NEEDS, JSON.stringify(this.budgetNeeds));
      localStorage.setItem(CONFIG.STORAGE_KEYS.EXPENSES, JSON.stringify(this.expenses));
    } catch (error) {
      console.error('Error saving data:', error);
      Utils.showAlert('Error saving data. Please try again.');
    }
  }

  // Calculate portions based on income
  calculatePortions(income) {
    if (!Utils.validateAmount(income)) {
      throw new Error('Invalid income amount');
    }

    return CONFIG.PORTION_CONFIG.map(config => ({
      portion: config.portion,
      amount: (income * config.percentage) / 100,
      destination: config.destination
    }));
  }

  // Record categories to balance
  recordCategories() {
    if (!this.categoriesArr.length) return;

    this.categoriesArr.forEach(category => {
      const existing = this.balanceArr.find(item => item.portion === category.portion);
      if (existing) {
        existing.amount += category.amount;
      }
    });
    this.categoriesArr = [];
    this.saveData();
  }

  // Add budget need
  addBudgetNeed(name, amount, priority) {
    if (!name.trim() || !Utils.validateAmount(amount)) {
      throw new Error('Invalid budget need data');
    }

    this.budgetNeeds.push({
      name: name.trim(),
      amount: Number(amount),
      priority,
      addedAt: Date.now()
    });
    this.saveData();
  }

  // Add expense
  addExpense(account, amount, description) {
    if (!account || !Utils.validateAmount(amount) || !description.trim()) {
      throw new Error('Invalid expense data');
    }

    const accountItem = this.balanceArr.find(item => item.portion === account);
    if (!accountItem) {
      throw new Error('Invalid account selected');
    }

    if (amount > accountItem.amount) {
      throw new Error('Insufficient funds in selected account');
    }

    accountItem.amount -= amount;
    this.expenses.push({
      account,
      amount: Number(amount),
      description: description.trim(),
      date: new Date().toLocaleString()
    });
    this.saveData();
  }

  // Get investment available
  getInvestmentAvailable() {
    const investment = this.balanceArr.find(item => item.portion === "Investment & Saving for Budgeted Needs");
    return investment ? investment.amount : 0;
  }

  // Compute budget statuses
  computeBudgetStatuses() {
    const needs = [...this.budgetNeeds].sort((a, b) => {
      const priorityDiff = CONFIG.PRIORITY_ORDER[a.priority] - CONFIG.PRIORITY_ORDER[b.priority];
      return priorityDiff || a.addedAt - b.addedAt;
    });

    let available = this.getInvestmentAvailable();
    return needs.map(need => {
      const status = available >= need.amount ? "Can cover" : "Pending";
      if (status === "Can cover") {
        available -= need.amount;
      }
      return { ...need, status };
    });
  }
}

// UI rendering class
class UIManager {
  constructor(dataManager) {
    this.dataManager = dataManager;
    this.elements = this.cacheElements();
    this.bindEvents();
  }

  // Cache DOM elements
  cacheElements() {
    return {
      inputEl: document.getElementById("input-amount"),
      ruleEl: document.getElementById("rule"),
      categoriesUl: document.getElementById("categories-ul"),
      inputSubmitBtn: document.getElementById("input-submit"),
      allocationSection: document.getElementById("allocation-section"),
      recordBtn: document.getElementById("record-btn"),
      homePage: document.getElementById("home-page"),
      balancePage: document.getElementById("balance-page"),
      budgetPage: document.getElementById("budget-page"),
      expensesPage: document.getElementById("expenses-page"),
      budgetForm: document.getElementById("budget-form"),
      budgetAvailableEl: document.getElementById("budget-available"),
      budgetedNeedsList: document.getElementById("budgeted-needs-list"),
      expenseForm: document.getElementById("expense-form"),
      expenseAccountEl: document.getElementById("expense-account"),
      expenseAmountEl: document.getElementById("expense-amount"),
      expensesList: document.getElementById("expenses-list")
    };
  }

  // Bind event listeners
  bindEvents() {
    // Navigation
    document.querySelectorAll('.nav-links button').forEach(btn => {
      btn.addEventListener('click', () => this.showPage(btn.dataset.page));
    });

    // Menu toggle
    document.querySelectorAll('.icon').forEach(icon => icon.addEventListener('click', () => this.toggleMenu()));
    document.querySelectorAll('.icon2').forEach(icon => icon.addEventListener('click', () => this.closeMenu()));

    // Income input
    this.elements.inputEl?.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        this.handleIncomeSubmit();
      }
    });
    this.elements.inputSubmitBtn?.addEventListener("click", () => this.handleIncomeSubmit());

    // Record categories
    this.elements.recordBtn?.addEventListener("click", () => this.handleRecordCategories());

    // Budget form
    this.elements.budgetForm?.addEventListener("submit", (event) => this.handleBudgetSubmit(event));

    // Expense form
    this.elements.expenseForm?.addEventListener("submit", (event) => this.handleExpenseSubmit(event));
  }

  // Navigation methods
  hideAllPages() {
    [this.elements.homePage, this.elements.balancePage, this.elements.budgetPage, this.elements.expensesPage].forEach(page => {
      if (page) page.style.display = "none";
    });
  }

  showPage(pageId) {
    this.hideAllPages();
    const page = this.elements[pageId];
    if (page) {
      page.style.display = "block";
      this.closeMenu();

      // Update specific page content
      switch(pageId) {
        case 'balancePage':
          this.displayBalance();
          break;
        case 'budgetPage':
          this.updateBudgetPage();
          break;
        case 'expensesPage':
          this.renderExpenseAccounts();
          this.renderExpenses();
          break;
      }
    }
  }

  toggleMenu() {
    const nav = document.getElementById('main-nav');
    const icon = document.querySelector(".icon");
    if (!nav) return;

    if (nav.classList.contains("active")) {
      nav.classList.remove("active");
      if (icon) icon.style.display = "block";
    } else {
      nav.classList.add("active");
      if (icon) icon.style.display = "none";
    }
  }

  closeMenu() {
    const nav = document.getElementById('main-nav');
    if (nav && nav.classList.contains("active")) {
      nav.classList.remove("active");
      const icon = document.querySelector(".icon");
      if (icon) icon.style.display = "block";
    }
  }

  // Income handling
  handleIncomeSubmit() {
    try {
      const income = Number(this.elements.inputEl.value);
      if (!Utils.validateAmount(income)) {
        throw new Error('Please enter a valid income amount.');
      }

      this.dataManager.categoriesArr = this.dataManager.calculatePortions(income);
      this.displayCategories(this.dataManager.categoriesArr);
      this.elements.allocationSection.style.display = "block";
      this.elements.inputEl.value = "";
    } catch (error) {
      Utils.showAlert(error.message);
    }
  }

  // Display categories
  displayCategories(categories) {
    this.elements.categoriesUl.innerHTML = categories
      .map(item => `
        <li>
          <span>${item.portion}</span>
          <span>#${Utils.formatMoney(item.amount)}</span>
          <span>${item.destination}</span>
        </li>
      `)
      .join("");
  }

  // Record categories
  handleRecordCategories() {
    this.dataManager.recordCategories();
    this.elements.allocationSection.style.display = "none";
    this.displayBalance();
    this.renderExpenseAccounts();
    this.updateBudgetPage();
  }

  // Balance display
  displayBalance() {
    const container = document.getElementById("portion-cards");
    if (!container) return;

    container.innerHTML = this.dataManager.balanceArr
      .map(item => `
        <section class="portion-card">
          <p>${item.portion}</p>
          <p><span>Total:</span><span class="portion-amount">#${Utils.formatMoney(item.amount)}</span></p>
        </section>
      `)
      .join("");
  }

  // Budget handling
  handleBudgetSubmit(event) {
    event.preventDefault();
    try {
      const name = document.getElementById("budget-name").value.trim();
      const amount = Number(document.getElementById("budget-amount").value);
      const priority = document.getElementById("budget-priority").value;

      this.dataManager.addBudgetNeed(name, amount, priority);
      this.elements.budgetForm.reset();
      this.updateBudgetPage();
    } catch (error) {
      Utils.showAlert(error.message);
    }
  }

  updateBudgetPage() {
    this.elements.budgetAvailableEl.textContent = `#${Utils.formatMoney(this.dataManager.getInvestmentAvailable())}`;
    this.displayBudgetNeeds();
  }

  displayBudgetNeeds() {
    const needsWithStatus = this.dataManager.computeBudgetStatuses();
    this.elements.budgetedNeedsList.innerHTML = needsWithStatus.length
      ? needsWithStatus.map(need => `
          <li>
            <span>${need.name}</span>
            <span>#${Utils.formatMoney(need.amount)}</span>
            <span>${need.status}</span>
          </li>
        `).join("")
      : `<li style="grid-template-columns: 1fr;">No needs saved yet.</li>`;
  }

  // Expense handling
  handleExpenseSubmit(event) {
    event.preventDefault();
    try {
      const account = this.elements.expenseAccountEl.value;
      const amount = Number(this.elements.expenseAmountEl.value);
      const description = document.getElementById("expense-description").value.trim();

      this.dataManager.addExpense(account, amount, description);
      this.elements.expenseForm.reset();
      this.displayBalance();
      this.renderExpenses();
      this.updateBudgetPage();
    } catch (error) {
      Utils.showAlert(error.message);
    }
  }

  renderExpenseAccounts() {
    this.elements.expenseAccountEl.innerHTML = this.dataManager.balanceArr
      .map(item => `<option value="${item.portion}">${item.portion}</option>`)
      .join("");
  }

  renderExpenses() {
    this.elements.expensesList.innerHTML = this.dataManager.expenses.length
      ? this.dataManager.expenses.map(item => `
          <li>
            <span>${item.account}</span>
            <span>#${Utils.formatMoney(item.amount)}</span>
            <span>${item.description}</span>
          </li>
        `).join("")
      : `<li style="grid-template-columns: 1fr;">No expenses recorded yet.</li>`;
  }

  // Rules display
  displayRules() {
    setInterval(() => {
      const randomIdx = Math.floor(Math.random() * CONFIG.RULES.length);
      this.elements.ruleEl.textContent = `-- ${CONFIG.RULES[randomIdx]} --`;
    }, 6000);
  }
}

// Main application class
class FinanceApp {
  constructor() {
    this.dataManager = new DataManager();
    this.uiManager = new UIManager(this.dataManager);

    // Initialize app
    this.initialize();
  }

  initialize() {
    // Set initial data if empty
    if (!this.dataManager.balanceArr.length) {
      this.dataManager.balanceArr = CONFIG.PORTION_CONFIG.map(config => ({
        portion: config.portion,
        amount: 0,
        destination: config.destination
      }));
    }

    // Initial renders
    this.uiManager.displayBalance();
    this.uiManager.updateBudgetPage();
    this.uiManager.renderExpenses();
    this.uiManager.renderExpenseAccounts();
    this.uiManager.displayRules();

    // Show home page
    this.uiManager.showPage('homePage');
  }
}

// Expose a global app instance so inline nav toggles work after hosting
let financeApp = null;

function toggleMenu() {
  financeApp?.uiManager?.toggleMenu();
}

function closeMenu() {
  financeApp?.uiManager?.closeMenu();
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
  financeApp = new FinanceApp();
});