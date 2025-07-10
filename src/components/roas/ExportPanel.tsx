import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Share2, FileText, Table, Link } from "lucide-react";
import { toast } from "sonner";
import { ROASParameters } from "@/pages/Index";

interface ExportPanelProps {
  parameters: ROASParameters;
  breakevenROAS: number;
}

export const ExportPanel = ({ parameters, breakevenROAS }: ExportPanelProps) => {
  const generateShareableURL = () => {
    const baseURL = window.location.origin + window.location.pathname;
    const params = new URLSearchParams({
      margin: parameters.netGrossMargin.toString(),
      roas: parameters.currentROAS.toString(),
      aov: parameters.averageOrderValue.toString(),
      horizon: parameters.timeHorizon.toString(),
      platform: parameters.platform
    });
    return `${baseURL}?${params.toString()}`;
  };

  const handleCopyLink = async () => {
    try {
      const url = generateShareableURL();
      await navigator.clipboard.writeText(url);
      toast.success("Shareable link copied to clipboard!");
    } catch (error) {
      toast.error("Failed to copy link");
    }
  };

  const handleDownloadReport = () => {
    // Generate a simple text report
    const report = `
ROAS Sensitivity Analysis Report
Generated on: ${new Date().toLocaleDateString()}

Parameters:
- Net Gross Margin: ${parameters.netGrossMargin}%
- Current ROAS: ${parameters.currentROAS}
- Average Order Value: $${parameters.averageOrderValue}
- Time Horizon: ${parameters.timeHorizon} days
- Platform: ${parameters.platform}

Key Metrics:
- Breakeven ROAS: ${breakevenROAS.toFixed(2)}
- Status: ${parameters.currentROAS >= breakevenROAS ? 'Profitable' : 'Needs Optimization'}

Recommendation:
${parameters.currentROAS >= breakevenROAS 
  ? 'Current campaigns are profitable. Focus on scaling.' 
  : `Need ${((breakevenROAS / parameters.currentROAS - 1) * 100).toFixed(1)}% higher repeat rate to break even.`}
    `;

    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `roas-analysis-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success("Report downloaded successfully!");
  };

  const handleExportCSV = () => {
    // Generate sensitivity data for CSV
    const repeatRates = [0, 25, 50, 75, 100];
    const numRepeats = Array.from({ length: 11 }, (_, i) => i);
    
    let csvContent = "Number of Repeats,0%,25%,50%,75%,100%\n";
    
    numRepeats.forEach(repeats => {
      const row = [repeats.toString()];
      repeatRates.forEach(rate => {
        const effectiveROAS = parameters.currentROAS * (1 + (repeats * rate / 100));
        row.push(effectiveROAS.toFixed(2));
      });
      csvContent += row.join(',') + '\n';
    });

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `roas-sensitivity-data-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success("Sensitivity data exported to CSV!");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          Export & Share
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Save and share your analysis
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Export Options */}
        <div className="space-y-3">
          <Button 
            onClick={handleDownloadReport}
            className="w-full justify-start"
            variant="outline"
          >
            <FileText className="w-4 h-4 mr-2" />
            Download Report (TXT)
          </Button>

          <Button 
            onClick={handleExportCSV}
            className="w-full justify-start"
            variant="outline"
          >
            <Table className="w-4 h-4 mr-2" />
            Export Data (CSV)
          </Button>

          <Button 
            onClick={handleCopyLink}
            className="w-full justify-start"
            variant="outline"
          >
            <Link className="w-4 h-4 mr-2" />
            Copy Shareable Link
          </Button>
        </div>

        {/* Current Configuration Summary */}
        <div className="p-3 bg-gray-50 rounded-lg text-sm space-y-1">
          <div className="font-medium mb-2">Current Configuration:</div>
          <div>Platform: {parameters.platform}</div>
          <div>Margin: {parameters.netGrossMargin}%</div>
          <div>ROAS: {parameters.currentROAS}</div>
          <div>AOV: ${parameters.averageOrderValue}</div>
          <div>Horizon: {parameters.timeHorizon} days</div>
        </div>

        {/* Quick Actions */}
        <div className="pt-2 border-t">
          <div className="text-sm font-medium mb-2">Quick Actions:</div>
          <div className="space-y-2">
            <Button 
              size="sm" 
              variant="secondary"
              className="w-full text-xs"
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: 'ROAS Analysis Results',
                    text: `Breakeven ROAS: ${breakevenROAS.toFixed(2)}, Current: ${parameters.currentROAS}`,
                    url: generateShareableURL()
                  });
                } else {
                  handleCopyLink();
                }
              }}
            >
              <Share2 className="w-3 h-3 mr-1" />
              Share Results
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};