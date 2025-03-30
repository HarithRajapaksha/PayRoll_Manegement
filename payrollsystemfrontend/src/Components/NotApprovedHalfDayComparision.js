import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Chart } from 'react-google-charts'; // Import Google Charts
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS

const NotApprovedHalfDayComparision = () => {
  const [notApprovedHalfDayData, setNotApprovedHalfDayData] = useState([]); // To store table data
  const [minNotApprovedUser, setMinNotApprovedUser] = useState(null); // To store user with minimum not-approved half-day count
  const [maxNotApprovedUser, setMaxNotApprovedUser] = useState(null); // To store user with maximum not-approved half-day count

  const token = localStorage.getItem('token');

  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.toLocaleString('default', { month: 'long' });

  useEffect(() => {
    // Fetch all not-approved half-day requests
    const fetchNotApprovedHalfDayRequests = async () => {
      try {
        const response = await axios.get('http://localhost:3006/api/users/getAllNotApprovedHalfDayRequests', {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        setNotApprovedHalfDayData(response.data.approvedHalfDayData);
      } catch (error) {
        console.error('❌ Error fetching not-approved half-day data:', error);
      }
    };

    // Fetch min and max not-approved half-day users
    const fetchMinAndMaxNotApprovedHalfDayUsers = async () => {
      try {
        const response = await axios.get('http://localhost:3006/api/users/getMinAndMaxNotAproved', {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        setMinNotApprovedUser(response.data.minHalfDayUser);
        setMaxNotApprovedUser(response.data.maxHalfDayUser);
      } catch (error) {
        console.error('❌ Error fetching min and max not-approved half-day users:', error);
      }
    };

    fetchNotApprovedHalfDayRequests();
    fetchMinAndMaxNotApprovedHalfDayUsers();
  }, [token]);

  // Bar chart data for min and max not-approved half-day users
  const notApprovedHalfDayChartData = [
    ['Employee Name', 'Not Approved Half Day Count'],
    [minNotApprovedUser?.name, minNotApprovedUser?.halfDayCount],
    [maxNotApprovedUser?.name, maxNotApprovedUser?.halfDayCount],
  ];

  // Chart options for the not-approved half-day bar chart
  const notApprovedHalfDayChartOptions = {
    chart: {
      title: `Min and Max Not Approved Half Day Users`,
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
      title: 'Half Day Count',
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
      <h2 className="text-center mb-4">Not Approved Half Day Attendance and User Comparison- {currentYear} {currentMonth}</h2>

      {/* Bar Chart Section */}
      <div className="chart-container mb-4">
        <div className="chart-box">
          <h3 className="text-center">Min and Max Not Approved Half Day Users</h3>
          <Chart
            width={'100%'}
            height={'300px'}
            chartType="Bar"
            loader={<div>Loading Chart...</div>}
            data={notApprovedHalfDayChartData}
            options={notApprovedHalfDayChartOptions}
          />
        </div>
      </div>

      {/* Table Section */}
      <div className="table-container">
        <h3 className="table-title text-center">Not Approved Half Day Requests</h3>
        <table className="table table-striped table-bordered table-hover">
          <thead className="thead-dark">
            <tr>
              <th>Employee ID</th>
              <th>Name</th>
              <th>Half Day (Morning/Evening)</th>
              <th>Request Date</th>
            </tr>
          </thead>
          <tbody>
            {notApprovedHalfDayData.map((data, index) => (
              <tr key={index}>
                <td>{data.userId}</td>
                <td>{data.name}</td>
                <td>{data.whichHalf}</td>
                <td>{new Date(data.date).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default NotApprovedHalfDayComparision;
