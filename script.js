const inputEl = document.getElementById("input-amount");
const ruleEl = document.getElementById("rule");
const categoriesUl = document.getElementById("categories-ul");
const inputSubmitBtn = document.getElementById("input-submit");
const categoriesUlContainer = document.querySelector(".categories");

let categoriesArr;

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
      desination: "Church Acc",
    },
    {
      portion: "House needs",
      amount: (inputEl.value * 10) / 100,
      desination: "Church Acc",
    },
    {
      portion: "Data & Airtime",
      amount: (inputEl.value * 10) / 100,
      desination: "Church Acc",
    },
    {
      portion: "Transportation & Emergencies",
      amount: (inputEl.value * 10) / 100,
      desination: "Church Acc",
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
            <span>${item.portion}</span> <span>#${item.amount}</span> <span>${item.desination}</span>
          </li>`;
  });
}
