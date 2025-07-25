import React from "react";

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6 text-amber-800">About Us</h1>
      <p className="mb-4"><b>Soni Jewellers and Navratna Bhandar</b> is a trusted name in jewellery, serving customers with quality and integrity from our store in Latehar, Jharkhand.</p>
      <address className="mb-4 not-italic">
        Opp. V-Mart, Main Road, Latehar, Jharkhand, 829206, India<br/>
        Phone: 9334997066, 9263879884<br/>
        Email: <a href="mailto:sonijewellers070@gmail.com" className="text-amber-700 underline">sonijewellers070@gmail.com</a>
      </address>
      <p>We specialize in gold, silver, and precious stone jewellery, offering a wide range of designs to suit every occasion. Our commitment is to provide genuine products and excellent customer service.</p>
      <p className="text-sm text-gray-500 mt-8">Business Registered Name: Soni Jewellers and Navratna Bhandar</p>
      <p className="text-sm text-gray-500">Last updated: {new Date().toLocaleDateString()}</p>
    </div>
  );
} 