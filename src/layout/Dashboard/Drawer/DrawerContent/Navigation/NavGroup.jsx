import PropTypes from 'prop-types';
// material-ui
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// project import
import NavItem from './NavItem';
import { useGetMenuMaster } from 'api/menu';
import CollapseItem from './CollapseItem';
import { useEffect, useState } from 'react';
export default function NavGroup({ item }) {
  const { menuMaster } = useGetMenuMaster();
  const drawerOpen = menuMaster.isDashboardDrawerOpened;
 
  const [logResponse, setLogResponse] = useState([]);
  useEffect(() => {
    const storedPermissions = JSON.parse(localStorage.getItem('permissions'));
    if (storedPermissions) {
      setLogResponse(storedPermissions);
    }
  }, []);
  const hasPermission = (permissionName) => {
    return logResponse.some(item => item.name === permissionName);
  };
  const navCollapse = item.children?.map((menuItem) => {
    if (!hasPermission(menuItem.id)) {
      return null; 
    }
    switch (menuItem.type) {
      case 'collapse':
        return (
             <CollapseItem key={menuItem.id} item={menuItem} level={1}/> 
        );
      case 'item':
        return <NavItem key={menuItem.id} item={menuItem} level={1} />;
      default:
        return (
          <Typography key={menuItem.id} variant="h6" color="error" align="center">
            Fix - Group Collapse or Items
          </Typography>
        );
    }
  });

  return (
    <List
      subheader={
        item.title &&
        drawerOpen && (
          <Box sx={{ pl: 3, mb: 1.5 }}>
            <Typography variant="subtitle2" color="textSecondary">
              {item.title}
            </Typography>
          </Box>
        )
      }
      sx={{ mb: drawerOpen ? 1.5 : 0, py: 0, zIndex: 0 }}
    >
      {navCollapse}
    </List>
  );
}

NavGroup.propTypes = { item: PropTypes.object };
