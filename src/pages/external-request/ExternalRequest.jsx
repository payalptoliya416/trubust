
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
import { fetchApproveORDecline, fetchRequstList } from 'api/Data';
import { BsFillChatDotsFill } from "react-icons/bs";

const columns = [
    {
      id: "created_at",
      label: "Date",
      minWidth: 170,
    },
    {
      id: "company_name",
      label: "Company Name",
      minWidth: 170,
    },
    {
      id: "username",
      label: "User Name",
      minWidth: 170,
    },
    {
      id: "message",
      label: "Message",
      minWidth: 170,
    },
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
    {
      id: "requestID",
      label: "RequestID",
      minWidth: 170,
    },
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
                 border:"transparent"
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
                 border:"transparent"
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
                 border:"transparent"
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
    {
      id: "action",
      label: "Actions",
      minWidth: 220,
      cellRenderer: (params) => {
        const { id, status, ID } = params.data;
        if (status === 0 && ID === 0) {
          return (
                <>
                  <button
                    style={{
                      fontSize: "12px",
                      backgroundColor: "#28c76f",
                      padding: "6px 12px",
                      borderRadius: "8px",
                      color: "white",
                      fontWeight: "500",
                      marginRight: "8px",
                      border:"transparent"
                    }}
                    onClick={() => handleApprove(id, 1)}
                  >
                    Approve
                  </button>
                  <button
                    style={{
                      fontSize: "12px",
                      backgroundColor: "#ea5455",
                      padding: "6px 12px",
                      borderRadius: "8px",
                      color: "white",
                      fontWeight: "500",
                      marginRight: "12px",
                       border:"transparent"
                    }}
                    onClick={() => handleDecline(id, 2)}
                  >
                    Decline
                  </button>
                </>
          );
        } else if (status === 1 || status === 2) {
          return null;
        } else {
          return null;
        }
      },
    },
    {
      id: "replay",
      label: "Replay",
      minWidth: 170,
    },
];
  
export default function ExternalRequest() {

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
            const userPermissions = storedPermissions.find(item => item.name === 'request') || {};
        
            setPermissions({
              menu: userPermissions.menu || 0,
              create: userPermissions.create || 0,
              edit: userPermissions.edit || 0,
              delete: userPermissions.delete || 0
            });
          }, []);

      React.useEffect(() => {
            fetchList();
          }, []);

          const loginCompanyID =  JSON.parse(localStorage.getItem('logindetail')) || [];
         const ID = loginCompanyID.companyID

          const fetchList = async () => {
            try {
              const response = await fetchRequstList(ID === 0 ? null : ID);
              const requestData = response.data.data;
              setRowData(requestData);
            } catch (error) {
              console.error("Error fetching default ticket list:", error);
            }
          };

          const handleChat = (row)=>{
            navigate('/external-request/external-request-chat' ,{ state: { row } })
          }

          const handleApprove = async (id, status) => {
                      const response = await fetchApproveORDecline(id, status);
                      if (response.success === true) {
                          const message = response.data.message;
                        toast.success(message);
                      } else {
                        toast.error("Failed to approve request");
                      }
                    };
                  
                    const handleDecline = async (id, status) => {
                      const response = await fetchApproveORDecline(id, status);
                      if (response.success === true) {
                        const message = response.data.message;
                        toast.success(message);
                      } else {
                        toast.error("Failed to Decline request");
                      }
                    };
  return (
    <>
     {permissions.menu === 1 &&(
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
          if (column.id === "replay") {
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

          if (column.id === "image") {
            return (
              <TableCell key={column.id} align="left">
                {column.cellRenderer({ data: row, value: row[column.id] })}
              </TableCell>
            );
          }

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

          if (column.id === "action") {
            return (
                <TableCell key={column.id} align="left">
                {row.status === 0 && ID === 0 ? (
                    <>
                    <button
                        style={{
                        fontSize: "12px",
                        backgroundColor: "#28c76f",
                        padding: "6px 12px",
                        borderRadius: "8px",
                        color: "white",
                        fontWeight: "500",
                        marginRight: "8px",
                        border: "transparent",
                        }}
                        onClick={() => handleApprove(row.id, 1)}
                    >
                        Approve
                    </button>
                    <button
                        style={{
                        fontSize: "12px",
                        backgroundColor: "#ea5455",
                        padding: "6px 12px",
                        borderRadius: "8px",
                        color: "white",
                        fontWeight: "500",
                        marginRight: "12px",
                        border: "transparent",
                        }}
                        onClick={() => handleDecline(row.id, 2)}
                    >
                        Decline
                    </button>
                    </>
                ) : row.status === 1 || row.status === 2 ? null : null}
                </TableCell>
            );
            }

          // Handle default behavior for other columns
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
    )}
    </>
  )
}
