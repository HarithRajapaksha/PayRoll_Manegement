import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Chart } from 'react-google-charts'; // Import Google Charts
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS

const AdvancePayment = () => {
  const [notApprovedLeaveData, setNotApprovedLeaveData] = useState([]); // To store leave data for the chart
  const [notApprovedLeaveCounts, setNotApprovedLeaveCounts] = useState([]); // To store table data
  const [minAdvanceUser, setMinAdvanceUser] = useState(null); // To store user with minimum advance count
  const [maxAdvanceUser, setMaxAdvanceUser] = useState(null); // To store user with maximum advance count

  const token = localStorage.getItem('token');

  // Get current month and year
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.toLocaleString('default', { month: 'long' });

  useEffect(() => {
    // Fetch leave data for the bar chart
    const fetchNotApprovedLeaveData = async () => {
      try {
        const response = await axios.get('http://localhost:3006/api/users/getNotApprovedLeaveData', {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        console.log('Not Approved Leave Data:', response.data.approvedHalfDayData); // Debugging line
        setNotApprovedLeaveData(response.data); // Set the data for the bar chart
      } catch (error) {
        console.error('❌ Error fetching not approved leave data:', error);
      }
    };

    // Fetch the count of not approved leave requests for the table
    const fetchNotApprovedLeaveCounts = async () => {
      try {
        const response = await axios.get('http://localhost:3006/api/users/getAllUsersAdvancePayment', {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        console.log('Not Approved Leave All data:', response.data); // Debugging line
        // Ensure the response is an array before setting the state
        if (Array.isArray(response.data.usersData)) {
          setNotApprovedLeaveCounts(response.data.usersData); // Set the data for the table
        } else {
          console.error('Data is not an array:', response.data);
          setNotApprovedLeaveCounts([]); // Set empty array if data is not in expected format
        }
      } catch (error) {
        console.error('❌ Error fetching not approved leave counts:', error);
      }
    };

    // Fetch the min and max advance payment users
    const fetchMinAndMaxAdvancePaymentUsers = async () => {
      try {
        const response = await axios.get('http://localhost:3006/api/users/getMinAndMaxAdvancePaymentUsers', {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        console.log('Min and Max Advance Payment Users:', response.data); // Debugging line
        setMinAdvanceUser(response.data.minSalaryUser); // Directly use the data
        setMaxAdvanceUser(response.data.maxSalaryUser); // Directly use the data
      } catch (error) {
        console.error('❌ Error fetching min and max advance payment users:', error);
      }
    };

    fetchNotApprovedLeaveData();
    fetchNotApprovedLeaveCounts();
    fetchMinAndMaxAdvancePaymentUsers();
  }, [token]);

  // Data for the bar chart (check for undefined or null values)
  const leaveChartData = [
    ['Employee Name', 'Salary'],
    [minAdvanceUser ? minAdvanceUser.name : 'Unknown', minAdvanceUser ? minAdvanceUser.Salary : 0],
    [maxAdvanceUser ? maxAdvanceUser.name : 'Unknown', maxAdvanceUser ? maxAdvanceUser.Salary : 0],
  ];

  // Chart options for the bar chart
  const leaveChartOptions = {
    chart: {
      title: `Min and Max Advance Payment Users`,
      titleTextStyle: {
        fontSize: 18,
        bold: true,
        color: '#2f4f4f',
      },
    },
    series: {
      0: { color: '#ffbf00' }, // Color for the highest salary user
      1: { color: '#ff4500' }, // Color for the lowest salary user
    },
    hAxis: {
      title: 'Salary',
      minValue: 0,
      textStyle: { fontSize: 14 },
    },
    vAxis: {
      title: 'Employee Name',
      textStyle: { fontSize: 14 },
    },
    legend: { position: 'none' },
    bar: { groupWidth: '30%' },
    backgroundColor: '#f0f8ff',
    height: 250,
  };

  return (
    <div className="container" style={{ marginTop: '40px' }}>
      {/* Title */}
      <h2 className="text-center mb-4">Advance Payment Comparison - {currentMonth} {currentYear}</h2>

      {/* Bar Chart Section */}
      <div className="chart-container mb-4">
        <div className="chart-box">
          <h3 className="text-center">Min and Max Advance Payment Users</h3>
          <Chart
            width={'100%'}
            height={'300px'}
            chartType="Bar"
            loader={<div>Loading Chart...</div>}
            data={leaveChartData}
            options={leaveChartOptions}
          />
        </div>
      </div>

      {/* Table Section */}
      <div className="table-container">
        <h3 className="table-title text-center">Users with Advance Payment -{currentMonth} {currentYear}</h3>
        <table className="table table-striped table-bordered table-hover">
          <thead className="thead-dark">
            <tr>
              <th>Employee ID</th>
              <th>Name</th>
              <th>Salary</th>
              <th>Leave Date</th>
            </tr>
          </thead>
          <tbody>
            {notApprovedLeaveCounts.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center">No data available</td>
              </tr>
            ) : (
              notApprovedLeaveCounts.map((data, index) => (
                <tr key={index}>
                  <td>{data._id}</td>
                  <td>{data.Name}</td>
                  <td>{data.Salary}</td>
                  <td>{new Date(data.createdAt).toLocaleDateString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdvancePayment;
