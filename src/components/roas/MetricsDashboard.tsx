import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { ROASParameters } from "@/pages/Index";

interface MetricsDashboardProps {
  parameters: ROASParameters;
  breakevenROAS: number;
}

export const MetricsDashboard = ({ parameters, breakevenROAS }: MetricsDashboardProps) => {
  const currentROAS = parameters.currentROAS;
  const netGrossMargin = parameters.netGrossMargin;
  
  const getStatusIcon = () => {
    const diff = currentROAS - breakevenROAS;
    if (Math.abs(diff) <= 0.05) {
      return <Minus className="w-6 h-6 text-yellow-500" />;
    }
    return diff > 0 ? 
      <TrendingUp className="w-6 h-6 text-green-500" /> : 
      <TrendingDown className="w-6 h-6 text-red-500" />;
  };

  const getStatusColor = () => {
    const diff = currentROAS - breakevenROAS;
    if (Math.abs(diff) <= 0.05) return "text-yellow-600";
    return diff > 0 ? "text-green-600" : "text-red-600";
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="bg-green-50 border-green-200">
        <CardContent className="p-6 text-center">
          <div className="text-3xl font-bold text-green-600 mb-2">
            {netGrossMargin.toFixed(1)}%
          </div>
          <div className="text-sm text-green-700 font-medium">
            Net Gross Margin
          </div>
          <div className="text-xs text-green-600 mt-1">
            (After Trade Spend)
          </div>
        </CardContent>
      </Card>

      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-6 text-center">
          <div className="text-3xl font-bold text-blue-600 mb-2">
            {breakevenROAS.toFixed(2)}
          </div>
          <div className="text-sm text-blue-700 font-medium">
            Breakeven ROAS
          </div>
          <div className="text-xs text-blue-600 mt-1">
            (Single Purchase)
          </div>
        </CardContent>
      </Card>

      <Card className="bg-purple-50 border-purple-200">
        <CardContent className="p-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className={`text-3xl font-bold ${getStatusColor()}`}>
              {currentROAS.toFixed(2)}
            </div>
            {getStatusIcon()}
          </div>
          <div className="text-sm text-purple-700 font-medium">
            Current ROAS
          </div>
          <div className="text-xs text-purple-600 mt-1">
            (Estimated)
          </div>
        </CardContent>
      </Card>
    </div>
  );
};