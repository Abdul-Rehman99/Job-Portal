import React, { useEffect, useState } from 'react'
import Navbar from '../shared/Navbar'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { RadioGroup } from '../ui/radio-group'
import { Button } from '../ui/button'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { USER_API_END_POINT } from '@/utils/constant'
import { toast } from 'sonner'
import { useDispatch, useSelector } from 'react-redux'
import { setLoading, setUser } from '@/redux/authSlice'
import { Loader2 } from 'lucide-react'

const Login = () => {
    const [input, setInput] = useState({
        email: "",
        password: "",
        role: "",
    });
    const { loading, user } = useSelector(store => store.auth);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    }

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            dispatch(setLoading(true));
            const res = await axios.post(`${USER_API_END_POINT}/login`, input, {
                headers: {
                    "Content-Type": "application/json"
                },
                withCredentials: true,
            });
            if (res.data.success) {
                dispatch(setUser(res.data.user));
                navigate("/");
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        } finally {
            dispatch(setLoading(false));
        }
    }

    const handleDemoLogin = (userType) => {
        if (userType === 'student') {
            setInput({
                email: "ayam@gamil.com",
                password: "12345678",
                role: "student"
            });
        } else if (userType === 'recruiter') {
            setInput({
                email: "bones@example.com",
                password: "12345678",
                role: "recruiter"
            });
        }
    }

    useEffect(() => {
        if (user) {
            navigate("/");
        }
    }, [])

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            <Navbar />
            <div className='flex items-center justify-center max-w-7xl mx-auto px-4 py-8'>
                <div className='w-full max-w-md'>
                    <div className='bg-white rounded-xl shadow-lg border-0 p-8'>
                        <div className='text-center mb-8'>
                            <h1 className='font-bold text-3xl text-gray-900 mb-2'>Welcome Back</h1>
                            <p className='text-gray-600'>Sign in to your account</p>
                        </div>
                        
                        <form onSubmit={submitHandler} className='space-y-6'>
                            <div className='space-y-2'>
                                <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email Address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={input.email}
                                    name="email"
                                    onChange={changeEventHandler}
                                    placeholder="Enter your email"
                                    className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                    required
                                />
                            </div>

                            <div className='space-y-2'>
                                <Label htmlFor="password" className="text-sm font-medium text-gray-700">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={input.password}
                                    name="password"
                                    onChange={changeEventHandler}
                                    placeholder="Enter your password"
                                    className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                    required
                                />
                            </div>

                            <div className='space-y-3'>
                                <Label className="text-sm font-medium text-gray-700">Select Role</Label>
                                <RadioGroup className="flex items-center gap-6">
                                    <div className="flex items-center space-x-3">
                                        <Input
                                            type="radio"
                                            id="student"
                                            name="role"
                                            value="student"
                                            checked={input.role === 'student'}
                                            onChange={changeEventHandler}
                                            className="cursor-pointer w-4 h-4"
                                        />
                                        <Label htmlFor="student" className="cursor-pointer text-sm font-medium">Student</Label>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <Input
                                            type="radio"
                                            id="recruiter"
                                            name="role"
                                            value="recruiter"
                                            checked={input.role === 'recruiter'}
                                            onChange={changeEventHandler}
                                            className="cursor-pointer w-4 h-4"
                                        />
                                        <Label htmlFor="recruiter" className="cursor-pointer text-sm font-medium">Recruiter</Label>
                                    </div>
                                </RadioGroup>
                            </div>

                            {loading ? (
                                <Button disabled className="w-full h-11 bg-blue-600 hover:bg-blue-700">
                                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                                    Signing in...
                                </Button>
                            ) : (
                                <Button type="submit" className="w-full h-11 bg-blue-600 hover:bg-blue-700 font-medium">
                                    Sign In
                                </Button>
                            )}
                        </form>

                        {/* Demo Login Buttons */}
                        <div className="mt-6">
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t border-gray-300" />
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-white px-2 text-gray-500">Try Demo</span>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3 mt-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => handleDemoLogin('student')}
                                    className="h-11 border-gray-300 hover:bg-gray-50 font-medium"
                                    disabled={loading}
                                >
                                    Demo Student
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => handleDemoLogin('recruiter')}
                                    className="h-11 border-gray-300 hover:bg-gray-50 font-medium"
                                    disabled={loading}
                                >
                                    Demo Recruiter
                                </Button>
                            </div>
                        </div>

                        <div className='text-center mt-8'>
                            <span className='text-sm text-gray-600'>
                                Don't have an account?{' '}
                                <Link to="/signup" className='text-blue-600 hover:text-blue-700 font-medium'>
                                    Sign up
                                </Link>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login