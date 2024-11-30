import React from 'react';
import { FiHome } from 'react-icons/fi';

const LoadingSpinner = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[400px] py-8">
            <div className="relative">
                <FiHome className="text-5xl text-[#E67E22]" />
                <div className="absolute top-0 left-0 w-full h-full">
                    <div className="w-16 h-16 border-4 border-[#E67E22] border-t-transparent rounded-full animate-spin"></div>
                </div>
            </div>
            <h2 className="mt-4 text-xl font-semibold text-gray-700">Loading...</h2>
            <p className="mt-2 text-gray-500">Please wait while we process your request</p>
        </div>
    );
};

export default LoadingSpinner; 