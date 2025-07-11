import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingDown, Target, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { ROASParameters } from "@/pages/Index";

interface BreakevenEvolutionTableProps {
  parameters: ROASParameters;
  breakevenROAS: number;
  getLTVAdjustedBreakevenROAS: (numRepeats: number, repeatRate: number) => number;
}

export const BreakevenEvolutionTable = ({
  parameters,
  breakevenROAS,
  getLTVAdjustedBreakevenROAS
}: BreakevenEvolutionTableProps) => {
  const scenarios = [
    { repeats: 0, rate: 0, label: "No Repeats" },
    { repeats: 1, rate: 25, label: "1 repeat @ 25%" },
    { repeats: 1, rate: 50, label: "1 repeat @ 50%" },
    { repeats: 2, rate: 50, label: "2 repeats @ 50%" },
    { repeats: 3, rate: 50, label: "3 repeats @ 50%" },
    { repeats: 2, rate: 75, label: "2 repeats @ 75%" },
    { repeats: 5, rate: 50, label: "5 repeats @ 50%" },
  ];

  const getReductionPercentage = (ltvAdjusted: number) => {
    return ((breakevenROAS - ltvAdjusted) / breakevenROAS) * 100;
  };

  const getBrandAdvantage = (ltvAdjusted: number) => {
    const currentROAS = parameters.currentROAS;
    if (currentROAS >= ltvAdjusted && currentROAS < breakevenROAS) {
      return "LTV makes profitable";
    } else if (currentROAS >= ltvAdjusted) {
      return "Highly profitable";
    } else {
      return "Still needs improvement";
    }
  };

  const getAdvantageColor = (advantage: string) => {
    switch (advantage) {
      case "LTV makes profitable":
        return "text-blue-600 font-medium";
      case "Highly profitable":
        return "text-green-600 font-medium";
      default:
        return "text-orange-600";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <TrendingDown className="w-5 h-5 text-blue-600" />
          Breakeven ROAS Evolution with LTV
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          How your required breakeven ROAS decreases as repeat purchases increase
        </p>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-border">
            <thead>
              <tr className="bg-indigo-600 text-white">
                <th className="border border-border p-3 text-left font-medium">
                  Repeat Scenario
                </th>
                <th className="border border-border p-3 text-center font-medium">
                  Static Breakeven ROAS
                </th>
                <th className="border border-border p-3 text-center font-medium">
                  LTV-Adjusted Breakeven
                </th>
                <th className="border border-border p-3 text-center font-medium">
                  ROAS Reduction
                </th>
                <th className="border border-border p-3 text-center font-medium">
                  Brand Advantage
                </th>
              </tr>
            </thead>
            <tbody>
              {scenarios.map((scenario, index) => {
                const ltvAdjusted = getLTVAdjustedBreakevenROAS(scenario.repeats, scenario.rate);
                const reduction = getReductionPercentage(ltvAdjusted);
                const advantage = getBrandAdvantage(ltvAdjusted);
                const isBaseline = scenario.repeats === 0;
                
                return (
                  <tr
                    key={index}
                    className={cn(
                      "hover:bg-muted/50",
                      isBaseline && "bg-gray-50",
                      advantage === "LTV makes profitable" && "bg-blue-50",
                      advantage === "Highly profitable" && "bg-green-50"
                    )}
                  >
                    <td className="border border-border p-3 font-medium">
                      <div className="flex items-center gap-2">
                        {isBaseline ? (
                          <Target className="w-4 h-4 text-gray-500" />
                        ) : advantage === "LTV makes profitable" ? (
                          <Zap className="w-4 h-4 text-blue-500" />
                        ) : advantage === "Highly profitable" ? (
                          <TrendingDown className="w-4 h-4 text-green-500" />
                        ) : (
                          <div className="w-4 h-4" />
                        )}
                        {scenario.label}
                        {isBaseline && (
                          <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded">
                            Baseline
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="border border-border p-3 text-center font-medium">
                      {breakevenROAS.toFixed(2)}
                    </td>
                    <td className="border border-border p-3 text-center font-medium">
                      <span className={cn(
                        isBaseline ? "text-gray-600" : "text-blue-600"
                      )}>
                        {ltvAdjusted.toFixed(2)}
                      </span>
                    </td>
                    <td className="border border-border p-3 text-center">
                      <span className={cn(
                        "font-medium",
                        isBaseline ? "text-gray-600" : "text-green-600"
                      )}>
                        {isBaseline ? "0%" : `-${reduction.toFixed(1)}%`}
                      </span>
                    </td>
                    <td className="border border-border p-3 text-center">
                      <span className={getAdvantageColor(advantage)}>
                        {advantage}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Key Insights */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-medium text-blue-900 mb-2 flex items-center gap-2">
              <Target className="w-4 h-4" />
              Current Position
            </h4>
            <p className="text-sm text-blue-800">
              Your current ROAS of <strong>{parameters.currentROAS}</strong> vs baseline breakeven of{" "}
              <strong>{breakevenROAS.toFixed(2)}</strong>
            </p>
          </div>
          
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <h4 className="font-medium text-green-900 mb-2 flex items-center gap-2">
              <Zap className="w-4 h-4" />
              LTV Opportunity
            </h4>
            <p className="text-sm text-green-800">
              With 2 repeats @ 50%, your breakeven drops to{" "}
              <strong>{getLTVAdjustedBreakevenROAS(2, 50).toFixed(2)}</strong>
              {" "}({getReductionPercentage(getLTVAdjustedBreakevenROAS(2, 50)).toFixed(0)}% reduction)
            </p>
          </div>
        </div>

        <div className="mt-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
          <h4 className="font-medium text-purple-900 mb-2">Mathematical Foundation</h4>
          <p className="text-sm text-purple-800">
            <strong>LTV-Adjusted Breakeven ROAS</strong> = Static Breakeven ÷ (1 + Repeat Purchases × Repeat Rate)
            <br />
            Example: {breakevenROAS.toFixed(2)} ÷ (1 + 2 × 0.50) = {getLTVAdjustedBreakevenROAS(2, 50).toFixed(2)}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};