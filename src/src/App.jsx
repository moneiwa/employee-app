import React, { useState, useEffect } from 'react';
import './App.css';
import Form from './Form.jsx';
import RegisteredEmployees from './RegisteredEmployees.jsx';

function App() {
  const [showForm, setShowForm] = useState(true);
  const [dataArray, setDataArray] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetch('http://localhost:3000/employees')
      .then((response) => response.json())
      .then((data) => setDataArray(data))
      .catch((error) => console.error('Fetch error:', error));
  }, []);

  const handleDelete = (id) => {
    fetch(`http://localhost:3000/employees/${id}`, { method: 'DELETE' })
      .then(() => {
        setDataArray(dataArray.filter((employee) => employee.id !== id));
      })
      .catch((error) => console.error('Error deleting employee:', error));
  };

  const handleEdit = (updatedEmployee) => {
    fetch(`http://localhost:3000/employees/${updatedEmployee.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedEmployee),
    })
      .then((response) => response.json())
      .then((updatedData) => {
        const updatedDataArray = dataArray.map((employee) =>
          employee.id === updatedData.id ? updatedData : employee
        );
        setDataArray(updatedDataArray);  // Ensure this is called with the updated array
      })
      .catch((error) => console.error('Error editing employee:', error));
  };

  return (
    <div className="container">
      <div className="app-container">
        <div className="sidebar">
          <h2>Employees App</h2>
          
          <ul>
          <div class="button-container">
              <button className='too' onClick={() => setShowForm(true)}>Register</button>
            
          
              <button  className='to' onClick={() => setShowForm(false)}>Registered Employees</button>
              </div>
            
          </ul>
       
        </div>

        <div className="content">
          {showForm ? (
            <Form setDataArray={setDataArray} />
          ) : (
            <RegisteredEmployees
              dataArray={dataArray}
              setDataArray={setDataArray}  // Passing setDataArray down to RegisteredEmployees
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              handleDelete={handleDelete}
              handleEdit={handleEdit}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
