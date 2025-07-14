
import React, { useState } from 'react';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import StatsCards from '@/components/dashboard/StatsCards';
import CreateProjectButton from '@/components/dashboard/CreateProjectButton';
import RecentProjects from '@/components/dashboard/RecentProjects';
import CommunityResources from '@/components/dashboard/CommunityResources';
import { AIAssistant } from '@/components/ai/AIAssistant';
import { Button } from '@/components/ui/button';
import { Bot, X } from 'lucide-react';

const Dashboard = () => {
  const [showAIAssistant, setShowAIAssistant] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-accent">
      <DashboardHeader />
      
      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        <StatsCards />
        <CreateProjectButton />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <RecentProjects />
          </div>
          <div className="space-y-6">
            <CommunityResources />
            
            {/* AI助手入口 */}
            <div className="bg-card rounded-lg p-4 border">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold flex items-center gap-2">
                  <Bot className="h-5 w-5 text-primary" />
                  AI教学助手
                </h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                随时为您提供教学设计建议和资源生成
              </p>
              <Button 
                onClick={() => setShowAIAssistant(true)}
                className="w-full"
                variant="outline"
              >
                <Bot className="h-4 w-4 mr-2" />
                开启AI助手
              </Button>
            </div>
          </div>
        </div>
      </main>

      {/* AI助手浮层 */}
      {showAIAssistant && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-4xl max-h-[90vh] relative">
            <Button
              variant="ghost"
              size="icon"
              className="absolute -top-12 right-0 z-10"
              onClick={() => setShowAIAssistant(false)}
            >
              <X className="h-4 w-4" />
            </Button>
            <AIAssistant mode="chat" />
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
