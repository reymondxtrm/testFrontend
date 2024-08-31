import "./App.css";
import axios from "axios";
import React, { useState, useEffect } from "react";
function App() {
  const baseURL = 'http://127.0.0.1:8000/api';
  const [data,setData] = useState({});
  const [editData,setEditData] = useState({});
  const [trigger,setTrigger] = useState(false);
  const [editId,setEditId] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    address: "",
  });
  const [editFormData, setEditFormData] = useState({
    name: "",
    contact: "",
    address: "",
  });

  useEffect(()=>{
        const fetchData = async()=>{
          try{
            const getResponse = await axios.get(`${baseURL}/get-user`);
            setData(getResponse.data);
          }catch(error){
            console.log('Error:',error);
          }
        }
        fetchData();
  },[trigger]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  // Handling add user request
  const handleSubmit = async (e) => {
    try {
      await axios.post(`${baseURL}/add-user`,formData);
      setTrigger(!trigger);
      setFormData({
        name: "",
        contact: "",
        address: "",});
      
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // handling edit request
    const handleEdit = (e) => {
      setEditId(e);
      setTrigger(!trigger);
    }
    console.log(editData);
  const handleSave = async () => {
    try{  
        {
          await axios.post(`${baseURL}/edit-user/${editId}`,formData);
          setTrigger(!trigger);
          setEditId(0);
          setFormData({
            name: "",
            contact: "",
            address: "",});
        }
    } catch(error){
      console.log("Error:",error);
    }
  }

  //handling delete request
  const handleDelete = async(id)=>{
   try{
    await axios.post(`${baseURL}/delete-user/${id}`);
    setTrigger(!trigger);
   }
   catch(error){
    console.log("Error:",error);
  }
  }

  return (
    <div className="App">
      <header className="App-header">
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
        />

        <label>Contact:</label>
        <input
          type="text"
          name="contact"
          value={formData.contact}
          onChange={handleChange}
        />

        <label>Address:</label>
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
        />
        <button onClick={handleSubmit}>Submit</button>
        <br />
        <br />

        <table>
          <thead>
            <tr>
              <td>Name</td>
              <td>Contact</td>
              <td>Address</td>
            </tr>
          </thead>
          <tbody>
        { data.length > 0 ?  (
          data.map((item) => ( 
            item.id === editId ? 
            (   
              <tr>
                <td> <input
                type="text"
                name="editName"
                value={editData.name}
                onChange={handleChange}
                
              />
              </td>
               

              <td>
              <input
                type="text"
                name="editContact"
                value={editData.contact}
                onChange={handleChange}
                
              />
              </td>
             
                <td> <input
                type="text"
                name="editAddress"
                value={editData.address}
                onChange={handleChange}
                placeholder="Address"
              />
              </td>
             
              <button onClick={handleSave}>Submit</button>
              <br />
              </tr>
          ):(  
            <tr key={item.id}>
            <td>{item.name}</td>
            <td>{item.contact}</td>
            <td>{item.address}</td>
             <button onClick={()=>{handleEdit(item.id);setEditData(item)}}>edit</button>
             <button onClick={()=>{handleDelete(item.id)}}>delete</button>
          </tr>
          )))) : (
          <tr>
            <td colSpan="3">No data available</td>
          </tr>
        )}
          </tbody> 
        </table>
      </header>
    </div>
  );
}

export default App;
