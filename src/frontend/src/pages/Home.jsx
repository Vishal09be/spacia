import React, { useState, useEffect } from 'react';
import { FiSearch, FiHome, FiMap, FiStar } from 'react-icons/fi';
import { API_MASTER_DATA_URL } from '../utils/constants';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  const [location, setLocation] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [masterData, setMasterData] = useState({
    amenities: [],
    propertyType: [],
    locations: [],
    energyRatings: []
  });

  useEffect(() => {
    const fetchMasterData = async () => {
      try {
        const response = await fetch(API_MASTER_DATA_URL);
        const data = await response.json();
        setMasterData(data);
        console.log(data);
      } catch (error) {
        console.error('Error fetching master data:', error);
      }
    };

    fetchMasterData();
  }, []);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (location) params.append('location', location);
    if (propertyType) params.append('propertyType', propertyType);
    
    navigate(`/properties${params.toString() ? `?${params.toString()}` : ''}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Hero Section */}
      <div className="relative h-[600px] bg-cover bg-center"
        style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3")' }}>
        <div className="absolute inset-0 bg-black bg-opacity-50">
          <div className="container mx-auto px-6 py-32 text-center">
            <h1 className="text-5xl font-bold text-white mb-6">
              Find Your Perfect Home in Dublin
            </h1>
            <p className="text-xl text-gray-200 mb-12">
              Discover thousands of rental properties across Dublin's finest locations
            </p>

            {/* Search Bar */}
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <select
                  className="p-3 border rounded-md"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                >
                  <option value="">Select Location</option>
                  {masterData.locations.map(loc => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>

                <select
                  className="p-3 border rounded-md"
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                >
                  <option value="">Property Type</option>
                  {masterData.propertyType.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>

                <button
                  onClick={handleSearch}
                  className="bg-[#E67E22] text-white p-3 rounded-md hover:bg-[#D35400] transition-colors"
                >
                  <FiSearch className="inline mr-2" /> Search Properties
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-6 bg-white rounded-lg shadow-md">
            <FiHome className="text-4xl text-[#E67E22] mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Wide Range of Properties</h3>
            <p className="text-gray-600">From studios to bungalows, find the perfect property that suits your needs</p>
          </div>
          <div className="text-center p-6 bg-white rounded-lg shadow-md">
            <FiMap className="text-4xl text-[#E67E22] mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Prime Locations</h3>
            <p className="text-gray-600">Properties available across all Dublin postal districts</p>
          </div>
          <div className="text-center p-6 bg-white rounded-lg shadow-md">
            <FiStar className="text-4xl text-[#E67E22] mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Premium Amenities</h3>
            <p className="text-gray-600">Modern facilities including security, gym, and parking</p>
          </div>
        </div>
      </div>

      {/* Popular Amenities */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">Popular Amenities</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {masterData.amenities.map((amenity) => (
              <div key={amenity} className="flex items-center p-4 border rounded-lg">
                <div className="w-3 h-3 bg-[#E67E22] rounded-full mr-3"></div>
                <span>{amenity}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Energy Ratings Section */}
      <div className="container mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-8">Energy Efficiency Ratings</h2>
        <div className="flex flex-wrap justify-center gap-4">
          {masterData.energyRatings.map((rating) => (
            <div key={rating}
              className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-md">
              {rating}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;