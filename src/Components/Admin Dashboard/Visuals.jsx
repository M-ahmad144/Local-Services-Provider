import React, { useState, useEffect } from "react";
import { Pie, Doughnut } from "react-chartjs-2";

const Visuals = ({ user }) => {
  const [users, setUsers] = useState(user.users || []);
  const [stats, setStats] = useState({
    totalUsers: 0,
    verifiedUsers: 0,
    unverifiedUsers: 0,
    buyers: 0,
    providers: 0,
  });

  useEffect(() => {
    const totalUsers = users.length;
    const verifiedUsers = users.filter((u) => u.verify).length;
    const unverifiedUsers = totalUsers - verifiedUsers;
    const buyers = users.filter((u) => u.user_type === "buyer").length;
    const providers = users.filter((u) => u.user_type === "service provider").length;

    setStats({ totalUsers, verifiedUsers, unverifiedUsers, buyers, providers });
  }, [users]);

  // Data for Pie Chart
  const pieData = {
    labels: ["Buyers", "Service Providers"],
    datasets: [
      {
        data: [stats.buyers, stats.providers],
        backgroundColor: ["#4CAF50", "#FFC107"],
        hoverBackgroundColor: ["#45a049", "#ffb300"],
      },
    ],
  };

  // Data for Doughnut Chart
  const doughnutData = {
    labels: ["Verified Users", "Unverified Users"],
    datasets: [
      {
        data: [stats.verifiedUsers, stats.unverifiedUsers],
        backgroundColor: ["#2196F3", "#FF5722"],
        hoverBackgroundColor: ["#1976D2", "#E64A19"],
      },
    ],
  };

  return (
    <div className="p-4 space-y-8">
      {/* Left-aligned Stats Cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white shadow-lg rounded-lg flex flex-col justify-center items-center p-6">
          <h2 className="text-xl font-semibold mb-2">Total Users</h2>
          <p className="text-3xl font-bold">{stats.totalUsers}</p>
        </div>
        <div className="bg-white shadow-lg rounded-lg flex flex-col justify-center items-center p-6">
          <h2 className="text-xl font-semibold mb-2">Verified Users</h2>
          <p className="text-3xl font-bold">{stats.verifiedUsers}</p>
        </div>
        <div className="bg-white shadow-lg rounded-lg flex flex-col justify-center items-center p-6">
          <h2 className="text-xl font-semibold mb-2">Service Providers</h2>
          <p className="text-3xl font-bold">{stats.providers}</p>
        </div>
      </div>

      {/* Centered Visuals Section */}
      <div className="flex justify-between space-x-6">
  {/* Pie Chart */}
  <div className="bg-white shadow-lg rounded-lg p-6 w-1/2">
    <h2 className="text-xl font-semibold mb-4 text-center">User Segregation</h2>
    <div className="flex justify-center">
    <div className="chart-container flex justify-center items-center" style={{ height: '350px' }}>
        <Pie data={pieData} options={{ maintainAspectRatio: true }} />
      </div>
    </div>
  </div>

  {/* Doughnut Chart */}
  <div className="bg-white shadow-lg rounded-lg p-6 w-1/2">
    <h2 className="text-xl font-semibold mb-4 text-center">Verification Status</h2>
    <div className="flex justify-center">
      <div className="chart-container flex justify-center items-center" style={{ height: '350px' }}>
        <Doughnut data={doughnutData} options={{ maintainAspectRatio: true }} />
      </div>
    </div>
  </div>
</div>

    </div>
  );
};

export default Visuals;
