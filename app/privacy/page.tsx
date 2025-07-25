import React from "react";

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6 text-amber-800">Privacy Policy</h1>
      <p className="mb-4">This Privacy Policy describes how <b>Soni Jewellers and Navratna Bhandar</b> ("we", "us", or "our") collects, uses, and protects your personal information when you use our website and services.</p>
      <ul className="list-disc pl-5 mb-4">
        <li>We collect only the information necessary to process your orders, payments, and provide customer support.</li>
        <li>We do not share your personal data with third parties except as required by law or for payment processing.</li>
        <li>All payment transactions are encrypted and processed securely in compliance with Indian regulations.</li>
        <li>We do not store your card or payment details on our servers.</li>
        <li>You may request to review, update, or delete your data by contacting us at <a href="mailto:sonijewellers070@gmail.com" className="text-amber-700 underline">sonijewellers070@gmail.com</a>.</li>
      </ul>
      <p className="mb-2">For any questions regarding this policy, contact us at <a href="mailto:sonijewellers070@gmail.com" className="text-amber-700 underline">sonijewellers070@gmail.com</a> or call 9334997066, 9263879884.</p>
      <p className="text-sm text-gray-500 mt-8">Last updated: {new Date().toLocaleDateString()}</p>
    </div>
  );
} 