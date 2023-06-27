const mapping: Record<string, string> = {
  'check-ins': 'check_in',
  events: 'event',
  organizations: 'organization',
  users: 'user',
};

export function convertRouteToEntityUtil(route: string) {
  return mapping[route] || route;
}
