import { fetchApproveORDecline, fetchRequestReplay, postExternalChat } from 'api/Data';
import React, { useEffect, useRef, useState } from 'react';
import { Box, TextField, IconButton, Typography, Avatar, Paper, Stack, CircularProgress } from "@mui/material";
import { useLocation } from 'react-router';
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import { styled } from "@mui/system";
import { MdImage } from "react-icons/md";
import { IoSend } from "react-icons/io5";
import { toast, ToastContainer } from 'react-toastify';
import io from 'socket.io-client';

const ChatContainer = styled(Box)(() => ({
    height: "70vh",
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#f5f5f5",
    borderRadius: "12px",
    overflow: "hidden"
  }));
  
  const MessagesArea = styled(Box)({
    flex: 1,
    overflowY: "auto",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "16px"
  });
  
  const MessageBubble = styled(Paper)(({ isOwn }) => ({
    padding: "10px 16px",
    maxWidth: "70%",
    width: "fit-content",
    borderRadius: "12px",
    backgroundColor: isOwn === 'User' ? "#ffffff":   "#1976d2",
    color: isOwn === 'User' ?  "#000000" :  "#ffffff",
    alignSelf: isOwn === 'User' ? "flex-start" : "flex-end",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
  }));
  
  const InputArea = styled(Box)({
    padding: "20px",
    backgroundColor: "#ffffff",
    borderTop: "1px solid #e0e0e0"
  }); 

export default function ExternalRequestChat() {
      const location = useLocation();
  const [comments, setComments] = useState([]);
   const [loading, setLoading] = useState(true);
    const [newMessage, setNewMessage] = useState("");
    const [selectedImage , setSelectedImage] = useState(null);
    const userID = location.state?.row.userID;
    const companyID = location.state?.row.companyID;
    const currentID = location.state?.row.id;
    const requestID = location.state?.row.requestID;
    const currentStatus = location.state?.row.status;

    const socketRef = useRef();
  useEffect(() => {
    if (socketRef.current) {
      socketRef.current.disconnect(); // Disconnect any existing connection
    }

    const socket = io("https://server.truebust.com", {
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    const event = `external-request-replay-admin-1-${currentID}`;
    socket.on(event, (messageData) => {
      setComments((prevList) => [...prevList, messageData]);
    });

    return () => {
      socket.off(event); 
      socket.disconnect(); 
    };
  }, [currentID]);
     useEffect(() => {
          const rowData = location.state?.row;
          
          const fetchComments = async () => {
            if (!rowData) return; 
      
            try {
              const data = await fetchRequestReplay( rowData.companyID, rowData.userID,rowData.id);
              setComments(data);
            } catch (error) {
              console.error("Error fetching ticket replay:", error);
            } finally {
              setLoading(false);
            }
          };
      
          fetchComments();
        }, [location.state?.row]);

          const [permissions, setPermissions] = useState({
            menu: 0,
            create: 0,
            edit: 0,
            delete: 0
          });
        
          useEffect(() => {
            const storedPermissions = JSON.parse(localStorage.getItem('permissions')) || [];
            const userPermissions = storedPermissions.find(item => item.name === 'ticket') || {};
          
            setPermissions({
              menu: userPermissions.menu || 0,
              create: userPermissions.create || 0,
              edit: userPermissions.edit || 0,
              delete: userPermissions.delete || 0
            });
          }, []);

            const handleSendMessage = (e) => {
                  e.preventDefault();
                  if (newMessage.trim() !== "" || selectedImage) {
                    const currentUserID = userID;
                    const currentCompanyID = companyID;
                    postExternalChat(currentUserID, newMessage, currentCompanyID, selectedImage ,currentID)
                      .then((response) => {
                        const currentDate = new Date();
                        const newComment = {
                          message: newMessage,
                          created_at: currentDate.toISOString(),
                          type: response.data.type,
                          image: response.data.image,
                        };
                        if(currentID === response.data.id){
                            setSelectedImage(null); 
                            setNewMessage(""); 
                            setComments([...comments, newComment]); 
                            fetchRequestReplay(companyID,userID,requestID);
                          }
                      })
                      .catch((error) => {
                        console.error("Error posting comment:", error);
                      });
                  }
                };

          const handleImageChange = (e) => {
            const file = e.target.files[0];
            if (file) {
              const reader = new FileReader();
              reader.onload = () => {
                setSelectedImage(reader.result);
              };
              reader.readAsDataURL(file);
            }
          };
          
          const handleCancelImage = () => {
            setSelectedImage(null); 
          };

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
         { permissions.menu === 1 &&(
            <>  
            <ToastContainer/> 
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      position="sticky"
      top="14%"
      width="100%"
      bgcolor="grey.100"
      p={1}
      borderRadius="4px 4px 0 0"
      boxShadow={1}
      marginBottom='55px'
    >
   <div>
    <Link to='/external-request'>  <Button variant="contained">Back</Button></Link>
    </div>

      <Box>
        {currentStatus === 0 && (
          <>
            <Button
              variant="contained"
              color="success"
              size="small"
              sx={{ mr: 1, fontWeight: "bold" }}
              onClick={() => handleApprove(currentID, 1)}
            >
              Approve
            </Button>
            <Button
              variant="contained"
              color="error"
              size="small"
              sx={{ fontWeight: "bold" }}
              onClick={() => handleDecline(currentID, 2)}
            >
              Decline
            </Button>
          </>
        )}
      </Box>
    </Box>
      <ChatContainer>
      {  loading  ?  <div style={{display: "flex" , justifyContent:"center", alignItems: "center" , height:"100%" , width:"100%"}}><CircularProgress /></div> : ""}
      <MessagesArea>
  {comments.map((msg) => {
    const createdDate = new Date(msg.created_at);
    const formattedDate = !isNaN(createdDate.getTime())
      ? createdDate.toLocaleString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })
      : new Date().toLocaleString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        });

    return (
      <Box
        key={msg.id}
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: msg.type === "User" ? "flex-start" : "flex-end",
        }}
      >
        <Stack
          direction={msg.type === "User" ? "row-reverse" : "row"}
          spacing={1}
          alignItems="center"
          sx={{ mb: 1 }}
        >
          {msg.avatar ? (
            <Avatar
              src={`https://${msg.avatar}`}
              alt={msg.sender}
              sx={{ width: 32, height: 32 }}
            />
          ) : (
            <Typography
              variant="subtitle2"
              sx={{
                width: 28,
                height: 28,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#ccc",
                borderRadius: "50%",
                color: "#fff",
                fontWeight: "bold",
              }}
            >
              {msg.type === "User" ? "U" : "A"}
            </Typography>
          )}
        </Stack>
        <MessageBubble isOwn={msg.type}>
        {msg.image && (
          <img
            src={msg.image}
            alt=""
            style={{ width: "70px", marginBlock: "14px" }}
          />
        )}
          <Typography variant="body1">{msg.message}</Typography>
          <Typography
            variant="caption"
            color={
              msg.type === "User" ? "text.secondary" : "rgba(255,255,255,0.7)"
            }
          >
            {formattedDate}
          </Typography>
        </MessageBubble>
      </Box>
    );
  })}
</MessagesArea>

<InputArea>
  <Box
    sx={{
      display: "flex",
      alignItems: "center",
      position: "relative",
      gap: 1,
      border: "1px solid #ccc",
      borderRadius: "4px",
      padding: "4px",
    }}
  >
    {/* Input Field */}
    <TextField
      fullWidth
      variant="outlined"
      placeholder={selectedImage ? "" : "Type a message..."}
      value={newMessage}
      onChange={(e) => setNewMessage(e.target.value)}
      size="small"
      disabled={!!selectedImage}
      sx={{
        "& .MuiOutlinedInput-root": {
          paddingRight: selectedImage ? "60px" : "8px", // Adjust input padding if image is selected
        },
      }}
    />

    {/* Display Selected Image */}
    {selectedImage && (
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "8px",
          transform: "translateY(-50%)",
          display: "flex",
          alignItems: "center",
        }}
      >
        <img
          src={selectedImage}
          alt="Selected"
          style={{
            width: "40px",
            height: "40px",
            objectFit: "cover",
            borderRadius: "4px",
            border: "1px solid #ccc",
          }}
        />
          <AiFillCloseCircle  onClick={handleCancelImage}  style={{
            position: "absolute",
            top: "-6px",
            right: "-10px",
            backgroundColor: "transparent",
            color: "red",
            fontSize: "16px",
            padding: "2px",
            cursor:"pointer"
          }}/>
      </Box>
    )}

    <label htmlFor="image-upload">
      <input
        id="image-upload"
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={handleImageChange}
      />
      <IconButton color="primary" component="span">
        <MdImage />
      </IconButton>
    </label>

    <IconButton
      color="primary"
      onClick={handleSendMessage}
      disabled={!newMessage.trim() && !selectedImage}
    >
      <IoSend />
    </IconButton>
  </Box>
</InputArea>
      </ChatContainer>
      </>
      )}
    </>
  )
}
