import React, { useState } from "react";
import DataGrid from "./DataGrid";
import { useQuery } from "@tanstack/react-query";
import Loader from "../loader";
import axios from "axios";
import Visuals from "./Visuals";
import Home from "./Home";


const getAllUsers = async () => {

  
  const response = await axios.get(
    "https://backend-qyb4mybn.b4a.run/api/get-all-users" ,  {
      withCredentials: true, // Include credentials (cookies, HTTP auth, etc.)
  }
  );
  return response.data;
};


const AdminDashboard = () => {
  const [loading,setLoading] = useState(false)
  const { data: users, error: usersError, isLoading: usersLoading, refetch: refetchusers, } = useQuery({
    queryKey: ["users"],
    queryFn: () => getAllUsers(),
    staleTime: 0,
    cacheTime: 0,
  });

  if (usersLoading || loading) {
    return <Loader />;
  }

  if (usersError) {
    return <div>Error: {usersError?.message}</div>;
  }

  const UpdateReload = async () => {
    setLoading(true);
    console.log('Triggering refetch and re-render...');

    const { data: updatedUsers } = await refetchusers();    

    setLoading(false);
};

  

  return (
    <>
      {/* <Visuals user={users}/> */}
      <Home  user={users} update={UpdateReload}/>
    </>
  );
};

export default AdminDashboard;
