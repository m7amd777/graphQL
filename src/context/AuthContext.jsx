import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    // Validate JWT by making a test GraphQL query
    const validateToken = async (jwt) => {
        try {
            const query = {
                query: `
                    query {
                        user {
                            id
                            login
                        }
                    }
                `
            };

            const res = await fetch('https://learn.reboot01.com/api/graphql-engine/v1/graphql', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${jwt}`
                },
                body: JSON.stringify(query)
            });

            if (!res.ok) {
                return false;
            }

            const data = await res.json();

            // Check if there are any errors in the response
            if (data.errors) {
                console.error('GraphQL errors:', data.errors);
                return false;
            }

            // If we got user data, the token is valid
            if (data.data && data.data.user) {
                setUser(data.data.user);
                return true;
            }

            return false;
        } catch (error) {
            console.error('Token validation error:', error);
            return false;
        }
    };

    useEffect(() => {
        // Check for existing JWT on mount and validate it
        const checkAuth = async () => {
            const jwt = localStorage.getItem('jwt');
            if (jwt) {
                const isValid = await validateToken(jwt);
                if (isValid) {
                    setToken(jwt);
                    setIsLoggedIn(true);
                } else {
                    // Token is invalid, remove it
                    localStorage.removeItem('jwt');
                }
            }
            setLoading(false);
        };

        checkAuth();
    }, []);

    const login = async (username, password) => {
        const token = btoa(`${username}:${password}`);

        const res = await fetch('https://learn.reboot01.com/api/auth/signin', {
            method: 'POST',
            headers: {
                Authorization: `Basic ${token}`,
            },
        });

        if (!res.ok) {
            throw new Error('Login failed');
        }

        const jwt = await res.json();

        // Validate the new token before storing
        const isValid = await validateToken(jwt);
        if (!isValid) {
            throw new Error('Received invalid token from server');
        }

        localStorage.setItem('jwt', jwt);
        setToken(jwt);
        setIsLoggedIn(true);
        return jwt;
    };

    const logout = () => {
        localStorage.removeItem('jwt');
        setToken(null);
        setUser(null);
        setIsLoggedIn(false);
    };

    const value = {
        isLoggedIn,
        user,
        token,
        loading,
        login,
        logout,
        setUser,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
