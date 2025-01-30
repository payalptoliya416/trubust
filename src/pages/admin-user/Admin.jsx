import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { adminUsers, fetchDeleteAdmin } from 'api/Data';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import Button from '@mui/material/Button';
import { Link, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';

const columns = [
    { 
      id: "id", 
      label: "SR No.", 
      minWidth: 170,
    },
    { id: "name", label: "Name", minWidth: 170 },
    { id: "role_name", label: "ROLE NAME", minWidth: 170 },
    { id: "companyname", label: "COMAPANY NAME", minWidth: 170 },
    { id: "email", label: "EMAIL", minWidth: 170 },
    { id: "phone_no", label: "PHONE", minWidth: 170 },
    { id: "action", label: "Actions", minWidth: 170 },
  ];

function Admin() {
     const [page, setPage] = React.useState(0);
              const [rowsPerPage, setRowsPerPage] = React.useState(10);
              const [rowData, setRowData] = React.useState([]);
              const navigate = useNavigate();
              const handleChangePage = (event, newPage) => {
                setPage(newPage);
              };
              const handleChangeRowsPerPage = (event) => {
                setRowsPerPage(+event.target.value);
                setPage(0);
              };
    
              const [permissions, setPermissions] = React.useState({
                menu: 0,
                create: 0,
                edit: 0,
                delete: 0
              });
            
              React.useEffect(() => {
                const storedPermissions = JSON.parse(localStorage.getItem('permissions')) || [];
                const userPermissions = storedPermissions.find(item => item.name === 'company') || {};
              
                setPermissions({
                  menu: userPermissions.menu || 0,
                  create: userPermissions.create || 0,
                  edit: userPermissions.edit || 0,
                  delete: userPermissions.delete || 0
                });
              }, [setPermissions]);
    
              React.useEffect(() => {
            
                const fetchUsers = async () => {
                  try {
                    const response = await adminUsers();
                    setRowData(response.data.admins);
                  } catch (error) {
                    console.error('Error fetching admin user list:', error);
                  } 
                };
              
                fetchUsers();
              }, []);

              const handleEditClick = (rowData) => {
                navigate('/admin/add-user', { state: { rowData } });
            };
                const handleDeleteClick = async (rowData) => {
                    try {
                      const deleteResult = await fetchDeleteAdmin(rowData.id);
                      if (deleteResult.data.success === true) {
                        toast.success('User deleted successfully.');
                        const userListResult = await adminUsers();
                        if (userListResult.success === true) {
                          setRowData(userListResult.data.admins);
                        } else {
                          console.error('Error fetching updated user list:', userListResult.error);
                        }
                      } else {
                        console.error('Error deleting user:', deleteResult.error);
                      }
                    } catch (error) {
                      console.error('Error handling delete click:', error);
                    }
                  };
  return (
    <>
     {permissions.menu === 1 && (
      <>
    { permissions.create === 1 &&(
       <div style={{marginBottom:"20px" , textAlign: "end"}}>
    <Link to='/admin/add-user'>  <Button variant="contained">+ Add User</Button></Link>
    </div>
    )}
    <ToastContainer/>
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 580 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{
                minWidth: column.minWidth,
                position: 'sticky',
                top: 0,  
                backgroundColor: '#fff', // Add background color to avoid transparency issues
                zIndex: 1, // Ensure the header is above the body rows
              }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rowData
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                    {columns.map((column) => {
                      if (column.id === 'action') {
                        return (
                          <TableCell key={column.id} align="left">
                            <div style={{ display: 'flex', gap: '14px' }}>
                            {permissions.edit === 1 && (
                              <EditOutlined
                                style={{ color: '#52c41a', cursor: 'pointer' }}
                                onClick={() => handleEditClick(row)}
                              />)}
                              {permissions.delete === 1 && (
                              <DeleteOutlined
                                style={{ color: '#ff4d4f', cursor: 'pointer' }}
                                onClick={() => handleDeleteClick(row)}
                              />)}
                            </div>
                          </TableCell>
                        );
                      }
                      return (
                        <TableCell key={column.id} align="left">
                          {row[column.id]}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={rowData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      </>
    )}
    </>
  )
}

export default Admin
