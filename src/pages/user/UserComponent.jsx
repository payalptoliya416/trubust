import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import Button from '@mui/material/Button';
import { Link, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { fetchDeleteUser, fetchUserList, sendVerification } from 'api/Data';
import { Grid, TextField } from '@mui/material';

const columns = [
    { 
      id: "company_name", 
      label: "Company Name", 
      minWidth: 170,
    },
    { id: "name", label: "Name", minWidth: 100 },
    { id: "email", label: "Email", minWidth: 170 },
    { id: "phone", label: "Phone", minWidth: 170 },
    { id: "action", label: "Actions", minWidth: 170 },
  ];

export default function UserComponent() {
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

      React.useEffect(() => {
        fetchDefaultUserList();
      }, []);
      
      const loginCompanyID =  JSON.parse(localStorage.getItem('logindetail')) || [];
      const ID = loginCompanyID.companyID
      
      const fetchDefaultUserList = async () => {
        try {
          const response = await fetchUserList(ID === 0 ? null : ID);
          if (response.success) {
            setRowData(response.data.data);
          } else {
            console.error('Failed to fetch default user list:', response.error);
          }
        } catch (error) {
          console.error('Error fetching default user list:', error);
        }
      };
      const [permissions, setPermissions] = React.useState({
        menu: 0,
        create: 0,
        edit: 0,
        delete: 0
      });
      
      React.useEffect(() => {
        const storedPermissions = JSON.parse(localStorage.getItem('permissions')) || [];
        const userPermissions = storedPermissions.find(item => item.name === 'user') || {};
      
        setPermissions({
          menu: userPermissions.menu || 0,
          create: userPermissions.create || 0,
          edit: userPermissions.edit || 0,
          delete: userPermissions.delete || 0
        });
      }, [setPermissions]);  

      const handleDeleteClick = async (rowData) => {
        try {
          const deleteResult = await fetchDeleteUser(rowData.id);
          if (deleteResult.data.message) {
            toast.success('User deleted successfully.');
            const userListResult = await fetchUserList();
            if (userListResult.success) {
              setRowData(userListResult.data.data);
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

      const handleVerification = async (rowData) => {
        const id = rowData.id;
        try {
          const data = await sendVerification(id);
          toast.success(data.data.message);
        } catch (error) {
          console.error(error);
        }
      };
      const handleEditClick = (rowData) => {
        navigate('/useraddorupdate', { state: { rowData } });
    };
    const [searchTerm, setSearchTerm] = React.useState({
        name:'',
        email: '',
        phone:''
        });
        const handleSearch = async (event) => {
            const { name, value } = event.target;
            const newSearchTerm = { ...searchTerm, [name]: value };
            setSearchTerm(newSearchTerm);
            const hasSearchTerm = Object.values(newSearchTerm).some(
              (term) => term.trim() !== ""
            );
        
            if (hasSearchTerm) {
              try {
                const response = await fetchUserList(
                  newSearchTerm.companyId,
                  newSearchTerm.name,
                  newSearchTerm.email,
                  newSearchTerm.phone,
                  ID === 0 ? null : ID
                );
                setRowData(response.data.data);
              } catch (error) {
                console.error("Error filtering data:", error);
              }
            } else {
              fetchDefaultUserList();
            }
          };  

  return (
    <>
       <div style={{marginBottom:"20px" , textAlign: "end"}}>
    <Link to='/useraddorupdate'>  <Button variant="contained">+ Add User</Button></Link>
    </div>

    <ToastContainer/>
    <div style={{ marginBottom: "16px" }}>
  <Grid container spacing={2}>
    {/* Search input for Name */}
    <Grid item xs={12} sm={4}>
      <TextField
        label="Search by Name"
        variant="outlined"
        fullWidth
        name="name"
        value={searchTerm.name}
        onChange={handleSearch}
      />
    </Grid>

    {/* Search input for Email */}
    <Grid item xs={12} sm={4}>
      <TextField
        label="Search by Email"
        variant="outlined"
        fullWidth
        name="email"
        value={searchTerm.email}
        onChange={handleSearch}
      />
    </Grid>

    {/* Search input for Phone */}
    <Grid item xs={12} sm={4}>
      <TextField
        label="Search by Phone"
        variant="outlined"
        fullWidth
        name="phone"
        value={searchTerm.phone}
        onChange={handleSearch}
      />
    </Grid>
  </Grid>
</div>

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
                              <EditOutlined
                                style={{ color: '#52c41a', cursor: 'pointer' }}
                                onClick={() => handleEditClick(row)}
                              />
                              <DeleteOutlined
                                style={{ color: '#ff4d4f', cursor: 'pointer' }}
                                onClick={() => handleDeleteClick(row)}
                              />
                              <Button
                                variant="outlined"
                                style={{ padding: '1px 6px', fontSize: '11px' }}
                                onClick={() => handleVerification(row)}
                              >
                                Generate Verification Code
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
