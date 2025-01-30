import PropTypes from 'prop-types';
import { useState } from 'react';

// material-ui
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

// assets
import LogoutOutlined from '@ant-design/icons/LogoutOutlined';
import { useNavigate } from 'react-router';
import { removeAuthTokenFromLocalStorage } from 'api/Data';

// ==============================|| HEADER PROFILE - PROFILE TAB ||============================== //

export default function ProfileTab() {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const navigate = useNavigate();
  const handleLogOut = ()=>{
    removeAuthTokenFromLocalStorage();
    navigate('/login')
  }

  return (
    <List component="nav" sx={{ p: 0, '& .MuiListItemIcon-root': { minWidth: 32 } }}>
      <ListItemButton selected={selectedIndex === 2} onClick={handleLogOut}>
        <ListItemIcon>
          <LogoutOutlined />
        </ListItemIcon>
        <ListItemText primary="Logout" />
      </ListItemButton>
    </List>
  );
}

ProfileTab.propTypes = { handleLogout: PropTypes.func };
