'use client';

import { useRouter } from 'next/navigation';
import React, { useState, useRef, useEffect } from 'react';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

type ApiResponse = {
  response?: string;
  [key: string]: string | undefined;
};

export default function HomePage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const router = useRouter();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

    useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.replace('/login');
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    const token = localStorage.getItem('token');
    const userMessage: Message = { role: 'user', content: query };

    setMessages((prev) => [...prev, userMessage]);
    setQuery('');
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/chats/start-pdf-chat`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userName: 'Ita_chat',
            query: userMessage.content,
          }),
        }
      );

      if (!res.ok) throw new Error('API error: ' + res.status);

      const data: ApiResponse = await res.json();

      const botMessage: Message = {
        role: 'assistant',
        content: data.response || JSON.stringify(data, null, 2),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='bg-gray-100'>
        <div className="flex flex-col justify-between h-screen w-full mx-auto font-sans">
            <h1 className="text-2xl font-bold my-6 text-center">PDF Chat API Tester</h1>
            <div className="flex flex-col flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg, idx) => (
                <div
                    key={idx}
                    className={`p-2 rounded-xl inline-block max-w-[80%]  ${
                    msg.role === 'user'
                        ? 'bg-gray-200 text-black ml-auto'
                        : 'bg-gray-200 text-gray-800 self-start'
                    }`}
                    dangerouslySetInnerHTML={{ __html: msg.content }}
                />
                ))}
                {loading && (
                <div className="text-gray-500 text-sm">Assistant is typing...</div>
                )}
                {error && <div className="text-red-600">❌ {error}</div>}
                <div ref={messagesEndRef} />
            </div>

            <form
                onSubmit={handleSubmit}
                className="p-4 flex items-center gap-2 mb-5 w-full max-w-4xl mx-auto"
            >
                <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
                placeholder="Type your message..."
                />
                <button
                type="submit"
                disabled={loading}
                className={`px-4 py-2 rounded-md text-white font-semibold ${
                    loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
                }`}
                >
                Send
                </button>
            </form>
        </div>
    </div>
  );
}
