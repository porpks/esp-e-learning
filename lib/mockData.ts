// ไฟล์: lib/mockData.ts

export const mockCurrentUser = {
  id: 3,
  empId: 'emp_10622',
  name: 'สมศรี รักงาน',
  department: 'Marketing',
  role: 'User',
  totalLearningTimeSec: 14500,
};

export const mockDashboardEnrollments = [
  {
    id: 1,
    course: {
      id: 101,
      title: "ความปลอดภัยทางไซเบอร์ 101 (Cybersecurity)",
      category: "IT Security",
      totalLessons: 5,
    },
    status: "IN_PROGRESS",
    progressPercent: 60,
    totalTimeSec: 3600,
    assignedBy: "Admin (พัชรพล K.)",
    dueDate: "2026-10-30",
  },
  {
    id: 2,
    course: {
      id: 102,
      title: "วัฒนธรรมองค์กรและการทำงานเป็นทีม",
      category: "HR & Culture",
      totalLessons: 3,
    },
    status: "ASSIGNED",
    progressPercent: 0,
    totalTimeSec: 0,
    assignedBy: "HR Department",
    dueDate: "2026-11-15",
  },
  {
    id: 3,
    course: {
      id: 103,
      title: "Japanese for Business Level 1",
      category: "Language",
      totalLessons: 10,
    },
    status: "COMPLETED",
    progressPercent: 100,
    totalTimeSec: 10900,
    assignedBy: "Self-Enrolled",
    dueDate: null,
  }
];