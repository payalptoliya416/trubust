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
        <Link to='/company'>  <Button variant="contained" style={{padding :"4px 23px"}}>Back</Button></Link>
      </div>
      <Grid container spacing={2} mb={4}>
  <Grid item xs={12} lg={6}>
  <h3>Company Information</h3>
    <Card 
    sx={{ 
      textAlign: 'center', 
      padding: 1, 
      borderRadius: 2, 
      margin: '0 auto' 
    }}
  > 
  <div style={{backgroundColor:"#E6F4FF" , padding:"20px 0"}}>
    <CardMedia
      component="img"
      sx={{ 
        width: 70, 
        height: 70, 
        borderRadius: '50%', 
        margin: '0 auto', 
        backgroundColor: 'rgba(115, 103, 240, 0.25)', 
        objectFit: '100% 100%' ,
      }}
      image={singleCompnay.companyLogo}
      alt={`logo`}  
    />
    <Typography 
        variant="h5" 
        component="h3" 
        sx={{ 
          color: '#7367F0', 
          fontWeight: 'bold', 
          padding:"10px 0 0 0"
        }}
      >
        {singleCompnay.name}
      </Typography>
  </div>
    <CardContent>
      <Box sx={{ textAlign: 'left', marginBottom: 3 }}>
        <Typography variant="body1" sx={{ marginBottom: 1 , display:"flex", justifyContent: { xs: "flex-start", sm: "space-between" } , alignItems:"center" , flexWrap: {xs: "wrap"} , gap:"3px"}}>
          <strong>Total Employers:</strong> {singleCompnay.totalEmployers}
        </Typography>
        <Typography variant="body1" sx={{ marginBottom: 1 , display:"flex", justifyContent: { xs: "flex-start", sm: "space-between" } , alignItems:"center" , flexWrap: {xs: "wrap"} , gap:"3px" }}>
          <strong>Company Locations:</strong> {singleCompnay.companyLocations}
        </Typography>
        <Typography variant="body1" sx={{ marginBottom: 1 , display:"flex", justifyContent: { xs: "flex-start", sm: "space-between" } , alignItems:"center" , flexWrap: {xs: "wrap"} , gap:"3px" }}>
          <strong>Business Activity:</strong> {singleCompnay.bussinessActivity}
        </Typography>
        <Typography variant="body1" sx={{ marginBottom: 1 , display:"flex", justifyContent: { xs: "flex-start", sm: "space-between" } , alignItems:"center" , flexWrap: {xs: "wrap"} , gap:"3px" }}>
          <strong>Clients:</strong> {singleCompnay.clients}
        </Typography>
        <Typography variant="body1" sx={{ marginBottom: 1 , display:"flex", justifyContent: { xs: "flex-start", sm: "space-between" } , alignItems:"center" , flexWrap: {xs: "wrap"} , gap:"3px" }}>
          <strong>Value of Service/Product:</strong> {singleCompnay.serviceAndProduct}
        </Typography>
        <Typography variant="body1" sx={{ marginBottom: 1 , display:"flex", justifyContent: { xs: "flex-start", sm: "space-between" } , alignItems:"center" , flexWrap: {xs: "wrap"} , gap:"3px" }}>
          <strong>Providers:</strong> {singleCompnay.providers}
        </Typography>
        <Typography variant="body1" sx={{ marginBottom: 1 , display:"flex", justifyContent: { xs: "flex-start", sm: "space-between" } , alignItems:"center" , flexWrap: {xs: "wrap"} , gap:"3px" }}>
          <strong>Reporting Officer:</strong> {singleCompnay.reportingOfficer}
        </Typography>
        <Typography variant="body1" sx={{ marginBottom: 1 , display:"flex", justifyContent: { xs: "flex-start", sm: "space-between" } , alignItems:"center" , flexWrap: {xs: "wrap"} , gap:"3px" }}>
          <strong>MSP:</strong> {singleCompnay.msp}
        </Typography>
      </Box>

      <Typography variant="h6" sx={{ textAlign: 'left', fontWeight: 'bold', marginBottom: 1 , display:"flex", justifyContent: { xs: "flex-start", sm: "space-between" } , alignItems:"center" , flexWrap: {xs: "wrap"} , gap:"3px" }}>
        Risk Info
      </Typography>
      <Box sx={{ textAlign: 'left' }}>
        <Typography variant="body1" sx={{ marginBottom: 1 , display:"flex", justifyContent: { xs: "flex-start", sm: "space-between" } , alignItems:"center" , flexWrap: {xs: "wrap"} , gap:"3px" }}>
          <strong>Previous Attacks:</strong> {singleCompnay.previosAttacks}
        </Typography>
        <Typography variant="body1" sx={{ marginBottom: 1 , display:"flex", justifyContent: { xs: "flex-start", sm: "space-between" } , alignItems:"center" , flexWrap: {xs: "wrap"} , gap:"3px" }}>
          <strong>Security Assets:</strong> {singleCompnay.securityAssets}
        </Typography>
        <Typography variant="body1" sx={{ marginBottom: 1 , display:"flex", justifyContent: { xs: "flex-start", sm: "space-between" } , alignItems:"center" , flexWrap: {xs: "wrap"} , gap:"3px" }}>
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
