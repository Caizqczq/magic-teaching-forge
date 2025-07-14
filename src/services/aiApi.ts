// AI功能相关的API服务

const AI_API_BASE_URL = 'http://localhost:8080/api/v1';

export interface AIModel {
  model: string;
  desc: string;
}

export interface ChatResponse {
  code: number;
  message: string;
  data: string;
}

export interface ToolCallResponse {
  code: number;
  message: string;
  data: any;
}

export interface MCPServer {
  id: string;
  name: string;
  desc: string;
  toolList: any[];
}

class AIApiService {
  // 流式响应处理
  private async streamRequest(endpoint: string, options: RequestInit = {}): Promise<ReadableStream<Uint8Array>> {
    const response = await fetch(`${AI_API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'text/plain',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.body!;
  }

  private async jsonRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const response = await fetch(`${AI_API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // 基础服务
  async getModels(): Promise<{ code: number; message: string; data: AIModel[] }> {
    return this.jsonRequest('/dashscope/getModels');
  }

  async healthCheck(): Promise<{ code: number; message: string; data: string }> {
    return this.jsonRequest('/health');
  }

  // 聊天服务
  async chat(
    message: string, 
    model = 'qwen-plus', 
    chatId = 'teaching-platform-chat'
  ): Promise<ReadableStream<Uint8Array>> {
    return this.streamRequest('/chat', {
      method: 'POST',
      body: message,
      headers: {
        'model': model,
        'chatId': chatId,
      },
    });
  }

  async deepThinkingChat(
    message: string, 
    model = 'qwen-plus', 
    chatId = 'teaching-platform-deepthink'
  ): Promise<ReadableStream<Uint8Array>> {
    return this.streamRequest('/deep-thinking/chat', {
      method: 'POST',
      body: message,
      headers: {
        'model': model,
        'chatId': chatId,
      },
    });
  }

  // 图像处理
  async imageToText(
    image: File, 
    prompt = '请分析这张教学相关的图片内容'
  ): Promise<ReadableStream<Uint8Array>> {
    const formData = new FormData();
    formData.append('image', image);
    formData.append('prompt', prompt);

    return this.streamRequest('/image2text', {
      method: 'POST',
      body: formData,
      headers: {}, // Let browser set Content-Type for FormData
    });
  }

  async textToImage(
    prompt: string, 
    style = '教学插图', 
    resolution = '1080*1080'
  ): Promise<Blob> {
    const params = new URLSearchParams({
      prompt,
      style,
      resolution,
    });

    const response = await fetch(`${AI_API_BASE_URL}/text2image?${params}`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.blob();
  }

  // 音频处理
  async audioToText(audio: File): Promise<{ code: number; message: string; data: string }> {
    const formData = new FormData();
    formData.append('audio', audio);

    return this.jsonRequest('/audio2text', {
      method: 'POST',
      body: formData,
      headers: {}, // Let browser set Content-Type for FormData
    });
  }

  async textToAudio(text: string): Promise<ArrayBuffer> {
    const params = new URLSearchParams({ prompt: text });
    const response = await fetch(`${AI_API_BASE_URL}/text2audio?${params}`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.arrayBuffer();
  }

  // 网络搜索
  async webSearch(query: string): Promise<ReadableStream<Uint8Array>> {
    return this.streamRequest('/search', {
      method: 'POST',
      body: query,
    });
  }

  // 工具调用
  async toolCall(prompt: string): Promise<ToolCallResponse> {
    const params = new URLSearchParams({ prompt });
    return this.jsonRequest(`/tool-call?${params}`);
  }

  // RAG检索
  async ragChat(
    prompt: string, 
    chatId = 'teaching-platform-rag'
  ): Promise<ReadableStream<Uint8Array>> {
    const params = new URLSearchParams({ prompt });
    return this.streamRequest(`/rag?${params}`, {
      headers: {
        'chatId': chatId,
      },
    });
  }

  // 文档摘要
  async summarizeDocument(file?: File, url?: string): Promise<ReadableStream<Uint8Array>> {
    if (!file && !url) {
      throw new Error('必须提供文件或URL');
    }

    const formData = new FormData();
    if (file) {
      formData.append('file', file);
    }
    if (url) {
      formData.append('url', url);
    }

    return this.streamRequest('/summarizer', {
      method: 'POST',
      body: formData,
      headers: {}, // Let browser set Content-Type for FormData
    });
  }

  // MCP服务
  async getMCPServers(): Promise<{ code: number; message: string; data: MCPServer[] }> {
    return this.jsonRequest('/mcp-list');
  }

  // 流式响应读取辅助方法
  async readStream(stream: ReadableStream<Uint8Array>): Promise<string> {
    const reader = stream.getReader();
    const decoder = new TextDecoder();
    let result = '';

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        result += decoder.decode(value, { stream: true });
      }
    } finally {
      reader.releaseLock();
    }

    return result;
  }

  // 流式响应的回调处理
  async streamWithCallback(
    stream: ReadableStream<Uint8Array>,
    onChunk: (chunk: string) => void,
    onComplete?: () => void,
    onError?: (error: Error) => void
  ): Promise<void> {
    const reader = stream.getReader();
    const decoder = new TextDecoder();

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          onComplete?.();
          break;
        }
        const chunk = decoder.decode(value, { stream: true });
        onChunk(chunk);
      }
    } catch (error) {
      onError?.(error as Error);
    } finally {
      reader.releaseLock();
    }
  }
}

export const aiApiService = new AIApiService();