// // frontend/src/contexts/AuthContext.js
// import React, { createContext, useState, useContext, useEffect } from 'react';
// import { authService } from '../services/api';

// const AuthContext = createContext();

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth must be used within AuthProvider');
//   }
//   return context;
// };

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     checkAuthStatus();
//   }, []);

//   const checkAuthStatus = async () => {
//     try {
//       const userData = await authService.getCurrentUser();
//       setUser(userData.user);
//     } catch (error) {
//       console.error('Auth check failed:', error);
//       setUser(null);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const login = async (email, password) => {
//     const response = await authService.login(email, password);
//     setUser(response.user);
//     return response;
//   };

//   const logout = async () => {
//     await authService.logout();
//     setUser(null);
//   };

//   const value = {
//     user,
//     login,
//     logout,
//     loading,
//     isAdmin: user && ['super_admin', 'admin'].includes(user.role)
//   };

//   return (
//     <AuthContext.Provider value={value}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// frontend/src/contexts/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const checkAuthStatus = async () => {
      try {
        // call getCurrentUser but opt-out of global 401 -> /login redirect
        const data = await authService.getCurrentUser({ headers: { 'x-skip-auth-redirect': '1' } });
        // API may return { success: true, user: {...} } or { success:false, message: '...' }
        if (!mounted) return;
        if (data && data.success) {
          // adapt if your API returns user directly: data.user or data.data
          setUser(data.user ?? data.data ?? null);
        } else {
          setUser(null);
        }
      } catch (error) {
        if (mounted) {
          // don't console spam — keep this small
          // console.error('Auth check failed:', error);
          setUser(null);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    checkAuthStatus();

    return () => { mounted = false; };
  }, []);

  const login = async (email, password) => {
    const response = await authService.login(email, password);
    // On successful login, API usually returns { success:true, user, token } etc.
    if (response?.success) {
      setUser(response.user ?? response.data ?? null);
      if (response.token) localStorage.setItem('token', response.token);
    }
    return response;
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (err) {
      // swallow logout errors
    } finally {
      setUser(null);
      localStorage.removeItem('token');
    }
  };

  const value = {
    user,
    login,
    logout,
    loading,
    isAdmin: !!(user && ['super_admin', 'admin'].includes(user.role))
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
