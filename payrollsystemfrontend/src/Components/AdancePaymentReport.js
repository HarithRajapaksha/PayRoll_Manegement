import React, { useEffect, useState, useRef } from 'react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import 'bootstrap/dist/css/bootstrap.min.css'; // Bootstrap CSS

function AdancePaymentReport() {
  const [advanceData, setAdvanceData] = useState({
    advances: [],
    totalSalary: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [year, setYear] = useState('2025'); // Default to 2025 based on API call
  const [month, setMonth] = useState('07'); // Default to July based on API call
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
    const fetchAdvanceData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `http://localhost:3006/api/users/advances/${year}/${month}`,
          {
            method: 'GET',
            headers: {
              Accept: 'application/json',
            },
          },
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();
        if (result.success) {
          setAdvanceData(result.data);
        } else {
          throw new Error('API returned unsuccessful response');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAdvanceData();
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
    pdf.text('No 263, Nawala Rd, Sri Jayawardenapura Kotte', 105, 25, { align: 'center' });
    pdf.text('Tel: 0113517277', 105, 33, { align: 'center' });
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text(`Advance Payment Report for ${monthOptions.find((m) => m.value === month)?.label} ${year}`, 105, 43, { align: 'center' });

    // Prepare table data
    const tableBody = advanceData.advances.length > 0
      ? advanceData.advances.map((item) => [
          item.CorrectuserId || 'N/A',
          item.Name || 'Unknown',
          item.Role || 'N/A',
          item.Salary || '0',
        ])
      : [['N/A', 'No advance payment data available', 'N/A', '0']];

    // Prepare footer (total row)
    const footerRow = [
      { content: 'Net Salary Paid', colSpan: 3, styles: { halign: 'right', fontStyle: 'bold' } },
      advanceData.totalSalary || '0',
    ];

    // Generate table using jspdf-autotable
    autoTable(pdf, {
      startY: 50,
      head: [['Emp ID', 'Name', 'Role', 'Advance Payment (Rs)']],
      body: tableBody,
      foot: [footerRow],
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
      footStyles: {
        fillColor: [200, 200, 200], // Gray for total row
        fontStyle: 'bold',
        fontSize: 9,
        textColor: [33, 37, 41],
      },
      columnStyles: {
        0: { halign: 'center' },
        1: { halign: 'center' },
        2: { halign: 'center' },
        3: { halign: 'right' },
      },
      margin: { top: 50, left: 10, right: 10 },
    });

    // Save PDF
    pdf.save(`AdvancePaymentReport_${year}_${month}.pdf`);
  };

  return (
    <div className="page-bg">
      <div className="container mt-4">
        {/* Header Section for UI */}
        <div>
          <h1 className="text-center mb-2">The Karnivore Restaurant</h1>
          <h3 className="text-center mb-4">
            {monthOptions.find((m) => m.value === month)?.label} {year}
          </h3>
          <h2 className="text-center mb-4">Advance Payment Report</h2>
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

        {/* Bootstrap Table */}
        <div ref={tableRef}>
          <table className="table table-bordered table-striped">
            <thead className="thead-dark">
              <tr>
                <th>Emp ID</th>
                <th>Name</th>
                <th>Role</th>
                <th>Advance Payment (Rs)</th>
              </tr>
            </thead>
            <tbody>
              {advanceData.advances.length > 0 ? (
                advanceData.advances.map((item, index) => (
                  <tr key={index}>
                    <td>{item.CorrectuserId}</td>
                    <td>{item.Name}</td>
                    <td>{item.Role}</td>
                    <td>{item.Salary}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center">
                    No advance payment data available
                  </td>
                </tr>
              )}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="3" className="text-right font-weight-bold">
                  Net Salary Paid
                </td>
                <td className="font-weight-bold">{advanceData.totalSalary}</td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Download PDF Button */}
        <div className="text-center mt-4">
          <button className="btn btn-primary" onClick={generatePDF}>
            Download PDF
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdancePaymentReport;