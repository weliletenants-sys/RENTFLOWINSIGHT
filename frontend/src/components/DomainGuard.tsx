import React, { useEffect, useState } from 'react';

/**
 * DomainGuard violently enforces network isolation at the UX layer.
 * Even though the backend blocks cross-domain pollution natively,
 * we handle the UX here to prevent white screens or messy 403s.
 */
export const DomainGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [status, setStatus] = useState<'loading' | 'valid' | 'forbidden'>('loading');

    useEffect(() => {
        const host = window.location.hostname;
        const currentPath = window.location.pathname;
        const isAdminDomain = host.startsWith('admin.');
        
        // Let's determine Context based on the URI requested vs Domain active
        const requestingAdminRoute = currentPath.startsWith('/admin') || currentPath.startsWith('/v1/executive');
        
        // 1. If trying to hit Admin Routes on standard Domain
        if (requestingAdminRoute && !isAdminDomain) {
            setStatus('forbidden');
            return;
        }

        // 2. If trying to hit User routes on Admin Domain
        if (!requestingAdminRoute && isAdminDomain && currentPath !== '/login' && currentPath !== '/' && !currentPath.startsWith('/admin')) {
             setStatus('forbidden');
             return;
        }

        setStatus('valid');
    }, []);

    if (status === 'loading') return null;

    if (status === 'forbidden') {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
                 <div className="text-center p-8 border border-red-500/30 bg-red-500/10 rounded-2xl shadow-2xl backdrop-blur-md">
                     <h1 className="text-5xl font-black text-red-500 mb-4">403 FORBIDDEN</h1>
                     <p className="text-gray-300 text-lg mb-6">You are attempting to access a domain-restricted zone from an invalid context.</p>
                     
                     <div className="flex gap-4 justify-center">
                        <button 
                            onClick={() => window.location.href = import.meta.env.VITE_APP_URL || 'http://localhost:5173'}
                            className="px-6 py-3 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-colors"
                        >
                            Go to User Portal
                        </button>
                        <button 
                            onClick={() => window.location.href = import.meta.env.VITE_ADMIN_APP_URL || 'http://admin.localhost:5173'}
                            className="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors"
                        >
                            Go to Executive Portal
                        </button>
                     </div>
                 </div>
            </div>
        );
    }

    // Pass through if the domain context explicitly matches the intended routing tree
    return <>{children}</>;
};
