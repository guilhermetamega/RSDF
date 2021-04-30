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

const Page = {
  open() {
    //Abrir overlay de transações
    document.querySelector(".page2").classList.add("active");
  },
};

const Storage = {
  get() {
    return JSON.parse(localStorage.getItem("task:numbers")) || [];
  },
  set(tasks) {
    localStorage.setItem("task:numbers", JSON.stringify(tasks));
  },
};

const Task = {
  all: Storage.get(),
  //Adiciona itens à lista
  add(task) {
    Task.all.push(task);
    App.reload();
  },
  //Remove itens da lista
  remove(index) {
    Task.all.splice(index, 1);
    App.reload();
  },
  //Adiciona ou remove a estrela com o clique
  star(index) {
    var tasks = Task.all;
    tasks[index].fav = !tasks[index].fav;
    Storage.set(tasks);
    App.reload();
  },
  //Marca como concluiído ou não
  done(index) {
    var tasks = Task.all;
    tasks[index].done = !tasks[index].done;
    Storage.set(tasks);
    App.reload();
  },
};

const Counter = {
  totalTasks() {
    return Task.all.length;
  },
  starCounter() {
    var tasks = Task.all;
    var favorites = tasks.reduce((total, valor) => {
      if (valor.fav === true) {
        return total + 1;
      }
      return total;
    }, 0);
    return favorites;
  },
  doneCounter() {
    var tasks = Task.all;
    var dones = tasks.reduce((total, valor) => {
      if (valor.done === true) {
        return total + 1;
      }
      return total;
    }, 0);
    return dones;
  },
};

const DOM = {
  tasksContainer: document.querySelector("#data-table tbody"),
  addTask(task, index) {
    const tr = document.createElement("tr");
    const image_star = task.fav
      ? "./assets/yellowStar.svg"
      : "./assets/rawstar.svg";
    const image_done = task.done
      ? "./assets/markedCheckBox.svg"
      : "./assets/unmarkCheckBox.svg";
    const html = `
                <td>
                <img onclick="Task.done(${index})" src="${image_done}" alt="Tarefa Realizada" class="svg done">
                </td>
                <td>
                <img onclick="Task.star(${index})" src="${image_star}" alt="Favorito" class="svg star">
                </td>
                <td class="descripition">${task.description}</td>
                <td class="date-initial">${task.date_i}</td>
                <td class="date-initial">${task.date_f}</td>
                <td onclick="Task.remove(${index})">
                    <img src="./assets/minus.svg" alt="Remover Tarefa">
                </td>
        `;
    tr.innerHTML = html;
    tr.dataset.index = index;

    DOM.tasksContainer.appendChild(tr);
  },
  clearTask() {
    DOM.tasksContainer.innerHTML = "";
  },
  updateBalance() {
    document.getElementById("totalDisplay").innerHTML = Counter.totalTasks();
    document.getElementById("mainTasksDisplay").innerHTML = Counter.starCounter();
    document.getElementById("completeTasksDisplay").innerHTML = Counter.doneCounter();
  },
};

const Utils = {
  formatDate_i(date_i) {
    const splittedDate = date_i.split("-");
    return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`;
  },
  formatDate_f(date_f) {
    const splittedDate = date_f.split("-");
    return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`;
  },
};

const Form = {
  description: document.querySelector("input#task"),
  date_i: document.querySelector("input#date-initial"),
  date_f: document.querySelector("input#date-final"),

  getValues() {
    return {
      description: Form.description.value,
      date_i: Form.date_i.value,
      date_f: Form.date_f.value,
      fav: false,
      done: false,
    };
  },

  validateField() {
    const { description, date_i, date_f } = Form.getValues();
    if (
      description.trim() === "" ||
      date_i.trim() === "" ||
      date_f.trim() === ""
    ) {
      throw new Error("Preencha todos os campos antes de Salvar");
    }
  },

  formatValues() {
    let { description, date_i, date_f, fav, done } = Form.getValues();
    date_i = Utils.formatDate_i(date_i);
    date_f = Utils.formatDate_f(date_f);
    return {
      description,
      date_i,
      date_f,
      fav,
      done,
    };
  },

  clearFields() {
    Form.description.value = "";
    Form.date_i.value = "";
    Form.date_f.value = "";
  },

  submit(event) {
    event.preventDefault();

    try {
      Form.validateField();
      const task = Form.formatValues();
      Task.add(task);
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
    Page.open();
    Task.all.forEach(DOM.addTask);
    DOM.updateBalance();

    Storage.set(Task.all);
  },
  reload() {
    DOM.clearTask();
    App.init();
  },
};
App.init();
