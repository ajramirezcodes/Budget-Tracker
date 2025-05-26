const budget = document.getElementById("budget");
const budgetInput = document.getElementById("budgetInput");
const budgetButton = document.getElementById("budgetButton");
const expenses = document.getElementById("expenses");
const categoryInput = document.getElementById("categoryInput");
const descriptionInput = document.getElementById("descriptionInput");
const expenseInput = document.getElementById("expenseInput");
const expenseButton = document.getElementById("expenseButton");
const budgetPrice = document.getElementById("budgetPrice");
const expenseList = document.getElementById("expenseList");
const divider = document.getElementById("divider");
const total = document.getElementById("total");
const leftoverAmount = document.getElementById("leftoverAmount")
const filterCategory = document.getElementById("filter");
const categoryTotal = document.getElementById("categoryTotal");
const clearBtn = document.getElementById("clearBtn");



let currentBudget = 0;
let totalExpenses = 0;
let expenseData = [];



function saveToLocalStorage() {
        localStorage.setItem("budget", currentBudget);
        localStorage.setItem("expenses", JSON.stringify(expenseData));
}



budgetButton.addEventListener("click", (e) => {

    e.preventDefault();

    const budgetValue = parseFloat(budgetInput.value);

    if (isNaN(budgetValue) || budgetValue <= 0) {
            alert("Please enter a valid budget amount!")
            return;
    }

    currentBudget = budgetValue;
    budgetPrice.innerText = `Budget: $${budgetValue.toFixed(2)}`;
    budgetInput.value = "";

    updateLeftOver()

})



expenseButton.addEventListener("click", (e) => {
        e.preventDefault();

        const category = categoryInput.value.trim();
        const description = descriptionInput.value.trim();
        const expense = parseFloat(expenseInput.value)

        if (!category || isNaN(expense) || expense <= 0) {
                alert("Please enter valid expenses!");
                return;
        }

        totalExpenses += expense

        const expenseItem = document.createElement("p");
        const categoryText = document.createTextNode(`${category}: `);
        const expenseCost = document.createElement("span");
        const descriptionText = document.createTextNode(` - ${description}`);

        expenseCost.textContent = `$${expense.toFixed(2)}`;
        expenseCost.style.color = "red";
        expenseCost.style.fontWeight = "bold";
        
        

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "❌";
        deleteBtn.style.marginLeft = "10px";
        deleteBtn.style.cursor = "pointer";
        deleteBtn.style.fontSize = "8px";
        deleteBtn.style.padding = "1px";

        expenseItem.appendChild(categoryText);
        expenseItem.appendChild(expenseCost);

        if (descriptionInput.value !== "") {
                expenseItem.appendChild(descriptionText);
        }
        
        expenseItem.appendChild(deleteBtn);    

        expenseList.appendChild(expenseItem);


        expenseData.push({
        category: category,
        amount: expense,
        description: description,
        element: expenseItem,
});



        categoryInput.value = "";
        descriptionInput.value = "";
        expenseInput.value = "";

        divider.style.visibility = "visible"
        total.style.visibility = "visible";


      
        updateLeftOver();
        saveToLocalStorage();



        deleteBtn.addEventListener("click", (e) => {
                e.preventDefault();

                expenseList.removeChild(expenseItem);
                totalExpenses -= expense
                updateLeftOver();
                saveToLocalStorage();

        })


});


function updateLeftOver() {
        

        const leftOver = currentBudget - totalExpenses;
        
        let displayAmount = Math.abs(leftOver).toFixed(2);

        if (leftOver < 0) {
                leftoverAmount.textContent = `- $${displayAmount}`;
                leftoverAmount.style.color = "red";
        } else if (leftOver > 0) {
                leftoverAmount.textContent = `$${displayAmount}`;
                leftoverAmount.style.color = leftOver > 0 ? "green" : "black"
        }
}


filterCategory.addEventListener("change", (e) => {
                e.preventDefault();

                const selected = filterCategory.value.toLowerCase();
                let sum = 0;

                expenseData.forEach((item) => {
                        if (selected === "all" || selected === item.category.toLowerCase()) {
                                item.element.style.display = "block";
                                if (selected !== "all") {
                                        sum += item.amount;
                                }
                        } else {
                                item.element.style.display = "none";
                        }
                })

                if (selected === "all") {
                                categoryTotal.textContent = "";
                } else {
                        categoryTotal.textContent = `Total for ${selected}: $${sum.toFixed(2)}`;
                }
});




window.addEventListener("DOMContentLoaded", () => {
        const storedBudget = localStorage.getItem("budget");
        const storedExpenses = localStorage.getItem("expenses");

        if (storedBudget) {
                currentBudget = parseFloat(storedBudget);
                budgetPrice.textContent = `Budget: $${currentBudget.toFixed(2)}`; 
        }

        if (storedExpenses) {
                expenseData = JSON.parse(storedExpenses);
                totalExpenses = 0;

                expenseData.forEach((item) => {
                        const { category, amount, description } = item;
                        totalExpenses += amount;

                                const expenseItem = document.createElement("p");
                                const categoryText = document.createTextNode(`${category}: `);
                                const expenseCost = document.createElement("span");
                                const descriptionText = document.createTextNode(` - ${description}`);

                                expenseCost.textContent = `$${amount.toFixed(2)}`;
                                expenseCost.style.color = "red";
                                expenseCost.style.fontWeight = "bold";

                                const deleteBtn = document.createElement("button");
                                deleteBtn.textContent = "❌";
                                deleteBtn.style.marginLeft = "10px";
                                deleteBtn.style.cursor = "pointer";
                                deleteBtn.style.fontSize = "8px";
                                deleteBtn.style.padding = "1px";
                                
                                

                        deleteBtn.addEventListener("click", () => {
                                expenseList.removeChild(expenseItem);
                                totalExpenses -= amount;
                                expenseData = expenseData.filter(e => e !== item);
                                saveToLocalStorage();
                                updateLeftOver();
                        });

                                expenseItem.appendChild(categoryText);
                                expenseItem.appendChild(expenseCost);
                        
                        if (description) {
                                expenseItem.appendChild(descriptionText);
                         }
                                expenseItem.appendChild(deleteBtn);

                                expenseList.appendChild(expenseItem);

                            item.element = expenseItem;

                });

                                divider.style.visibility = "visible";
                                total.style.visibility = "visible";
                                 
                                updateLeftOver();
        }
})


clearBtn.addEventListener("click", (e) => {
        e.preventDefault();

        if (confirm("Are you sure you want to clear all entries?")) {
                localStorage.clear();
                expenseData = [];
                currentBudget = 0;
                totalExpenses = 0;
                budgetPrice.textContent = "";
                expenseList.innerHTML = "";
                leftoverAmount.textContent = "";
                divider.style.visibility = "hidden";
                total.style.visbility = "hidden";        
        }
})


