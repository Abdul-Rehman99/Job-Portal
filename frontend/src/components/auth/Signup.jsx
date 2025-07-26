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
import { setLoading } from '@/redux/authSlice'
import { Loader2 } from 'lucide-react'

const Signup = () => {
    const [input, setInput] = useState({
        fullname: "",
        email: "",
        phoneNumber: "",
        password: "",
        role: "",
        file: ""
    });
    const { loading, user } = useSelector(store => store.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    }

    const changeFileHandler = (e) => {
        setInput({ ...input, file: e.target.files?.[0] });
    }

    const submitHandler = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("fullname", input.fullname);
        formData.append("email", input.email);
        formData.append("phoneNumber", input.phoneNumber);
        formData.append("password", input.password);
        formData.append("role", input.role);
        if (input.file) {
            formData.append("file", input.file);
        }

        try {
            dispatch(setLoading(true));
            const res = await axios.post(`${USER_API_END_POINT}/register`, formData, {
                headers: { 'Content-Type': "multipart/form-data" },
                withCredentials: true,
            });
            if (res.data.success) {
                navigate("/login");
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        } finally {
            dispatch(setLoading(false));
        }
    }

    useEffect(() => {
        if (user) {
            navigate("/");
        }
    }, [])

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100">
            <Navbar />
            <div className='flex items-center justify-center max-w-7xl mx-auto px-4 py-8'>
                <div className='w-full max-w-lg'>
                    <div className='bg-white rounded-xl shadow-lg border-0 p-8'>
                        <div className='text-center mb-8'>
                            <h1 className='font-bold text-3xl text-gray-900 mb-2'>Create Account</h1>
                            <p className='text-gray-600'>Join us and start your journey</p>
                        </div>
                        
                        <form onSubmit={submitHandler} className='space-y-6'>
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                <div className='space-y-2'>
                                    <Label htmlFor="fullname" className="text-sm font-medium text-gray-700">Full Name</Label>
                                    <Input
                                        id="fullname"
                                        type="text"
                                        value={input.fullname}
                                        name="fullname"
                                        onChange={changeEventHandler}
                                        placeholder="Enter your full name"
                                        className="h-11 border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                                        required
                                    />
                                </div>

                                <div className='space-y-2'>
                                    <Label htmlFor="phoneNumber" className="text-sm font-medium text-gray-700">Phone Number</Label>
                                    <Input
                                        id="phoneNumber"
                                        type="tel"
                                        value={input.phoneNumber}
                                        name="phoneNumber"
                                        onChange={changeEventHandler}
                                        placeholder="Enter phone number"
                                        className="h-11 border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                                        required
                                    />
                                </div>
                            </div>

                            <div className='space-y-2'>
                                <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email Address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={input.email}
                                    name="email"
                                    onChange={changeEventHandler}
                                    placeholder="Enter your email"
                                    className="h-11 border-gray-300 focus:border-purple-500 focus:ring-purple-500"
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
                                    placeholder="Create a strong password"
                                    className="h-11 border-gray-300 focus:border-purple-500 focus:ring-purple-500"
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

                            <div className='space-y-2'>
                                <Label htmlFor="profile" className="text-sm font-medium text-gray-700">
                                    Profile Picture
                                    <span className="text-gray-500 text-xs ml-1">(optional)</span>
                                </Label>
                                <div className="relative">
                                    <Input
                                        id="profile"
                                        accept="image/*"
                                        type="file"
                                        onChange={changeFileHandler}
                                        className="h-11 border-gray-300 focus:border-purple-500 focus:ring-purple-500 cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                                    />
                                </div>
                                {input.file && (
                                    <p className="text-sm text-green-600 flex items-center gap-1">
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                        {input.file.name}
                                    </p>
                                )}
                            </div>

                            {loading ? (
                                <Button disabled className="w-full h-12 bg-purple-600 hover:bg-purple-700 text-lg">
                                    <Loader2 className='mr-2 h-5 w-5 animate-spin' />
                                    Creating Account...
                                </Button>
                            ) : (
                                <Button type="submit" className="w-full h-12 bg-purple-600 hover:bg-purple-700 font-medium text-lg">
                                    Create Account
                                </Button>
                            )}
                        </form>

                        <div className='text-center mt-8'>
                            <span className='text-sm text-gray-600'>
                                Already have an account?{' '}
                                <Link to="/login" className='text-purple-600 hover:text-purple-700 font-medium'>
                                    Sign in
                                </Link>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Signup