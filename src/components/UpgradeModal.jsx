import { X, Check, Sparkles, Users, Zap, Crown } from 'lucide-react';

const features = [
  { icon: Users, text: 'Unlimited team workspaces' },
  { icon: Zap, text: 'Advanced analytics & insights' },
  { icon: Crown, text: 'Priority AI Assist access' },
  { icon: Sparkles, text: 'Custom themes & branding' },
];

export default function UpgradeModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white dark:bg-[#1a1d29] rounded-3xl shadow-2xl w-full max-w-md p-8 animate-[fadeIn_0.2s_ease-out] transition-colors duration-300">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 dark:text-gray-500 transition-colors cursor-pointer"
        >
          <X size={18} />
        </button>

        {/* Icon */}
        <div className="w-14 h-14 rounded-2xl bg-primary-500 flex items-center justify-center mb-5 mx-auto">
          <Crown size={28} className="text-white" />
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 text-center mb-2">
          Upgrade to Pro
        </h2>
        <p className="text-sm text-gray-400 dark:text-gray-500 text-center mb-6">
          Unlock the full potential of BetterTasks and supercharge your productivity.
        </p>

        {/* Features */}
        <div className="space-y-3 mb-8">
          {features.map((f) => (
            <div
              key={f.text}
              className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50"
            >
              <div className="w-8 h-8 rounded-lg bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center shrink-0">
                <f.icon size={16} className="text-primary-500" />
              </div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{f.text}</span>
              <Check size={16} className="text-emerald-500 ml-auto shrink-0" />
            </div>
          ))}
        </div>

        {/* Pricing */}
        <div className="text-center mb-6">
          <div className="flex items-baseline justify-center gap-1">
            <span className="text-4xl font-bold text-gray-900 dark:text-gray-100">$12</span>
            <span className="text-sm text-gray-400 dark:text-gray-500">/month</span>
          </div>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Billed annually. Cancel anytime.</p>
        </div>

        {/* CTA */}
        <button
          onClick={onClose}
          className="w-full h-12 rounded-xl bg-primary-500 hover:bg-primary-600 text-white font-semibold text-sm transition-colors cursor-pointer shadow-lg shadow-primary-500/25"
        >
          Upgrade Now
        </button>
        <button
          onClick={onClose}
          className="w-full h-12 rounded-xl text-gray-400 dark:text-gray-500 font-medium text-sm hover:text-gray-600 dark:hover:text-gray-300 transition-colors cursor-pointer mt-1"
        >
          Maybe later
        </button>
      </div>
    </div>
  );
}
