// Update Existing Property Page

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { getAuthToken } from '../utils/cookies';
import LoadingSpinner from '../components/LoadingSpinner';
import { API_BASE_URL, API_MASTER_DATA_URL } from '../utils/constants';

const UpdateProperty = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const propertyData = location.state?.property;

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [masterData, setMasterData] = useState({
        amenities: [],
        propertyType: [],
        energyRatings: []
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
        images: [],
        propertyType: ''
    });

    useEffect(() => {
        const initializeData = async () => {
            try {
                // Fetch master data
                const masterDataRes = await fetch(API_MASTER_DATA_URL);
                if (!masterDataRes.ok) {
                    throw new Error('Failed to fetch master data');
                }
                const masterDataJson = await masterDataRes.json();
                setMasterData(masterDataJson);

                // If we have property data from navigation state, use it
                if (propertyData) {
                    setFormData(propertyData);
                    setLoading(false);
                } else {
                    // Fallback to API call if no state data
                    const propertyRes = await fetch(`${API_BASE_URL}/property/${id}`, {
                        headers: {
                            'Authorization': `Bearer ${getAuthToken()}`
                        }
                    });
                    if (!propertyRes.ok) {
                        throw new Error('Failed to fetch property data');
                    }
                    const propertyJson = await propertyRes.json();
                    setFormData(propertyJson);
                }
            } catch (error) {
                console.error('Error:', error);
                setError('Failed to load property data. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        initializeData();
    }, [id, propertyData]);

    const handleInputChange = (e) => {
        const { name, value, type } = e.target;

        // Add character limit for description
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/property/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getAuthToken()}`
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                throw new Error('Failed to update property');
            }

            navigate('/my-properties');
        } catch (error) {
            console.error('Error:', error);
            setError('Failed to update property. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Update the form fields styling with modern design
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

    const labelClasses = "block text-sm font-medium text-gray-700 mb-1";

    if (loading) return <LoadingSpinner />;

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Update Property</h1>

                {error && (
                    <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-8 bg-white p-8 rounded-xl shadow-lg">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <label className={labelClasses}>Property Name</label>
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
                            <label className={labelClasses}>Property Type</label>
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

                        <div className="md:col-span-2">
                            <label className={labelClasses}>Address</label>
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
                                placeholder="Enter property eircode"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Postal Code</label>
                            <input
                                type="text"
                                name="postalCode"
                                value={formData.postalCode}
                                onChange={handleInputChange}
                                className={inputClasses}
                                required
                                placeholder="Enter property postal code"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Monthly Rent (€)</label>
                            <input
                                type="number"
                                name="rent"
                                value={formData.rent}
                                onChange={handleInputChange}
                                className={inputClasses}
                                required
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
                                placeholder="Enter deposit"
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
                                placeholder="Enter area"
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

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Bedrooms</label>
                            <input
                                type="number"
                                name="bedrooms"
                                value={formData.bedrooms}
                                onChange={handleInputChange}
                                className={inputClasses}
                                required
                                placeholder="Enter number of bedrooms"
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
                                placeholder="Enter number of bathrooms"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className={labelClasses}>Description</label>
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
                                <div className="absolute bottom-3 right-3 text-sm text-gray-500 bg-white px-2 rounded-md">
                                    {formData.description.length}/3000
                                </div>
                            </div>
                        </div>

                        <div className="md:col-span-2">
                            <label className={`${labelClasses} mb-3`}>Amenities</label>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {masterData.amenities.map(amenity => (
                                    <label key={amenity} className="relative flex items-start py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                                        <div className="flex items-center h-5">
                                            <input
                                                type="checkbox"
                                                checked={formData.amenities.includes(amenity)}
                                                onChange={() => handleAmenitiesChange(amenity)}
                                                className="h-5 w-5 rounded border-gray-300 text-[#E67E22] focus:ring-[#E67E22] transition-colors duration-200 ease-in-out"
                                            />
                                        </div>
                                        <div className="ml-3 text-sm">
                                            <span className="text-gray-700 hover:text-gray-900 transition-colors duration-200 ease-in-out">
                                                {amenity}
                                            </span>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end space-x-4 pt-6 border-t">
                        <button
                            type="button"
                            onClick={() => navigate('/my-properties')}
                            className="px-6 py-3 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#E67E22] transition-all duration-200 ease-in-out"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-3 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[#E67E22] hover:bg-[#D35400] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#E67E22] disabled:opacity-50 transition-all duration-200 ease-in-out"
                        >
                            {loading ? 'Updating...' : 'Update Property'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UpdateProperty; 