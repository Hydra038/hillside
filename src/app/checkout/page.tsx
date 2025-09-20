"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-provider";
import { useCartStore } from "@/lib/stores/cart-store";

export default function CheckoutPage() {
	const router = useRouter();
	const { user } = useAuth();
	const { items, total, clearCart } = useCartStore();
	const [isLoading, setIsLoading] = useState(false);
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		address: {
			street: "",
			city: "",
			postcode: "",
			country: "United Kingdom",
		},
		paymentPlan: "full",
	});

	// Autofill user name and email when user is loaded
	useEffect(() => {
		if (user) {
			setFormData(prev => ({
				...prev,
				name: user.name || "",
				email: user.email || ""
			}));
		}
	}, [user]);
	type PaymentMethod = { 
		id: string; 
		display_name?: string; 
		type?: string; 
		config?: any;
		enabled?: number;
		description?: string;
	};
	const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
	const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
	const [error, setError] = useState("");

	useEffect(() => {
		// Fetch payment methods from public API
		async function fetchPaymentMethods() {
			try {
				const res = await fetch("/api/payment-methods");
				if (res.ok) {
					const data = await res.json();
					setPaymentMethods(Array.isArray(data) ? data : []);
				} else {
					console.error('Failed to fetch payment methods:', res.status);
					setPaymentMethods([]);
				}
			} catch (err) {
				console.error('Error fetching payment methods:', err);
				setPaymentMethods([]);
			}
		}
		fetchPaymentMethods();
	}, []);

	function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
			const { name, value } = e.target;
			if (name.startsWith("address.")) {
				setFormData((prev) => ({
					...prev,
					address: {
						...prev.address,
						[name.split(".")[1]]: value,
					},
				}));
			} else {
				setFormData((prev) => ({ ...prev, [name]: value }));
			}
		}

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		setError("");
		if (!selectedPaymentMethod) {
			setError("Please select a payment method.");
			return;
		}
		setIsLoading(true);
		// Build order payload for API
		const orderPayload = {
			items: items.map(item => ({
				id: item.id,
				quantity: item.quantity,
				price: item.price
			})),
			total,
			shippingAddress: formData.address,
			paymentMethod: selectedPaymentMethod,
		};
		try {
			// Call real API to create order (status will be 'pending')
			const res = await fetch("/api/orders", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(orderPayload),
				credentials: "include"
			});
			if (!res.ok) {
				const data = await res.json().catch(() => ({}));
				setError(data.error || "Failed to place order");
				setIsLoading(false);
				return;
			}
			// Simulate loading for a few seconds before thank you
			setTimeout(() => {
				setIsLoading(false);
				clearCart();
				router.push("/thank-you");
			}, 2000);
		} catch (err) {
			setError("Failed to place order. Please try again.");
			setIsLoading(false);
		}
	}

	if (!items || items.length === 0) {
		return (
			<div className="container mx-auto px-4 py-8">
				<div className="text-center">
					<h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
					<button
						onClick={() => router.push("/shop")}
						className="text-amber-600 hover:text-amber-500"
					>
						Continue Shopping
					</button>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-[60vh] bg-gradient-to-br from-amber-50 to-amber-200 flex items-center justify-center">
			<div className="w-full max-w-4xl mx-auto py-12 px-4">
				<h1 className="text-4xl font-extrabold text-amber-700 mb-8 text-center drop-shadow-lg">Checkout</h1>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-10">
					<form onSubmit={handleSubmit} className="space-y-8 bg-white p-10 rounded-2xl shadow-2xl border border-amber-100">
						<div className="grid grid-cols-1 gap-6">
							<div>
								<label className="block text-base font-semibold text-amber-700 mb-2">Full Name</label>
								<input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full border border-amber-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-amber-50 text-lg" required />
							</div>
							<div>
								<label className="block text-base font-semibold text-amber-700 mb-2">Email</label>
								<input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full border border-amber-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-amber-50 text-lg" required />
							</div>
							<div>
								<label className="block text-base font-semibold text-amber-700 mb-2">Street Address</label>
								<input type="text" name="address.street" value={formData.address.street} onChange={handleChange} className="w-full border border-amber-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-amber-50 text-lg" required />
							</div>
							<div>
								<label className="block text-base font-semibold text-amber-700 mb-2">City</label>
								<input type="text" name="address.city" value={formData.address.city} onChange={handleChange} className="w-full border border-amber-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-amber-50 text-lg" required />
							</div>
							<div>
								<label className="block text-base font-semibold text-amber-700 mb-2">Postal Code</label>
								<input type="text" name="address.postcode" value={formData.address.postcode} onChange={handleChange} className="w-full border border-amber-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-amber-50 text-lg" required />
							</div>
											<div>
												<label className="block text-base font-semibold text-amber-700 mb-2">Country</label>
												<input type="text" name="address.country" value={formData.address.country} readOnly className="w-full border border-amber-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-amber-50 text-lg" required />
											</div>
																			<div>
																				<label className="block text-base font-semibold text-amber-700 mb-2">Payment Plan</label>
																				<div className="flex gap-4">
																										<label className="flex items-center gap-2">
																											<input
																												type="radio"
																												name="paymentPlan"
																												value="full"
																												checked={formData.paymentPlan === "full"}
																												onChange={handleChange}
																											/>
																											<span>Full Payment</span>
																											<span className="ml-2 text-amber-700 font-bold">£{typeof total === "number" ? total.toFixed(2) : "0.00"}</span>
																										</label>
																										<label className="flex items-center gap-2">
																											<input
																												type="radio"
																												name="paymentPlan"
																												value="half"
																												checked={formData.paymentPlan === "half"}
																												onChange={handleChange}
																											/>
																											<span>Half Payment</span>
																											<span className="ml-2 text-amber-700 font-bold">£{typeof total === "number" ? (total / 2).toFixed(2) : "0.00"}</span>
																										</label>
																				</div>
																			</div>
						</div>
						<div>
							<label className="block text-base font-semibold text-amber-700 mb-2">Payment Method</label>
							<div className="flex flex-wrap gap-4">
								{paymentMethods.length === 0 ? (
									<span className="text-gray-400 italic">No payment methods available</span>
								) : (
									paymentMethods.map((method) => (
										<button
											type="button"
											key={method.id}
											className={`px-8 py-4 rounded-xl border-2 transition-colors duration-200 font-semibold shadow-md text-lg ${selectedPaymentMethod === method.id ? "border-amber-600 bg-amber-100" : "border-amber-300 bg-white hover:border-amber-400"}`}
											onClick={() => setSelectedPaymentMethod(method.id)}
										>
											{method.display_name || method.type}
										</button>
									))
								)}
							</div>

							{/* Show payment method details if selected */}
							{selectedPaymentMethod && (
								(() => {
									const method = paymentMethods.find(m => m.id == selectedPaymentMethod);
									if (!method) return null;
									let details = null;
									try {
										// Try to parse config if present
										const config = typeof method.config === 'string' ? JSON.parse(method.config) : method.config;
										if (method.type === 'bank_transfer' && config) {
											details = (
												<div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-xl">
													<div className="font-semibold text-amber-700 mb-2">Bank Transfer Details</div>
													{config.accountName && <div><span className="font-medium">Account Name:</span> {config.accountName}</div>}
													{config.accountNumber && <div><span className="font-medium">Account Number:</span> {config.accountNumber}</div>}
													{config.sortCode && <div><span className="font-medium">Sort Code:</span> {config.sortCode}</div>}
													{config.reference && <div><span className="font-medium">Reference:</span> {config.reference}</div>}
													{config.instructions && <div className="mt-2 text-sm text-gray-700">{config.instructions}</div>}
												</div>
											);
										} else if (method.type === 'paypal' && config) {
											details = (
												<div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-xl">
													<div className="font-semibold text-amber-700 mb-2">PayPal Details</div>
													{config.email && <div><span className="font-medium">PayPal Email:</span> {config.email}</div>}
													{config.instructions && <div className="mt-2 text-sm text-gray-700">{config.instructions}</div>}
												</div>
											);
										} else if (method.type === 'credit_card' || method.type === 'stripe') {
											details = (
												<div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-xl">
													<div className="font-semibold text-amber-700 mb-2">Online Payment</div>
													<div className="text-sm text-gray-700">You will be redirected to a secure payment page after placing your order.</div>
												</div>
											);
										}
									} catch (e) {
										// ignore JSON parse errors
									}
									return details;
								})()
							)}
						</div>
						{error && <div className="text-red-600 font-semibold text-center mt-4">{error}</div>}
						<button type="submit" className="w-full bg-gradient-to-r from-amber-500 to-amber-700 text-white py-5 px-8 rounded-2xl font-bold text-xl shadow-xl hover:from-amber-600 hover:to-amber-800 transition-colors disabled:bg-amber-400 mt-6" disabled={isLoading}>
							{isLoading ? "Processing..." : "Place Order"}
						</button>
					</form>
					  <div className="bg-white p-6 rounded-2xl shadow-2xl border border-amber-100 max-h-80 overflow-auto">
						<h2 className="text-2xl font-bold text-amber-700 mb-6">Order Summary</h2>
						<div className="space-y-4">
							{items.map((item) => (
								<div key={item.id} className="flex justify-between items-center">
									<div>
										<p className="font-medium text-lg">{item.name}</p>
										<p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
									</div>
									<p className="font-semibold text-lg">£{((typeof item.price === "number" ? item.price : 0) * (typeof item.quantity === "number" ? item.quantity : 0)).toFixed(2)}</p>
								</div>
							))}
							<div className="border-t pt-4">
								<div className="flex justify-between font-bold text-xl">
									<p>Total</p>
									<p>£{typeof total === "number" ? total.toFixed(2) : "0.00"}</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
