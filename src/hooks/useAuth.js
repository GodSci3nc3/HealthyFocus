"use client"
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function useAuth() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        try {
            const userData = localStorage.getItem('currentUser');
            if (userData) {
                setUser(JSON.parse(userData));
            }
        } catch (error) {
            console.error('Error parsing user data:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    const login = (userData) => {
        localStorage.setItem('currentUser', JSON.stringify(userData));
        // También guardamos en cookies para el middleware
        document.cookie = `auth_token=${userData.email}; path=/; max-age=86400`; // 24 horas
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem('currentUser');
        document.cookie = 'auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        setUser(null);
        router.push('/login');
    };

    const redirectToLogin = () => {
        router.push('/login');
    };

    return {
        user,
        loading,
        isAuthenticated: !!user,
        login,
        logout,
        redirectToLogin
    };
}

// HOC para proteger rutas
export function withAuth(WrappedComponent) {
    return function AuthenticatedComponent(props) {
        const { user, loading, redirectToLogin } = useAuth();

        useEffect(() => {
            if (!loading && !user) {
                redirectToLogin();
            }
        }, [user, loading, redirectToLogin]);

        if (loading) {
            return (
                <div className="min-h-screen bg-[#faf8f5] flex items-center justify-center">
                    <div className="text-[#2c2c2c] text-xl font-medium">Cargando...</div>
                </div>
            );
        }

        if (!user) {
            return null; // Se está redirigiendo
        }

        return <WrappedComponent {...props} user={user} />;
    };
}