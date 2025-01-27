import { AddRolePermission, EditRolePermission, fetchAllPermissionList, fetchPermissionList } from 'api/Data';
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router';
import { Box, Button, Checkbox, FormControlLabel, Grid, Typography, Paper, CircularProgress } from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';

function AddPermission() {
      const location = useLocation();
      const rowData = location.state?.row;
      const [permissionData, setPermissionData] = useState([]);
      const [loading, setLoading] = useState(true);
      const [isEditing, setIsEditing] = useState(false);
      const [data, setData] = useState([]);
      const navigate = useNavigate();

      useEffect(() => {
        const fetchUsers = async () => {
          try {
            const permission = await fetchAllPermissionList();
            const response = await fetchPermissionList(rowData.id);
            setData(permission);
            const allPermissions = permission.map(item => {
              const matchedPermission = response.find(respItem => respItem.id === item.id) || {};
              return {
                permission_id: item.id,
                menu: matchedPermission.menu || 0,
                create: matchedPermission.create || 0,
                edit: matchedPermission.edit || 0,
                delete: matchedPermission.delete || 0,
              };
            });
            setPermissionData(allPermissions);
            setIsEditing(response.length > 0);
            setLoading(false);
            
          } catch (error) {
            console.error('Error fetching permission list:', error);
          }
        };
    
        fetchUsers();
      }, [rowData.id]);
    
      const handleCheckboxChange = (permission_id, key, checked) => {
        setPermissionData(prevState =>
          prevState.map(permission =>
            permission.permission_id === permission_id
              ? { ...permission, [key]: checked ? 1 : 0 }
              : permission
          )
        );
      };
    
      const PermissionSubmit = async (e) => {
        e.preventDefault();
        const payload = { role_id: rowData.id, permissions: permissionData };
        
        try {
          const action = isEditing ? EditRolePermission : AddRolePermission;
          const rolePermission = await action(payload);
          if (rolePermission.success) {
            toast.success(rolePermission.data.data.response);
            setTimeout(()=>{
                navigate('/role-permission');
            },1400)
          }
        } catch (error) {
          console.error('Error handling role permission:', error);
        }
      };
      
      
      const handleNavigate = ()=>{
        navigate('/role-permission');
      }
  return (
    <>
    <h2 className="text-lg font-semibold">
    {rowData.name.charAt(0).toUpperCase() + rowData.name.slice(1)}

    </h2>
    <ToastContainer/>
    <Box sx={{ bgcolor: 'white', borderRadius: 2, overflow: 'hidden' }}>
      <Box sx={{ p: 3, display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h6" sx={{ color: '#6f6b7d' }}>
          {rowData.name.charAt(0).toUpperCase() + rowData.name.slice(1)} Permissions
        </Typography>
      </Box>

      <Box sx={{ px: 3, pb: 3 }}>

        <form onSubmit={PermissionSubmit}>
          {loading ? (
            <Typography variant="body1" align="center">
             <Box style={{display: "flex" , justifyContent:"center", alignItems: "center" , height:"100%" , width:"100%"}}><CircularProgress /></Box>
            </Typography>
          ) : (
            <Paper sx={{ p: 2 }}>
              <Grid container spacing={2}>
                {data
                  .filter(
                    (itemData) =>
                      !['ticket', 'role', 'adminuser', 'logs', 'company'].includes(itemData.name)
                  )
                  .map((itemData) => (
                    <Grid item xs={12} key={itemData.id}>
                      <Grid container alignItems="center" spacing={3}>
                        <Grid item xs={3}>
                          <Typography variant="body2" sx={{ color: '#6f6b7d' }}>
                            {
                              {
                                analytics: 'Analytics',
                                user: 'User',
                                request: 'External Request View',
                                internal: 'Internal Request View',
                                groupchat: 'Secure Channel',
                              }[itemData.name] || ''
                            }
                          </Typography>
                        </Grid>
                        <Grid item xs={9}>
                          <Grid container justifyContent="space-between">
                            {['menu', 'create', 'edit', 'delete'].map((action) => (
                              <Grid item key={action}>
                                <FormControlLabel
                                  control={
                                    <Checkbox
                                      checked={
                                        permissionData.find(
                                          (permission) => permission.permission_id === itemData.id
                                        )?.[action] === 1
                                      }
                                      onChange={(e) =>
                                        handleCheckboxChange(itemData.id, action, e.target.checked)
                                      }
                                      size="small"
                                    />
                                  }
                                  label={action.charAt(0).toUpperCase() + action.slice(1)}
                                  sx={{
                                    '& .MuiCheckbox-root': { color: '#6f6b7d' },
                                  }}
                                />
                              </Grid>
                            ))}
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  ))}
              </Grid>
            </Paper>
          )}

          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center', gap: 2 }}>
            <Button variant="contained" color="primary" type="submit">
              Submit
            </Button>
            <Button variant="outlined" color="secondary" onClick={handleNavigate}>
              Cancel
            </Button>
          </Box>
        </form>
      </Box>
    </Box>
    </>
  )
}

export default AddPermission
