
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { ArrowLeft, TrendingUp, Users, Brain, Target, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const Analytics = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  // 模拟数据
  const difficultyData = [
    { knowledge: '光合作用定义', errorRate: 15, students: 32 },
    { knowledge: '化学方程式', errorRate: 28, students: 32 },
    { knowledge: '光反应过程', errorRate: 35, students: 32 },
    { knowledge: '暗反应过程', errorRate: 42, students: 32 },
    { knowledge: '影响因素', errorRate: 25, students: 32 }
  ];

  const engagementData = [
    { name: '积极参与', value: 68, color: '#10b981' },
    { name: '一般参与', value: 25, color: '#f59e0b' },
    { name: '被动参与', value: 7, color: '#ef4444' }
  ];

  const progressData = [
    { week: '第1周', score: 65 },
    { week: '第2周', score: 72 },
    { week: '第3周', score: 78 },
    { week: '第4周', score: 85 }
  ];

  const insights = [
    {
      title: '知识点难度分析',
      description: '暗反应过程是学生最难掌握的知识点，错误率达42%',
      suggestion: '建议增加暗反应过程的图解说明和互动演示',
      priority: 'high'
    },
    {
      title: '学习参与度观察',
      description: '68%的学生表现出积极的学习态度，整体参与度良好',
      suggestion: '可以设计更多小组讨论环节来提升被动学习者的参与度',
      priority: 'medium'
    },
    {
      title: '学习进度跟踪',
      description: '班级平均成绩呈稳步上升趋势，教学效果显著',
      suggestion: '保持当前教学节奏，可适当增加挑战性内容',
      priority: 'low'
    }
  ];

  const questionCloud = [
    { text: '光反应', size: 24, count: 15 },
    { text: '叶绿体', size: 20, count: 12 },
    { text: 'ATP', size: 18, count: 10 },
    { text: '二氧化碳', size: 16, count: 8 },
    { text: '氧气', size: 14, count: 6 },
    { text: '葡萄糖', size: 22, count: 14 },
    { text: '暗反应', size: 26, count: 18 },
    { text: '化学方程式', size: 12, count: 4 }
  ];

  const handleOptimize = (insightTitle: string) => {
    toast({
      title: "开始优化",
      description: `正在针对"${insightTitle}"进行智能优化...`,
    });
    
    // 模拟优化过程
    setTimeout(() => {
      toast({
        title: "优化完成",
        description: "教学内容已优化，请查看项目详情页面。",
      });
    }, 2000);
  };

  const handleWordClick = (word: string) => {
    toast({
      title: "关键词详情",
      description: `"${word}"相关的学生疑问有${Math.floor(Math.random() * 20 + 5)}条`,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航 */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                onClick={() => navigate('/project/demo')}
                className="text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                返回项目
              </Button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">教学效果分析报告</h1>
                <p className="text-sm text-gray-600">光合作用教学设计 • 数据更新时间：2024-06-25</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-6 space-y-8">
        {/* 核心指标卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200 cursor-pointer hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-600 mb-1">平均正确率</p>
                  <p className="text-3xl font-bold text-blue-800">78%</p>
                  <p className="text-xs text-blue-600 mt-1">较上次提升5%</p>
                </div>
                <Target className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200 cursor-pointer hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-600 mb-1">AI助教互动</p>
                  <p className="text-3xl font-bold text-green-800">156</p>
                  <p className="text-xs text-green-600 mt-1">次提问解答</p>
                </div>
                <Brain className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200 cursor-pointer hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-purple-600 mb-1">学习活跃度</p>
                  <p className="text-3xl font-bold text-purple-800">92%</p>
                  <p className="text-xs text-purple-600 mt-1">学生参与率</p>
                </div>
                <Zap className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200 cursor-pointer hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-orange-600 mb-1">班级人数</p>
                  <p className="text-3xl font-bold text-orange-800">32</p>
                  <p className="text-xs text-orange-600 mt-1">人参与学习</p>
                </div>
                <Users className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 知识点难点排行 */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="mr-2 h-5 w-5 text-red-500" />
                知识点难点排行
              </CardTitle>
              <CardDescription>按错误率从高到低排列</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={difficultyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="knowledge" angle={-45} textAnchor="end" height={80} />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value}%`, '错误率']} />
                  <Bar dataKey="errorRate" fill="#ef4444" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* 学生参与度分布 */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="mr-2 h-5 w-5 text-blue-500" />
                学生参与度分布
              </CardTitle>
              <CardDescription>基于课堂互动和作业完成情况</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={engagementData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {engagementData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}%`, '占比']} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex justify-center space-x-6 mt-4">
                {engagementData.map((item, index) => (
                  <div key={index} className="flex items-center cursor-pointer hover:opacity-80">
                    <div 
                      className="w-3 h-3 rounded-full mr-2"
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="text-sm text-gray-600">{item.name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 学习进度趋势 */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="mr-2 h-5 w-5 text-green-500" />
              学习进度趋势
            </CardTitle>
            <CardDescription>班级平均成绩变化趋势</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={progressData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis domain={[0, 100]} />
                <Tooltip formatter={(value) => [`${value}分`, '平均成绩']} />
                <Line 
                  type="monotone" 
                  dataKey="score" 
                  stroke="#10b981" 
                  strokeWidth={3}
                  dot={{ fill: '#10b981', strokeWidth: 2, r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* 学生疑问词云 */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle>学生疑问热词</CardTitle>
            <CardDescription>基于AI助教的问答记录生成</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap justify-center items-center gap-4 py-8">
              {questionCloud.map((word, index) => (
                <span
                  key={index}
                  className="inline-block px-3 py-1 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full text-center cursor-pointer hover:shadow-md transition-all hover:scale-110"
                  style={{ 
                    fontSize: `${word.size}px`,
                    color: `hsl(${240 + index * 30}, 70%, 50%)`,
                    fontWeight: Math.min(700, 400 + word.count * 20)
                  }}
                  onClick={() => handleWordClick(word.text)}
                >
                  {word.text}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* AI智能洞察与建议 */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Brain className="mr-2 h-5 w-5 text-purple-500" />
              AI智能洞察与建议
            </CardTitle>
            <CardDescription>基于学习数据的智能分析和优化建议</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {insights.map((insight, index) => (
              <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h4 className="font-semibold text-gray-900">{insight.title}</h4>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        insight.priority === 'high' ? 'bg-red-100 text-red-800' :
                        insight.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {insight.priority === 'high' ? '高优先级' :
                         insight.priority === 'medium' ? '中优先级' : '低优先级'}
                      </span>
                    </div>
                    <p className="text-gray-700 mb-2">{insight.description}</p>
                    <p className="text-sm text-blue-600">{insight.suggestion}</p>
                  </div>
                  <Button 
                    size="sm"
                    className="ml-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                    onClick={() => handleOptimize(insight.title)}
                  >
                    一键优化
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;
