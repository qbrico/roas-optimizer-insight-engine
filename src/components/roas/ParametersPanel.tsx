import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ROASParameters } from "@/pages/Index";

interface ParametersPanelProps {
  parameters: ROASParameters;
  onParametersChange: (params: ROASParameters) => void;
}

export const ParametersPanel = ({ parameters, onParametersChange }: ParametersPanelProps) => {
  const updateParameter = (key: keyof ROASParameters, value: number | string) => {
    onParametersChange({
      ...parameters,
      [key]: value
    });
  };

  const platforms = [
    "Google Ads",
    "Facebook Ads", 
    "Amazon Advertising",
    "Instacart",
    "TikTok Ads",
    "Pinterest Ads",
    "Snapchat Ads",
    "Other"
  ];

  const timeHorizonOptions = [
    { value: 7, label: "7 days" },
    { value: 14, label: "14 days" },
    { value: 30, label: "30 days" },
    { value: 60, label: "60 days" },
    { value: 90, label: "90 days" },
    { value: 180, label: "6 months" },
    { value: 365, label: "1 year" }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Adjust Parameters</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {/* Net Gross Margin */}
          <div className="space-y-3">
            <Label htmlFor="margin" className="text-sm font-medium">
              Net Gross Margin (%)
            </Label>
            <div className="space-y-2">
              <Slider
                value={[parameters.netGrossMargin]}
                onValueChange={([value]) => updateParameter('netGrossMargin', value)}
                max={100}
                min={1}
                step={0.5}
                className="w-full"
              />
              <Input
                id="margin"
                type="number"
                value={parameters.netGrossMargin}
                onChange={(e) => updateParameter('netGrossMargin', parseFloat(e.target.value) || 0)}
                min={1}
                max={100}
                step={0.5}
                className="text-center"
              />
            </div>
          </div>

          {/* Current ROAS */}
          <div className="space-y-3">
            <Label htmlFor="roas" className="text-sm font-medium">
              Current ROAS
            </Label>
            <Input
              id="roas"
              type="number"
              value={parameters.currentROAS}
              onChange={(e) => updateParameter('currentROAS', parseFloat(e.target.value) || 0)}
              min={0.1}
              max={10}
              step={0.1}
              className="text-center"
            />
          </div>

          {/* Average Order Value */}
          <div className="space-y-3">
            <Label htmlFor="aov" className="text-sm font-medium">
              Average Order Value ($)
            </Label>
            <Input
              id="aov"
              type="number"
              value={parameters.averageOrderValue}
              onChange={(e) => updateParameter('averageOrderValue', parseFloat(e.target.value) || 0)}
              min={1}
              step={1}
              className="text-center"
            />
          </div>

          {/* Time Horizon */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">
              Time Horizon
            </Label>
            <Select 
              value={parameters.timeHorizon.toString()} 
              onValueChange={(value) => updateParameter('timeHorizon', parseInt(value))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {timeHorizonOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value.toString()}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Platform */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">
              Platform
            </Label>
            <Select 
              value={parameters.platform} 
              onValueChange={(value) => updateParameter('platform', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {platforms.map((platform) => (
                  <SelectItem key={platform} value={platform}>
                    {platform}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};