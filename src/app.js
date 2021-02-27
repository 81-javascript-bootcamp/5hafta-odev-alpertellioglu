import { getDataFromApi, addTaskToApi, deleteTaskFromApi } from './data';

class PomodoroApp {
  constructor(options) {
    let { tableTbodySelector, taskFormSelector } = options;
    this.$tableTbody = document.querySelector(tableTbodySelector);
    this.$taskForm = document.querySelector(taskFormSelector);
    this.$taskFormInput = this.$taskForm.querySelector('input');
    this.$taskFormButton = this.$taskForm.querySelector('button');
  }

  addTask(task) {
    this.$taskFormButton.innerText = 'Ekleniyor';
    this.$taskFormButton.disabled = true;
    addTaskToApi(task)
      .then((data) => data.json())
      .then((newTask) => {
        this.addTaskToTable(newTask);
        this.$taskFormButton.innerText = 'Add Task';
        this.$taskFormButton.disabled = false;
      });
  }

  deleteTask(task) {
    deleteTaskFromApi(task).then(this.deleteFromTable(task));
  }

  deleteFromTable(task) {
    let toBeRemoved = document.getElementById(`table-row-${task.id}`);
    toBeRemoved.remove();
  }

  addTaskToTable(task, index) {
    const $newTaskEl = document.createElement('tr');
    $newTaskEl.id = `table-row-${task.id}`;
    $newTaskEl.innerHTML = `<th scope="row">${task.id}</th><td>${task.title}</td><td><button type="button" class='btn btn-danger delete'>X</button></td>`;
    this.$tableTbody.appendChild($newTaskEl);
    this.$taskFormInput.value = '';

    // let $deleteButton = $newTaskEl.querySelector('.delete');
    // $deleteButton.addEventListener('click', (e) => {
    //   this.deleteTask(task);
    // });
    this.addDeleteOption($newTaskEl, task);
  }

  addDeleteOption(taskElement, task) {
    let $deleteButton = taskElement.querySelector('.delete');
    $deleteButton.addEventListener('click', (e) => {
      this.deleteTask(task);
    });
  }

  handleAddTask() {
    this.$taskForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const task = { title: this.$taskFormInput.value };
      this.addTask(task);
    });
  }

  fillTasksTable() {
    getDataFromApi().then((currentTasks) => {
      currentTasks.forEach((task, index) => {
        this.addTaskToTable(task, index + 1);
      });
    });
  }

  init() {
    this.fillTasksTable();
    this.handleAddTask();
  }
}

export default PomodoroApp;
