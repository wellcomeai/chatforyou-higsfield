
import { GenerationRequest } from '../types';
import { runProTalkFunctionLong } from '../runProTalkFunctions';
import { FileService } from './fileService';

export class ApiService {
  static async generate(request: GenerationRequest, botId: number, botToken: string): Promise<any> {
    if (!botId || !botToken) {
      console.error("[NeuroForge API] Missing credentials: botId or botToken is null");
      throw new Error('API Credentials missing. Please re-login.');
    }

    console.log(`[NeuroForge API] Starting generation for tool ${request.toolId} using bot ${botId}`);
    
    const args = {
      prompt: request.prompt,
      ...request.params
    };

    const response = await runProTalkFunctionLong(
      request.toolId,
      botId,
      botToken,
      args
    );

    if (response.success) {
      // Извлекаем временный URL
      let tempUrl = 'https://picsum.photos/1024/1024';
      
      const resData = response.result;
      if (resData) {
        if (typeof resData.result === 'string') {
          tempUrl = resData.result;
        } else if (resData.output_url) {
          tempUrl = resData.output_url;
        } else if (resData.result?.url) {
          tempUrl = resData.result.url;
        } else if (resData.result?.result && typeof resData.result.result === 'string') {
          tempUrl = resData.result.result;
        }
      }

      // КРИТИЧЕСКИЙ ШАГ: Конвертируем в постоянную ссылку
      const permanentUrl = await FileService.toPermanentLink(tempUrl);

      return { 
        success: true, 
        url: permanentUrl,
        raw: response
      };
    } else {
      throw new Error(response.error || 'Generation failed');
    }
  }
}
