import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, DollarSign, Calendar, Users } from "lucide-react";
import { ROASParameters } from "@/pages/Index";

interface CLVCalculatorProps {
  parameters: ROASParameters;
  timeAdjustment: Record<number, number>;
}

export const CLVCalculator = ({ parameters, timeAdjustment }: CLVCalculatorProps) => {
  const adjustment = timeAdjustment[parameters.timeHorizon] || 1.0;
  const baseRepeatRate = 50.0; // Base 50% repeat rate at 90 days
  const adjustedRepeatRate = (baseRepeatRate * adjustment) / 100;
  
  // CLV Calculations
  const expectedRepeats = adjustedRepeatRate;
  const grossRevenue = parameters.averageOrderValue * (1 + expectedRepeats);
  const grossProfit = grossRevenue * (parameters.netGrossMargin / 100);
  const clvMultiplier = 1 + expectedRepeats;
  
  // Payback calculation
  const adSpend = parameters.averageOrderValue / parameters.currentROAS;
  const paybackPeriod = adSpend / (grossProfit / (1 + expectedRepeats));
  
  const timeHorizonDays = parameters.timeHorizon;
  const timeLabel = timeHorizonDays >= 365 ? `${(timeHorizonDays/365).toFixed(1)} year${timeHorizonDays >= 730 ? 's' : ''}` :
                   timeHorizonDays >= 30 ? `${Math.round(timeHorizonDays/30)} month${timeHorizonDays >= 60 ? 's' : ''}` :
                   `${timeHorizonDays} days`;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          Customer Lifetime Value
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Based on {timeLabel} horizon
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-green-50 p-3 rounded-lg text-center">
            <TrendingUp className="w-5 h-5 text-green-600 mx-auto mb-1" />
            <div className="text-lg font-bold text-green-700">
              {clvMultiplier.toFixed(2)}x
            </div>
            <div className="text-xs text-green-600">CLV Multiplier</div>
          </div>
          
          <div className="bg-blue-50 p-3 rounded-lg text-center">
            <DollarSign className="w-5 h-5 text-blue-600 mx-auto mb-1" />
            <div className="text-lg font-bold text-blue-700">
              ${grossRevenue.toFixed(0)}
            </div>
            <div className="text-xs text-blue-600">Gross Revenue</div>
          </div>
          
          <div className="bg-purple-50 p-3 rounded-lg text-center">
            <Users className="w-5 h-5 text-purple-600 mx-auto mb-1" />
            <div className="text-lg font-bold text-purple-700">
              {(adjustedRepeatRate * 100).toFixed(1)}%
            </div>
            <div className="text-xs text-purple-600">Repeat Rate</div>
          </div>
          
          <div className="bg-orange-50 p-3 rounded-lg text-center">
            <Calendar className="w-5 h-5 text-orange-600 mx-auto mb-1" />
            <div className="text-lg font-bold text-orange-700">
              {paybackPeriod.toFixed(1)}x
            </div>
            <div className="text-xs text-orange-600">Payback Ratio</div>
          </div>
        </div>

        {/* Detailed Breakdown */}
        <div className="space-y-3 text-sm">
          <div className="font-medium border-b pb-1">Revenue Breakdown:</div>
          
          <div className="flex justify-between">
            <span>Initial Purchase:</span>
            <span className="font-medium">${parameters.averageOrderValue}</span>
          </div>
          
          <div className="flex justify-between">
            <span>Expected Repeats:</span>
            <span className="font-medium">{expectedRepeats.toFixed(2)}</span>
          </div>
          
          <div className="flex justify-between">
            <span>Repeat Revenue:</span>
            <span className="font-medium">${(expectedRepeats * parameters.averageOrderValue).toFixed(0)}</span>
          </div>
          
          <div className="flex justify-between border-t pt-2 font-medium">
            <span>Total Revenue:</span>
            <span className="text-green-600">${grossRevenue.toFixed(0)}</span>
          </div>
          
          <div className="flex justify-between">
            <span>Gross Profit ({parameters.netGrossMargin}%):</span>
            <span className="font-medium text-green-700">${grossProfit.toFixed(0)}</span>
          </div>
        </div>

        {/* CLV Impact */}
        <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="text-sm font-medium text-blue-900 mb-1">
            CLV Impact:
          </div>
          <div className="text-xs text-blue-700">
            Repeat purchases increase customer value by {((clvMultiplier - 1) * 100).toFixed(0)}% 
            over {timeLabel}, improving unit economics significantly.
          </div>
        </div>
      </CardContent>
    </Card>
  );
};