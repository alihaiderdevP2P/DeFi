"use client";

import { useState } from "react";

export default function SupportPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setName("");
    setEmail("");
    setMessage("");
  };

  return (
    <div className="space-y-6">
      <section className="app-panel p-6 md:p-8">
        <h1 className="text-3xl font-bold tracking-tight">Support Center</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-300">
          Get help with wallet setup, campaign creation, and donation flow issues.
        </p>
      </section>

      <section className="app-panel p-5">
        <h2 className="text-xl font-semibold">Contact Support</h2>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
          Send your request and we will follow up quickly.
        </p>
        <form onSubmit={submit} className="mt-4 space-y-3">
          <input
            className="app-input"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="email"
            className="app-input"
            placeholder="Your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <textarea
            className="app-input min-h-32"
            placeholder="Describe your issue"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />
          <button className="app-button-primary">Send Request</button>
        </form>
        {submitted ? (
          <p className="mt-3 text-sm text-emerald-600 dark:text-emerald-300">
            Request submitted successfully. Our team will contact you soon.
          </p>
        ) : null}
      </section>
    </div>
  );
}
