'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const studentSchema = z.object({
  fullName: z.string().min(2),
  email: z.string().email(),
  gradeLevel: z.string().min(1),
});

type StudentForm = z.infer<typeof studentSchema>;

export default function StudentRegistrationPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<StudentForm>({ resolver: zodResolver(studentSchema) });

  const onSubmit = (data: StudentForm) => {
    console.log('submit student', data);
  };

  return (
    <main className="mx-auto max-w-xl p-6">
      <h1 className="mb-6 text-2xl font-bold">Register Student</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input {...register('fullName')} placeholder="Full Name" className="w-full rounded border p-2" />
        {errors.fullName ? <p className="text-sm text-red-500">Name is required.</p> : null}

        <input {...register('email')} placeholder="Email" className="w-full rounded border p-2" />
        {errors.email ? <p className="text-sm text-red-500">Valid email is required.</p> : null}

        <input {...register('gradeLevel')} placeholder="Grade" className="w-full rounded border p-2" />
        {errors.gradeLevel ? <p className="text-sm text-red-500">Grade is required.</p> : null}

        <button type="submit" className="rounded bg-slate-900 px-4 py-2 text-white dark:bg-slate-200 dark:text-slate-900">
          Submit
        </button>
      </form>
    </main>
  );
}
