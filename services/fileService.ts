
export class FileService {
  private static readonly UPLOAD_TOKEN = "b2VcU3NrVVttYlh3GHM_AEQ4eA8yDR4FGREODwsaLyUqQjpTEA8HGzMdFB8aORQYaG9dWGpkVQRvAXM";
  private static readonly CONVERT_URL = "https://file.pro-talk.ru/tgf";

  /**
   * Преобразует любую временную ссылку на файл в постоянную.
   * @param tempUrl Временная ссылка на результат генерации
   * @returns Постоянная ссылка
   */
  static async toPermanentLink(tempUrl: string): Promise<string> {
    if (!tempUrl) return tempUrl;
    
    // Если ссылка уже от нашего сервиса статики, не конвертируем повторно
    if (tempUrl.includes('file.pro-talk.ru/tgf/')) return tempUrl;

    try {
      console.log("[FileService] Converting link to permanent:", tempUrl);
      
      const formData = new FormData();
      formData.append('url', tempUrl);

      const response = await fetch(this.CONVERT_URL, {
        method: 'POST',
        headers: {
          'X-Upload-Token': this.UPLOAD_TOKEN
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error(`Conversion failed: ${response.status}`);
      }

      const result = await response.json();
      
      if (result && result.url) {
        console.log("[FileService] Success! Permanent link:", result.url);
        return result.url;
      }

      console.warn("[FileService] API did not return a URL, falling back to temp URL");
      return tempUrl;
    } catch (error) {
      console.error("[FileService] Error converting to permanent link:", error);
      // Возвращаем исходную ссылку в случае ошибки, чтобы не ломать UX, 
      // но в идеале здесь должна быть обработка ошибки
      return tempUrl;
    }
  }
}
