
export class AudioService {
  /**
   * Uploads an audio blob to a temporary server and returns the file URL.
   */
  static async uploadAudio(blob: Blob): Promise<string> {
    const formData = new FormData();
    formData.append('file', blob, 'voice_message.webm');

    const response = await fetch('https://file.pro-talk.ru/upload_tmp', {
      method: 'POST',
      headers: {
        'Accept': 'application/json'
      },
      body: formData
    });

    if (!response.ok) {
      throw new Error('Failed to upload audio');
    }

    const result = await response.json();
    if (result.status === 'success' && result.data?.url) {
      return result.data.url;
    }

    throw new Error('Invalid response from upload server');
  }

  /**
   * Transcribes audio from a given URL using ProTalk STT service.
   */
  static async transcribeAudio(fileUrl: string): Promise<string> {
    const encodedUrl = encodeURIComponent(fileUrl);
    const response = await fetch(`https://api.pro-talk.ru/api/v1.0/stt_from_widget?url=${encodedUrl}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to transcribe audio');
    }

    const result = await response.json();
    if (result.text !== undefined) {
      return result.text;
    }

    throw new Error('Invalid response from transcription server');
  }
}
