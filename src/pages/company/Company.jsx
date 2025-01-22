import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { fetchData, fetchDelete } from 'api/Data';
import { DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import Button from '@mui/material/Button';
import { Link, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { Grid, TextField } from '@mui/material';

const columns = [
  { 
    id: "name", 
    label: "Company Name", 
    minWidth: 170,
    cellRenderer: (params) => (
      <div style={{ display: "flex", alignItems: "center" }}>
        {/* Company Logo */}
        {params.data.companyLogo && (
          <img
            src={params.data.companyLogo}
            alt="Company Logo"
            style={{ width: "30px", height: "auto", marginRight: "10px" }}
          />
        )}
        {/* Company Name */}
        <span>{params.value}</span>
      </div>
    ),
  },
  { id: "email", label: "Email", minWidth: 100 },
  { id: "companyLocations", label: "Country", minWidth: 170 },
  { id: "action", label: "Actions", minWidth: 170 },
];

export default function Company() {
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
    fetchCompanyName();
  }, []);

  const fetchCompanyName = async () => {
    try {
      const response = await fetchData();
      setRowData(response.data.data);
    } catch (error) {
      console.error("Error fetching default user list:", error);
    }
  };
  const handleView = (row) => {
    const ID = row.id
    navigate('/signleCompany',{ state: { ID } })
  };


  const handleEditClick = (rowData) => {
    navigate('/addcompany', { state: { rowData } });
};

  const handleDelete = async (rowData) => {
    try {
      const formData = {
        companyID: rowData.id,
      };
      const deleteResult = await fetchDelete(formData.companyID);
      if (deleteResult.success) {
        toast.success("Company deleted successfully.");
        const CompanyListResult = await fetchData();
        const companyData = CompanyListResult.data.data;
        setRowData(companyData);
      } else {
        console.error("Error deleting Company:", deleteResult.error);
      }
    } catch (error) {
      console.error("Error handling delete click:", error);
    }
  };
    const [searchTerm, setSearchTerm] = React.useState({
          companyName:'',
          email: '',
          country:''
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
                  const response = await fetchData(
                    newSearchTerm.companyName,
                    newSearchTerm.email,
                    newSearchTerm.country,
                  );
                  setRowData(response.data.data);
                } catch (error) {
                  console.error("Error filtering data:", error);
                }
              } else {
                fetchCompanyName();
              }
            };  
  return (
    <>
    <div style={{marginBottom:"20px" , textAlign: "end"}}>
    <Link to='/addcompany'>  <Button variant="contained">+ Add Company</Button></Link>
    </div>
    <ToastContainer/>
    <div style={{ marginBottom: "16px" }}>
  <Grid container spacing={2}>
    {/* Search input for Name */}
    <Grid item xs={12} sm={4}>
      <TextField
        label="Search by companyName"
        variant="outlined"
        fullWidth
        name="companyName"
        value={searchTerm.companyName}
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

    <Grid item xs={12} sm={4}>
      <TextField
        label="Search by country"
        variant="outlined"
        fullWidth
        name="country"
        value={searchTerm.country}
        onChange={handleSearch}
      />
    </Grid>
  </Grid>
</div>
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
         
<TableBody>
  {rowData.map((row) => (
    <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
      {columns.map((column) => {
        if (column.id === "action") {
          return (
            <TableCell key={column.id} align="left">
              <div style={{ display: "flex", gap: "14px" }}>
                <EyeOutlined
                  style={{ color: "#1890ff", cursor: "pointer" }}
                  onClick={() => handleView(row)}
                />
                <EditOutlined
                  style={{ color: "#52c41a", cursor: "pointer" }}
                  onClick={() => handleEditClick(row)}
                />
                <DeleteOutlined
                  style={{ color: "#ff4d4f", cursor: "pointer" }}
                  onClick={() => handleDelete(row)}
                />
              </div>
            </TableCell>
          );
        }
        // Render Name column with the custom cellRenderer
        if (column.id === "name") {
          return (
            <TableCell key={column.id} align="left">
              {column.cellRenderer({ data: row, value: row[column.id] })}
            </TableCell>
          );
        }
        // Default behavior for other columns
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
  );
}