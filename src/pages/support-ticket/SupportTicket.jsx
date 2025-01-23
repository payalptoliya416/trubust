
import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { useNavigate } from 'react-router';
import { fetchTicketList } from 'api/Data';
import { BsFillChatDotsFill } from "react-icons/bs";

const columns = [
    { 
      id: "created_at", label: "Date",  minWidth: 170},
    { id: "companyName", label: "Company Name", minWidth: 100 },
    { id: "userName", label: "User Name", minWidth: 170 },
    { id: "action", label: "Actions", minWidth: 170 },
  ];

export default function SupportTicket() {
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
        fetchList();
      }, []);
    
      const fetchList = async () => {
        try {
          const response = await fetchTicketList();
          
          setRowData(response);
        } catch (error) {
          console.error("Error fetching default ticket list:", error);
        }
      };

      const handleChat = (row)=>{
        navigate('/support-ticket-chat' ,{ state: { row } })
      }
      
  return (
    <>
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
                top: 0,  // Ensures the header stays at the top
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
        if (column.id === "action") {
          return (
            <TableCell key={column.id} align="left">
              <div style={{ display: "flex", gap: "14px" }}>
               <BsFillChatDotsFill 
              style={{ color: "#808080", cursor: "pointer", fontSize: '20px' }}
                onClick={() => handleChat(row)}
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

          if (column.id === "created_at") {
                    const date = new Date(row[column.id]); // Use the row's created_at value
                    const formattedDate = date.toLocaleDateString('en-US', {
                      month: '2-digit',
                      day: '2-digit',
                      year: 'numeric',
                    });
        
                    return (
                      <TableCell key={column.id} align="left">
                        <div>
                          {formattedDate}
                        </div>
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
  )
}
