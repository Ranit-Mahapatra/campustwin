export const INTERVENTION_FACTORS = {
  trees: { label: "Plant trees", icon: "🌳", tempFactor: 4, pmFactor: 18 },
  shade: { label: "Shade structures", icon: "☂", tempFactor: 3, pmFactor: 10 },
  traffic: { label: "Reduce traffic", icon: "🚗", tempFactor: 2, pmFactor: 22 },
  roof: { label: "Cool roofs", icon: "🏢", tempFactor: 3, pmFactor: 5 }
};

export function calculateSimulation({ baseTemp, basePm, intervention, intensityPercent }) {
  const factor = INTERVENTION_FACTORS[intervention] || INTERVENTION_FACTORS.trees;
  const f = intensityPercent / 100;
  const tempDrop = f * factor.tempFactor;
  const pmDrop = Math.round(f * factor.pmFactor);
  const simTemp = Math.max(20, baseTemp - tempDrop);
  const simPm = Math.max(5, basePm - pmDrop);

  return {
    interventionKey: intervention,
    interventionLabel: factor.label,
    intensity: `${intensityPercent}%`,
    intensityValue: intensityPercent,
    tempDrop: Number(tempDrop.toFixed(1)),
    pmDrop,
    simTemp: Number(simTemp.toFixed(1)),
    simPm,
    tempImpactPercent: Math.min(100, tempDrop * 15),
    pmImpactPercent: Math.min(100, pmDrop * 2)
  };
}
