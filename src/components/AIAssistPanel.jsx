import { useState, useRef, useEffect } from 'react';
import { X, Sparkles, Send } from 'lucide-react';

const suggestions = [
  'Can you help me with my first task?',
  'Create a template for a product design doc',
  'What is the SQL query for sorting by date?',
];

export default function AIAssistPanel({ isOpen, onClose }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setMessages((prev) => [...prev, { type: 'user', text: userMsg }]);
    setInput('');

    setTimeout(() => {
      const responses = [
        "I'd be happy to help with that! Let me know what specific guidance you need.",
        "Great question. Here's my suggestion: break it down into smaller steps and tackle the highest priority items first.",
        "Absolutely! Based on your current tasks, I recommend focusing on the design system before moving to hero sections.",
        "Here are some best practices for that: keep it simple, use consistent naming, and document everything.",
      ];
      const response = responses[Math.floor(Math.random() * responses.length)];
      setMessages((prev) => [...prev, { type: 'ai', text: response }]);
    }, 800);
  };

  const handleSuggestion = (text) => {
    setMessages((prev) => [...prev, { type: 'user', text }]);
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { type: 'ai', text: "That's a great question! Here's what I suggest based on your current workflow..." },
      ]);
    }, 800);
  };

  if (!isOpen) return null;

  return (
    <aside className="w-[340px] h-screen bg-white dark:bg-[#1a1d29] rounded-l-2xl flex flex-col shrink-0 animate-[slideIn_0.3s_ease-out] shadow-[-2px_0_8px_rgba(0,0,0,0.04)] dark:shadow-none transition-colors duration-300">
      {/* Header */}
      <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-gray-800 transition-colors">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">AI Assist</h2>
            <Sparkles size={16} className="text-yellow-500" />
          </div>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
            Knowledge, answers, ideas. One click away.
          </p>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 dark:text-gray-500 transition-colors cursor-pointer"
        >
          <X size={18} />
        </button>
      </div>

      {/* Chat Area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-5">
        {messages.length === 0 && (
          <div className="text-center mt-8">
            <p className="text-sm text-gray-400 dark:text-gray-500 mb-1">Hi, Pristia</p>
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-8">How can I help you?</h3>
            <div className="flex justify-center mb-6">
              <Sparkles size={28} className="text-primary-400 dark:text-primary-500" />
            </div>
          </div>
        )}

        <div className="space-y-4">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={'flex ' + (msg.type === 'user' ? 'justify-end' : 'justify-start')}
            >
              <div
                className={
                  'max-w-[85%] px-4 py-2.5 rounded-2xl text-sm ' +
                  (msg.type === 'user'
                    ? 'bg-primary-500 text-white rounded-br-md'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-bl-md')
                }
              >
                {msg.text}
              </div>
            </div>
          ))}
        </div>

        {messages.length === 0 && (
          <div className="space-y-2 mt-4">
            {suggestions.map((s) => (
              <button
                key={s}
                onClick={() => handleSuggestion(s)}
                className="w-full text-left px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 text-sm text-gray-600 dark:text-gray-400 transition-colors cursor-pointer"
              >
                "{s}"
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-100 dark:border-gray-800 transition-colors">
        <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800/50 rounded-xl px-4 py-3 transition-colors">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Write something.."
            className="flex-1 bg-transparent text-sm text-gray-800 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 outline-none"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className={
              'w-8 h-8 rounded-full flex items-center justify-center text-white transition-colors cursor-pointer shrink-0 ' +
              (input.trim() ? 'bg-primary-500 hover:bg-primary-600' : 'bg-gray-300 dark:bg-gray-600')
            }
          >
            <Send size={14} />
          </button>
        </div>
      </div>
    </aside>
  );
}
