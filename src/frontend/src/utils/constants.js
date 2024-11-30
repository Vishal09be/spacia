const API_URL = "http://23266856-spacia-lb-711124799.eu-central-1.elb.amazonaws.com";
const API_VERSION = "/api/v1";
const API_BASE_URL = `${API_URL}${API_VERSION}`;
const API_MASTER_DATA_URL = `${API_BASE_URL}/master`;
const API_REGISTER_URL = `${API_BASE_URL}/auth/register`;
const API_LOGIN_URL = `${API_BASE_URL}/auth/login`;
const API_BOOKING_URL = `${API_BASE_URL}/booking`;
const API_PROPERTY_URL = `${API_BASE_URL}/property`;
const APP_NAME = 'SPACIA'

export {
  API_URL,
  API_VERSION,
  API_LOGIN_URL,
  API_BASE_URL,
  API_MASTER_DATA_URL,
  API_REGISTER_URL,
  API_BOOKING_URL,
  API_PROPERTY_URL,
  APP_NAME
};
