const inputEl = document.getElementById("input-amount");
const ruleEl = document.getElementById("rule");
const categoriesUl = document.getElementById("categories-ul");
const inputSubmitBtn = document.getElementById("input-submit");
const categoriesUlContainer = document.querySelector(".categories");
const recordBtn = document.getElementById("record-btn");
const homePage = document.getElementById("home-page");
const balancePage = document.getElementById("balance-page");

let balanceArr = [
  {
    portion: "Tithe",
    amount: 0,
    desination: "Church Acc",
  },
  {
    portion: "Giving",
    amount: 0,
    desination: "Palmpay Acc",
  },
  {
    portion: "Investment & Saving for Budgeted Needs",
    amount: 0,
    desination: "Moniepoint Acc",
  },
  {
    portion: "House needs",
    amount: 0,
    desination: "Kuda Acc",
  },
  {
    portion: "Data & Airtime",
    amount: 0,
    desination: "Smartcash Acc",
  },
  {
    portion: "Transportation & Emergencies",
    amount: 0,
    desination: "Opay Acc",
  },
];
let categoriesArr;
let rules = [
  "10% Tithe from every income",
  "Never Borrow to spend on Liability (Bad debt)",
  "Never Spend outside budget when opay cannot comfortably take it",
];

inputEl.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    inputSubmitBtn.click();
  } else return;
});

inputSubmitBtn.addEventListener("click", () => {
  if (inputEl.value.length === 0) return;
  categoriesArr = [
    {
      portion: "Tithe",
      amount: (inputEl.value * 10) / 100,
      desination: "Church Acc",
    },
    {
      portion: "Giving",
      amount: (inputEl.value * 30) / 100,
      desination: "Palmpay Acc",
    },
    {
      portion: "Investment & Saving for Budgeted Needs",
      amount: (inputEl.value * 30) / 100,
      desination: "Moniepoint Acc",
    },
    {
      portion: "House needs",
      amount: (inputEl.value * 10) / 100,
      desination: "Kuda Acc",
    },
    {
      portion: "Data & Airtime",
      amount: (inputEl.value * 10) / 100,
      desination: "Smartcash Acc",
    },
    {
      portion: "Transportation & Emergencies",
      amount: (inputEl.value * 10) / 100,
      desination: "Opay Acc",
    },
  ];

  inputEl.value = "";

  if (categoriesArr) {
    categoriesUlContainer.style.display = "block";
    displayPortions();
  }
});

function displayPortions() {
  categoriesUl.innerHTML = "";
  categoriesArr.forEach((item) => {
    categoriesUl.innerHTML += `            <li>
            <span>${item.portion}</span> <span>#${formatMoney(item.amount)}</span> <span>${item.desination}</span>
          </li>`;
  });
}

recordBtn.addEventListener("click", () => {
  recordCategories();
});

function recordCategories() {
  // categoriesArr.forEach((aItem) => {
  //   const bItem = balanceArr.find((b) => b.portion === aItem.portion);
  //   if (bItem) {
  //     bItem.amount += aItem.amount; // Add amounts if names match
  //   } else {
  //     balanceArr.push({ ...aItem }); // Optional: add if it doesn't exist
  //   }
  // });

  // console.log(balanceArr);

  const bMap = new Map(balanceArr.map((item) => [item.portion, item]));
  categoriesArr.forEach((aItem) => {
    if (bMap.has(aItem.portion)) {
      bMap.get(aItem.portion).amount += aItem.amount;
    }
  });

  displayBalance();
}

function displayBalance() {
  const portionCardContainer = document.getElementById("portion-cards");

  const balance = balanceArr
    .map(
      (item) =>
        `<section class="portion-card">
        <p>${item.portion}</p>
        <p>
          <span>Total:</span> <span class="portion-amount">#${formatMoney(item.amount)}</span>
        </p>
      </section>`,
    )
    .join("");

  portionCardContainer.innerHTML = balance;
}

function showHomePage() {
  homePage.style.display = "block";
  balancePage.style.display = "none";
}

function showBalance() {
  homePage.style.display = "none";
  balancePage.style.display = "block";
  displayBalance();
}

//Format Money
function formatMoney(amount) {
  return Number(amount).toLocaleString("en-US");
}

//Humburger Function
function toggleMenu() {
  let x = document.getElementById("myLinks");
  let icon = document.querySelector(".icon");
  if (x.className === "nav-links") {
    x.className += " active";
    icon.style.display = "none";
  } else {
    x.className = "nav-links";
    icon.style.display = "block";
  }
}

//Rules Display
function displayRules() {
  const eachRule = setInterval(() => {
    const randomIdx = Math.floor(Math.random() * rules.length);
    ruleEl.textContent = `-- ${rules[randomIdx]} --`;
  }, 6000);
}

displayRules();
