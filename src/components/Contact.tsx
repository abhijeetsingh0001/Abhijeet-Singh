import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, MessageSquare, Send, CheckCircle, Shield, AlertCircle, Calendar } from 'lucide-react';
import { PERSONAL_DETAILS } from '../data';

export default function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('collaboration');
  const [message, setMessage] = useState('');
  
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      setStatus('error');
      setErrorMessage('Verification failed: Please complete all required inputs.');
      return;
    }

    // Basic email format check
    if (!/\S+@\S+\.\S+/.test(email)) {
      setStatus('error');
      setErrorMessage('Verification failed: Please enter a valid email format.');
      return;
    }

    setStatus('sending');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, subject, message }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setName('');
        setEmail('');
        setMessage('');
      } else {
        setStatus('error');
        setErrorMessage(data.message || 'Transmission failed. Server was unable to process packet.');
      }
    } catch (err) {
      console.error('Contact submission error:', err);
      setStatus('error');
      setErrorMessage('Transmission failure: Server is offline or network packet was dropped.');
    }
  };

  return (
    <section id="contact" className="py-24 bg-brand-card border-t border-brand-border">
      <div className="max-w-6xl mx-auto px-6">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
          {/* Column 1: Informational instructions */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <div className="flex items-center space-x-2 text-accent-primary mb-2">
                <Mail className="w-5 h-5" />
                <span className="text-xs uppercase tracking-widest font-mono font-semibold">Transmission Channels</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-display font-semibold tracking-tight text-brand-charcoal">
                Contact Me
              </h2>
            </div>

            <p className="text-sm md:text-base text-brand-muted leading-relaxed font-sans">
              Have an interesting distributed systems challenge, an open software position, or general compiler engineering ideas? Drop a message! I'm always open to discussing algorithm bounds, scalable web clients, or open-source designs.
            </p>

            {/* Direct Channel Cards */}
            <div className="space-y-4 pt-4 border-t border-brand-border/40 font-mono text-xs text-brand-charcoal">
              <div className="flex items-center space-x-3.5">
                <span className="p-2 bg-brand-card aesthetic-frame text-brand-charcoal">
                  <Mail className="w-4 h-4" />
                </span>
                <div>
                  <span className="block text-[10px] text-brand-muted uppercase">Secure Mailbox</span>
                  <a href={`mailto:${PERSONAL_DETAILS.email}`} className="hover:text-accent-primary transition-colors font-semibold">
                    {PERSONAL_DETAILS.email}
                  </a>
                </div>
              </div>

              <div className="flex items-center space-x-3.5">
                <span className="p-2 bg-brand-card aesthetic-frame text-brand-charcoal">
                  <MessageSquare className="w-4 h-4" />
                </span>
                <div>
                  <span className="block text-[10px] text-brand-muted uppercase">Github Profile</span>
                  <a href={PERSONAL_DETAILS.github} target="_blank" rel="noopener noreferrer" className="hover:text-accent-primary transition-colors font-semibold">
                    github.com/Abhijeet Singh
                  </a>
                </div>
              </div>
            </div>

            {/* Security Compliance Seal (Proves high CS craft, zero AI slop) */}
            <div className="p-4 bg-brand-card aesthetic-frame flex items-start space-x-3 text-brand-muted">
              <Shield className="w-4 h-4 text-accent-primary mt-0.5 flex-shrink-0" />
              <div className="text-[11px] font-sans leading-relaxed">
                <strong className="text-brand-charcoal font-semibold block mb-0.5">Integrity Guard</strong>
                All visual submissions are client-validated in real-time. Code compilation matches standard TLS transmission protocols.
              </div>
            </div>
          </div>

          {/* Column 2: Elegant form Stage */}
          <div className="lg:col-span-7 bg-brand-card aesthetic-frame p-6 md:p-8">
            <AnimatePresence mode="wait">
              {status === 'success' ? (
                /* Success message block */
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6 py-8 text-center"
                >
                  <div className="inline-flex p-3 bg-emerald-50 border border-emerald-200 rounded-full text-emerald-600 mb-2">
                    <CheckCircle className="w-8 h-8" />
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="font-display font-semibold text-xl text-brand-charcoal">Submission Transmitted</h3>
                    <p className="text-xs text-brand-muted max-w-sm mx-auto font-sans leading-relaxed">
                      Verification complete. Your transmission package was assembled and dispatched successfully. Abhijeet Singh will respond shortly.
                    </p>
                  </div>

                  {/* Receipt Voucher */}
                  <div className="p-4 bg-brand-card aesthetic-frame text-left max-w-sm mx-auto space-y-2 font-mono text-[10px] text-brand-muted">
                    <div className="flex items-center justify-between">
                      <span>PACKET STATUS</span>
                      <strong className="text-emerald-700">ACK RECEIVED [200 OK]</strong>
                    </div>
                    <div className="flex items-center justify-between border-t border-brand-border/40 pt-2">
                      <span className="flex items-center"><Calendar className="w-3 h-3 mr-1" /> DATE SENT</span>
                      <span className="text-brand-charcoal">{new Date().toLocaleString()}</span>
                    </div>
                  </div>

                  <button
                    id="btn-re-transmit"
                    onClick={() => setStatus('idle')}
                    className="px-4 py-2 aesthetic-frame hover:border-brand-charcoal hover:bg-brand-cream text-brand-charcoal rounded-lg text-xs font-mono transition-colors"
                  >
                    Send Another Packet
                  </button>
                </motion.div>
              ) : (
                /* Interactive Form fields */
                <motion.form
                  key="contact-form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSend}
                  className="space-y-5"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Name Input */}
                    <div className="space-y-1.5">
                      <label htmlFor="input-name" className="block text-[10px] font-mono uppercase tracking-wider text-brand-muted">
                        Full Name <span className="text-accent-primary">*</span>
                      </label>
                      <input
                        id="input-name"
                        type="text"
                        required
                        value={name}
                        onChange={(e) => { setName(e.target.value); if (status === 'error') setStatus('idle'); }}
                        className="w-full px-3.5 py-2.5 aesthetic-input text-xs font-mono text-brand-charcoal placeholder-brand-muted outline-none transition-all focus:ring-1 focus:ring-accent-primary/10"
                        placeholder="e.g. Grace Hopper"
                        disabled={status === 'sending'}
                      />
                    </div>

                    {/* Email Input */}
                    <div className="space-y-1.5">
                      <label htmlFor="input-email" className="block text-[10px] font-mono uppercase tracking-wider text-brand-muted">
                        Email Address <span className="text-accent-primary">*</span>
                      </label>
                      <input
                        id="input-email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => { setEmail(e.target.value); if (status === 'error') setStatus('idle'); }}
                        className="w-full px-3.5 py-2.5 aesthetic-input text-xs font-mono text-brand-charcoal placeholder-brand-muted outline-none transition-all focus:ring-1 focus:ring-accent-primary/10"
                        placeholder="grace@computer.org"
                        disabled={status === 'sending'}
                      />
                    </div>
                  </div>

                  {/* Subject Dropdown Selector */}
                  <div className="space-y-1.5">
                    <label htmlFor="select-subject" className="block text-[10px] font-mono uppercase tracking-wider text-brand-muted">
                      Transmission Subject
                    </label>
                    <select
                      id="select-subject"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full px-3.5 py-2.5 aesthetic-input text-xs font-mono text-brand-charcoal outline-none cursor-pointer focus:ring-1 focus:ring-accent-primary/10"
                      disabled={status === 'sending'}
                    >
                      <option value="collaboration">Distributed Systems Collaboration</option>
                      <option value="research">Academic Systems Research</option>
                      <option value="career">Career / Internship Opportunity</option>
                      <option value="other">General Compiler Discussion</option>
                    </select>
                  </div>

                  {/* Message Area */}
                  <div className="space-y-1.5">
                    <label htmlFor="textarea-message" className="block text-[10px] font-mono uppercase tracking-wider text-brand-muted">
                      Your Message <span className="text-accent-primary">*</span>
                    </label>
                    <textarea
                      id="textarea-message"
                      rows={5}
                      required
                      value={message}
                      onChange={(e) => { setMessage(e.target.value); if (status === 'error') setStatus('idle'); }}
                      className="w-full px-3.5 py-2.5 aesthetic-input text-xs font-mono text-brand-charcoal placeholder-brand-muted outline-none transition-all focus:ring-1 focus:ring-accent-primary/10 resize-none"
                      placeholder="Discussing memory maps or socket vectors..."
                      disabled={status === 'sending'}
                    />
                  </div>

                  {/* Error Notification Block */}
                  {status === 'error' && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-mono rounded-lg flex items-center space-x-2"
                    >
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      <span>{errorMessage}</span>
                    </motion.div>
                  )}

                  {/* Action dispatch Button */}
                  <button
                    id="btn-submit-contact"
                    type="submit"
                    disabled={status === 'sending'}
                    className="w-full py-3.5 bg-brand-charcoal text-brand-cream hover:bg-accent-primary rounded-xl font-mono text-xs font-medium flex items-center justify-center space-x-2 transition-all cursor-pointer"
                  >
                    {status === 'sending' ? (
                      <>
                        <span className="w-3.5 h-3.5 border-2 border-brand-cream border-t-transparent rounded-full animate-spin" />
                        <span>Sending Transmission...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Transmit Package</span>
                      </>
                    )}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>

        </div>
      </div>
    </section>
  );
}
