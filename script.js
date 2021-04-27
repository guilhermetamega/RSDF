const Modal = {
  open() {
    //Abrir overlay de transações
    document.querySelector(".modal-overlay").classList.add("active");
  },
  close() {
    //Fechar overlay de transações
    Form.clearFields(); // Limpa os campos ao se clicar em cancel
    document.querySelector(".modal-overlay").classList.remove("active");
  },
};

const Storage = {
  get() {
    return JSON.parse(localStorage.getItem("banco:transactions")) || [];
  },
  set(transactions) {
    localStorage.setItem("banco:transactions", JSON.stringify(transactions));
  },
};

const Transaction = {
  all: Storage.get(),
  //Adiciona itens à lista
  add(transaction) {
    Transaction.all.push(transaction);
    App.reload();
  },
  //Remove itens da lista
  remove(index) {
    Transaction.all.splice(index, 1);
    App.reload();
  },

  //Realiza os cálculos das tabelas de entrada, saída e total
  incomes() {
    //Somar as entradas de dinheiro

    let income = 0;
    Transaction.all.forEach((transaction) => {
      if (transaction.amount > 0) {
        income += transaction.amount;
      }
    });
    return income;
  },
  expenses() {
    //Somar as saídas

    let expense = 0;
    Transaction.all.forEach((transaction) => {
      if (transaction.amount < 0) {
        expense += transaction.amount;
      }
    });
    return expense;
  },
  total() {
    //Total= entradas - saídas

    return Transaction.incomes() + Transaction.expenses();
  },
};

const DOM = {
  transactionsContainer: document.querySelector("#data-table tbody"),
  addTransaction(transaction, index) {
    const tr = document.createElement("tr");
    tr.innerHTML = DOM.innerHTMLTransaction(transaction, index);
    tr.dataset.index = index;

    DOM.transactionsContainer.appendChild(tr);
  },
  //Função que é responsável por criar a transação no html
  innerHTMLTransaction(transaction, index) {
    //Verifica se o valor é positivo ou negativo
    const CSSclass = transaction.amount > 0 ? "income" : "expense";

    const amount = Utils.formatCurrency(transaction.amount);

    //Ao se usar ${} dentro de `` pode-se puxar variáveis de fora de um "texto"
    const html = `
                <td class="descripition">${transaction.description}</td>
                <td class="${CSSclass}">${amount}</td>
                <td class="date">${transaction.date}</td>
                <td onclick="Transaction.remove(${index})">
                    <img src="./assets/minus.svg" alt="Remover transação">
                </td>
        `;
    return html;
  },
  updateBalance() {
    document.getElementById("incomeDisplay").innerHTML = Utils.formatCurrency(
      Transaction.incomes()
    );
    document.getElementById("expenseDisplay").innerHTML = Utils.formatCurrency(
      Transaction.expenses()
    );
    document.getElementById("totalDisplay").innerHTML = Utils.formatCurrency(
      Transaction.total()
    );
  },
  clearTransactions() {
    DOM.transactionsContainer.innerHTML = "";
  },
};

const Utils = {
  formatAmount(value) {
    value = Number(value) * 100;
    return value;
  },

  formatCurrency(value) {
    const signal = Number(value) < 0 ? "-" : "";

    // /\D/g procura por todos os números dentro do valor e substitui por outra coisa
    value = String(value).replace(/\D/g, "");
    value = Number(value) / 100;
    value = value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

    return signal + value;
  },

  formatDate(date) {
    const splittedDate = date.split("-");
    return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`;
  },
};

const Form = {
  description: document.querySelector("input#description"),
  amount: document.querySelector("input#amount"),
  date: document.querySelector("input#date"),

  getValues() {
    return {
      description: Form.description.value,
      amount: Form.amount.value,
      date: Form.date.value,
    };
  },

  validateField() {
    const { description, amount, date } = Form.getValues();
    if (
      description.trim() === "" ||
      amount.trim() === "" ||
      date.trim() === ""
    ) {
      throw new Error("Preencha todos os campos antes de Salvar");
    }
  },

  formatValues() {
    let { description, amount, date } = Form.getValues();
    amount = Utils.formatAmount(amount);
    date = Utils.formatDate(date);
    return {
      description,
      amount,
      date,
    };
  },

  clearFields() {
    Form.description.value = "";
    Form.amount.value = "";
    Form.date.value = "";
  },

  submit(event) {
    event.preventDefault();

    try {
      Form.validateField();
      const transaction = Form.formatValues();
      Transaction.add(transaction);
      Form.clearFields();
      Modal.close();
      App.reload();
    } catch (error) {
      alert(error.message);
    }
  },
};

const App = {
  init() {
    Transaction.all.forEach(DOM.addTransaction);

    DOM.updateBalance();
    Storage.set(Transaction.all);
  },
  reload() {
    DOM.clearTransactions();
    App.init();
  },
};

//Adicionar manualmente um "tr"
//DOM.addTransaction(transactions[0])
//forEach significa que para cada transaction será repetida a function abaixo
App.init();
