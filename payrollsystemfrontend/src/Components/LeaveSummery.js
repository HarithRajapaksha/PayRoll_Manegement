import React, { useEffect, useState, useRef } from 'react';
import Chart from 'react-google-charts';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import autoTable from 'jspdf-autotable';
import 'bootstrap/dist/css/bootstrap.min.css'; // Bootstrap CSS

function LeaveSummery() {
  const [leaveData, setLeaveData] = useState({
    leaveSummary: [],
    maxLeaves: null,
    minLeaves: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [year, setYear] = useState(new Date().getFullYear().toString()); // Default to current year
  const [month, setMonth] = useState(
    (new Date().getMonth() + 1).toString().padStart(2, '0'), // Default to current month
  );
  const tableRef = useRef(null); // Ref for table only

  // Generate year options (2000 to current year + 1)
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: currentYear - 2000 + 2 }, (_, i) =>
    (2000 + i).toString(),
  );

  // Month options (01 to 12)
  const monthOptions = [
    { value: '01', label: 'January' },
    { value: '02', label: 'February' },
    { value: '03', label: 'March' },
    { value: '04', label: 'April' },
    { value: '05', label: 'May' },
    { value: '06', label: 'June' },
    { value: '07', label: 'July' },
    { value: '08', label: 'August' },
    { value: '09', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' },
  ];

  // Fetch data from API when year or month changes
  useEffect(() => {
    const fetchLeaveData = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token'); // Adjust token retrieval as needed
        if (!token) {
          throw new Error('No authentication token found');
        }

        const response = await fetch(
          `http://localhost:3006/api/users/leaves/${year}/${month}`,
          {
            method: 'GET',
            headers: {
              Accept: 'application/json',
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();
        if (result.success) {
          setLeaveData(result.data);
        } else {
          throw new Error('API returned unsuccessful response');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaveData();
  }, [year, month]);

  // Generate and download PDF
  const generatePDF = async () => {
    const table = tableRef.current;
    if (!table) return;

    const pdf = new jsPDF('p', 'mm', 'a4');

    // Add header with address and telephone
    pdf.setFontSize(18);
    pdf.setFont('helvetica', 'bold');
    pdf.text('The Karnivore Restaurant', 105, 15, { align: 'center' });
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    pdf.text('No 263, Nawala Rd, SribJayawardenapura Kotte', 105, 25, { align: 'center' });
    pdf.text('Tel: 0113517277', 105, 33, { align: 'center' });
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text(`Leave Report for ${monthOptions.find((m) => m.value === month)?.label} ${year}`, 105, 43, { align: 'center' });

    // Prepare table data
    const tableBody = leaveData.leaveSummary.length > 0
      ? leaveData.leaveSummary.map((item) => [
          item.CorrectuserId || 'N/A',
          item.name || 'Unknown',
          item.role || 'N/A',
          item.count || '0',
        ])
      : [['N/A', 'No leave data available', 'N/A', '0']];

    // Generate table using jspdf-autotable
    autoTable(pdf, {
      startY: 50,
      head: [['EmployeeID', 'Name', 'Role', 'Leave Count']],
      body: tableBody,
      theme: 'grid',
      headStyles: {
        fillColor: [33, 37, 41], // Dark gray (table-dark)
        textColor: [255, 255, 255], // White text
        fontSize: 10,
        fontStyle: 'bold',
      },
      bodyStyles: {
        fontSize: 9,
        textColor: [33, 37, 41],
      },
      columnStyles: {
        0: { halign: 'center' },
        1: { halign: 'center' },
        2: { halign: 'center' },
        3: { halign: 'center' },
      },
      margin: { top: 50, left: 10, right: 10 },
    });

    // Save PDF
    pdf.save(`LeaveReport_${year}_${month}.pdf`);
  };

  // Prepare data for Google Charts
  const chartData = [
    ['User', 'Leave Count'],
    ...(leaveData.maxLeaves
      ? [[leaveData.maxLeaves.name + ' (Max)', leaveData.maxLeaves.count]]
      : []),
    ...(leaveData.minLeaves
      ? [[leaveData.minLeaves.name + ' (Min)', leaveData.minLeaves.count]]
      : []),
  ];

  return (
    <div className="page-bg">
      <div className="container mt-4">
        {/* Header Section for UI */}
        <div>
          <h1 className="text-center mb-2">The Karnivore Restaurant</h1>
          <h3 className="text-center mb-4">
            {monthOptions.find((m) => m.value === month)?.label} {year}
          </h3>
          <h2 className="text-center mb-4">Leave Report</h2>
        </div>

        {/* Bootstrap Table */}
        <div ref={tableRef}>
          <table className="table table-bordered table-striped">
            <thead className="thead-dark">
              <tr>
                <th>EmployeeID</th>
                <th>Name</th>
                <th>Role</th>
                <th>Leave Count</th>
              </tr>
            </thead>
            <tbody>
              {leaveData.leaveSummary.length > 0 ? (
                leaveData.leaveSummary.map((item, index) => (
                  <tr key={index}>
                    <td>{item.CorrectuserId}</td>
                    <td>{item.name}</td>
                    <td>{item.role}</td>
                    <td>{item.count}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center">
                    No leave data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Year and Month Selection */}
        <div className="row mb-4">
          <div className="col-md-6">
            <label htmlFor="yearSelect" className="form-label">
              Select Year
            </label>
            <select
              id="yearSelect"
              className="form-select"
              value={year}
              onChange={(e) => setYear(e.target.value)}
            >
              {yearOptions.map((yr) => (
                <option key={yr} value={yr}>
                  {yr}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-6">
            <label htmlFor="monthSelect" className="form-label">
              Select Month
            </label>
            <select
              id="monthSelect"
              className="form-select"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
            >
              {monthOptions.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {loading && <div className="alert alert-info">Loading...</div>}
        {error && <div className="alert alert-danger">{error}</div>}

        {/* Google Charts Bar Graph */}
        {leaveData.maxLeaves && leaveData.minLeaves && chartData.length > 1 && (
          <div className="mb-4">
            <Chart
              chartType="Bar"
              width="80%"
              height="300px"
              data={chartData}
              options={{
                title: `Max and Min Leave Counts by User (${monthOptions.find((m) => m.value === month)?.label} ${year})`,
                hAxis: { title: 'User' },
                vAxis: { title: 'Leave Count', minValue: 0 },
                legend: { position: 'none' },
                colors: ['#007bff'],
              }}
            />
          </div>
        )}

        {/* Get PDF Button */}
        <div className="text-center">
          <button className="btn btn-primary" onClick={generatePDF}>
            Get PDF
          </button>
        </div>
      </div>
    </div>
  );
}

export default LeaveSummery;