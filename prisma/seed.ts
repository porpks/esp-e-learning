import { prisma } from '../lib/prisma'; // เช็ก Path นี้ให้ตรงกับความเป็นจริงด้วยนะครับ

async function main() {
  console.log('🌱 เริ่มต้นการสร้าง Mockup Data...');

  // 0. ล้างข้อมูลเก่าก่อน (ป้องกันข้อมูลซ้ำเวลารัน seed หลายรอบ)
  // คำสั่งจะลบแบบ Cascade (ถ้าลบคอร์ส บทเรียนย่อยจะหายไปด้วย)
  await prisma.enrollment.deleteMany({});
  await prisma.course.deleteMany({});
  await prisma.announcement.deleteMany({});
  console.log('🧹 ล้างข้อมูลคอร์สและประกาศเก่าเรียบร้อย');

  // ==========================================
  // 1. สร้าง Users ตามโครงสร้างองค์กร (Hierarchy)
  // ==========================================
  
  const admin = await prisma.user.upsert({
    where: { empId: '1001' }, 
    update: {}, // ถ้ารันซ้ำ ไม่ต้องอัปเดตอะไร
    create: { 
      empId: '1001', 
      username: 'Admin_Test',
      firstName: 'Admin', 
      lastName: 'Test',
      email: 'admin_t@esp-group.asia',
      role: 'USER', 
      isAdmin: true,
      department: 'Admin', 
      team: 'Admin',
      profileImage: 'https://ui-avatars.com/api/?name=Admin+Test&background=0B2545&color=fff',
      japaneseLevel: 'N1'
    },
  });

  const manager = await prisma.user.upsert({
    where: { empId: '1002' }, update: {},
    create: { 
      empId: '1002', 
      username: 'Manager_Test',
      firstName: 'Manager', 
      lastName: 'Test',
      email: 'manager_t@esp-group.asia',
      role: 'MANAGER', 
      department: 'Manager', 
      team: 'Manager',
      japaneseLevel: 'N2'
    },
  });

  const leadCAD = await prisma.user.upsert({
    where: { empId: '1003' }, update: {},
    create: { 
      empId: '1003', 
      username: 'LeadCAD_Test',
      firstName: 'LeadCAD', 
      lastName: 'Test',
      email: 'leadcad_t@esp-group.asia',
      role: 'LEADER', 
      department: 'CAD', 
      team: 'A07', 
      managerId: manager.id 
    },
  });

  const leadNX = await prisma.user.upsert({
    where: { empId: '1004' }, update: {},
    create: { 
      empId: '1004', 
      username: 'LeadNX_Test',
      firstName: 'LeadNX', 
      lastName: 'Test',
      email: 'leadnx_t@esp-group.asia',
      role: 'LEADER', 
      department: 'NX', 
      team: 'B12', 
      managerId: manager.id 
    },
  });

  const leadSYS = await prisma.user.upsert({
    where: { empId: '1005' }, update: {},
    create: { 
      empId: '1005', 
      username: 'LeadSYS_Test',
      firstName: 'LeadSYS', 
      lastName: 'Test',
      email: 'leadsys_t@esp-group.asia',
      role: 'LEADER', 
      department: 'System', 
      team: 'Software', 
      managerId: manager.id 
    },
  });

  const userCAD = await prisma.user.upsert({
    where: { empId: '1006' }, update: {},
    create: { 
      empId: '1006', 
      username: 'UserCAD_Test',
      firstName: 'UserCAD', 
      lastName: 'Test',
      email: 'usercad_t@esp-group.asia',
      role: 'USER', 
      department: 'CAD', 
      team: 'A07', 
      managerId: leadCAD.id,
      japaneseLevel: 'N4'
    },
  });

  const userNX = await prisma.user.upsert({
    where: { empId: '1007' }, update: {},
    create: { 
      empId: '1007', 
      username: 'UserNX_Test',
      firstName: 'UserNX', 
      lastName: 'Test',
      email: 'usernx_t@esp-group.asia',
      role: 'USER', 
      department: 'NX', 
      team: 'B12', 
      managerId: leadNX.id 
    },
  });

  const userSYS = await prisma.user.upsert({
    where: { empId: '1008' }, update: {},
    create: { 
      empId: '1008', 
      username: 'UserSYS_Test',
      firstName: 'UserSYS', 
      lastName: 'Test',
      email: 'usersys_t@esp-group.asia',
      role: 'USER', 
      department: 'System', 
      team: 'Software', 
      managerId: leadSYS.id,
      japaneseLevel: 'N3'
    },
  });
  
  // ==========================================
  // 2. สร้าง Announcement & Courses
  // ==========================================
  
  await prisma.announcement.create({
    data: {
      title: 'แจ้งเตือนด่วน',
      content: 'แจ้งเตือน: คอร์สบังคับ "PDPA ฉบับอัปเดต 2026" จะครบกำหนดในอีก 3 วัน!',
      creatorId: admin.id,
    }
  });

  const course1 = await prisma.course.create({
    data: {
      title: 'ความปลอดภัยทางไซเบอร์ 101 (PDPA)',
      description: 'ข้อควรระวังและการจัดการข้อมูลส่วนบุคคลตามกฎหมาย PDPA',
      type: 'GENERAL',
      category: 'IT Security',
      creatorId: admin.id,
      thumbnail: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=500&q=80',
      lessons: {
        create: [
          {
            title: 'บทที่ 1: PDPA คืออะไร?',
            order: 1,
            subLessons: {
              create: [
                { title: 'ความหมายของข้อมูลส่วนบุคคล', order: 1, durationSec: 600 },
                { title: 'สิทธิของเจ้าของข้อมูล', order: 2, durationSec: 900 }
              ]
            }
          }
        ]
      }
    }
  });

  await prisma.course.createMany({
    data: [
          {
              title: 'วิธีรับมือกับความเครียด',
            description: 'คอร์สนี้จะพาพนักงานไปรู้วิธีการต่างๆ...',
            type: 'GENERAL',
            category: 'Soft Skill',
            creatorId: admin.id,
            thumbnail: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=500&q=80'
          },
          {
              title: 'วิธีรับมือกับคนประสาท',
              description: 'คอร์สนี้จะพาพนักงานอยู่ร่วมกับคนหลายรูปแบบ',
              type: 'GENERAL', category: 'Soft Skill',
              creatorId: admin.id,
              thumbnail: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&q=80'
          },
    ]
  });

  await prisma.enrollment.create({
    data: {
      userId: userCAD.id,
      courseId: course1.id,
      status: 'IN_PROGRESS',
      progressPercent: 45,
      deadline: new Date(new Date().setDate(new Date().getDate() + 3)),
      assignedById: leadCAD.id
    }
  });

  console.log('✅ สร้าง Mockup Data และโครงสร้างพนักงาน สำเร็จเรียบร้อย!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });