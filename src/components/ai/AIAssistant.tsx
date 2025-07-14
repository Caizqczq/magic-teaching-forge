import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  MessageCircle, 
  Send, 
  Sparkles, 
  Brain, 
  Image, 
  Mic, 
  Search,
  FileText,
  Bot,
  User
} from 'lucide-react';
import { aiApiService } from '@/services/aiApi';
import { ChatMessage } from '@/types/api';
import { useToast } from '@/hooks/use-toast';

interface AIAssistantProps {
  mode?: 'chat' | 'deep-thinking' | 'rag';
  context?: string;
  onContentGenerated?: (content: string) => void;
}

export const AIAssistant: React.FC<AIAssistantProps> = ({
  mode = 'chat',
  context,
  onContentGenerated
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentResponse, setCurrentResponse] = useState('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages, currentResponse]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    setCurrentResponse('');

    try {
      const prompt = context 
        ? `教学上下文: ${context}\n\n用户问题: ${inputValue}`
        : inputValue;

      let stream: ReadableStream<Uint8Array>;
      
      switch (mode) {
        case 'deep-thinking':
          stream = await aiApiService.deepThinkingChat(prompt);
          break;
        case 'rag':
          stream = await aiApiService.ragChat(prompt);
          break;
        default:
          stream = await aiApiService.chat(prompt);
      }

      let fullResponse = '';
      await aiApiService.streamWithCallback(
        stream,
        (chunk) => {
          fullResponse += chunk;
          setCurrentResponse(fullResponse);
        },
        () => {
          const assistantMessage: ChatMessage = {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: fullResponse,
            timestamp: new Date().toISOString(),
          };
          setMessages(prev => [...prev, assistantMessage]);
          setCurrentResponse('');
          setIsLoading(false);
          
          if (onContentGenerated) {
            onContentGenerated(fullResponse);
          }
        },
        (error) => {
          toast({
            title: "AI响应错误",
            description: error.message,
            variant: "destructive",
          });
          setIsLoading(false);
          setCurrentResponse('');
        }
      );
    } catch (error) {
      toast({
        title: "发送消息失败",
        description: error instanceof Error ? error.message : "未知错误",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getModeIcon = () => {
    switch (mode) {
      case 'deep-thinking': return <Brain className="h-4 w-4" />;
      case 'rag': return <Search className="h-4 w-4" />;
      default: return <MessageCircle className="h-4 w-4" />;
    }
  };

  const getModeLabel = () => {
    switch (mode) {
      case 'deep-thinking': return '深度思考';
      case 'rag': return '知识检索';
      default: return '智能对话';
    }
  };

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader className="flex-shrink-0 pb-3">
        <CardTitle className="flex items-center gap-2">
          {getModeIcon()}
          AI教学助手
          <Badge variant="secondary" className="ml-2">
            {getModeLabel()}
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col p-0">
        <ScrollArea className="flex-1 px-4" ref={scrollAreaRef}>
          <div className="space-y-4 pb-4">
            {messages.length === 0 && (
              <div className="text-center text-muted-foreground py-8">
                <Sparkles className="h-12 w-12 mx-auto mb-4 text-primary/30" />
                <p>您好！我是AI教学助手，可以帮您：</p>
                <ul className="mt-2 text-sm space-y-1">
                  <li>• 设计教学内容</li>
                  <li>• 分析教学材料</li>
                  <li>• 生成教学资源</li>
                  <li>• 解答教学问题</li>
                </ul>
              </div>
            )}
            
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {message.role === 'assistant' && (
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>
                      <Bot className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                )}
                
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}
                >
                  <div className="whitespace-pre-wrap text-sm">
                    {message.content}
                  </div>
                  <div className="text-xs opacity-70 mt-1">
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </div>
                </div>
                
                {message.role === 'user' && (
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
            
            {currentResponse && (
              <div className="flex gap-3 justify-start">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>
                    <Bot className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="max-w-[80%] rounded-lg p-3 bg-muted">
                  <div className="whitespace-pre-wrap text-sm">
                    {currentResponse}
                    <span className="animate-pulse">|</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
        
        <Separator />
        
        <div className="p-4">
          <div className="flex gap-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="输入您的问题或需求..."
              disabled={isLoading}
              className="flex-1"
            />
            <Button 
              onClick={handleSendMessage} 
              disabled={isLoading || !inputValue.trim()}
              size="icon"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};