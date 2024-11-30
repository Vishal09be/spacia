// Page to display all properties listed by users based on search parameters

import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { FiUsers, FiDroplet } from 'react-icons/fi';
import { FaBed } from "react-icons/fa";
import LoadingSpinner from '../components/LoadingSpinner';
import { API_PROPERTY_URL } from '../utils/constants';

const Properties = () => {
    const [searchParams] = useSearchParams();
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProperties = async () => {
            try {
                const location = searchParams.get('location');
                const propertyType = searchParams.get('propertyType');

                const response = await fetch(API_PROPERTY_URL);
                let data = await response.json();

                if (location) {
                    data = data.filter(property =>
                        property.postalCode.toLowerCase().includes(location.toLowerCase())
                    );
                }
                if (propertyType) {
                    data = data.filter(property =>
                        property.propertyType.toLowerCase() === propertyType.toLowerCase()
                    );
                }

                setProperties(data);
            } catch (error) {
                console.error('Error fetching properties:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProperties();
    }, [searchParams]);

    const handlePropertyClick = (property) => {
        navigate(`/property/${property.id}`, { state: { property } });
    };

    if (loading) {
        return <LoadingSpinner />;
    }

    return (
        <div className="container mx-auto px-6 py-8">
            <h1 className="text-3xl font-bold mb-8">Available Properties</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {properties.map((property) => (
                    <div
                        key={property.id}
                        className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer"
                        onClick={() => handlePropertyClick(property)}
                    >
                        <img
                            src={property.images[0]}
                            alt={property.name}
                            className="w-full h-48 object-cover"
                        />
                        <div className="p-4">
                            <h2 className="text-xl font-semibold mb-2">{property.name}</h2>
                            <p className="text-gray-600 mb-4">{property.address}</p>

                            <div className="flex justify-between mb-4">
                                <div className="flex items-center">
                                    <FiUsers className="mr-1" />
                                    <span>{property.bedrooms} beds</span>
                                </div>
                                <div className="flex items-center">
                                    <FiDroplet className="mr-1" />
                                    <span>{property.bathrooms} baths</span>
                                </div>
                                <div className="flex items-center">
                                    <FaBed className="mr-1" />
                                    <span>{property.area} m²</span>
                                </div>
                            </div>

                            <div className="flex justify-between items-center">
                                <span className="text-2xl font-bold text-[#E67E22]">€{property.rent}/month</span>
                                <div className="bg-[#E67E22] text-white px-4 py-2 rounded-md hover:bg-[#D35400]">
                                    View Details
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Properties; 