import React, { useEffect, useRef, useState } from "react";
import { Box, TextField, IconButton, Typography, Avatar, Paper, Stack, CircularProgress } from "@mui/material";
import { styled } from "@mui/system";
import { IoSend } from "react-icons/io5";
import { useLocation } from "react-router";
import { fetchTicketReplay, postComment } from "api/Data";
import { MdImage } from "react-icons/md";
import { AiFillCloseCircle } from "react-icons/ai";
import { io } from "socket.io-client";
import { Link } from "react-router-dom";
import Button from '@mui/material/Button';

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

export default function SupportTicketChat() {
    const location = useLocation();
    const [newMessage, setNewMessage] = useState("");
  const [selectedImage , setSelectedImage] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const ticketID = location.state?.row.receiverID;
  const senderId = location.state?.row.senderID;
  const companyId = location.state?.row.companyID;
  function ScrollToBottom(){
    const elementRef = useRef();
    useEffect(() => elementRef.current.scrollIntoView());
    return <div ref={elementRef} />;
  };
  useEffect(() => {
    const socket = io("https://server.truebust.com", {
      reconnection: true, 
      reconnectionAttempts: 5, 
      reconnectionDelay: 1000, 
    });
    const event = `support_userId_admin_${ticketID}`;
    socket.on(event, (messageData) => {
      setComments((prevList) => [...prevList, messageData]);
    });

    return () => {
      socket.off(event); 
      socket.disconnect(); 
    };
  }, [ticketID]);
  
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

  useEffect(() => {
    const rowData = location.state?.row;
    
    const fetchComments = async () => {
      if (!rowData) return; 

      try {
        const ticketID = rowData.receiverID
          ? rowData.receiverID
          : rowData.senderID;
        const data = await fetchTicketReplay(ticketID);
        setComments(data);
      } catch (error) {
        console.error("Error fetching ticket replay:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [location.state?.row]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (newMessage.trim() !== "" || selectedImage) {
          const currentTicketID = ticketID ? ticketID : senderId;
          const currentCompanyID = companyId;
      
          postComment(currentTicketID, newMessage, currentCompanyID, selectedImage)
            .then((response) => {
              const currentDate = new Date();
              const newComment = {
                message: newMessage,
                created_at: currentDate.toISOString(),
                type: response.data.type,
                image: response.data.image,
              };
              setSelectedImage(null); 
              setNewMessage(""); 
              setComments([...comments, newComment]);
              fetchTicketReplay(currentTicketID); 
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
      
  return (
    <>
         { permissions.menu === 1 &&(
            <>
            <div style={{marginBottom:"20px" , textAlign: "end"}}>
    <Link to='/support-ticket'>  <Button variant="contained"  style={{padding :"4px 23px"}}>Back</Button></Link>
    </div>
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
  <ScrollToBottom dependency={comments} />
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
