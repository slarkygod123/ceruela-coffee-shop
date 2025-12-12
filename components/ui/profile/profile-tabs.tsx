import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Lock } from "lucide-react";
import { ReactNode } from "react";

interface ProfileTabsProps {
  defaultTab?: string;
  accountTab: ReactNode;
  securityTab: ReactNode;
}

export function ProfileTabs({
  defaultTab = "account",
  accountTab,
  securityTab,
}: ProfileTabsProps) {
  return (
    <Tabs defaultValue={defaultTab} className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="account" className="flex items-center gap-2">
          <User className="h-4 w-4" />
          Account
        </TabsTrigger>
        <TabsTrigger value="security" className="flex items-center gap-2">
          <Lock className="h-4 w-4" />
          Security
        </TabsTrigger>
      </TabsList>

      <TabsContent value="account">{accountTab}</TabsContent>
      <TabsContent value="security">{securityTab}</TabsContent>
    </Tabs>
  );
}