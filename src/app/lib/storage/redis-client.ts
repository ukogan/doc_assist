import Redis from 'ioredis';
import { Session, Message, UserPreferences } from '../types';

// Singleton Redis client
let redis: Redis | null = null;

function getRedis(): Redis {
  if (!redis) {
    const url = process.env.REDIS_URL;
    if (!url) {
      throw new Error('REDIS_URL environment variable is not set');
    }
    redis = new Redis(url);
  }
  return redis;
}

// Session operations
export async function createSession(sessionId: string): Promise<Session> {
  const client = getRedis();
  const session: Session = {
    id: sessionId,
    createdAt: new Date().toISOString(),
    lastActiveAt: new Date().toISOString(),
    messageCount: 0,
  };

  await client.set(`session:${sessionId}`, JSON.stringify(session));
  await client.expire(`session:${sessionId}`, 60 * 60 * 24 * 30); // 30 days

  return session;
}

export async function getSession(sessionId: string): Promise<Session | null> {
  const client = getRedis();
  const data = await client.get(`session:${sessionId}`);
  if (!data) return null;
  return JSON.parse(data) as Session;
}

export async function updateSessionActivity(sessionId: string): Promise<void> {
  const client = getRedis();
  const session = await getSession(sessionId);
  if (session) {
    session.lastActiveAt = new Date().toISOString();
    await client.set(`session:${sessionId}`, JSON.stringify(session));
  }
}

// Message operations
export async function addMessage(
  sessionId: string,
  message: Message
): Promise<void> {
  const client = getRedis();

  await client.rpush(`messages:${sessionId}`, JSON.stringify(message));

  // Update session message count
  const session = await getSession(sessionId);
  if (session) {
    session.messageCount += 1;
    session.lastActiveAt = new Date().toISOString();
    await client.set(`session:${sessionId}`, JSON.stringify(session));
  }
}

export async function getMessages(sessionId: string): Promise<Message[]> {
  const client = getRedis();
  const data = await client.lrange(`messages:${sessionId}`, 0, -1);
  return data.map((item) => JSON.parse(item) as Message);
}

export async function getRecentMessages(
  sessionId: string,
  count: number
): Promise<Message[]> {
  const client = getRedis();
  const data = await client.lrange(`messages:${sessionId}`, -count, -1);
  return data.map((item) => JSON.parse(item) as Message);
}

// Preferences operations
export async function setPreferences(
  preferences: UserPreferences
): Promise<void> {
  const client = getRedis();
  await client.set(
    `prefs:${preferences.sessionId}`,
    JSON.stringify(preferences)
  );
}

export async function getPreferences(
  sessionId: string
): Promise<UserPreferences | null> {
  const client = getRedis();
  const data = await client.get(`prefs:${sessionId}`);
  if (!data) return null;
  return JSON.parse(data) as UserPreferences;
}

// Export chat history as markdown
export async function exportChatAsMarkdown(sessionId: string): Promise<string> {
  const messages = await getMessages(sessionId);
  const session = await getSession(sessionId);

  let md = `# Chat History\n\n`;
  md += `**Session ID**: ${sessionId}\n`;
  md += `**Created**: ${session?.createdAt || 'Unknown'}\n`;
  md += `**Exported**: ${new Date().toISOString()}\n\n`;
  md += `---\n\n`;

  for (const msg of messages) {
    const role = msg.role === 'user' ? '**You**' : '**Medical Assistant**';
    const time = new Date(msg.timestamp).toLocaleString();
    md += `### ${role} - ${time}\n\n`;
    md += `${msg.content}\n\n`;

    if (msg.metadata?.specialists && msg.metadata.specialists.length > 0) {
      md += `*Specialists consulted: ${msg.metadata.specialists.join(', ')}*\n\n`;
    }

    md += `---\n\n`;
  }

  return md;
}

// Cleanup function for graceful shutdown
export async function closeRedis(): Promise<void> {
  if (redis) {
    await redis.quit();
    redis = null;
  }
}
