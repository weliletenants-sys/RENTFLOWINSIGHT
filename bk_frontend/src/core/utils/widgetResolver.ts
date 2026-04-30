import { WIDGET_REGISTRY } from '../widgets/WidgetRegistry';

/**
 * Returns the exact array of widget keys available in the registry.
 * (The WidgetRenderer securely filters out unauthorized widgets using the hook inside the React tree)
 */
export function getWidgetsForUser(): string[] {
  // In the future, this could be driven by a backend feature-flag API or user preference sorting
  return Object.keys(WIDGET_REGISTRY);
}
