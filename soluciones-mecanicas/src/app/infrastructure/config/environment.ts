/**
 * Environment configuration - centralized API URLs
 * This eliminates hardcoded URLs throughout the application
 */
export const environment = {
    production: false,
    apiUrl: 'http://localhost:3000',
    endpoints: {
        users: '/users',
        appointments: '/appointments',
        motorcycles: '/motorcycles',
        services: '/services',
        scheduleConfig: '/scheduleConfig'
    }
};

/**
 * Helper function to get full URL for an endpoint
 */
export function getApiUrl(endpoint: keyof typeof environment.endpoints): string {
    return `${environment.apiUrl}${environment.endpoints[endpoint]}`;
}
