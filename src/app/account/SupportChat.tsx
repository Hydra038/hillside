"use client";
import { useEffect, useState } from 'react';
import { utcToZonedTime, format } from 'date-fns-tz';
import { useAuth } from '@/lib/auth-provider';

interface SupportMessage {
  id: number;
  user_id: string;
  sender: 'user' | 'admin';
  message: string;
  created_at: string;
}

export default function SupportChat() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<SupportMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (!user) return;
    fetch(`/api/support-messages?user_id=${user.id}`, { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setMessages(data);
        else setError(data?.error || 'Failed to load messages');
      })
      .catch(() => setError('Failed to load messages'))
      .finally(() => setLoading(false));
  }, [user]);

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || !user) return;
    setSending(true);
    const res = await fetch('/api/support-messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: user.id, sender: 'user', message: input }),
      credentials: 'include',
    });
    if (res.ok) {
      setMessages(msgs => [...msgs, { id: Date.now(), user_id: user.id, sender: 'user', message: input, created_at: new Date().toISOString() }]);
      setInput('');
    }
    setSending(false);
  }

  if (!user) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4 text-amber-700">Support Chat</h2>
        <div className="text-gray-600">You must be signed in to use support chat. <a href="/signin" className="text-amber-700 underline">Sign in</a></div>
      </div>
    );
  }
  if (loading) return <div>Loading support chat...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-4 text-amber-700">Support Chat</h2>
      <div className="h-64 overflow-y-auto mb-4 border rounded p-2 bg-gray-50 flex flex-col gap-2">
        {messages.length === 0 ? (
          <div className="text-gray-500">No messages yet. Start a conversation below!</div>
        ) : (
          messages.map(msg => (
            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`px-3 py-2 rounded-lg max-w-xs ${msg.sender === 'user' ? 'bg-amber-200 text-right' : 'bg-gray-200 text-left'}`}>
                <div className="text-sm">{msg.message}</div>
                <div className="text-xs text-gray-500 mt-1">
                  {format(utcToZonedTime(new Date(msg.created_at), 'Europe/London'), 'dd MMM yyyy HH:mm', { timeZone: 'Europe/London' })}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      <form onSubmit={sendMessage} className="flex gap-2">
        <input
          type="text"
          className="flex-1 border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
          placeholder="Type your message..."
          value={input}
          onChange={e => setInput(e.target.value)}
          disabled={sending}
        />
        <button
          type="submit"
          className="bg-amber-600 text-white px-4 py-2 rounded hover:bg-amber-700"
          disabled={sending || !input.trim()}
        >
          Send
        </button>
      </form>
    </div>
  );
}
