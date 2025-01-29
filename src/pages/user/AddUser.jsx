
import { addOrUpdateUser, fetchData } from 'api/Data';
import React, { useCallback, useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Button from '@mui/material/Button';
import { FormControl, FormHelperText, Grid, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

export default function AddUser() {
     const location = useLocation();
            const EditRowData =  location.state?.rowData;
       const [formData, setFormData] = useState({
            companyId: "",
            userID: "",
            name: "",
            email: "",
            phone: "",
            department: "",
            designation: "",
            profile_picture: "",
          });

       useEffect(() => {
          if (EditRowData) {
      
              const convertImageUrlToBase64 = async (imageUrl) => {
                  const response = await fetch(imageUrl);
                  const blob = await response.blob();
                  const reader = new FileReader();
                  
                  return new Promise((resolve, reject) => {
                      reader.onloadend = () => resolve(reader.result); 
                      reader.onerror = reject; 
                      reader.readAsDataURL(blob);
                  });
              };
      
              const fetchLogoBase64 = async () => {
                      try {
                          const base64Logo = await convertImageUrlToBase64(EditRowData.profile_picture);
                          setFormData({
                             userID:EditRowData.id || 0,
                companyId: EditRowData.company_id || "",
                name: EditRowData.name || "",
                email: EditRowData.email || "",
                phone: EditRowData.phone || "",
                department: EditRowData.department || "",
                designation: EditRowData.designation || "",
                profile_picture: base64Logo || "",
                          });
                      } catch (error) {
                          console.error('Error converting image to Base64:', error);
                      }
              };
      
              fetchLogoBase64(); // Call the async function to handle the logo
          }
      }, [EditRowData]);
      
     const [errors, setErrors] = useState({});
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

          const handleInputChange = (e) => {
            const { name, value } = e.target;
            
            setFormData({ ...formData, [name]: value });
            setErrors({ ...errors, [name]: '' });
            
            if (name === 'companyId') {
              const selectedCompany = companies.find(company => company.name === value);
              if (selectedCompany) {
                setFormData({ ...formData, companyId: selectedCompany.id});
              } else {
                setFormData({ ...formData, [name]: value });
              }
            }
          };
             const handleImageChange = useCallback((e) => {
                  const file = e.target.files[0];
                  if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                          setFormData((prev) => ({
                              ...prev,
                              profile_picture: reader.result, 
                          }));
                      };
                      reader.readAsDataURL(file);
                  }
              }, []);

              const validateForm = () => {
                const newErrors = {};
                if (!formData.companyId) newErrors.companyId = "Company Name is required";
                if (!formData.name) newErrors.name = "Name is required";
                if (!formData.email) newErrors.email = "Email is required";
                if (!formData.phone) newErrors.phone = "Phone is required.";
                if (!formData.department) newErrors.department = "Department is required";
                if (!formData.designation) newErrors.designation = "designation is required";
                
                return newErrors;
            };

             const navigate = useNavigate();
            
                    const handleFormSubmit = async (e) => {
                        e.preventDefault();
                const validationErrors = validateForm();
                if (Object.keys(validationErrors).length === 0) {
                    try {   
                        const response = await addOrUpdateUser(formData);
                       if (response.success === true) {
                            setFormData({
                            companyId: "",
                            userID: "",
                            name: "",
                            email: "",
                            phone: "",
                            department: "",
                            designation: "",
                            profile_picture: "",
                            });
                            toast.success("User added/updated successfully.");
                            navigate('/user')
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
    <Link to='/user'>  <Button variant="contained" style={{padding :"4px 23px"}}>Back</Button></Link>
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
            <FormControl fullWidth variant="outlined" error={!!errors.companyId}>
              <InputLabel>Company Name</InputLabel>
              <Select
                name="companyId"
                value={formData["companyId"]}
                onChange={handleInputChange}
                label="Company Name"
                disabled={!!EditRowData}
              >
              {companies.map(company => (
                    <MenuItem  key={company.id} value={company.id}>{company.name}</MenuItem>
                  ))}
              </Select>
              <FormHelperText error>{errors.companyId}</FormHelperText>
            </FormControl>
          </Grid>

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
            <input
                type="file"
                name="profile_picture"
                id="profile_picture"
                onChange={handleImageChange}
                style={{ display: 'none' }}
                accept="image/*" 
            />
            <label htmlFor="profile_picture">
                <Button component="span" variant="outlined" fullWidth>
                {formData["profile_picture"] ? 'Change User Profile' : 'Upload User Profile'}
                </Button>
            </label>

            {formData["profile_picture"] && (
                <div style={{ marginTop: '8px' }}>
                <img
                    src={formData["profile_picture"]} 
                    alt="profile"
                    style={{
                    width: "36px",
                    height: "36px",
                    objectFit: "cover",
                    borderRadius: "50%", 
                    border: "1px solid #ccc"
                    }}
                />
                </div>
            )}

            {errors.profile_picture && (
                <FormHelperText error>
                {errors.profile_picture}
                </FormHelperText>
            )}
            </Grid>

            <Grid item xs={12} md={6}>
  <div style={{ position: "relative", marginBottom: "16px" }}>
    {/* Phone Input */}
    <PhoneInput
      inputProps={{
        name: "phone",
        style: {
          width: "100%",
          padding: "19.5px 40px",
          fontSize: "12px",
          border: errors.phone
            ? "1px solid #595959" 
            : "1px solid rgba(0, 0, 0, 0.23)",
          borderRadius: "4px",
          outline: "none",
          transition: "border-color 0.2s",
        },
      }}
      country={"in"}
      value={formData.phone}
      onChange={(phone) => setFormData({ ...formData, phone })}
      containerStyle={{
        width: "100%",
        position: "relative",
        display: "block",
      }}
      inputStyle={{
        width: "100%",
        paddingLeft: "8px", 
        boxSizing: "border-box",
      }}
      buttonStyle={{
        border: "none",
        background: "transparent",
        padding: "0",
        position: "absolute",
        left: "0",
        top: "50%",
        transform: "translateY(-50%)",
      }}
    />

    {/* Error Message */}
    {errors.phone && (
      <p
        style={{
          fontSize: "0.75rem",
          marginTop: "4px",
          color: "#d32f2f", // Error text color
        }}
      >
        {errors.phone}
      </p>
    )}
  </div>
</Grid>



          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Department"
              name="department"
              value={formData["department"]}
              onChange={handleInputChange}
              variant="outlined"
              error={!!errors.department}
              helperText={errors.department}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Designation"
              name="designation"
              value={formData["designation"]}
              onChange={handleInputChange}
              variant="outlined"
              error={!!errors.designation}
              helperText={errors.designation}
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
