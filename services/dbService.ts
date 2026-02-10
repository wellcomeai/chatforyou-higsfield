
const PROXY_URL = "https://ai.memory.api.atiks.org/mysql_full_proxy_api";
const BEARER_TOKEN = "mysql-VTJGc2RHVmtYMS9nRlZIeXNJOUtsamNZZjFMNlQ3MDRsVmF1L3pSZjJFeTRVVmdGTHZINm9Qdmt2YVpuZFo0ZjVnRjJ2dHBvVTE1Y0FaWk11ZFJUbVhvRDYwcjkxWkpQM1NydmxSNTlPNVRsWDNEdElmbTN1SjNPdWpTN0Q3bWgzT1FBZlBRdVp4NVZtNUNZKzhVL1hzMzhFQW8zVHE1VE13L2pVZFNweVRWbkJtRlJhTTJRaHk0bC9ha3k2WUkvUENpZHNVdm54K3lxTGlXdTZKdnlLV2Nyd092QnFBOU5Ib2w1L2pvelFOZHR4WUhsZi81M04xREpiZE5xazJ3cA==";

export class DbService {
  static async query(sql: string, params: any[] = []): Promise<any> {
    try {
      const response = await fetch(PROXY_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${BEARER_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ sql, params })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`DB Error: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      
      if (result.error) {
        throw new Error(result.error);
      }

      return result;
    } catch (error) {
      console.error("[DbService Query Failed]", error);
      throw error;
    }
  }

  static async registerUser(email: string, passwordHash: string, fullName: string, lang: string) {
    const existing = await this.query("SELECT id FROM users WHERE email = %s", [email]);
    if (existing.data && existing.data.length > 0) {
      throw new Error("User already exists");
    }

    // При регистрации передаем platform = 'ProTalk'
    const result = await this.query(
      "INSERT INTO users (email, password_hash, full_name, preferred_lang, credits_balance, bot_id, bot_token, platform) VALUES (%s, %s, %s, %s, %s, %s, %s, %s)",
      [email, passwordHash, fullName, lang, 150, null, '', 'ProTalk']
    );

    return result.insert_id;
  }

  static async loginUser(email: string, passwordHash: string) {
    const result = await this.query(
      "SELECT * FROM users WHERE email = %s AND password_hash = %s",
      [email, passwordHash]
    );
    
    if (result.data && result.data.length > 0) {
      return result.data[0];
    }
    return null;
  }

  static async deductCredits(userId: number, amount: number): Promise<number> {
    await this.query(
      "UPDATE users SET credits_balance = credits_balance - %s WHERE id = %s",
      [amount, userId]
    );
    const result = await this.query("SELECT credits_balance FROM users WHERE id = %s", [userId]);
    return result.data[0].credits_balance;
  }

  static async addShowcaseItem(toolId: string, url: string, prompt: string) {
    return this.query(
      "INSERT INTO showcase (tool_id, output_url, prompt) VALUES (%s, %s, %s)",
      [toolId, url, prompt]
    );
  }

  static async getLatestShowcaseItems(limit: number = 12) {
    const result = await this.query(
      "SELECT * FROM showcase ORDER BY created_at DESC LIMIT %s",
      [limit]
    );
    return result.data || [];
  }

  static async addGenerationRecord(userId: number, toolId: string, url: string, prompt: string, cost: number, apiTaskId?: string) {
    return this.query(
      "INSERT INTO generation_tasks (user_id, tool_id, output_url, prompt, cost_credits, api_task_id, status) VALUES (%s, %s, %s, %s, %s, %s, 'done')",
      [userId, toolId, url, prompt, cost, apiTaskId]
    );
  }

  static async getUserGenerations(userId: number) {
    const result = await this.query(
      "SELECT * FROM generation_tasks WHERE user_id = %s ORDER BY created_at DESC",
      [userId]
    );
    return result.data || [];
  }
}
