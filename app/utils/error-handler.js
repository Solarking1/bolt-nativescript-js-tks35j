export class ErrorHandler {
    static handle(error, context = '') {
        console.error(`[${context}]:`, error);
        
        // Standardize error messages
        const message = this.getReadableMessage(error);
        
        // Log to analytics (implement your analytics service)
        this.logError(error, context);
        
        return message;
    }

    static getReadableMessage(error) {
        if (error.code) {
            switch (error.code) {
                case 'auth/wrong-password':
                    return 'Invalid password. Please try again.';
                case 'auth/user-not-found':
                    return 'No account found with this email.';
                case 'auth/network-request-failed':
                    return 'Network error. Please check your connection.';
                default:
                    return error.message || 'An unexpected error occurred.';
            }
        }
        return error.message || 'An unexpected error occurred.';
    }

    static logError(error, context) {
        // Implement error logging/analytics
        console.error(`[${context}] ${error.code || 'ERROR'}:`, error.message);
    }
}