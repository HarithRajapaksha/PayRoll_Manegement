import React, { useState, useEffect } from 'react';
import { User, Calendar, Clock, TrendingUp, Award, Briefcase, DollarSign, Star } from 'lucide-react';

function EmployeeHomePage() {
  const [holidayData, setHolidayData] = useState(null);
  const [employeeData, setEmployeeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasWaved, setHasWaved] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Simulate token and user data (since localStorage is not available)
  
  // JWT decode function
  const jwtDecode = (token) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      return JSON.parse(jsonPayload);
    } catch (e) {
      throw new Error('Invalid token');
    }
  };

  // API calls
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('No token found, please log in.');
      setLoading(false);
      return;
    }

    let userId;
    try {
      userId = jwtDecode(token);
    } catch (e) {
      setError('Invalid token format');
      setLoading(false);
      return;
    }

    const id = userId.id;
    console.log('Token:', token);
    console.log('User ID:', id);

    // Fetch holiday details
    console.log('Fetching holiday details for ID:', id);
    fetch(`http://localhost:3006/api/holiday/getHolidayDetails/${id}`, {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    })
      .then((response) => {
        console.log('Holiday API Status:', response.status);
        console.log('Holiday API Headers:', Object.fromEntries(response.headers.entries()));
        
        if (!response.ok) {
          if (response.status === 404) {
            return { message: 'No holiday details found for this user this month.' };
          }
          return response.text().then((text) => {
            throw new Error(`Failed to fetch holiday details: ${text || response.statusText} (Status: ${response.status})`);
          });
        }
        return response.json();
      })
      .then((data) => {
        console.log('Holiday API Response:', data);
        if (data.message === 'No holiday details found for this user this month.') {
          setHolidayData({ data: [], totalDays: 0, recordCount: 0 });
        } else {
          setHolidayData(data);
        }
      })
      .catch((err) => {
        console.error('Holiday API Error:', err);
        setHolidayData({ data: [], totalDays: 0, recordCount: 0 });
        setError(
          err.message.includes('404')
            ? 'Holiday details endpoint not found. Please verify the API URL (http://localhost:3006/api/holiday/getHolidayDetails/:id) or contact support.'
            : err.message
        );
      });

    // Fetch employee details
    console.log('Fetching employee details for ID:', id);
    fetch(`http://localhost:3006/api/holiday/getEmployeeDetails/${id}`, {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    })
      .then((response) => {
        console.log('Employee API Status:', response.status);
        console.log('Employee API Headers:', response);
        
        if (!response.ok) {
          return response.text().then((text) => {
            throw new Error(`Failed to fetch employee details: ${text || response.statusText} (Status: ${response.status})`);
          });
        }
        return response.json();
      })
      .then((data) => {
        console.log('Employee API Response:', data);
        setEmployeeData(data);
        setLoading(false);
        setHasWaved(true);
      })
      .catch((err) => {
        console.error('Employee API Error:', err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const totalHolidays = 7;
  const usedHolidays = holidayData?.totalDays || 0;
  const remainingHolidays = totalHolidays - usedHolidays;

  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1e3a8a 0%, #7c3aed 50%, #ec4899 100%)',
      position: 'relative',
      overflow: 'hidden',
      display: 'flex'
    },
    backgroundElement1: {
      position: 'absolute',
      top: '-10rem',
      right: '-10rem',
      width: '20rem',
      height: '20rem',
      background: '#8b5cf6',
      borderRadius: '50%',
      mixBlendMode: 'multiply',
      filter: 'blur(40px)',
      opacity: 0.7,
      animation: 'pulse 3s ease-in-out infinite'
    },
    backgroundElement2: {
      position: 'absolute',
      bottom: '-10rem',
      left: '-10rem',
      width: '20rem',
      height: '20rem',
      background: '#ec4899',
      borderRadius: '50%',
      mixBlendMode: 'multiply',
      filter: 'blur(40px)',
      opacity: 0.7,
      animation: 'pulse 3s ease-in-out infinite 2s'
    },
    backgroundElement3: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '15rem',
      height: '15rem',
      background: '#6366f1',
      borderRadius: '50%',
      mixBlendMode: 'multiply',
      filter: 'blur(40px)',
      opacity: 0.7,
      animation: 'pulse 3s ease-in-out infinite 4s'
    },
    leftSection: {
      width: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      position: 'relative',
      zIndex: 10
    },
    rightSection: {
      width: '50%',
      padding: '2rem',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      position: 'relative',
      zIndex: 10
    },
    welcomeContainer: {
      textAlign: 'center',
      maxWidth: '500px',
      color: 'white'
    },
    logo: {
      marginBottom: '2rem',
      transform: 'scale(1)',
      transition: 'transform 0.3s ease'
    },
    logoIcon: {
      width: '6rem',
      height: '6rem',
      background: 'linear-gradient(135deg, #a855f7, #ec4899)',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0 auto 1rem',
      boxShadow: '0 25px 50px rgba(0,0,0,0.3)'
    },
    logoTitle: {
      fontSize: '2.5rem',
      fontWeight: 'bold',
      marginBottom: '0.5rem'
    },
    logoSubtitle: {
      color: '#c4b5fd',
      fontSize: '1.1rem'
    },
    greetingSection: {
      marginBottom: '2rem'
    },
    greetingText: {
      fontSize: '3.5rem',
      fontWeight: 'bold',
      marginBottom: '1rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    waveEmoji: {
      marginLeft: '1rem',
      animation: hasWaved ? 'none' : 'bounce 1s infinite'
    },
    employeeName: {
      fontSize: '2rem',
      fontWeight: '600',
      color: '#c4b5fd',
      marginBottom: '0.5rem'
    },
    welcomeMessage: {
      color: '#d8b4fe',
      fontSize: '1.1rem'
    },
    timeCard: {
      background: 'rgba(255,255,255,0.1)',
      backdropFilter: 'blur(20px)',
      borderRadius: '1rem',
      padding: '1.5rem',
      border: '1px solid rgba(255,255,255,0.2)'
    },
    timeDisplay: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: '0.5rem'
    },
    timeText: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      marginLeft: '0.5rem'
    },
    dateText: {
      color: '#c4b5fd',
      fontSize: '0.9rem'
    },
    cardsContainer: {
      maxWidth: '400px',
      margin: '0 auto',
      width: '100%'
    },
    card: {
      background: 'rgba(255,255,255,0.1)',
      backdropFilter: 'blur(20px)',
      borderRadius: '1rem',
      padding: '1.5rem',
      border: '1px solid rgba(255,255,255,0.2)',
      marginBottom: '1.5rem',
      transform: 'scale(1)',
      transition: 'all 0.3s ease',
      color: 'white'
    },
    cardHeader: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '1rem'
    },
    cardIcon: {
      width: '3rem',
      height: '3rem',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: '1rem'
    },
    cardTitle: {
      fontSize: '1.5rem',
      fontWeight: 'bold'
    },
    profileDetails: {
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem'
    },
    profileRow: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    profileLabel: {
      color: '#c4b5fd'
    },
    profileValue: {
      fontWeight: '600'
    },
    salaryValue: {
      color: '#4ade80',
      fontWeight: 'bold'
    },
    holidayGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '1rem',
      marginBottom: '1.5rem'
    },
    holidayStat: {
      textAlign: 'center'
    },
    holidayNumber: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      marginBottom: '0.25rem'
    },
    holidayLabel: {
      color: '#c4b5fd',
      fontSize: '0.85rem'
    },
    progressSection: {
      marginBottom: '1rem'
    },
    progressHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      fontSize: '0.9rem',
      color: '#c4b5fd',
      marginBottom: '0.5rem'
    },
    progressBar: {
      width: '100%',
      height: '0.75rem',
      background: 'rgba(255,255,255,0.2)',
      borderRadius: '9999px',
      overflow: 'hidden'
    },
    progressFill: {
      height: '100%',
      background: 'linear-gradient(90deg, #ef4444, #ec4899)',
      transition: 'width 1s ease-out',
      borderRadius: '9999px'
    },
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: '1rem'
    },
    statBox: {
      textAlign: 'center',
      padding: '0.75rem',
      background: 'rgba(255,255,255,0.1)',
      borderRadius: '0.5rem'
    },
    statNumber: {
      fontSize: '1.25rem',
      fontWeight: 'bold',
      marginBottom: '0.25rem'
    },
    statLabel: {
      color: '#c4b5fd',
      fontSize: '0.85rem'
    },
    loadingContainer: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1e3a8a 0%, #7c3aed 50%, #ec4899 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    loadingContent: {
      textAlign: 'center',
      color: 'white'
    },
    spinner: {
      width: '4rem',
      height: '4rem',
      border: '4px solid white',
      borderTop: '4px solid transparent',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
      margin: '0 auto 1rem'
    },
    errorContainer: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #991b1b 0%, #be185d 50%, #ec4899 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    errorCard: {
      background: 'rgba(255,255,255,0.2)',
      backdropFilter: 'blur(20px)',
      borderRadius: '1rem',
      padding: '2rem',
      maxWidth: '400px',
      textAlign: 'center',
      color: 'white'
    },
    errorIcon: {
      fontSize: '4rem',
      marginBottom: '1rem'
    },
    errorTitle: {
      fontSize: '1.25rem',
      fontWeight: 'bold',
      marginBottom: '0.5rem'
    },
    errorMessage: {
      color: '#fca5a5'
    }
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loadingContent}>
          <div style={styles.spinner}></div>
          <p style={{fontSize: '1.25rem', fontWeight: '500'}}>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.errorContainer}>
        <div style={styles.errorCard}>
          <div style={styles.errorIcon}>⚠️</div>
          <h2 style={styles.errorTitle}>Oops! Something went wrong</h2>
          <p style={styles.errorMessage}>{error}</p>
        </div>
      </div>
    );
  }

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <div style={styles.container}>
      {/* Animated Background Elements */}
      <div style={styles.backgroundElement1}></div>
      <div style={styles.backgroundElement2}></div>
      <div style={styles.backgroundElement3}></div>

      {/* Left Side - Welcome Section */}
      <div style={styles.leftSection}>
        <div style={styles.welcomeContainer}>
          {/* Logo */}
          <div style={styles.logo}>
            <div style={styles.logoIcon}>
              <Star size={48} color="white" />
            </div>
            <h1 style={styles.logoTitle}>KARNIVORE RESTAURANT</h1>
            <p style={styles.logoSubtitle}>Your Gateway to Success</p>
          </div>

          {/* Greeting */}
          <div style={styles.greetingSection}>
            <h2 style={styles.greetingText}>
              {getGreeting()}
              <span style={styles.waveEmoji}>👋</span>
            </h2>
            <h3 style={styles.employeeName}>
              {employeeData?.name || 'Employee'}!
            </h3>
            <p style={styles.welcomeMessage}>Welcome back to your dashboard</p>
          </div>

          {/* Time and Date */}
          <div style={styles.timeCard}>
            <div style={styles.timeDisplay}>
              <Clock size={24} color="#c4b5fd" />
              <span style={styles.timeText}>{formatTime(currentTime)}</span>
            </div>
            <p style={styles.dateText}>{formatDate(currentTime)}</p>
          </div>
        </div>
      </div>

      {/* Right Side - Information Cards */}
      <div style={styles.rightSection}>
        <div style={styles.cardsContainer}>
          
          {/* Employee Details Card */}
          <div 
            style={styles.card}
            onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
            onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
          >
            <div style={styles.cardHeader}>
              <div style={{...styles.cardIcon, background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)'}}>
                <User size={24} color="white" />
              </div>
              <h3 style={styles.cardTitle}>Profile</h3>
            </div>
            
            <div style={styles.profileDetails}>
              <div style={styles.profileRow}>
                <span style={styles.profileLabel}>Employee ID</span>
                <span style={styles.profileValue}>{employeeData?.EmpId || 'N/A'}</span>
              </div>
              <div style={styles.profileRow}>
                <span style={styles.profileLabel}>Role</span>
                <span style={styles.profileValue}>{employeeData?.role || 'N/A'}</span>
              </div>
              <div style={styles.profileRow}>
                <span style={styles.profileLabel}>Date of Join</span>
                <span style={styles.salaryValue}>{employeeData.dateOfJoin}</span>
              </div>
            </div>
          </div>

          {/* Holiday Status Card */}
          <div 
            style={styles.card}
            onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
            onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
          >
            <div style={styles.cardHeader}>
              <div style={{...styles.cardIcon, background: 'linear-gradient(135deg, #10b981, #3b82f6)'}}>
                <Calendar size={24} color="white" />
              </div>
              <h3 style={styles.cardTitle}>Leave Status</h3>
            </div>
            
            <div style={styles.holidayGrid}>
              <div style={styles.holidayStat}>
                <div style={styles.holidayNumber}>{totalHolidays}</div>
                <div style={styles.holidayLabel}>Total</div>
              </div>
              <div style={styles.holidayStat}>
                <div style={{...styles.holidayNumber, color: '#f87171'}}>{usedHolidays}</div>
                <div style={styles.holidayLabel}>Used</div>
              </div>
              <div style={styles.holidayStat}>
                <div style={{...styles.holidayNumber, color: '#4ade80'}}>{remainingHolidays}</div>
                <div style={styles.holidayLabel}>Remaining</div>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div style={styles.progressSection}>
              <div style={styles.progressHeader}>
                <span>Holiday Usage</span>
                <span>{Math.round((usedHolidays / totalHolidays) * 100)}%</span>
              </div>
              <div style={styles.progressBar}>
                <div 
                  style={{
                    ...styles.progressFill,
                    width: `${(usedHolidays / totalHolidays) * 100}%`
                  }}
                ></div>
              </div>
            </div>
          </div>

          {/* Quick Stats Card */}
          <div 
            style={styles.card}
            onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
            onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
          >
            <div style={styles.cardHeader}>
              <div style={{...styles.cardIcon, background: 'linear-gradient(135deg, #f59e0b, #f97316)'}}>
                <TrendingUp size={24} color="white" />
              </div>
              <h3 style={styles.cardTitle}>Quick Stats</h3>
            </div>
            
            <div style={styles.statsGrid}>
              <div style={styles.statBox}>
                <div style={styles.statNumber}>98%</div>
                <div style={styles.statLabel}>Attendance</div>
              </div>
              <div style={styles.statBox}>
                <div style={styles.statNumber}>5.0</div>
                <div style={styles.statLabel}>Performance</div>
              </div>
            </div>
          </div>

        </div>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.7; }
          50% { opacity: 0.9; }
        }
        
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default EmployeeHomePage;