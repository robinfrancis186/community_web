import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { Mail, Lock, User, AlertCircle } from 'lucide-react';
import Button from '../../components/ui/Button';
import logo from '../../assets/stride-logo.png';

const Login = () => {
    const navigate = useNavigate();
    const { signIn, signUp } = useAuth();
    const [isSignUp, setIsSignUp] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        fullName: '',
        role: 'member'
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (isSignUp) {
                const { data, error } = await signUp(
                    formData.email,
                    formData.password,
                    formData.fullName,
                    formData.role
                );

                if (error) throw error;

                // Check if email confirmation is required
                if (data.user && !data.session) {
                    // Email confirmation required
                    setError('Account created! Please check your email to confirm your account before signing in.');
                    setIsSignUp(false);
                    setFormData({ ...formData, password: '', fullName: '' });
                    return;
                }

                // If session exists, user is logged in
                if (data.session) {
                    // Wait a moment for profile to be fetched by AuthContext
                    await new Promise(resolve => setTimeout(resolve, 800));
                    navigate(`/${formData.role}/dashboard`);
                } else {
                    // This shouldn't happen, but handle it gracefully
                    setError('Account created but session not established. Please try signing in.');
                    setIsSignUp(false);
                    setFormData({ ...formData, password: '', fullName: '' });
                }
            } else {
                const { data, error } = await signIn(formData.email, formData.password);

                if (error) {
                    // Provide more helpful error messages
                    if (error.message.includes('Invalid login credentials')) {
                        throw new Error('Invalid email or password. Please check your credentials and try again.');
                    } else if (error.message.includes('Email not confirmed')) {
                        throw new Error('Please check your email and confirm your account before signing in.');
                    } else {
                        throw error;
                    }
                }

                // Wait for profile to be fetched by AuthContext
                await new Promise(resolve => setTimeout(resolve, 500));

                // Fetch profile to get role for redirect
                if (data?.user) {
                    const { data: profileData, error: profileError } = await supabase
                        .from('profiles')
                        .select('role')
                        .eq('id', data.user.id)
                        .single();

                    if (profileError && profileError.code !== 'PGRST116') {
                        console.error('Error fetching profile:', profileError);
                    }

                    const role = profileData?.role || 'member';
                    navigate(`/${role}/dashboard`);
                } else {
                    navigate('/member/dashboard');
                }
            }
        } catch (err) {
            setError(err.message || 'An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary/5 via-slate-50 to-secondary/5 flex items-center justify-center p-6">
            <div className="max-w-md w-full">
                <div className="text-center mb-8">
                    <img src={logo} alt="STRIDE" className="h-16 w-auto mx-auto mb-4 drop-shadow-lg" />
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">
                        Welcome to <span className="text-transparent bg-clip-text bg-gradient-primary">STRIDE</span>
                    </h1>
                    <p className="text-slate-600">
                        {isSignUp ? 'Create your account to get started' : 'Sign in to your account'}
                    </p>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-xl">
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2">
                            <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={18} />
                            <p className="text-sm text-red-600">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {isSignUp && (
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Full Name
                                </label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <input
                                        type="text"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleChange}
                                        required={isSignUp}
                                        className="w-full pl-10 pr-4 py-2.5 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-slate-900 transition-all"
                                        placeholder="Enter your full name"
                                    />
                                </div>
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Email
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="w-full pl-10 pr-4 py-2.5 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-slate-900 transition-all"
                                    placeholder="Enter your email"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    minLength={6}
                                    className="w-full pl-10 pr-4 py-2.5 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-slate-900 transition-all"
                                    placeholder="Enter your password"
                                />
                            </div>
                        </div>

                        {isSignUp && (
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    I am a...
                                </label>
                                <select
                                    name="role"
                                    value={formData.role}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-slate-900 transition-all"
                                >
                                    <option value="member">Member (Student/Ambassador)</option>
                                    <option value="campus">Campus Representative</option>
                                    <option value="admin">Administrator</option>
                                </select>
                            </div>
                        )}

                        <Button
                            type="submit"
                            variant="primary"
                            className="w-full"
                            disabled={loading}
                        >
                            {loading ? 'Please wait...' : (isSignUp ? 'Create Account' : 'Sign In')}
                        </Button>
                    </form>

                    <div className="mt-6 text-center">
                        <button
                            type="button"
                            onClick={() => {
                                setIsSignUp(!isSignUp);
                                setError('');
                            }}
                            className="text-sm text-primary hover:underline"
                        >
                            {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
                        </button>
                    </div>
                </div>

                <p className="text-center text-xs text-slate-500 mt-6">
                    By continuing, you agree to STRIDE's Terms of Service and Privacy Policy
                </p>
            </div>
        </div>
    );
};

export default Login;
