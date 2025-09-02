"use client";

import { useState } from "react";

type Customer = {
  _id: string;
  phoneNumber: string;
  name: string;
  status: string;
};

export default function CustomerCard({ customer, onUpdate }: { customer: Customer; onUpdate?: (c: Customer) => void }) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(customer.name);

  const handleSave = () => {
    onUpdate?.({ ...customer, name });
    setEditing(false);
  };

  return (
    <div className="border rounded p-3 flex justify-between items-center">
      <div>
        <p className="font-semibold">{customer.phoneNumber}</p>
        {editing ? (
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border px-2 py-1 text-sm"
          />
        ) : (
          <p className="text-sm text-gray-600">{customer.name}</p>
        )}
        <p className="text-xs text-gray-500">{customer.status}</p>
      </div>

      {editing ? (
        <button onClick={handleSave} className="text-green-600 text-sm">Save</button>
      ) : (
        <button onClick={() => setEditing(true)} className="text-blue-600 text-sm">Edit</button>
      )}
    </div>
  );
}
