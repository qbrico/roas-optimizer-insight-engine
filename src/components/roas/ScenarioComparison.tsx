import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { ROASParameters } from "@/pages/Index";

interface ScenarioComparisonProps {
  currentParameters: ROASParameters;
  breakevenROAS: number;
  getEffectiveROAS: (numRepeats: number, repeatRate: number) => number;
  getROASStatus: (effectiveROAS: number) => string;
}

interface Scenario {
  name: string;
  parameters: ROASParameters;
  color: string;
  description: string;
}

export const ScenarioComparison = ({ 
  currentParameters, 
  breakevenROAS, 
  getEffectiveROAS, 
  getROASStatus 
}: ScenarioComparisonProps) => {
  const [activeScenarios, setActiveScenarios] = useState<Scenario[]>([]);

  const presetScenarios: Scenario[] = [
    {
      name: "Conservative",
      parameters: {
        ...currentParameters,
        netGrossMargin: 25,
        currentROAS: 1.5,
        timeHorizon: 30
      },
      color: "red",
      description: "Low margin, short horizon"
    },
    {
      name: "Realistic", 
      parameters: {
        ...currentParameters,
        netGrossMargin: 35,
        currentROAS: 1.9,
        timeHorizon: 90
      },
      color: "blue",
      description: "Industry standard metrics"
    },
    {
      name: "Optimistic",
      parameters: {
        ...currentParameters,
        netGrossMargin: 45,
        currentROAS: 2.5,
        timeHorizon: 180
      },
      color: "green", 
      description: "High margin, long horizon"
    }
  ];

  const addScenario = (scenario: Scenario) => {
    if (activeScenarios.find(s => s.name === scenario.name)) {
      setActiveScenarios(activeScenarios.filter(s => s.name !== scenario.name));
    } else {
      setActiveScenarios([...activeScenarios, scenario]);
    }
  };

  const calculateScenarioMetrics = (params: ROASParameters) => {
    const scenarioBreakeven = 1 / (params.netGrossMargin / 100);
    const effectiveROASWith1Repeat = getEffectiveROAS(1, 50); // 1 repeat at 50% rate
    const status = getROASStatus(effectiveROASWith1Repeat);
    const neededRepeatRate = Math.max(0, ((scenarioBreakeven / params.currentROAS) - 1) * 100);
    
    return {
      breakeven: scenarioBreakeven,
      effectiveROAS: effectiveROASWith1Repeat,
      status,
      neededRepeatRate
    };
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "profitable":
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      case "breakeven":
        return <Minus className="w-4 h-4 text-yellow-600" />;
      default:
        return <TrendingDown className="w-4 h-4 text-red-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variant = status === "profitable" ? "default" : status === "breakeven" ? "secondary" : "destructive";
    return <Badge variant={variant} className="text-xs">{status}</Badge>;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          Scenario Comparison
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Compare different parameter combinations side-by-side
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Preset Buttons */}
        <div className="flex flex-wrap gap-2">
          {presetScenarios.map((scenario) => (
            <Button
              key={scenario.name}
              variant={activeScenarios.find(s => s.name === scenario.name) ? "default" : "outline"}
              size="sm"
              onClick={() => addScenario(scenario)}
              className="text-xs"
            >
              {scenario.name}
            </Button>
          ))}
        </div>

        {/* Current Scenario Always Shown */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Current Scenario */}
            <div className="p-4 border-2 border-blue-200 bg-blue-50 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-blue-900">Current</h4>
                {getStatusBadge(getROASStatus(getEffectiveROAS(1, 50)))}
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Margin:</span>
                  <span className="font-medium">{currentParameters.netGrossMargin}%</span>
                </div>
                <div className="flex justify-between">
                  <span>ROAS:</span>
                  <span className="font-medium">{currentParameters.currentROAS}</span>
                </div>
                <div className="flex justify-between">
                  <span>Breakeven:</span>
                  <span className="font-medium">{breakevenROAS.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Horizon:</span>
                  <span className="font-medium">{currentParameters.timeHorizon}d</span>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-blue-200">
                <div className="flex items-center justify-between">
                  <span className="text-xs">Effective ROAS (1 repeat @ 50%):</span>
                  {getStatusIcon(getROASStatus(getEffectiveROAS(1, 50)))}
                </div>
                <div className="text-lg font-bold text-blue-700">
                  {getEffectiveROAS(1, 50).toFixed(2)}
                </div>
              </div>
            </div>

            {/* Active Scenarios */}
            {activeScenarios.map((scenario) => {
              const metrics = calculateScenarioMetrics(scenario.parameters);
              
              return (
                <div key={scenario.name} className={`p-4 border-2 rounded-lg bg-${scenario.color}-50 border-${scenario.color}-200`}>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className={`font-semibold text-${scenario.color}-900`}>{scenario.name}</h4>
                    {getStatusBadge(metrics.status)}
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Margin:</span>
                      <span className="font-medium">{scenario.parameters.netGrossMargin}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>ROAS:</span>
                      <span className="font-medium">{scenario.parameters.currentROAS}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Breakeven:</span>
                      <span className="font-medium">{metrics.breakeven.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Horizon:</span>
                      <span className="font-medium">{scenario.parameters.timeHorizon}d</span>
                    </div>
                  </div>

                  <div className={`mt-3 pt-3 border-t border-${scenario.color}-200`}>
                    <div className="flex items-center justify-between">
                      <span className="text-xs">Effective ROAS (1 repeat @ 50%):</span>
                      {getStatusIcon(metrics.status)}
                    </div>
                    <div className={`text-lg font-bold text-${scenario.color}-700`}>
                      {metrics.effectiveROAS.toFixed(2)}
                    </div>
                    {metrics.status !== "profitable" && (
                      <div className="text-xs text-muted-foreground mt-1">
                        Need {metrics.neededRepeatRate.toFixed(1)}% repeat rate
                      </div>
                    )}
                  </div>

                  <div className="mt-2">
                    <div className="text-xs text-muted-foreground">{scenario.description}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {activeScenarios.length > 0 && (
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium mb-2">Comparison Insights:</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• Higher margins significantly reduce the repeat rate needed for profitability</li>
              <li>• Longer time horizons allow for more repeat purchases to accumulate</li>
              <li>• Platform choice affects baseline ROAS expectations</li>
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};