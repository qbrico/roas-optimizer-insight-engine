import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ROASParameters } from "@/pages/Index";

interface ROASSensitivityTableProps {
  parameters: ROASParameters;
  breakevenROAS: number;
  getEffectiveROAS: (numRepeats: number, repeatRate: number) => number;
  getROASStatus: (effectiveROAS: number) => string;
  getLTVAdjustedBreakevenROAS: (numRepeats: number, repeatRate: number) => number;
  getLTVAwareROASStatus: (effectiveROAS: number, numRepeats: number, repeatRate: number) => string;
  selectedScenario: { repeats: number; rate: number } | null;
  onScenarioSelect: (scenario: { repeats: number; rate: number } | null) => void;
}

export const ROASSensitivityTable = ({
  parameters,
  breakevenROAS,
  getEffectiveROAS,
  getROASStatus,
  getLTVAdjustedBreakevenROAS,
  getLTVAwareROASStatus,
  selectedScenario,
  onScenarioSelect
}: ROASSensitivityTableProps) => {
  const repeatRates = [0, 25, 50, 75, 100];
  const numRepeats = Array.from({ length: 11 }, (_, i) => i);

  const getCellColor = (status: string, ltvStatus: string, isSelected: boolean) => {
    if (isSelected) {
      return "bg-blue-200 border-blue-400 border-2";
    }
    
    // Enhanced color coding considering LTV awareness
    if (status === "unprofitable" && ltvStatus === "profitable") {
      return "bg-gradient-to-br from-red-100 to-green-100 hover:from-red-150 hover:to-green-150 border-l-4 border-l-green-400";
    }
    
    switch (ltvStatus) {
      case "unprofitable":
        return "bg-red-100 hover:bg-red-150";
      case "breakeven":
        return "bg-yellow-100 hover:bg-yellow-150";
      case "profitable":
        return "bg-green-100 hover:bg-green-150";
      default:
        return "bg-gray-100 hover:bg-gray-150";
    }
  };

  const handleCellClick = (repeats: number, rate: number) => {
    const isCurrentlySelected = selectedScenario?.repeats === repeats && selectedScenario?.rate === rate;
    onScenarioSelect(isCurrentlySelected ? null : { repeats, rate });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          Effective ROAS with Repeat Purchases
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-border">
            <thead>
              <tr className="bg-blue-600 text-white">
                <th className="border border-border p-3 text-left font-medium">
                  Number of<br />Repeat Purchases
                </th>
                {repeatRates.map((rate) => (
                  <th key={rate} className="border border-border p-3 text-center font-medium min-w-[120px]">
                    {rate}%
                  </th>
                ))}
              </tr>
              <tr className="bg-blue-500 text-white text-xs">
                <th className="border border-border p-2"></th>
                {repeatRates.map((rate) => (
                  <th key={rate} className="border border-border p-2 text-center">
                    Effective ROAS<br />
                    <span className="text-blue-200">(LTV-Adjusted Breakeven)</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {numRepeats.map((repeats) => (
                <tr key={repeats}>
                  <td className="border border-border p-3 font-medium text-center bg-gray-50">
                    {repeats}
                  </td>
                  {repeatRates.map((rate) => {
                    const effectiveROAS = getEffectiveROAS(repeats, rate);
                    const status = getROASStatus(effectiveROAS);
                    const ltvAdjustedBreakeven = getLTVAdjustedBreakevenROAS(repeats, rate);
                    const ltvStatus = getLTVAwareROASStatus(effectiveROAS, repeats, rate);
                    const isSelected = selectedScenario?.repeats === repeats && selectedScenario?.rate === rate;
                    
                    return (
                      <td
                        key={rate}
                        className={cn(
                          "border border-border p-2 text-center cursor-pointer transition-colors font-medium",
                          getCellColor(status, ltvStatus, isSelected)
                        )}
                        onClick={() => handleCellClick(repeats, rate)}
                        title={`${repeats} repeats at ${rate}% rate\nEffective ROAS: ${effectiveROAS.toFixed(2)}\nStatic Breakeven: ${breakevenROAS.toFixed(2)}\nLTV-Adjusted Breakeven: ${ltvAdjustedBreakeven.toFixed(2)}\nStatus: ${ltvStatus}`}
                      >
                        <div className="text-sm font-bold">
                          {effectiveROAS.toFixed(2)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          ({ltvAdjustedBreakeven.toFixed(2)})
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Enhanced Legend */}
        <div className="mt-4 space-y-3">
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-100 border border-red-200 rounded"></div>
              <span>Below LTV-Adjusted Breakeven</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-100 border border-yellow-200 rounded"></div>
              <span>At LTV-Adjusted Breakeven</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-100 border border-green-200 rounded"></div>
              <span>Above LTV-Adjusted Breakeven</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gradient-to-r from-red-100 to-green-100 border-l-2 border-l-green-400 rounded"></div>
              <span>LTV Makes Profitable</span>
            </div>
          </div>
          
          <div className="text-xs text-muted-foreground">
            <strong>Reading the table:</strong> Large number = Effective ROAS, Small number = LTV-Adjusted Breakeven ROAS required for that scenario
          </div>
        </div>

        {selectedScenario && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-medium text-blue-900 mb-2">Selected Scenario Analysis</h4>
            <div className="space-y-2 text-sm text-blue-800">
              <p>
                <strong>{selectedScenario.repeats}</strong> repeat purchases at{" "}
                <strong>{selectedScenario.rate}%</strong> repeat rate:
              </p>
              <ul className="ml-4 space-y-1">
                <li>• Effective ROAS: <strong>{getEffectiveROAS(selectedScenario.repeats, selectedScenario.rate).toFixed(2)}</strong></li>
                <li>• Static Breakeven: <strong>{breakevenROAS.toFixed(2)}</strong></li>
                <li>• LTV-Adjusted Breakeven: <strong>{getLTVAdjustedBreakevenROAS(selectedScenario.repeats, selectedScenario.rate).toFixed(2)}</strong></li>
                <li>• Status: <strong>{getLTVAwareROASStatus(getEffectiveROAS(selectedScenario.repeats, selectedScenario.rate), selectedScenario.repeats, selectedScenario.rate)}</strong></li>
              </ul>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};