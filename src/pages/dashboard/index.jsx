// material-ui
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { CiCreditCard1 } from "react-icons/ci";
import { BsDiagram2 } from "react-icons/bs";
// project import
import MainCard from 'components/MainCard';
import AnalyticEcommerce from 'components/cards/statistics/AnalyticEcommerce';
import UniqueVisitorCard from './UniqueVisitorCard';
import OrdersTable from './OrdersTable';

import { useEffect, useState } from 'react';
import { fetchAnalyticRequest, fetchAnalyticUsers, fetchTotalCompany } from 'api/Data';


// ==============================|| DASHBOARD - DEFAULT ||============================== //

export default function DashboardDefault() {
  const [internal ,setInternal] = useState();
  const [extrenal ,setExternal] = useState();
  const [chartData ,setChartData] = useState();
  const [data,setData] = useState('');
  const [permissions, setPermissions] = useState({
    menu: 0,
    create: 0,
    edit: 0,
    delete: 0
  });
  
  useEffect(() => {
    const storedPermissions = JSON.parse(localStorage.getItem('permissions')) || [];
    const userPermissions = storedPermissions.find(item => item.name === 'analytics') || {};
   
    setPermissions({
      menu: userPermissions.menu || 0,
      create: userPermissions.create || 0,
      edit: userPermissions.edit || 0,
      delete: userPermissions.delete || 0
    });
  }, []);

  useEffect(() => {
    fetchList();
    fetchComapnyList();
}, []);

const loginCompanyID =  JSON.parse(localStorage.getItem('logindetail')) || [];
const ID = loginCompanyID.companyID

const fetchList = async () => {
try {
  const response = await fetchAnalyticRequest(ID === 0 ? null : ID);
    const dataPoints = ID === 0 ? response.totalCompany.map(item => ({
      x: new Date(`${item.year}-${item.month}-01`), 
      y: item.count
  })) : response.totalUser.map(item => ({
    x: new Date(`${item.year}-${item.month}-01`), 
    y: item.count
  }))
  setInternal(response.internal_request);
  setExternal(response.external_request);
  setChartData(dataPoints);
} catch (error) {
  console.error('Error fetching default Analytic Requestlist:', error);
}
}

const fetchComapnyList = async () => {
try {
  if( ID === 0){
    const response = await fetchTotalCompany();
    setData(response.data.data);
  }else{
    const users = await fetchAnalyticUsers(ID);
    setData(users.data);
  }
} catch (error) {
  console.error('Error fetching default Analytic Requestlist:', error);
}
}


  return (
    <>
      {permissions.menu === 1 && (
      <Grid container rowSpacing={4.5} columnSpacing={2.75}>
        {/* row 1 */}
        <Grid item xs={12} sx={{ mb: -2.25 }}>
          <Typography variant="h5">Dashboard</Typography>
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <AnalyticEcommerce title="Declined Internal Requests" count={`${internal ? internal.declineRequest :""}`} percentage={`${internal ? internal.DeclineRequestsPercentage :""}`} isLoss color="warning" extra="1,943" icon={<BsDiagram2 style={{ fontSize: "1.25rem", color: "#ea5455" }}/>}  bgcolor='#fce5e6'/>
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <AnalyticEcommerce title="Declined External Requests" count={`${extrenal ? extrenal.declineRequest :""}`} percentage={`${extrenal ? extrenal.DeclineRequestsPercentage :""}`} isLoss color="warning" extra="$20,395" icon={<BsDiagram2 style={{ fontSize: "1.25rem", color: "#ea5455" }}/>}  bgcolor='#fce5e6'/>
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <AnalyticEcommerce title="Pending Internal Requests" count={`${internal ? extrenal.pendingRequest :""}`} percentage={`${internal ? internal.pendingRequestsPercentage :""}`} isLoss color="warning" extra="$20,395"  icon={<BsDiagram2 style={{ fontSize: "1.25rem", color: "#00cfe8" }}/>}  bgcolor='#d9f8fc'/>
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <AnalyticEcommerce title=" Pending External Requests" count={`${extrenal ? extrenal.pendingRequest :""}`} percentage={`${extrenal ? extrenal.pendingRequestsPercentage :""}`} isLoss color="warning" extra="$20,395" icon={<BsDiagram2 style={{ fontSize: "1.25rem", color: "#00cfe8" }}/>}  bgcolor='#d9f8fc' />
        </Grid>
        <Grid item xs={12} sx={{ display: { sm: 'none', md: 'block', lg: 'none' } }} />
        <Grid item xs={12} md={12} lg={12}>
          <UniqueVisitorCard  chartData={chartData} ID={ID}/>
        </Grid>
        <Grid item xs={12} sm={12} md={6} lg={6}>
        <Grid item xs={12} sm={12} md={12} lg={12} mt={5}>
          <AnalyticEcommerce title="Internal Requests sent" count={`${internal ? internal.totalRequest :""}`} percentage='' extra="65,000"  icon={<CiCreditCard1 style={{ fontSize: "1.25rem", color: "#28c76f" }}/>} bgcolor='#dff7e9' />
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={12} mt={3}>
          <AnalyticEcommerce title="External Requests sent" count={`${extrenal ? extrenal.totalRequest :""}`} percentage='' extra="8,900"  icon={<CiCreditCard1 style={{ fontSize: "1.25rem", color: "#28c76f" }}/>} bgcolor='#dff7e9' />
        </Grid>
        </Grid>
        <Grid item xs={12} md={6} lg={6}>
          <Grid container alignItems="center" justifyContent="space-between">
            <Grid item>
              <Typography variant="h5">Top 5 Companies</Typography>
            </Grid>
            <Grid item />
          </Grid>
          <MainCard sx={{ mt: 2 }} content={false}>
            <OrdersTable ID={ID} data={data}/>
          </MainCard>
        </Grid>
      </Grid>
     ) }
    </>
  );
}
