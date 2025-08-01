export const CAR_PART_CATEGORIES = [
  'Body Panels & Bumpers',
  'Brakes & Brake System',
  'Car Accessories',
  'Clutch & Gearbox',
  'Cooling System',
  'ECU & Sensors',
  'Electrical & Ignition',
  'Engine & Transmission',
  'Exhaust System',
  'Fuel System',
  'Interior Parts',
  'Lighting',
  'Mirrors & Glass',
  'Suspension & Steering',
  'Wheels & Tyres'
] as const;

export type CarPartCategory = typeof CAR_PART_CATEGORIES[number];

// Category descriptions for better UX
export const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  'Engine & Transmission': 'Engine parts, gearbox, transmission components',
  'Suspension & Steering': 'Shock absorbers, springs, steering components',
  'Brakes & Brake System': 'Brake pads, discs, calipers, brake fluid',
  'Exhaust System': 'Exhaust pipes, mufflers, catalytic converters',
  'Electrical & Ignition': 'Batteries, alternators, spark plugs, wiring',
  'Cooling System': 'Radiators, fans, coolant, thermostats',
  'Fuel System': 'Fuel pumps, injectors, fuel filters',
  'Body Panels & Bumpers': 'Doors, hoods, fenders, bumpers',
  'Lighting': 'Headlights, tail lights, indicators, bulbs',
  'Mirrors & Glass': 'Windscreens, side mirrors, windows',
  'Interior Parts': 'Seats, dashboard, door panels, trim',
  'Wheels & Tyres': 'Alloy wheels, steel wheels, tyres, rims',
  'Clutch & Gearbox': 'Clutch plates, gearbox parts, transmission',
  'ECU & Sensors': 'Engine control units, sensors, diagnostic parts',
  'Car Accessories': 'Floor mats, phone holders, covers, dash cams, air fresheners'
};