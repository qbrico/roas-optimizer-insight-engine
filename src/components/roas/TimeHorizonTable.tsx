import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { ROASParameters } from "@/pages/Index";

interface TimeHorizonTableProps {
  parameters: ROASParameters;
  breakevenROAS: number;
  timeAdjustment: Record<number, number>;
  getROASStatus: (effectiveROAS: number) => string;
  getLTVAdjustedBreakevenROAS: (numRepeats: number, repeatRate: number) => number;
}

export const TimeHorizonTable = ({
  parameters,
  breakevenROAS,
  timeAdjustment,
  getROASStatus,
  getLTVAdjustedBreakevenROAS
}: TimeHorizonTableProps) => {
  const timeHorizons = [
    { days: 7, label: "7 days", baseRepeatRate: 10.8 },
    { days: 14, label: "14 days", baseRepeatRate: 16.4 },
    { days: 30, label: "30 days", baseRepeatRate: 25.9 },
    { days: 60, label: "60 days", baseRepeatRate: 39.2 },
    { days: 90, label: "90 days", baseRepeatRate: 50.0 },
    { days: 180, label: "6 months", baseRepeatRate: 75.8 },
    { days: 365, label: "1 year", baseRepeatRate: 85.0 }
  ];

  const calculateMetrics = (horizon: typeof timeHorizons[0]) => {
    const adjustment = timeAdjustment[horizon.days] || 1.0;
    const adjustedRepeatRate = horizon.baseRepeatRate * adjustment;
    const expectedRepeats = adjustedRepeatRate / 100;
    const cumulativeRepeats = expectedRepeats;
    const effectiveROAS = parameters.currentROAS * (1 + cumulativeRepeats);
    const status = getROASStatus(effectiveROAS);
    const roasDiff = effectiveROAS - breakevenROAS;
    
    // Calculate LTV-adjusted breakeven for this scenario
    const ltvAdjustedBreakeven = getLTVAdjustedBreakevenROAS(cumulativeRepeats, 100);
    const ltvRoasDiff = effectiveROAS - ltvAdjustedBreakeven;
    
    return {
      adjustedRepeatRate,
      expectedRepeats,
      cumulativeRepeats,
      effectiveROAS,
      status,
      roasDiff,
      ltvAdjustedBreakeven,
      ltvRoasDiff
    };
  };

  const getStatusIcon = (status: string) => {
    return status === "profitable" ? (
      <CheckCircle className="w-4 h-4 text-green-600" />
    ) : (
      <XCircle className="w-4 h-4 text-red-600" />
    );
  };

  const getStatusText = (status: string, roasDiff: number) => {
    if (status === "profitable") {
      return "✅ Profitable";
    } else {
      return `❌ ${roasDiff.toFixed(2)} ROAS`;
    }
  };

  const getRowColor = (status: string) => {
    switch (status) {
      case "unprofitable":
        return "bg-red-50";
      case "breakeven":
        return "bg-yellow-50";
      case "profitable":
        return "bg-green-50";
      default:
        return "";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          Time Horizon Impact Analysis
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Showing how repeat purchase rates typically vary by measurement window (based on 90-day horizon)
        </p>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-border">
            <thead>
              <tr className="bg-slate-600 text-white">
                <th className="border border-border p-3 text-left font-medium">
                  Time Period
                </th>
                <th className="border border-border p-3 text-center font-medium">
                  Expected Repeat Rate
                </th>
                <th className="border border-border p-3 text-center font-medium">
                  Cumulative Repeats
                </th>
                <th className="border border-border p-3 text-center font-medium">
                  Effective ROAS at<br />Current Performance
                </th>
                <th className="border border-border p-3 text-center font-medium">
                  LTV-Adjusted<br />Breakeven ROAS
                </th>
                <th className="border border-border p-3 text-center font-medium">
                  LTV-Aware Status
                </th>
              </tr>
            </thead>
            <tbody>
              {timeHorizons.map((horizon) => {
                const metrics = calculateMetrics(horizon);
                const isCurrentHorizon = horizon.days === parameters.timeHorizon;
                
                return (
                  <tr
                    key={horizon.days}
                    className={cn(
                      getRowColor(metrics.status),
                      isCurrentHorizon && "ring-2 ring-blue-400 ring-inset"
                    )}
                  >
                    <td className="border border-border p-3 font-medium">
                      {horizon.label}
                      {isCurrentHorizon && (
                        <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          Current
                        </span>
                      )}
                    </td>
                    <td className="border border-border p-3 text-center">
                      {metrics.adjustedRepeatRate.toFixed(1)}%
                    </td>
                    <td className="border border-border p-3 text-center">
                      {metrics.cumulativeRepeats.toFixed(2)}
                    </td>
                    <td className="border border-border p-3 text-center font-medium">
                      {metrics.effectiveROAS.toFixed(2)}
                    </td>
                    <td className="border border-border p-3 text-center font-medium text-blue-600">
                      {metrics.ltvAdjustedBreakeven.toFixed(2)}
                    </td>
                    <td className="border border-border p-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        {getStatusIcon(metrics.ltvRoasDiff > 0 ? "profitable" : "unprofitable")}
                        <span className="text-sm font-medium">
                          {metrics.ltvRoasDiff > 0 ? "✅ Profitable" : `❌ ${metrics.ltvRoasDiff.toFixed(2)} ROAS`}
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="font-medium text-blue-900 mb-2">Key Insights:</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• <strong>Breakeven ROAS</strong> = 1 ÷ Net Gross Margin = 1 ÷ {(parameters.netGrossMargin/100).toFixed(2)} = {breakevenROAS.toFixed(2)}</li>
            <li>• <strong>Current Performance:</strong> At {parameters.currentROAS} ROAS, you need repeat purchases to reach profitability</li>
            <li>• <strong>Mathematical Relationship:</strong> Effective ROAS = Current ROAS × (1 + Repeat Purchases × Repeat Rate)</li>
            <li>• <strong>Critical Threshold:</strong> With 50% repeat rate, just 1 repeat purchase gets you to {(parameters.currentROAS * (1 + 1 * 0.5)).toFixed(2)} ROAS (breakeven)</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};