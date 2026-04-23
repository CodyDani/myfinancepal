const inputEl = document.getElementById("input-amount");
const ruleEl = document.getElementById("rule");
const categoriesUl = document.getElementById("categories-ul");
const inputSubmitBtn = document.getElementById("input-submit");
const categoriesUlContainer = document.querySelector(".categories");
const recordBtn = document.getElementById("record-btn");

let categoriesArr;
let rules = [
  "10% Tithe from every income",
  "Never Borrow to spend on Liability (Bad debt)",
  "Never Spend outside budget when opay cannot comfortably take it",
];

inputSubmitBtn.addEventListener("click", () => {
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

function formatMoney(amount) {
  return Number(amount).toLocaleString("en-US");
}

//Rules Display
function displayRules() {
  const eachRule = setInterval(() => {
    const randomIdx = Math.floor(Math.random() * rules.length);
    ruleEl.textContent = `-- ${rules[randomIdx]} --`;
  }, 6000);
}

displayRules();
