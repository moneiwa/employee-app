import React, { useState, useEffect } from 'react';
import './App.css';

const Form = () => {
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    email: '',
    phoneNumber: '',
    employeePosition: '',
    id: '',
    image: ''
  });

  const [dataArray, setDataArray] = useState([]);
  const [editIndex, setEditIndex] = useState(-1);
  const [searchTerm, setSearchTerm] = useState('');
  const [errors, setErrors] = useState({});

  // Load data from JSON Server
  useEffect(() => {
    fetch('http://localhost:3000/employees')
      .then(response => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.json();
      })
      .then(data => setDataArray(data))
      .catch(error => console.error('Fetch error:', error));
  }, []);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "Name is required.";
    if (!formData.surname) newErrors.surname = "Surname is required.";
    if (!formData.email) {
      newErrors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email format is invalid.";
    }
    if (!formData.phoneNumber) {
      newErrors.phoneNumber = "Phone number is required.";
    } else if (!/^\d{10}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = "Phone number must be exactly 10 digits.";
    }

    if (!formData.id) {
      newErrors.id = "ID is required.";
    } else if (!/^\d{12}$/.test(formData.id)) {
      newErrors.id = "ID must be exactly 12 digits.";
    } else if (dataArray.some(data => data.id === formData.id && dataArray.indexOf(data) !== editIndex)) {
      newErrors.id = "ID must be unique.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

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

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (editIndex === -1) {
      // Add new employee
      fetch('http://localhost:3000/employees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      .then(response => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.json();
      })
      .then(newEmployee => {
        setDataArray([...dataArray, newEmployee]);
        resetForm();
      })
      .catch(error => console.error('Fetch error:', error));
    } else {
      // Update existing employee
      fetch(`http://localhost:3000/employees/${dataArray[editIndex].id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      .then(response => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.json();
      })
      .then(updatedEmployee => {
        const updatedArray = [...dataArray];
        updatedArray[editIndex] = updatedEmployee;
        setDataArray(updatedArray);
        resetForm();
      })
      .catch(error => console.error('Fetch error:', error));
    }
  };

  const handleEdit = (index) => {
    setFormData(dataArray[index]);
    setEditIndex(index);
  };

  const handleCancelEdit = () => {
    resetForm();
  };

  const handleDelete = (index) => {
    const employeeId = dataArray[index].id;
    fetch(`http://localhost:3000/employees/${employeeId}`, {
      method: 'DELETE',
    })
    .then(() => {
      const updatedArray = dataArray.filter((_, i) => i !== index);
      setDataArray(updatedArray);
    })
    .catch(error => console.error('Fetch error:', error));
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredDataArray = dataArray.filter(data => {
    const searchLower = searchTerm.toLowerCase();
    return (
      data.name.toLowerCase().includes(searchLower) ||
      data.surname.toLowerCase().includes(searchLower) ||
      data.email.toLowerCase().includes(searchLower) ||
      data.phoneNumber.toLowerCase().includes(searchLower) ||
      data.employeePosition.toLowerCase().includes(searchLower) ||
      data.id.toString().toLowerCase().includes(searchLower)
    );
  });

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
    setEditIndex(-1);
    setErrors({});
  };

  return (
    <>
      <div className="container">
        <h2 className="text">Employee Form</h2>

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
            </div>
          </div>

          <div className="submit-btn">
            <div className="input-data">
              {editIndex === -1 ? (
                <input type="submit" value="Submit" />
              ) : (
                <div>
                  <input type="submit" value="Save Changes" />
                  <button type="button" onClick={handleCancelEdit}>Cancel</button>
                </div>
              )}
              <div className="inner"></div>
            </div>
          </div>
        </form>

        <br />
      </div>

      <div className='registered'>
        <h2 className="text">Registered Employees</h2>
        <input type="text" value={searchTerm} onChange={handleSearchChange} placeholder="Search" />
        <div className="underline"></div>


        <div className='t'>
  <table>
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
      {filteredDataArray.map((data, index) => (
        <tr key={data.id}>
          <td>{data.name}</td>
          <td>{data.surname}</td>
          <td>{data.email}</td>
          <td>{data.phoneNumber}</td>
          <td>{data.employeePosition}</td>
          <td>{data.id}</td>
          <td>{data.image && <img src={data.image} alt="Employee" style={{ width: '100px', height: '100px' }} />}</td>
          <td>
            <button onClick={() => handleDelete(index)}>Delete</button>
            <button onClick={() => handleEdit(index)}>Edit</button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
      </div>
    </>
  );
};

export default Form;
