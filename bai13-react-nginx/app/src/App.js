import React, { useState } from "react";
import "./App.css";

function App() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState("");

  const addTodo = () => {
    if (input.trim() !== "") {
      setTodos([...todos, { id: Date.now(), text: input, completed: false }]);
      setInput("");
    }
  };

  const toggleTodo = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      ),
    );
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  return (
    <div className="app">
      <header className="header">
        <h1>🐳 React + Docker + Nginx</h1>
        <p>Running in Docker Container with Nginx Server</p>
      </header>

      <main className="main">
        <section className="info-section">
          <h2>Welcome to React App with Docker!</h2>
          <p>This application is running inside Docker containers.</p>
          <ul className="features">
            <li>✅ React application built and bundled</li>
            <li>✅ Served by Nginx web server</li>
            <li>✅ Multi-stage Docker build for optimized image</li>
            <li>✅ Docker Compose for easy orchestration</li>
          </ul>
        </section>

        <section className="todo-section">
          <h2>📝 Simple Todo App</h2>
          <div className="input-group">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && addTodo()}
              placeholder="Add a new todo..."
              className="input"
            />
            <button onClick={addTodo} className="button">
              Add
            </button>
          </div>

          <ul className="todo-list">
            {todos.map((todo) => (
              <li
                key={todo.id}
                className={`todo-item ${todo.completed ? "completed" : ""}`}
              >
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleTodo(todo.id)}
                  className="checkbox"
                />
                <span className="todo-text">{todo.text}</span>
                <button
                  onClick={() => deleteTodo(todo.id)}
                  className="delete-btn"
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
          {todos.length === 0 && (
            <p className="empty">No todos yet. Add one above!</p>
          )}
        </section>

        <section className="docker-info">
          <h2>🐳 Docker Architecture</h2>
          <div className="architecture">
            <div className="box">
              <h3>React Container</h3>
              <p>Builds React app</p>
            </div>
            <div className="arrow">→</div>
            <div className="box">
              <h3>Nginx Container</h3>
              <p>Serves static files</p>
            </div>
          </div>
          <p className="port-info">
            Accessible on: <strong>http://localhost</strong>
          </p>
        </section>
      </main>

      <footer className="footer">
        <p>Build with ❤️ using React + Docker</p>
      </footer>
    </div>
  );
}

export default App;
