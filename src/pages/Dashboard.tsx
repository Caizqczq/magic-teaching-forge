
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, BookOpen, Clock, Users, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  
  const recentProjects = [
    {
      id: 1,
      title: "光合作用教学设计",
      subject: "生物",
      grade: "高中一年级",
      createdAt: "2024-06-20",
      thumbnail: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=200&fit=crop",
      progress: 100
    },
    {
      id: 2,
      title: "三角函数基础",
      subject: "数学",
      grade: "高中二年级", 
      createdAt: "2024-06-18",
      thumbnail: "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=400&h=200&fit=crop",
      progress: 85
    },
    {
      id: 3,
      title: "中国古代诗歌鉴赏",
      subject: "语文",
      grade: "高中三年级",
      createdAt: "2024-06-15",
      thumbnail: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=200&fit=crop",
      progress: 60
    }
  ];

  const stats = [
    { label: "总项目数", value: "24", icon: BookOpen, color: "text-blue-600" },
    { label: "本月创建", value: "8", icon: Plus, color: "text-green-600" },
    { label: "活跃学生", value: "156", icon: Users, color: "text-purple-600" },
    { label: "教学效果", value: "92%", icon: TrendingUp, color: "text-orange-600" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* 顶部导航栏 */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">魔</span>
                </div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  魔法教学工坊
                </h1>
              </div>
              <nav className="hidden md:flex space-x-6">
                <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">项目</a>
                <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">知识库</a>
                <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">社区</a>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* 统计卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* 创建新项目按钮 */}
        <div className="text-center mb-12">
          <div className="relative">
            <Button 
              onClick={() => navigate('/create')}
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-12 py-6 text-lg font-semibold rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
            >
              <Plus className="mr-3 h-6 w-6" />
              创建新的教学设计
            </Button>
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl blur opacity-25 animate-pulse"></div>
          </div>
          <p className="text-gray-600 mt-4 text-lg">让AI为您生成专业的教学资源</p>
        </div>

        {/* 最近项目 */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">最近的项目</h2>
            <Button variant="outline" className="text-gray-600 hover:text-gray-900">
              查看全部
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentProjects.map((project) => (
              <Card key={project.id} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer">
                <div className="relative overflow-hidden rounded-t-lg">
                  <img 
                    src={project.thumbnail} 
                    alt={project.title}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity"></div>
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button size="sm" variant="secondary" className="bg-white/90 hover:bg-white">
                      打开
                    </Button>
                  </div>
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">
                    {project.title}
                  </CardTitle>
                  <CardDescription className="text-sm text-gray-600">
                    {project.subject} • {project.grade}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {project.createdAt}
                    </div>
                    <span className="text-green-600">{project.progress}% 完成</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full transition-all duration-300"
                      style={{width: `${project.progress}%`}}
                    ></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* 社区热门内容 */}
        <div className="mt-12">
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-none">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-900">社区热门资源</CardTitle>
              <CardDescription>发现其他教师分享的优质教学设计</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <h4 className="font-medium text-gray-900 mb-2">化学实验安全指南</h4>
                  <p className="text-sm text-gray-600 mb-2">适用于高中化学教学</p>
                  <div className="flex items-center text-xs text-gray-500">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">化学</span>
                    <span className="ml-2">1.2k 下载</span>
                  </div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <h4 className="font-medium text-gray-900 mb-2">古诗词情感分析</h4>
                  <p className="text-sm text-gray-600 mb-2">创新的语文教学方法</p>
                  <div className="flex items-center text-xs text-gray-500">
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded">语文</span>
                    <span className="ml-2">956 下载</span>
                  </div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <h4 className="font-medium text-gray-900 mb-2">几何图形可视化</h4>
                  <p className="text-sm text-gray-600 mb-2">互动式数学教学工具</p>
                  <div className="flex items-center text-xs text-gray-500">
                    <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded">数学</span>
                    <span className="ml-2">834 下载</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
