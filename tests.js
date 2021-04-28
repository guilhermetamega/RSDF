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

    //Star sistem
    favImage() {
      var list = document.querySelector("tbody");
      list.addEventListener(
        "click",
        function (ev) {
          if ((ev.target.tagName = "img")) {
            if(ev.target.matches(".fav")){
            ev.target.src = "./assets/yellowStar.svg";
          }else{
            ev.target.src = "./assets/rawStar.svg";
          }
          }
        },
        false
      );
    },
  
    star() {
      var list = document.querySelector("tbody");
      list.addEventListener(
        "click",
        function (ev) {
          if ((ev.target.tagName = "img")) {
            ev.target.classList.toggle("fav");
          }
        },
        false
      );
      Task.favImage();
    },
  };
  
  const Counter = {
    totalTasks() {
      return Task.all.length;
    },
  };
  
  const DOM = {
    tasksContainer: document.querySelector("#data-table tbody"),
    addTask(task, index) {
      const tr = document.createElement("tr");
      const html = `
                  <td>
                  <img onclick = "Task.star()" src="./assets/rawstar.svg" alt="Favorito" class="svg star">
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
    //Função que é responsável por criar a transação no html
    // innerHTMLTask(task, index) {
    //   //Ao se usar ${} dentro de `` pode-se puxar variáveis de fora de um "texto"
    //   const html = `
    //               <td onclick = "Task.favImage()">
    //               <img src="./assets/rawstar.svg" alt="Minha linda imagem em SVG" class="fav svg">
    //               </td>
    //               <td class="descripition">${task.description}</td>
    //               <td class="date-initial">${task.date_i}</td>
    //               <td class="date-initial">${task.date_f}</td>
    //               <td onclick="Task.remove(${index})">
    //                   <img src="./assets/minus.svg" alt="Remover Tarefa">
    //               </td>
    //       `;
    //   return html;
    // },
    clearTask() {
      DOM.tasksContainer.innerHTML = "";
    },
    updateBalance() {
      document.getElementById("totalDisplay").innerHTML = Counter.totalTasks();
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
      let { description, date_i, date_f } = Form.getValues();
      date_i = Utils.formatDate_i(date_i);
      date_f = Utils.formatDate_f(date_f);
      return {
        description,
        date_i,
        date_f,
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
  