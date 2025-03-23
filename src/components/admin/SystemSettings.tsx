
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const SystemSettings = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>System Settings</CardTitle>
        <CardDescription>
          Configure global system settings
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <p>Environment: Production</p>
          <p>API Version: 1.0.3</p>
          <p>Last Backup: 2 days ago</p>
          
          <div className="bg-muted p-4 rounded-md">
            <p className="text-muted-foreground text-sm">
              This is a placeholder for system settings. 
              In a real application, this would contain forms to update various system configurations.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SystemSettings;
