import React, { useState } from 'react';

function NavBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

  const toggleMobile = () => setIsOpen(!isOpen);
  
  const toggleDropdown = (dropdown) => {
    setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
  };

  const navStyle = {
    background: 'linear-gradient(90deg, #1a1a2e 0%, #16213e 50%, #1a1a2e 100%)',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
    padding: '0',
    margin: '0',
    fontFamily: 'system-ui, -apple-system, sans-serif'
  };

  const containerStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 20px'
  };

  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '70px'
  };

  const logoContainerStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    textDecoration: 'none'
  };

  const logoIconStyle = {
    width: '45px',
    height: '45px',
    background: 'linear-gradient(135deg, #ef4444 0%, #ec4899 100%)',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 15px rgba(239, 68, 68, 0.3)',
    color: 'white',
    fontSize: '20px',
    fontWeight: 'bold'
  };

  const logoTextStyle = {
    fontSize: '28px',
    fontWeight: 'bold',
    background: 'linear-gradient(90deg, #ef4444 0%, #ec4899 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text'
  };

  const desktopNavStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    '@media (max-width: 768px)': {
      display: 'none'
    }
  };

  const navLinkStyle = {
    color: '#ffffff',
    textDecoration: 'none',
    padding: '10px 15px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    border: 'none',
    background: 'none',
    display: 'flex',
    alignItems: 'center',
    gap: '5px'
  };

  const mobileButtonStyle = {
    display: 'none',
    color: '#ffffff',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '8px',
    borderRadius: '6px',
    '@media (max-width: 768px)': {
      display: 'block'
    }
  };

  const dropdownStyle = {
    position: 'absolute',
    right: '0',
    top: '100%',
    marginTop: '8px',
    width: '250px',
    background: 'rgba(30, 30, 30, 0.95)',
    borderRadius: '12px',
    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.4)',
    border: '1px solid rgba(55, 65, 81, 0.5)',
    zIndex: '50',
    padding: '8px'
  };

  const dropdownLinkStyle = {
    display: 'block',
    padding: '12px 16px',
    fontSize: '14px',
    color: '#d1d5db',
    textDecoration: 'none',
    borderRadius: '8px',
    transition: 'all 0.2s ease'
  };

  const mobileMenuStyle = {
    background: 'rgba(17, 24, 39, 0.95)',
    borderTop: '1px solid rgba(55, 65, 81, 0.5)',
    padding: '16px 8px',
    maxHeight: '400px',
    overflowY: 'auto'
  };

  const mobileLinkStyle = {
    display: 'block',
    padding: '12px 16px',
    fontSize: '16px',
    color: '#ffffff',
    textDecoration: 'none',
    borderRadius: '8px',
    transition: 'all 0.2s ease',
    marginBottom: '4px'
  };

  return (
    <nav style={navStyle}>
      <div style={containerStyle}>
        <div style={headerStyle}>
          {/* Logo */}
          <a href="#" style={logoContainerStyle}>
          
          </a>

          {/* Desktop Navigation */}
          <div style={{...desktopNavStyle, display: window.innerWidth >= 768 ? 'flex' : 'none'}}>
            <a href="#" style={navLinkStyle} 
               onMouseEnter={(e) => {e.target.style.color = '#ef4444'; e.target.style.backgroundColor = 'rgba(255,255,255,0.1)'}}
               onMouseLeave={(e) => {e.target.style.color = '#ffffff'; e.target.style.backgroundColor = 'transparent'}}>
              Home
            </a>
            <a href="/HolidayHandle-Admin" style={navLinkStyle}
               onMouseEnter={(e) => {e.target.style.color = '#ef4444'; e.target.style.backgroundColor = 'rgba(255,255,255,0.1)'}}
               onMouseLeave={(e) => {e.target.style.color = '#ffffff'; e.target.style.backgroundColor = 'transparent'}}>
              Full Leave
            </a>
            <a href="/EmpRegister" style={navLinkStyle}
               onMouseEnter={(e) => {e.target.style.color = '#ef4444'; e.target.style.backgroundColor = 'rgba(255,255,255,0.1)'}}
               onMouseLeave={(e) => {e.target.style.color = '#ffffff'; e.target.style.backgroundColor = 'transparent'}}>
              Employee Registration
            </a>
            <a href="/MonthlyMidSalary" style={navLinkStyle}
               onMouseEnter={(e) => {e.target.style.color = '#ef4444'; e.target.style.backgroundColor = 'rgba(255,255,255,0.1)'}}
               onMouseLeave={(e) => {e.target.style.color = '#ffffff'; e.target.style.backgroundColor = 'transparent'}}>
              Halfday Request
            </a>
            <a href="/AdvancePayment" style={navLinkStyle}
               onMouseEnter={(e) => {e.target.style.color = '#ef4444'; e.target.style.backgroundColor = 'rgba(255,255,255,0.1)'}}
               onMouseLeave={(e) => {e.target.style.color = '#ffffff'; e.target.style.backgroundColor = 'transparent'}}>
              Advance Payment
            </a>
            <a href="/UserManagement" style={navLinkStyle}
               onMouseEnter={(e) => {e.target.style.color = '#ef4444'; e.target.style.backgroundColor = 'rgba(255,255,255,0.1)'}}
               onMouseLeave={(e) => {e.target.style.color = '#ffffff'; e.target.style.backgroundColor = 'transparent'}}>
              Edit Details
            </a>
            <a href="/HalfDayRequests" style={navLinkStyle}
               onMouseEnter={(e) => {e.target.style.color = '#ef4444'; e.target.style.backgroundColor = 'rgba(255,255,255,0.1)'}}
               onMouseLeave={(e) => {e.target.style.color = '#ffffff'; e.target.style.backgroundColor = 'transparent'}}>
              Half Day
            </a>
            <a href="/BarcodeData" style={navLinkStyle}
               onMouseEnter={(e) => {e.target.style.color = '#ef4444'; e.target.style.backgroundColor = 'rgba(255,255,255,0.1)'}}
               onMouseLeave={(e) => {e.target.style.color = '#ffffff'; e.target.style.backgroundColor = 'transparent'}}>
              Attendance
            </a>
            <a href="/AllowanceHandle" style={navLinkStyle}
               onMouseEnter={(e) => {e.target.style.color = '#ef4444'; e.target.style.backgroundColor = 'rgba(255,255,255,0.1)'}}
               onMouseLeave={(e) => {e.target.style.color = '#ffffff'; e.target.style.backgroundColor = 'transparent'}}>
              Allowances
            </a>

                <a href="/ETF_Payment" style={navLinkStyle}
               onMouseEnter={(e) => {e.target.style.color = '#ef4444'; e.target.style.backgroundColor = 'rgba(255,255,255,0.1)'}}
               onMouseLeave={(e) => {e.target.style.color = '#ffffff'; e.target.style.backgroundColor = 'transparent'}}>
              ETF payment
            </a>


            <a href="/ServiceChargeHandle" style={navLinkStyle}
               onMouseEnter={(e) => {e.target.style.color = '#ef4444'; e.target.style.backgroundColor = 'rgba(255,255,255,0.1)'}}
               onMouseLeave={(e) => {e.target.style.color = '#ffffff'; e.target.style.backgroundColor = 'transparent'}}>
              ServiceCharge
            </a>

            <a href="/EpfApplication" style={navLinkStyle}
               onMouseEnter={(e) => {e.target.style.color = '#ef4444'; e.target.style.backgroundColor = 'rgba(255,255,255,0.1)'}}
               onMouseLeave={(e) => {e.target.style.color = '#ffffff'; e.target.style.backgroundColor = 'transparent'}}>
              EPF/ETF
            </a>

            {/* Requests Dropdown */}
            <div style={{position: 'relative'}}>
              <button
                onClick={() => toggleDropdown('requests')}
                style={navLinkStyle}
                onMouseEnter={(e) => {e.target.style.color = '#ef4444'; e.target.style.backgroundColor = 'rgba(255,255,255,0.1)'}}
                onMouseLeave={(e) => {e.target.style.color = '#ffffff'; e.target.style.backgroundColor = 'transparent'}}
              >
                <span>Requests</span>
                <svg style={{width: '16px', height: '16px', transform: activeDropdown === 'requests' ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {activeDropdown === 'requests' && (
                <div style={dropdownStyle}>
                  <a href="/HolidayRequest" style={dropdownLinkStyle}
                     onMouseEnter={(e) => {e.target.style.color = '#ffffff'; e.target.style.backgroundColor = 'rgba(239, 68, 68, 0.2)'}}
                     onMouseLeave={(e) => {e.target.style.color = '#d1d5db'; e.target.style.backgroundColor = 'transparent'}}>
                    Full Leave Request
                  </a>
                  <a href="/HalfDayForm" style={dropdownLinkStyle}
                     onMouseEnter={(e) => {e.target.style.color = '#ffffff'; e.target.style.backgroundColor = 'rgba(239, 68, 68, 0.2)'}}
                     onMouseLeave={(e) => {e.target.style.color = '#d1d5db'; e.target.style.backgroundColor = 'transparent'}}>
                    HalfDay Request
                  </a>
                </div>

                
              )}
            </div>

            {/* Reports Dropdown */}
            <div style={{position: 'relative'}}>
              <button
                onClick={() => toggleDropdown('reports')}
                style={navLinkStyle}
                onMouseEnter={(e) => {e.target.style.color = '#ef4444'; e.target.style.backgroundColor = 'rgba(255,255,255,0.1)'}}
                onMouseLeave={(e) => {e.target.style.color = '#ffffff'; e.target.style.backgroundColor = 'transparent'}}
              >
                <span>Reports</span>
                <svg style={{width: '16px', height: '16px', transform: activeDropdown === 'reports' ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {activeDropdown === 'reports' && (
                <div style={{...dropdownStyle, width: '280px'}}>
                  <a href="/HighestAndLowestdata" style={dropdownLinkStyle}
                     onMouseEnter={(e) => {e.target.style.color = '#ffffff'; e.target.style.backgroundColor = 'rgba(239, 68, 68, 0.2)'}}
                     onMouseLeave={(e) => {e.target.style.color = '#d1d5db'; e.target.style.backgroundColor = 'transparent'}}>
                    Attendance Summary
                  </a>
                  <a href="/ReportLeaveDataShow" style={dropdownLinkStyle}
                     onMouseEnter={(e) => {e.target.style.color = '#ffffff'; e.target.style.backgroundColor = 'rgba(239, 68, 68, 0.2)'}}
                     onMouseLeave={(e) => {e.target.style.color = '#d1d5db'; e.target.style.backgroundColor = 'transparent'}}>
                    Approved Leave
                  </a>
                  <a href="/LeaveNotAproved" style={dropdownLinkStyle}
                     onMouseEnter={(e) => {e.target.style.color = '#ffffff'; e.target.style.backgroundColor = 'rgba(239, 68, 68, 0.2)'}}
                     onMouseLeave={(e) => {e.target.style.color = '#d1d5db'; e.target.style.backgroundColor = 'transparent'}}>
                    Unapproved Leave
                  </a>
                  <a href="/HalfDayComparision" style={dropdownLinkStyle}
                     onMouseEnter={(e) => {e.target.style.color = '#ffffff'; e.target.style.backgroundColor = 'rgba(239, 68, 68, 0.2)'}}
                     onMouseLeave={(e) => {e.target.style.color = '#d1d5db'; e.target.style.backgroundColor = 'transparent'}}>
                    Approved Half Day
                  </a>
                  <a href="/NotApprovedHalfDayComparision" style={dropdownLinkStyle}
                     onMouseEnter={(e) => {e.target.style.color = '#ffffff'; e.target.style.backgroundColor = 'rgba(239, 68, 68, 0.2)'}}
                     onMouseLeave={(e) => {e.target.style.color = '#d1d5db'; e.target.style.backgroundColor = 'transparent'}}>
                    Unapproved Half Day
                  </a>
                  <hr style={{margin: '8px 0', border: 'none', borderTop: '1px solid #374151'}} />
                  <a href="#" style={dropdownLinkStyle}
                     onMouseEnter={(e) => {e.target.style.color = '#ffffff'; e.target.style.backgroundColor = 'rgba(239, 68, 68, 0.2)'}}
                     onMouseLeave={(e) => {e.target.style.color = '#d1d5db'; e.target.style.backgroundColor = 'transparent'}}>
                    Advance Report
                  </a>
                  <a href="#" style={dropdownLinkStyle}
                     onMouseEnter={(e) => {e.target.style.color = '#ffffff'; e.target.style.backgroundColor = 'rgba(239, 68, 68, 0.2)'}}
                     onMouseLeave={(e) => {e.target.style.color = '#d1d5db'; e.target.style.backgroundColor = 'transparent'}}>
                    EPF Report
                  </a>
                  <a href="#" style={dropdownLinkStyle}
                     onMouseEnter={(e) => {e.target.style.color = '#ffffff'; e.target.style.backgroundColor = 'rgba(239, 68, 68, 0.2)'}}
                     onMouseLeave={(e) => {e.target.style.color = '#d1d5db'; e.target.style.backgroundColor = 'transparent'}}>
                    ETF Report
                  </a>
                  <a href="/AdminAllUsersSalData" style={dropdownLinkStyle}
                     onMouseEnter={(e) => {e.target.style.color = '#ffffff'; e.target.style.backgroundColor = 'rgba(239, 68, 68, 0.2)'}}
                     onMouseLeave={(e) => {e.target.style.color = '#d1d5db'; e.target.style.backgroundColor = 'transparent'}}>
                    Monthly Payslips
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={toggleMobile}
            style={{...mobileButtonStyle, display: window.innerWidth < 768 ? 'block' : 'none'}}
          >
            <svg style={{height: '24px', width: '24px'}} stroke="currentColor" fill="none" viewBox="0 0 24 24">
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && window.innerWidth < 768 && (
        <div style={mobileMenuStyle}>
          <a href="#" style={mobileLinkStyle}
             onMouseEnter={(e) => {e.target.style.color = '#ef4444'; e.target.style.backgroundColor = 'rgba(255,255,255,0.1)'}}
             onMouseLeave={(e) => {e.target.style.color = '#ffffff'; e.target.style.backgroundColor = 'transparent'}}>
            Home
          </a>
          <a href="/HolidayHandle-Admin" style={mobileLinkStyle}
             onMouseEnter={(e) => {e.target.style.color = '#ef4444'; e.target.style.backgroundColor = 'rgba(255,255,255,0.1)'}}
             onMouseLeave={(e) => {e.target.style.color = '#ffffff'; e.target.style.backgroundColor = 'transparent'}}>
            Full Leave
          </a>
          <a href="/EmpRegister" style={mobileLinkStyle}
             onMouseEnter={(e) => {e.target.style.color = '#ef4444'; e.target.style.backgroundColor = 'rgba(255,255,255,0.1)'}}
             onMouseLeave={(e) => {e.target.style.color = '#ffffff'; e.target.style.backgroundColor = 'transparent'}}>
            Employee Registration
          </a>
          <a href="/MonthlyMidSalary" style={mobileLinkStyle}
             onMouseEnter={(e) => {e.target.style.color = '#ef4444'; e.target.style.backgroundColor = 'rgba(255,255,255,0.1)'}}
             onMouseLeave={(e) => {e.target.style.color = '#ffffff'; e.target.style.backgroundColor = 'transparent'}}>
            Halfday Request
          </a>
          <a href="/AdvancePayment" style={mobileLinkStyle}
             onMouseEnter={(e) => {e.target.style.color = '#ef4444'; e.target.style.backgroundColor = 'rgba(255,255,255,0.1)'}}
             onMouseLeave={(e) => {e.target.style.color = '#ffffff'; e.target.style.backgroundColor = 'transparent'}}>
            Advance Payment
          </a>
          <a href="/UserManagement" style={mobileLinkStyle}
             onMouseEnter={(e) => {e.target.style.color = '#ef4444'; e.target.style.backgroundColor = 'rgba(255,255,255,0.1)'}}
             onMouseLeave={(e) => {e.target.style.color = '#ffffff'; e.target.style.backgroundColor = 'transparent'}}>
            Edit Details
          </a>
          <a href="/HalfDayRequests" style={mobileLinkStyle}
             onMouseEnter={(e) => {e.target.style.color = '#ef4444'; e.target.style.backgroundColor = 'rgba(255,255,255,0.1)'}}
             onMouseLeave={(e) => {e.target.style.color = '#ffffff'; e.target.style.backgroundColor = 'transparent'}}>
            Half Day
          </a>
          <a href="/BarcodeData" style={mobileLinkStyle}
             onMouseEnter={(e) => {e.target.style.color = '#ef4444'; e.target.style.backgroundColor = 'rgba(255,255,255,0.1)'}}
             onMouseLeave={(e) => {e.target.style.color = '#ffffff'; e.target.style.backgroundColor = 'transparent'}}>
            Attendance
          </a>
          <a href="/AllUsersSallaryHandle" style={mobileLinkStyle}
             onMouseEnter={(e) => {e.target.style.color = '#ef4444'; e.target.style.backgroundColor = 'rgba(255,255,255,0.1)'}}
             onMouseLeave={(e) => {e.target.style.color = '#ffffff'; e.target.style.backgroundColor = 'transparent'}}>
            Allowance
          </a>

          <a href="/AllUsersSallaryHandle" style={mobileLinkStyle}
             onMouseEnter={(e) => {e.target.style.color = '#ef4444'; e.target.style.backgroundColor = 'rgba(255,255,255,0.1)'}}
             onMouseLeave={(e) => {e.target.style.color = '#ffffff'; e.target.style.backgroundColor = 'transparent'}}>
            ServiceCharge
          </a>

          <a href="/EpfApplication" style={mobileLinkStyle}
             onMouseEnter={(e) => {e.target.style.color = '#ef4444'; e.target.style.backgroundColor = 'rgba(255,255,255,0.1)'}}
             onMouseLeave={(e) => {e.target.style.color = '#ffffff'; e.target.style.backgroundColor = 'transparent'}}>
            EPF/ETF
          </a>

          {/* Mobile Requests Section */}
          <div style={{paddingTop: '16px'}}>
            <div style={{color: '#ef4444', fontWeight: '600', padding: '0 16px 8px', fontSize: '14px'}}>Requests</div>
            <a href="/HolidayRequest" style={{...mobileLinkStyle, paddingLeft: '32px'}}
               onMouseEnter={(e) => {e.target.style.color = '#ef4444'; e.target.style.backgroundColor = 'rgba(255,255,255,0.1)'}}
               onMouseLeave={(e) => {e.target.style.color = '#ffffff'; e.target.style.backgroundColor = 'transparent'}}>
              Full Leave Request
            </a>
            <a href="/HalfDayForm" style={{...mobileLinkStyle, paddingLeft: '32px'}}
               onMouseEnter={(e) => {e.target.style.color = '#ef4444'; e.target.style.backgroundColor = 'rgba(255,255,255,0.1)'}}
               onMouseLeave={(e) => {e.target.style.color = '#ffffff'; e.target.style.backgroundColor = 'transparent'}}>
              HalfDay Request
            </a>
          </div>

          {/* Mobile Reports Section */}
          <div style={{paddingTop: '16px'}}>
            <div style={{color: '#ef4444', fontWeight: '600', padding: '0 16px 8px', fontSize: '14px'}}>Reports</div>
            <a href="/HighestAndLowestdata" style={{...mobileLinkStyle, paddingLeft: '32px'}}
               onMouseEnter={(e) => {e.target.style.color = '#ef4444'; e.target.style.backgroundColor = 'rgba(255,255,255,0.1)'}}
               onMouseLeave={(e) => {e.target.style.color = '#ffffff'; e.target.style.backgroundColor = 'transparent'}}>
              Attendance Summary
            </a>
            <a href="/ReportLeaveDataShow" style={{...mobileLinkStyle, paddingLeft: '32px'}}
               onMouseEnter={(e) => {e.target.style.color = '#ef4444'; e.target.style.backgroundColor = 'rgba(255,255,255,0.1)'}}
               onMouseLeave={(e) => {e.target.style.color = '#ffffff'; e.target.style.backgroundColor = 'transparent'}}>
              Approved Leave
            </a>
            <a href="/LeaveNotAproved" style={{...mobileLinkStyle, paddingLeft: '32px'}}
               onMouseEnter={(e) => {e.target.style.color = '#ef4444'; e.target.style.backgroundColor = 'rgba(255,255,255,0.1)'}}
               onMouseLeave={(e) => {e.target.style.color = '#ffffff'; e.target.style.backgroundColor = 'transparent'}}>
              Unapproved Leave
            </a>
            <a href="/HalfDayComparision" style={{...mobileLinkStyle, paddingLeft: '32px'}}
               onMouseEnter={(e) => {e.target.style.color = '#ef4444'; e.target.style.backgroundColor = 'rgba(255,255,255,0.1)'}}
               onMouseLeave={(e) => {e.target.style.color = '#ffffff'; e.target.style.backgroundColor = 'transparent'}}>
              Approved Half Day
            </a>
            <a href="/NotApprovedHalfDayComparision" style={{...mobileLinkStyle, paddingLeft: '32px'}}
               onMouseEnter={(e) => {e.target.style.color = '#ef4444'; e.target.style.backgroundColor = 'rgba(255,255,255,0.1)'}}
               onMouseLeave={(e) => {e.target.style.color = '#ffffff'; e.target.style.backgroundColor = 'transparent'}}>
              Unapproved Half Day
            </a>
            <a href="#" style={{...mobileLinkStyle, paddingLeft: '32px'}}
               onMouseEnter={(e) => {e.target.style.color = '#ef4444'; e.target.style.backgroundColor = 'rgba(255,255,255,0.1)'}}
               onMouseLeave={(e) => {e.target.style.color = '#ffffff'; e.target.style.backgroundColor = 'transparent'}}>
              Advance Report
            </a>
            <a href="#" style={{...mobileLinkStyle, paddingLeft: '32px'}}
               onMouseEnter={(e) => {e.target.style.color = '#ef4444'; e.target.style.backgroundColor = 'rgba(255,255,255,0.1)'}}
               onMouseLeave={(e) => {e.target.style.color = '#ffffff'; e.target.style.backgroundColor = 'transparent'}}>
              EPF Report
            </a>
            <a href="#" style={{...mobileLinkStyle, paddingLeft: '32px'}}
               onMouseEnter={(e) => {e.target.style.color = '#ef4444'; e.target.style.backgroundColor = 'rgba(255,255,255,0.1)'}}
               onMouseLeave={(e) => {e.target.style.color = '#ffffff'; e.target.style.backgroundColor = 'transparent'}}>
              ETF Report
            </a>
            <a href="/AdminAllUsersSalData" style={{...mobileLinkStyle, paddingLeft: '32px'}}
               onMouseEnter={(e) => {e.target.style.color = '#ef4444'; e.target.style.backgroundColor = 'rgba(255,255,255,0.1)'}}
               onMouseLeave={(e) => {e.target.style.color = '#ffffff'; e.target.style.backgroundColor = 'transparent'}}>
              Monthly Payslips
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}

export default NavBar;