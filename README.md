# Calculator

![Image](https://github.com/user-attachments/assets/ed2d888b-a509-4750-9e82-44a5f14a2566)

A robust, responsive web-based calculator built from scratch using vanilla JavaScript, HTML, and CSS. This project features a custom mathematical evaluation engine handling the Order of Operations (BEDMAS), a dynamic UI with light/dark modes, and a clean code structure without external dependencies.

## 🚀 Live Demo

[View Live Demo](https://nadavramon.github.io/Calculator/calculator.html)

## ✨ Features

- **Arithmetic Operations:** Supports addition, subtraction, multiplication, and division.
- **Order of Operations (BEDMAS):** Uses a custom parser to correctly evaluate multiplication and division before addition and subtraction.
- **Dark & Light Themes:** Includes a CSS-only toggle switch that instantly swaps color variables for a seamless theme change.
- **Dynamic Display:** Automatically resizes text as numbers get longer to prevent overflow and maintain readability.
- **Smart Formatting:**
  - Real-time comma separation for large numbers (e.g., `1,000,000`).
  - Precision handling to mitigate standard floating-point errors.
- **Advanced Inputs:** Support for percentages, decimals, and sign toggling (positive/negative).

## 🛠️ Tech Stack

- **HTML5:** Semantic structure.
- **CSS3:** Flexbox, Grid, CSS Variables (Custom Properties), and advanced selectors for theming.
- **JavaScript (ES6+):**
  - Array manipulation for token management.
  - Event delegation for efficient keypad handling.
  - DOM manipulation for dynamic updates.

## ⚙️ How It Works

Unlike simple calculators that use the potentially unsafe `eval()` function, this project implements a safe, token-based evaluation system:

1. **Tokenization:** User input is stored in a `tokens` array (e.g., `['12', '+', '5', '×', '2']`).
2. **Parsing:** When `=` is pressed, the `evaluate()` function processes the array.
3. **BEDMAS Execution:**
   - It first iterates through the tokens to calculate high-priority operators (`×`, `÷`).
   - It then performs a second pass for lower-priority operators (`+`, `−`).
   - The result is sanitized to a fixed precision to handle JavaScript floating-point quirks.

## 📂 Project Structure

```text
/
├── calculator.html   # Main HTML structure
├── calculator.css    # Styles, themes, and responsive layout
├── calculator.js     # Core logic, state management, and event listeners
└── README.md         # Project documentation
```

## 🔧 Installation & Usage

Since this project uses standard web technologies, no build steps or package managers are required.

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/nadavramon/Calculator.git](https://github.com/nadavramon/Calculator.git)
   ```

2. **Navigate to the directory:**
   ```bash
   cd Calculator
   ```

3. **Run the app:**
   Simply open `calculator.html` in your preferred web browser.

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

*Built by Nadav Ramon*