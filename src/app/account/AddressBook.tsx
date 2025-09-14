"use client";

import { useState, useEffect } from "react";

export type Address = {
  id: string;
  street: string;
  city: string;
  postcode: string;
  country: string;
};

export default function AddressBook() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [form, setForm] = useState<Partial<Address>>({});
  const [editingId, setEditingId] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const res = await fetch("/api/account/addresses");
      if (res.ok) {
        const data = await res.json();
        setAddresses(data.addresses || []);
      }
    } catch (err) {
      setMessage("Failed to load addresses.");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    try {
      const method = editingId ? "PUT" : "POST";
      const url = editingId ? `/api/account/addresses/${editingId}` : "/api/account/addresses";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      setMessage(editingId ? "Address updated!" : "Address added!");
      setForm({});
      setEditingId(null);
      fetchAddresses();
    } catch {
      setMessage("Failed to save address.");
    }
  };

  const handleEdit = (address: Address) => {
    setForm(address);
    setEditingId(address.id);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this address?")) return;
    try {
      const res = await fetch(`/api/account/addresses/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setMessage("Address deleted!");
      fetchAddresses();
    } catch {
      setMessage("Failed to delete address.");
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow mt-8">
      <h2 className="text-xl font-semibold mb-4">Address Book</h2>
      {message && <div className="mb-4 text-sm text-center text-amber-700">{message}</div>}
      <form onSubmit={handleSubmit} className="space-y-2 mb-6">
        <div className="grid grid-cols-2 gap-4">
          <input name="street" placeholder="Street" value={form.street || ""} onChange={handleChange} required className="px-3 py-2 border rounded" />
          <input name="city" placeholder="City" value={form.city || ""} onChange={handleChange} required className="px-3 py-2 border rounded" />
          <input name="postcode" placeholder="Postcode" value={form.postcode || ""} onChange={handleChange} required className="px-3 py-2 border rounded" />
          <input name="country" placeholder="Country" value={form.country || ""} onChange={handleChange} required className="px-3 py-2 border rounded" />
        </div>
        <div className="flex justify-end">
          <button type="submit" className="px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700">
            {editingId ? "Update Address" : "Add Address"}
          </button>
        </div>
      </form>
      <div className="space-y-2">
        {addresses.length === 0 && <div className="text-gray-500">No addresses saved.</div>}
        {addresses.map(addr => (
          <div key={addr.id} className="border rounded p-3 flex justify-between items-center">
            <div>
              <div>{addr.street}, {addr.city}</div>
              <div>{addr.postcode}, {addr.country}</div>
            </div>
            <div className="space-x-2">
              <button onClick={() => handleEdit(addr)} className="text-blue-600 hover:underline">Edit</button>
              <button onClick={() => handleDelete(addr.id)} className="text-red-600 hover:underline">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
