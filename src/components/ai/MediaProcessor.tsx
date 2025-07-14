import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Image, 
  Mic, 
  FileText, 
  Upload, 
  Download, 
  Sparkles,
  Eye,
  Headphones,
  FileImage,
  Loader2
} from 'lucide-react';
import { aiApiService } from '@/services/aiApi';
import { useToast } from '@/hooks/use-toast';

interface MediaProcessorProps {
  onContentGenerated?: (type: string, content: any) => void;
}

export const MediaProcessor: React.FC<MediaProcessorProps> = ({
  onContentGenerated
}) => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [imagePrompt, setImagePrompt] = useState('');
  const [audioPrompt, setAudioPrompt] = useState('');
  const [generatedContent, setGeneratedContent] = useState<string>('');
  const [generatedImage, setGeneratedImage] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  
  const imageInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        setImageFile(file);
      } else {
        toast({
          title: "文件类型错误",
          description: "请选择图片文件",
          variant: "destructive",
        });
      }
    }
  };

  const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type.startsWith('audio/')) {
        setAudioFile(file);
      } else {
        toast({
          title: "文件类型错误",
          description: "请选择音频文件",
          variant: "destructive",
        });
      }
    }
  };

  const processImageToText = async () => {
    if (!imageFile) {
      toast({
        title: "请先上传图片",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    setProgress(0);
    
    try {
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90));
      }, 500);

      const prompt = imagePrompt || '请分析这张教学相关的图片，提取其中的教学内容和要点';
      const stream = await aiApiService.imageToText(imageFile, prompt);
      
      let result = '';
      await aiApiService.streamWithCallback(
        stream,
        (chunk) => {
          result += chunk;
          setGeneratedContent(result);
        },
        () => {
          clearInterval(progressInterval);
          setProgress(100);
          setIsProcessing(false);
          onContentGenerated?.('image_analysis', result);
          toast({
            title: "图片分析完成",
            description: "已提取图片中的教学内容",
          });
        },
        (error) => {
          clearInterval(progressInterval);
          setIsProcessing(false);
          toast({
            title: "图片分析失败",
            description: error.message,
            variant: "destructive",
          });
        }
      );
    } catch (error) {
      setIsProcessing(false);
      toast({
        title: "处理失败",
        description: error instanceof Error ? error.message : "未知错误",
        variant: "destructive",
      });
    }
  };

  const processAudioToText = async () => {
    if (!audioFile) {
      toast({
        title: "请先上传音频",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    setProgress(0);
    
    try {
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 15, 90));
      }, 1000);

      const response = await aiApiService.audioToText(audioFile);
      
      clearInterval(progressInterval);
      setProgress(100);
      setIsProcessing(false);
      
      if (response.code === 200) {
        setGeneratedContent(response.data);
        onContentGenerated?.('audio_transcription', response.data);
        toast({
          title: "音频转文字完成",
          description: "已将音频内容转换为文字",
        });
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      setIsProcessing(false);
      toast({
        title: "音频处理失败",
        description: error instanceof Error ? error.message : "未知错误",
        variant: "destructive",
      });
    }
  };

  const generateImageFromText = async () => {
    if (!audioPrompt.trim()) {
      toast({
        title: "请输入图片描述",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    setProgress(0);
    
    try {
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90));
      }, 800);

      const blob = await aiApiService.textToImage(audioPrompt, '教学插图', '1080*1080');
      const imageUrl = URL.createObjectURL(blob);
      
      clearInterval(progressInterval);
      setProgress(100);
      setIsProcessing(false);
      setGeneratedImage(imageUrl);
      onContentGenerated?.('generated_image', imageUrl);
      
      toast({
        title: "图片生成完成",
        description: "已根据描述生成教学插图",
      });
    } catch (error) {
      setIsProcessing(false);
      toast({
        title: "图片生成失败",
        description: error instanceof Error ? error.message : "未知错误",
        variant: "destructive",
      });
    }
  };

  const downloadGeneratedImage = () => {
    if (generatedImage) {
      const link = document.createElement('a');
      link.href = generatedImage;
      link.download = `teaching-image-${Date.now()}.png`;
      link.click();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5" />
          多媒体AI处理
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="image-analysis" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="image-analysis">图片分析</TabsTrigger>
            <TabsTrigger value="audio-processing">音频处理</TabsTrigger>
            <TabsTrigger value="image-generation">图片生成</TabsTrigger>
          </TabsList>
          
          <TabsContent value="image-analysis" className="space-y-4">
            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
              {imageFile ? (
                <div className="space-y-2">
                  <FileImage className="h-12 w-12 mx-auto text-primary" />
                  <p className="text-sm font-medium">{imageFile.name}</p>
                  <Badge variant="secondary">{(imageFile.size / 1024 / 1024).toFixed(2)} MB</Badge>
                </div>
              ) : (
                <div 
                  className="cursor-pointer space-y-2"
                  onClick={() => imageInputRef.current?.click()}
                >
                  <Upload className="h-12 w-12 mx-auto text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">点击上传图片</p>
                </div>
              )}
              <input
                ref={imageInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>
            
            <Textarea
              placeholder="可选：输入分析要求，如'分析图中的数学公式'（留空将进行通用分析）"
              value={imagePrompt}
              onChange={(e) => setImagePrompt(e.target.value)}
              rows={3}
            />
            
            <Button 
              onClick={processImageToText} 
              disabled={isProcessing || !imageFile}
              className="w-full"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  分析中...
                </>
              ) : (
                <>
                  <Eye className="h-4 w-4 mr-2" />
                  分析图片内容
                </>
              )}
            </Button>
          </TabsContent>
          
          <TabsContent value="audio-processing" className="space-y-4">
            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
              {audioFile ? (
                <div className="space-y-2">
                  <Headphones className="h-12 w-12 mx-auto text-primary" />
                  <p className="text-sm font-medium">{audioFile.name}</p>
                  <Badge variant="secondary">{(audioFile.size / 1024 / 1024).toFixed(2)} MB</Badge>
                </div>
              ) : (
                <div 
                  className="cursor-pointer space-y-2"
                  onClick={() => audioInputRef.current?.click()}
                >
                  <Mic className="h-12 w-12 mx-auto text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">点击上传音频文件</p>
                </div>
              )}
              <input
                ref={audioInputRef}
                type="file"
                accept="audio/*"
                onChange={handleAudioUpload}
                className="hidden"
              />
            </div>
            
            <Button 
              onClick={processAudioToText} 
              disabled={isProcessing || !audioFile}
              className="w-full"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  转换中...
                </>
              ) : (
                <>
                  <FileText className="h-4 w-4 mr-2" />
                  转换为文字
                </>
              )}
            </Button>
          </TabsContent>
          
          <TabsContent value="image-generation" className="space-y-4">
            <Textarea
              placeholder="描述您想要生成的教学图片，例如：'一个展示光合作用过程的彩色示意图'"
              value={audioPrompt}
              onChange={(e) => setAudioPrompt(e.target.value)}
              rows={4}
            />
            
            <Button 
              onClick={generateImageFromText} 
              disabled={isProcessing || !audioPrompt.trim()}
              className="w-full"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  生成中...
                </>
              ) : (
                <>
                  <Image className="h-4 w-4 mr-2" />
                  生成教学图片
                </>
              )}
            </Button>
            
            {generatedImage && (
              <div className="space-y-3">
                <img 
                  src={generatedImage} 
                  alt="Generated teaching illustration" 
                  className="w-full rounded-lg border"
                />
                <Button 
                  onClick={downloadGeneratedImage}
                  variant="outline"
                  className="w-full"
                >
                  <Download className="h-4 w-4 mr-2" />
                  下载图片
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
        
        {isProcessing && (
          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span>处理进度</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="w-full" />
          </div>
        )}
        
        {generatedContent && (
          <div className="mt-4 space-y-2">
            <h4 className="font-medium">处理结果：</h4>
            <div className="p-3 bg-muted rounded-lg">
              <pre className="whitespace-pre-wrap text-sm">{generatedContent}</pre>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};