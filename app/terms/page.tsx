import React from "react";

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6 text-amber-800">Terms & Conditions</h1>
      <p className="mb-4">By placing an order with <b>Soni Jewellers and Navratna Bhandar</b> ("we", "us", or "our"), you agree to the following terms:</p>
      <ul className="list-disc pl-5 mb-4">
        <li>All orders require full or advance payment at the time of purchase.</li>
        <li>Store pickup is the only delivery method. No shipping facility is provided.</li>
        <li>Once an order is placed and payment is made, <b>no cancellation or refund</b> is allowed under any circumstances.</li>
        <li>Product details and prices are listed in INR and are subject to change without notice.</li>
        <li>We reserve the right to refuse or cancel orders at our discretion.</li>
        <li>All disputes are subject to Latehar, Jharkhand jurisdiction.</li>
      </ul>
      <p className="mb-2">For questions, contact us at <a href="mailto:sonijewellers070@gmail.com" className="text-amber-700 underline">sonijewellers070@gmail.com</a> or call 9334997066, 9263879884.</p>
      <p className="text-sm text-gray-500 mt-8">Last updated: {new Date().toLocaleDateString()}</p>
    </div>
  );
} 