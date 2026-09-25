import { prisma } from '../lib/prisma';

async function main() {
  console.log('✎𓂃 Starting Mockup Data...');

  // 0. ล้างข้อมูลเก่าก่อน
  await prisma.enrollment.deleteMany({});
  await prisma.course.deleteMany({});
  await prisma.announcement.deleteMany({});
  console.log('...Clear existing course data.');

  // ==========================================
  // 1. สร้าง Users ตามโครงสร้างองค์กร (Hierarchy)
  // ==========================================
  const admin = await prisma.user.upsert({
    where: { empId: '1001' }, update: {}, 
    create: { 
      empId: '1001', username: 'Admin_Test', firstName: 'Admin', lastName: 'Test',
      email: 'admin_t@esp-group.asia', role: 'USER', isAdmin: true, department: 'Admin', 
      team: 'Admin', profileImage: 'https://ui-avatars.com/api/?name=Admin+Test&background=0B2545&color=fff',
      japaneseLevel: 'N1'
    },
  });

  const manager = await prisma.user.upsert({
    where: { empId: '1002' }, update: {},
    create: { 
      empId: '1002', username: 'Manager_Test', firstName: 'Manager', lastName: 'Test',
      email: 'manager_t@esp-group.asia', role: 'MANAGER', department: 'Manager', 
      team: 'Manager', japaneseLevel: 'N2'
    },
  });

  const leadCAD = await prisma.user.upsert({
    where: { empId: '1003' }, update: {},
    create: { 
      empId: '1003', username: 'LeadCAD_Test', firstName: 'LeadCAD', lastName: 'Test',
      email: 'leadcad_t@esp-group.asia', role: 'LEADER', department: 'CAD', 
      team: 'A07', managerId: manager.id 
    },
  });

  const leadNX = await prisma.user.upsert({
    where: { empId: '1004' }, update: {},
    create: { 
      empId: '1004', username: 'LeadNX_Test', firstName: 'LeadNX', lastName: 'Test',
      email: 'leadnx_t@esp-group.asia', role: 'LEADER', department: 'NX', 
      team: 'B12', managerId: manager.id 
    },
  });

  const leadSYS = await prisma.user.upsert({
    where: { empId: '1005' }, update: {},
    create: { 
      empId: '1005', username: 'LeadSYS_Test', firstName: 'LeadSYS', lastName: 'Test',
      email: 'leadsys_t@esp-group.asia', role: 'LEADER', department: 'System', 
      team: 'Software', managerId: manager.id 
    },
  });

  const userCAD = await prisma.user.upsert({
    where: { empId: '1006' }, update: {},
    create: { 
      empId: '1006', username: 'UserCAD_Test', firstName: 'UserCAD', lastName: 'Test',
      email: 'usercad_t@esp-group.asia', role: 'USER', department: 'CAD', 
      team: 'A07', managerId: leadCAD.id, japaneseLevel: 'N4'
    },
  });

  // ==========================================
  // 2. สร้าง Announcement 
  // ==========================================
  await prisma.announcement.createMany({
    data: [
      {
        title: "ยินดีต้อนรับสู่ ESP Enterprise Knowledge Hub!",
        description: "ศูนย์กลางการเรียนรู้และคลังเอกสารความรู้ภายในองค์กร เข้าถึงบทเรียน คอร์สฝึกอบรม และข่าวสารสำคัญได้ในที่เดียวอย่างปลอดภัย",
        category: "ANNOUNCEMENT", imageUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200", linkUrl: "/knowledge-base", creatorId: admin.id
      },
      {
        title: "เปิดตัวคอร์สเรียนใหม่: CAD & NX Design Standards",
        description: "ยกระดับทักษะการออกแบบทางวิศวกรรมด้วยบทเรียนมาตรฐานใหม่ล่าสุดจากทีม Eng. Knowledge พร้อมแบบทดสอบวัดผล",
        category: "NEW COURSE", imageUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=1200", linkUrl: "/courses", creatorId: admin.id
      },
      {
        title: "โครงการติวสอบวัดระดับภาษาญี่ปุ่น (JLPT Prep Course)",
        description: "เปิดรับสมัครพนักงานที่สนใจอัปเกรดทักษะภาษาญี่ปุ่น ระดับ N5 - N2 เข้าเรียนฟรี พร้อมรับสิทธิ์รับทุนสนับสนุนค่าสอบ",
        category: "JAPANESE HUB", imageUrl: "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?q=80&w=1200", linkUrl: "/japanese", creatorId: admin.id
      }
    ]
  });

  // ==========================================
  // 3. สร้าง Courses แบบจัดเต็ม (บทเรียน, วิดีโอ, เอกสาร)
  // ==========================================
  
  // 3.1 Course: CAD (12 บทเรียน) - Original
  const courseCAD = await prisma.course.create({
    data: {
      title: 'การใช้งานโปรแกรม CAD เบื้องต้น',
      description: 'เรียนรู้พื้นฐานการใช้งานซอฟต์แวร์ออกแบบ 3 มิติ สำหรับพนักงานใหม่ ตั้งแต่หน้าแรกจนถึงการ Export งาน',
      path: 'cad-basic', type: 'GENERAL', category: 'Work', creatorId: admin.id,
      thumbnail: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=500&q=80',
      lessons: {
        create: [
          {
            title: 'ส่วนที่ 1: พื้นฐานและการตั้งค่า (Basic & Setup)', order: 1,
            subLessons: { create: [
              { title: 'แนะนำหน้าต่างโปรแกรม (UI)', order: 1, durationSec: 300, videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
              { title: 'การตั้งค่า Workspace เบื้องต้น', order: 2, durationSec: 420, videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
              { title: 'ระบบพิกัดและมุมมอง (Coordinates)', order: 3, durationSec: 500, videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' }
            ]}
          }
        ]
      }
    }
  });

  // 3.2 Course: ความปลอดภัยทางไซเบอร์ 101 - Original
  await prisma.course.create({
    data: {
      title: 'ความปลอดภัยทางไซเบอร์ 101 (PDPA)',
      description: 'ข้อควรระวังและการจัดการข้อมูลส่วนบุคคลตามกฎหมาย PDPA',
      path: 'cybersecurity-101', type: 'GENERAL', category: 'IT Security', creatorId: admin.id,
      thumbnail: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=500&q=80',
      lessons: {
        create: [
          {
            title: 'บทที่ 1: PDPA คืออะไร?', order: 1,
            subLessons: { create: [
              { title: 'ความหมายของข้อมูลส่วนบุคคล', order: 1, durationSec: 600, videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' }
            ]}
          }
        ]
      }
    }
  });

  // 3.3 Course: วิธีรับมือกับความเครียด - Original
  await prisma.course.create({
    data: {
      title: 'วิธีรับมือกับความเครียด',
      description: 'คอร์สนี้จะพาพนักงานไปรู้วิธีการต่างๆ ในการจัดการความเครียดจากการทำงาน',
      path: 'stress-management', type: 'GENERAL', category: 'Soft Skill', creatorId: admin.id,
      thumbnail: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=500&q=80',
      lessons: {
        create: [
          {
            title: 'ทำความเข้าใจความเครียด', order: 1,
            subLessons: { create: [{ title: 'ความเครียดเกิดจากอะไร?', order: 1, durationSec: 450, videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' }]}
          }
        ]
      }
    }
  });

  // 3.4 Course: วิธีรับมือกับคนประสาท - Original
  await prisma.course.create({
    data: {
      title: 'วิธีรับมือกับคน Toxic',
      description: 'คอร์สนี้จะพาพนักงานอยู่ร่วมกับคนหลายรูปแบบในที่ทำงาน',
      path: 'handling-toxic-people', type: 'GENERAL', category: 'Soft Skill', creatorId: admin.id,
      thumbnail: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&q=80',
      lessons: {
        create: [
          {
            title: 'Lesson 1: เรียนรู้ที่จะปล่อยวาง', order: 1,
            subLessons: { create: [{ title: 'วิเคราะห์บุคลิกคน 4 ประเภท', order: 1, durationSec: 500, videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' }]}
          }
        ]
      }
    }
  });

  // ==========================================
  // 3.5 เพิ่ม Course อัตโนมัติอีก 16 คอร์ส ให้ครบ 20 คอร์สและครบทุกหมวดหมู่
  // ==========================================
  const extraCourses = [
    { 
      title: 'วัฒนธรรมองค์กรและ Core Values', category: 'HR & Culture', desc: 'เรียนรู้ DNA ของบริษัท',
      thumbnail: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=500&q=80'
    },
    { 
      title: 'Onboarding 101 สำหรับพนักงานใหม่', category: 'HR & Culture', desc: 'ทุกเรื่องที่พนักงานใหม่ต้องรู้',
      thumbnail: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=500&q=80'
    },
    { 
      title: 'กระบวนการประเมินผลงาน (KPIs & OKRs)', category: 'HR & Culture', desc: 'การตั้งเป้าหมายและการวัดผล',
      thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&q=80'
    },
    { 
      title: 'ระบบสวัสดิการและการเบิกจ่าย', category: 'HR & Culture', desc: 'สิทธิประโยชน์ที่พนักงานควรทราบ',
      thumbnail: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=500&q=80'
    },
    { 
      title: 'Supply Chain Basics', category: 'Operations', desc: 'พื้นฐานระบบโลจิสติกส์',
      thumbnail: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=500&q=80'
    },
    { 
      title: 'Quality Control (ISO9001)', category: 'Operations', desc: 'การรักษามาตรฐานคุณภาพในการทำงาน',
      thumbnail: 'https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?w=500&q=80'
    },
    { 
      title: 'Lean Manufacturing เบื้องต้น', category: 'Operations', desc: 'การลดความสูญเปล่าในกระบวนการ',
      thumbnail: 'https://www.simtec.or.th/wp-content/uploads/2022/12/Aw-lean-02-1.png.webp'
    },
    { 
      title: 'ความปลอดภัยในสถานที่ทำงาน (WHS)', category: 'Operations', desc: 'การป้องกันอุบัติเหตุในองค์กร',
      thumbnail: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=500&q=80'
    },
    { 
      title: 'Advanced Excel & Macros', category: 'Work', desc: 'การใช้ Excel ขั้นสูงเพื่อวิเคราะห์ข้อมูล',
      thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500&q=80'
    },
    { 
      title: 'NX Design Advanced Techniques', category: 'Work', desc: 'เทคนิคการออกแบบ NX ขั้นสูง',
      thumbnail: 'https://images.unsplash.com/photo-1537462715879-360eeb61a0ad?w=500&q=80'
    },
    { 
      title: 'Python for Data Analysis', category: 'Work', desc: 'การวิเคราะห์ข้อมูลด้วย Pandas',
      thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=500&q=80'
    },
    { 
      title: 'Network Security Basics', category: 'IT Security', desc: 'พื้นฐานความปลอดภัยเครือข่าย',
      thumbnail: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=500&q=80'
    },
    { 
      title: 'Cloud Security Awareness', category: 'IT Security', desc: 'การใช้งาน Cloud อย่างปลอดภัย',
      thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=500&q=80'
    },
    { 
      title: 'Effective Communication', category: 'Soft Skill', desc: 'การสื่อสารอย่างมีประสิทธิภาพ',
      thumbnail: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=500&q=80'
    },
    { 
      title: 'Time Management Mastery', category: 'Soft Skill', desc: 'การบริหารเวลาและจัดลำดับความสำคัญ',
      thumbnail: 'https://images.unsplash.com/photo-1495364141860-b0d03eccd065?w=500&q=80'
    },
    { 
      title: 'Leadership 101 สำหรับหัวหน้างานใหม่', category: 'Management', desc: 'ทักษะการเป็นผู้นำและการจัดการทีม',
      thumbnail: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&q=80'
    }
  ];

  for (let i = 0; i < extraCourses.length; i++) {
    const c = extraCourses[i];
    await prisma.course.create({
      data: {
        title: c.title,
        description: c.desc,
        path: `extra-course-${i}`,
        type: 'GENERAL',
        category: c.category,
        creatorId: admin.id,
        thumbnail: c.thumbnail,
        lessons: {
          create: [
            {
              title: 'บทนำ (Introduction)', order: 1,
              subLessons: { create: [
                { title: 'ภาพรวมของคอร์ส', order: 1, durationSec: 1200 + (i * 100), videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
                { title: 'เนื้อหาหลัก', order: 2, durationSec: 2400 + (i * 200), videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' }
              ]}
            }
          ]
        }
      }
    });
  }

  // ==========================================
  // 4. สร้าง Mockup Enrollment (จำลองว่ามีคอร์สกำลังเรียนอยู่)
  // ==========================================
  
  // สมมติว่าต้องการให้ userCAD เป็นตัวทดสอบ
  const testUser = await prisma.user.findUnique({ where: { empId: '1006' } });
  const coursePDPA = await prisma.course.findFirst({ where: { path: 'cybersecurity-101' } });
  const courseSoftSkill = await prisma.course.findFirst({ where: { category: 'Soft Skill' } });

  if (testUser && courseCAD && coursePDPA && courseSoftSkill) {
    await prisma.enrollment.createMany({
      data: [
        {
          userId: testUser.id,
          courseId: courseCAD.id,
          status: 'IN_PROGRESS',
          progressPercent: 45,
          deadline: new Date(new Date().setDate(new Date().getDate() + 3)),
          assignedById: admin.id
        },
        {
          userId: testUser.id,
          courseId: courseSoftSkill.id,
          status: 'IN_PROGRESS',
          progressPercent: 12,
          deadline: new Date(new Date().setDate(new Date().getDate() + 10)),
          assignedById: admin.id
        },
        {
          userId: testUser.id,
          courseId: coursePDPA.id,
          status: 'COMPLETED', // อันนี้เรียนจบแล้ว จะไม่ขึ้นใน Continue Learning
          progressPercent: 100,
          deadline: new Date(),
          assignedById: admin.id
        }
      ]
    });
  }

  console.log('✓ Create Mockup Data complete (Total 20 Courses)!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });