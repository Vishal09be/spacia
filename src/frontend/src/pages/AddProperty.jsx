import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiPlus, FiTrash2 } from 'react-icons/fi';
import { getAuthToken } from '../utils/cookies';
import LoadingSpinner from '../components/LoadingSpinner';
import { API_BASE_URL, API_MASTER_DATA_URL } from '../utils/constants';

const AddProperty = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [masterData, setMasterData] = useState({
        amenities: [],
        propertyType: [],
        energyRatings: [],
        locations: []
    });

    const [formData, setFormData] = useState({
        name: '',
        address: '',
        eircode: '',
        description: '',
        postalCode: '',
        rent: 0,
        deposit: 0,
        area: 0,
        availableFrom: '',
        energyRatings: '',
        bedrooms: 0,
        bathrooms: 0,
        amenities: [],
        images: [''],
        propertyType: ''
    });

    const [selectedFiles, setSelectedFiles] = useState([]);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);

    useEffect(() => {
        const fetchMasterData = async () => {
            try {
                const response = await fetch(API_MASTER_DATA_URL);
                if (!response.ok) throw new Error('Failed to fetch master data');
                const data = await response.json();
                setMasterData(data);
            } catch (error) {
                console.error('Error:', error);
                setError('Failed to load master data. Please try again later.');
            }
        };

        fetchMasterData();
    }, []);

    const handleInputChange = (e) => {
        const { name, value, type } = e.target;

        if (name === 'description' && value.length > 3000) {
            return;
        }

        if (type === 'number') {
            setFormData(prev => ({
                ...prev,
                [name]: parseFloat(value) || 0
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleAmenitiesChange = (amenity) => {
        setFormData(prev => ({
            ...prev,
            amenities: prev.amenities.includes(amenity)
                ? prev.amenities.filter(a => a !== amenity)
                : [...prev.amenities, amenity]
        }));
    };

    const handleFileSelect = (e) => {
        const files = Array.from(e.target.files);
        setSelectedFiles(prev => [...prev, ...files]);
    };

    const removeFile = (index) => {
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    };

    const uploadImages = async (creationId) => {
        setIsUploading(true);
        const totalFiles = selectedFiles.length;
        let uploadedCount = 0;

        try {
            for (const file of selectedFiles) {
                const formData = new FormData();
                formData.append('file', file);
                formData.append('propertyId', creationId);

                const response = await fetch(`${API_BASE_URL}/image`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${getAuthToken()}`
                    },
                    body: formData
                });

                if (!response.ok) {
                    throw new Error(`Failed to upload image ${file.name}`);
                }

                uploadedCount++;
                setUploadProgress((uploadedCount / totalFiles) * 100);
            }
        } catch (error) {
            console.error('Error uploading images:', error);
            throw error;
        } finally {
            setIsUploading(false);
            setUploadProgress(0);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // First, create the property without images
            const propertyResponse = await fetch(`${API_BASE_URL}/property`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getAuthToken()}`
                },
                body: JSON.stringify({
                    ...formData,
                    images: [] // Empty array as we'll upload images separately
                })
            });

            if (!propertyResponse.ok) {
                throw new Error('Failed to create property');
            }

            const propertyData = await propertyResponse.json();

            if (propertyData.status === 'Success' && propertyData.creationId) {
                // Now upload the images
                await uploadImages(propertyData.creationId);
                navigate('/my-properties');
            } else {
                throw new Error('Invalid response from server');
            }
        } catch (error) {
            console.error('Error:', error);
            setError('Failed to add property. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const inputClasses = `
        mt-1 block w-full px-4 py-3
        bg-white border border-gray-300 rounded-lg
        text-gray-900 text-base
        shadow-sm
        placeholder-gray-400
        focus:outline-none focus:border-[#E67E22] focus:ring-2 focus:ring-[#E67E22] focus:ring-opacity-20
        hover:border-gray-400
        transition duration-200 ease-in-out
    `;

    const selectClasses = `
        mt-1 block w-full px-4 py-3
        bg-white border border-gray-300 rounded-lg
        text-gray-900 text-base
        shadow-sm
        focus:outline-none focus:border-[#E67E22] focus:ring-2 focus:ring-[#E67E22] focus:ring-opacity-20
        hover:border-gray-400
        transition duration-200 ease-in-out
    `;

    const renderImageUploadSection = () => (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Property Images</label>
            <div className="space-y-4">
                <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <FiPlus className="w-8 h-8 mb-4 text-gray-500" />
                            <p className="mb-2 text-sm text-gray-500">
                                <span className="font-semibold">Click to upload</span> or drag and drop
                            </p>
                            <p className="text-xs text-gray-500">PNG, JPG, JPEG up to 10MB</p>
                        </div>
                        <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            multiple
                            onChange={handleFileSelect}
                        />
                    </label>
                </div>

                {/* Selected Files Preview */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {selectedFiles.map((file, index) => (
                        <div key={index} className="relative group">
                            <img
                                src={URL.createObjectURL(file)}
                                alt={`Preview ${index + 1}`}
                                className="w-full h-32 object-cover rounded-lg"
                            />
                            <button
                                type="button"
                                onClick={() => removeFile(index)}
                                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <FiTrash2 className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>

                {/* Upload Progress */}
                {isUploading && (
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                            className="bg-[#E67E22] h-2.5 rounded-full transition-all duration-300"
                            style={{ width: `${uploadProgress}%` }}
                        ></div>
                    </div>
                )}
            </div>
        </div>
    );

    if (loading) return <LoadingSpinner />;

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Add New Property</h1>

                {error && (
                    <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-8 bg-white p-8 rounded-xl shadow-lg">
                    {/* Basic Property Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Property Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                className={inputClasses}
                                required
                                placeholder="Enter property name"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Property Type</label>
                            <select
                                name="propertyType"
                                value={formData.propertyType}
                                onChange={handleInputChange}
                                className={selectClasses}
                                required
                            >
                                <option value="">Select Type</option>
                                {masterData.propertyType.map(type => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </select>
                        </div>

                        {/* Address Fields */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700">Address</label>
                            <input
                                type="text"
                                name="address"
                                value={formData.address}
                                onChange={handleInputChange}
                                className={inputClasses}
                                required
                                placeholder="Enter property address"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Eircode</label>
                            <input
                                type="text"
                                name="eircode"
                                value={formData.eircode}
                                onChange={handleInputChange}
                                className={inputClasses}
                                required
                                placeholder="Enter eircode"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Postal Code</label>
                            <select
                                name="postalCode"
                                value={formData.postalCode}
                                onChange={handleInputChange}
                                className={selectClasses}
                                required
                            >
                                <option value="">Select Postal Code</option>
                                {masterData.locations?.map(location => (
                                    <option key={location} value={location}>{location}</option>
                                ))}
                            </select>
                        </div>

                        {/* Numeric Fields */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Monthly Rent (€)</label>
                            <input
                                type="number"
                                name="rent"
                                value={formData.rent}
                                onChange={handleInputChange}
                                className={inputClasses}
                                required
                                min="0"
                                placeholder="Enter monthly rent"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Deposit (€)</label>
                            <input
                                type="number"
                                name="deposit"
                                value={formData.deposit}
                                onChange={handleInputChange}
                                className={inputClasses}
                                required
                                min="0"
                                placeholder="Enter deposit amount"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Area (m²)</label>
                            <input
                                type="number"
                                name="area"
                                value={formData.area}
                                onChange={handleInputChange}
                                className={inputClasses}
                                required
                                min="0"
                                placeholder="Enter area in square meters"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Available From</label>
                            <input
                                type="date"
                                name="availableFrom"
                                value={formData.availableFrom}
                                onChange={handleInputChange}
                                className={inputClasses}
                                required
                                min={new Date().toISOString().split('T')[0]}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Bedrooms</label>
                            <input
                                type="number"
                                name="bedrooms"
                                value={formData.bedrooms}
                                onChange={handleInputChange}
                                className={inputClasses}
                                required
                                min="0"
                                placeholder="Number of bedrooms"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Bathrooms</label>
                            <input
                                type="number"
                                name="bathrooms"
                                value={formData.bathrooms}
                                onChange={handleInputChange}
                                className={inputClasses}
                                required
                                min="0"
                                placeholder="Number of bathrooms"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Energy Rating</label>
                            <select
                                name="energyRatings"
                                value={formData.energyRatings}
                                onChange={handleInputChange}
                                className={selectClasses}
                                required
                            >
                                <option value="">Select Rating</option>
                                {masterData.energyRatings.map(rating => (
                                    <option key={rating} value={rating}>{rating}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <div className="relative">
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                rows="4"
                                className={`${inputClasses} resize-none`}
                                required
                                placeholder="Enter property description"
                                maxLength={3000}
                            />
                            <div className="absolute bottom-3 right-3 text-sm text-gray-500">
                                {formData.description.length}/3000
                            </div>
                        </div>
                    </div>

                    {renderImageUploadSection()}

                    {/* Amenities */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">Amenities</label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {masterData.amenities.map(amenity => (
                                <label key={amenity} className="relative flex items-start py-2">
                                    <div className="flex items-center h-5">
                                        <input
                                            type="checkbox"
                                            checked={formData.amenities.includes(amenity)}
                                            onChange={() => handleAmenitiesChange(amenity)}
                                            className="h-5 w-5 rounded border-gray-300 text-[#E67E22] focus:ring-[#E67E22]"
                                        />
                                    </div>
                                    <div className="ml-3 text-sm">
                                        <span className="text-gray-700">{amenity}</span>
                                    </div>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Submit Buttons */}
                    <div className="flex justify-end space-x-4 pt-6 border-t">
                        <button
                            type="button"
                            onClick={() => navigate('/my-properties')}
                            className="px-6 py-3 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#E67E22]"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-3 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[#E67E22] hover:bg-[#D35400] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#E67E22] disabled:opacity-50"
                        >
                            {loading ? 'Adding Property...' : 'Add Property'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddProperty; 