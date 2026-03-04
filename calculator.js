
//Constants
const OPERATORS = new Set(['+', '−', '×', '÷']);
const OPERATIONS = {
    '+': (a, b) => a + b,
    '−': (a, b) => a - b,
    '×': (a, b) => a * b,
    '÷': (a, b) => a / b,
};
const MAX_DIGITS = 9;
const ERROR = 'Undefined';

// State
let tokens = ['0'];
let justEvaluated = false;
let isEndingWithOperator = false;

// DOM references
const UI = {
    display: document.getElementById('display'),
    expression: document.getElementById('expression'),
    clearBtn: document.getElementById('clearBtn'),
    keypad: document.querySelector('.keypad')
};

// update the current display
function updateDisplay() {
    UI.display.textContent = formatWithCommas(tokens);
    UI.clearBtn.textContent = (tokens.length === 1 && tokens[0] === '0') ? 'AC' : 'C';

    // Dynamic font sizing based on content length using a concise ternary
    const len = UI.display.textContent.length;
    UI.display.style.fontSize = len > 12 ? '1.2rem' : len > 9 ? '1.5rem' : len > 6 ? '2rem' : '';
}

/*
    Keypad Event Handlers
*/
function handleNumber(btnText) {
    if (justEvaluated || tokens[0] === ERROR) {
        resetCalculator(btnText);
    } else if (tokens.length === 1 && tokens[0] === '0') {
        tokens[0] = btnText;
    } else {
        if (isEndingWithOperator) {
            tokens.push(btnText);
        } else {
            // Check character limit on current number token
            if (getCurrentNumberLength(tokens.at(-1)) >= MAX_DIGITS) {
                return;
            }
            tokens[tokens.length - 1] += btnText;
        }
    }
    isEndingWithOperator = false;
}

function handleDecimal() {
    if (justEvaluated || tokens[0] === ERROR) {
        return resetCalculator('0.');
    }

    if (isEndingWithOperator) {
        tokens.push('0.');
        isEndingWithOperator = false;
    } else {
        const lastNumber = tokens.at(-1);
        if (!lastNumber.includes('.')) {
            tokens[tokens.length - 1] += '.';
        }
    }
}

function handleClear(btnText) {
    // Guard clause: Total reset scenarios
    if (btnText === 'AC' || tokens.length === 1) {
        return resetCalculator('0');
    }

    // Natural pop if it's 'C' deleting mid-equation
    tokens.pop();
    isEndingWithOperator = OPERATORS.has(tokens.at(-1));
}

function handleOperator(btnText) {
    if (tokens[0] === ERROR) return;

    if (!isEndingWithOperator) {
        if (justEvaluated) {
            UI.expression.textContent = '';
            justEvaluated = false;
        }
        tokens.push(btnText);
        isEndingWithOperator = true;
    } else {
        // Replace the last operator if one was already pressed
        tokens[tokens.length - 1] = btnText;
    }
}

function handleEquals() {
    if (isEndingWithOperator || tokens[0] === ERROR) return;

    const result = evaluate([...tokens]); // compute a copy of the tokens array
    UI.expression.textContent = formatWithCommas(tokens);

    if (!isFinite(result)) {
        tokens = [ERROR];
    } else {
        // For cases like 1/3 = 0.3333333333
        tokens = [String(parseFloat(result.toPrecision(10)))];
    }

    justEvaluated = true;
}

function handleBackspace() {
    if (justEvaluated || tokens[0] === ERROR) {
        return;
    }

    if (isEndingWithOperator) {
        tokens.pop();
        isEndingWithOperator = false;
        return;
    }

    const lastNumber = tokens.at(-1);

    if (lastNumber.length === 1 || (lastNumber.length === 2 && lastNumber.startsWith('-'))) {
        if (tokens.length === 1) {
            tokens = ['0'];
        } else {
            tokens.pop();
            isEndingWithOperator = true;
        }
    } else {
        tokens[tokens.length - 1] = lastNumber.slice(0, -1);
    }
}

function handlePercent() {
    if (isEndingWithOperator || tokens[0] === ERROR) {
        return;
    }

    // convert last token to percentage
    tokens[tokens.length - 1] = String(parseFloat(tokens.at(-1)) / 100);
}

function handlePlusMinus() {
    if (isEndingWithOperator || tokens[0] === ERROR) {
        return;
    }

    let lastNumber = tokens.at(-1);
    if (lastNumber === '0') {
        return;
    }

    // toggle negative/positive on the last number
    tokens[tokens.length - 1] = lastNumber.startsWith('-') ? lastNumber.slice(1) : '-' + lastNumber;
}

// add one listener on the keypad
UI.keypad.addEventListener('click', (event) => {
    const btn = event.target.closest('.btn');
    if (!btn) {
        return;
    }

    const action = btn.dataset.action;
    const value = btn.dataset.value;

    switch (action) {
        case 'number':
            handleNumber(value);
            break;
        case 'decimal':
            handleDecimal();
            break;
        case 'clear':
            handleClear(btn.textContent.trim()); // Still needs to know if AC or C was clicked visually
            break;
        case 'operator':
            handleOperator(value);
            break;
        case 'equals':
            handleEquals();
            break;
        case 'percent':
            handlePercent();
            break;
        case 'backspace':
            handleBackspace();
            break;
        case 'plusminus':
            handlePlusMinus();
            break;
    }

    updateDisplay();
});

/*
    Helper functions
*/

// Reset helper to dry out repeated state clearing logic
function resetCalculator(initialValue = '0') {
    tokens = [initialValue];
    UI.expression.textContent = '';
    justEvaluated = false;
    isEndingWithOperator = false;
}

// find what operators are grouped together and evaluate them
function processOperators(tokensArray, opsToProcess) {
    for (let i = 1; i < tokensArray.length; i += 2) {
        if (opsToProcess.includes(tokensArray[i])) {
            const num1 = parseFloat(tokensArray[i - 1]);
            const num2 = parseFloat(tokensArray[i + 1]);
            const result = OPERATIONS[tokensArray[i]](num1, num2);

            // replace the 3 tokens (num1, operator, num2) with the result
            tokensArray.splice(i - 1, 3, result);
            i -= 2; // step backward to re-evaluate after splice
        }
    }
}

function evaluate(tokensArray) {
    if (tokensArray.length === 0) return 0;

    // Evaluate Bedmas order by destructively mutating the array copy
    processOperators(tokensArray, ['×', '÷']);
    processOperators(tokensArray, ['+', '−']);

    return parseFloat(tokensArray[0]);
}

function formatWithCommas(tokensArray) {
    if (tokensArray[0] === ERROR)
        return ERROR;

    let result = '';

    for (let i = 0; i < tokensArray.length; i++) {
        const token = tokensArray[i];

        if (OPERATORS.has(token)) {
            result += token;
        } else {
            let formattedNum = formatSingleNumber(token);
            // Wrap negative numbers in parentheses if they come after an operator
            if (i > 0 && token.startsWith('-')) {
                formattedNum = `(${formattedNum})`;
            }
            result += formattedNum;
        }
    }

    return result;
}

function formatSingleNumber(numStr) {
    if (numStr === '' || numStr === '-')
        return numStr;

    const parts = numStr.split('.');
    const intPart = parts[0];
    const decPart = parts.length > 1 ? '.' + parts[1] : '';

    const sign = intPart.startsWith('-') ? '-' : '';
    let absInt = intPart.replace('-', '');

    //add commas in every 3 digits from the right side
    absInt = absInt.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    return sign + absInt + decPart;
}

// count the digits in the current number being typed 
function getCurrentNumberLength(numStr) {
    //count only digits, ignore '-' and '.'
    return numStr.replace(/[-.]/g, '').length;
}

//init
updateDisplay();
