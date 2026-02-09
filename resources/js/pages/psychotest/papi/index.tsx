import AppLayout from "@/layouts/app-layout";
import { Head, Link, router } from "@inertiajs/react";

interface Option {
  id: number;
  content: string;
  dimension_code: string;
}

interface Question {
  id: number;
  options: Option[];
}

interface Props {
  questions: Question[];
}

export default function Index({ questions }: Props) {
  const handleDelete = (id: number) => {
    if (confirm("Yakin ingin menghapus soal ini?")) {
      router.delete(`/admin/papi/${id}`);
    }
  };

  return (
    <AppLayout>
      <Head title="PAPI Question Management" />

      <div className="p-6">
        <div className="flex justify-between mb-6">
          <h1 className="text-2xl font-bold">PAPI Question Management</h1>

          <Link
            href="/admin/papi/create"
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Tambah Soal
          </Link>
        </div>

        <table className="w-full border">
          <thead>
            <tr>
              <th>No</th>
              <th>Statement A</th>
              <th>Dim A</th>
              <th>Statement B</th>
              <th>Dim B</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {questions.map((question, index) => {
              const a = question.options?.[0];
              const b = question.options?.[1];

              return (
                <tr key={question.id}>
                  <td>{index + 1}</td>
                  <td>{a?.content}</td>
                  <td>{a?.dimension_code}</td>
                  <td>{b?.content}</td>
                  <td>{b?.dimension_code}</td>
                  <td className="space-x-2">
                    <Link
                      href={`/admin/papi/${question.id}/edit`}
                      className="text-blue-600 underline"
                    >
                      Edit
                    </Link>

                    <button
                      onClick={() => handleDelete(question.id)}
                      className="text-red-600 underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </AppLayout>
  );
}
