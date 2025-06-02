import { useMemo } from 'react';

export const useAuth = () => {
  const userStr = localStorage.getItem('user');
  const token = localStorage.getItem('token');

  const user = useMemo(() => {
    try {
      return userStr ? JSON.parse(userStr) : null;
    } catch {
      return null;
    }
  }, [userStr]);

  const isAuthenticated = !!user && !!token;

  const hasRole = (role) => {
    if (!user?.rol) return false;
    if (Array.isArray(role)) {
      return role.includes(user.rol);
    }
    return user.rol === role;
  };

  return {
    user,
    token,
    isAuthenticated,
    hasRole,
  };
};
