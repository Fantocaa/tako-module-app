import AppLayout from "@/layouts/app-layout";
import { Head, useForm } from "@inertiajs/react";
import React from "react";

const DIMENSIONS = Array.from({ length: 26 }).map((_, i) =>
  String.fromCharCode(65 + i)
); // A..Z

export default function Edit({ question }: { question: any }) {
  const optionA = question.options?.[0] ?? { content: "", dimension_code: "" };
  const optionB = question.options?.[1] ?? { content: "", dimension_code: "" };

 const form = useForm({
  option_a: optionA.content || "",
  dimension_a: optionA.dimension_code || "",
  option_b: optionB.content || "",
  dimension_b: optionB.dimension_code || "",
});

const data = form.data as any;
const setData = form.setData as any;
const put = form.put;
const processing = form.processing;
const errors = form.errors as Record<string, string>;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    put(`/psychotest/papi/${question.id}`);
  };

  return (
    <AppLayout>
      <Head title="Edit PAPI Question" />
      <div className="p-6 max-w-3xl">
        <h1 className="mb-6 text-2xl font-bold">Edit Soal PAPI</h1>

        <form onSubmit={submit} className="space-y-6">
          <div>
            <label className="mb-2 block font-semibold">Statement A</label>
            <textarea
              value={data.option_a}
              onChange={(e) => setData("option_a", e.target.value)}
              className="w-full rounded border p-2"
              rows={3}
            />
            {errors['option_a'] && <div className="mt-1 text-sm text-red-600">{errors['option_a']}</div>}
          </div>

          <div>
            <label className="mb-2 block font-semibold">Dimensi A</label>
            <select
              value={data.dimension_a}
              onChange={(e) => setData("dimension_a", e.target.value)}
              className="w-56 rounded border p-2"
            >
              <option value="">-- pilih dimensi --</option>
              {DIMENSIONS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
            {errors.dimension_a && <div className="mt-1 text-sm text-red-600">{errors.dimension_a}</div>}
          </div>

          <div>
            <label className="mb-2 block font-semibold">Statement B</label>
            <textarea
              value={data.option_b}
              onChange={(e) => setData("option_b", e.target.value)}
              className="w-full rounded border p-2"
              rows={3}
            />
            {errors['option_b'] && <div className="mt-1 text-sm text-red-600">{errors['option_b']}</div>}
          </div>

          <div>
            <label className="mb-2 block font-semibold">Dimensi B</label>
            <select
              value={data.dimension_b}
              onChange={(e) => setData("dimension_b", e.target.value)}
              className="w-56 rounded border p-2"
            >
              <option value="">-- pilih dimensi --</option>
              {DIMENSIONS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
            {errors.dimension_b && <div className="mt-1 text-sm text-red-600">{errors.dimension_b}</div>}
          </div>

          <div className="flex gap-3">
            <button type="submit" disabled={processing} className="rounded bg-yellow-500 px-4 py-2 font-semibold text-white">
              {processing ? "UPDATING..." : "Update"}
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