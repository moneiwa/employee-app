// Form.jsx
import React, { useState } from 'react';
import './App.css';

const Form = ({ setDataArray }) => {
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    email: '',
    phoneNumber: '',
    employeePosition: '',
    id: '',
    image: ''
  });

  const [errors, setErrors] = useState({});  // To store form validation errors

  // Handle form field changes
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle image change (for file upload)
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle form submission
  const handleSubmit = (event) => {
    event.preventDefault();
    
    // Simple validation (you can expand this based on your requirements)
    const newErrors = {};
    if (!formData.name) newErrors.name = "Name is required.";
    if (!formData.surname) newErrors.surname = "Surname is required.";
    if (!formData.email) newErrors.email = "Email is required.";
    if (!formData.phoneNumber) newErrors.phoneNumber = "Phone number is required.";
    if (!formData.id) newErrors.id = "ID is required.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);  // Show validation errors
      return;
    }

    // Add new employee to the array
    fetch('http://localhost:3000/employees', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    })
      .then(response => response.json())
      .then(newEmployee => {
        setDataArray(prevArray => [...prevArray, newEmployee]);  // Update state with new employee
        resetForm();  // Reset the form after submission
      })
      .catch(error => console.error('Error adding employee:', error));
  };

  // Reset form data after submission
  const resetForm = () => {
    setFormData({
      name: '',
      surname: '',
      email: '',
      phoneNumber: '',
      employeePosition: '',
      id: '',
      image: ''
    });
    setErrors({});  // Clear errors
  };

  return (
    <div className="container">
      <h2 className="text">Employee Form</h2>
      <div className="cota">
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="input-data">
            <input type="text" name="name" value={formData.name} onChange={handleChange} required />
            <label>Name</label>
            <div className="underline"></div>
            {errors.name && <span className="error">{errors.name}</span>}
          </div>

          <div className="input-data">
            <input type="text" name="surname" value={formData.surname} onChange={handleChange} required />
            <label>Surname</label>
            <div className="underline"></div>
            {errors.surname && <span className="error">{errors.surname}</span>}
          </div>
        </div>

        <div className="form-row">
          <div className="input-data">
            <input type="email" name="email" value={formData.email} onChange={handleChange} required />
            <label>Email</label>
            <div className="underline"></div>
            {errors.email && <span className="error">{errors.email}</span>}
          </div>

          <div className="input-data">
            <input type="text" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} required />
            <label>Phone Number (10 digits)</label>
            <div className="underline"></div>
            {errors.phoneNumber && <span className="error">{errors.phoneNumber}</span>}
          </div>
        </div>

        <div className="form-row">
          <div className="input-data">
            <input type="text" name="employeePosition" value={formData.employeePosition} onChange={handleChange} />
            <label>Employee Position</label>
            <div className="underline"></div>
          </div>

          <div className="input-data">
            <input type="text" name="id" value={formData.id} onChange={handleChange} required />
            <label>ID (12 digits)</label>
            <div className="underline"></div>
            {errors.id && <span className="error">{errors.id}</span>}
          </div>
        </div>

        <div className="form-row">
          <div className="input-data">
            <input type="file" accept="image/*" onChange={handleImageChange} />
            <br />
            <label>Upload Image</label>
            <div className="underline"></div>
            {formData.image && <img src={formData.image} alt="Uploaded" style={{ width: '100px', height: '100px' }} />}
          </div>
        </div>

        <div className="submit-btn">
          <div className="input-data">
            <input type="submit" value="Submit" />
            <div className="inner"></div>
          </div>
        </div>
      </form>
      </div>
    </div>
  );
};

export default Form;
