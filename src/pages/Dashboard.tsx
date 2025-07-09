
import React from 'react';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import StatsCards from '@/components/dashboard/StatsCards';
import CreateProjectButton from '@/components/dashboard/CreateProjectButton';
import RecentProjects from '@/components/dashboard/RecentProjects';
import CommunityResources from '@/components/dashboard/CommunityResources';

const Dashboard = () => {
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
          <div>
            <CommunityResources />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
