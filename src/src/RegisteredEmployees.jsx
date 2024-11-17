import React, { useState } from 'react';

const RegisteredEmployees = ({
  dataArray,
  setDataArray,
  searchTerm,
  setSearchTerm,
  handleDelete,
  handleEdit
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [newImage, setNewImage] = useState(null); // New image state for file upload

  const handleEditClick = (employee) => {
    setSelectedEmployee(employee);
    setIsEditing(true);
    setNewImage(null); // Reset the image state on edit
  };

  const handleCancelEdit = () => {
    setSelectedEmployee(null);
    setIsEditing(false);
    setNewImage(null); // Reset the image state on cancel
  };

  const handleEmployeeChange = (event) => {
    const { name, value } = event.target;
    setSelectedEmployee({ ...selectedEmployee, [name]: value });
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewImage(reader.result); // Store the new image as base64
      };
      reader.readAsDataURL(file); // Convert image to base64
    }
  };

  const handleSaveEdit = (event) => {
    event.preventDefault();
    const updatedEmployee = { ...selectedEmployee, image: newImage || selectedEmployee.image };

    console.log('Saving changes for:', updatedEmployee);

    // Update employee data on the backend with PUT request
    fetch(`http://localhost:3000/employees/${updatedEmployee.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedEmployee),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to save changes');
        }
        return response.json(); // Get updated data from server
      })
      .then((updatedData) => {
        console.log('Updated employee data from server:', updatedData);

        // Update local state with the updated employee details
        const updatedDataArray = dataArray.map((employee) =>
          employee.id === updatedData.id ? updatedData : employee
        );
        setDataArray(updatedDataArray); // Update the dataArray with the new employee

        handleCancelEdit(); // Reset the form after saving
      })
      .catch((error) => {
        console.error('Error saving employee:', error);
        alert('Failed to save changes. Please try again.');
      });
  };

  // Filter employees based on the search term
  const filteredEmployees = dataArray.filter((employee) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      employee.name.toLowerCase().includes(searchLower) ||
      employee.surname.toLowerCase().includes(searchLower) ||
      employee.email.toLowerCase().includes(searchLower) ||
      employee.id.toString().toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="container">
      <h2 className="text">Registered Employees</h2>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search by name, email, or ID"
      />
      <div className="underline"></div>

      {isEditing ? (
        <form onSubmit={handleSaveEdit}>
          <h3>Edit Employee</h3>
          
          {/* Name and Surname */}
          <div className="form-row">
            <div className="input-data">
              <input
                type="text"
                name="name"
                value={selectedEmployee.name}
                onChange={handleEmployeeChange}
                required
              />
              <label>Name</label>
              <div className="underline"></div>
            </div>

            <div className="input-data">
              <input
                type="text"
                name="surname"
                value={selectedEmployee.surname}
                onChange={handleEmployeeChange}
                required
              />
              <label>Surname</label>
              <div className="underline"></div>
            </div>
          </div>

          {/* Email and Phone Number */}
          <div className="form-row">
            <div className="input-data">
              <input
                type="email"
                name="email"
                value={selectedEmployee.email}
                onChange={handleEmployeeChange}
                required
              />
              <label>Email</label>
              <div className="underline"></div>
            </div>

            <div className="input-data">
              <input
                type="text"
                name="phoneNumber"
                value={selectedEmployee.phoneNumber}
                onChange={handleEmployeeChange}
                required
              />
              <label>Phone Number</label>
              <div className="underline"></div>
            </div>
          </div>

          {/* Employee Position */}
          <div className="form-row">
            <div className="input-data">
              <input
                type="text"
                name="employeePosition"
                value={selectedEmployee.employeePosition}
                onChange={handleEmployeeChange}
                required
              />
              <label>Employee Position</label>
              <div className="underline"></div>
            </div>
          </div>

          {/* Image Upload */}
          <div className="form-row">
            <div className="input-data">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
              <br />
              <label>Upload Image</label>
              <div className="underline"></div>
              {selectedEmployee.image && !newImage && (
                <img
                  src={selectedEmployee.image}
                  alt="Employee"
                  style={{ width: '100px', height: '100px' }}
                />
              )}
            </div>
          </div>

          {/* Save or Cancel buttons */}
          <div className="form-row">
            <div className="submit-btn">
              <input type="submit" value="Save Changes" />
              <button type="button" onClick={handleCancelEdit}>
                Cancel
              </button>
            </div>
          </div>
        </form>
      ) : (
        <table className="employee-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Surname</th>
              <th>Email</th>
              <th>Phone Number</th>
              <th>Employee Position</th>
              <th>ID</th>
              <th>Image</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.map((employee) => (
              <tr key={employee.id}>
                <td>{employee.name}</td>
                <td>{employee.surname}</td>
                <td>{employee.email}</td>
                <td>{employee.phoneNumber}</td>
                <td>{employee.employeePosition}</td>
                <td>{employee.id}</td>
                <td>
                  {employee.image && (
                    <img
                      src={employee.image}
                      alt="Employee"
                      style={{ width: '100px', height: '100px' }}
                    />
                  )}
                </td>
                <td>
                  <button onClick={() => handleDelete(employee.id)}>Delete</button>
                  <button onClick={() => handleEditClick(employee)}>Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default RegisteredEmployees;
