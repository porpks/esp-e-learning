import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';

// นำเข้าไลบรารี activedirectory2
const ActiveDirectory = require('activedirectory2');

// ตั้งค่า Adapter สำหรับ MariaDB
const adapter = new PrismaMariaDb({
  host: 'localhost',
  user: 'root',
  password: 'Esp@as0ke',
  database: 'knowledge_db',
  port: 3306
});

const prisma = new PrismaClient({ adapter });

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password } = body; 

    if (!username || !password) {
      return NextResponse.json({ error: 'กรุณากรอกข้อมูลให้ครบถ้วน' }, { status: 400 });
    }

    // ==========================================
    // 🌟 1. ตั้งค่าการเชื่อมต่อ Active Directory
    // ==========================================
    const config = {
      url: 'ldap://192.168.1.3',
      // ปรับ baseDN อัตโนมัติตามชื่อโดเมน
      baseDN: 'dc=esp-group,dc=asia', 
    };

    const ad = new ActiveDirectory(config);
    
    // ==========================================
    // 🌟 2. ประกอบร่างชื่อ Username + Domain
    // ==========================================
    // เติม @esp-group.asia เข้าไปด้านหลังให้อัตโนมัติ!
    const userPrincipalName = `${username}@esp-group.asia`;

    // ฟังก์ชันสำหรับเช็กรหัสผ่านกับ AD
    const authenticateAD = () => {
      return new Promise((resolve, reject) => {
        ad.authenticate(userPrincipalName, password, function(err: any, auth: boolean) {
          if (err) {
            console.error('AD Auth Error:', err);
            return resolve(false); // ล็อกอินไม่ผ่าน
          }
          resolve(auth); // ล็อกอินผ่าน
        });
      });
    };

    // สั่งรันการตรวจสอบรหัสผ่าน
    const isAuthenticated = await authenticateAD();

    if (!isAuthenticated) {
      return NextResponse.json({ error: 'Username หรือ Password ไม่ถูกต้อง' }, { status: 401 });
    }

    // ==========================================
    // 🌟 3. ถ้ารหัสผ่าน AD ถูกต้อง มาเช็กสิทธิ์ใน MariaDB
    // ==========================================
    let user = await prisma.user.findUnique({
      where: { empId: username } 
    });

    // ถ้าไม่มีในระบบเรา ให้สร้างบัญชีใหม่ให้อัตโนมัติเลย (ใช้ชื่อ pacharaphol_k เป็น empId)
    if (!user) {
      user = await prisma.user.create({
        data: {
          empId: username,
          name: username, 
          role: 'User'
        }
      });
    }

    // ส่งข้อมูลกลับไปให้หน้าเว็บเพื่อเข้าสู่ Dashboard
    return NextResponse.json({ success: true, user });

  } catch (error: any) {
    console.error('System Error:', error);
    return NextResponse.json({ error: 'ระบบหลังบ้านขัดข้อง' }, { status: 500 });
  }
}