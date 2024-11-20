import React, { useEffect, useState } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import 'react-toastify/dist/ReactToastify.css';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/user/all'); // Adjust the URL as needed
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error.response || error.message);
        setError(error.response?.data?.message || error.message || 'Unknown error');
        toast.error(`Error fetching users: ${error.response?.data?.message || error.message || 'Unknown error'}`);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const calculateChartData = () => {
    const activeCount = users.filter(user => user.status === 'Active').length;
    const inactiveCount = users.filter(user => user.status === 'Inactive').length;
    return {
      labels: ['Active Users', 'Inactive Users'],
      datasets: [
        {
          data: [activeCount, inactiveCount],
          backgroundColor: ['#4CAF50', '#FF5733'],
        }
      ],
    };
  };

  const exportToExcel = () => {
    const sheetData = users.map(user => ({
      Name: user.name,
      Email: user.email,
      Age: user.age,
      Status: user.status,
    }));

    const worksheet = XLSX.utils.json_to_sheet(sheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Users');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(data, 'Users.xlsx');
  };

  if (loading) {
    return <div className="text-center text-lg">Loading users...</div>;
  }

  if (error) {
    return <div className="text-center text-lg text-red-600">Error: {error}</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-8 bg-gray-100 shadow-lg rounded-lg">
      <ToastContainer />
      <h1 className="text-3xl font-bold text-center mb-6 text-blue-600">All Users</h1>

      {/* Chart Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="bg-white p-6 shadow-lg rounded-lg">
          <h2 className="text-xl font-semibold text-center mb-4 text-blue-500">User Status</h2>
          <Doughnut data={calculateChartData()} />
        </div>

        <div className="bg-white p-6 shadow-lg rounded-lg">
          <h2 className="text-xl font-semibold text-center mb-4 text-blue-500">User Age Distribution</h2>
          <Bar
            data={{
              labels: users.map(user => user.name),
              datasets: [
                {
                  label: 'Age',
                  data: users.map(user => user.age),
                  backgroundColor: '#FF6347',
                },
              ],
            }}
            options={{ responsive: true }}
          />
        </div>
      </div>

      {/* User Records Table */}
      <div className="bg-white p-6 shadow-lg rounded-lg mb-8 overflow-x-auto">
        <h2 className="text-xl font-semibold text-center mb-4 text-blue-500">User Details</h2>
        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b border-gray-200 text-left text-gray-600 font-semibold">Name</th>
              <th className="py-2 px-4 border-b border-gray-200 text-left text-gray-600 font-semibold">Email</th>
              <th className="py-2 px-4 border-b border-gray-200 text-left text-gray-600 font-semibold">Age</th>
              <th className="py-2 px-4 border-b border-gray-200 text-left text-gray-600 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={index} className="hover:bg-gray-50 transition duration-200">
                <td className="py-2 px-4 border-b border-gray-200">{user.name}</td>
                <td className="py-2 px-4 border-b border-gray-200">{user.email}</td>
                <td className="py-2 px-4 border-b border-gray-200">{user.age}</td>
                <td className={`py-2 px-4 border-b border-gray-200 ${user.status === 'Active' ? 'text-green-500' : 'text-red-500'}`}>{user.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Export Button */}
      <button
        onClick={exportToExcel}
        className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition-all duration-200 transform hover:scale-105"
      >
        Export Data to Excel
      </button>
    </div>
  );
};

export default AllUsers;
