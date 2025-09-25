import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Wand2, Zap, Palette } from "lucide-react";

interface ImageEnhancementSettingsProps {
  backgroundRemovalEnabled: boolean;
  onToggleBackgroundRemoval: (enabled: boolean) => void;
}

const ImageEnhancementSettings = ({
  backgroundRemovalEnabled,
  onToggleBackgroundRemoval,
}: ImageEnhancementSettingsProps) => {
  return (
    <Card className="w-full max-w-md">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Wand2 className="h-5 w-5 text-primary" />
          Image Enhancement
          <Badge variant="secondary" className="text-xs">
            AI-Powered
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between space-x-2">
          <div className="space-y-1">
            <Label htmlFor="background-removal" className="text-sm font-medium">
              Professional Background Removal
            </Label>
            <p className="text-xs text-muted-foreground">
              Automatically enhance car part images with clean backgrounds
            </p>
          </div>
          <Switch
            id="background-removal"
            checked={backgroundRemovalEnabled}
            onCheckedChange={onToggleBackgroundRemoval}
          />
        </div>
        
        {backgroundRemovalEnabled && (
          <div className="space-y-3 pt-2 border-t">
            <div className="text-xs text-muted-foreground font-medium">Features included:</div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs">
                <Zap className="h-3 w-3 text-emerald-500" />
                <span>AI background removal</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <Palette className="h-3 w-3 text-blue-500" />
                <span>Professional gradient backgrounds</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <Wand2 className="h-3 w-3 text-purple-500" />
                <span>Automatic image optimization</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ImageEnhancementSettings;