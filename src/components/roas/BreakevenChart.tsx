import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { ROASParameters } from "@/pages/Index";

interface BreakevenChartProps {
  parameters: ROASParameters;
  breakevenROAS: number;
  getEffectiveROAS: (numRepeats: number, repeatRate: number) => number;
}

export const BreakevenChart = ({ parameters, breakevenROAS, getEffectiveROAS }: BreakevenChartProps) => {
  const repeatRates = [25, 50, 75];
  const numRepeats = Array.from({ length: 11 }, (_, i) => i);

  const data = numRepeats.map(repeats => {
    const dataPoint: any = { repeats };
    
    repeatRates.forEach(rate => {
      dataPoint[`${rate}%`] = getEffectiveROAS(repeats, rate);
    });
    
    return dataPoint;
  });

  const colors = {
    "25%": "#60a5fa", // blue-400
    "50%": "#34d399", // emerald-400
    "75%": "#a78bfa"  // violet-400
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          Breakeven Visualization
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Effective ROAS vs. Breakeven Line - How repeat purchases impact profitability
        </p>
      </CardHeader>
      <CardContent>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis 
                dataKey="repeats" 
                label={{ value: 'Number of Repeat Purchases', position: 'insideBottom', offset: -10 }}
                stroke="#64748b"
              />
              <YAxis 
                label={{ value: 'Effective ROAS', angle: -90, position: 'insideLeft' }}
                stroke="#64748b"
                domain={['dataMin - 0.5', 'dataMax + 0.5']}
              />
              <Tooltip 
                formatter={(value: number, name: string) => [value.toFixed(2), `${name} Repeat Rate`]}
                labelFormatter={(label) => `${label} Repeat Purchases`}
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              
              {/* Breakeven Reference Line */}
              <ReferenceLine 
                y={breakevenROAS} 
                stroke="#ef4444" 
                strokeDasharray="5 5" 
                strokeWidth={2}
                label={{ value: `Breakeven: ${breakevenROAS.toFixed(2)}`, position: "insideTopRight" }}
              />
              
              {/* Current ROAS Reference Line */}
              <ReferenceLine 
                y={parameters.currentROAS} 
                stroke="#6b7280" 
                strokeDasharray="3 3" 
                strokeWidth={1}
                label={{ value: `Current: ${parameters.currentROAS.toFixed(2)}`, position: "insideBottomRight" }}
              />

              {repeatRates.map(rate => (
                <Line
                  key={rate}
                  type="monotone"
                  dataKey={`${rate}%`}
                  stroke={colors[`${rate}%` as keyof typeof colors]}
                  strokeWidth={3}
                  dot={{ fill: colors[`${rate}%` as keyof typeof colors], strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: colors[`${rate}%` as keyof typeof colors], strokeWidth: 2 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-4 flex flex-wrap gap-4 text-sm">
          {repeatRates.map(rate => (
            <div key={rate} className="flex items-center gap-2">
              <div 
                className="w-4 h-4 rounded-full border-2" 
                style={{ backgroundColor: colors[`${rate}%` as keyof typeof colors] }}
              ></div>
              <span>{rate}% Repeat Rate</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};