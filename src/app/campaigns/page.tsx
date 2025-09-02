"use client";

import { useEffect, useState } from "react";
import CustomerCard from "@/components/CustomerCard";

type Campaign = { _id: string; name: string; content: string; team?: string };
type Customer = { _id: string; phoneNumber: string; name: string; status: string };

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [selected, setSelected] = useState<Campaign | null>(null);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/campaigns")
      .then((res) => res.json())
      .then(setCampaigns);
  }, []);

  useEffect(() => {
    if (!selected) return;
    fetch(`/api/campaigns/${selected.team}/customers?page=${page}&limit=10&phone=${search}`)
      .then((res) => res.json())
      .then((data) => {
        setCustomers(data.data);
        setTotalPages(data.totalPages);
      });
  }, [selected, selected?.team, page, search]);

  return (
    <div className="flex h-full">
      {/* Campaign List */}
      <aside className="w-64 bg-white border-r p-4">
        <h2 className="font-semibold mb-4">Campaigns</h2>
        <ul className="space-y-2">
          {campaigns.map((c) => (
            <li
              key={c._id}
              onClick={() => {
                setSelected(c);
                setPage(1);
              }}
              className={`cursor-pointer px-2 py-1 rounded ${
                selected?._id === c._id ? "bg-gray-200" : "hover:bg-gray-100"
              }`}
            >
              {c.name}
            </li>
          ))}
        </ul>
      </aside>

      {/* Campaign Details */}
      <main className="flex-1 p-6">
        {selected ? (
          <div>
            <h2 className="text-xl font-semibold">{selected.name}</h2>
            <p className="text-gray-600 mb-4">{selected.content}</p>

            {/* Search */}
            <input
              type="text"
              placeholder="Search by phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border px-3 py-2 rounded w-full mb-4"
            />

            {/* Customers */}
            <div className="grid gap-3">
              {customers.map((cust) => (
                <CustomerCard
                  key={cust._id}
                  customer={cust}
                  onUpdate={(updated) => {
                    setCustomers((prev) =>
                      prev.map((c) => (c._id === updated._id ? updated : c))
                    );
                  }}
                />
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-between items-center mt-4">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Prev
              </button>
              <span>
                Page {page} of {totalPages}
              </span>
              <button
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        ) : (
          <p className="text-gray-600">Select a campaign to view details.</p>
        )}
      </main>
    </div>
  );
}
