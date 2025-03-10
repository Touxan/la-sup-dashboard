
import { useState } from "react";
import { SecurityGroup, FirewallRule } from "@/pages/SecurityGroups";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Trash2, ArrowDownUp } from "lucide-react";

interface CreateSecurityGroupFormProps {
  initialData: SecurityGroup | null;
  isEditing: boolean;
  onSubmit: (data: Omit<SecurityGroup, "id" | "createdAt">) => void;
  onCancel: () => void;
}

export const CreateSecurityGroupForm = ({
  initialData,
  isEditing,
  onSubmit,
  onCancel,
}: CreateSecurityGroupFormProps) => {
  const [name, setName] = useState(initialData?.name || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [rules, setRules] = useState<FirewallRule[]>(
    initialData?.rules || []
  );

  // New rule form state
  const [newRule, setNewRule] = useState<Omit<FirewallRule, "id">>({
    direction: "inbound",
    protocol: "tcp",
    ports: "",
    source: "",
    action: "allow",
    description: "",
  });

  const addRule = () => {
    if (!newRule.ports || !newRule.source) return;

    const rule: FirewallRule = {
      id: `rule-${Math.random().toString(36).substring(2, 9)}`,
      ...newRule,
    };

    setRules([...rules, rule]);
    // Reset form
    setNewRule({
      direction: "inbound",
      protocol: "tcp",
      ports: "",
      source: "",
      action: "allow",
      description: "",
    });
  };

  const removeRule = (id: string) => {
    setRules(rules.filter((rule) => rule.id !== id));
  };

  const handleSubmit = () => {
    if (!name) return;

    onSubmit({
      name,
      description,
      rules,
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Group Name</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Web Servers"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Input
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Security group for web servers"
          />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-2">Firewall Rules</h3>
        <div className="mb-4 bg-gray-50 bg-opacity-50 p-4 rounded-md border">
          <h4 className="text-sm font-medium mb-3">Add New Rule</h4>
          <div className="grid grid-cols-4 gap-2 mb-2">
            <div>
              <Label htmlFor="direction" className="text-xs">Direction</Label>
              <select
                id="direction"
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                value={newRule.direction}
                onChange={(e) => setNewRule({ ...newRule, direction: e.target.value as "inbound" | "outbound" })}
              >
                <option value="inbound">Inbound</option>
                <option value="outbound">Outbound</option>
              </select>
            </div>
            <div>
              <Label htmlFor="protocol" className="text-xs">Protocol</Label>
              <select
                id="protocol"
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                value={newRule.protocol}
                onChange={(e) => setNewRule({ ...newRule, protocol: e.target.value as "tcp" | "udp" | "icmp" | "all" })}
              >
                <option value="tcp">TCP</option>
                <option value="udp">UDP</option>
                <option value="icmp">ICMP</option>
                <option value="all">All</option>
              </select>
            </div>
            <div>
              <Label htmlFor="ports" className="text-xs">Ports</Label>
              <Input
                id="ports"
                className="h-9"
                value={newRule.ports}
                onChange={(e) => setNewRule({ ...newRule, ports: e.target.value })}
                placeholder="80,443 or 22-100 or all"
              />
            </div>
            <div>
              <Label htmlFor="source" className="text-xs">Source/Destination</Label>
              <Input
                id="source"
                className="h-9"
                value={newRule.source}
                onChange={(e) => setNewRule({ ...newRule, source: e.target.value })}
                placeholder="0.0.0.0/0 or 10.0.0.0/8"
              />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 mb-2">
            <div>
              <Label htmlFor="action" className="text-xs">Action</Label>
              <select
                id="action"
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                value={newRule.action}
                onChange={(e) => setNewRule({ ...newRule, action: e.target.value as "allow" | "deny" })}
              >
                <option value="allow">Allow</option>
                <option value="deny">Deny</option>
              </select>
            </div>
            <div className="col-span-2">
              <Label htmlFor="rule-description" className="text-xs">Description</Label>
              <Input
                id="rule-description"
                className="h-9"
                value={newRule.description}
                onChange={(e) => setNewRule({ ...newRule, description: e.target.value })}
                placeholder="Allow web traffic"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <Button 
              onClick={addRule} 
              size="sm" 
              disabled={!newRule.ports || !newRule.source}
            >
              <Plus className="h-4 w-4 mr-1" /> Add Rule
            </Button>
          </div>
        </div>

        {rules.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">Direction</TableHead>
                <TableHead className="w-[80px]">Protocol</TableHead>
                <TableHead className="w-[100px]">Ports</TableHead>
                <TableHead className="w-[140px]">Source/Dest</TableHead>
                <TableHead className="w-[80px]">Action</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rules.map((rule) => (
                <TableRow key={rule.id}>
                  <TableCell>
                    <div className="flex items-center">
                      <ArrowDownUp className={`h-3 w-3 mr-1 ${
                        rule.direction === "inbound" ? "text-green-500 rotate-90" : "text-amber-500 -rotate-90"
                      }`} />
                      {rule.direction === "inbound" ? "In" : "Out"}
                    </div>
                  </TableCell>
                  <TableCell className="uppercase">{rule.protocol}</TableCell>
                  <TableCell>{rule.ports}</TableCell>
                  <TableCell>
                    <span className="truncate block max-w-[140px]">{rule.source}</span>
                  </TableCell>
                  <TableCell>
                    <span className={`text-xs font-medium px-2 py-1 rounded-md ${
                      rule.action === "allow" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    }`}>
                      {rule.action}
                    </span>
                  </TableCell>
                  <TableCell>{rule.description}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-red-600"
                      onClick={() => removeRule(rule.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-4 text-sm text-gray-500">
            No rules added yet. Add a rule using the form above.
          </div>
        )}
      </div>

      <div className="flex justify-end gap-2 mt-6">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} disabled={!name}>
          {isEditing ? "Update" : "Create"} Security Group
        </Button>
      </div>
    </div>
  );
};
