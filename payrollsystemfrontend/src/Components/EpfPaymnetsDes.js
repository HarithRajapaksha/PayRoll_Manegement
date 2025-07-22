import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';


function EpfPaymnetsDes() {
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [epfData, setEpfData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [totalEmployer, setTotalEmployer] = useState(0);

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
      console.log('Making API call to:', `http://localhost:3006/api/users/getEpfModelData/${selectedMonth}/${selectedYear}`);
      
      const response = await fetch(`http://localhost:3006/api/users/getEpfModelData/${selectedMonth}/${selectedYear}`, {
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
        // If main endpoint fails, try the aggregated version
        console.log('Main endpoint failed, trying aggregated version...');
        const aggResponse = await fetch(`http://localhost:3006/api/users/getEpfModelDataAggregated/${selectedMonth}/${selectedYear}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (aggResponse.ok) {
          const aggData = await aggResponse.json();
          console.log('Aggregated endpoint success:', aggData);
          
          const epfDataFromAPI = aggData.epfData || [];
          const total = epfDataFromAPI.reduce((sum, item) => sum + (item.Employer || 0), 0);
          
          setEpfData(epfDataFromAPI);
          setTotalEmployer(total);
          setError('');
          return;
        }
        
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }
      
      // Data is already processed in backend
      const epfDataFromAPI = data.epfData || [];
      
      // Calculate total Employer values
      const total = epfDataFromAPI.reduce((sum, item) => sum + (item.Employer || 0), 0);
      
      setEpfData(epfDataFromAPI);
      setTotalEmployer(total);
      setError('');
    } catch (err) {
      setError('Failed to fetch EPF data: ' + err.message);
      setEpfData([]);
      setTotalEmployer(0);
    } finally {
      setLoading(false);
    }
  } // <-- Add this closing curly brace to end handleSearch

  const getMonthName = (monthValue) => {
    const month = months.find(m => m.value === parseInt(monthValue));
    return month ? month.name : '';
  };

  const generatePDF = async () => {
    const monthName = getMonthName(selectedMonth);
    
    // Create a temporary container for PDF content
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = `
      <div style="padding: 20px; font-family: Arial, sans-serif;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="margin: 0; color: #333;">KARNIVO</h1>
          <h3 style="margin: 10px 0; color: #666;">EPF Report - ${monthName} ${selectedYear}</h3>
          <h4 style="margin: 10px 0; color: #666;">ETF Receipt</h4>
        </div>
        
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <thead>
            <tr style="background-color: #343a40; color: white;">
              <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Employee ID</th>
              <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Employee Name</th>
              <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Role</th>
              <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Basic Salary</th>
              <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Employee Contribution</th>
              <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Employer Contribution</th>
              <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Total EPF</th>
            </tr>
          </thead>
          <tbody>
            ${epfData.map(item => `
              <tr style="border-bottom: 1px solid #ddd;">
                <td style="border: 1px solid #ddd; padding: 8px;">${item.employeeId || 'N/A'}</td>
                <td style="border: 1px solid #ddd; padding: 8px;">${item.employeeName || 'N/A'}</td>
                <td style="border: 1px solid #ddd; padding: 8px;">${item.role || 'N/A'}</td>
                <td style="border: 1px solid #ddd; padding: 8px;">Rs. ${(item.basicSalary || 0).toLocaleString()}</td>
                <td style="border: 1px solid #ddd; padding: 8px;">Rs. ${(item.Employee || 0).toLocaleString()}</td>
                <td style="border: 1px solid #ddd; padding: 8px;">Rs. ${(item.Employer || 0).toLocaleString()}</td>
                <td style="border: 1px solid #ddd; padding: 8px;">Rs. ${((item.Employee || 0) + (item.Employer || 0)).toLocaleString()}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        
        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin-top: 20px;">
          <h4 style="margin-top: 0;">Summary</h4>
          <p><strong>Total Records:</strong> ${epfData.length}</p>
          <p><strong>Total Employer Contribution:</strong> Rs. ${totalEmployer.toLocaleString()}</p>
          <p><strong>Total Employee Contribution:</strong> Rs. ${epfData.reduce((sum, item) => sum + (item.Employee || 0), 0).toLocaleString()}</p>
          <p><strong>Grand Total EPF:</strong> Rs. ${(totalEmployer + epfData.reduce((sum, item) => sum + (item.Employee || 0), 0)).toLocaleString()}</p>
        </div>
        
        <div style="margin-top: 30px;">
          <p style="font-size: 12px; color: #666;"><strong>Generated on:</strong> ${new Date().toLocaleString()}</p>
        </div>
      </div>
    `;

    // Convert to PDF using browser's built-in functionality
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>EPF_Report_${monthName}_${selectedYear}.pdf</title>
        <style>
          @page { margin: 0.5in; }
          body { margin: 0; padding: 0; }
        </style>
      </head>
      <body>
        ${tempDiv.innerHTML}
        <script>
          window.onload = function() {
            // Automatically trigger download as PDF
            setTimeout(function() {
              window.print();
              // Close the window after a short delay
              setTimeout(function() {
                window.close();
              }, 2000);
            }, 500);
          }
        </script>
      </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="page-bg">
    <div className="container mt-4">
      <div className="row">
        <div className="col-12">
          <h2 className="mb-4">EPF Data Report</h2>
          
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
          {epfData.length > 0 && (
            <>
              {/* Employee Data Table */}
              <div className="card mb-4">
                <div className="card-header">
                  <h4>EPF Data for {getMonthName(selectedMonth)} {selectedYear}</h4>
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
                          <th>Employee Contribution</th>
                          <th>Employer Contribution</th>
                          <th>Total EPF</th>
                        </tr>
                      </thead>
                      <tbody>
                        {epfData.map((item, index) => (
                          <tr key={index}>
                            <td>{item.employeeId || 'N/A'}</td>
                            <td>{item.employeeName || 'N/A'}</td>
                            <td>{item.role || 'N/A'}</td>
                            <td>Rs. {(item.basicSalary || 0).toLocaleString()}</td>
                            <td>Rs. {(item.Employee || 0).toLocaleString()}</td>
                            <td>Rs. {(item.Employer || 0).toLocaleString()}</td>
                            <td>Rs. {((item.Employee || 0) + (item.Employer || 0)).toLocaleString()}</td>
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
                    <div className="col-md-3">
                      <h5>Total Records</h5>
                      <p className="h4 text-info">{epfData.length}</p>
                    </div>
                    <div className="col-md-3">
                      <h5>Total Employer Contribution</h5>
                      <p className="h4 text-success">Rs. {totalEmployer.toLocaleString()}</p>
                    </div>
                    <div className="col-md-3">
                      <h5>Total Employee Contribution</h5>
                      <p className="h4 text-primary">Rs. {epfData.reduce((sum, item) => sum + (item.Employee || 0), 0).toLocaleString()}</p>
                    </div>
                    <div className="col-md-3">
                      <h5>Grand Total EPF</h5>
                      <p className="h4 text-danger">Rs. {(totalEmployer + epfData.reduce((sum, item) => sum + (item.Employee || 0), 0)).toLocaleString()}</p>
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
                    <h2>KARNIVO</h2>
                    <h4>EPF Report - {getMonthName(selectedMonth)} {selectedYear}</h4>
                    <h5>ETF Receipt</h5>
                  </div>
                  
                  <div className="table-responsive">
                    <table className="table table-bordered table-sm">
                      <thead className="table-secondary">
                        <tr>
                          <th>Employee ID</th>
                          <th>Employee Name</th>
                          <th>Role</th>
                          <th>Basic Salary</th>
                          <th>Employee</th>
                          <th>Employer</th>
                          <th>Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {epfData.map((item, index) => (
                          <tr key={index}>
                            <td>{item.employeeId || 'N/A'}</td>
                            <td>{item.employeeName || 'N/A'}</td>
                            <td>{item.role || 'N/A'}</td>
                            <td>Rs. {(item.basicSalary || 0).toLocaleString()}</td>
                            <td>Rs. {(item.Employee || 0).toLocaleString()}</td>
                            <td>Rs. {(item.Employer || 0).toLocaleString()}</td>
                            <td>Rs. {((item.Employee || 0) + (item.Employer || 0)).toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="mt-4 p-3 bg-light rounded">
                    <h5>Summary</h5>
                    <p><strong>Total Records:</strong> {epfData.length}</p>
                    <p><strong>Total Employer Contribution:</strong> Rs. {totalEmployer.toLocaleString()}</p>
                    <p><strong>Total Employee Contribution:</strong> Rs. {epfData.reduce((sum, item) => sum + (item.Employee || 0), 0).toLocaleString()}</p>
                    <p><strong>Grand Total EPF:</strong> Rs. {(totalEmployer + epfData.reduce((sum, item) => sum + (item.Employee || 0), 0)).toLocaleString()}</p>
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
};

export default EpfPaymnetsDes;