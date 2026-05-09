import { PrismaClient, UserRole } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const admin = await prisma.user.upsert({
    where: { email: 'admin@sis.local' },
    create: {
      email: 'admin@sis.local',
      passwordHash: 'replace_with_hashed_password',
      fullName: 'System Admin',
      role: UserRole.ADMIN,
    },
    update: {},
  });

  const studentUser = await prisma.user.upsert({
    where: { email: 'student@sis.local' },
    create: {
      email: 'student@sis.local',
      passwordHash: 'replace_with_hashed_password',
      fullName: 'Alice Johnson',
      role: UserRole.STUDENT,
      student: {
        create: {
          registration: 'SIS-2026-001',
          gradeLevel: '10',
        },
      },
    },
    update: {},
    include: { student: true },
  });

  if (studentUser.student) {
    await prisma.attendance.upsert({
      where: {
        studentId_date: {
          studentId: studentUser.student.id,
          date: new Date('2026-05-01'),
        },
      },
      create: {
        studentId: studentUser.student.id,
        date: new Date('2026-05-01'),
        present: true,
      },
      update: {},
    });
  }

  console.log('Seed completed:', { adminId: admin.id, studentId: studentUser.id });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
