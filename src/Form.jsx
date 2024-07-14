
import React, { useState } from 'react';
import './App.css';  

const Form = () => { ///1
  const [formData, setFormData] = useState({  //1 array
    name: '',surname: '',email: '',phoneNumber: '',employeePosition: '',id: ''
  });

  const [dataArray, setDataArray] = useState([]); ///to see data from form as array
  const [editIndex, setEditIndex] = useState(-1);  /// to update array data
  const [searchTerm, setSearchTerm] = useState('');




  const handleChange = (event) => { ////handle cha
    const { name, value } = event.target;
    setFormData({...formData, [name]: value
    });
  };

  const handleSubmit = (event) => {  ///submit 
    event.preventDefault();
    setFormData({
      name: '', surname: '', email: '', phoneNumber: '', employeePosition: '', id: ''
    });

    const addToDataArray = (data) => {
      setDataArray(prevState => [...prevState, data]); ////to submit add data to array
    };
  



  const updateDataArray = (index, newData) => { /////update function
    const updatedArray = [...dataArray];
    updatedArray[index] = newData;
    setDataArray(updatedArray);
    setEditIndex(-1);
  };

    if (editIndex === -1) {  ///editt condition
      addToDataArray(formData);
    } else {
      updateDataArray(editIndex, formData);
    }
  };


  const handleEdit = (index) => {
    setFormData(dataArray[index]);
    setEditIndex(index);
  };

 
  const handleCancelEdit = () => {
    setFormData({ name: '', surname: '', email: '', phoneNumber: '', employeePosition: '', id: '' });
    setEditIndex(-1);
  };



  
  const handleDelete = (index) => {
    const updatedArray = [...dataArray];
    updatedArray.splice(index, 1);
    setDataArray(updatedArray);
  };



  const handleSearchChange = (event) => { ///search
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





  return (
  <><div className="container">
  <h2 className="text">Employee Form</h2>


  <form onSubmit={handleSubmit}>

  <div className="form-row">
  <div className="input-data">
            
  <input type="text" id="nameInput" name="name" value={formData.name} onChange={handleChange} />
  <label htmlFor="nameInput">Name</label>
  <div className="underline"></div>
  </div>

  <div className="input-data"><input type="text" id="surnameInput" name="surname" value={formData.surname} onChange={handleChange}/>
  <label htmlFor="surnameInput">Surname</label>
  <div className="underline"></div>
</div>
</div>

<div className="form-row">
<div className="input-data">
<input type="email" id="emailInput" name="email" value={formData.email} onChange={handleChange}/>
<label htmlFor="emailInput">Email</label>
<div className="underline"></div>
</div>


<div className="input-data">
<input type="text" id="phoneNumberInput" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} />
<label htmlFor="phoneNumberInput">Phone Number</label>
<div className="underline"></div>
</div>
</div>

<div className="form-row">
<div className="input-data">
<input type="text" id="employeePositionInput" name="employeePosition" value={formData.employeePosition} onChange={handleChange} />
<label htmlFor="employeePositionInput">Employee Position</label>
<div className="underline"></div>
</div>
         
<div className="input-data">
<input type="number" id="idInput" name="id" value={formData.id} onChange={handleChange} />
<label htmlFor="idInput">ID</label>
<div className="underline"></div>
</div>
</div>

<div className="submit-btn">
<div className="input-data">
{editIndex === -1 ? (
<input type="submit" value="Submit" />
) : (


  ////buttons
<div>
<input type="submit" value="Save Changes" />
<button type="button" onClick={handleCancelEdit}>Cancel</button>
</div>
)}
<div className="inner"></div>
</div>
</div>

</form>

<br></br>

</div>
        
     
        
    
<div className='registered'>

<h2 className="text">Registered Employees</h2>
        <ul>

              
        <input type="text" value={searchTerm} onChange={handleSearchChange} />
          <label htmlFor="search">Search</label>
          <div className="underline"></div>
        
          {filteredDataArray.map((data, index) => (
            <li key={index}>
              <strong>Name:</strong> {data.name}<br />
              <strong>Surname:</strong> {data.surname}<br />
              <strong>Email:</strong> {data.email}<br />
              <strong>Phone number:</strong> {data.phoneNumber}<br />
              <strong>Employee Position:</strong> {data.employeePosition}<br />
              <strong>ID:</strong> {data.id}<br />
              <button onClick={() => handleDelete(index)}>Delete</button>
              <button onClick={() => handleEdit(index)}>Edit</button>
            </li>
          ))}
        </ul>
      </div></>

  );
};

export default Form;
