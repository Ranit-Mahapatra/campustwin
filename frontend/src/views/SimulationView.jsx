import React, { useState } from 'react';
import SimulationControls from '../components/simulation/SimulationControls';
import BeforeAfterComparison from '../components/simulation/BeforeAfterComparison';
import ImpactProgressBars from '../components/simulation/ImpactProgressBars';
import SimulationMetaDetails from '../components/simulation/SimulationMetaDetails';
import PriorityInterventionList from '../components/simulation/PriorityInterventionList';
import { useCampus } from '../context/CampusContext';
import { calculateSimulation } from '../data/simulationFactors';
import { useSimulateMutation } from '../hooks/useCampusApi';

export default function SimulationView() {
  const { zones, selectedZone, selectZoneByCode } = useCampus();
  const [intervention, setIntervention] = useState('trees');
  const [intensity, setIntensity] = useState(50);
  const simulateMutation = useSimulateMutation();

  const [result, setResult] = useState(() =>
    calculateSimulation({
      baseTemp: selectedZone.temp,
      basePm: selectedZone.pm25,
      intervention: 'trees',
      intensityPercent: 50
    })
  );

  const handleRunSimulation = async () => {
    try {
      const sim = await simulateMutation.mutateAsync({
        zone_code: selectedZone.code,
        intervention,
        intensity
      });
      setResult(sim);
    } catch {
      const fallbackSim = calculateSimulation({
        baseTemp: selectedZone.temp,
        basePm: selectedZone.pm25,
        intervention,
        intensityPercent: intensity
      });
      setResult(fallbackSim);
    }
  };

  const handleZoneSelect = (code) => {
    selectZoneByCode(code);
    const target = zones.find((z) => z.code === code) || selectedZone;
    setResult(
      calculateSimulation({
        baseTemp: target.temp,
        basePm: target.pm25,
        intervention,
        intensityPercent: intensity
      })
    );
  };

  return (
    <div>
      <div className="view-header">
        <div className="view-title-group">
          <h2>Digital Twin What-If Intervention Simulator</h2>
          <p>Model the thermal and particulate mitigation impacts of targeted urban greening, shade structures, cool roofs, and traffic dampening across SOA ITER Campus.</p>
        </div>
      </div>

      <div className="dashboard-layout">
        {/* Left Column: Intervention Controls & Output */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <SimulationControls
            zones={zones}
            selectedZone={selectedZone}
            onSelectZone={handleZoneSelect}
            intervention={intervention}
            onSelectIntervention={setIntervention}
            intensity={intensity}
            onIntensityChange={setIntensity}
            onRunSimulation={handleRunSimulation}
          />

          <BeforeAfterComparison baselineZone={selectedZone} result={result} />
          <ImpactProgressBars result={result} />
          <SimulationMetaDetails result={result} selectedZone={selectedZone} />
        </div>

        {/* Right Column: Priority Hotspot Recommendations */}
        <div>
          <PriorityInterventionList onSelectZone={handleZoneSelect} />
        </div>
      </div>
    </div>
  );
}
