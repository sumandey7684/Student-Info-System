import { Sidebar } from '@/components/layout/sidebar';

const students = [
  { regNo: 'SIS-2026-001', name: 'Alice Johnson', grade: '10', attendance: '94.2%' },
  { regNo: 'SIS-2026-002', name: 'Bob Singh', grade: '9', attendance: '89.7%' },
];

export default function StudentsPage() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-6">
        <h1 className="mb-6 text-2xl font-bold">Student Management</h1>
        <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-100 dark:bg-slate-900">
              <tr>
                <th className="p-3">Reg No</th>
                <th className="p-3">Name</th>
                <th className="p-3">Grade</th>
                <th className="p-3">Attendance</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s) => (
                <tr key={s.regNo} className="border-t border-slate-200 dark:border-slate-800">
                  <td className="p-3">{s.regNo}</td>
                  <td className="p-3">{s.name}</td>
                  <td className="p-3">{s.grade}</td>
                  <td className="p-3">{s.attendance}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
