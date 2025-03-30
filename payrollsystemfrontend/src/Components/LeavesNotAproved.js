import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Chart } from 'react-google-charts'; // Import Google Charts
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS

const LeaveNotAproved = () => {
  const [notApprovedLeaveData, setNotApprovedLeaveData] = useState([]); // To store leave data for the chart
  const [notApprovedLeaveCounts, setNotApprovedLeaveCounts] = useState([]); // To store table data
  const [minLeaveUser, setMinLeaveUser] = useState(null); // To store user with minimum leave count
  const [maxLeaveUser, setMaxLeaveUser] = useState(null); // To store user with maximum leave count

  const token = localStorage.getItem('token');

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
        console.log('Not Approved Leave Data:', response.data); // Debugging line
        setNotApprovedLeaveData(response.data); // Set the data for the bar chart
      } catch (error) {
        console.error('❌ Error fetching not approved leave data:', error);
      }
    };

    // Fetch the count of not approved leave requests for the table
    const fetchNotApprovedLeaveCounts = async () => {
      try {
        const response = await axios.get('http://localhost:3006/api/users/getAllNotApprovedHalfDayRequests', {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        console.log('Not Approved Leave Counts:', response.data); // Debugging line
        if (response.data.approvedHalfDayData && Array.isArray(response.data.approvedHalfDayData)) {
          setNotApprovedLeaveCounts(response.data.approvedHalfDayData); // Set the data for the table
        } else {
          console.error('Data is not in expected format:', response.data);
          setNotApprovedLeaveCounts([]); // Empty array in case of incorrect format
        }
      } catch (error) {
        console.error('❌ Error fetching not approved leave counts:', error);
      }
    };

    // Fetch the min and max leave data for the bar chart
    const fetchMinAndMaxLeaveUsers = async () => {
      try {
        const response = await axios.get('http://localhost:3006/api/users/getNotApprovedLeaveData', {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        console.log('Min and Max Leave Users:', response.data); // Debugging line
        setMinLeaveUser(response.data.lowestLeave); // Set the user with minimum leave
        setMaxLeaveUser(response.data.highestLeave); // Set the user with maximum leave
      } catch (error) {
        console.error('❌ Error fetching min and max leave data:', error);
      }
    };

    fetchNotApprovedLeaveData();
    fetchNotApprovedLeaveCounts();
    fetchMinAndMaxLeaveUsers();
  }, [token]);

  // Data for the bar chart (check for undefined or null values)
  const leaveChartData = [
    ['Employee Name', 'Leave Count'],
    [minLeaveUser ? minLeaveUser.name : 'Unknown', minLeaveUser ? minLeaveUser.approvedLeaveCount : 0],
    [maxLeaveUser ? maxLeaveUser.name : 'Unknown', maxLeaveUser ? maxLeaveUser.approvedLeaveCount : 0],
  ];

  // Chart options for the bar chart
  const leaveChartOptions = {
    chart: {
      title: `Min and Max Leave Users`,
      titleTextStyle: {
        fontSize: 18,
        bold: true,
        color: '#2f4f4f',
      },
    },
    series: {
      0: { color: '#ffbf00' },
      1: { color: '#ff4500' },
    },
    hAxis: {
      title: 'Leave Count',
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
      <h2 className="text-center mb-4">Not Approved Leave Requests Comparison- {currentYear} {currentMonth}</h2>

      {/* Bar Chart Section */}
      <div className="chart-container mb-4">
        <div className="chart-box">
          <h3 className="text-center">Min and Max Leave Users</h3>
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
        <h3 className="table-title text-center">Not Approved Leave Requests</h3>
        <table className="table table-striped table-bordered table-hover">
          <thead className="thead-dark">
            <tr>
              <th>Employee ID</th>
              <th>Name</th>
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
                  <td>{data.userId}</td>
                  <td>{data.name}</td>
                  <td>{new Date(data.date).toLocaleDateString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeaveNotAproved;
