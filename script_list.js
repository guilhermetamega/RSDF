const Modal = {
    open() {
        //Abrir overlay de transações
        document
            .querySelector('.modal-overlay')
            .classList
            .add('active')
    },
    close() {
        //Fechar overlay de transações
        Form.clearFields() // Limpa os campos ao se clicar em cancel
        document
            .querySelector('.modal-overlay')
            .classList
            .remove('active')
    }

}

const Storage = {
    get() {
        return JSON.parse(localStorage.getItem("task:numbers")) || []
    },
    set(tasks) {
        localStorage.setItem("task:numbers", JSON.stringify(tasks))
    }
}

const Task = {
    all: Storage.get(),
    //Adiciona itens à lista
    add(task) {
        Task.all.push(task)
        App.reload()
    },
    //Remove itens da lista
    remove(index) {
        Task.all.splice(index, 1)
        App.reload()
    },

    //Realiza os cálculos das tabelas de entrada, saída e total
    incomes() {
        //Somar as entradas de dinheiro

        let income = 0;
        Task.all.forEach(task => {
            if (task.amount > 0) {
                income += task.amount
            }
        })
        return income;
    },
    expenses() {
        //Somar as saídas

        let expense = 0;
        Task.all.forEach(task => {
            if (task.amount < 0) {
                expense += task.amount
            }
        })
        return expense;
    },
    total() {
        //Total= entradas - saídas

        return (Task.incomes() + Task.expenses());
    }
}

const DOM = {
    tasksContainer: document.querySelector('#data-table tbody'),
    addTask(task, index) {
        const tr = document.createElement('tr')
        tr.innerHTML = DOM.innerHTMLTask(task, index)
        tr.dataset.index = index

        DOM.tasksContainer.appendChild(tr)
    },
    //Função que é responsável por criar a transação no html
    innerHTMLTask(task, index) {
        //Verifica se o valor é positivo ou negativo
        const CSSclass = task.amount > 0 ? "income" :
            "expense"

        const amount = Utils.formatCurrency(task.amount)

        //Ao se usar ${} dentro de `` pode-se puxar variáveis de fora de um "texto"
        const html = `
                <td class="descripition">${task.description}</td>
                <td class="${CSSclass}">${amount}</td>
                <td class="date-initial">${task.date_i}</td>
                <td onclick="Task.remove(${index})">
                    <img src="./assets/minus.svg" alt="Remover Tarefa">
                </td>
        `
        return html
    },
    updateBalance() {
        document
            .getElementById('incomeDisplay')
            .innerHTML = Utils.formatCurrency(Task.incomes())
        document
            .getElementById('expenseDisplay')
            .innerHTML = Utils.formatCurrency(Task.expenses())
        document
            .getElementById('totalDisplay')
            .innerHTML = Utils.formatCurrency(Task.total())
    },
    clearTask() {
        DOM.tasksContainer.innerHTML = ""
    }
}

const Utils = {
    formatAmount(value) {
        value = Number(value) * 100
        return value
    },

    formatCurrency(value) {
        const signal = Number(value) < 0 ? "-" : ""

        // /\D/g procura por todos os números dentro do valor e substitui por outra coisa        
        value = String(value).replace(/\D/g, "")
        value = Number(value) / 100
        value = value.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        })

        return signal + value
    },

    formatDate(date_i) {
        const splittedDate = date_i.split("-")
        return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`
    }
}

const Form = {
    description: document.querySelector('input#task'),
    amount: document.querySelector('input#amount'),
    date_i: document.querySelector('input#date-initial'),

    getValues() {
        return {
            description: Form.description.value,
            amount: Form.amount.value,
            date_i: Form.date_i.value
        }
    },

    validateField() {
        const { description, amount, date_i } = Form.getValues()
        if (description.trim() === "" ||
            amount.trim() === "" ||
            date_i.trim() === "") {
            throw new Error("Preencha todos os campos antes de Salvar")
        }
    },

    formatValues() {
        let { description, amount, date_i } = Form.getValues()
        amount = Utils.formatAmount(amount)
        date_i = Utils.formatDate(date_i)
        return {
            description,
            amount,
            date_i
        }
    },

    clearFields() {
        Form.description.value = ""
        Form.amount.value = ""
        Form.date_i.value = ""
    },

    submit(event) {
        event.preventDefault()

        try {

            Form.validateField()
            const task = Form.formatValues()
            Task.add(task)
            Form.clearFields()
            Modal.close()
            App.reload()

        } catch (error) {
            alert(error.message)
        }
    }
}

const App = {
    init() {
        Task.all.forEach(DOM.addTask)

        DOM.updateBalance()
        Storage.set(Task.all)
    },
    reload() {
        DOM.clearTask()
        App.init()
    }
}

App.init()