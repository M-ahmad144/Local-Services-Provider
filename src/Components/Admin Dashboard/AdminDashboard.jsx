import React from "react";
import DataGrid from "./DataGrid";
import { useQuery } from "@tanstack/react-query";
import Loader from "../loader";
import axios from "axios";
import Visuals from "./Visuals";


const getAllUsers = async () => {
  const response = await axios.get(
    "https://backend-qyb4mybn.b4a.run/api/get-all-users"
  );
  return response.data;
};


const AdminDashboard = () => {
  const { data: users, error: usersError, isLoading: usersLoading, refetch: refetchusers, } = useQuery({
    queryKey: ["users"],
    queryFn: () => getAllUsers(),
    staleTime: 0,
    cacheTime: 0,
  });

  if (usersLoading) {
    return <Loader />;
  }

  if (usersError) {
    return <div>Error: {usersError?.message}</div>;
  }



  return (
    <>
      <Visuals user={users}/>
      <DataGrid  user={users}/>
    </>
  );
};

export default AdminDashboard;
