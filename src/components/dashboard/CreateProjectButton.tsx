
import React from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CreateProjectButton = () => {
  const navigate = useNavigate();

  return (
    <div className="text-center mb-12 animate-fade-in">
      <div className="relative inline-block group">
        <Button 
          onClick={() => navigate('/enhanced-create')}
          size="lg"
          className="relative z-10 bg-gradient-primary hover:opacity-90 text-white px-12 py-6 text-lg font-semibold rounded-2xl shadow-lg hover:shadow-xl hover-lift transition-all duration-300 focus-ring"
        >
          <Sparkles className="mr-3 h-6 w-6" />
          AI智能创建教学项目
        </Button>
        <div className="absolute -inset-1 bg-gradient-primary rounded-2xl blur opacity-25 group-hover:opacity-40 transition-opacity duration-300 pointer-events-none"></div>
      </div>
      <p className="text-muted-foreground mt-4 text-lg">
        AI驱动的智能教学设计平台
      </p>
    </div>
  );
};

export default CreateProjectButton;
