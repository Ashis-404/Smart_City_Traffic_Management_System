interface EmergencyRoute {
  name: string;
  intersections: string[];
}

export const emergencyRoutes: EmergencyRoute[] = [
  {
    name: 'Hospital Route A - Central to General Hospital',
    intersections: ['Traffic Light 1', 'Traffic Light 2', 'Traffic Light 6']
  },
  {
    name: 'Fire Station Route B - Downtown to Industrial',
    intersections: ['Traffic Light 6', 'Traffic Light 4', 'Traffic Light 5']
  },
  {
    name: 'Police Route C - Precinct to Highway Access',
    intersections: ['Traffic Light 3', 'Traffic Light 4', 'Traffic Light 1']
  },
  {
    name: 'Ambulance Route D - Medical Center to Airport',
    intersections: ['Traffic Light 5', 'Traffic Light 2', 'Traffic Light 3']
  }
];

export function getRouteIntersections(routeName: string): string[] {
  const route = emergencyRoutes.find(r => r.name === routeName);
  return route?.intersections || [];
}
