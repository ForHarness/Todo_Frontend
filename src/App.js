import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/todos`);
      if (Array.isArray(response.data)) {
        setTodos(response.data);
      } else {
        console.error('Invalid response format:', response.data);
        setTodos([]);
      }
    } catch (error) {
      console.error('Error fetching todos:', error.message);
      setTodos([]);
    }
  };

  const handleAddTodo = async () => {
    if (!title.trim()) {
      alert('Title is required');
      return;
    }

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/todos`, {
        title,
        description,
        completed: false,
      });

      if (response.status >= 200 && response.status < 300) {
        setTodos([...todos, response.data]); // Assuming API returns the full todo object
        setTitle('');
        setDescription('');
      } else {
        throw new Error(`Request failed with status ${response.status}`);
      }
    } catch (error) {
      console.error('Error adding todo:', error.message);
    }
  };

  const handleDeleteTodo = async (id) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/todos/${id}`);
      setTodos(todos.filter((todo) => todo.id !== id));
    } catch (error) {
      console.error('Error deleting todo:', error.message);
    }
  };

  const handleToggleComplete = async (id, completed) => {
    try {
      const response = await axios.put(`${process.env.REACT_APP_API_URL}/todos/${id}`, {
        completed: !completed, // Toggle completion status
      });

      if (response.status >= 200 && response.status < 300) {
        setTodos(todos.map((todo) =>
          todo.id === id ? { ...todo, completed: !completed } : todo
        ));
      }
    } catch (error) {
      console.error('Error updating todo:', error.message);
    }
  };

  return (
    <div className="container">
      <h1>Todo List</h1>
      <div className="add-todo">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button onClick={handleAddTodo}>Add Todo</button>
      </div>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id} className={todo.completed ? 'completed' : ''}>
            <h3>{todo.title}</h3>
            <p>{todo.description}</p>
            <label>
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => handleToggleComplete(todo.id, todo.completed)}
              />
              Completed
            </label>
            <button onClick={() => handleDeleteTodo(todo.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
