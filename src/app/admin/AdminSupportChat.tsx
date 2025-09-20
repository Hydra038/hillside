"use client";
import { useEffect, useState } from 'react';
import { format } from 'date-fns';


interface SupportMessage {
  id: number;
  user_id: string;
  sender: 'user' | 'admin';
  message: string;
  created_at: string;
  name?: string;
  email?: string;
}


interface UserThread {
  user_id: string;
  name?: string;
  email?: string;
  messages: SupportMessage[];
}

export default function AdminSupportChat() {
  const [threads, setThreads] = useState<UserThread[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reply, setReply] = useState<{ [userId: string]: string }>({});
  const [status, setStatus] = useState<{ [userId: string]: string }>({});

  const [rawData, setRawData] = useState<any>(null);
  useEffect(() => {
    fetch('/api/admin/support-messages', { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        setRawData(data);
        if (Array.isArray(data)) {
          // Group messages by user_id and attach name/email from the first message
          const grouped: { [userId: string]: SupportMessage[] } = {};
          data.forEach((msg: SupportMessage) => {
            if (!grouped[msg.user_id]) grouped[msg.user_id] = [];
            grouped[msg.user_id].push(msg);
          });
          setThreads(
            Object.entries(grouped).map(([user_id, messages]) => ({
              user_id,
              name: messages[0]?.name,
              email: messages[0]?.email,
              messages,
            }))
          );
        } else {
          setError(data?.error || 'Unable to load support messages');
        }
      })
      .catch(() => setError('Unable to load support messages'))
      .finally(() => setLoading(false));
  }, []);

  async function sendReply(user_id: string) {
    setStatus(s => ({ ...s, [user_id]: 'sending' }));
    const res = await fetch('/api/support-messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id, sender: 'admin', message: reply[user_id] }),
      credentials: 'include',
    });
    if (res.ok) {
      setThreads(ts => ts.map(t => t.user_id === user_id ? {
        ...t,
        messages: [...t.messages, { id: Date.now(), user_id, sender: 'admin', message: reply[user_id], created_at: new Date().toISOString() }]
      } : t));
      setReply(r => ({ ...r, [user_id]: '' }));
      setStatus(s => ({ ...s, [user_id]: 'sent' }));
    } else {
      setStatus(s => ({ ...s, [user_id]: 'error' }));
    }
  }

  if (loading) return <div>Loading support messages...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <section className="bg-white/80 backdrop-blur-lg p-8 rounded-2xl shadow-lg mb-8 max-w-2xl">
      <h2 className="text-2xl font-bold mb-6 text-amber-700">Support Chat (All Users)</h2>
      {/* Support chat UI only, no debug output */}
      {threads.length === 0 ? (
        <div>No support messages yet.</div>
      ) : (
        threads.map(thread => (
          <div key={thread.user_id} className="mb-8 border rounded-lg p-4 bg-gray-50">
            <div className="font-semibold mb-2">
              User: {thread.name || 'Unknown'} (<span className="text-xs text-gray-500">{thread.email || 'No email'}</span>)<br />
              <span className="text-xs text-gray-500">User ID: {thread.user_id}</span>
            </div>
            <div className="h-48 overflow-y-auto mb-2 flex flex-col gap-2">
              {thread.messages && thread.messages.length > 0 ? (
                thread.messages.map(msg => (
                  <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`px-3 py-2 rounded-lg max-w-xs ${msg.sender === 'user' ? 'bg-amber-200 text-right' : 'bg-gray-200 text-left'}`}>
                      <div className="text-sm">{msg.message}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        {format(new Date(msg.created_at), 'dd MMM yyyy HH:mm')}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-gray-500">No messages yet for this user.</div>
              )}
            </div>
            <form onSubmit={e => { e.preventDefault(); sendReply(thread.user_id); }} className="flex gap-2">
              <input
                type="text"
                className="flex-1 border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="Type your reply..."
                value={reply[thread.user_id] || ''}
                onChange={e => setReply(r => ({ ...r, [thread.user_id]: e.target.value }))}
                disabled={status[thread.user_id] === 'sending'}
              />
              <button
                type="submit"
                className="bg-amber-600 text-white px-4 py-2 rounded hover:bg-amber-700"
                disabled={status[thread.user_id] === 'sending' || !(reply[thread.user_id] || '').trim()}
              >
                {status[thread.user_id] === 'sending' ? 'Sending...' : 'Send'}
              </button>
              {status[thread.user_id] === 'sent' && <span className="ml-2 text-green-600">Reply sent!</span>}
              {status[thread.user_id] === 'error' && <span className="ml-2 text-red-600">Unable to send reply. Please try again.</span>}
            </form>
          </div>
        ))
      )}
    </section>
  );
}
