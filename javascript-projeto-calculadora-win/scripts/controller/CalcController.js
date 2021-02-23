class CalcController {
  constructor() {
    this._operation = [];
    this._lastOperation = "";
    this._lastNumber = "";
    this._displayCalcEl = document.querySelector("#display");
    this.initButtonsEvents();
    this.setLastNumberDisplay();
  }
  initButtonsEvents() {
    // iniciando os buttons
    let buttons = document.querySelectorAll("button");
    buttons.forEach((btn) => {
      btn.addEventListener("click", () => {
        let textBtn = btn.textContent;
        this.execBtn(textBtn);
      });
    });
  }
  getLastOperation() {
    return this._operation[this._operation.length - 1];
  }
  setLastOperation(value) {
    this._operation[this._operation.length - 1] = value;
  }
  isOperation(value) {
    return ["*", "%", "+", "-", "/", "¹/x", "x²", "²√x"].indexOf(value) > -1;
  }
  getLastItem(isOperation = true) {
    // salva o ultimo numero ou o ultimo operador digitado
    let lastItem;
    for (let i = this._operation.length - 1; i >= 0; i--) {
      if (this.isOperation(this._operation[i]) == isOperation) {
        lastItem = this._operation[i];
        break;
      }
    }
    if (!lastItem) {
      lastItem = isOperation ? this._lastOperation : this._lastNumber;
    }
    return lastItem;
  }
  pushOperation(value) {
    this._operation.push(value);
    if (this._operation.length > 3) {
      this.calc();
    }
  }
  getResult() {
    try {
      return eval(this._operation.join(""));
    } catch (error) {
      setTimeout(() => {
        this.setError();
      }, 100);
    }
  }
  setError() {
    this.displayCalc = "Operação Inválida!";
  }
  calc() {
    let last = "";
    this._lastOperation = this.getLastItem();
    if (this._operation.length < 3) {
      let firstItem = this._operation[0];
      if (this._lastNumber === "") {
        this._lastNumber = firstItem;
      }
      this._operation = [firstItem, this._lastOperation, this._lastNumber];
    }
    if (this._operation.length > 3) {
      last = this._operation.pop();
      this._lastNumber = this.getResult();
    } else if (this._operation.length == 3) {
      this._lastNumber = this.getLastItem(false);
    }

    let result = this.getResult();
    if (last == "%") {
      result /= 100;
      this._operation = [result];
    } else {
      this._operation = [result];
    }
    if (last) {
      this._operation.push(last);
    }
    this.setLastNumberDisplay();
  }
  setLastNumberDisplay() {
    console.log(this._operation);
    let lastNumber = this.getLastItem(false);
    if (!lastNumber) lastNumber = 0;
    this.displayCalc = lastNumber;
  }
  addOperation(value) {
    if (isNaN(this.getLastOperation())) {
      // este value não é um numero? se naõ for é true, entra aqui
      if (this.isOperation(value)) {
        this.setLastOperation(value); // passando o operador recebido para o array de operação
      } else {
        // this.isOperation(value);
        this.pushOperation(value);
        this.setLastNumberDisplay();
      }
    } else {
      if (this.isOperation(value)) {
        this.pushOperation(value);
      } else {
        let newValue = this.getLastOperation().toString() + value.toString();
        this.setLastOperation(newValue);
        this.setLastNumberDisplay();
      }
    }
    // console.log(this._operation);
  }
  clearAll() {
    this._operation = [];
    this._lastNumber = "";
    this._lastOperation = "";
    this.setLastNumberDisplay();
  }
  clearEntry() {
    this._operation.pop();
    this.setLastNumberDisplay();
  }
  addScore() {
    let lastOperation = this.getLastOperation();
    if (
      typeof lastOperation === "string" &&
      lastOperation.split("").indexOf(".") > -1
    )
      return;
    if (this.isOperation(lastOperation) || !lastOperation) {
      this.pushOperation("0,");
    } else {
      this.setLastOperation(lastOperation.toString() + ".");
    }
    this.setLastNumberDisplay();
  }
  clearOne() {
    let last = this._operation.join("").split("");
    let remove = last.pop();
    this._operation = [last.join("")];
    this.setLastNumberDisplay();
  }
  execBtn(value) {
    // fazendo a condição caso o elemento seja selecionado
    switch (value) {
      case "c":
        this.clearAll();
        break;
      case "ce":
        this.clearEntry();
        break;
      case "←":
        this.clearOne();
        break;
      case "%":
        this.addOperation("%");
        break;
      case "+":
        this.addOperation("+");
        break;
      case "-":
        this.addOperation("-");
        break;
      case "x":
        this.addOperation("*");
        break;
      case "÷":
        this.addOperation("/");
        break;
      case "¹/x":
        // this.addOperation("¹/x");
        break;
      case "²√x":
        // this.addOperation("¹/x");
        break;
      case "x²":
        this.addOperation("x²");
        break;
      case "=":
        this.calc();
        break;
      case ".":
        this.addScore();
        break;
      case "±":
        // precisa ser Preenchido
        break;
      case "0":
      case "1":
      case "2":
      case "3":
      case "4":
      case "5":
      case "6":
      case "7":
      case "8":
      case "9":
        this.addOperation(parseInt(value));
        break;
      default:
        // this.setError();
        break;
    }
  }
  get displayCalc() {
    return this._displayCalcEl.innerHTML;
  }
  set displayCalc(valor) {
    this._displayCalcEl.innerHTML = valor;
  }
}
