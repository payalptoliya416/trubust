// material-ui
import Avatar from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// project import
import MainCard from 'components/MainCard';
import AnalyticEcommerce from 'components/cards/statistics/AnalyticEcommerce';
import MonthlyBarChart from './MonthlyBarChart';
import ReportAreaChart from './ReportAreaChart';
import UniqueVisitorCard from './UniqueVisitorCard';
import SaleReportCard from './SaleReportCard';
import OrdersTable from './OrdersTable';

// assets
import GiftOutlined from '@ant-design/icons/GiftOutlined';
import MessageOutlined from '@ant-design/icons/MessageOutlined';
import SettingOutlined from '@ant-design/icons/SettingOutlined';
import avatar1 from 'assets/images/users/avatar-1.png';
import avatar2 from 'assets/images/users/avatar-2.png';
import avatar3 from 'assets/images/users/avatar-3.png';
import avatar4 from 'assets/images/users/avatar-4.png';
import { useEffect, useRef, useState } from 'react';
import { fetchAnalyticRequest, fetchAnalyticUsers, fetchTotalCompany } from 'api/Data';

// avatar style
const avatarSX = {
  width: 36,
  height: 36,
  fontSize: '1rem'
};

// action style
const actionSX = {
  mt: 0.75,
  ml: 1,
  top: 'auto',
  right: 'auto',
  alignSelf: 'flex-start',
  transform: 'none'
};

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
          <AnalyticEcommerce title="Declined Internal Requests" count={`${internal ? internal.declineRequest :""}`} percentage={`${internal ? internal.DeclineRequestsPercentage :""}`} isLoss color="warning" extra="1,943" />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <AnalyticEcommerce title="Declined External Requests" count={`${extrenal ? extrenal.declineRequest :""}`} percentage={`${extrenal ? extrenal.DeclineRequestsPercentage :""}`} isLoss color="warning" extra="$20,395" />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <AnalyticEcommerce title="Pending Internal Requests" count={`${internal ? extrenal.pendingRequest :""}`} percentage={`${internal ? internal.pendingRequestsPercentage :""}`} isLoss color="warning" extra="$20,395" />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <AnalyticEcommerce title=" Pending External Requests" count={`${extrenal ? extrenal.pendingRequest :""}`} percentage={`${extrenal ? extrenal.pendingRequestsPercentage :""}`} isLoss color="warning" extra="$20,395" />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <AnalyticEcommerce title="Internal Requests sent" count={`${internal ? internal.totalRequest :""}`} percentage='' extra="35,000" />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <AnalyticEcommerce title="External Requests sent" count={`${extrenal ? extrenal.totalRequest :""}`} percentage='' extra="8,900" />
        </Grid>
        <Grid item xs={12} sx={{ display: { sm: 'none', md: 'block', lg: 'none' } }} />
        <Grid item xs={12} md={7} lg={8}>
          <UniqueVisitorCard  chartData={chartData} ID={ID}/>
        </Grid>
        <Grid item xs={12} md={7} lg={4}>
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
