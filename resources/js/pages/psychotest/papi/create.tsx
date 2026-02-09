import React from "react";
import AppLayout from "@/layouts/app-layout";
import { Head, useForm } from "@inertiajs/react";

const DIMENSIONS = Array.from({ length: 26 }).map((_, i) =>
  String.fromCharCode(65 + i)
); // A..Z

export default function Create() {
  const form = useForm({
    option_a: "",
    dimension_a: "",
    option_b: "",
    dimension_b: "",
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    form.post("/psychotest/papi");
  };

  return (
    <AppLayout>
      <Head title="Tambah Soal PAPI" />

      <div className="p-6 max-w-xl">
        <h1 className="text-2xl font-bold mb-6">Tambah Soal PAPI</h1>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block mb-1">Statement A</label>
            <textarea
              className="w-full border p-2 rounded"
              value={form.data.option_a}
              onChange={(e) => form.setData("option_a", e.target.value)}
            />
            {form.errors.option_a && (
              <div className="text-red-500 text-sm">
                {form.errors.option_a}
              </div>
            )}
          </div>

          <div>
            <label className="block mb-1">Dimensi A</label>
            <select
              className="w-full border p-2 rounded"
              value={form.data.dimension_a}
              onChange={(e) => form.setData("dimension_a", e.target.value)}
            >
              <option value="">-- pilih dimensi --</option>
              {DIMENSIONS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
            {form.errors.dimension_a && (
              <div className="text-red-500 text-sm">
                {form.errors.dimension_a}
              </div>
            )}
          </div>

          <div>
            <label className="block mb-1">Statement B</label>
            <textarea
              className="w-full border p-2 rounded"
              value={form.data.option_b}
              onChange={(e) => form.setData("option_b", e.target.value)}
            />
            {form.errors.option_b && (
              <div className="text-red-500 text-sm">
                {form.errors.option_b}
              </div>
            )}
          </div>

          <div>
            <label className="block mb-1">Dimensi B</label>
            <select
              className="w-full border p-2 rounded"
              value={form.data.dimension_b}
              onChange={(e) => form.setData("dimension_b", e.target.value)}
            >
              <option value="">-- pilih dimensi --</option>
              {DIMENSIONS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
            {form.errors.dimension_b && (
              <div className="text-red-500 text-sm">
                {form.errors.dimension_b}
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={form.processing}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              {form.processing ? "SAVING..." : "Simpan"}
            </button>

            <a href="/psychotest/papi" className="rounded border px-4 py-2">
              Batal
            </a>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
