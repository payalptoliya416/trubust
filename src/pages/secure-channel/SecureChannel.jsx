import React, { useState, useEffect } from "react";
import { Box, TextField, IconButton, Typography, Avatar, Paper, Stack, Container ,InputAdornment, Card,  useTheme, ThemeProvider,CssBaseline,useMediaQuery,Drawer,Toolbar} from "@mui/material";
import { styled } from "@mui/system";
import { IoSearch, IoSend, IoMenu,  } from "react-icons/io5";
import { fetchChatList, fetchGroupChat, postGroupchat } from "api/Data";
import { io } from 'socket.io-client';
import { MdImage } from "react-icons/md";
import { AiFillCloseCircle } from "react-icons/ai";

const StyledChatContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  height: "76vh",
  gap: 2,
  padding: theme.spacing(2),
  backgroundColor:  "#f5f5f5",
  [theme.breakpoints.down("md")]: {
    padding: theme.spacing(1),
    height: "calc(76vh - 70px)",
  },
}));

const SidePanel = styled(Paper)(({ theme }) => ({
  width: "300px",
  padding: theme.spacing(2),
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(2),
  backgroundColor: "#ffffff",
  [theme.breakpoints.down("md")]: {
    width: "100%",
  },
}));

const ChatArea = styled(Paper)(({ theme }) => ({
  flex: 1,
  padding: theme.spacing(2),
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(2),
  backgroundColor: "#ffffff",
}));

const MessageContainer = styled(Box)(({ sent }) => ({
  display: "flex",
  justifyContent: sent === 'User' ? "flex-start" :   "flex-end",
  marginBottom: "8px",
}));

const MessageBubble = styled(Card)(({ sent }) => ({
  maxWidth: "70%",
  padding: "12px 16px",
  backgroundColor: sent === 'User' ? "#fff" : "#1976d2",
  color: sent === 'User' ? "inherit" :   "#fff" ,
  borderRadius: "16px",
  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  transition: "transform 0.2s", "&:hover": { transform: "scale(1.02)" },
}));

const InputArea = styled(Box)({
  padding: "20px",
  backgroundColor: "#ffffff",
  borderTop: "1px solid #e0e0e0"
}); 

const SecureChannel = () => {
  const [newMessage, setNewMessage] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [loading, setLoading] = useState(false); 
  const [rowData,setRowData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [companyIDD ,setCompanyIDD] = useState('');
  const [comId,setComId] = useState('');
  const [comName,setComName] = useState('');
  const [list ,setList] = useState([]);
     const [selectedImage , setSelectedImage] = useState(null);

  const loginCompanyID =  JSON.parse(localStorage.getItem('logindetail')) || [];
  const ID = loginCompanyID.companyID

  useEffect(() => {
    const socket = io('https://server.truebust.com'); 
    const event =`new_reply_group_chat_${companyIDD}`
    socket.on(event, (messageData) => {
      setList(prevList => [...prevList, messageData]); 
    });

    return () => {
      socket.disconnect();
    };
  }, [companyIDD]);

  useEffect(() => {
    if (ID !== 0 && rowData.length > 0) {
      const Data = rowData[0];
      handleDataOperations(Data); 
    }
  }, [ID, rowData]);


  const handleDrawerToggle = async (contact) => {
    console.log("contact",contact)
    setMobileOpen(!mobileOpen);
    setCompanyIDD(contact.companyID);
    await handleDataOperations(contact);
  };
 
  const handleDataOperations = async (contact) => {
    setComId(contact.companyID);
    setComName(contact);
    setLoading(true);
    if (window.matchMedia("(max-width: 640px)").matches) {
      setResponsiveChat(true);
    }
    try {
      const uscomID = contact.companyID;
      const data = await fetchChatList(uscomID);
      console.log("data",data)
      setList(data);

      
    } catch (error) {
      console.error('Error fetching ticket replay:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const socket = io('https://server.truebust.com'); 
    const event =`new_reply_group_chat_${companyIDD}`
    socket.on(event, (messageData) => {
      setList(prevList => [...prevList, messageData]); 
    });

    return () => {
      socket.disconnect();
    };
  }, [companyIDD]);

  useEffect(() => {
    fetchList();
  }, []);

  const fetchList = async () => {
  setLoading(true)
  try {
    if( ID === 0){
      const response = await fetchGroupChat();
      setRowData(response.data);
    }else{
      const response = await fetchGroupChat(ID);
      setRowData(response.data);
    }
  setLoading(false)
  } catch (error) {
    console.error('Error fetching default ticket list:', error);
  }
  };

  useEffect(() => {
    setFilteredData(rowData); 
  }, [rowData]); 

  const handleSearch = (event) => {
    const searchTerm = event.target.value;
    setSearchTerm(searchTerm);
  console.log("rowData",rowData)

    const filteredData = rowData.filter(item =>
      item.company_name && item.company_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setFilteredData(filteredData);
  };

  const contactsList = (
    <>
      <TextField
        fullWidth
        placeholder="Search contacts"
        value={searchTerm}
        onChange={handleSearch}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <IoSearch />
            </InputAdornment>
          ),
        }}
      />
      <Stack spacing={1}>
        {filteredData.map((contact) => (
          <Box
            key={contact.id}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              cursor: "pointer",
              p: 1,
              borderRadius: 1,
              "&:hover": { backgroundColor: theme.palette.action.hover },
            }}
            onClick={() =>handleDrawerToggle(contact)}
          >
            <Avatar
              src={`${contact.company_logo}`}
              alt={contact.name}
              sx={{ width: 36, height: 36 }}
            />
            <Box>
              <Typography variant="subtitle2" fontWeight="semibold">
                {contact.company_name}
              </Typography>
            </Box>
          </Box>
        ))}
      </Stack>
    </>
  );
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
 const handleSendMessage = (e) => {
             e.preventDefault();
              if (newMessage.trim() !== "" || selectedImage) {
              const companyID = comId;
              postGroupchat(companyID, newMessage,selectedImage)
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
               setList([...list, newComment]); 
               fetchChatList(companyID);
              })
              .catch((error) => {
               console.error("Error posting comment:", error);
        });
     }
    };

  return (
    <>
      <CssBaseline />
      <Container maxWidth="xl" sx={{ height: "76vh", p: { xs: 0, md: 2 } }}>
            {isMobile && (
          <Toolbar>
              <IconButton
                color="inherit"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ mr: 2 }}
              >
                <IoMenu />
              </IconButton>
          </Toolbar>
            )}

        <StyledChatContainer>
          {isMobile ? (
            <Drawer
              variant="temporary"
              anchor="left"
              open={mobileOpen}
              onClose={handleDrawerToggle}
              ModalProps={{ keepMounted: true }}
              sx={{ "& .MuiDrawer-paper": { width: "80%" } }}
            >
              <Box sx={{ p: 2 }}>{contactsList}</Box>
            </Drawer>
          ) : (
            <SidePanel elevation={2}>{contactsList}</SidePanel>
          )}

          <ChatArea elevation={2}>
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Avatar
                  src={comName.company_logo}
                  alt='logo'
                />
                <Typography variant="h6">{comName.company_name}</Typography>
              </Box>
            </Box>

            <Box
              sx={{
                flex: 1,
                overflowY: "auto",
                display: "flex",
                flexDirection: "column",
                gap: 1,
                mb: 2,
                p: 1,
              }}
            >
              {list.map((message) => {
                const createdDate = new Date(message.created_at);
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
                return(
                <MessageContainer key={message.id} sent={message.type}>
                <Box  sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: message.type === "User" ? "flex-start" : "flex-end",
        }}>
                 <Stack
                          direction={message.type === "User" ? "row-reverse" : "row"}
                          spacing={1}
                          alignItems="center"
                          sx={{ mb: 1 }}
                        >
                          {message.avatar ? (
                            <Avatar
                              src={`https://${message.avatar}`}
                              alt={message.sender}
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
                              {message.type === "User" ? "U" : "A"}
                            </Typography>
                          )}
                        </Stack>
                  <MessageBubble sent={message.type}>
                        {message.image && (
          <img
            src={message.image}
            alt=""
            style={{ width: "70px", marginBlock: "14px" }}
          />
        )}
                    <Typography variant="body1">{message.message}</Typography>
                    <Typography
                      variant="caption"
                      sx={{ display: "block", mt: 0.5, opacity: 0.7 }}
                    >
                      {formattedDate}
                    </Typography>
                  </MessageBubble>
                </Box>
                </MessageContainer>
              )})}
            </Box>

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
          </ChatArea>
        </StyledChatContainer>
      </Container>
      </>
  );
};

export default SecureChannel;