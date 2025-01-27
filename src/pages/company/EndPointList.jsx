import React, { useEffect, useState } from 'react'
import {  fetchSignleComUser } from 'api/Data';
import { useLocation } from 'react-router';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { Box, Typography } from '@mui/material';

const columns = [
    {
        id: "name", label: "UserName", minWidth: 170
    },
    { id: "totalRequest", label: "Total Request", minWidth: 170 },
    {
        id: "percentageExternalRequest", label: "External Request", minWidth: 170,
        cellRenderer: function (params) {
            let progress = parseInt(params.value, 10);
            if (isNaN(progress)) {
                progress = 0;
            }

            let bgColor = "red";
            if (progress > 80) {
                bgColor = "#6F00FF";
            } else if (progress > 50) {
                bgColor = "#FFA500";
            } else if (progress > 30) {
                bgColor = "green";
            }

            return (
                <Box>
                    <Typography variant="body2" color="textSecondary" sx={{ mb: 0.5 }}>
                        {progress}%
                    </Typography>
                    <Box sx={{ width: "100%", height: 4, backgroundColor: "#f5f5f5", borderRadius: 4 }}>
                        <Box
                            sx={{
                                height: "100%",
                                width: `${progress}%`,
                                backgroundColor: bgColor,
                                borderRadius: 4,
                                transition: "width 0.3s ease-in-out",
                            }}
                        />
                    </Box>
                </Box>
            );
        },
    },
    { id: "fraudReports", label: "Fraud Reports", minWidth: 170 },

];

export default function EndPointList() {
    const location = useLocation();
    const cID = location.state?.ID;
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const [userData, setUserData] = useState([]);

      useEffect(() => {
        fetchAllUserList();
      }, []);

      const fetchAllUserList = async () => {
        try {
          const resdata = await fetchSignleComUser(cID);
          const dataofRes = resdata.data;
          setUserData(dataofRes);
        } catch (error) {
          console.error("Error fetching single company data:", error);
        }
      };
    return (
        <>
        <h3>End-Points List</h3>
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
              {userData
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                    {columns.map((column) => {
                      if (column.id === "percentageExternalRequest" && column.cellRenderer) {
                        return column.cellRenderer({ value: row[column.id] });
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
          count={userData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
        </>
    )
}
