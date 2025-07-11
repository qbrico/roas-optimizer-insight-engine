import { useState } from "react";
import { MetricsDashboard } from "@/components/roas/MetricsDashboard";
import { ParametersPanel } from "@/components/roas/ParametersPanel";
import { ROASSensitivityTable } from "@/components/roas/ROASSensitivityTable";
import { TimeHorizonTable } from "@/components/roas/TimeHorizonTable";
import { BreakevenEvolutionTable } from "@/components/roas/BreakevenEvolutionTable";
import { BreakevenChart } from "@/components/roas/BreakevenChart";
import { ScenarioComparison } from "@/components/roas/ScenarioComparison";
import { CLVCalculator } from "@/components/roas/CLVCalculator";
import { WhatIfAnalysis } from "@/components/roas/WhatIfAnalysis";
export interface ROASParameters {
  netGrossMargin: number;
  currentROAS: number;
  averageOrderValue: number;
  timeHorizon: number;
  platform: string;
}
const Index = () => {
  const [parameters, setParameters] = useState<ROASParameters>({
    netGrossMargin: 35,
    currentROAS: 1.9,
    averageOrderValue: 100,
    timeHorizon: 90,
    platform: "Google Ads"
  });
  const [selectedScenario, setSelectedScenario] = useState<{
    repeats: number;
    rate: number;
  } | null>(null);

  // Core calculations
  const breakevenROAS = 1 / (parameters.netGrossMargin / 100);
  const timeAdjustment = {
    7: 0.4,
    14: 0.5,
    30: 0.7,
    60: 0.85,
    90: 1.0,
    180: 1.4,
    365: 1.8
  };
  const getEffectiveROAS = (numRepeats: number, repeatRate: number) => {
    return parameters.currentROAS * (1 + numRepeats * repeatRate / 100);
  };

  // LTV-adjusted breakeven ROAS calculation
  const getLTVAdjustedBreakevenROAS = (numRepeats: number, repeatRate: number) => {
    const ltvMultiplier = 1 + numRepeats * repeatRate / 100;
    return breakevenROAS / ltvMultiplier;
  };
  const getROASStatus = (effectiveROAS: number) => {
    const diff = effectiveROAS - breakevenROAS;
    if (Math.abs(diff) <= 0.05) return "breakeven";
    return diff > 0 ? "profitable" : "unprofitable";
  };

  // Enhanced status that considers LTV-adjusted breakeven
  const getLTVAwareROASStatus = (effectiveROAS: number, numRepeats: number, repeatRate: number) => {
    const ltvAdjustedBreakeven = getLTVAdjustedBreakevenROAS(numRepeats, repeatRate);
    const diff = effectiveROAS - ltvAdjustedBreakeven;
    if (Math.abs(diff) <= 0.05) return "breakeven";
    return diff > 0 ? "profitable" : "unprofitable";
  };
  return <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-foreground">Instacart Breakeven ROAS Calculator</h1>
          <p className="text-lg text-muted-foreground">Understand what is your breakeven ROAS on Instacart and other RMN</p>
        </div>

        {/* Key Metrics Dashboard */}
        <MetricsDashboard parameters={parameters} breakevenROAS={breakevenROAS} />

        {/* Parameters Panel */}
        <ParametersPanel parameters={parameters} onParametersChange={setParameters} />

        {/* Main Analysis Tables */}
        <div className="space-y-8">
          {/* ROAS Sensitivity Table */}
          <ROASSensitivityTable parameters={parameters} breakevenROAS={breakevenROAS} getEffectiveROAS={getEffectiveROAS} getROASStatus={getROASStatus} getLTVAdjustedBreakevenROAS={getLTVAdjustedBreakevenROAS} getLTVAwareROASStatus={getLTVAwareROASStatus} selectedScenario={selectedScenario} onScenarioSelect={setSelectedScenario} />

          {/* Time Horizon Analysis */}
          <TimeHorizonTable parameters={parameters} breakevenROAS={breakevenROAS} timeAdjustment={timeAdjustment} getROASStatus={getROASStatus} getLTVAdjustedBreakevenROAS={getLTVAdjustedBreakevenROAS} />
        </div>

        {/* Breakeven ROAS Evolution Analysis */}
        <BreakevenEvolutionTable parameters={parameters} breakevenROAS={breakevenROAS} getLTVAdjustedBreakevenROAS={getLTVAdjustedBreakevenROAS} />

        {/* Breakeven Visualization */}
        <BreakevenChart parameters={parameters} breakevenROAS={breakevenROAS} getEffectiveROAS={getEffectiveROAS} />

        {/* Analysis Tools Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* What-If Analysis */}
          <WhatIfAnalysis parameters={parameters} breakevenROAS={breakevenROAS} getEffectiveROAS={getEffectiveROAS} />

          {/* CLV Calculator */}
          <CLVCalculator parameters={parameters} timeAdjustment={timeAdjustment} />
        </div>

        {/* Scenario Comparison */}
        <ScenarioComparison currentParameters={parameters} breakevenROAS={breakevenROAS} getEffectiveROAS={getEffectiveROAS} getROASStatus={getROASStatus} />
      </div>
    </div>;
};
export default Index;