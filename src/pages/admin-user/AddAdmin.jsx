
import React, { useCallback, useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Button from '@mui/material/Button';
import { FormControl, FormHelperText, Grid, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import { AdminEditPost, adminUserAdd, adminUsers, fetchData, fetchEditShow, fetchRoleList } from 'api/Data';

function AddAdmin() {
     const location = useLocation();
   const EditRowData =  location.state?.rowData;
const navigate = useNavigate();
   const [formData, setFormData] = useState({
               name: "",
               email: "",
               phone_no: "",
               password: "",
               role: "",
               companyID: "",
    });
    const [errors, setErrors] = useState({});
      const [roleList,setRoleList] = useState([])
     const [confirmedPassword, setConfirmedPassword] = useState("");
     React.useEffect(() => {
        const fetchEditData = async () => {
          if (EditRowData) {
            try {
              const ID = EditRowData.id;
              const response = await fetchEditShow(ID);
              setFormData(response);
            } catch (error) {
              console.error("Error fetching edit data:", error);
            }
          }
        };
      
        fetchEditData();
      }, [EditRowData]);
      
   const [companies, setCompanies] = useState([]);

          useEffect(() => {
            fetchData()
              .then(data => {
                setCompanies(data.data.data);
              })
              .catch(error => {
                console.error(error);
              });
          }, []);

           useEffect(() => {
             fetchRoleList()
               .then(data => {
                 setRoleList(data.data.roles);
               })
               .catch(error => {
                 console.error(error);
               });
           }, []);
           
          const handleInputChange = useCallback((e) => {
              const { name, value } = e.target;
            setFormData((prev) => ({ ...prev, [name]: value }));
        }, []);
        const isValidEmail = (email) => {
            const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
            return emailRegex.test(email);
          };
          const validateForm = () => {
            const newErrors = {};
          
            if (!formData.name) {
              newErrors.name = "Name is required";
            }
            if (!formData.email) {
              newErrors.email = "Email is required";
            } else if (!isValidEmail(formData.email)) {
              newErrors.email = "Invalid email address";
            }
            if (!formData.companyID) {
              newErrors.companyID = "Company name is required";
            }
            if (!formData.phone_no) {
              newErrors.phone_no = "Phone number is required";
            } else if (formData.phone_no.length < 8) {
              newErrors.phone_no = "Phone number must be at least 8 digits long";
            } else if (formData.phone_no.length > 15) {
              newErrors.phone_no = "Phone number cannot be more than 15 digits long";
            } else if (!/^\d+$/.test(formData.phone_no)) {
              newErrors.phone_no = "Phone number must contain only digits";
            } else if (!/^[1-9]/.test(formData.phone_no)) {
              newErrors.phone_no = "Phone number must start with a digit between 1 and 9";
            }
          
            if (!EditRowData) {
              if (!formData.password) {
                newErrors.password = "Password is required";
              } else if (formData.password.length < 6) {
                newErrors.password = "Password must be at least 6 characters long";
              }
          
              if (!confirmedPassword) {
                newErrors.confirmedPassword = "Confirm password is required";
              } else if (confirmedPassword !== formData.password) {
                newErrors.confirmedPassword = "Passwords do not match";
              }
            }
          
            if (!formData.role) {
              newErrors.role = "Role is required";
            }
          
            return newErrors; 
          };
          

      const handleFormSubmit = async (e) => {
        e.preventDefault();
               const validationErrors = validateForm();
                        if (Object.keys(validationErrors).length === 0) {
                            try {   
                                const response = EditRowData 
                                ? await AdminEditPost(formData) 
                                : await adminUserAdd(formData);                              
                         if (response.success === true) {
                          setFormData({
                            name: "",
                            email: "",
                            phone_no: "",
                            password: "",
                            role: "",
                            companyID: "",
                               });
                               setConfirmedPassword('');
                              await adminUsers();
                              toast.success("User added/updated successfully.");
                              navigate('/admin')
                              } else {
                               toast.error("Failed to add/update User.", response.error);
                            }
                            } catch (error) {
                                toast.error("An error occurred while adding/updating the User.", error);
                            }
                        } else {
                            setErrors(validationErrors);
                        }
         };
  return (
    <>
        <div style={{marginBottom:"20px" , textAlign: "end"}}>
    <Link to='/admin'>  <Button variant="contained" style={{padding :"4px 23px"}}>Back</Button></Link>
    </div>

    <div className="bg-white shadow-md p-4">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-lg font-semibold">
          {EditRowData  ? "Edit User" : "Add User"}
        </h2>
      </div>
      <ToastContainer/>
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
  <Grid item xs={12} md={6}>
            <FormControl fullWidth variant="outlined" error={!!errors.companyID}>
              <InputLabel>Company Name</InputLabel>
              <Select
                name="companyID"
                value={formData["companyID"]}
                onChange={handleInputChange}
                label="Company Name"
              >
              {companies.map(company => (
                    <MenuItem  key={company.id} value={company.id}>{company.name}</MenuItem>
                  ))}
              </Select>
              <FormHelperText error>{errors.companyID}</FormHelperText>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              value={formData["email"]}
              onChange={handleInputChange}
              variant="outlined"
              error={!!errors.email}
              helperText={errors.email}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Phone Number"
              name="phone_no"
              value={formData["phone_no"]}
              onChange={handleInputChange}
              variant="outlined"
              error={!!errors.phone_no}
              helperText={errors.phone_no}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Password"
              name="password"
              value={formData["password"]}
              onChange={handleInputChange}
              variant="outlined"
              error={!!errors.password}
              helperText={errors.password}
              disabled={!!EditRowData}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth variant="outlined" error={!!errors.role}>
              <InputLabel>  User Role</InputLabel>
              <Select
                name="role"
                value={formData["role"]}
                onChange={handleInputChange}
                label="  User Role"
              >
              {roleList.map(rol => (
                    <MenuItem  key={rol.id} value={rol.id}>{rol.name}</MenuItem>
                  ))}
              </Select>
              <FormHelperText error>{errors.role}</FormHelperText>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="ConfirmedPassword"
              name="confirmedPassword"
              value={formData["confirmedPassword"]}
              onChange={(e) => setConfirmedPassword(e.target.value)}
              variant="outlined"
              error={!!errors.confirmedPassword}
              helperText={errors.confirmedPassword}
              disabled={!!EditRowData}
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

export default AddAdmin
