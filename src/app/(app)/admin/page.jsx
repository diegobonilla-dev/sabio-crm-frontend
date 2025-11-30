"use client";

export default function AdminPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
      <p className="text-gray-600">
        This is a protected page. You can only see this if you&apos;re authenticated.
      </p>
    </div>
  );
}
