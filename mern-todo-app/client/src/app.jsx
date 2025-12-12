import { useState, useEffect } from 'react'

// Dynamic API URL for Docker/Production environments
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function App() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState('');

  // Fetch Todos
  useEffect(() => {
    fetch(`${API_BASE}/api/todos`)
      .then(res => res.json())
      .then(data => setTodos(data))
      .catch(err => console.error("Error fetching todos:", err));
  }, []);

  // Add Todo
  const addTodo = async () => {
    if (!input) return;

    try {
      const res = await fetch(`${API_BASE}/api/todos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: input })
      });
      
      if (res.ok) {
        const newTodo = await res.json();
        setTodos([...todos, newTodo]);
        setInput('');
      }
    } catch (err) {
      console.error("Error adding todo:", err);
    }
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '0 auto' }}>
      <h1>DevOps To-Do List</h1>
      
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <input 
          type="text" 
          value={input} 
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter a task..."
          style={{ flex: 1, padding: '10px', fontSize: '16px' }}
        />
        <button 
          onClick={addTodo} 
          style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px' }}
        >
          Add
        </button>
      </div>

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {todos.map((todo) => (
          <li key={todo._id} style={{ background: '#f8f9fa', padding: '15px', marginBottom: '10px', borderRadius: '5px', border: '1px solid #dee2e6' }}>
            {todo.text}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App
