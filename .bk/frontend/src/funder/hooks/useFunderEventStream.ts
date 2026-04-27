import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';

export function useFunderEventStream() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const token = localStorage.getItem('access_token');

  useEffect(() => {
    // Only connect if user is a funder
    if (!user || user.role !== 'FUNDER' || !token) return;

    // Connect seamlessly through Vite proxy removing hardcoded ports
    const eventSource = new EventSource(`/api/funder/stream?token=${token}`);

    eventSource.onopen = () => {
      console.log('SSE Stream established to Funder EventBus.');
    };

    eventSource.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data);
        
        switch (payload.type) {
          case 'CONNECTED':
            console.log(payload.message);
            break;
            
          case 'INVALIDATE':
            if (Array.isArray(payload.keys)) {
              payload.keys.forEach((key: string) => {
                console.log(`[SSE] Invalidating cache for: ${key}`);
                queryClient.invalidateQueries({ queryKey: [key] });
              });
            }
            break;

          case 'TOAST':
            if (payload.variant === 'success') {
              toast.success(payload.message);
            } else if (payload.variant === 'error') {
              toast.error(payload.message);
            } else {
              toast(payload.message);
            }
            break;

          default:
            console.log('Unhandled SSE payload:', payload);
        }
      } catch (err) {
        // Ping keeping alive emits non-JSON empty strings sometimes
      }
    };

    eventSource.onerror = (error) => {
      console.error('SSE Stream Error:', error);
      // EventSource tries to reconnect automatically via browser defaults
    };

    return () => {
      eventSource.close();
      console.log('SSE Stream closed.');
    };
  }, [user, token, queryClient]);
}
