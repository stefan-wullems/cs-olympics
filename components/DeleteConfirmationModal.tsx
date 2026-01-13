"use client";

import { X } from "lucide-react";

interface Deal {
  id: number;
  csm: string;
  customer: string;
  type: string;
  medal: string;
  date: string;
}

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  deal: Deal | null;
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting: boolean;
}

export function DeleteConfirmationModal({
  isOpen,
  deal,
  onConfirm,
  onCancel,
  isDeleting,
}: DeleteConfirmationModalProps) {
  if (!isOpen || !deal) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 max-w-md w-full border border-red-500/30 shadow-2xl shadow-red-500/20">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-2xl font-bold text-red-400">Confirm Delete</h3>
          <button
            onClick={onCancel}
            disabled={isDeleting}
            className="text-gray-400 hover:text-white transition-all disabled:opacity-50"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="mb-6">
          <p className="text-gray-300 mb-4">
            Are you sure you want to delete this deal?
          </p>
          <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <span className="text-gray-400">CSM:</span>
              <span className="text-white font-semibold">{deal.csm}</span>
              <span className="text-gray-400">Customer:</span>
              <span className="text-white">{deal.customer}</span>
              <span className="text-gray-400">Type:</span>
              <span className="text-white">{deal.type}</span>
              <span className="text-gray-400">Medal:</span>
              <span className="text-white">{deal.medal}</span>
              <span className="text-gray-400">Date:</span>
              <span className="text-white">{deal.date}</span>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex-1 bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 px-6 py-3 rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
          <button
            onClick={onCancel}
            disabled={isDeleting}
            className="px-6 py-3 bg-gray-700 hover:bg-gray-600 border border-gray-600 rounded-xl font-semibold transition-all disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
