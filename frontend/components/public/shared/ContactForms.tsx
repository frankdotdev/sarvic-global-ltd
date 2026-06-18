'use client';

import { useState } from 'react';
import { api, getErrorMessage } from '@/lib/api';
import { CheckCircle } from '@phosphor-icons/react';

type Tab = 'quote' | 'contact';

const serviceTypes = [
  'Integrated Logistics', 'Global Procurement', 'Manufacturing',
  'Automotive', 'Foreign Exchange', 'Other / Not Sure',
];

export default function ContactForms() {
  const [tab, setTab] = useState<Tab>('quote');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const [quoteForm, setQuoteForm] = useState({
    full_name: '', email: '', phone: '', company: '', service_type: serviceTypes[0],
    origin: '', destination: '', cargo_description: '', estimated_weight: '', additional_notes: '',
  });

  const [contactForm, setContactForm] = useState({
    full_name: '', email: '', phone: '', company: '', subject: '', message: '',
  });

  const handleQuoteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      await api.post('/contact/quote', quoteForm);
      setSuccess(true);
      setQuoteForm({ full_name: '', email: '', phone: '', company: '', service_type: serviceTypes[0], origin: '', destination: '', cargo_description: '', estimated_weight: '', additional_notes: '' });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      await api.post('/contact/contact', contactForm);
      setSuccess(true);
      setContactForm({ full_name: '', email: '', phone: '', company: '', subject: '', message: '' });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div id="quote" className="bg-white border border-rule p-10 text-center">
        <CheckCircle size={40} weight="light" className="text-gold mx-auto mb-5" />
        <h3 className="font-display text-2xl text-ink mb-3">Message Received</h3>
        <p className="text-sm text-mist mb-6">
          Thank you for reaching out. Our team will respond within 24 hours.
        </p>
        <button onClick={() => setSuccess(false)} className="text-2xs tracking-wider uppercase text-gold hover:text-gold-dark">
          Send Another Message
        </button>
      </div>
    );
  }

  return (
    <div id="quote" className="bg-white border border-rule p-7 md:p-10">
      {/* Tabs */}
      <div className="flex gap-8 mb-8 border-b border-rule">
        <button
          onClick={() => setTab('quote')}
          className={`text-2xs tracking-wider uppercase pb-4 border-b-2 transition-colors ${
            tab === 'quote' ? 'border-gold text-ink' : 'border-transparent text-mist hover:text-ink'
          }`}
        >
          Request a Quote
        </button>
        <button
          onClick={() => setTab('contact')}
          className={`text-2xs tracking-wider uppercase pb-4 border-b-2 transition-colors ${
            tab === 'contact' ? 'border-gold text-ink' : 'border-transparent text-mist hover:text-ink'
          }`}
        >
          General Inquiry
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 p-4 mb-6">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {tab === 'quote' ? (
        <form onSubmit={handleQuoteSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="label">Full Name *</label>
              <input required className="input" value={quoteForm.full_name} onChange={(e) => setQuoteForm({ ...quoteForm, full_name: e.target.value })} />
            </div>
            <div>
              <label className="label">Email *</label>
              <input required type="email" className="input" value={quoteForm.email} onChange={(e) => setQuoteForm({ ...quoteForm, email: e.target.value })} />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="label">Phone</label>
              <input className="input" value={quoteForm.phone} onChange={(e) => setQuoteForm({ ...quoteForm, phone: e.target.value })} />
            </div>
            <div>
              <label className="label">Company</label>
              <input className="input" value={quoteForm.company} onChange={(e) => setQuoteForm({ ...quoteForm, company: e.target.value })} />
            </div>
          </div>
          <div>
            <label className="label">Service Needed *</label>
            <select required className="input" value={quoteForm.service_type} onChange={(e) => setQuoteForm({ ...quoteForm, service_type: e.target.value })}>
              {serviceTypes.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="label">Origin</label>
              <input className="input" placeholder="e.g. Guangzhou, China" value={quoteForm.origin} onChange={(e) => setQuoteForm({ ...quoteForm, origin: e.target.value })} />
            </div>
            <div>
              <label className="label">Destination</label>
              <input className="input" placeholder="e.g. Lagos, Nigeria" value={quoteForm.destination} onChange={(e) => setQuoteForm({ ...quoteForm, destination: e.target.value })} />
            </div>
          </div>
          <div>
            <label className="label">Cargo Description</label>
            <textarea rows={3} className="input resize-none" value={quoteForm.cargo_description} onChange={(e) => setQuoteForm({ ...quoteForm, cargo_description: e.target.value })} />
          </div>
          <div>
            <label className="label">Estimated Weight / Volume</label>
            <input className="input" placeholder="e.g. 500kg, 2 containers" value={quoteForm.estimated_weight} onChange={(e) => setQuoteForm({ ...quoteForm, estimated_weight: e.target.value })} />
          </div>
          <div>
            <label className="label">Additional Notes</label>
            <textarea rows={3} className="input resize-none" value={quoteForm.additional_notes} onChange={(e) => setQuoteForm({ ...quoteForm, additional_notes: e.target.value })} />
          </div>
          <button type="submit" disabled={submitting} className="btn-primary w-full justify-center py-4 disabled:opacity-60">
            {submitting ? 'Submitting…' : 'Request Quote'}
          </button>
        </form>
      ) : (
        <form onSubmit={handleContactSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="label">Full Name *</label>
              <input required className="input" value={contactForm.full_name} onChange={(e) => setContactForm({ ...contactForm, full_name: e.target.value })} />
            </div>
            <div>
              <label className="label">Email *</label>
              <input required type="email" className="input" value={contactForm.email} onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })} />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="label">Phone</label>
              <input className="input" value={contactForm.phone} onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })} />
            </div>
            <div>
              <label className="label">Company</label>
              <input className="input" value={contactForm.company} onChange={(e) => setContactForm({ ...contactForm, company: e.target.value })} />
            </div>
          </div>
          <div>
            <label className="label">Subject *</label>
            <input required className="input" value={contactForm.subject} onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })} />
          </div>
          <div>
            <label className="label">Message *</label>
            <textarea required rows={5} className="input resize-none" value={contactForm.message} onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })} />
          </div>
          <button type="submit" disabled={submitting} className="btn-primary w-full justify-center py-4 disabled:opacity-60">
            {submitting ? 'Sending…' : 'Send Message'}
          </button>
        </form>
      )}
    </div>
  );
}
