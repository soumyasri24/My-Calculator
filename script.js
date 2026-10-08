const display = document.getElementById("display");
const buttons = document.querySelectorAll(".btn");

const operators = ["+", "-", "*", "/"];

// ----- Tag buttons by role (for colors) -----
buttons.forEach(function(button) {
    const value = button.textContent;
    if (operators.includes(value)) {
        button.classList.add("operator");
    } else if (value === "=") {
        button.classList.add("equals");
    } else if (value === "C") {
        button.classList.add("clear");
    } else {
        button.classList.add("number");
    }
});

// ----- Click handler with press animation -----
buttons.forEach(function(button) {
    button.addEventListener("click", function() {
        button.classList.add("pressed");
        setTimeout(function() {
            button.classList.remove("pressed");
        }, 100);
        handleInput(button.textContent);
    });
});

// ----- Keyboard support -----
document.addEventListener("keydown", function(event) {
    const key = event.key;

    if (key === "Enter") {
        event.preventDefault();
        handleInput("=");
    } 
    else if (key === "Escape" || key === "Delete") {
        event.preventDefault();
        handleInput("C");
    } 
    else if (key === "Backspace") {
        event.preventDefault();
        handleBackspace();
    } 
    else if ("0123456789.+-*/".includes(key)) {
        event.preventDefault();
        handleInput(key);
    }
});

// ----- Main input handler -----
function handleInput(value) {
    if (display.value === "Error") {
        if (value === "C") {
            display.value = "";
            return;
        }
        if (value === "=") return;
        display.value = "";
    }

    const lastChar = display.value.slice(-1);

    if (value === "C") {
        display.value = "";
    } 
    else if (value === "=") {
        if (display.value !== "") {
            const result = calculate(display.value);
            if (result === undefined || !isFinite(result) || isNaN(result)) {
                display.value = "Error";
            } else {
                display.value = result;
            }
        }
    } 
    else if (operators.includes(value)) {
        if (display.value === "") return;
        if (operators.includes(lastChar)) {
            display.value = display.value.slice(0, -1) + value;
        } else {
            display.value = display.value + value;
        }
    } 
    else if (value === ".") {
        const parts = display.value.split(/[\+\-\*\/]/);
        const currentNumber = parts[parts.length - 1];
        if (!currentNumber.includes(".")) {
            if (currentNumber === "") {
                display.value = display.value + "0.";
            } else {
                display.value = display.value + ".";
            }
        }
    } 
    else {
        const parts = display.value.split(/[\+\-\*\/]/);
        const currentNumber = parts[parts.length - 1];
        if (currentNumber === "0") {
            display.value = display.value.slice(0, -1) + value;
        } else {
            display.value = display.value + value;
        }
    }
}

// ----- Backspace handler -----
function handleBackspace() {
    if (display.value === "Error") {
        display.value = "";
        return;
    }
    display.value = display.value.slice(0, -1);
}

// ----- Safe math parser -----
function calculate(expression) {
    const tokens = expression.match(/(\d+\.?\d*|[\+\-\*\/])/g);
    
    if (!tokens) return "";

    for (let i = 1; i < tokens.length; i += 2) {
        const op = tokens[i];
        if (op === "*" || op === "/") {
            const left = parseFloat(tokens[i - 1]);
            const right = parseFloat(tokens[i + 1]);
            const result = op === "*" ? left * right : left / right;
            
            tokens.splice(i - 1, 3, result);
            i -= 2;
        }
    }

    let result = parseFloat(tokens[0]);
    for (let i = 1; i < tokens.length; i += 2) {
        const op = tokens[i];
        const num = parseFloat(tokens[i + 1]);
        if (op === "+") result += num;
        else if (op === "-") result -= num;
    }

    return result;
}