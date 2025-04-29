import React, { createContext, useState } from 'react';

// Create a context for authentication
export const UserContext = createContext();

// Create a provider component
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null); // State to hold user information

const login = (userData, token) => {
    // Clear any existing token first
    localStorage.removeItem("userToken");
    
    // Store the new token with signupType
    localStorage.setItem("userToken", token);
    
    // Verify required userData fields exist
    if (!userData || !userData.signupType) {
      throw new Error("Invalid user data: signupType is required");
    }

    // Set user data including signupType and institute name
    setUser({ 
      ...userData, 
      token,
      signupType: userData.signupType,
      isInstitute: userData.signupType === 'institute',
      instituteName: userData.signupType === 'institute' ? userData.name : null
    });

  };

  const logout = () => {
    localStorage.removeItem("userToken"); // Remove token on logout
    setUser(null); // Clear user data on logout

  };

  // Helper to verify institute access
  const verifyInstituteAccess = async () => {
    // Check token presence
    const token = localStorage.getItem("userToken");
    if (!token) {
      throw new Error('No authentication token found');
    }

    // Verify token structure
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const now = Math.floor(Date.now() / 1000);
      
      // Check expiration
      if (payload.exp < now) {
        throw new Error('Token expired');
      }
    } catch (e) {
      logout();
      throw new Error('Invalid token');
    }

    // Check user type
    if (!user || user.signupType !== 'institute') {
      throw new Error('This action requires institute credentials');
    }
    
    return true;
  };

  // Add method to check auth state with auto-refresh
  const isAuthenticated = async () => {
    const token = localStorage.getItem("userToken");
    if (!token) return false;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const now = Math.floor(Date.now() / 1000);
      
      // If token is still valid
      if (payload.exp > now) return true;
      
      // If token expired but can be refreshed
      try {
        const response = await fetch('http://localhost:5000/api/auth/refresh', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          login(data.user, data.token);
          return true;
        }
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
      }
      
      return false;
    } catch {
      return false;
    }
  };

  return (
    <UserContext.Provider value={{ 
      user, 
      login, 
      logout,
      verifyInstituteAccess,
      isAuthenticated 
    }}>
      {children}
    </UserContext.Provider>
  );
};
