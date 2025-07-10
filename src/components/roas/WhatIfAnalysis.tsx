import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { ROASParameters } from "@/pages/Index";

interface WhatIfAnalysisProps {
  parameters: ROASParameters;
  breakevenROAS: number;
  getEffectiveROAS: (numRepeats: number, repeatRate: number) => number;
}

export const WhatIfAnalysis = ({ parameters, breakevenROAS, getEffectiveROAS }: WhatIfAnalysisProps) => {
  const [whatIfRate, setWhatIfRate] = useState(50);
  
  const effectiveROAS = getEffectiveROAS(1, whatIfRate);
  const neededRate = Math.max(0, ((breakevenROAS / parameters.currentROAS) - 1) * 100);
  
  const getStatusIcon = () => {
    const diff = effectiveROAS - breakevenROAS;
    if (Math.abs(diff) <= 0.05) {
      return <Minus className="w-5 h-5 text-yellow-500" />;
    }
    return diff > 0 ? 
      <TrendingUp className="w-5 h-5 text-green-500" /> : 
      <TrendingDown className="w-5 h-5 text-red-500" />;
  };

  const getStatusColor = () => {
    const diff = effectiveROAS - breakevenROAS;
    if (Math.abs(diff) <= 0.05) return "text-yellow-600";
    return diff > 0 ? "text-green-600" : "text-red-600";
  };

  const getStatusText = () => {
    const diff = effectiveROAS - breakevenROAS;
    if (Math.abs(diff) <= 0.05) return "At Breakeven";
    return diff > 0 ? "Profitable" : "Unprofitable";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          What-If Analysis
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Interactive scenario modeling
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* What-If Slider */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">
            What if repeat rate was {whatIfRate}%?
          </Label>
          <Slider
            value={[whatIfRate]}
            onValueChange={([value]) => setWhatIfRate(value)}
            max={100}
            min={0}
            step={5}
            className="w-full"
          />
        </div>

        {/* Results */}
        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Effective ROAS</span>
              {getStatusIcon()}
            </div>
            <div className={`text-2xl font-bold ${getStatusColor()}`}>
              {effectiveROAS.toFixed(2)}
            </div>
            <div className="text-sm text-muted-foreground">
              {getStatusText()}
            </div>
          </div>

          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="text-sm font-medium text-blue-900 mb-1">
              To break even, you need:
            </div>
            <div className="text-lg font-bold text-blue-700">
              {neededRate.toFixed(1)}% repeat rate
            </div>
            <div className="text-xs text-blue-600 mt-1">
              With just 1 repeat purchase
            </div>
          </div>

          {/* Scenario Insights */}
          <div className="space-y-2 text-sm">
            <div className="font-medium">Scenario Impact:</div>
            {whatIfRate >= neededRate ? (
              <div className="text-green-700 bg-green-50 p-2 rounded">
                ✅ This repeat rate would make your campaigns profitable!
              </div>
            ) : (
              <div className="text-red-700 bg-red-50 p-2 rounded">
                ❌ You need {(neededRate - whatIfRate).toFixed(1)}% higher repeat rate for profitability.
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};