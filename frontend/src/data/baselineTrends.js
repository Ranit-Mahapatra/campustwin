export const baselineTrendData = {
  "24h": {
    labels: ["6 AM", "8 AM", "10 AM", "12 PM", "2 PM", "4 PM", "6 PM", "8 PM", "10 PM", "12 AM"],
    aqi: [72, 86, 104, 121, 138, 126, 112, 96, 84, 76],
    temp: [24, 26, 29, 32, 35, 34, 31, 28, 26, 25],
    traffic: [18, 42, 61, 78, 88, 72, 58, 36, 24, 16],
    pm25: [34, 41, 48, 59, 67, 61, 54, 46, 39, 35]
  },
  "7d": {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    aqi: [94, 101, 108, 116, 103, 88, 82],
    temp: [31, 32, 33, 35, 34, 30, 29],
    traffic: [62, 68, 73, 81, 76, 45, 34],
    pm25: [46, 51, 55, 61, 53, 42, 39]
  }
};

export const trendMetricInfo = {
  aqi: { label: "AQI", unit: "", color: "#16877d", bg: "rgba(8,127,118,.07)" },
  temp: { label: "Temperature", unit: "°C", color: "#d5794d", bg: "rgba(213,121,77,.07)" },
  traffic: { label: "Traffic", unit: "%", color: "#5d83bd", bg: "rgba(93,131,189,.07)" },
  pm25: { label: "PM2.5", unit: " µg/m³", color: "#8a6aae", bg: "rgba(138,106,174,.07)" }
};
