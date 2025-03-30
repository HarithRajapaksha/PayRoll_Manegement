import React, { useEffect, useState } from 'react';
import { Chart } from 'react-google-charts';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const ReportLeaveDataShow = () => {
  const [chartData, setChartData] = useState([
    ['User', 'Approved Leaves'],
    ['', 0],
    ['', 0]
  ]);
  const [tableData, setTableData] = useState([]);

  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.toLocaleString('default', { month: 'long' });

  useEffect(() => {
    const fetchLeaveData = async () => {
      try {
        // Chart Data
        const resChart = await axios.get('http://localhost:3006/api/users/getApprovedLeaveData', {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const chartDataApi = resChart.data;

        setChartData([
          ['User', 'Approved Leaves'],
          [chartDataApi.highestLeave.name || 'Unknown', chartDataApi.highestLeave.approvedLeaveCount],
          [chartDataApi.lowestLeave.name || 'Unknown', chartDataApi.lowestLeave.approvedLeaveCount]
        ]);

        // Table Data
        const resTable = await axios.get('http://localhost:3006/api/users/getAllApprovedLeaveCounts', {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setTableData(resTable.data);

      } catch (error) {
        console.error('Error fetching leave data:', error);
      }
    };

    fetchLeaveData();
  }, []);

  return (
    <div className="container mt-4">
      <h3 className="mb-4">Approved Leave Report- {currentYear} {currentMonth}</h3>

      <Chart
        chartType="ColumnChart"
        width="100%"
        height="400px"
        data={chartData}
        options={{
          title: 'Highest vs Lowest Approved Leaves',
          chartArea: { width: '60%' },
          hAxis: {
            title: 'User',
            minValue: 0,
          },
          vAxis: {
            title: 'Approved Leave Count',
          },
          colors: ['#1b9e77'],
        }}
      />

      <h4 className="mt-5 mb-3">All Users - Approved Leave Count</h4>
      <div className="table-responsive">
        <table className="table table-bordered table-striped">
          <thead className="table-dark">
            <tr>
              <th>LeaveHolderId</th>
              <th>Name</th>
              <th>Approved Leave Count</th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((item, index) => (
              <tr key={index}>
                <td>{item.LeaveHolderId}</td>
                <td>{item.name}</td>
                <td>{item.approvedLeaveCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReportLeaveDataShow;
