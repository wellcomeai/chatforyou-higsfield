
export interface ProTalkResponse {
  success: boolean;
  result?: any;
  error?: string;
  task_id: string;
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function runProTalkFunctionLong(
  functionId: number,
  botId: number,
  botToken: string,
  args: Record<string, any>,
  host: string = "api.pro-talk.ru",
  timeoutSeconds: number = 300
): Promise<ProTalkResponse> {
  const taskId = `f${functionId}_task_${Math.random().toString(36).substring(2, 11)}`;
  const startTime = Date.now();

  try {
    const triggerId = Date.now().toString();
    const proxyUrl = "https://eu1.account.dialog.ai.atiks.org/proxy/tasks";
    
    const payload = {
      bot_id: botId,
      bot_token: botToken,
      task_type: "api_call",
      repeat: "Once",
      trigger_id: triggerId,
      parameters: {
        api_url: `https://${host}/api/v1.0/run_function`,
        method: "POST",
        payload: {
          function_id: functionId,
          functions_base_id: "appkq3HrzrxYxoAV8",
          bot_id: botId,
          bot_token: botToken,
          arguments: {
            task_id: taskId,
            ...args
          }
        }
      }
    };

    const response = await fetch(proxyUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) throw new Error('task_create_failed');

  } catch (error) {
    return { success: false, error: "task_create_failed", task_id: taskId };
  }

  // Polling loop
  while (Date.now() - startTime < timeoutSeconds * 1000) {
    await delay(8000); // Wait 8 seconds between polls

    try {
      const pollResponse = await fetch(`https://${host}/api/v1.0/get_function_result`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          task_id: taskId,
          bot_id: botId,
          bot_token: botToken,
          dialogs_api_host: host
        })
      });

      const data = await pollResponse.json();
      const status = data.status;

      if (status === "done") {
        return { success: true, result: data, task_id: taskId };
      }
      if (status === "error") {
        return { success: false, error: data.error, task_id: taskId };
      }
    } catch (e) {
      console.warn("Polling error, retrying...", e);
      continue;
    }
  }

  return { success: false, error: "timeout", task_id: taskId };
}
