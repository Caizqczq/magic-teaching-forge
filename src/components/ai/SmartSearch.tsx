import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Search, 
  Globe, 
  BookOpen, 
  FileText, 
  Download,
  Loader2,
  ExternalLink,
  Lightbulb
} from 'lucide-react';
import { aiApiService } from '@/services/aiApi';
import { useToast } from '@/hooks/use-toast';

interface SmartSearchProps {
  onContentFound?: (type: string, content: string) => void;
}

export const SmartSearch: React.FC<SmartSearchProps> = ({
  onContentFound
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [webResults, setWebResults] = useState('');
  const [ragResults, setRagResults] = useState('');
  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const [documentUrl, setDocumentUrl] = useState('');
  const [summaryResult, setSummaryResult] = useState('');
  const { toast } = useToast();

  const handleWebSearch = async () => {
    if (!searchQuery.trim()) {
      toast({
        title: "请输入搜索关键词",
        variant: "destructive",
      });
      return;
    }

    setIsSearching(true);
    setWebResults('');

    try {
      const stream = await aiApiService.webSearch(searchQuery);
      let result = '';
      
      await aiApiService.streamWithCallback(
        stream,
        (chunk) => {
          result += chunk;
          setWebResults(result);
        },
        () => {
          setIsSearching(false);
          onContentFound?.('web_search', result);
          toast({
            title: "网络搜索完成",
            description: "已找到相关教学资源",
          });
        },
        (error) => {
          setIsSearching(false);
          toast({
            title: "搜索失败",
            description: error.message,
            variant: "destructive",
          });
        }
      );
    } catch (error) {
      setIsSearching(false);
      toast({
        title: "搜索失败",
        description: error instanceof Error ? error.message : "未知错误",
        variant: "destructive",
      });
    }
  };

  const handleRAGSearch = async () => {
    if (!searchQuery.trim()) {
      toast({
        title: "请输入搜索关键词",
        variant: "destructive",
      });
      return;
    }

    setIsSearching(true);
    setRagResults('');

    try {
      const stream = await aiApiService.ragChat(searchQuery);
      let result = '';
      
      await aiApiService.streamWithCallback(
        stream,
        (chunk) => {
          result += chunk;
          setRagResults(result);
        },
        () => {
          setIsSearching(false);
          onContentFound?.('rag_search', result);
          toast({
            title: "知识库搜索完成",
            description: "已从知识库中找到相关内容",
          });
        },
        (error) => {
          setIsSearching(false);
          toast({
            title: "知识库搜索失败",
            description: error.message,
            variant: "destructive",
          });
        }
      );
    } catch (error) {
      setIsSearching(false);
      toast({
        title: "搜索失败",
        description: error instanceof Error ? error.message : "未知错误",
        variant: "destructive",
      });
    }
  };

  const handleDocumentSummary = async () => {
    if (!documentFile && !documentUrl.trim()) {
      toast({
        title: "请选择文档或输入网页链接",
        variant: "destructive",
      });
      return;
    }

    setIsSearching(true);
    setSummaryResult('');

    try {
      const stream = await aiApiService.summarizeDocument(
        documentFile || undefined, 
        documentUrl.trim() || undefined
      );
      let result = '';
      
      await aiApiService.streamWithCallback(
        stream,
        (chunk) => {
          result += chunk;
          setSummaryResult(result);
        },
        () => {
          setIsSearching(false);
          onContentFound?.('document_summary', result);
          toast({
            title: "文档摘要完成",
            description: "已生成文档内容摘要",
          });
        },
        (error) => {
          setIsSearching(false);
          toast({
            title: "文档摘要失败",
            description: error.message,
            variant: "destructive",
          });
        }
      );
    } catch (error) {
      setIsSearching(false);
      toast({
        title: "处理失败",
        description: error instanceof Error ? error.message : "未知错误",
        variant: "destructive",
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 20 * 1024 * 1024) {
        toast({
          title: "文件过大",
          description: "文件大小不能超过20MB",
          variant: "destructive",
        });
        return;
      }
      setDocumentFile(file);
      setDocumentUrl(''); // 清空URL
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5" />
          智能搜索与知识管理
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="web-search" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="web-search">网络搜索</TabsTrigger>
            <TabsTrigger value="knowledge-base">知识库检索</TabsTrigger>
            <TabsTrigger value="document-summary">文档摘要</TabsTrigger>
          </TabsList>
          
          <TabsContent value="web-search" className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="搜索教学相关资源、最新资讯等..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleWebSearch()}
                className="flex-1"
              />
              <Button 
                onClick={handleWebSearch} 
                disabled={isSearching || !searchQuery.trim()}
              >
                {isSearching ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Globe className="h-4 w-4" />
                )}
              </Button>
            </div>
            
            {webResults && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <ExternalLink className="h-4 w-4" />
                    搜索结果
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[300px]">
                    <div className="whitespace-pre-wrap text-sm">{webResults}</div>
                  </ScrollArea>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="knowledge-base" className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="在知识库中搜索教学内容、案例等..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleRAGSearch()}
                className="flex-1"
              />
              <Button 
                onClick={handleRAGSearch} 
                disabled={isSearching || !searchQuery.trim()}
              >
                {isSearching ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <BookOpen className="h-4 w-4" />
                )}
              </Button>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Lightbulb className="h-4 w-4" />
              基于AI知识库的智能检索，提供更精准的教学内容
            </div>
            
            {ragResults && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    知识库结果
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[300px]">
                    <div className="whitespace-pre-wrap text-sm">{ragResults}</div>
                  </ScrollArea>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="document-summary" className="space-y-4">
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium mb-2 block">上传文档</label>
                <div className="border-2 border-dashed border-border rounded-lg p-4">
                  <input
                    type="file"
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx,.txt,.md"
                    className="w-full"
                  />
                  {documentFile && (
                    <div className="mt-2 flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      <span className="text-sm">{documentFile.name}</span>
                      <Badge variant="secondary">
                        {(documentFile.size / 1024 / 1024).toFixed(2)} MB
                      </Badge>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="text-center text-sm text-muted-foreground">或</div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">网页链接</label>
                <Input
                  placeholder="输入要摘要的网页URL..."
                  value={documentUrl}
                  onChange={(e) => setDocumentUrl(e.target.value)}
                  disabled={!!documentFile}
                />
              </div>
            </div>
            
            <Button 
              onClick={handleDocumentSummary} 
              disabled={isSearching || (!documentFile && !documentUrl.trim())}
              className="w-full"
            >
              {isSearching ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  分析中...
                </>
              ) : (
                <>
                  <FileText className="h-4 w-4 mr-2" />
                  生成摘要
                </>
              )}
            </Button>
            
            {summaryResult && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    文档摘要
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[300px]">
                    <div className="whitespace-pre-wrap text-sm">{summaryResult}</div>
                  </ScrollArea>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};