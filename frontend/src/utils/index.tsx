interface ErrorWithResponse {
    response?: {
        errors?: Array<{
            message?: string;
            extensions?: {
                code?: string;
            };
        }>;
        status?: number;
    };
    errors?: Array<{
        message?: string;
        extensions?: {
            code?: string;
        };
    }>;
    message?: string;
    status?: number;
}

export function extractErrorMessage(error: unknown): string | null {
    if (!error) return null; // Ensure no false positive when there's no error

    if (typeof error === 'string') {
        try {
            const parsed = JSON.parse(error);
            return extractErrorMessage(parsed);

            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (_) {
            console.error('Error parsing error:', error);
            return error; // Return raw string if not JSON
        }
    }

    const typedError = error as ErrorWithResponse;

    // Extract message only if errors exist
    const rawMessage =
        typedError?.response?.errors?.[0]?.message ||
        typedError?.errors?.[0]?.message ||
        typedError?.message;

    // No valid message? Return null instead of "Unknown error"
    if (!rawMessage) return null;

    const errorCode =
        typedError?.response?.errors?.[0]?.extensions?.code ||
        typedError?.errors?.[0]?.extensions?.code;

    const statusCode = typedError?.response?.status || typedError?.status;

    if (rawMessage?.toLowerCase()?.includes('network error') ||
        rawMessage?.toLowerCase()?.includes('failed to fetch') ||
        rawMessage?.toLowerCase()?.includes('networkerror')) {
        return 'Network error. Please check your connection.';
    }

    if (rawMessage?.toLowerCase()?.includes('temporary failure') ||
        rawMessage?.toLowerCase()?.includes('timeout') ||
        rawMessage?.toLowerCase()?.includes('etimedout') ||
        rawMessage?.toLowerCase()?.includes('econnrefused')) {
        return 'Server connection error. Please try again later.';
    }

    if (errorCode === 'INTERNAL_SERVER_ERROR' || statusCode === 500) {
        return 'Server error. Our team has been notified.';
    }

    if (errorCode === 'UNAUTHENTICATED' || statusCode === 401) {
        return 'Authentication error. Please log in again.';
    }

    if (errorCode === 'FORBIDDEN' || statusCode === 403) {
        return "You don't have permission to perform this action.";
    }

    if (statusCode === 404) {
        return 'Resource not found.';
    }

    if (rawMessage?.toLowerCase()?.includes('already exists') ||
        rawMessage?.toLowerCase()?.includes('duplicate key')) {
        return rawMessage.replace(/\{.*\}/, '').trim();
    }

    if (rawMessage?.toLowerCase()?.includes('validation failed') ||
        rawMessage?.toLowerCase()?.includes('is required')) {
        return 'Please check your form inputs and try again.';
    }

    if (rawMessage?.toLowerCase()?.includes('mongoerror') ||
        rawMessage?.toLowerCase()?.includes('mongodb')) {
        return 'Database error. Please try again later.';
    }

    // Return raw message if it looks user-friendly
    if (rawMessage.length < 100 && !rawMessage.includes('{') && !rawMessage.includes('Error:')) {
        return rawMessage;
    }

    return rawMessage;
}
