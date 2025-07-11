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
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, TrendingUp } from "lucide-react";
import qbrLogo from "@/assets/qbr-logo.png";
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
        {/* Main Title */}
        <div className="text-center space-y-6">
          <div className="space-y-3">
            <h1 className="text-5xl font-bold text-foreground flex items-center justify-center gap-3">
              <span>🥕</span>
              <span>Instacart Breakeven ROAS Calculator</span>
              <span>🥕</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">Instacart ROAS breakeven analysis by QBR Media</p>
            <div className="flex items-center justify-center space-x-2 text-sm font-medium" style={{
            color: 'hsl(var(--instacart-orange))'
          }}>
              <TrendingUp className="h-4 w-4" />
              <span>Optimize • Analyze • Scale</span>
            </div>
          </div>
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

        {/* Call-to-Action Section */}
        <Card className="mx-auto max-w-4xl border-2" style={{
        background: 'linear-gradient(135deg, hsl(var(--instacart-green) / 0.1), hsl(var(--instacart-green) / 0.2))',
        borderColor: 'hsl(var(--instacart-green) / 0.3)',
        boxShadow: '0 10px 30px -10px hsl(var(--instacart-green) / 0.3)'
      }}>
          <CardContent className="p-12 text-center">
            <div className="space-y-6">
              <div className="space-y-3">
                <h2 className="text-3xl font-bold" style={{
                color: 'hsl(var(--foreground))'
              }}>
                  Ready to Optimize Your Instacart ROAS Strategy?
                </h2>
                <p className="text-lg max-w-2xl mx-auto" style={{
                color: 'hsl(var(--foreground) / 0.8)'
              }}>
                  Get personalized insights and strategies from our Instacart advertising experts at QBR Media. 
                  Let's unlock your full potential on retail media networks.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <div className="flex items-center space-x-2 text-sm font-medium" style={{
                color: 'hsl(var(--foreground))'
              }}>
                  <span>🚀</span>
                  <span>Free Strategy Session</span>
                </div>
                <div className="flex items-center space-x-2 text-sm font-medium" style={{
                color: 'hsl(var(--foreground))'
              }}>
                  <span>📈</span>
                  <span>Custom ROAS Optimization</span>
                </div>
                <div className="flex items-center space-x-2 text-sm font-medium" style={{
                color: 'hsl(var(--foreground))'
              }}>
                  <span>🎯</span>
                  <span>Performance Marketing Expertise</span>
                </div>
              </div>

              <Button asChild size="lg" className="text-lg px-8 py-6 font-semibold border-2" style={{
              background: 'hsl(var(--instacart-green))',
              color: 'hsl(var(--foreground))',
              borderColor: 'hsl(var(--foreground))'
            }}>
                <a href="https://surveyn12.typeform.com/to/vVD85yJw" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2">
                  <span>📞</span>
                  <span>Schedule Your Free Consultation</span>
                </a>
              </Button>

              <p className="text-sm" style={{
              color: 'hsl(var(--foreground) / 0.7)'
            }}>Join 20+ brands already scaling with QBR Media</p>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>;
};
export default Index;