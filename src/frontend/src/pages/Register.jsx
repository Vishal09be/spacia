import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_REGISTER_URL, APP_NAME } from '../utils/constants';
import { FiArrowRight } from 'react-icons/fi';
import Logo from "../assets/spacia.png"

const Register = () => {
    const [formData, setFormData] = useState({
        firstname: '',
        lastname: '',
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const validateForm = () => {
        const newErrors = {};

        if (!formData.firstname.trim()) newErrors.firstname = 'First name is required';
        if (!formData.lastname.trim()) newErrors.lastname = 'Last name is required';

        if (!formData.username.trim()) {
            newErrors.username = 'Username is required';
        } else if (formData.username.length < 3) {
            newErrors.username = 'Username must be at least 3 characters';
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters';
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
            newErrors.password = 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
        }

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsLoading(true);
        try {
            const response = await axios.post(API_REGISTER_URL, {
                firstname: formData.firstname,
                lastname: formData.lastname,
                username: formData.username,
                email: formData.email,
                password: formData.password
            });

            if (response.data) {
                navigate('/login', {
                    state: { message: 'Registration successful! Please login to continue.' }
                });
            }
        } catch (error) {
            setErrors({
                submit: error.response?.data?.message || 'Registration failed. Please try again.'
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#FDF2E9] via-white to-[#FAE5D3] flex items-center justify-center px-4 py-8">
            <div className="max-w-6xl w-full mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                {/* Left Column - Branding */}
                <div className="hidden lg:flex flex-col justify-center space-y-8">
                    <div className="flex items-center space-x-3">
                        <img src={Logo} alt="Logo" className="h-12 w-12" />
                        <h1 className="text-3xl font-bold text-gray-900">{APP_NAME}</h1>
                    </div>
                    <div className="space-y-6">
                        <h2 className="text-4xl font-bold text-gray-900">Start your journey!</h2>
                        <p className="text-xl text-gray-600">Join our community and discover amazing properties across Dublin.</p>
                    </div>

                    {/* Feature Grid */}
                    <div className="grid grid-cols-2 gap-6">
                        {[
                            { title: 'Fast Setup', desc: 'Get started in minutes', icon: '⚡' },
                            { title: 'Secure', desc: 'Enterprise-grade security', icon: '🔒' },
                            { title: '24/7 Support', desc: 'Always here to help', icon: '💬' },
                            { title: 'Updates', desc: 'Regular feature updates', icon: '🔄' }
                        ].map((feature, index) => (
                            <div key={index} className="bg-white p-6 rounded-2xl shadow-sm">
                                <div className="text-2xl mb-2">{feature.icon}</div>
                                <h3 className="font-semibold text-gray-900">{feature.title}</h3>
                                <p className="text-sm text-gray-600 mt-1">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Column - Registration Form */}
                <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full mx-auto">
                    <div className="mb-8 text-center lg:text-left">
                        <h3 className="text-2xl font-bold text-gray-900">Create your account</h3>
                        <p className="text-gray-600 mt-2">Fill in your details to get started</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Name Fields */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <input
                                    type="text"
                                    placeholder="First name"
                                    value={formData.firstname}
                                    onChange={(e) => setFormData({ ...formData, firstname: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-[#E67E22] focus:ring-2 focus:ring-[#E67E22] focus:ring-opacity-20 transition-colors"
                                />
                                {errors.firstname && <p className="mt-1 text-sm text-red-500">{errors.firstname}</p>}
                            </div>
                            <div>
                                <input
                                    type="text"
                                    placeholder="Last name"
                                    value={formData.lastname}
                                    onChange={(e) => setFormData({ ...formData, lastname: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-[#E67E22] focus:ring-2 focus:ring-[#E67E22] focus:ring-opacity-20 transition-colors"
                                />
                                {errors.lastname && <p className="mt-1 text-sm text-red-500">{errors.lastname}</p>}
                            </div>
                        </div>

                        {/* Username and Email Fields */}
                        <div className="space-y-4">
                            <div>
                                <input
                                    type="text"
                                    placeholder="Username"
                                    value={formData.username}
                                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-[#E67E22] focus:ring-2 focus:ring-[#E67E22] focus:ring-opacity-20 transition-colors"
                                />
                                {errors.username && <p className="mt-1 text-sm text-red-500">{errors.username}</p>}
                            </div>
                            <div>
                                <input
                                    type="email"
                                    placeholder="Email address"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-[#E67E22] focus:ring-2 focus:ring-[#E67E22] focus:ring-opacity-20 transition-colors"
                                />
                                {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
                            </div>
                        </div>

                        {/* Password Fields */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <input
                                    type="password"
                                    placeholder="Password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-[#E67E22] focus:ring-2 focus:ring-[#E67E22] focus:ring-opacity-20 transition-colors"
                                />
                                {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
                            </div>
                            <div>
                                <input
                                    type="password"
                                    placeholder="Confirm password"
                                    value={formData.confirmPassword}
                                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-[#E67E22] focus:ring-2 focus:ring-[#E67E22] focus:ring-opacity-20 transition-colors"
                                />
                                {errors.confirmPassword && <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>}
                            </div>
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
                            <span>{isLoading ? 'Creating account...' : 'Create account'}</span>
                            {!isLoading && <FiArrowRight />}
                        </button>

                        <div className="text-center">
                            <span className="text-gray-600">Already have an account? </span>
                            <a href="/login" className="text-[#E67E22] hover:text-[#D35400] font-medium">
                                Sign in
                            </a>
                        </div>

                        <div className="pt-4 text-center">
                            <p className="text-sm text-gray-500">
                                By creating an account, you agree to our Terms of Service and Privacy Policy
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Register;
