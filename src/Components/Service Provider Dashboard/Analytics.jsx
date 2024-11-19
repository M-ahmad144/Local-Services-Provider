import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import React from 'react';
import { useSelector } from 'react-redux';
import Loader from '../loader';
import { Doughnut } from 'react-chartjs-2';
import { Bar, Line } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, PointElement, LineElement } from 'chart.js';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, PointElement, LineElement);

const getAllOrders = async (user_id) => {
    const response = await axios.get(`https://backend-qyb4mybn.b4a.run/analytics/orders?user_id=${user_id}`);
    return response.data;
};

const getAmount = async (user_id) => {
    const response = await axios.get(`https://backend-qyb4mybn.b4a.run/analytics/transactions?user_id=${user_id}`);
    return response.data;
};

const getServicesCount = async (user_id) => {
    const response = await axios.get(`https://backend-qyb4mybn.b4a.run/analytics/orders-count?user_id=${user_id}`);
    return response.data;
};

const Analytics = () => {
    const { currentUser } = useSelector((state) => state.user);
    const user_id = currentUser._id;

    const { data: Orders, error: OrdersError, isLoading: OrdersLoading } = useQuery({
        queryKey: ['orders', user_id],
        queryFn: () => getAllOrders(user_id),
        staleTime: 0,
        cacheTime: 0,
    });

    const { data: amount, error: amountError, isLoading: amountLoading } = useQuery({
        queryKey: ['amount', user_id],
        queryFn: () => getAmount(user_id),
        staleTime: 0,
        cacheTime: 0,
    });

    const { data: orderCount, error: orderCountError, isLoading: orderCountLoading } = useQuery({
        queryKey: ['order-count', user_id],
        queryFn: () => getServicesCount(user_id),
        staleTime: 0,
        cacheTime: 0,
    });

    if (OrdersLoading || amountLoading || orderCountLoading) {
        return <Loader />;
    }

    if (OrdersError || amountError || orderCountError) {
        return <div>Error: {OrdersError?.message || amountError?.message || orderCountError?.message}</div>;
    }

    const statuses = ["pending", "in progress", "pending confirmation", "completed", "cancelled", "in dispute"];
    const filteredOrders = statuses.reduce((acc, status) => {
        acc[status] = Orders.filter(order => order.order_status?.toLowerCase().trim() === status).length;
        return acc;
    }, {});

    const sortedOrders = Orders.sort((a, b) => new Date(a.order_date) - new Date(b.order_date));

    const monthlyOrder = sortedOrders.reduce((acc, order) => {
        const monthYear = new Date(order.order_date).toLocaleDateString('en-GB', {
            year: 'numeric',
            month: '2-digit',
        });
        if (!acc[monthYear]) {
            acc[monthYear] = 0;
        }

        acc[monthYear]++;

        return acc;
    }, {});


    const doughnutData = {
        labels: statuses,
        datasets: [
            {
                data: Object.values(filteredOrders),
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'],
                hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'],
            },
        ],
    };

    const doughnutOptions = {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    usePointStyle: true,
                },
            },
        },
        cutout: '60%',
        aspectRatio: 1,
    };


    const labels = orderCount.map(item => item.service_title);
    const data = orderCount.map(item => item.order_count);

    const barData = {
        labels: labels,
        datasets: [
            {
                label: 'Order Count',
                data: data,
                backgroundColor: [
                    '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40',
                    '#FF5C8D', '#8A2BE2', '#FF7F50', '#2E8B57', '#FFD700', '#9370DB'
                ],
            },
        ],
    };

    const barOptions = {
        indexAxis: 'y', // Horizontal bars
        scales: {
          x: { beginAtZero: true },
        },
      };

    // Line Chart Data (Example: Orders Per Month)
    const lineLabels = Object.keys(monthlyOrder); // Month-Year labels
    const lineDataset = Object.values(monthlyOrder); // Monthly order counts

    const lineData = {
        labels: lineLabels,
        datasets: [
            {
                label: 'Monthly Orders',
                data: lineDataset,
                borderColor: '#FF6384',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                tension: 0.3,
            },
        ],
    };


    const totalAmount = amount.reduce((total, item) => total + (item.amount || 0), 0)

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Service Provider Dashboard</h1>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
                <div className="bg-white p-4 shadow rounded-lg">
                    <h3 className="text-lg font-semibold">Total Orders</h3>
                    <p className="text-xl font-bold">{Orders.length}</p>
                </div>
                <div className="bg-white p-4 shadow rounded-lg">
                    <h3 className="text-lg font-semibold">Total Revenue</h3>
                    <p className="text-xl font-bold text-green-500">
                        ${new Intl.NumberFormat().format(totalAmount)}
                    </p>
                </div>
                <div className="bg-white p-4 shadow rounded-lg">
                    <h3 className="text-lg font-semibold">Completed</h3>
                    <p className="text-xl font-bold">{filteredOrders.completed}</p>
                </div>
                <div className="bg-white p-4 shadow rounded-lg">
                    <h3 className="text-lg font-semibold">In Progress</h3>
                    <p className="text-xl font-bold">{filteredOrders["in progress"]}</p>
                </div>
                <div className="bg-white p-4 shadow rounded-lg">
                    <h3 className="text-lg font-semibold">Cancelled</h3>
                    <p className="text-xl font-bold">{filteredOrders.cancelled}</p>
                </div>
            </div>


            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Doughnut Chart */}
                <div className="bg-white p-4 shadow rounded-lg">
                    <h2 className="text-lg font-bold mb-4">Order Status Overview</h2>
                    <div className="chart-container flex justify-center items-center" style={{ height: '350px' }}>
                        <Doughnut data={doughnutData} options={doughnutOptions} />
                    </div>
                </div>

                {/* Bar Chart - Monthly Orders */}
                <div className="bg-white p-4 shadow rounded-lg">
                    <h2 className="text-lg font-bold mb-4">Numbre of Orders by services</h2>
                    <Bar data={barData}  options={barOptions}/>
                </div>
            </div>

            {/* Line Chart */}
            <div className="bg-white p-4 shadow rounded-lg mt-6">
                <h2 className="text-lg font-bold mb-4">Monthly Orders Trend</h2>
                <Line data={lineData} />
            </div>
        </div>
    );
};

export default Analytics;
