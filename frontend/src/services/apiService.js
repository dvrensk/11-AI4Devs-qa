// API service to handle base URL configuration

// Get the API base URL based on the environment
// When running in Cypress tests, it will use the apiUrl from Cypress environment
const getApiBaseUrl = () => {
    if (window.Cypress) {
        return window.Cypress.env('apiUrl') || 'http://localhost:3010';
    }
    return 'http://localhost:3010';
};

export const API_BASE_URL = getApiBaseUrl();
