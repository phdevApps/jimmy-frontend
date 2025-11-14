
import { useEffect, useRef, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useTypedSelector } from './useTypedSelector';
import { validateSession, logout, fetchUserProfile } from '../features/auth/authSlice';
import { validateJWTToken } from '../services/wooCommerceApi';
import { AppDispatch } from '../store';

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, token, isAuthenticated, isLoading, error } = useTypedSelector(state => state.auth);
  const hasInitialized = useRef(false);
  const hasFetchedProfile = useRef(false);

  // Session validation on hook initialization - run only once
  useEffect(() => {
    if (!hasInitialized.current) {
      console.log('useAuth: Initial session validation', { user, token, isAuthenticated });
      dispatch(validateSession());
      hasInitialized.current = true;
    }
  }, [dispatch]);

  // Fetch user profile only when needed and token is available but user data is incomplete
  useEffect(() => {
    if (isAuthenticated && token && 
        (!user || !user.email || !user.first_name) && 
        !isLoading && !hasFetchedProfile.current) {
      console.log('useAuth: Fetching user profile with JWT token');
      hasFetchedProfile.current = true;
      dispatch(fetchUserProfile(token)).catch((error) => {
        console.error('useAuth: Failed to fetch user profile:', error);
        hasFetchedProfile.current = false; // Reset on error to allow retry
      });
    }
  }, [dispatch, isAuthenticated, token, user?.email, user?.first_name, isLoading]);

  // Reset profile fetch flag when user changes
  useEffect(() => {
    if (user && user.email) {
      hasFetchedProfile.current = false;
    }
  }, [user?.id]);

  // Check for token expiration using real JWT validation
  const isTokenExpired = useCallback(async (token: string): Promise<boolean> => {
    if (!token) return true;
    
    try {
      console.log('useAuth: Validating JWT token');
      const isValid = await validateJWTToken(token);
      return !isValid;
    } catch (error) {
      console.error('useAuth: Error validating token:', error);
      return true;
    }
  }, []);

  // Auto logout on token expiration - check only when token changes
  useEffect(() => {
    if (token && isAuthenticated) {
      isTokenExpired(token).then((expired) => {
        if (expired) {
          console.log('useAuth: Token expired, logging out');
          dispatch(logout());
        }
      });
    }
  }, [token, isAuthenticated, dispatch, isTokenExpired]);

  // Session utilities
  const refreshSession = useCallback(() => {
    if (token) {
      console.log('useAuth: Refreshing session');
      dispatch(fetchUserProfile(token));
    }
  }, [token, dispatch]);

  const clearSession = useCallback(() => {
    console.log('useAuth: Clearing session');
    dispatch(logout());
  }, [dispatch]);

  const isSessionValid = useCallback(async () => {
    if (!isAuthenticated || !user || !token) {
      return false;
    }
    
    const tokenValid = !(await isTokenExpired(token));
    console.log('useAuth: Session validity check:', { 
      valid: tokenValid, 
      isAuthenticated, 
      hasUser: !!user, 
      hasToken: !!token 
    });
    return tokenValid;
  }, [isAuthenticated, user, token, isTokenExpired]);

  return {
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    refreshSession,
    clearSession,
    isSessionValid,
  };
};
