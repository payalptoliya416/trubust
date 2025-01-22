import React, { useCallback, useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Button from '@mui/material/Button';
import { FormControl, FormHelperText, Grid, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { addOrUpdateCompany } from 'api/Data';
import { toast, ToastContainer } from 'react-toastify';

export default function EditCompany() {
        const location = useLocation();
        const EditRowData =  location.state?.rowData;

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        companyLocations: "",
        companyLogo: "",
        totalEmployers: "",
        bussinessActivity: "",
        clients: "",
        serviceAndProduct: "",
        providers: "",
        reportingOfficer: "",
        msp: "",
        previosAttacks: "",
        securityAssets: "",
        mostUsedPlatforms: "",
      });

      useEffect(() => {
        if (EditRowData) {
            setFormData({
                companyID:EditRowData.id || 0,
                name: EditRowData.name || "",
                email: EditRowData.email || "",
                companyLocations: EditRowData.companyLocations || "",
                companyLogo: EditRowData.companyLogo || "",
                totalEmployers: EditRowData.totalEmployers || "",
                bussinessActivity: EditRowData.bussinessActivity || "",
                clients: EditRowData.clients || "",
                serviceAndProduct: EditRowData.serviceAndProduct || "",
                providers: EditRowData.providers || "",
                reportingOfficer: EditRowData.reportingOfficer || "",
                msp: EditRowData.msp || "",
                previosAttacks: EditRowData.previosAttacks || "",
                securityAssets: EditRowData.securityAssets || "",
                mostUsedPlatforms: EditRowData.mostUsedPlatforms || "",
            });
        }
    }, [EditRowData]);

      const [errors, setErrors] = useState({});
    
      const handleInputChange = useCallback((e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
      }, []);
    
      const handleImageChange = useCallback((e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData((prev) => ({
                    ...prev,
                    companyLogo: reader.result, 
                }));
            };
            reader.readAsDataURL(file);
        }
    }, []);

        const validateForm = () => {
            const newErrors = {};
            if (!formData.name) newErrors.name = "Company name is required.";
            if (!formData.email) newErrors.email = "Email is required.";
            if (!formData.totalEmployers) newErrors.totalEmployers = "Total Employers is required.";
            if (!formData.bussinessActivity) newErrors.bussinessActivity = "Business Activity is required.";
            if (!formData.companyLocations) newErrors.companyLocations = "Company Locations is required";
            if (!formData.clients) newErrors.clients = "Clients is required";
            if (!formData.serviceAndProduct) newErrors.serviceAndProduct = "Value of Service/Product is required";
            if (!formData.providers) newErrors.providers = "Providers is required";
            if (!formData.reportingOfficer) newErrors.reportingOfficer = "Reporting Officer is required";
            if (!formData.msp) newErrors.msp = "MSP is required";
            if (!formData.previosAttacks) newErrors.previosAttacks = "Previous Attacks is required";
            if (!formData.securityAssets) newErrors.securityAssets = "Security Assets is required";
            if (!formData.mostUsedPlatforms) newErrors.mostUsedPlatforms = "Most Used Platforms is required";
            if (!formData.companyLogo) newErrors.companyLogo = "Company logo is required";
            
            return newErrors;
        };
        const navigate = useNavigate();

        const handleFormSubmit = async (e) => {
            e.preventDefault();
    
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length === 0) {
        try {   
            const response = await addOrUpdateCompany(formData);
       if (response.success === true) {
                setFormData({
                    companyID: 0,
                    email: "",
                    totalEmployers: "",
                    name: "",
                    companyLocations: "",
                    bussinessActivity: "",
                    clients: "",
                    serviceAndProduct: "",
                    providers: "",
                    reportingOfficer: "",
                    msp: "",
                    previosAttacks: "",
                    securityAssets: "",
                    mostUsedPlatforms: "",
                    companyLogo: "",
                });
                toast.success("Company added/updated successfully.");
                navigate('/company')
            } else {
                toast.error("Failed to add/update company.", response.error);
            }
        } catch (error) {
            toast.error("An error occurred while adding/updating the company.", error);
        }
    } else {
        setErrors(validationErrors);
    }
         };

  return (
    <>
      <div style={{marginBottom:"20px" , textAlign: "end"}}>
    <Link to='/company'>  <Button variant="contained">Back</Button></Link>
    </div>
    <div className="bg-white shadow-md p-4">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-lg font-semibold">
          {EditRowData  ? "Edit Company Name" : "Add Company Name"}
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
            <FormControl fullWidth variant="outlined" error={!!errors.companyLocations}>
              <InputLabel>Country</InputLabel>
              <Select
                name="companyLocations"
                value={formData["companyLocations"]}
                onChange={handleInputChange}
                label="Country"
              >
                <MenuItem value="">Select</MenuItem>
                <MenuItem value="India">India</MenuItem>
                <MenuItem value="USA">USA</MenuItem>
                <MenuItem value="UN">UN</MenuItem>
                <MenuItem value="India,USA">India,USA</MenuItem>
              </Select>
              <FormHelperText error>{errors.companyLocations}</FormHelperText>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <input
                type="file"
                name="companyLogo"
                id="companyLogo"
                onChange={handleImageChange}
                style={{ display: 'none' }}
                accept="image/*" 
            />
            <label htmlFor="companyLogo">
                <Button component="span" variant="outlined" fullWidth>
                {formData["companyLogo"] ? 'Change Logo' : 'Upload Logo'}
                </Button>
            </label>

            {formData["companyLogo"] && (
                <div style={{ marginTop: '8px' }}>
                <img
                    src={formData["companyLogo"]} 
                    alt="Company Logo"
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

            {errors.companyLogo && (
                <FormHelperText error>
                {errors.companyLogo}
                </FormHelperText>
            )}
            </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Total Employers"
              name="totalEmployers"
              value={formData["totalEmployers"]}
              onChange={handleInputChange}
              variant="outlined"
              error={!!errors.totalEmployers}
              helperText={errors.totalEmployers}
              type="number"
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Business Activity"
              name="bussinessActivity"
              value={formData["bussinessActivity"]}
              onChange={handleInputChange}
              variant="outlined"
              error={!!errors.bussinessActivity}
              helperText={errors.bussinessActivity}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Clients"
              name="clients"
              value={formData["clients"]}
              onChange={handleInputChange}
              variant="outlined"
              error={!!errors.clients}
              helperText={errors.clients}
              type="number"
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Value of Service/Product"
              name="serviceAndProduct"
              value={formData["serviceAndProduct"]}
              onChange={handleInputChange}
              variant="outlined"
              error={!!errors.serviceAndProduct}
              helperText={errors.serviceAndProduct}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Providers"
              name="providers"
              value={formData["providers"]}
              onChange={handleInputChange}
              variant="outlined"
              error={!!errors.providers}
              helperText={errors.providers}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth variant="outlined" error={!!errors.reportingOfficer}>
              <InputLabel>Reporting Officer</InputLabel>
              <Select
                name="reportingOfficer"
                value={formData["reportingOfficer"]}
                onChange={handleInputChange}
                label="Reporting Officer"
              >
                <MenuItem value="">Select</MenuItem>
                <MenuItem value="Yes">Yes</MenuItem>
                <MenuItem value="No">No</MenuItem>
              </Select>
              <FormHelperText error>{errors.reportingOfficer}</FormHelperText>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
  <FormControl fullWidth variant="outlined" error={!!errors.msp}>
    <InputLabel>MSP</InputLabel>
    <Select
      name="msp"
      value={formData["msp"]}
      onChange={handleInputChange}
      label="MSP"
    >
      <MenuItem value="">Select</MenuItem>
      <MenuItem value="Yes">Yes</MenuItem>
      <MenuItem value="No">No</MenuItem>
    </Select>
    {errors.msp && (
      <FormHelperText error>{errors.msp}</FormHelperText> 
    )}
  </FormControl>
</Grid>


          <Grid item xs={12} md={6}>
            <FormControl fullWidth variant="outlined" error={!!errors.previosAttacks}>
              <InputLabel>Previous Attacks</InputLabel>
              <Select
                name="previosAttacks"
                value={formData["previosAttacks"]}
                onChange={handleInputChange}
                label="Previous Attacks"
              >
                <MenuItem value="">Select</MenuItem>
                <MenuItem value="Yes">Yes</MenuItem>
                <MenuItem value="No">No</MenuItem>
              </Select>
              <FormHelperText error>{errors.previosAttacks}</FormHelperText>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Security Assets"
              name="securityAssets"
              value={formData["securityAssets"]}
              onChange={handleInputChange}
              variant="outlined"
              error={!!errors.securityAssets}
              helperText={errors.securityAssets}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Most Used Platforms"
              name="mostUsedPlatforms"
              value={formData["mostUsedPlatforms"]}
              onChange={handleInputChange}
              variant="outlined"
              error={!!errors.mostUsedPlatforms}
              helperText={errors.mostUsedPlatforms}
            />
          </Grid>

          <Grid item xs={1}>
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
