import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import 'bootstrap/dist/css/bootstrap.min.css';

function EtfPaymentsDes() {
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [etfData, setEtfData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [totalETF, setTotalETF] = useState(0);

  const months = [
    { value: 1, name: 'January' },
    { value: 2, name: 'February' },
    { value: 3, name: 'March' },
    { value: 4, name: 'April' },
    { value: 5, name: 'May' },
    { value: 6, name: 'June' },
    { value: 7, name: 'July' },
    { value: 8, name: 'August' },
    { value: 9, name: 'September' },
    { value: 10, name: 'October' },
    { value: 11, name: 'November' },
    { value: 12, name: 'December' }
  ];

  const years = [];
  const currentYear = new Date().getFullYear();
  for (let i = currentYear; i >= currentYear - 10; i--) {
    years.push(i);
  }

  const handleSearch = async () => {
    if (!selectedMonth || !selectedYear) {
      setError('Please select both month and year');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      console.log('Making ETF API call to:', `http://localhost:3006/api/users/getEtfModelData/${selectedMonth}/${selectedYear}`);
      
      const response = await fetch(`http://localhost:3006/api/users/getEtfModelData/${selectedMonth}/${selectedYear}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);

      if (!response.ok) {
        console.log('Main endpoint failed, trying aggregated version...');
        const aggResponse = await fetch(`http://localhost:3006/api/users/getEtfModelDataAggregated/${selectedMonth}/${selectedYear}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (aggResponse.ok) {
          const aggData = await aggResponse.json();
          console.log('Aggregated endpoint success:', aggData);
          
          const etfDataFromAPI = aggData.etfData || [];
          const total = etfDataFromAPI.reduce((sum, item) => sum + (item.ETF || 0), 0);
          
          setEtfData(etfDataFromAPI);
          setTotalETF(total);
          setError('');
          return;
        }
        
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }
      
      const etfDataFromAPI = data.etfData || [];
      const total = etfDataFromAPI.reduce((sum, item) => sum + (item.ETF || 0), 0);
      
      setEtfData(etfDataFromAPI);
      setTotalETF(total);
      setError('');
    } catch (err) {
      setError('Failed to fetch ETF data: ' + err.message);
      setEtfData([]);
      setTotalETF(0);
    } finally {
      setLoading(false);
    }
  };

  const getMonthName = (monthValue) => {
    const month = months.find(m => m.value === parseInt(monthValue));
    return month ? month.name : '';
  };

  const generatePDF = () => {
    const monthName = getMonthName(selectedMonth);
    if (!etfData.length || !monthName || !selectedYear) {
      setError('No data available or invalid month/year selected');
      return;
    }

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
    pdf.text(`ETF Report - ${monthName} ${selectedYear}`, 105, 43, { align: 'center' });

    // Prepare table data
    const tableBody = etfData.length > 0
      ? etfData.map((item) => [
          item.employeeId || 'N/A',
          item.employeeName || 'N/A',
          item.role || 'N/A',
          `Rs. ${(item.basicSalary || 0).toLocaleString()}`,
          `Rs. ${(item.ETF || 0).toLocaleString()}`
        ])
      : [['N/A', 'No ETF data available', 'N/A', 'Rs. 0', 'Rs. 0']];

    // Prepare summary data as a table
    const summaryBody = [
      ['Total Records', etfData.length.toString()],
      ['Total ETF Contribution', `Rs. ${totalETF.toLocaleString()}`],
    ];

    // Generate ETF data table
    autoTable(pdf, {
      startY: 50,
      head: [['Employee ID', 'Employee Name', 'Role', 'Basic Salary', 'ETF Contribution (3%)']],
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
        3: { halign: 'right' },
        4: { halign: 'right' },
      },
      margin: { top: 50, left: 10, right: 10 },
    });

    // Generate summary table
    autoTable(pdf, {
      startY: pdf.lastAutoTable.finalY + 10,
      head: [['Summary Item', 'Value']],
      body: summaryBody,
      theme: 'grid',
      headStyles: {
        fillColor: [200, 200, 200], // Gray for summary header
        textColor: [33, 37, 41],
        fontSize: 10,
        fontStyle: 'bold',
      },
      bodyStyles: {
        fontSize: 9,
        textColor: [33, 37, 41],
      },
      columnStyles: {
        0: { halign: 'left' },
        1: { halign: 'right' },
      },
      margin: { left: 10, right: 10 },
    });

    // Add generation date
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Generated on: ${new Date().toLocaleString()}`, 10, pdf.lastAutoTable.finalY + 10);

    // Save PDF
    pdf.save(`ETF_Report_${monthName}_${selectedYear}.pdf`);
  };

  return (
    <div className="page-bg">
      <div className="container mt-4">
        <div className="row">
          <div className="col-12">
            <h2 className="mb-4">ETF Payment Report</h2>
            
            {/* Search Form */}
            <div className="card mb-4">
              <div className="card-body">
                <div className="row">
                  <div className="col-md-4">
                    <label htmlFor="monthSelect" className="form-label">Select Month</label>
                    <select
                      id="monthSelect"
                      className="form-select"
                      value={selectedMonth}
                      onChange={(e) => setSelectedMonth(e.target.value)}
                    >
                      <option value="">Choose Month...</option>
                      {months.map(month => (
                        <option key={month.value} value={month.value}>
                          {month.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-4">
                    <label htmlFor="yearSelect" className="form-label">Select Year</label>
                    <select
                      id="yearSelect"
                      className="form-select"
                      value={selectedYear}
                      onChange={(e) => setSelectedYear(e.target.value)}
                    >
                      <option value="">Choose Year...</option>
                      {years.map(year => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-4 d-flex align-items-end">
                    <button
                      className="btn btn-primary w-100"
                      onClick={handleSearch}
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                          Searching...
                        </>
                      ) : (
                        'Search'
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="alert alert-danger" role="alert">
                <strong>Error:</strong> {error}
              </div>
            )}

            {/* Data Display */}
            {etfData.length > 0 && (
              <>
                {/* Employee Data Table */}
                <div className="card mb-4">
                  <div className="card-header">
                    <h4>ETF Payment for {getMonthName(selectedMonth)} {selectedYear}</h4>
                  </div>
                  <div className="card-body">
                    <div className="table-responsive">
                      <table className="table table-striped table-hover">
                        <thead className="table-dark">
                          <tr>
                            <th>Employee ID</th>
                            <th>Employee Name</th>
                            <th>Role</th>
                            <th>Basic Salary</th>
                            <th>ETF Contribution (3%)</th>
                          </tr>
                        </thead>
                        <tbody>
                          {etfData.map((item, index) => (
                            <tr key={index}>
                              <td>{item.employeeId || 'N/A'}</td>
                              <td>{item.employeeName || 'N/A'}</td>
                              <td>{item.role || 'N/A'}</td>
                              <td>Rs. {(item.basicSalary || 0).toLocaleString()}</td>
                              <td>Rs. {(item.ETF || 0).toLocaleString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* Total Summary */}
                <div className="card mb-4">
                  <div className="card-body bg-light">
                    <div className="row">
                      <div className="col-md-4">
                        <h5>Total Records</h5>
                        <p className="h4 text-info">{etfData.length}</p>
                      </div>
                      <div className="col-md-4">
                        <h5>Total ETF Contribution</h5>
                        <p className="h4 text-success">Rs. {totalETF.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Report Preview */}
                <div className="card mb-4">
                  <div className="card-header d-flex justify-content-between align-items-center">
                    <h4>Report Preview</h4>
                    <button
                      className="btn btn-success"
                      onClick={generatePDF}
                    >
                      <i className="fas fa-download me-2"></i>
                      Download PDF
                    </button>
                  </div>
                  <div className="card-body">
                    <div className="text-center mb-4">
                      <h2>The Karnivore Restaurant</h2>
                      <h4>ETF Report - {getMonthName(selectedMonth)} {selectedYear}</h4>
                    </div>
                    
                    <div className="table-responsive">
                      <table className="table table-bordered table-sm">
                        <thead className="table-secondary">
                          <tr>
                            <th>Employee ID</th>
                            <th>Employee Name</th>
                            <th>Role</th>
                            <th>Basic Salary</th>
                            <th>ETF (3%)</th>
                          </tr>
                        </thead>
                        <tbody>
                          {etfData.map((item, index) => (
                            <tr key={index}>
                              <td>{item.employeeId || 'N/A'}</td>
                              <td>{item.employeeName || 'N/A'}</td>
                              <td>{item.role || 'N/A'}</td>
                              <td>Rs. {(item.basicSalary || 0).toLocaleString()}</td>
                              <td>Rs. {(item.ETF || 0).toLocaleString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <div className="mt-4 p-3 bg-light rounded">
                      <h5>Summary</h5>
                      <p><strong>Total Records:</strong> {etfData.length}</p>
                      <p><strong>Total ETF Contribution:</strong> Rs. {totalETF.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default EtfPaymentsDes;