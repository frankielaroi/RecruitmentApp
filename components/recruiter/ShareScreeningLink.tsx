'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';

interface ShareScreeningLinkProps {
  jobId: string;
  screeningId: string;
}

export function ShareScreeningLink({ jobId, screeningId }: ShareScreeningLinkProps) {
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);

  const getScreeningUrl = () => {
    if (typeof window === 'undefined') return '';
    return `${window.location.origin}/screening/${jobId}`;
  };

  const handleCopyLink = async () => {
    const url = getScreeningUrl();
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  const handleShareVia = (method: 'email' | 'whatsapp' | 'sms') => {
    const url = getScreeningUrl();
    const message = `Take this phone screening for our open position: ${url}`;

    switch (method) {
      case 'email':
        window.open(
          `mailto:?subject=Phone%20Screening&body=${encodeURIComponent(message)}`,
          '_blank'
        );
        break;
      case 'whatsapp':
        window.open(
          `https://wa.me/?text=${encodeURIComponent(message)}`,
          '_blank'
        );
        break;
      case 'sms':
        window.open(`sms:?body=${encodeURIComponent(message)}`);
        break;
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-slate-900 dark:text-white">
          Candidate Screening Link
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            readOnly
            value={getScreeningUrl()}
            className="flex-1 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-mono"
          />
          <Button
            size="sm"
            onClick={handleCopyLink}
            variant={copied ? 'secondary' : 'primary'}
          >
            {copied ? '✓ Copied' : 'Copy'}
          </Button>
        </div>
        <p className="text-xs text-slate-600 dark:text-slate-400">
          Share this link with candidates to collect their responses
        </p>
      </div>

      {/* Share Options */}
      <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg p-4">
        <p className="text-sm font-medium text-slate-900 dark:text-white mb-3">
          Share via:
        </p>
        <div className="grid grid-cols-3 gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => handleShareVia('email')}
            className="text-xs"
          >
            📧 Email
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => handleShareVia('whatsapp')}
            className="text-xs"
          >
            💬 WhatsApp
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => handleShareVia('sms')}
            className="text-xs"
          >
            💬 SMS
          </Button>
        </div>
      </div>
    </div>
  );
}
