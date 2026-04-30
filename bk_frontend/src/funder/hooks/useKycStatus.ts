import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';

export type KycStatus = 'NOT_SUBMITTED' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED';

export function useKycStatus() {
  const { user } = useAuth();
  const [status, setStatus] = useState<KycStatus>('NOT_SUBMITTED');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Only fetch if we have an authenticated user
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchStatus = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const res = await fetch('/api/funder/kyc/status', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!res.ok) {
          throw new Error('Failed to fetch KYC status');
        }

        const data = await res.json();
        
        // Ensure robust fallback mapping
        const fetchedStatus = data?.data?.kyc_status as KycStatus || 'NOT_SUBMITTED';
        setStatus(fetchedStatus);
        
        // Optional: Keep localStorage in sync for older components that might still read it synchronously
        localStorage.setItem('kyc_status', fetchedStatus);
      } catch (err: any) {
        console.error('KYC Status Fetch Error:', err);
        setError(err.message || 'Error checking verification status');
        
        // Fallback to local storage if API fails
        const localStatus = localStorage.getItem('kyc_status') as KycStatus;
        if (localStatus) setStatus(localStatus);
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
  }, [user]);

  return { status, loading, error, setStatus };
}
