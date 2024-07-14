
import Header from './Header.jsx'
 
import React, { useState } from 'react';
import Form from './Form.jsx'


function App() {
  const [showForm, setShowForm] = useState(false);

  const handleShowForm = () => {
    setShowForm(true);
  };
return (
  <><Header></Header><Form></Form></>
);
}
export default App;