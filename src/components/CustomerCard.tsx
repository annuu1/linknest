"use client";

import { useState } from "react";

type Customer = {
  _id: string;
  phoneNumber: string;
  name: string;
  status: string;
  flag?: "none" | "optout" | "working" | "hopeful";
};

export default function CustomerCard({
  customer,
  onUpdate,
}: {
  customer: Customer;
  onUpdate?: (c: Customer) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(customer.name);
  const [flag, setFlag] = useState(customer.flag || "none");
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/customers/${customer._id}/flag`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, flag }),
      });
      const updated = await res.json();
      onUpdate?.(updated);
      setEditing(false);
    } catch (err) {
      console.error("Failed to save customer", err);
    } finally {
      setLoading(false);
    }
  };

  const handleFlagChange = async (newFlag: Customer["flag"]) => {
    try {
      setLoading(true);
      setFlag(newFlag || "none");
      const res = await fetch(`/api/customers/${customer._id}/flag`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ flag: newFlag }),
      });
      const updated = await res.json();
      onUpdate?.(updated);
    } catch (err) {
      console.error("Failed to update flag", err);
      setFlag(customer.flag || "none"); // rollback if failed
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border rounded p-3 flex justify-between items-start">
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

        {/* Flags */}
        <div className="flex gap-2 mt-2">
          <button
            disabled={loading}
            onClick={() => handleFlagChange("optout")}
            className={`px-2 py-1 text-xs rounded ${
              flag === "optout" ? "bg-red-500 text-white" : "border"
            }`}
          >
            Opt-out
          </button>
          <button
            disabled={loading}
            onClick={() => handleFlagChange("working")}
            className={`px-2 py-1 text-xs rounded ${
              flag === "working" ? "bg-green-500 text-white" : "border"
            }`}
          >
            Working
          </button>
          <button
            disabled={loading}
            onClick={() => handleFlagChange("hopeful")}
            className={`px-2 py-1 text-xs rounded ${
              flag === "hopeful" ? "bg-yellow-500 text-white" : "border"
            }`}
          >
            Hopeful
          </button>
        </div>
      </div>

      {editing ? (
        <button
          disabled={loading}
          onClick={handleSave}
          className="text-green-600 text-sm"
        >
          Save
        </button>
      ) : (
        <button
          disabled={loading}
          onClick={() => setEditing(true)}
          className="text-blue-600 text-sm"
        >
          Edit
        </button>
      )}
    </div>
  );
}
