import React, { useState, useEffect } from 'react';

function NavBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  // Handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) {
        setIsOpen(false);
        setActiveDropdown(null);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.dropdown-container')) {
        setIsOpen(false);
        setActiveDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleMobile = () => setIsOpen(!isOpen);
  const toggleDropdown = (dropdown) => {
    setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
  };

  const navStyle = {
    background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.8)',
    padding: '0',
    fontFamily: '"Inter", system-ui, -apple-system, sans-serif',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    backdropFilter: 'blur(20px)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
  };

  const containerStyle = {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '0 20px',
  };

  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '80px',
  };

  const logoContainerStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    textDecoration: 'none',
    transition: 'transform 0.3s ease',
  };

  const logoIconStyle = {
    width: '50px',
    height: '50px',
    background: 'linear-gradient(135deg, #ef4444 0%, #ec4899 100%)',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 6px 20px rgba(239, 68, 68, 0.4)',
    color: '#ffffff',
    fontSize: '24px',
    fontWeight: '700',
    transition: 'all 0.3s ease',
  };

  const logoTextStyle = {
    fontSize: '30px',
    fontWeight: '800',
    background: 'linear-gradient(90deg, #ef4444 0%, #ec4899 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    letterSpacing: '-0.5px',
  };

  const hamburgerStyle = {
    color: '#ffffff',
    background: 'rgba(255, 255, 255, 0.1)',
    border: 'none',
    cursor: 'pointer',
    padding: '10px',
    borderRadius: '8px',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const dropdownStyle = {
    position: 'absolute',
    right: '0',
    top: '100%',
    marginTop: '8px',
    width: '300px',
    background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 100%)',
    borderRadius: '12px',
    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.5)',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    zIndex: '1000',
    padding: '10px',
    backdropFilter: 'blur(12px)',
    maxHeight: '80vh',
    overflowY: 'auto',
    opacity: isOpen ? 1 : 0,
    transform: isOpen ? 'translateY(0)' : 'translateY(-10px)',
    transition: 'all 0.3s ease',
  };

  const navLinkStyle = {
    color: '#e2e8f0',
    textDecoration: 'none',
    padding: '12px 16px',
    borderRadius: '8px',
    fontSize: '15px',
    fontWeight: '600',
    transition: 'all 0.3s ease',
    background: 'rgba(255, 255, 255, 0.06)',
    margin: '4px 0',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    whiteSpace: 'nowrap',
  };

  const dropdownButtonStyle = {
    ...navLinkStyle,
    cursor: 'pointer',
    background: 'rgba(239, 68, 68, 0.1)',
    border: '1px solid rgba(239, 68, 68, 0.2)',
    width: '100%',
    textAlign: 'left',
  };

  const subDropdownStyle = {
    marginLeft: '20px',
    paddingTop: '8px',
  };

  return (
    <nav style={navStyle}>
      <div style={containerStyle}>
        <div style={headerStyle}>
          {/* Logo */}
          <a
            href="#"
            style={logoContainerStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
              const icon = e.currentTarget.querySelector('div');
              if (icon) icon.style.transform = 'rotate(5deg)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              const icon = e.currentTarget.querySelector('div');
              if (icon) icon.style.transform = 'rotate(0deg)';
            }}
          >
            <div style={logoIconStyle}>HR</div>
            <span style={logoTextStyle}>THE KARNIVORE</span>
          </a>

          {/* Hamburger Menu Button */}
          <button
            onClick={toggleMobile}
            style={hamburgerStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)';
              e.currentTarget.style.transform = 'scale(1.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            <svg style={{ height: '24px', width: '24px' }} stroke="currentColor" fill="none" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>

        {/* Dropdown Menu */}
        {isOpen && (
          <div style={dropdownStyle} className="dropdown-container">
            {/* Main Navigation Items */}
            {[
              { href: '/EmployeeHomePage', label: 'Home' },
              { href: '/BarcodeData', label: 'Attendece Read' },
              { href: '/HolidayHandle-Admin', label: 'Full Leave' },
              { href: '/EmpRegister', label: 'Employee Registration' },
              { href: '/MonthlyMidSalary', label: 'Advance Payment Handle' },
              { href: '/AdvancePayment', label: 'Advance Payment' },
              { href: '/UserManagement', label: 'Edit Details' },
              { href: '/HalfDayRequests', label: 'Half Day' },
              { href: '/AllowanceHandle', label: 'Allowances' },
              { href: '/ETF_Payment', label: 'ETF Payment' },
              { href: '/ServiceChargeHandle', label: 'Service Charge' },
              { href: '/AllEmployeesIdData', label: 'Employee ID' },
              { href: '/EpfPayment', label: 'EPF Payment' },
              { href: '/', label: 'Logout' }, 
            ].map(item => (
              <a
                key={item.href}
                href={item.href}
                style={navLinkStyle}
                target={item.target || undefined}
                rel={item.rel || undefined}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(239, 68, 68, 0.3)';
                  e.currentTarget.style.color = '#f87171';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
                  e.currentTarget.style.color = '#e2e8f0';
                }}
              >
                {item.label}
              </a>
            ))}

            {/* Requests Dropdown */}
            <div style={{ position: 'relative' }} className="dropdown-container">
              <button
                onClick={() => toggleDropdown('requests')}
                style={dropdownButtonStyle}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(239, 68, 68, 0.4)';
                  e.currentTarget.style.color = '#f87171';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
                  e.currentTarget.style.color = '#e2e8f0';
                }}
              >
                <span>Requests</span>
                <svg
                  style={{
                    width: '16px',
                    height: '16px',
                    transform: activeDropdown === 'requests' ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.3s ease',
                  }}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {activeDropdown === 'requests' && (
                <div style={subDropdownStyle}>
                  {[
                    { href: '/HolidayRequest', label: 'Full Leave Request' },
                    { href: '/HalfDayForm', label: 'Half Day Request' },
                    { href: '/MidleSalRequest', label: 'Advance Payment Request' },
                  ].map(item => (
                    <a
                      key={item.href}
                      href={item.href}
                      style={navLinkStyle}
                      target={item.target || undefined}
                      rel={item.rel || undefined}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(239, 68, 68, 0.3)';
                        e.currentTarget.style.color = '#f87171';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
                        e.currentTarget.style.color = '#e2e8f0';
                      }}
                    >
                      {item.label}
                    </a>
                  ))}
                </div>
              )}
            </div>

            {/* Reports Dropdown */}
            <div style={{ position: 'relative' }} className="dropdown-container">
              <button
                onClick={() => toggleDropdown('reports')}
                style={dropdownButtonStyle}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(239, 68, 68, 0.4)';
                  e.currentTarget.style.color = '#f87171';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
                  e.currentTarget.style.color = '#e2e8f0';
                }}
              >
                <span>Reports</span>
                <svg
                  style={{
                    width: '16px',
                    height: '16px',
                    transform: activeDropdown === 'reports' ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.3s ease',
                  }}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {activeDropdown === 'reports' && (
                <div style={subDropdownStyle}>
                  {[
                    { href: '/HighestAndLowestdata', label: 'Attendance Summary' },
                    { href: '/ReportLeaveDataShow', label: 'Approved Leave' },
                    { href: '/LeaveNotAproved', label: 'Unapproved Leave' },
                    { href: '/HalfDayComparision', label: 'Approved Half Day' },
                    { href: '/NotApprovedHalfDayComparision', label: 'Unapproved Half Day' },
                    { href: '/AttendanceReport', label: 'Attendence Report' },
                    { href: '/EpfPaymnetsDes', label: 'EPF Report' },
                    { href: '/ETFPaymentsDes', label: 'ETF Report' },
                    { href: '/AdminAllUsersSalData', label: 'Monthly Payslips' },
                    { href: '/AllNetSalary', label: 'All Employees Salary Details' },
                    { href: '/LeaveSummery', label: 'Leave Summary' },
                    { href: '/AdancePaymentReport', label: 'Advance Payment Report' },
                  ].map(item => (
                    <a
                      key={item.href}
                      href={item.href}
                      style={navLinkStyle}
                      target={item.target || undefined}
                      rel={item.rel || undefined}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(239, 68, 68, 0.3)';
                        e.currentTarget.style.color = '#f87171';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
                        e.currentTarget.style.color = '#e2e8f0';
                      }}
                    >
                      {item.label}
                    </a>
                  ))}
                  <hr style={{ margin: '8px 0', border: 'none', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }} />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      <style jsx>{`
        @keyframes slideIn {
          from {
            transform: translateY(-20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        div[style*="maxHeight: 80vh"] {
          animation: slideIn 0.3s ease;
        }
      `}</style>
    </nav>
  );
}

export default NavBar;