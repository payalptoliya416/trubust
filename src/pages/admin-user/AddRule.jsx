import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Button from '@mui/material/Button';
import { TextField } from '@mui/material';
import {fetchRoleEdit, fetchRoleList, RoleAdd, roleEditRole } from 'api/Data';
import Grid from '@mui/material/Grid';

export default function AddRule() {
    const location = useLocation();
  const EditRowData =  location.state?.rowData;
  const [formData, setFormData] = useState({
    name: "",
  });
  const navigate = useNavigate();

   useEffect(() => {
          const fetchEditData = async () => {
            if (EditRowData) {
              try {
                const ID = EditRowData.id;
                const response = await fetchRoleEdit(ID);
                setFormData(response);
              } catch (error) {
                console.error("Error fetching edit data:", error);
              }
            }
          };
        
          fetchEditData();
        }, [EditRowData]);
    const [errors, setErrors] = useState({});
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
          ...prevData,
          [name]: value,
        }));
      };
      const validateForm = (data) => {
        const errors = {};
     
        if (!data.name) {
          errors.name = "Role Name is required";
        }  else if (/\d/.test(data.name)) {
          errors.name = "Role Name must not contain any digits";
        }
        
        return errors;
      };
      const handleFormSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validateForm(formData);
        if (Object.keys(validationErrors).length === 0) {
            const response = EditRowData ? await roleEditRole(formData) :await RoleAdd(formData);
          if (response.success) {
            setFormData({
              role: "",
            })
         await fetchRoleList();
         navigate('/role-permission')
          }
        } else {
          setErrors(validationErrors);
        }
      }
  return (
    <>
      <div style={{marginBottom:"20px" , textAlign: "end"}}>
    <Link to='/role-permission'>  <Button variant="contained" style={{padding :"4px 23px"}}>Back</Button></Link>
    </div>
    <div className="bg-white shadow-md p-4">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-lg font-semibold">
          {EditRowData  ? "Edit User" : "Add User"}
        </h2>
      </div>
      <form onSubmit={handleFormSubmit}>
        <Grid container spacing={3}>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Name"
              name="name"
              value={formData["name"]}
              onChange={handleInputChange}
              variant="outlined"
              error={!!errors.name}
              helperText={errors.name}
            />
          </Grid>

           </Grid>
           <Grid container spacing={3}>
          <Grid item xs={1} marginTop={3}>
            <Button type="submit" variant="contained" color="primary" fullWidth>
              {EditRowData ? "Update" : "Submit"}
            </Button>
          </Grid>
           </Grid>
        
      </form>
    </div>
    </>
  )
}
