import React, { useState, useContext, useEffect } from "react";
import { CredentialsContext } from "../App";
import { v4 as uuidv4 } from "uuid";
import './Todo.css'
import AddCircleIcon from '@material-ui/icons/AddCircle';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import { set } from "mongoose";

export default function Todos() {
  const [todos, setTodos] = useState([]);
  const [todoText, setTodoText] = useState("");
  const [credentials] = useContext(CredentialsContext);
  const [filter, setFilter] = useState("Pending");

  const persist = (newTodos) => {
    fetch(`http://localhost:4000/todos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${credentials.username}:${credentials.password}`,
      },
      body: JSON.stringify(newTodos),
    }).then(() => {});
  };

  useEffect(() => {
    fetch(`http://localhost:4000/todos`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${credentials.username}:${credentials.password}`,
      },
    })
      .then((response) => response.json())
      .then((todos) => setTodos(todos));
  }, []);

  const addTodo = (e) => {
    e.preventDefault();
    if (!todoText) return;
    const newTodo = { id: uuidv4(), checked: false, text: todoText };
    const newTodos = [...todos, newTodo];
    setTodos(newTodos);
    setTodoText("");  
    persist(newTodos);
  };

  const delTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id)) 




  }

  const toggleTodo = (id) => {
    const newTodoList = [...todos];
    const todoItem = newTodoList.find((todo) => todo.id === id);
    todoItem.checked = !todoItem.checked;
    setTodos(newTodoList);
    persist(newTodoList);
  };

    const getTodos = (todo) => {
      return todos.filter((todo) => filter === "completed" ? todo.checked : !todo.checked
      );
    };

  const changeFilter = (newFilter) => {
    setFilter(newFilter);
  };

  return (
    <div className="main_div">
      

     
      <br />
      <div className="center_div">
      <form onSubmit={addTodo}>
        <input
          value={todoText}
          onChange={(e) => setTodoText(e.target.value)}
          type="text"
        ></input>
        <button type="submit"><AddCircleIcon /></button>
      </form>

      <select value={filter} onChange={(e) => changeFilter(e.target.value)}>
        <option value="completed">Completed</option>
        <br/>
        <option value="Pending">Pending</option>
      </select>

      {getTodos().map((todo,id) => (
        <div key={todo.id}>
          <input
            checked={todo.checked}
            
            onChange={() => toggleTodo(todo.id)}
            type="checkbox"
          />
         <a href onClick={()=>delTodo(todo.id)} ><label >{todo.text}</label><HighlightOffIcon /></a> 
         </div>
        



        
      ))}
      </div>
      
    </div>
  );
}