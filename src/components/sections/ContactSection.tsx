'use client';

import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

interface ContactProps {
  settings: any;
  t: Record<string, string>;
  lang: string;
}

export function ContactSection({ settings, t, lang }: ContactProps) {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        setStatus('success');
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  return (
    <section id="contact" className="relative py-32 px-6 md:px-12 max-w-7xl mx-auto z-20">
      <div className="text-center mb-20">
        <h2 className="text-xs uppercase font-bold tracking-[0.3em] text-accent mb-3">{t.contact || 'GET IN TOUCH'}</h2>
        <p className="text-4xl md:text-5xl font-extrabold text-white">Let’s Engineer Something Great</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Contact Info Card */}
        <div className="lg:col-span-5 glass-card p-8 md:p-10 rounded-3xl space-y-8">
          <h3 className="text-2xl font-bold text-white">{t.contactInfo || 'Contact Information'}</h3>

          <div className="space-y-6 text-sm text-slate-300">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl glass-panel flex items-center justify-center text-accent">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold text-white">{t.address || 'Address'}</h4>
                <a href={settings.location_url} target="_blank" className="text-accent hover:underline">
                  {settings['location_' + lang] || settings.location_en}
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl glass-panel flex items-center justify-center text-accent">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold text-white">{t.email || 'Email'}</h4>
                <a href={`mailto:${settings.email_1}`} className="text-accent hover:underline block">
                  {settings.email_1}
                </a>
                <a href={`mailto:${settings.email_2}`} className="text-accent hover:underline block">
                  {settings.email_2}
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl glass-panel flex items-center justify-center text-accent">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold text-white">{t.phoneLabel || 'Phone'}</h4>
                <a href={`tel:${settings.phone}`} className="text-accent hover:underline">
                  {settings.phone_display || settings.phone}
                </a>
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className="pt-4 border-t border-white/10">
            <h4 className="font-semibold text-white mb-4 text-sm">{t.socialMedia || 'Social Media'}</h4>
            <div className="flex gap-4">
              {settings.linkedin && (
                <a href={settings.linkedin} target="_blank" className="w-10 h-10 rounded-full glass-panel flex items-center justify-center text-white hover:bg-accent transition-colors text-lg">
                  <i className="fab fa-linkedin" />
                </a>
              )}
              {settings.github && (
                <a href={settings.github} target="_blank" className="w-10 h-10 rounded-full glass-panel flex items-center justify-center text-white hover:bg-accent transition-colors text-lg">
                  <i className="fab fa-github" />
                </a>
              )}
              {settings.instagram && (
                <a href={settings.instagram} target="_blank" className="w-10 h-10 rounded-full glass-panel flex items-center justify-center text-white hover:bg-accent transition-colors text-lg">
                  <i className="fab fa-instagram" />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-7 glass-card p-8 md:p-10 rounded-3xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                {t.nameLabel || 'Name'}
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-slate-900/60 border border-slate-700 focus:border-accent rounded-xl px-4 py-3 text-white outline-none transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                {t.emailLabel || 'Email'}
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-slate-900/60 border border-slate-700 focus:border-accent rounded-xl px-4 py-3 text-white outline-none transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                {t.subjectLabel || 'Subject'}
              </label>
              <input
                type="text"
                required
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full bg-slate-900/60 border border-slate-700 focus:border-accent rounded-xl px-4 py-3 text-white outline-none transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                {t.messageLabel || 'Message'}
              </label>
              <textarea
                rows={4}
                required
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full bg-slate-900/60 border border-slate-700 focus:border-accent rounded-xl px-4 py-3 text-white outline-none transition"
              />
            </div>

            <button
              type="submit"
              disabled={status === 'submitting'}
              className="w-full py-4 rounded-xl bg-accent hover:opacity-90 text-white font-bold text-sm tracking-wider uppercase transition-all shadow-[0_0_25px_var(--glass-border)] flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>{status === 'submitting' ? 'Sending...' : t.sendBtn || 'Send Message'}</span>
            </button>

            {status === 'success' && (
              <p className="text-emerald-400 text-sm font-semibold text-center">Message sent successfully! 😊</p>
            )}
            {status === 'error' && (
              <p className="text-rose-400 text-sm font-semibold text-center">Failed to send message. Please try again.</p>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}
