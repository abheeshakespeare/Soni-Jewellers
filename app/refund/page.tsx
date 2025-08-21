import React from "react";

export default function RefundPolicyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6 text-amber-800">Refund Policy</h1>
      <p className="mb-4">At <b>Soni Jewellers and Navratna Bhandar</b>, <b>no refund or cancellation</b> is allowed once payment is made and the order is confirmed. Please review your order carefully before making payment.</p>
      <p className="mb-2">If you have any questions, contact us at <a href="mailto:sonijewellers070@gmail.com" className="text-amber-700 underline">sonijewellers070@gmail.com</a> or call 9334997066, 9263879884.</p>
      <p className="text-sm text-gray-500 mt-8">Last updated: {new Date().toLocaleDateString()}</p>
    </div>
  );
} 