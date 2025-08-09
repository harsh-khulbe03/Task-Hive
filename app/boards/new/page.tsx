"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../../_components/Navbar";
import ProtectedRoute from "../../_components/ProtectedRoute";

export default function NewBoardPage() {
  const [boardName, setBoardName] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!boardName.trim()) {
      setError("Board name is required");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await fetch("/api/boards", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: boardName }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to create board");
      }

      const newBoard = await response.json();
      router.push(`/boards/${newBoard.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create board");
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="bg-white p-6 rounded-lg shadow-sm max-w-md mx-auto">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">
              Create New Board
            </h1>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label
                  htmlFor="boardName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Board Name
                </label>
                <input
                  type="text"
                  id="boardName"
                  value={boardName}
                  onChange={(e) => setBoardName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Work, Personal, Groceries"
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => router.push("/")}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Create Board
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
