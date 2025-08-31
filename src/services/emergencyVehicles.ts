interface EmergencyVehicle {
  id: string;
  type: 'AMBULANCE' | 'FIRE-TRUCK' | 'POLICE';
  routeName: string;
  priority: 1 | 2;
  eta: number; // ETA in minutes
}

export const emergencyVehicles: EmergencyVehicle[] = [
  {
    id: 'AMBULANCE-001',
    type: 'AMBULANCE',
    routeName: 'Hospital Route A - Central to General Hospital',
    priority: 1,
    eta: 3
  },
  {
    id: 'FIRE-TRUCK-005',
    type: 'FIRE-TRUCK',
    routeName: 'Fire Station Route B - Downtown to Industrial',
    priority: 2,
    eta: 7
  },
  {
    id: 'POLICE-003',
    type: 'POLICE',
    routeName: 'Police Route C - Precinct to Highway Access',
    priority: 1,
    eta: 5
  },
  {
    id: 'AMBULANCE-002',
    type: 'AMBULANCE',
    routeName: 'Ambulance Route D - Medical Center to Airport',
    priority: 1,
    eta: 4
  }
];

export function getEmergencyVehicleForRoute(routeName: string): EmergencyVehicle | undefined {
  return emergencyVehicles.find(vehicle => vehicle.routeName === routeName);
}
