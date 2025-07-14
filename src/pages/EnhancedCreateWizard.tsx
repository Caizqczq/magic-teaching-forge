import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  ArrowLeft, 
  ArrowRight, 
  Sparkles, 
  BookOpen, 
  Image, 
  FileText,
  Mic,
  Brain,
  Search,
  Save,
  Wand2
} from 'lucide-react';
import { AIAssistant } from '@/components/ai/AIAssistant';
import { MediaProcessor } from '@/components/ai/MediaProcessor';
import { SmartSearch } from '@/components/ai/SmartSearch';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface ProjectFormData {
  title: string;
  description: string;
  subject: string;
  grade: string;
  style: string;
  sourceType: string;
  sourceContent: string;
  outputs: string[];
  aiGeneratedContent: {
    chatHistory: any[];
    generatedImages: string[];
    analyzedContent: string;
    searchResults: string;
    summaryContent: string;
  };
}

const subjects = [
  '语文', '数学', '英语', '物理', '化学', '生物', 
  '历史', '地理', '政治', '音乐', '美术', '体育', '信息技术'
];

const grades = [
  '小学一年级', '小学二年级', '小学三年级', '小学四年级', '小学五年级', '小学六年级',
  '初中一年级', '初中二年级', '初中三年级',
  '高中一年级', '高中二年级', '高中三年级'
];

const styles = [
  { value: 'professional', label: '专业严谨', desc: '适合正式教学场景' },
  { value: 'interactive', label: '互动生动', desc: '增强学生参与感' },
  { value: 'inspiring', label: '启发创新', desc: '培养创造性思维' }
];

const outputs = [
  { value: 'lesson_plan', label: '教案设计', icon: BookOpen },
  { value: 'ppt', label: 'PPT课件', icon: FileText },
  { value: 'images', label: '教学图片', icon: Image },
  { value: 'quiz', label: '测验题目', icon: Brain },
  { value: 'audio', label: '音频材料', icon: Mic },
];

export const EnhancedCreateWizard: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<ProjectFormData>({
    title: '',
    description: '',
    subject: '',
    grade: '',
    style: '',
    sourceType: 'topic',
    sourceContent: '',
    outputs: [],
    aiGeneratedContent: {
      chatHistory: [],
      generatedImages: [],
      analyzedContent: '',
      searchResults: '',
      summaryContent: ''
    }
  });
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const totalSteps = 4;
  const progress = (currentStep / totalSteps) * 100;

  const handleInputChange = (field: keyof ProjectFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleOutputToggle = (output: string) => {
    setFormData(prev => ({
      ...prev,
      outputs: prev.outputs.includes(output)
        ? prev.outputs.filter(o => o !== output)
        : [...prev.outputs, output]
    }));
  };

  const handleAIContentGenerated = (type: string, content: any) => {
    setFormData(prev => ({
      ...prev,
      aiGeneratedContent: {
        ...prev.aiGeneratedContent,
        [type === 'chat' ? 'chatHistory' : 
         type === 'generated_image' ? 'generatedImages' :
         type === 'image_analysis' || type === 'audio_transcription' ? 'analyzedContent' :
         type === 'web_search' || type === 'rag_search' ? 'searchResults' :
         'summaryContent']: 
         type === 'generated_image' ? [...prev.aiGeneratedContent.generatedImages, content] :
         type === 'chat' ? [...prev.aiGeneratedContent.chatHistory, content] :
         content
      }
    }));

    // 根据AI生成的内容智能填充表单
    if (type === 'image_analysis' || type === 'audio_transcription') {
      if (!formData.sourceContent) {
        setFormData(prev => ({ ...prev, sourceContent: content }));
      }
    }
  };

  const handleCreateProject = async () => {
    if (!formData.title || !formData.subject || !formData.grade || !formData.style || formData.outputs.length === 0) {
      toast({
        title: "信息不完整",
        description: "请填写所有必要信息",
        variant: "destructive",
      });
      return;
    }

    setIsCreating(true);
    
    try {
      // 这里调用真实的项目创建API
      // const response = await apiService.createProject(formData);
      
      // 模拟创建过程
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "项目创建成功",
        description: "AI正在为您生成教学资源...",
      });
      
      // 跳转到项目详情页
      navigate('/projects/new-project-id');
    } catch (error) {
      toast({
        title: "创建失败",
        description: "请稍后重试",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold">基础信息设置</h2>
              <p className="text-muted-foreground">让我们先了解您的教学需求</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">项目标题 *</label>
                  <Input
                    placeholder="例如：光合作用原理与实验"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">学科 *</label>
                  <Select value={formData.subject} onValueChange={(value) => handleInputChange('subject', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="选择学科" />
                    </SelectTrigger>
                    <SelectContent>
                      {subjects.map(subject => (
                        <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">年级 *</label>
                  <Select value={formData.grade} onValueChange={(value) => handleInputChange('grade', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="选择年级" />
                    </SelectTrigger>
                    <SelectContent>
                      {grades.map(grade => (
                        <SelectItem key={grade} value={grade}>{grade}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">教学风格 *</label>
                  <div className="space-y-2">
                    {styles.map(style => (
                      <div
                        key={style.value}
                        className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                          formData.style === style.value 
                            ? 'border-primary bg-primary/5' 
                            : 'border-border hover:border-primary/50'
                        }`}
                        onClick={() => handleInputChange('style', style.value)}
                      >
                        <div className="font-medium">{style.label}</div>
                        <div className="text-sm text-muted-foreground">{style.desc}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">项目描述</label>
              <Textarea
                placeholder="详细描述您的教学目标、重点内容等..."
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={4}
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold">AI智能助手</h2>
              <p className="text-muted-foreground">与AI对话完善您的教学设计</p>
            </div>
            
            <AIAssistant
              mode="deep-thinking"
              context={`学科: ${formData.subject}, 年级: ${formData.grade}, 主题: ${formData.title}`}
              onContentGenerated={(content) => handleAIContentGenerated('chat', content)}
            />
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold">多媒体处理与搜索</h2>
              <p className="text-muted-foreground">上传素材、搜索资源、生成内容</p>
            </div>
            
            <Tabs defaultValue="media" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="media">多媒体处理</TabsTrigger>
                <TabsTrigger value="search">智能搜索</TabsTrigger>
              </TabsList>
              
              <TabsContent value="media">
                <MediaProcessor onContentGenerated={handleAIContentGenerated} />
              </TabsContent>
              
              <TabsContent value="search">
                <SmartSearch onContentFound={handleAIContentGenerated} />
              </TabsContent>
            </Tabs>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold">生成内容设置</h2>
              <p className="text-muted-foreground">选择要生成的教学资源类型</p>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-3 block">选择输出类型 *</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {outputs.map(output => {
                  const Icon = output.icon;
                  const isSelected = formData.outputs.includes(output.value);
                  
                  return (
                    <div
                      key={output.value}
                      className={`p-4 border rounded-lg cursor-pointer transition-all ${
                        isSelected 
                          ? 'border-primary bg-primary/5 shadow-sm' 
                          : 'border-border hover:border-primary/50'
                      }`}
                      onClick={() => handleOutputToggle(output.value)}
                    >
                      <div className="flex items-center space-x-3">
                        <Icon className={`h-5 w-5 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`} />
                        <span className="font-medium">{output.label}</span>
                      </div>
                      {isSelected && (
                        <Badge variant="secondary" className="mt-2">已选择</Badge>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">素材来源</label>
              <Select value={formData.sourceType} onValueChange={(value) => handleInputChange('sourceType', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="选择素材来源" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="topic">主题描述</SelectItem>
                  <SelectItem value="text">文本资料</SelectItem>
                  <SelectItem value="url">网页链接</SelectItem>
                  <SelectItem value="file">文件上传</SelectItem>
                  <SelectItem value="image">图片分析</SelectItem>
                  <SelectItem value="audio">音频转录</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">素材内容</label>
              <Textarea
                placeholder="输入或粘贴您的教学素材内容..."
                value={formData.sourceContent}
                onChange={(e) => handleInputChange('sourceContent', e.target.value)}
                rows={6}
              />
              <div className="mt-2 text-sm text-muted-foreground">
                提示：您可以从前面的AI助手对话、多媒体处理或搜索结果中复制内容到这里
              </div>
            </div>
            
            {/* AI生成内容预览 */}
            {(formData.aiGeneratedContent.analyzedContent || 
              formData.aiGeneratedContent.searchResults || 
              formData.aiGeneratedContent.summaryContent) && (
              <div className="border rounded-lg p-4 bg-muted/30">
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  AI生成的内容
                </h4>
                <div className="space-y-3">
                  {formData.aiGeneratedContent.analyzedContent && (
                    <div>
                      <Badge variant="outline" className="mb-2">图片/音频分析</Badge>
                      <p className="text-sm bg-background p-2 rounded">
                        {formData.aiGeneratedContent.analyzedContent.substring(0, 200)}...
                      </p>
                    </div>
                  )}
                  {formData.aiGeneratedContent.searchResults && (
                    <div>
                      <Badge variant="outline" className="mb-2">搜索结果</Badge>
                      <p className="text-sm bg-background p-2 rounded">
                        {formData.aiGeneratedContent.searchResults.substring(0, 200)}...
                      </p>
                    </div>
                  )}
                  {formData.aiGeneratedContent.generatedImages.length > 0 && (
                    <div>
                      <Badge variant="outline" className="mb-2">生成的图片</Badge>
                      <div className="text-sm text-muted-foreground">
                        已生成 {formData.aiGeneratedContent.generatedImages.length} 张图片
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-accent">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* 头部 */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/dashboard')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            返回控制台
          </Button>
          
          <div className="space-y-4">
            <h1 className="text-3xl font-bold">AI智能教学项目创建</h1>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>创建进度</span>
                <span>{currentStep} / {totalSteps}</span>
              </div>
              <Progress value={progress} className="w-full" />
            </div>
          </div>
        </div>

        {/* 步骤指示器 */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step <= currentStep
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {step}
                </div>
                {step < 4 && (
                  <div
                    className={`w-12 h-0.5 mx-2 ${
                      step < currentStep ? 'bg-primary' : 'bg-muted'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 主内容 */}
        <Card>
          <CardContent className="p-8">
            {renderStepContent()}
          </CardContent>
        </Card>

        {/* 底部导航 */}
        <div className="flex justify-between mt-8">
          <Button 
            variant="outline" 
            onClick={prevStep}
            disabled={currentStep === 1}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            上一步
          </Button>
          
          <div className="flex gap-3">
            {currentStep < totalSteps ? (
              <Button onClick={nextStep}>
                下一步
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button 
                onClick={handleCreateProject}
                disabled={isCreating || formData.outputs.length === 0}
                className="bg-gradient-primary"
              >
                {isCreating ? (
                  <>
                    <Wand2 className="h-4 w-4 mr-2 animate-spin" />
                    创建中...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    创建项目
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};