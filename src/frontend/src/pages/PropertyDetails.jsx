import React from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { FiDroplet, FiCalendar, FiHome } from 'react-icons/fi';
import { FaBed, FaSwimmingPool, FaDumbbell, FaWater, FaShieldAlt, FaVideo, FaFire, FaTree, FaBook, FaGlassMartini, FaParking, FaRegSquare } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { API_PROPERTY_URL } from '../utils/constants';
import { getAuthToken } from '../utils/cookies';

const PropertyDetails = () => {
    const { state } = useLocation();
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const property = state?.property;

    if (!property) {
        return <div>Property not found</div>;
    }

    const handleContactOwner = async () => {

        if (!user) {
            navigate('/login', { state: { from: `/property/${id}` } });
        }

        try {
            const response = await fetch(`${API_PROPERTY_URL}/contact/${property.id}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${getAuthToken()}`,
                }
            });

            if (!response.ok) {
                throw new Error('Failed to contact owner');
            }

            alert('Request sent successfully! The owner will contact you soon.');

        } catch (error) {
            console.error('Error contacting owner:', error);
            alert('Failed to send contact request. Please try again later.');
        }
    };

    return (
        <div className="container mx-auto px-6 py-8">
            {/* Image Gallery */}
            <div className="grid grid-cols-2 gap-4 mb-8">
                {property.images.map((image, index) => (
                    <img
                        key={index}
                        src={image}
                        alt={`${property.name} - Imgid ${index + 1}`}
                        className="w-full h-[400px] object-cover rounded-lg"
                    />
                ))}
            </div>

            {/* Property Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">{property.name}</h1>
                <p className="text-gray-600 mb-2">{property.address}</p>
                <p className="text-gray-600">Eircode: {property.eircode} | Postal Code: {property.postalCode}</p>
            </div>

            {/* Key Details */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="flex items-center bg-gray-100 p-4 rounded-lg">
                    <FaBed className="text-[#E67E22] mr-2" />
                    <span>{property.bedrooms} Bedrooms</span>
                </div>
                <div className="flex items-center bg-gray-100 p-4 rounded-lg">
                    <FiDroplet className="text-[#E67E22] mr-2" />
                    <span>{property.bathrooms} Bathrooms</span>
                </div>
                <div className="flex items-center bg-gray-100 p-4 rounded-lg">
                    <FiHome className="text-[#E67E22] mr-2" />
                    <span>{property.area} m²</span>
                </div>
                <div className="flex items-center bg-gray-100 p-4 rounded-lg">
                    <FiCalendar className="text-[#E67E22] mr-2" />
                    <span>Available from {new Date(property.availableFrom).toLocaleDateString()}</span>
                </div>
            </div>

            {/* Price Details */}
            <div className="bg-white shadow-md rounded-lg p-6 mb-8">
                <h2 className="text-2xl font-bold mb-4">Price Details</h2>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <p className="text-gray-600">Monthly Rent</p>
                        <p className="text-2xl font-bold text-[#E67E22]">€{property.rent}</p>
                    </div>
                    <div>
                        <p className="text-gray-600">Security Deposit</p>
                        <p className="text-2xl font-bold">€{property.deposit}</p>
                    </div>
                </div>
            </div>

            {/* Description */}
            <div className="bg-white shadow-md rounded-lg p-6 mb-8">
                <h2 className="text-2xl font-bold mb-4">Description</h2>
                <p className="text-gray-600">{property.description}</p>
            </div>

            {/* Amenities */}
            <div className="bg-white shadow-md rounded-lg p-6 mb-8">
                <h2 className="text-2xl font-bold mb-4">Amenities</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {property.amenities.map((amenity, index) => (
                        <div key={index} className="flex items-center">
                            {amenity.includes('Washing Machine') && <FaWater className="text-[#E67E22] mr-2" />}
                            {amenity.includes('Gated Security') && <FaShieldAlt className="text-[#E67E22] mr-2" />}
                            {amenity.includes('CCTV') && <FaVideo className="text-[#E67E22] mr-2" />}
                            {amenity.includes('Heater') && <FaFire className="text-[#E67E22] mr-2" />}
                            {amenity.includes('Lawn') && <FaTree className="text-[#E67E22] mr-2" />}
                            {amenity.includes('Gym') && <FaDumbbell className="text-[#E67E22] mr-2" />}
                            {amenity.includes('Library') && <FaBook className="text-[#E67E22] mr-2" />}
                            {amenity.includes('Bar') && <FaGlassMartini className="text-[#E67E22] mr-2" />}
                            {amenity.includes('Parking') && <FaParking className="text-[#E67E22] mr-2" />}
                            {amenity.includes('Pool') && <FaSwimmingPool className="text-[#E67E22] mr-2" />}
                            {!amenity.match(/(Washing Machine|Gated Security|CCTV|Heater|Lawn|Gym|Library|Bar|Parking|Pool)/) &&
                                <FaRegSquare className="text-[#E67E22] mr-2" />
                            }
                            <span>{amenity}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Additional Information */}
            <div className="bg-white shadow-md rounded-lg p-6">
                <h2 className="text-2xl font-bold mb-4">Additional Information</h2>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <p className="text-gray-600">Property Type</p>
                        <p className="font-semibold">{property.propertyType}</p>
                    </div>
                    <div>
                        <p className="text-gray-600">Energy Rating</p>
                        <p className="font-semibold">{property.energyRatings}</p>
                    </div>
                    <div>
                        <p className="text-gray-600">Posted By</p>
                        <p className="font-semibold">{property.postedBy}</p>
                    </div>
                    <div>
                        <p className="text-gray-600">Posted On</p>
                        <p className="font-semibold">{new Date(property.postedOn).toLocaleDateString()}</p>
                    </div>
                </div>
            </div>

            <div className="mt-8 flex justify-center">
                <button
                    onClick={handleContactOwner}
                    className="bg-[#E67E22] text-white px-8 py-3 rounded-md hover:bg-[#D35400] transition-colors duration-300 font-semibold text-lg"
                >
                    Contact Owner
                </button>
            </div>
        </div>
    );
};

export default PropertyDetails; 