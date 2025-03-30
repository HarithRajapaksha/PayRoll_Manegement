import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Chart } from 'react-google-charts'; // Import Google Charts
import { jsPDF } from 'jspdf';
import html2pdf from 'html2pdf.js'; // Import html2pdf
import '../Components/AttendanceBarChart.css'; // External CSS for styling

const AttendanceBarChart = () => {
  const [highestAttendance, setHighestAttendance] = useState(null);
  const [lowestAttendance, setLowestAttendance] = useState(null);
  const [highestNoPay, setHighestNoPay] = useState(null);
  const [lowestNoPay, setLowestNoPay] = useState(null);
  const [userData, setUserData] = useState([]); // To store user data for table

  const token = localStorage.getItem('token');

  // Get the current month and year dynamically
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;  // getMonth() returns 0-based month, so we add 1

  useEffect(() => {
    // Fetch highest and lowest attendance for current month and year
    const fetchHighestAndLowestAttendance = async () => {
      try {
        const response = await axios.get(`http://localhost:3006/api/users/getUserAttendence/${currentYear}/${currentMonth}`, {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        setHighestAttendance(response.data.highestUserDetails);
        setLowestAttendance(response.data.lowestUserDetails);
      } catch (error) {
        console.error("❌ Error fetching highest and lowest attendance:", error);
      }
    };

    fetchHighestAndLowestAttendance();

    // Fetch highest and lowest NoPay data for current month and year
    const fetchNoPayData = async () => {
      try {
        const response = await axios.get(`http://localhost:3006/api/users/getSalHighestAndLovestSal/${currentYear}/${currentMonth}`, {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        setHighestNoPay(response.data.highestNoPayUser);
        setLowestNoPay(response.data.lowestNoPayUser);
      } catch (error) {
        console.error("❌ Error fetching highest and lowest NoPay data:", error);
      }
    };

    fetchNoPayData();

    // Fetch all users attendance and no pay data for current month and year
    const fetchAllUsersData = async () => {
      try {
        const response = await axios.get(`http://localhost:3006/api/users/getAllUsersAttendanceNoPay/${currentYear}/${currentMonth}`, {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        setUserData(response.data.userAttendanceNoPayData); // Set the user data for table
      } catch (error) {
        console.error("❌ Error fetching all users' attendance and no pay data:", error);
      }
    };

    fetchAllUsersData();
  }, [token, currentYear, currentMonth]);

  // Attendance Bar chart data
  const attendanceChartData = [
    ['Employee Name', 'Attendance'],
    [highestAttendance?.name, highestAttendance?.totalAttendance],
    [lowestAttendance?.name, lowestAttendance?.totalAttendance],
  ];

  // NoPay Bar chart data
  const noPayChartData = [
    ['Employee Name', 'NoPayDays'],
    [highestNoPay?.name, highestNoPay?.NoPayDays],
    [lowestNoPay?.name, lowestNoPay?.NoPayDays],
  ];

  // Chart options for Attendance
  const attendanceChartOptions = {
    chart: {
      title: `Employee with Highest and Lowest Attendance (${currentMonth}/${currentYear})`,
      titleTextStyle: {
        fontSize: 18, // Slightly smaller font size for title
        bold: true,
        color: '#2f4f4f',
      },
    },
    series: {
      0: { color: '#ffbf00' }, // Color for the highest attendance
      1: { color: '#ff4500' }, // Color for the lowest attendance
    },
    hAxis: {
      title: 'Total Attendance',
      minValue: 0,
      textStyle: { fontSize: 14 },
    },
    vAxis: {
      title: 'Employee Name',
      textStyle: { fontSize: 14 },
    },
    legend: { position: 'none' }, // Hides the legend for simplicity
    bar: { groupWidth: '30%' }, // Reduced bar width to 30%
    backgroundColor: '#f0f8ff',
    height: 250, // Set a smaller height for the chart
  };

  // Chart options for NoPay
  const noPayChartOptions = {
    chart: {
      title: `Employee with Highest and Lowest NoPay Days (${currentMonth}/${currentYear})`,
      titleTextStyle: {
        fontSize: 18, // Slightly smaller font size for title
        bold: true,
        color: '#2f4f4f',
      },
    },
    series: {
      0: { color: '#32cd32' }, // Color for the highest NoPay days
      1: { color: '#1e90ff' }, // Color for the lowest NoPay days
    },
    hAxis: {
      title: 'NoPay Days',
      minValue: 0,
      textStyle: { fontSize: 14 },
    },
    vAxis: {
      title: 'Employee Name',
      textStyle: { fontSize: 14 },
    },
    legend: { position: 'none' }, // Hides the legend for simplicity
    bar: { groupWidth: '30%' }, // Reduced bar width to 30%
    backgroundColor: '#f0f8ff',
    height: 250, // Set a smaller height for the chart
  };

  // Function to handle the PDF generation
  const generatePDF = () => {
    const element = document.getElementById('pdfContent'); // Get the container
    const options = {
      filename: `Attendance_NoPay_Report_${currentMonth}_${currentYear}.pdf`,
      html2canvas: { scale: 2 }, // Increase the scale to improve chart clarity
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
    };
    html2pdf().from(element).set(options).save();
  };

  return (
    <div className="container" id="pdfContent">
      <h2 className="heading">Employee Attendance and NoPay Comparison ({currentMonth}/{currentYear})</h2>
      
      {/* Change chart-container to stack charts vertically */}
      <div className="chart-container">
        <div className="chart-box">
          <h3 className="chart-title">Attendance Comparison</h3>
          <Chart
            width={'100%'}
            height={'250px'} // Reduced height for charts
            chartType="Bar"
            loader={<div>Loading Chart...</div>}
            data={attendanceChartData}
            options={attendanceChartOptions}
            rootProps={{ 'data-testid': '1' }}
          />
        </div>

        <div className="chart-box">
          <h3 className="chart-title">NoPay Days Comparison</h3>
          <Chart
            width={'100%'}
            height={'250px'} // Reduced height for charts
            chartType="Bar"
            loader={<div>Loading Chart...</div>}
            data={noPayChartData}
            options={noPayChartOptions}
            rootProps={{ 'data-testid': '2' }}
          />
        </div>
      </div>

      <div style={{marginTop: '50px', marginBottom: '50px'}}>
        <h3 className="table-title">Users Attendance and NoPay Data</h3>
        <table className="table table-striped table-bordered table-hover">
          <thead className="thead-dark">
            <tr>
              <th>Employee ID</th>
              <th>Name</th>
              <th>Attended Days</th>
              <th>No Pay Days</th>
            </tr>
          </thead>
          <tbody>
            {userData.map((user, index) => (
              <tr key={index}>
                <td>{user.empId}</td>
                <td>{user.Name}</td>
                <td>{user.attendedDays}</td>
                <td>{user.noPayDays}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

        <button className="btn btn-primary" onClick={generatePDF}>Generate PDF</button>
    </div>
  );
};

export default AttendanceBarChart;
