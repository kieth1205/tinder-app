import { Platform } from 'react-native';

// Define base API URL
const API_BASE_URL = process.env.API_BASE_URL || 'https://lldttsmt-9981.asse.devtunnels.ms';

console.log("API_BASE_URL", API_BASE_URL)

// Define token storage keys
const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

// HTTP request methods
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

// Request options type
interface RequestOptions {
  method?: HttpMethod;
  body?: any;
  headers?: Record<string, string>;
  requireAuth?: boolean;
}

// Response type
interface ApiResponse<T = any> {
  data: T | null;
  error: string | null;
  status: number;
}

// Simple token storage implementation
class TokenStorage {
  private static accessToken: string | null = null;
  private static refreshToken: string | null = null;

  // For web platform, use localStorage
  private static saveToLocalStorage(key: string, token: string): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(key, token);
    }
  }

  private static getFromLocalStorage(key: string): string | null {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem(key);
    }
    return null;
  }

  private static removeFromLocalStorage(key: string): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(key);
    }
  }

  // Public methods that handle both native and web platforms
  public static async saveAccessToken(token: string): Promise<void> {
    this.accessToken = token;
    
    // If web, also save to localStorage for persistence
    if (Platform.OS === 'web') {
      this.saveToLocalStorage(ACCESS_TOKEN_KEY, token);
    }
  }

  public static async saveRefreshToken(token: string): Promise<void> {
    this.refreshToken = token;
    
    // If web, also save to localStorage for persistence
    if (Platform.OS === 'web') {
      this.saveToLocalStorage(REFRESH_TOKEN_KEY, token);
    }
  }

  public static async getAccessToken(): Promise<string | null> {
    // For web, try to get from localStorage if not in memory
    if (this.accessToken === null && Platform.OS === 'web') {
      this.accessToken = this.getFromLocalStorage(ACCESS_TOKEN_KEY);
    }
    return this.accessToken;
  }

  public static async getRefreshToken(): Promise<string | null> {
    // For web, try to get from localStorage if not in memory
    if (this.refreshToken === null && Platform.OS === 'web') {
      this.refreshToken = this.getFromLocalStorage(REFRESH_TOKEN_KEY);
    }
    return this.refreshToken;
  }

  public static async removeTokens(): Promise<void> {
    this.accessToken = null;
    this.refreshToken = null;
    
    // If web, also remove from localStorage
    if (Platform.OS === 'web') {
      this.removeFromLocalStorage(ACCESS_TOKEN_KEY);
      this.removeFromLocalStorage(REFRESH_TOKEN_KEY);
    }
  }
}

/**
 * Save authentication tokens to storage
 */
export const saveAuthTokens = async (accessToken: string, refreshToken: string): Promise<void> => {
  try {
    await TokenStorage.saveAccessToken(accessToken);
    await TokenStorage.saveRefreshToken(refreshToken);
  } catch (error) {
    console.error('Error saving auth tokens:', error);
    throw error;
  }
};

/**
 * Get access token from storage
 */
export const getAuthToken = async (): Promise<string | null> => {
  try {
    return await TokenStorage.getAccessToken();
  } catch (error) {
    console.error('Error retrieving access token:', error);
    return null;
  }
};

/**
 * Get refresh token from storage
 */
export const getRefreshToken = async (): Promise<string | null> => {
  try {
    return await TokenStorage.getRefreshToken();
  } catch (error) {
    console.error('Error retrieving refresh token:', error);
    return null;
  }
};

/**
 * Remove authentication tokens from storage
 */
export const removeAuthToken = async (): Promise<void> => {
  try {
    await TokenStorage.removeTokens();
  } catch (error) {
    console.error('Error removing auth tokens:', error);
    throw error;
  }
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = async (): Promise<boolean> => {
  const token = await getAuthToken();
  return !!token;
};

/**
 * Main API request function
 */
export const apiRequest = async <T = any>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<ApiResponse<T>> => {
  try {
    const {
      method = 'GET',
      body,
      headers = {},
      requireAuth = true,
    } = options;

    // Build URL
    const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

    // Default headers
    const defaultHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Platform': Platform.OS,
    };

    // Add authentication header if required
    if (requireAuth) {
      const token = await getAuthToken();
      if (!token) {
        return {
          data: null,
          error: 'Authentication required',
          status: 401,
        };
      }
      defaultHeaders['Authorization'] = `Bearer ${token}`;
    }

    // Merge custom headers with default headers
    const requestHeaders = { ...defaultHeaders, ...headers };

    // Build request options
    const requestOptions: RequestInit = {
      method,
      headers: requestHeaders,
    };

    // Add request body if present
    if (body && method !== 'GET') {
      requestOptions.body = JSON.stringify(body);
    }

    // Make the request
    const response = await fetch(url, requestOptions);
    const status = response.status;

    // Parse response data
    let data = null;
    let error = null;

    try {
      // Try to parse as JSON
      if (response.headers.get('Content-Type')?.includes('application/json')) {
        data = await response.json();
      } else {
        // Handle text response
        data = await response.text();
      }
    } catch (e) {
      // Handle empty or invalid JSON responses
      data = null;
    }

    // Handle error responses
    if (!response.ok) {
      error = data?.message || data?.error || response.statusText || 'Unknown error';
      
      return {
        data: null,
        error,
        status,
      };
    }

    return {
      data,
      error: null,
      status,
    };
  } catch (error: any) {
    // Handle network errors
    return {
      data: null,
      error: error.message || 'Network error',
      status: 0,
    };
  }
};

/**
 * Upload file(s) to the server
 * @param endpoint API endpoint
 * @param files Array of file objects with uri, name, and type
 * @param formData Additional form data to include with optional fieldName for files
 * @param onProgress Progress callback (0-100)
 */
const uploadFiles = async <T = any>(
  endpoint: string,
  files: Array<{ uri: string; name: string; type: string }>,
  formData: Record<string, any> & { fieldName?: string } = {},
  onProgress?: (progress: number) => void
): Promise<ApiResponse<T>> => {
  try {
    // Build URL
    const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

    // Create form data
    const form = new FormData();

    // Add files to form data
    const fieldName = formData.fieldName || 'file';
    // Remove fieldName from formData to avoid sending it as an additional field
    const { fieldName: _, ...restFormData } = formData;

    // Check if we should append files with array syntax (files[]) or individual fields
    if (fieldName === 'files') {
      // Multiple upload mode (for NestJS FilesInterceptor, which expects 'files')
      files.forEach((file) => {
        form.append(fieldName, {
          uri: file.uri,
          name: file.name,
          type: file.type,
        } as any);
      });
    } else {
      // Single upload mode with indexed fields
      files.forEach((file, index) => {
        form.append(`${fieldName}${index > 0 ? index : ''}`, {
          uri: file.uri,
          name: file.name,
          type: file.type,
        } as any);
      });
    }

    // Add additional form data (excluding fieldName which was already processed)
    Object.keys(restFormData).forEach((key) => {
      form.append(key, restFormData[key]);
    });

    // Get authentication token
    const token = await getAuthToken();
    const headers: Record<string, string> = {
      'Accept': 'application/json',
      'Platform': Platform.OS,
      'Content-Type': 'multipart/form-data',
      // Don't set Content-Type, it will be set automatically with the boundary for multipart/form-data
    };

    if (token){
      // Create headers with authorization
      headers['Authorization'] = `Bearer ${token}`;
    }

    // Make the request
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: form,
    });

    const status = response.status;

    // Parse response data
    let data = null;
    let error = null;

    try {
      data = await response.json();
    } catch (e) {
      data = null;
    }

    // Handle error responses
    if (!response.ok) {
      error = data?.message || data?.error || response.statusText || 'Unknown error';
      
      return {
        data: null,
        error,
        status,
      };
    }

    return {
      data,
      error: null,
      status,
    };
  } catch (error: any) {
    return {
      data: null,
      error: error.message || 'Network error',
      status: 0,
    };
  }
};

/**
 * Convenience methods for different HTTP requests
 */
export const api = {
  get: <T = any>(endpoint: string, options?: Omit<RequestOptions, 'method' | 'body'>) => 
    apiRequest<T>(endpoint, { ...options, method: 'GET' }),
  
  post: <T = any>(endpoint: string, body: any, options?: Omit<RequestOptions, 'method'>) => 
    apiRequest<T>(endpoint, { ...options, method: 'POST', body }),
  
  put: <T = any>(endpoint: string, body: any, options?: Omit<RequestOptions, 'method'>) => 
    apiRequest<T>(endpoint, { ...options, method: 'PUT', body }),
  
  patch: <T = any>(endpoint: string, body: any, options?: Omit<RequestOptions, 'method'>) => 
    apiRequest<T>(endpoint, { ...options, method: 'PATCH', body }),
  
  delete: <T = any>(endpoint: string, options?: Omit<RequestOptions, 'method'>) => 
    apiRequest<T>(endpoint, { ...options, method: 'DELETE' }),
  
  /**
   * Upload files to the server
   * @param endpoint API endpoint
   * @param files Array of file objects with uri, name, and type
   * @param formData Additional form data to include
   * @param onProgress Optional progress callback
   */
  upload: <T = any>(
    endpoint: string,
    files: Array<{ uri: string; name: string; type: string }>,
    formData?: Record<string, any>,
    onProgress?: (progress: number) => void
  ) => uploadFiles<T>(endpoint, files, formData, onProgress),
};

export default api;
