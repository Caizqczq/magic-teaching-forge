
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

const DashboardHeader = () => {
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    navigate(path);
    toast({
      title: "导航",
      description: `正在跳转到 ${path}...`,
    });
  };

  const handleKnowledgeBase = () => {
    navigate('/knowledge');
    toast({
      title: "知识库",
      description: "正在跳转到知识库...",
    });
  };

  const handleCommunity = () => {
    navigate('/community');
    toast({
      title: "社区",
      description: "正在跳转到社区...",
    });
  };

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate('/')}>
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">魔</span>
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                魔法教学工坊
              </h1>
            </div>
            <nav className="hidden md:flex space-x-6">
              <button 
                onClick={() => handleNavigation('/dashboard')}
                className="text-gray-600 hover:text-gray-900 transition-colors font-medium"
              >
                项目
              </button>
              <button 
                onClick={handleKnowledgeBase}
                className="text-gray-600 hover:text-gray-900 transition-colors font-medium"
              >
                知识库
              </button>
              <button 
                onClick={handleCommunity}
                className="text-gray-600 hover:text-gray-900 transition-colors font-medium"
              >
                社区
              </button>
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-gray-300 rounded-full cursor-pointer hover:bg-gray-400 transition-colors"></div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
