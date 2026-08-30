export const baselineRoads = [
  { id: "R-01", name: "Main Gate Road", from: "ITER Main Gate", to: "Parking Lot", traffic: 86, speed: 18, noise: 72, risk: "HIGH" },
  { id: "R-02", name: "Academic Road", from: "A Block", to: "CDS Block", traffic: 61, speed: 27, noise: 64, risk: "MODERATE" },
  { id: "R-03", name: "Hostel Road", from: "Girls' Hostel", to: "Boys' Hostel", traffic: 73, speed: 22, noise: 69, risk: "HIGH" },
  { id: "R-04", name: "Library Road", from: "Central Library", to: "Garden", traffic: 34, speed: 35, noise: 51, risk: "LOW" },
  { id: "R-05", name: "Sports Road", from: "Sports Complex", to: "Cricket Turf", traffic: 48, speed: 31, noise: 57, risk: "MODERATE" }
];

export const roadCoordinates = {
  "R-01": [[20.249881, 85.801412], [20.249637, 85.800384]],
  "R-02": [[20.248372, 85.801789], [20.24942, 85.801369], [20.24983, 85.801269]],
  "R-03": [[20.248372, 85.801636], [20.249255, 85.801125]],
  "R-04": [[20.248145, 85.802286], [20.249984, 85.801979]],
  "R-05": [[20.248728, 85.800167], [20.25009, 85.80038]]
};

export const emergencyEvacuationRoute = {
  path: [[20.249881, 85.801412], [20.24942, 85.801369], [20.248145, 85.802286]],
  incident: { lat: 20.249881, lng: 85.801412, label: "INCIDENT" },
  safeDestination: { lat: 20.248145, lng: 85.802286, label: "SAFE DESTINATION" }
};
