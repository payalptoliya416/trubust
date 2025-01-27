import { fetchRequstList } from 'api/Data';
import React, { useEffect, useState } from 'react'
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';

const columns = [
    { id: "created_at", label: "UserName", minWidth: 170 },
    { id: "company_name", label: "Company Name", minWidth: 170 },
    { id: "username", label: "User Name", minWidth: 170 },
    { id: "message", label: "Message", minWidth: 170 },
    {
        id: "image",
        label: "Image",
        minWidth: 170,
        cellRenderer: (params) =>
            params.value ? (
                <img
                    src={params.value}
                    alt=""
                    style={{
                        width: "45px",
                        height: "auto",
                        objectFit: "cover",
                        marginTop: "4px",
                    }}
                />
            ) : null,
    },
    { id: "requestID", label: "RequestID", minWidth: 170 },
    {
        id: "status",
        label: "Status",
        minWidth: 120,
        cellRenderer: (params) => {
            const { status } = params.data;
            if (status === 0) {
                return (
                    <button
                        style={{
                            fontSize: "12px",
                            backgroundColor: "#d9f8fc",
                            padding: "3px 10px",
                            borderRadius: "8px",
                            color: "#00cfe8",
                            fontWeight: "500",
                            marginRight: "8px",
                            border: "transparent"
                        }}
                    >
                        Pending
                    </button>
                );
            } else if (status === 1) {
                return (
                    <button
                        style={{
                            fontSize: "12px",
                            backgroundColor: "#dff7e9",
                            padding: "3px 10px",
                            borderRadius: "8px",
                            color: "#28c76f",
                            fontWeight: "500",
                            border: "transparent"
                        }}
                    >
                        Approve
                    </button>
                );
            } else if (status === 2) {
                return (
                    <button
                        style={{
                            fontSize: "12px",
                            backgroundColor: "#fce5e6",
                            padding: "3px 10px",
                            borderRadius: "8px",
                            color: "#ea5455",
                            fontWeight: "500",
                            marginRight: "8px",
                            border: "transparent"
                        }}
                    >
                        Decline
                    </button>
                );
            } else {
                return null;
            }
        },
    },
];

export default function ExtrnalRequest({ singleCompnay }) {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };
    const [requestData, setRequestData] = useState([]);

    useEffect(() => {
        if (singleCompnay && singleCompnay.id) { 
            fetchList();
        }
    }, [singleCompnay]); 
    
    const fetchList = async () => {
        try {
            const response = await fetchRequstList();
            const tabExternal = response.data.data;
            
            if (singleCompnay && singleCompnay.id) {
                console.log("singleCompnay.id",singleCompnay.id)
                console.log("sas", tabExternal.filter(item => item.companyID === singleCompnay.id))
                const filteredData = tabExternal.filter(item => item.companyID === singleCompnay.id);
                console.log("filteredData",filteredData)
                setRequestData(filteredData);
            }
        } catch (error) {
            console.error('Error fetching default Analytic Requestlist:', error);
        }
    };
    
    return (
        <>
        <h3>External Request</h3>
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
                            {requestData
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((row) => (
                                    <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                                        {columns.map((column) => {
                                            if (column.id === "status") {
                                                return (
                                                    <TableCell key={column.id} align="left">
                                                        {column.cellRenderer({ data: row, value: row[column.id] })}
                                                    </TableCell>
                                                );
                                            }
                                            if (column.id === "created_at") {
                                                const date = new Date(row[column.id]);
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
                                            if (column.id === "image") {
                                                        return (
                                                          <TableCell key={column.id} align="left">
                                                            {column.cellRenderer({ data: row, value: row[column.id] })}
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
                    count={requestData.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>
        </>
    )
}
