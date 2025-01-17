import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { confirmAlert } from 'react-confirm-alert';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import 'react-toastify/dist/ReactToastify.css';
import 'react-confirm-alert/src/react-confirm-alert.css';

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/user/all');
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

  const handleDeleteUser = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/user/delete/${id}`);
      setUsers(users.filter(user => user._id !== id));
      toast.success('User deleted successfully!');
    } catch (error) {
      console.error('Error deleting user:', error.response || error.message);
      toast.error(`Error deleting user: ${error.response?.data?.message || error.message || 'Unknown error'}`);
    }
  };

  const confirmDelete = (id) => {
    confirmAlert({
      title: 'Confirm to Delete',
      message: 'Are you sure you want to delete this user?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => handleDeleteUser(id),
        },
        {
          label: 'No',
        },
      ],
    });
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
              <th className="py-2 px-4 border-b border-gray-200 text-left text-gray-600 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={index} className="hover:bg-gray-50 transition duration-200">
                <td className="py-2 px-4 border-b border-gray-200">{user.name}</td>
                <td className="py-2 px-4 border-b border-gray-200">{user.email}</td>
                <td className="py-2 px-4 border-b border-gray-200">{user.age}</td>
                <td className={`py-2 px-4 border-b border-gray-200 ${user.status === 'Active' ? 'text-green-500' : 'text-red-500'}`}>{user.status}</td>
                <td className="py-2 px-4 border-b border-gray-200">
                  <button
                    onClick={() => confirmDelete(user._id)}
                    className="text-white bg-red-500 px-4 py-2 rounded hover:bg-red-600 transition"
                  >
                    Delete
                  </button>
                </td>
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
