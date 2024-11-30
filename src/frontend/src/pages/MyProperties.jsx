import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuthToken } from '../utils/cookies';
import { FaTrash, FaEdit, FaExclamationTriangle, FaBed, FaBath } from 'react-icons/fa';
import LoadingSpinner from '../components/LoadingSpinner';
import { API_BASE_URL, API_PROPERTY_URL } from '../utils/constants';

const MyProperties = () => {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedProperty, setSelectedProperty] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchProperties();
    }, []);

    const fetchProperties = async () => {
        try {
            const response = await fetch(`${API_PROPERTY_URL}/myProducts`, {
                headers: {
                    'Authorization': `Bearer ${getAuthToken()}`
                }
            });
            if (!response.ok) throw new Error('Failed to fetch properties');
            const data = await response.json();
            setProperties(data);
        } catch (error) {
            setError('Failed to load properties. Please try again later.');
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteProperty = async (propertyId) => {
        setIsDeleting(true);
        try {
            const response = await fetch(`${API_BASE_URL}/property/${propertyId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${getAuthToken()}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to delete property');
            }

            setProperties(properties.filter(property => property.id !== propertyId));
            setShowDeleteModal(false);
            setSelectedProperty(null);
        } catch (error) {
            console.error('Error:', error);
            setError('Failed to delete property. Please try again.');
        } finally {
            setIsDeleting(false);
        }
    };

    const handleUpdateProperty = (property) => {
        navigate(`/update-property/${property.id}`, { state: { property } });
    };

    const DeleteModal = () => {
        if (!selectedProperty) return null;

        return (
            <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
                        onClick={() => setShowDeleteModal(false)}></div>

                    <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                        <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                            <div className="sm:flex sm:items-start">
                                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                                    <FaExclamationTriangle className="h-6 w-6 text-red-600" />
                                </div>
                                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                    <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                                        Delete Property
                                    </h3>
                                    <div className="mt-2">
                                        <p className="text-sm text-gray-500">
                                            Are you sure you want to delete this property? This action cannot be undone.
                                        </p>
                                        <div className="mt-4 space-y-2 text-sm text-gray-600">
                                            <p><span className="font-semibold">Property Name:</span> {selectedProperty.name}</p>
                                            <p><span className="font-semibold">Address:</span> {selectedProperty.address}</p>
                                            <p><span className="font-semibold">Rent:</span> €{selectedProperty.rent}/month</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                            <button
                                type="button"
                                disabled={isDeleting}
                                className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 ${isDeleting
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
                                    } text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm`}
                                onClick={() => handleDeleteProperty(selectedProperty.id)}
                            >
                                {isDeleting ? 'Deleting...' : 'Delete Property'}
                            </button>
                            <button
                                type="button"
                                disabled={isDeleting}
                                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                                onClick={() => setShowDeleteModal(false)}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-semibold mb-4">My Properties</h1>
            {loading && <LoadingSpinner />}
            {error && <p className="text-red-500">{error}</p>}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {properties.map((property) => (
                    <div
                        key={property.id}
                        className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                    >
                        <img
                            src={property.images[0] || 'https://via.placeholder.com/400x200?text=No+Image'}
                            alt={property.name}
                            className="w-full h-48 object-cover"
                        />
                        <div className="p-4">
                            <div className="flex justify-between items-start mb-2">
                                <h2 className="text-xl font-semibold">{property.name}</h2>
                                <span className={`px-2 py-1 rounded-full text-sm ${property.status === 'A' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                    }`}>
                                    {property.status === 'A' ? 'Active' : 'Inactive'}
                                </span>
                            </div>

                            <p className="text-gray-600 mb-3">{property.address}</p>

                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div className="flex items-center text-gray-600">
                                    <span className="font-semibold mr-2">Eircode:</span>
                                    {property.eircode}
                                </div>
                                <div className="flex items-center text-gray-600">
                                    <span className="font-semibold mr-2">Postal Code:</span>
                                    {property.postalCode}
                                </div>
                                <div className="flex items-center text-gray-600">
                                    <span className="font-semibold mr-2">Area:</span>
                                    {property.area} m²
                                </div>
                                <div className="flex items-center text-gray-600">
                                    <span className="font-semibold mr-2">Energy Rating:</span>
                                    {property.energyRatings}
                                </div>
                            </div>

                            <div className="flex justify-between items-center mb-4">
                                <div className="flex space-x-4">
                                    <div className="flex items-center text-gray-600 space-x-2">
                                        <FaBed />
                                        <span> {property.bedrooms} beds</span>
                                    </div>
                                    <div className="flex items-center text-gray-600 space-x-2">
                                        <FaBath />
                                        <span>{property.bathrooms} baths</span>
                                    </div>
                                </div>
                                <div className="text-gray-600">
                                    <span className="font-semibold">Available from:</span>
                                    <br />
                                    {new Date(property.availableFrom).toLocaleDateString()}
                                </div>
                            </div>

                            <div className="mb-4">
                                <h3 className="text-sm font-semibold text-gray-700 mb-2">Amenities:</h3>
                                <div className="flex flex-wrap gap-2">
                                    {property.amenities.map((amenity, index) => (
                                        <span
                                            key={index}
                                            className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs"
                                        >
                                            {amenity}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="border-t pt-4">
                                <div className="flex justify-between items-center mb-4">
                                    <div>
                                        <p className="text-2xl font-bold text-[#E67E22]">€{property.rent}/month</p>
                                        <p className="text-sm text-gray-600">Deposit: €{property.deposit}</p>
                                    </div>
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => handleUpdateProperty(property)}
                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                                            title="Edit Property"
                                        >
                                            <FaEdit className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={() => {
                                                setSelectedProperty(property);
                                                setShowDeleteModal(true);
                                            }}
                                            className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                                            title="Delete Property"
                                        >
                                            <FaTrash className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                                <div className="text-xs text-gray-500">
                                    Posted on: {new Date(property.postedOn).toLocaleDateString()}
                                    {property.modifiedOn && ` • Modified: ${new Date(property.modifiedOn).toLocaleDateString()}`}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            {showDeleteModal && <DeleteModal />}
        </div>
    );
};

export default MyProperties; 