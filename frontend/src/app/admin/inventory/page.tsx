"use client";

import React, { useState, useEffect } from "react";
import { Boxes, Search, Check, AlertTriangle } from "lucide-react";
import { api } from "@/lib/api";

interface InventoryItem {
  variant_id: number;
  product_id: number;
  product_name: string;
  sku: string;
  color: string;
  size: string;
  stock_quantity: number;
  status: string;
}

export default function AdminInventoryPage() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [tempStock, setTempStock] = useState<number>(0);

  const loadInventory = async () => {
    setIsLoading(true);
    try {
      const data = await api.admin.getInventory();
      setItems(data);
    } catch (err) {
      console.error("Failed to load inventory:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadInventory();
  }, []);

  const handleUpdateStock = async (variantId: number) => {
    try {
      await api.admin.updateStock(variantId, tempStock);
      setItems((prev) =>
        prev.map((it) =>
          it.variant_id === variantId
            ? {
                ...it,
                stock_quantity: tempStock,
                status: tempStock > 5 ? "In Stock" : tempStock > 0 ? "Low Stock" : "Out of Stock",
              }
            : it
        )
      );
      setEditingId(null);
    } catch (err: any) {
      alert(err.message || "Failed to update stock");
    }
  };

  const filtered = items.filter((it) => {
    const matchesSearch =
      it.product_name.toLowerCase().includes(search.toLowerCase()) ||
      it.sku.toLowerCase().includes(search.toLowerCase()) ||
      it.color.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus === "All" || it.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <span className="text-xs uppercase tracking-widest font-bold text-brand-600 font-mono">
          Stock Control
        </span>
        <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-stone-900 mt-0.5">
          Inventory Management ({items.length} Variants)
        </h1>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex items-center gap-3 w-full sm:w-96">
          <Search className="w-4 h-4 text-stone-400" />
          <input
            type="text"
            placeholder="Search variant by dress name, SKU, or color..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 text-xs text-stone-800 focus:outline-none"
          />
        </div>

        <div className="flex gap-1.5">
          {["All", "In Stock", "Low Stock", "Out of Stock"].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold ${
                filterStatus === st ? "bg-brand-600 text-white" : "bg-stone-50 text-stone-600 hover:bg-stone-100"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-xs text-stone-400">Loading inventory data...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="text-stone-400 uppercase tracking-wider font-semibold border-b border-stone-100">
                  <th className="pb-3 font-semibold">Dress & Variant</th>
                  <th className="pb-3 font-semibold">SKU</th>
                  <th className="pb-3 font-semibold">Color</th>
                  <th className="pb-3 font-semibold">Size</th>
                  <th className="pb-3 font-semibold">Units In Stock</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 font-semibold text-right">Quick Update</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filtered.map((item) => (
                  <tr key={item.variant_id} className="hover:bg-stone-50 transition-colors">
                    <td className="py-3.5 font-bold text-stone-900">{item.product_name}</td>
                    <td className="py-3.5 font-mono text-stone-500">{item.sku}</td>
                    <td className="py-3.5 font-medium text-stone-700">{item.color}</td>
                    <td className="py-3.5 font-bold font-mono text-stone-900">{item.size}</td>
                    <td className="py-3.5">
                      {editingId === item.variant_id ? (
                        <div className="flex items-center gap-1.5">
                          <input
                            type="number"
                            value={tempStock}
                            onChange={(e) => setTempStock(Math.max(0, Number(e.target.value)))}
                            className="w-16 px-2 py-1 bg-stone-50 border border-stone-300 rounded text-xs font-mono font-bold"
                          />
                          <button
                            onClick={() => handleUpdateStock(item.variant_id)}
                            className="p-1 bg-emerald-600 text-white rounded hover:bg-emerald-700"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <span className="font-bold font-mono text-stone-900 text-sm">
                          {item.stock_quantity}
                        </span>
                      )}
                    </td>
                    <td className="py-3.5">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        item.status === "In Stock"
                          ? "bg-emerald-100 text-emerald-800"
                          : item.status === "Low Stock"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-rose-100 text-rose-800"
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="py-3.5 text-right">
                      {editingId !== item.variant_id && (
                        <button
                          onClick={() => {
                            setEditingId(item.variant_id);
                            setTempStock(item.stock_quantity);
                          }}
                          className="text-xs font-semibold text-brand-600 hover:text-brand-700 underline"
                        >
                          Adjust
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
