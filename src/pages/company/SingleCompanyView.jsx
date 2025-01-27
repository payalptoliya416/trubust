import { fetchCompanyView } from 'api/Data';
import React, { useEffect, useState } from 'react'
import Button from '@mui/material/Button';
import { Link, useLocation } from 'react-router-dom';
import EndPointList from './EndPointList';
import ExtrnalRequest from './ExtrnalRequest';
import { Box, Card, CardContent, CardMedia, Grid, Typography } from '@mui/material';

export default function SingleCompanyView() {

      const location = useLocation();
      const cID = location.state?.ID;
  const [singleCompnay, setSingleCompany] = useState([]);
  useEffect(() => {
    SingleCompanyData();
  }, []);

  const SingleCompanyData = async () => {

    try {
      const res = await fetchCompanyView(cID);
      setSingleCompany(res.data.data);
    } catch (error) {
      console.error("Error fetching single company data:", error);
    }
  };

  return (
    <>
      <div style={{ marginBottom: "20px", textAlign: "end" }}>
        <Link to='/company'>  <Button variant="contained">Back</Button></Link>
      </div>
      <Grid container spacing={2} mb={4}>
  <Grid item xs={12} lg={6}>
  <Card 
  sx={{ 
    textAlign: 'center', 
    padding: 1, 
    borderRadius: 2, 
    boxShadow: 3, 
    margin: '0 auto' 
  }}
>
  <CardMedia
    component="img"
    sx={{ 
      width: 70, 
      height: 70, 
      borderRadius: '50%', 
      margin: '0 auto', 
      backgroundColor: 'rgba(115, 103, 240, 0.25)', 
      objectFit: '100% 100%' 
    }}
    image={singleCompnay.companyLogo}
    alt={`logo`}
  />

  <CardContent>
    <Typography 
      variant="h5" 
      component="h3" 
      sx={{ 
        color: '#7367F0', 
        fontWeight: 'bold', 
        marginTop: 1 
      }}
    >
      {singleCompnay.name}
    </Typography>
    <Typography 
      variant="body1" 
      sx={{ 
        color: '#2f2d3dc7', 
        marginTop: 1, 
        marginBottom: 3 
      }}
    >
      {singleCompnay.description || ''}
    </Typography>

    <Typography variant="h6" sx={{ textAlign: 'left', fontWeight: 'bold', marginBottom: 1 }}>
      Company Details
    </Typography>
    <Box sx={{ textAlign: 'left', marginBottom: 3 }}>
      <Typography variant="body1" sx={{ marginBottom: 1 }}>
        <strong>Total Employers:</strong> {singleCompnay.totalEmployers}
      </Typography>
      <Typography variant="body1" sx={{ marginBottom: 1 }}>
        <strong>Company Locations:</strong> {singleCompnay.companyLocations}
      </Typography>
      <Typography variant="body1" sx={{ marginBottom: 1 }}>
        <strong>Business Activity:</strong> {singleCompnay.bussinessActivity}
      </Typography>
      <Typography variant="body1" sx={{ marginBottom: 1 }}>
        <strong>Clients:</strong> {singleCompnay.clients}
      </Typography>
      <Typography variant="body1" sx={{ marginBottom: 1 }}>
        <strong>Value of Service/Product:</strong> {singleCompnay.serviceAndProduct}
      </Typography>
      <Typography variant="body1" sx={{ marginBottom: 1 }}>
        <strong>Providers:</strong> {singleCompnay.providers}
      </Typography>
      <Typography variant="body1" sx={{ marginBottom: 1 }}>
        <strong>Reporting Officer:</strong> {singleCompnay.reportingOfficer}
      </Typography>
      <Typography variant="body1" sx={{ marginBottom: 1 }}>
        <strong>MSP:</strong> {singleCompnay.msp}
      </Typography>
    </Box>

    <Typography variant="h6" sx={{ textAlign: 'left', fontWeight: 'bold', marginBottom: 1 }}>
      Risk Info
    </Typography>
    <Box sx={{ textAlign: 'left' }}>
      <Typography variant="body1" sx={{ marginBottom: 1 }}>
        <strong>Previous Attacks:</strong> {singleCompnay.previosAttacks}
      </Typography>
      <Typography variant="body1" sx={{ marginBottom: 1 }}>
        <strong>Security Assets:</strong> {singleCompnay.securityAssets}
      </Typography>
      <Typography variant="body1" sx={{ marginBottom: 1 }}>
        <strong>Most Used Platforms:</strong> {singleCompnay.mostUsedPlatforms}
      </Typography>
    </Box>
  </CardContent>
</Card>
  </Grid>
  <Grid item xs={12} lg={6}>
  <EndPointList/>
  </Grid>
   </Grid>
   <ExtrnalRequest singleCompnay={singleCompnay}/>
    </>
  )
}
