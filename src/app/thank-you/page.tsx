"use client";

import Link from "next/link";

export default function ThankYouPage() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center bg-gradient-to-br from-amber-50 to-amber-200">
      <div className="bg-white p-10 rounded-2xl shadow-2xl border border-amber-100 max-w-lg w-full text-center">
        <h1 className="text-4xl font-extrabold text-amber-700 mb-6 drop-shadow-lg">Thank You!</h1>
        <p className="text-lg text-gray-700 mb-6">Your order has been received and is being processed.<br />We appreciate your business.</p>
        <Link href="/shop" className="inline-block bg-amber-600 text-white font-bold py-3 px-8 rounded-xl shadow hover:bg-amber-700 transition-colors">Continue Shopping</Link>
      </div>
    </div>
  );
}
