import { useAuth, type Role } from '../../contexts/AuthContext';
import { ROLE_PERMISSIONS } from '../../config/roles';
import type { Permission } from '../../config/permissions';

export function usePermissions() {
  const { user } = useAuth();

  // If there's no user, they have no permissions
  const userRole = user?.role as NonNullable<Role> | undefined;
  
  // Resolve user permissions from their role
  const userPermissions: Permission[] = userRole && ROLE_PERMISSIONS[userRole] 
    ? ROLE_PERMISSIONS[userRole] 
    : [];

  const can = (required: Permission | Permission[]) => {
    // Super admins can do everything
    if (userPermissions.includes('*')) return true;

    if (Array.isArray(required)) {
      // If passing an array of required permissions, the user needs at least ONE of them
      return required.some(p => userPermissions.includes(p));
    }

    // Checking a single permission
    return userPermissions.includes(required as Permission);
  };

  return { can };
}
