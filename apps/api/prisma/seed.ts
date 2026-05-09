import { PrismaClient, UserRole } from '@prisma/client';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await argon2.hash('ChangeMe#123');

  const roles = Object.values(UserRole);
  for (const roleName of roles) {
    await prisma.role.upsert({
      where: { name: roleName },
      create: { name: roleName, level: roleName === 'SUPER_ADMIN' ? 100 : 10 },
      update: {},
    });
  }

  const permissionDefinitions = [
    ['create', 'students'],
    ['read', 'students'],
    ['update', 'students'],
    ['delete', 'students'],
    ['create', 'teachers'],
    ['read', 'teachers'],
    ['create', 'parents'],
    ['read', 'parents'],
    ['create', 'departments'],
    ['read', 'departments'],
    ['create', 'subjects'],
    ['read', 'subjects'],
    ['create', 'courses'],
    ['read', 'courses'],
    ['create', 'classes'],
    ['read', 'classes'],
    ['create', 'payments'],
    ['read', 'payments'],
    ['read', 'analytics'],
  ] as const;

  for (const [action, resource] of permissionDefinitions) {
    await prisma.permission.upsert({
      where: { action_resource: { action, resource } },
      create: { action, resource, description: `${action} ${resource}` },
      update: {},
    });
  }

  const admin = await prisma.user.upsert({
    where: { email: 'admin@sis.local' },
    create: {
      email: 'admin@sis.local',
      passwordHash,
      fullName: 'System Admin',
    },
    update: {},
  });

  const superAdminRole = await prisma.role.findUniqueOrThrow({ where: { name: UserRole.SUPER_ADMIN } });
  await prisma.userRoleMap.upsert({
    where: { userId_roleId: { userId: admin.id, roleId: superAdminRole.id } },
    create: { userId: admin.id, roleId: superAdminRole.id },
    update: {},
  });

  const studentUser = await prisma.user.upsert({
    where: { email: 'student@sis.local' },
    create: {
      email: 'student@sis.local',
      passwordHash,
      fullName: 'Alice Johnson',
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

  const studentRole = await prisma.role.findUniqueOrThrow({ where: { name: UserRole.STUDENT } });
  await prisma.userRoleMap.upsert({
    where: { userId_roleId: { userId: studentUser.id, roleId: studentRole.id } },
    create: { userId: studentUser.id, roleId: studentRole.id },
    update: {},
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
