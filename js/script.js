const displayMain = document.getElementById('displayMain');
const displayTop = document.getElementById('displayTop');
const buttons = document.querySelectorAll('.buttons button');
  
    let firstOperand = '';
    let currentOperator = '';
    let currentInput = '';
    let resultShown = false;
    let memoryValue = 0;
  
    function updateDisplay() {
      displayMain.textContent = currentInput || '0';
      displayTop.textContent = firstOperand
        ? `${firstOperand} ${currentOperator}`
        : '';
    }
  
    function safeEval(expr) {
      try {
        return Function('"use strict"; return (' + expr + ')')();
      } catch {
        return 'Error';
      }
    }
    buttons.forEach((button) => {
        button.addEventListener('click', () => {
          const symbolMap = { '÷': '/', '×': '*' };
          let value = symbolMap[button.textContent] || button.textContent;
      
          // 🔁 Move this to the top so it doesn't get skipped
          if (button.classList.contains('convert')) {
            const evaluated = safeEval(currentInput || '0');
            const currentVal = parseInt(evaluated);
            if (isNaN(currentVal)) return;
      
            const type = button.dataset.convert;
            if (type === 'bin') currentInput = currentVal.toString(2);
            else if (type === 'oct') currentInput = currentVal.toString(8);
            else if (type === 'hex') currentInput = currentVal.toString(16).toUpperCase();
      
            resultShown = true;
            updateDisplay(); 
            return; c
          }
     
          if (!isNaN(value) || value === '.') {
            if (resultShown) {
              currentInput = '';
              resultShown = false;
            }
            if (value === '.' && currentInput.includes('.')) return;
            currentInput += value;
      
          } else if (['+', '-', '*', '/'].includes(value)) {
            if (currentInput === '') return;
            if (firstOperand && currentOperator && currentInput) {
              const result = safeEval(`${firstOperand}${currentOperator}${currentInput}`);
              firstOperand = result.toString();
            } else {
              firstOperand = currentInput;
            }
            currentOperator = value;
            currentInput = '';
      
          } else if (value === '=') {
            if (!firstOperand || !currentOperator || !currentInput) return;
            const expression = `${firstOperand}${currentOperator}${currentInput}`;
            const result = safeEval(expression);
            displayTop.textContent = `${expression} =`;
            currentInput = result.toString();
            firstOperand = '';
            currentOperator = '';
            resultShown = true;
      
          } else if (value === 'C') {
            currentInput = '';
            firstOperand = '';
            currentOperator = '';
            resultShown = false;
      
          } else if (value === 'CE') {
            currentInput = '';
      
          } else if (value === '←') {
            if (!resultShown) {
              currentInput = currentInput.slice(0, -1);
            }
      
          } else if (value === 'x²') {
            if (!resultShown && currentInput) {
              currentInput = `(${currentInput})**2`;
            }
      
          } else if (value === '√x') {
            if (!resultShown && currentInput) {
              currentInput = `Math.sqrt(${currentInput})`;
            }
      
          } else if (value === '1/x') {
            if (!resultShown && currentInput) {
              currentInput = `1/(${currentInput})`;
            }
      
          } else if (value === '%') {
            const evaluated = safeEval(currentInput || '0');
            const currentVal = parseFloat(evaluated);
            if (!isNaN(currentVal)) {
              currentInput = (currentVal / 100).toString();
            }
      
          } else if (value === '+/-') {
            if (currentInput.startsWith('-')) {
              currentInput = currentInput.slice(1);
            } else if (currentInput) {
              currentInput = '-' + currentInput;
            }
      
          } else if (['MC', 'MR', 'M+', 'M-'].includes(value)) {
            if (value === 'MC') {
              memoryValue = 0;
            } else if (value === 'MR') {
              currentInput = memoryValue.toString();
              resultShown = false;
            } else {
              const evaluated = safeEval(currentInput || '0');
              const currentVal = parseFloat(evaluated);
              if (isNaN(currentVal)) return;
              if (value === 'M+') memoryValue += currentVal;
              else if (value === 'M-') memoryValue -= currentVal;
            }
          }
      
          updateDisplay();
    });
});
      
