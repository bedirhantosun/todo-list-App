"use strict";
const addButton = document.querySelector(".todo-list-add-btn");
const listElements = document.querySelectorAll(".todo-list li");
const todoListWrapper = document.querySelector(".todo-list");
const inputElement = document.querySelector(".todo-list-input");
let todos = [];

addButton.addEventListener("click", () => {
  addTodo(inputElement.value);
});

const getAllTodos = () => {
  fetch("http://127.0.0.1:5000/get_all_todos")
    .then((res) => res.json())
    .then((data) => {
      todos = data;
      writeDOM(todos);
    });
};

const deleteTodo = (id) => {
  fetch("http://127.0.0.1:5000/delete_todo/" + id, {
    method: "DELETE",
  }).then((res) => console.log("success"));
};

const addTodo = (textContent) => {
  const data = { message: textContent };

  fetch("http://127.0.0.1:5000/add_one", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Success:", data);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
};

const updateTodo = (event, id) => {
  fetch("http://127.0.0.1:5000/update_todo/" + id, {
    method: "PATCH",
    body: JSON.stringify({ message: event.target.textContent.trim() }),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res = console.log("succes")))
    .catch((e) => console.log("error:", e));
};

const checkTodo = (event, id) => {
  fetch("http://127.0.0.1:5000/check_todo/" + id, {
    method: "PATCH",
    body: JSON.stringify({ completed: event.target.checked }),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res = console.log("succes")))
    .catch((e) => console.log("error:", e));
};

const writeDOM = (data) => {
  Array.from(data).forEach((item) => {
    const html = `
    <div class="form-check ${item.completed ? "completed" : null}">
      <label class="form-check-label">
        <input class="checkbox" type="checkbox" ${
          item.completed ? "checked" : null
        } onclick=(checkTodo(event,'${item._id}')) />
        <i class="input-helper"></i
      ></label>
      <p contenteditable='true' onblur="updateTodo(event, '${item._id}')" >${
      item.message
    }</p>
    </div>
    <i onclick=(deleteTodo('${
      item._id
    }')) class="remove mdi mdi-close-circle-outline"></i>`;
    let liElement = document.createElement("li");
    liElement.innerHTML = html;
    todoListWrapper.insertAdjacentElement("beforeend", liElement);
  });
};

document.addEventListener("DOMContentLoaded", () => {
  getAllTodos();
});