import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import Button from '@mui/material/Button';
import { Link, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { fecthRoleDelete, fetchRoleList } from 'api/Data';

const columns = [

    { id: "name", label: "ROLE", minWidth: 170 },
    { id: "action", label: "Actions", minWidth: 170 },
];

function RolePermission() {

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
                const response = await fetchRoleList();
                setRowData(response.data.roles);
            } catch (error) {
                console.error('Error fetching admin user list:', error);
            }
        };

        fetchUsers();
    }, []);

    const handleEditClick = (rowData) => {
        navigate('/role-permission/add-rolename', { state: { rowData } });
    };

    const handleDeleteClick = async (rowData) => {
        try {
            const deleteResult = await fecthRoleDelete(rowData.id);
            if (deleteResult.data.success === true) {
                toast.success('User deleted successfully.');
                const userListResult = await fetchRoleList();
                if (userListResult.success === true) {
                    setRowData(userListResult.data.roles);
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

    const handlePermission = (row)=>{
navigate('add-role-permission', { state: { row } })
    }

    return (
        <>
   <div style={{marginBottom:"20px" , textAlign: "end"}}>
    <Link to='/role-permission/add-rolename'>  <Button variant="contained" >+ Add Role</Button></Link>
    </div>
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
                               <Button
                                variant="outlined"
                                style={{ padding: '1px 6px', fontSize: '11px' }}
                                onClick={() => handlePermission(row)}
                              >
                                 Permission
                              </Button>
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
    )
}

export default RolePermission
