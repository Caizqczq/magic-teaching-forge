
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { BookOpen, Plus, Users, TrendingUp } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const StatsCards = () => {
  const stats = [
    { label: "总项目数", value: "24", icon: BookOpen, color: "text-blue-600" },
    { label: "本月创建", value: "8", icon: Plus, color: "text-green-600" },
    { label: "活跃学生", value: "156", icon: Users, color: "text-purple-600" },
    { label: "教学效果", value: "92%", icon: TrendingUp, color: "text-orange-600" }
  ];

  const handleStatClick = (statLabel: string) => {
    toast({
      title: "统计数据",
      description: `您点击了 ${statLabel}`,
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <Card 
          key={index} 
          className="hover-lift cursor-pointer transition-all duration-300 group animate-fade-in focus-ring"
          onClick={() => handleStatClick(stat.label)}
          style={{ animationDelay: `${index * 0.1}s` }}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleStatClick(stat.label);
            }
          }}
          aria-label={`查看${stat.label}详情`}
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                <p className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors">
                  {stat.value}
                </p>
              </div>
              <div className={`p-2 rounded-lg bg-muted/50 group-hover:bg-primary/10 transition-colors`}>
                <stat.icon className={`h-6 w-6 ${stat.color} group-hover:scale-110 transition-transform`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default StatsCards;
