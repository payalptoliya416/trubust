import { fetchCompanyView, fetchSignleComUser } from 'api/Data';
import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
export default function SingleCompanyView() {
const location = useLocation();
        const cID =  location.state?.ID;
        const [userData, setUserData] = useState([]);
  const [singleCompnay, setSingleCompany] = useState([]);
    useEffect(()=>{
        SingleCompanyData();
        fetchAllUserList();
    });

    const SingleCompanyData = async () => {

        try {
          const res = await fetchCompanyView(cID);
          setSingleCompany(res.data.data);
        } catch (error) {
          console.error("Error fetching single company data:", error);
        }
      };
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
         <div style={{marginBottom:"20px" , textAlign: "end"}}>
    <Link to='/company'>  <Button variant="contained">Back</Button></Link>
    </div>
    </>
  )
}
