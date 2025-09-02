"use client";

export default function Header() {
  return (
    <header className="w-full h-16 bg-white border-b flex items-center justify-between px-6">
      <h2 className="text-xl font-semibold text-gray-800">Dashboard</h2>
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-600">Welcome, Admin</span>
        <button className="rounded bg-gray-800 text-white px-3 py-1 hover:bg-gray-700">
          Logout
        </button>
      </div>
    </header>
  );
}
