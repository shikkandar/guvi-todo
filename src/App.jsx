import React, { useEffect, useState } from 'react';
import { Button, Container, Form } from 'react-bootstrap';

const App = () => {
  // State variables
  const [todos, setTodos] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [editTodo, setEditTodo] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [filterTerm, setFilterTerm] = useState('');

  // Load todos from localStorage on component mount
  useEffect(() => {
    const storedTodo = JSON.parse(localStorage.getItem('todos')) || [];
    setTodos(storedTodo);
  }, []);

  // Add new todo
  const addTodo = () => {
    if (name && description) {
      const newTodo = {
        id: new Date().getTime(),
        name: name,
        description: description,
        status: 'notComplete',
      };
      setTodos((prevTodos) => [...prevTodos, newTodo]);
      localStorage.setItem('todos', JSON.stringify([...todos, newTodo]));
      setName('');
      setDescription('');
    }
  };

  // Delete todo
  const deleteBtn = (id) => {
    const updatedTodos = todos.filter((data) => data.id !== id);
    setTodos(updatedTodos);
    localStorage.setItem('todos', JSON.stringify(updatedTodos));
  };

  // Edit todo
  const editBtn = (id) => {
    const editedTodo = todos.find((data) => data.id === id);
    setEditTodo(editedTodo);
    setName(editedTodo.name);
    setDescription(editedTodo.description);
  };

  // Update todo
  const updateTodo = () => {
    if (editTodo && name && description) {
      const updatedTodos = todos.map((data) =>
        data.id === editTodo.id
          ? { ...data, name: name, description: description }
          : data
      );

      setTodos(updatedTodos);
      localStorage.setItem('todos', JSON.stringify(updatedTodos));

      setEditTodo(null);
      setName('');
      setDescription('');
    }
  };

  // Handle status change
  const handleStatusChange = (id, selectedStatus) => {
    const updatedTodos = todos.map((data) =>
      data.id === id ? { ...data, status: selectedStatus } : data
    );
    setTodos(updatedTodos);
    localStorage.setItem('todos', JSON.stringify(updatedTodos));
  };

  // Handle status filter change
  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
  };

  // Filter todos based on status and search term
  const filteredTodos = todos.filter((data) => {
    const matchesStatus = statusFilter === 'all' || data.status === statusFilter;
    const matchesFilterTerm = data.name.toLowerCase().includes(filterTerm.toLowerCase());

    return matchesStatus && matchesFilterTerm;
  });

  // JSX rendering
  return (
    <div>
      {/* Todo form */}
      <Container>
        <h1 className='h3 text-center mt-3'>My todo</h1>
        <div className='mt-3'>
          <Form className='d-flex'>
            {/* Input fields for todo */}
            <Form.Control
              type='text'
              placeholder='ToDo Name'
              className='mx-2'
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Form.Control
              type='text'
              placeholder='ToDo Description'
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className='mx-2'
            />
            {/* Add or update button based on editTodo */}
            {editTodo ? (
              <Button variant='warning' style={{ width: '210px' }} onClick={updateTodo}>
                Update
              </Button>
            ) : (
              <Button variant='success' style={{ width: '210px' }} onClick={addTodo}>
                Add
              </Button>
            )}
          </Form>
        </div>
      </Container>
      
      {/* Todo list and filter */}
      <div className='container d-flex justify-content-between mt-3'>
        <h5 className='mt-4'>My Todos</h5>
        <div>
          <label htmlFor="">Filter:</label>
          <select
          className='mt-4'
          value={statusFilter}
          onChange={handleStatusFilterChange}
        >
          {/* Filter options */}
          <option value='all'>All</option>
          <option value='complete'>Complete</option>
          <option value='notComplete'>Not complete</option>
        </select>
        </div>
      </div>

      {/* Display todos */}
      <Container fluid className='d-flex flex-wrap justify-content-center'>
        {filteredTodos.map((data) => (
          <div key={data.id}>
            <div
              className=' rounded thumnail p-3 m-3 d-flex flex-column'
              style={{ width: '300px', backgroundColor: '#CCF5D3' }}
            >
              <p>Name:{data.name}</p>
              <p style={{ overflowWrap: 'break-word', maxWidth: '100%' }}>
                Description: {data.description}
              </p>
              <p>
                Status:
                {/* Dropdown for status */}
                <select
                  value={data.status}
                  onChange={(e) => handleStatusChange(data.id, e.target.value)}
                >
                  <option value='complete'>Complete</option>
                  <option value='notComplete'>Not Complete</option>
                </select>
              </p>
              <div className='align-self-end'>
                {/* Edit and delete buttons */}
                <Button className='mx-2' variant='success' onClick={() => editBtn(data.id)}>
                  Edit
                </Button>
                <Button variant='danger' onClick={() => deleteBtn(data.id)}>
                  Del
                </Button>
              </div>
            </div>
          </div>
        ))}
      </Container>
    </div>
  );
};

export default App;
