"use client";

import React, { useState } from "react";
import { Mail, Phone, MapPin, MessageSquare, Clock, Send } from "lucide-react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("Fit & Sizing Consultation");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-16">
      <div className="text-center space-y-3 max-w-xl mx-auto">
        <span className="text-xs uppercase tracking-[0.25em] font-bold text-brand-600">Client Care & Concierge</span>
        <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-stone-900">
          How May We Assist You?
        </h1>
        <p className="text-stone-500 text-xs sm:text-sm leading-relaxed">
          From custom sizing advice to order dispatch inquiries, our dedicated fashion concierge is here to help.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Contact Information (5 Cols) */}
        <div className="lg:col-span-5 bg-stone-900 text-white rounded-3xl p-8 space-y-6 shadow-xl">
          <h3 className="font-serif text-xl font-bold text-champagne-300">Concierge Desk</h3>
          <p className="text-xs text-stone-300 leading-relaxed">
            Available 7 days a week for styling guidance, urgent wedding orders, and order modifications.
          </p>

          <div className="space-y-4 pt-4 text-xs">
            <div className="flex items-start gap-3">
              <Phone className="w-4 h-4 text-brand-400 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="block text-white">Call / WhatsApp Concierge</strong>
                <span className="text-stone-400">+91 (80) 4123-8899</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Mail className="w-4 h-4 text-brand-400 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="block text-white">Email Inquiries</strong>
                <span className="text-stone-400">concierge@auraluxe.com</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-brand-400 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="block text-white">Flagship Studio & Atelier</strong>
                <span className="text-stone-400">100ft Road, Indiranagar, Bengaluru, KA 560038</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="w-4 h-4 text-brand-400 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="block text-white">Concierge Hours</strong>
                <span className="text-stone-400">Monday - Sunday: 9:00 AM - 9:00 PM IST</span>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-8 border border-stone-200 shadow-sm">
          {submitted ? (
            <div className="py-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center">
                <MessageSquare className="w-8 h-8" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-stone-900">Message Received</h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                Thank you, {name}. A member of our styling concierge will reply to <strong>{email}</strong> within 4 business hours.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="text-xs font-semibold text-brand-600 underline"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ananya Sharma"
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:ring-1 focus:ring-brand-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ananya@example.com"
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:ring-1 focus:ring-brand-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Inquiry Subject</label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:ring-1 focus:ring-brand-500 focus:outline-none"
                >
                  <option value="Fit & Sizing Consultation">Fit & Sizing Consultation</option>
                  <option value="Order Tracking / Dispatch">Order Tracking / Dispatch</option>
                  <option value="Return / Exchange Assistance">Return / Exchange Assistance</option>
                  <option value="Custom Festive / Bridal Inquiry">Custom Festive / Bridal Inquiry</option>
                  <option value="General Question">General Question</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Your Message *</label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="How can we help make your shopping experience flawless?"
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:ring-1 focus:ring-brand-500 focus:outline-none resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold uppercase tracking-wider py-3.5 rounded-xl transition-all shadow-md shadow-brand-500/20 flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>Send Message to Concierge</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
