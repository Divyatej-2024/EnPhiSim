import React, { useEffect } from "react";
import { motion } from "framer-motion";

export default function ThankYouPage() {
  useEffect(() => {
    // timestamp
    const ts = document.getElementById("ts");
    if (ts) ts.textContent = new Date().toLocaleString();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a] p-6 bg-gradient-to-b from-[#0f172a] to-[#071025] text-slate-100 relative overflow-hidden">
      <div className="max-w-3xl w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl relative">
        {/* Floating Icon */}
        <motion.div
          initial={{ y: 0 }}
          animate={{ y: -8 }}
          transition={{ duration: 2.5, repeat: Infinity, repeatType: "reverse" }}
          className="w-24 h-24 rounded-3xl bg-gradient-to-br from-purple-600 to-cyan-400 grid place-items-center shadow-xl"
        >
          <svg
            width="52"
            height="52"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M20 6L9 17l-5-5"
              stroke="white"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </motion.div>

        <div className="mt-6">
          <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2">
            Thank you — you're all set!
          </h1>
          <p className="text-slate-300 max-w-xl">
            We've received your submission. A confirmation email is on the way.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="mt-6 flex flex-wrap gap-3">
          <button
            onClick={() => (window.location.href = "/")}
            className="px-4 py-2 rounded-lg font-semibold bg-gradient-to-r from-purple-600 to-cyan-400 text-white shadow-lg"
          >
            Back to Home
          </button>

          <button
            onClick={() => alert("We will contact you within 2 business days.")}
            className="px-4 py-2 rounded-lg font-semibold bg-white/10 border border-white/10 backdrop-blur-md"
          >
            What Happens Next?
          </button>

          <button
            onClick={() => {
              const data = `Reference: #A1B2C3\nSubmitted: ${document.getElementById("ts").textContent}`;
              const blob = new Blob([data], { type: "text/plain;charset=utf-8" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = "receipt.txt";
              a.click();
              URL.revokeObjectURL(url);
            }}
            className="px-4 py-2 rounded-lg font-semibold bg-white/10 border border-white/10 backdrop-blur-md"
          >
            Download Receipt
          </button>
        </div>

        <div className="text-sm text-slate-400 mt-4">
          Reference: <strong>#A1B2C3</strong> • Submitted on <span id="ts">--</span>
        </div>

        {/* Side Summary */}
        <div className="mt-8 bg-white/5 p-4 rounded-xl border border-white/10">
          <div className="text-sm text-slate-300">Submission Summary</div>
          <div className="text-lg font-bold text-white">Form: Contact • Priority: Normal</div>
          <div className="text-sm mt-2 text-slate-400">Support: support@example.com</div>
          <div className="text-xs text-slate-500 mt-1">
            To make changes, reply to the confirmation email.
          </div>
        </div>
      </div>
    </div>
  );
}
