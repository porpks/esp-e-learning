import { prisma } from '../lib/prisma'; // เช็ก Path นี้ให้ตรงกับความเป็นจริงด้วยนะครับ

async function main() {
  console.log('🌱 เริ่มต้นการสร้าง Mockup Data...');

  // 0. ล้างข้อมูลเก่าก่อน
  await prisma.enrollment.deleteMany({});
  await prisma.course.deleteMany({});
  await prisma.announcement.deleteMany({});
  console.log('🧹 ล้างข้อมูลคอร์สและประกาศเก่าเรียบร้อย');

  // ==========================================
  // 1. สร้าง Users ตามโครงสร้างองค์กร (Hierarchy)
  // ==========================================
  const admin = await prisma.user.upsert({
    where: { empId: '1001' }, 
    update: {}, 
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

  const userNX = await prisma.user.upsert({
    where: { empId: '1007' }, update: {},
    create: { 
      empId: '1007', username: 'UserNX_Test', firstName: 'UserNX', lastName: 'Test',
      email: 'usernx_t@esp-group.asia', role: 'USER', department: 'NX', 
      team: 'B12', managerId: leadNX.id 
    },
  });

  const userSYS = await prisma.user.upsert({
    where: { empId: '1008' }, update: {},
    create: { 
      empId: '1008', username: 'UserSYS_Test', firstName: 'UserSYS', lastName: 'Test',
      email: 'usersys_t@esp-group.asia', role: 'USER', department: 'System', 
      team: 'Software', managerId: leadSYS.id, japaneseLevel: 'N3'
    },
  });

  const userPCK = await prisma.user.upsert({
    where: { empId: '5112' }, update: {},
    create: { 
      empId: '5112', username: 'Pacharaphol_k', firstName: 'Pacharaphol', lastName: 'Kongnil',
      email: 'pacharaphol_k@esp-group.asia', role: 'LEADER', department: 'System', 
      team: 'Software', managerId: leadSYS.id,
    },
  });
  
  const userPKS = await prisma.user.upsert({
    where: { empId: '5328' }, update: {},
    create: { 
      empId: '5328', username: 'Pakapong_s', firstName: 'Pakapong', lastName: 'Sathianchok',
      email: 'pakapong_s@esp-group.asia', role: 'USER', department: 'System', 
      team: 'Software', managerId: userPCK.id,
    },
  });
  
  const userTWD = await prisma.user.upsert({
    where: { empId: '5332' }, update: {},
    create: { 
      empId: '5332', username: 'Thanawadee_t', firstName: 'Thanawadee', lastName: 'Thongpak',
      email: 'thanawadee_t@esp-group.asia', role: 'USER', department: 'System', 
      team: 'System', managerId: userPCK.id,
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
      },
      {
        title: "แจ้งปิดปรับปรุงระบบ IT Infrastructure ชั่วคราว",
        description: "ระบบจะทำการอัปเดตประสิทธิภาพและเพิ่มความปลอดภัยในวันเสาร์นี้ เวลา 22:00 - 00:00 น. ขออภัยในความไม่สะดวก",
        category: "MAINTENANCE", imageUrl: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=1200", linkUrl: "/faqs", creatorId: admin.id
      },
      {
        title: "รับชมวิดีโอย้อนหลังกิจกรรม Townhall & Q/A Session",
        description: "สามารถดาวน์โหลดเอกสารประกอบการประชุม และรับชมสไลด์การนำเสนอวิสัยทัศน์ประจำไตรมาสได้แล้ววันนี้",
        category: "EVENT", imageUrl: "https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=1200", linkUrl: "/faqs", creatorId: admin.id
      }
    ]
  });

  // ==========================================
  // 3. สร้าง Courses แบบจัดเต็ม (บทเรียน, วิดีโอ, เอกสาร)
  // ==========================================
  
  // 3.1 Course: CAD (12 บทเรียน)
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
              { title: 'ระบบพิกัดและมุมมอง (Coordinates)', order: 3, durationSec: 500, videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
              { title: 'เอกสารคีย์ลัดที่ใช้บ่อย (Shortcuts)', order: 4, durationSec: 60, documents: { create: { title: 'CAD_Shortcuts.pdf', fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', fileType: 'application/pdf' } } }
            ]}
          },
          {
            title: 'ส่วนที่ 2: เครื่องมือวาด 2D (2D Drafting Tools)', order: 2,
            subLessons: { create: [
              { title: 'การวาดเส้นตรงและเส้นโค้ง (Line & Arc)', order: 1, durationSec: 600, videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
              { title: 'การวาดรูปทรงเรขาคณิต (Shapes)', order: 2, durationSec: 540, videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
              { title: 'การใช้เครื่องมือปรับแต่ง (Modify Tools)', order: 3, durationSec: 720, videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
              { title: 'แบบฝึกหัดการวาด 2D (Exercise)', order: 4, durationSec: 120, documents: { create: { title: 'Exercise_2D.pdf', fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', fileType: 'application/pdf' } } }
            ]}
          },
          {
            title: 'ส่วนที่ 3: เลเยอร์และการบอกขนาด (Layer & Dimension)', order: 3,
            subLessons: { create: [
              { title: 'การจัดการ Layer อย่างเป็นระบบ', order: 1, durationSec: 480, videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
              { title: 'การใส่ Dimension และ Text', order: 2, durationSec: 560, videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
              { title: 'การตั้งค่าหน้ากระดาษ (Layout & Plot)', order: 3, durationSec: 600, videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
              { title: 'สรุปเทคนิคการทำงานให้ไวขึ้น', order: 4, durationSec: 300, videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' }
            ]}
          }
        ]
      }
    }
  });

  // 3.2 Course: ความปลอดภัยทางไซเบอร์ 101 (PDPA)
  const coursePDPA = await prisma.course.create({
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
              { title: 'ความหมายของข้อมูลส่วนบุคคล', order: 1, durationSec: 600, videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
              { title: 'สิทธิของเจ้าของข้อมูล', order: 2, durationSec: 900, videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' }
            ]}
          },
          {
            title: 'บทที่ 2: การป้องกันภัยคุกคาม', order: 2,
            subLessons: { create: [
              { title: 'วิธีสังเกต Phishing Email', order: 1, durationSec: 420, videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
              { title: 'นโยบายความปลอดภัยของบริษัท (Policy)', order: 2, durationSec: 120, documents: { create: { title: 'IT_Security_Policy.pdf', fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', fileType: 'application/pdf' } } }
            ]}
          }
        ]
      }
    }
  });

  // 3.3 Course: วิธีรับมือกับความเครียด
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
            subLessons: { create: [
              { title: 'ความเครียดเกิดจากอะไร?', order: 1, durationSec: 450, videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
              { title: 'แบบประเมินความเครียด (Checklist)', order: 2, durationSec: 60, documents: { create: { title: 'Stress_Checklist.pdf', fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', fileType: 'application/pdf' } } }
            ]}
          },
          {
            title: 'เทคนิคการจัดการ', order: 2,
            subLessons: { create: [
              { title: 'การฝึกหายใจและผ่อนคลายกล้ามเนื้อ', order: 1, durationSec: 600, videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
              { title: 'การปรับ Mindset ในการทำงาน', order: 2, durationSec: 720, videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' }
            ]}
          }
        ]
      }
    }
  });

  // 3.4 Course: วิธีรับมือกับคนประสาท
  await prisma.course.create({
    data: {
      title: 'วิธีรับมือกับคนประสาท',
      description: 'คอร์สนี้จะพาพนักงานอยู่ร่วมกับคนหลายรูปแบบในที่ทำงาน',
      path: 'handling-toxic-people', type: 'GENERAL', category: 'Soft Skill', creatorId: admin.id,
      thumbnail: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&q=80',
      lessons: {
        create: [
          {
            title: 'Lesson 1: เรียนรู้ที่จะปล่อยวาง', order: 1,
            subLessons: { create: [
              { title: 'วิเคราะห์บุคลิกคน 4 ประเภท', order: 1, durationSec: 500, videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
              { title: 'การรับมือด้วย Assertive Communication', order: 2, durationSec: 600, videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
              { title: 'สคริปต์การสื่อสารในสถานการณ์ตึงเครียด', order: 3, durationSec: 60, documents: { create: { title: 'Communication_Script.pdf', fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', fileType: 'application/pdf' } } }
            ]}
          }
        ]
      }
    }
  });

  // ==========================================
  // 4. สร้าง Mockup Enrollment
  // ==========================================
  await prisma.enrollment.create({
    data: {
      userId: userCAD.id,
      courseId: courseCAD.id,
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