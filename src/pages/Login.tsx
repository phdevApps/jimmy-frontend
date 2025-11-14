
import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTypedSelector } from '../hooks/useTypedSelector';
import { loginUser, registerUser, clearError } from '../features/auth/authSlice';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { User, Mail, Lock, UserPlus, LogIn } from 'lucide-react';
import { toast } from '../components/ui/sonner';
import { AppDispatch } from '../store';

const Login = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { isAuthenticated, user, isLoading, error } = useTypedSelector(state => state.auth);
  
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    confirmPassword: ''
  });

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      console.log('Login: User authenticated, redirecting to dashboard');
      navigate('/dashboard');
    }
  }, [isAuthenticated, user, navigate]);

  // Clear error when component mounts or when switching between login/register
  useEffect(() => {
    dispatch(clearError());
  }, [dispatch, isLogin]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isLogin && formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      if (isLogin) {
        console.log('Login: Attempting login');
        await dispatch(loginUser({ 
          email: formData.email, 
          password: formData.password 
        })).unwrap();
      } else {
        console.log('Login: Attempting registration');
        await dispatch(registerUser({
          email: formData.email,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName,
        })).unwrap();
      }
      
      toast.success(`Successfully ${isLogin ? 'signed in' : 'registered'} as ${formData.email}`);

      // Clear form data
      setFormData({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        confirmPassword: ''
      });

      // Navigate to dashboard
      navigate('/dashboard');
    } catch (error) {
      console.error('Login: Authentication error:', error);
      toast.error(error || `${isLogin ? 'Authentication' : 'Registration'} failed. Please try again.`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <a href="/" className="inline-block mb-8">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 201.46 33.55"
              className="h-8 w-auto"
            >
              <defs>
                <style>
                  {`.st0 { fill: #003685; }`}
                </style>
              </defs>
              <rect className="st0" x="42.13" y=".06" width="6.32" height="33.43" rx=".36" ry=".36"/>
              <path className="st0" d="M100.91.06h-5.59c-.22,0-.43.1-.57.28l-15.49,19.61c-.22.28-.66.28-.88,0L62.89.33c-.14-.17-.35-.28-.57-.28h-5.59c-.2,0-.36.16-.36.36v32.7c0,.2.16.36.36.36h5.59c.2,0,.36-.16.36-.36,0-3.1,0-25.09,0-25.09l15.78,19.98c.18.23.52.23.7,0l15.78-19.98v25.09c0,.2.16.36.36.36h5.59c.2,0,.36-.16.36-.36V.42c0-.2-.16-.36-.36-.36Z"/>
              <path className="st0" d="M153.73.06h-5.59c-.22,0-.43.1-.57.28l-15.49,19.61c-.22.28-.66.28-.88,0L115.71.33c-.14-.17-.35-.28-.57-.28h-5.59c-.2,0-.36.16-.36.36v32.7c0,.2.16.36.36.36h5.59c.2,0,.36-.16.36-.36V8.03l15.78,19.98c.18.23.52.23.7,0l15.78-19.98v25.09c0,.2.16.36.36.36h5.59c.2,0,.36-.16.36-.36V.42c0-.2-.16-.36-.36-.36Z"/>
              <path className="st0" d="M201.1.06h-5.46c-.21,0-.41.09-.54.24l-14.52,16.44c-.21.24-.58.24-.78,0L165.28.3c-.14-.16-.34-.24-.54-.24h-5.46c-.31,0-.48.37-.27.6l16.32,18.47c1.1,1.25,1.71,2.85,1.71,4.51v9.48c0,.2.16.36.36.36h5.59c.2,0,.36-.16.36-.36v-9.48c0-1.66.61-3.27,1.71-4.51L201.37.66c.21-.23.04-.6-.27-.6Z"/>
              <path className="st0" d="M34.13,0h-6.28c-.2,0-.36.16-.36.36v24.8c0,.93-.37,1.82-1.02,2.48l-.34.34c-.66.66-1.56,1.04-2.49,1.04H4.06c-.32,0-.63.14-.85.39L.08,32.99c-.19.22-.04.56.25.56h26.84c1.54,0,3.02-.61,4.11-1.7l1.51-1.51c1.08-1.09,1.69-2.56,1.69-4.1V.36c0-.2-.16-.36-.36-.36Z"/>
            </svg>
          </a>
        </div>

        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center flex items-center justify-center gap-2">
              {isLogin ? <LogIn className="h-5 w-5" /> : <UserPlus className="h-5 w-5" />}
              {isLogin ? 'Sign In' : 'Create Account'}
            </CardTitle>
            <CardDescription className="text-center">
              {isLogin ? 'Sign in to your account' : 'Create a new account to get started'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      type="text"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required={!isLogin}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      type="text"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required={!isLogin}
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
              </div>

              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              )}

              {error && (
                <div className="text-red-600 text-sm text-center">
                  {error}
                </div>
              )}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')}
              </Button>
            </form>

            <div className="text-center mt-4">
              <Button 
                variant="link" 
                onClick={() => setIsLogin(!isLogin)}
                className="text-sm"
              >
                {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
