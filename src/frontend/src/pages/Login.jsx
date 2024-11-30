import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { setAuthToken } from '../utils/cookies';
import { useAuth } from '../context/AuthContext';
import { API_LOGIN_URL, APP_NAME } from '../utils/constants';
import Logo from "../assets/spacia.png";
import { FiLock, FiUser, FiArrowRight } from 'react-icons/fi';

const Login = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { setUser } = useAuth();

    const validateForm = () => {
        const newErrors = {};
        if (!formData.username.trim()) {
            newErrors.username = 'Username is required';
        }
        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsLoading(true);
        setErrors({});

        try {
            const response = await axios.post(API_LOGIN_URL, formData);

            if (response.data.token) {
                setAuthToken(response.data.token);
                setUser({ name: formData.username, username: formData.username });
                navigate('/');
            } else if (response.data.message === "Bad credentials") {
                setErrors({
                    submit: 'Invalid username or password. Please try again.'
                });
            } else {
                setErrors({
                    submit: 'Login failed. Please try again.'
                });
            }
        } catch (error) {
            if (error.response) {
                switch (error.response.status) {
                    case 403:
                        setErrors({
                            submit: 'Your account has been locked. Please contact support.'
                        });
                        break;
                    case 404:
                        setErrors({
                            submit: 'Service not available. Please try again later.'
                        });
                        break;
                    default:
                        setErrors({
                            submit: 'An error occurred during login. Please try again later.'
                        });
                }
            } else if (error.request) {
                setErrors({
                    submit: 'Unable to connect to the server. Please check your internet connection.'
                });
            } else {
                setErrors({
                    submit: 'An unexpected error occurred. Please try again.'
                });
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#FDF2E9] via-white to-[#FAE5D3] flex items-center justify-center px-4">
            <div className="max-w-6xl w-full mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                {/* Left Column - Branding */}
                <div className="hidden lg:flex flex-col justify-center space-y-8">
                    <div className="flex items-center space-x-3">
                        <img src={Logo} alt="Logo" className="h-12 w-12" />
                        <h1 className="text-3xl font-bold text-gray-900">{APP_NAME}</h1>
                    </div>
                    <div className="space-y-6">
                        <h2 className="text-4xl font-bold text-gray-900">Welcome back!</h2>
                        <p className="text-xl text-gray-600">Access your account and discover amazing properties across Dublin.</p>
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                        <div className="bg-white p-6 rounded-2xl shadow-sm">
                            <div className="text-2xl font-bold text-[#E67E22] mb-2">100K+</div>
                            <div className="text-gray-600">Active Users</div>
                        </div>
                        <div className="bg-white p-6 rounded-2xl shadow-sm">
                            <div className="text-2xl font-bold text-[#E67E22] mb-2">50K+</div>
                            <div className="text-gray-600">Properties</div>
                        </div>
                    </div>
                </div>

                {/* Right Column - Login Form */}
                <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full mx-auto">
                    <div className="mb-8 text-center lg:text-left">
                        <h3 className="text-2xl font-bold text-gray-900">Sign in to your account</h3>
                        <p className="text-gray-600 mt-2">Enter your credentials to continue</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-4">
                            <div className="relative">
                                <FiUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Username"
                                    value={formData.username}
                                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                    className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-[#E67E22] focus:ring-2 focus:ring-[#E67E22] focus:ring-opacity-20 transition-colors"
                                />
                            </div>
                            {errors.username && <p className="text-sm text-red-500">{errors.username}</p>}

                            <div className="relative">
                                <FiLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type="password"
                                    placeholder="Password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-[#E67E22] focus:ring-2 focus:ring-[#E67E22] focus:ring-opacity-20 transition-colors"
                                />
                            </div>
                            {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
                        </div>

                        {errors.submit && (
                            <div className="bg-red-50 text-red-500 text-sm p-4 rounded-xl">
                                {errors.submit}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-[#E67E22] text-white py-3 rounded-xl hover:bg-[#D35400] transition-colors flex items-center justify-center space-x-2"
                        >
                            <span>{isLoading ? 'Signing in...' : 'Sign in'}</span>
                            {!isLoading && <FiArrowRight />}
                        </button>

                        <div className="text-center">
                            <span className="text-gray-600">Don't have an account? </span>
                            <a href="/register" className="text-[#E67E22] hover:text-[#D35400] font-medium">
                                Create one now
                            </a>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
