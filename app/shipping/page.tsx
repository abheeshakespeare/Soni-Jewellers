import React from "react";

export default function ShippingPolicyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6 text-amber-800">Shipping Policy</h1>
      <p className="mb-4">At <b>Soni Jewellers and Navratna Bhandar</b>, we do not offer shipping or home delivery services. All orders must be picked up in person at our store location:</p>
      <address className="mb-4 not-italic">
        Opp. V-Mart, Main Road, Latehar, Jharkhand, 829206, India<br/>
        Phone: 9334997066, 9263879884
      </address>
      <p className="mb-2">For any questions, contact us at <a href="mailto:sonijewellers070@gmail.com" className="text-amber-700 underline">sonijewellers070@gmail.com</a>.</p>
      <p className="text-sm text-gray-500 mt-8">Last updated: {new Date().toLocaleDateString()}</p>
    </div>
  );
} 