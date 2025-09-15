"use client";
import { useEffect, useState } from 'react';

interface ContactMessage {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  created_at: string;
  replied: 0 | 1;
  reply_message?: string;
  replied_at?: string;
}

export default function ContactMessagesAdmin() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [reply, setReply] = useState<{ [id: number]: string }>({});
  const [status, setStatus] = useState<{ [id: number]: string }>({});

  const [fetchError, setFetchError] = useState<string | null>(null);
  useEffect(() => {
    fetch('/api/admin/contact-messages')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setMessages(data);
        } else {
          setFetchError(data?.error || 'Unexpected response');
        }
      })
      .catch(err => setFetchError('Failed to fetch messages'))
      .finally(() => setLoading(false));
  }, []);

  async function handleReply(id: number) {
    setStatus(s => ({ ...s, [id]: 'sending' }));
    const res = await fetch('/api/admin/contact-messages', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, reply_message: reply[id] }),
    });
    if (res.ok) {
      setStatus(s => ({ ...s, [id]: 'sent' }));
      setMessages(msgs => msgs.map(m => m.id === id ? { ...m, replied: 1, reply_message: reply[id], replied_at: new Date().toISOString() } : m));
    } else {
      setStatus(s => ({ ...s, [id]: 'error' }));
    }
  }

  if (loading) return <div>Loading contact messages...</div>;
  if (fetchError) return <div className="text-red-600">{fetchError}</div>;

  return (
    <section id="contact-messages" className="bg-white/80 backdrop-blur-lg p-8 rounded-2xl shadow-lg mb-8">
      <h2 className="text-2xl font-bold mb-6 text-amber-700">Contact Messages</h2>
      {messages.length === 0 ? (
        <div>No contact messages yet.</div>
      ) : (
        <div className="space-y-6">
          {messages.map(msg => (
            <div key={msg.id} className="border rounded-lg p-4 bg-gray-50">
              <div className="flex justify-between items-center mb-2">
                <div>
                  <span className="font-semibold">{msg.name}</span> (<a href={`mailto:${msg.email}`} className="text-amber-700 underline">{msg.email}</a>)
                </div>
                <span className="text-xs text-gray-500">{new Date(msg.created_at).toLocaleString()}</span>
              </div>
              <div className="mb-2">
                <span className="font-semibold">Subject:</span> {msg.subject}
              </div>
              <div className="mb-2">
                <span className="font-semibold">Message:</span> {msg.message}
              </div>
              {msg.replied ? (
                <div className="mt-2 p-2 bg-green-50 border-l-4 border-green-400">
                  <div className="font-semibold text-green-700">Replied</div>
                  <div className="text-sm text-gray-700">{msg.reply_message}</div>
                  <div className="text-xs text-gray-500">{msg.replied_at ? new Date(msg.replied_at).toLocaleString() : ''}</div>
                </div>
              ) : (
                <div className="mt-2">
                  <textarea
                    className="w-full border rounded p-2 mb-2"
                    rows={2}
                    placeholder="Type your reply..."
                    value={reply[msg.id] || ''}
                    onChange={e => setReply(r => ({ ...r, [msg.id]: e.target.value }))}
                  />
                  <button
                    className="bg-amber-600 text-white px-4 py-2 rounded hover:bg-amber-700"
                    onClick={() => handleReply(msg.id)}
                    disabled={!reply[msg.id] || status[msg.id] === 'sending'}
                  >
                    {status[msg.id] === 'sending' ? 'Sending...' : 'Send Reply'}
                  </button>
                  {status[msg.id] === 'sent' && <span className="ml-2 text-green-600">Reply sent!</span>}
                  {status[msg.id] === 'error' && <span className="ml-2 text-red-600">Error sending reply.</span>}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
