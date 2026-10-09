const currentOperandElement = document.getElementById("current-operand");
const previousOperandElement = document.getElementById("previous-operand");
const buttons = document.querySelector(".buttons");

let currentOperand = "0";
let previousOperand = "";
let operation = null;
let shouldResetScreen = false;

// Visor
function updateDisplay() {
    currentOperandElement.textContent = currentOperand;

    previousOperandElement.textContent = operation
        ? `${previousOperand} ${getOperatorSymbol(operation)}`
        : "";
}

function getOperatorSymbol(operator) {
    const symbols = {
        "+": "+",
        "-": "−",
        "*": "×",
        "/": "÷"
    };

    return symbols[operator] || operator;
}

// Entrada de números
function appendNumber(number) {
    if (shouldResetScreen) {
        currentOperand = number;
        shouldResetScreen = false;
    } else if (currentOperand === "0") {
        currentOperand = number;
    } else {
        currentOperand += number;
    }

    updateDisplay();
}

function appendDecimal() {
    if (shouldResetScreen) {
        currentOperand = "0";
        shouldResetScreen = false;
    }

    if (!currentOperand.includes(".")) {
        currentOperand += ".";
    }

    updateDisplay();
}

// Operações matemáticas
function chooseOperation(operator) {
    if (currentOperand === "Erro") return;

    if (operation !== null && !shouldResetScreen) {
        calculate();
    }

    previousOperand = currentOperand;
    operation = operator;
    shouldResetScreen = true;

    updateDisplay();
}

function calculate() {
    if (operation === null || previousOperand === "") return;

    const firstNumber = Number(previousOperand);
    const secondNumber = Number(currentOperand);
    let result;

    switch (operation) {
        case "+":
            result = firstNumber + secondNumber;
            break;

        case "-":
            result = firstNumber - secondNumber;
            break;

        case "*":
            result = firstNumber * secondNumber;
            break;

        case "/":
            if (secondNumber === 0) {
                currentOperand = "Erro";
                previousOperand = "";
                operation = null;
                shouldResetScreen = true;
                updateDisplay();
                return;
            }

            result = firstNumber / secondNumber;
            break;

        default:
            return;
    }

    if (!Number.isFinite(result)) {
        currentOperand = "Erro";
    } else {
        currentOperand = String(Number(result.toPrecision(12)));
    }

    previousOperand = "";
    operation = null;
    shouldResetScreen = true;

    updateDisplay();
}

// Limpeza e exclusão
function clearCalculator() {
    currentOperand = "0";
    previousOperand = "";
    operation = null;
    shouldResetScreen = false;

    updateDisplay();
}

function deleteNumber() {
    if (shouldResetScreen || currentOperand === "Erro") {
        currentOperand = "0";
        shouldResetScreen = false;
    } else {
        currentOperand = currentOperand.slice(0, -1) || "0";
    }

    updateDisplay();
}

// Eventos dos botões
buttons.addEventListener("click", (event) => {
    const button = event.target.closest("button");

    if (!button) return;

    if (button.dataset.number !== undefined) {
        appendNumber(button.dataset.number);
        return;
    }

    if (button.dataset.operation) {
        chooseOperation(button.dataset.operation);
        return;
    }

    switch (button.dataset.action) {
        case "clear":
            clearCalculator();
            break;

        case "delete":
            deleteNumber();
            break;

        case "decimal":
            appendDecimal();
            break;

        case "calculate":
            calculate();
            break;
    }
});

// Atalhos de teclado
document.addEventListener("keydown", (event) => {
    const key = event.key;

    if (/^[0-9]$/.test(key)) {
        appendNumber(key);
    } else if (key === ".") {
        appendDecimal();
    } else if (["+", "-", "*", "/"].includes(key)) {
        chooseOperation(key);
    } else if (key === "Enter" || key === "=") {
        event.preventDefault();
        calculate();
    } else if (key === "Backspace") {
        deleteNumber();
    } else if (key === "Escape") {
        clearCalculator();
    }
});

// Inicialização
updateDisplay();