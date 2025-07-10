import { useState } from "react";
import { MetricsDashboard } from "@/components/roas/MetricsDashboard";
import { ParametersPanel } from "@/components/roas/ParametersPanel";
import { ROASSensitivityTable } from "@/components/roas/ROASSensitivityTable";
import { TimeHorizonTable } from "@/components/roas/TimeHorizonTable";
import { BreakevenChart } from "@/components/roas/BreakevenChart";
import { ScenarioComparison } from "@/components/roas/ScenarioComparison";
import { CLVCalculator } from "@/components/roas/CLVCalculator";
import { WhatIfAnalysis } from "@/components/roas/WhatIfAnalysis";
import { ExportPanel } from "@/components/roas/ExportPanel";

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
    7: 0.4, 14: 0.5, 30: 0.7, 60: 0.85, 
    90: 1.0, 180: 1.4, 365: 1.8
  };

  const getEffectiveROAS = (numRepeats: number, repeatRate: number) => {
    return parameters.currentROAS * (1 + (numRepeats * repeatRate / 100));
  };

  const getROASStatus = (effectiveROAS: number) => {
    const diff = effectiveROAS - breakevenROAS;
    if (Math.abs(diff) <= 0.05) return "breakeven";
    return diff > 0 ? "profitable" : "unprofitable";
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-foreground">
            ROAS Sensitivity Analysis
          </h1>
          <p className="text-lg text-muted-foreground">
            E-commerce Advertising Optimization Dashboard
          </p>
        </div>

        {/* Key Metrics Dashboard */}
        <MetricsDashboard 
          parameters={parameters}
          breakevenROAS={breakevenROAS}
        />

        {/* Parameters Panel */}
        <ParametersPanel 
          parameters={parameters}
          onParametersChange={setParameters}
        />

        {/* Main Analysis Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* ROAS Sensitivity Table */}
          <div className="space-y-4">
            <ROASSensitivityTable
              parameters={parameters}
              breakevenROAS={breakevenROAS}
              getEffectiveROAS={getEffectiveROAS}
              getROASStatus={getROASStatus}
              selectedScenario={selectedScenario}
              onScenarioSelect={setSelectedScenario}
            />
          </div>

          {/* Time Horizon Analysis */}
          <div className="space-y-4">
            <TimeHorizonTable
              parameters={parameters}
              breakevenROAS={breakevenROAS}
              timeAdjustment={timeAdjustment}
              getROASStatus={getROASStatus}
            />
          </div>
        </div>

        {/* Breakeven Visualization */}
        <BreakevenChart
          parameters={parameters}
          breakevenROAS={breakevenROAS}
          getEffectiveROAS={getEffectiveROAS}
        />

        {/* Analysis Tools Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {/* What-If Analysis */}
          <WhatIfAnalysis
            parameters={parameters}
            breakevenROAS={breakevenROAS}
            getEffectiveROAS={getEffectiveROAS}
          />

          {/* CLV Calculator */}
          <CLVCalculator
            parameters={parameters}
            timeAdjustment={timeAdjustment}
          />

          {/* Export Panel */}
          <ExportPanel
            parameters={parameters}
            breakevenROAS={breakevenROAS}
          />
        </div>

        {/* Scenario Comparison */}
        <ScenarioComparison
          currentParameters={parameters}
          breakevenROAS={breakevenROAS}
          getEffectiveROAS={getEffectiveROAS}
          getROASStatus={getROASStatus}
        />
      </div>
    </div>
  );
};

export default Index;