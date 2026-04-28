import { useLocation, useSearchParams } from 'react-router-dom';
import type { Role } from '../contexts/AuthContext';

/**
 * Extracts the user Role by inspecting the current URL.
 * 
 * 1. Checks if the URL path contains a protected zone:
 *    - /funder/ -> 'FUNDER'
 *    - /agent/ -> 'AGENT'
 *    - /tenant/ -> 'TENANT'
 *    - /landlord/ -> 'LANDLORD'
 * 
 * 2. If it's a generic public path (e.g. /signup), it checks for `?role=...` parameter.
 * 
 * 3. Falls back to 'TENANT' if nothing is matched.
 */
export function useRouteRole(): Role {
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const path = location.pathname.toLowerCase();
  
  // 1. Check path segments first (e.g., /funder/onboarding)
  if (path.includes('/funder')) return 'FUNDER';
  if (path.includes('/agent')) return 'AGENT';
  if (path.includes('/landlord')) return 'LANDLORD';
  if (path.includes('/tenant')) return 'TENANT';

  // 2. Fallback to URL query parameters on generic routes (e.g., /signup?role=funder)
  const queryRole = searchParams.get('role')?.toUpperCase();
  if (queryRole === 'FUNDER') return 'FUNDER';
  if (queryRole === 'AGENT') return 'AGENT';
  if (queryRole === 'LANDLORD') return 'LANDLORD';
  if (queryRole === 'TENANT') return 'TENANT';

  // Default fallback
  return 'TENANT';
}
