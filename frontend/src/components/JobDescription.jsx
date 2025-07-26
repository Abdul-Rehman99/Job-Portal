import React, { useEffect, useState } from 'react'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { APPLICATION_API_END_POINT, JOB_API_END_POINT } from '@/utils/constant';
import { setSingleJob } from '@/redux/jobSlice';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import { MapPin, Calendar, Users, DollarSign, Briefcase, Clock, FileText, IndianRupee, LogIn } from 'lucide-react';

const JobDescription = () => {
    const navigate = useNavigate();
    const {singleJob} = useSelector(store => store.job);
    const {user} = useSelector(store=>store.auth);
    const isIntiallyApplied = singleJob?.applications?.some(application => application.applicant === user?._id) || false;
    const [isApplied, setIsApplied] = useState(isIntiallyApplied);

    const params = useParams();
    const jobId = params.id;
    const dispatch = useDispatch();

    const applyJobHandler = async () => {
        try {
            const res = await axios.get(`${APPLICATION_API_END_POINT}/apply/${jobId}`, {withCredentials:true});
            
            if(res.data.success){
                setIsApplied(true); // Update the local state
                const updatedSingleJob = {...singleJob, applications:[...singleJob.applications,{applicant:user?._id}]}
                dispatch(setSingleJob(updatedSingleJob)); // helps us to real time UI update
                toast.success(res.data.message);

            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        }
    }

    const monthlyToLPA = (salary) => ((salary*12)/100000).toFixed(1);

    useEffect(()=>{
        const fetchSingleJob = async () => {
            try {
                const res = await axios.get(`${JOB_API_END_POINT}/get/${jobId}`,{withCredentials:true});
                if(res.data.success){
                    dispatch(setSingleJob(res.data.job));
                    setIsApplied(res.data.job.applications.some(application=>application.applicant === user?._id)) // Ensure the state is in sync with fetched data
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchSingleJob(); 
    },[jobId,dispatch, user?._id]);

    if (!user?._id) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg p-8">
        <div className="text-center max-w-md mx-auto">
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full mb-4">
              <Briefcase className="w-8 h-8 text-indigo-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Login Required
            </h1>
            <p className="text-gray-600 mb-6">
              Please sign in to your account to browse and apply for job opportunities
            </p>
          </div>
          
          <button
            onClick={() => navigate("/login")}
            className="inline-flex items-center justify-center px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors duration-200 shadow-sm"
          >
            <LogIn className="w-5 h-5 mr-2" />
            Go to Login
          </button>
        </div>
      </div>
    );
  }

    if (!singleJob) {
        return (
            <div className="max-w-6xl mx-auto p-6">
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/4 mb-8"></div>
                    <div className="space-y-4">
                        <div className="h-4 bg-gray-200 rounded"></div>
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className='max-w-6xl mx-auto p-6 bg-gradient-to-br from-slate-50 to-gray-100 min-h-screen'>
            {/* Header Section */}
            <div className='bg-white rounded-2xl shadow-lg p-8 mb-8 border border-gray-200'>
                <div className='flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6'>
                    <div className='flex-1'>
                        <div className='mb-4'>
                            <h1 className='text-3xl font-bold text-gray-900 mb-2'>{singleJob?.title}</h1>
                            <div className='flex items-center gap-2 text-gray-600'>
                                <Briefcase className='w-4 h-4' />
                                <span>Full Time Position</span>
                            </div>
                        </div>
                        
                        <div className='flex flex-wrap items-center gap-3'>
                            <Badge className='bg-blue-100 text-blue-800 hover:bg-blue-200 px-4 py-2 rounded-full font-semibold border-0'>
                                <Users className='w-4 h-4 mr-2' />
                                {singleJob?.position} Positions
                            </Badge>
                            <Badge className='bg-red-100 text-red-800 hover:bg-red-200 px-4 py-2 rounded-full font-semibold border-0'>
                                <Clock className='w-4 h-4 mr-2' />
                                {singleJob?.jobType}
                            </Badge>
                            <Badge className='bg-purple-100 text-purple-800 hover:bg-purple-200 px-4 py-2 rounded-full font-semibold border-0'>
                                <IndianRupee className='w-4 h-4 mr-2' />
                                {monthlyToLPA(singleJob?.salary)} LPA
                            </Badge>
                        </div>
                    </div>
                    
                    <div className='lg:ml-8'>
                        <Button
                            onClick={isApplied ? null : applyJobHandler}
                            disabled={isApplied}
                            className={`px-8 py-3 rounded-xl font-semibold text-white transition-all duration-300 transform hover:scale-105 ${
                                isApplied 
                                    ? 'bg-gray-400 cursor-not-allowed shadow-none' 
                                    : 'bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 shadow-lg hover:shadow-xl'
                            }`}>
                            {isApplied ? 'Already Applied' : 'Apply Now'}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Job Details Section */}
            <div className='bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden'>
                <div className='bg-gradient-to-r from-gray-900 to-gray-800 px-8 py-6'>
                    <h2 className='text-2xl font-bold text-white flex items-center gap-3'>
                        <FileText className='w-6 h-6' />
                        Job Description
                    </h2>
                </div>
                
                <div className='p-8'>
                    <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
                        {/* Left Column */}
                        <div className='space-y-6'>
                            <div className='bg-gray-50 rounded-xl p-6 border border-gray-200'>
                                <h3 className='text-lg font-bold text-gray-900 mb-4 flex items-center gap-2'>
                                    <Briefcase className='w-5 h-5 text-purple-600' />
                                    Role Details
                                </h3>
                                <div className='space-y-3'>
                                    <div>
                                        <span className='font-semibold text-gray-700'>Position:</span>
                                        <p className='text-gray-800 mt-1'>{singleJob?.title}</p>
                                    </div>
                                    <div>
                                        <span className='font-semibold text-gray-700 flex items-center gap-2'>
                                            <MapPin className='w-4 h-4' />
                                            Location:
                                        </span>
                                        <p className='text-gray-800 mt-1'>{singleJob?.location}</p>
                                    </div>
                                    <div>
                                        <span className='font-semibold text-gray-700 flex items-center gap-2'>
                                            <Clock className='w-4 h-4' />
                                            Experience Required:
                                        </span>
                                        <p className='text-gray-800 mt-1'>{singleJob?.experienceLevel} years</p>
                                    </div>
                                </div>
                            </div>

                            <div className='bg-gray-50 rounded-xl p-6 border border-gray-200'>
                                <h3 className='text-lg font-bold text-gray-900 mb-4 flex items-center gap-2'>
                                    <DollarSign className='w-5 h-5 text-green-600' />
                                    Compensation & Stats
                                </h3>
                                <div className='space-y-3'>
                                    <div>
                                        <span className='font-semibold text-gray-700'>Salary:</span>
                                        <p className='mt-1 text-xl font-bold text-green-600'>{singleJob?.salary}/month</p>
                                    </div>
                                    <div>
                                        <span className='font-semibold text-gray-700 flex items-center gap-2'>
                                            <Users className='w-4 h-4' />
                                            Total Applicants:
                                        </span>
                                        <p className='text-gray-800 mt-1 font-semibold'>{singleJob?.applications?.length}</p>
                                    </div>
                                    <div>
                                        <span className='font-semibold text-gray-700 flex items-center gap-2'>
                                            <Calendar className='w-4 h-4' />
                                            Posted Date:
                                        </span>
                                        <p className='text-gray-800 mt-1'>{singleJob?.createdAt?.split("T")[0]}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column */}
                        <div className='space-y-6'>
                            <div className='bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200'>
                                <h3 className='text-lg font-bold text-gray-900 mb-4'>Job Description</h3>
                                <p className='text-gray-700 leading-relaxed'>{singleJob?.description}</p>
                            </div>

                            <div className='bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200'>
                                <h3 className='text-lg font-bold text-gray-900 mb-4'>Requirements</h3>
                                <div className='space-y-2'>
                                    {singleJob?.requirements?.map((requirement, index) => (
                                        <div key={index} className='flex items-start gap-3'>
                                            <div className='w-2 h-2 bg-purple-600 rounded-full mt-2 flex-shrink-0'></div>
                                            <p className='text-gray-700 leading-relaxed'>{requirement}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default JobDescription

/* 

*/


// return (
//         <div className='max-w-7xl mx-auto my-10'>
//             <div className='flex items-center justify-between'>
//                 <div>
//                     <h1 className='font-bold text-xl'>{singleJob?.title}</h1>
//                     <div className='flex items-center gap-2 mt-4'>
//                         <Badge className={'text-blue-700 font-bold'} variant="ghost">{singleJob?.postion} Positions</Badge>
//                         <Badge className={'text-[#F83002] font-bold'} variant="ghost">{singleJob?.jobType}</Badge>
//                         <Badge className={'text-[#7209b7] font-bold'} variant="ghost">{singleJob?.salary}LPA</Badge>
//                     </div>
//                 </div>
//                 <Button
//                 onClick={isApplied ? null : applyJobHandler}
//                     disabled={isApplied}
//                     className={`rounded-lg ${isApplied ? 'bg-gray-600 cursor-not-allowed' : 'bg-[#7209b7] hover:bg-[#5f32ad]'}`}>
//                     {isApplied ? 'Already Applied' : 'Apply Now'}
//                 </Button>
//             </div>
//             <h1 className='border-b-2 border-b-gray-300 font-medium py-4'>Job Description</h1>
//             <div className='my-4'>
//                 <h1 className='font-bold my-1'>Role: <span className='pl-4 font-normal text-gray-800'>{singleJob?.title}</span></h1>
//                 <h1 className='font-bold my-1'>Requirements: {singleJob?.requirements.map((requirement) => <div>{requirement}</div>)}</h1>
//                 <h1 className='font-bold my-1'>Location: <span className='pl-4 font-normal text-gray-800'>{singleJob?.location}</span></h1>
//                 <h1 className='font-bold my-1'>Description: <span className='pl-4 font-normal text-gray-800'>{singleJob?.description}</span></h1>
//                 <h1 className='font-bold my-1'>Experience: <span className='pl-4 font-normal text-gray-800'>{singleJob?.experienceLevel} yrs</span></h1>
//                 <h1 className='font-bold my-1'>Salary: <span className='pl-4 font-normal text-gray-800'>{singleJob?.salary}LPA</span></h1>
//                 <h1 className='font-bold my-1'>Total Applicants: <span className='pl-4 font-normal text-gray-800'>{singleJob?.applications?.length}</span></h1>
//                 <h1 className='font-bold my-1'>Posted Date: <span className='pl-4 font-normal text-gray-800'>{singleJob?.createdAt.split("T")[0]}</span></h1>
//             </div>
//         </div>
//     )