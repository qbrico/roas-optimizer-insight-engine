import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ROASParameters } from "@/pages/Index";

interface ROASSensitivityTableProps {
  parameters: ROASParameters;
  breakevenROAS: number;
  getEffectiveROAS: (numRepeats: number, repeatRate: number) => number;
  getROASStatus: (effectiveROAS: number) => string;
  selectedScenario: { repeats: number; rate: number } | null;
  onScenarioSelect: (scenario: { repeats: number; rate: number } | null) => void;
}

export const ROASSensitivityTable = ({
  parameters,
  breakevenROAS,
  getEffectiveROAS,
  getROASStatus,
  selectedScenario,
  onScenarioSelect
}: ROASSensitivityTableProps) => {
  const repeatRates = [0, 25, 50, 75, 100];
  const numRepeats = Array.from({ length: 11 }, (_, i) => i);

  const getCellColor = (status: string, isSelected: boolean) => {
    if (isSelected) {
      return "bg-blue-200 border-blue-400 border-2";
    }
    
    switch (status) {
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
                  <th key={rate} className="border border-border p-3 text-center font-medium min-w-[80px]">
                    {rate}%
                  </th>
                ))}
              </tr>
              <tr className="bg-blue-500 text-white text-sm">
                <th className="border border-border p-2"></th>
                {repeatRates.map((rate) => (
                  <th key={rate} className="border border-border p-2 text-center">
                    Repeat Purchase Rate
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
                    const isSelected = selectedScenario?.repeats === repeats && selectedScenario?.rate === rate;
                    
                    return (
                      <td
                        key={rate}
                        className={cn(
                          "border border-border p-3 text-center cursor-pointer transition-colors font-medium",
                          getCellColor(status, isSelected)
                        )}
                        onClick={() => handleCellClick(repeats, rate)}
                        title={`${repeats} repeats at ${rate}% rate = ${effectiveROAS.toFixed(2)} ROAS (${status})`}
                      >
                        {effectiveROAS.toFixed(2)}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Legend */}
        <div className="mt-4 flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-100 border border-red-200 rounded"></div>
            <span>Below Breakeven (Unprofitable)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-100 border border-yellow-200 rounded"></div>
            <span>At Breakeven</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-100 border border-green-200 rounded"></div>
            <span>Above Breakeven (Profitable)</span>
          </div>
        </div>

        {selectedScenario && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-medium text-blue-900 mb-2">Selected Scenario</h4>
            <p className="text-sm text-blue-800">
              <strong>{selectedScenario.repeats}</strong> repeat purchases at{" "}
              <strong>{selectedScenario.rate}%</strong> repeat rate produces an effective ROAS of{" "}
              <strong>{getEffectiveROAS(selectedScenario.repeats, selectedScenario.rate).toFixed(2)}</strong>
              {" "}({getROASStatus(getEffectiveROAS(selectedScenario.repeats, selectedScenario.rate))})
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};