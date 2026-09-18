import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
const ActiveDirectory = require('activedirectory2');

async function fetchEmpIdFromExternalDB(adUsername: string) {
  try {
    const foundUserRow = await prisma.user.findFirst({
      where: { username: adUsername }
    });

    if (foundUserRow) {
      return { 
        empId: foundUserRow.empId, 
        firstName: foundUserRow.firstName,
        lastName: foundUserRow.lastName,
        department: foundUserRow.department, 
        team: foundUserRow.team, 
        role: foundUserRow.role 
      };
    }
    
    // ถ้าหาไม่เจอ
    return { empId: null, firstName: null, lastName: null, department: null, team: null, role: null };

  } catch (error) {
    console.error('Database connection error:', error);
    return { empId: null, firstName: null, lastName: null, department: null, team: null, role: null };
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password } = body; 

    if (!username || !password) {
      return NextResponse.json({ error: 'กรุณากรอกข้อมูลให้ครบถ้วน' }, { status: 400 });
    }

    // ==========================================
    // 🚀 1. ระบบ Bypass สำหรับ Test Users (Dev Mode)
    // ==========================================
    const testUsers = [
        { empId: '1001', username: 'Admin_Test' },
        { empId: '1002', username: 'Manager_Test' },
        { empId: '1003', username: 'LeadCAD_Test' },
        { empId: '1004', username: 'LeadNX_Test' },
        { empId: '1005', username: 'LeadSYS_Test' },
        { empId: '1006', username: 'UserCAD_Test' },
        { empId: '1007', username: 'UserNX_Test' },
        { empId: '1008', username: 'UserSYS_Test' }
    ];
    const testPassword = 'Esp@as0ke';

    const isTestUser = testUsers.some(user => user.username === username);
    
    if (isTestUser && password === testPassword) {
      const testUser = await prisma.user.findUnique({
        where: { empId: testUsers.find(user => user.username === username)?.empId || 'non-existent' }
      });

      if (testUser) {
        const response = NextResponse.json({ success: true, user: testUser });
        
        response.cookies.set('user_session', JSON.stringify({
            id: testUser.id,
            empId: testUser.empId,
            username: testUser.username,
            firstName: testUser.firstName,
            lastName: testUser.lastName,
            email: testUser.email,
            department: testUser.department,
            team: testUser.team,
            role: testUser.role,
            isAdmin: testUser.isAdmin,
            profileImage: testUser.profileImage || null,
        }), {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          path: '/',
          maxAge: 60 * 60 * 1,
        });

        return response;
      }
    }

    // ==========================================
    // 🔐 2. ระบบ Active Directory (Production)
    // ==========================================
    const userPrincipalName = `${username}@esp-group.asia`;
    const config = {
      url: 'ldap://192.168.1.3',
      baseDN: 'dc=esp-group,dc=asia', 
    };
    
    const ad = new ActiveDirectory(config);

    const authenticateAndFindUser = () => {
      return new Promise((resolve) => {
        ad.authenticate(userPrincipalName, password, (err: any, auth: boolean) => {
          if (err || !auth) {
            return resolve(null);
          }
          
          ad.findUser(userPrincipalName, (findErr: any, adUser: any) => {
            if (findErr || !adUser) {
              return resolve({ displayName: username, department: null });
            }
            resolve(adUser);
          });
        });
      });
    };

    const adUser: any = await authenticateAndFindUser();
    
    if (!adUser) {
      return NextResponse.json({ error: 'Username หรือ Password ไม่ถูกต้อง' }, { status: 401 });
    }

    const externalData = await fetchEmpIdFromExternalDB(username);
    const realEmpId = externalData.empId;
    const departmentName = externalData.department;
    const teamName = externalData.team;

    if (!realEmpId) {
      return NextResponse.json({ error: 'ไม่พบข้อมูลรหัสพนักงานในฐานข้อมูลกลาง' }, { status: 404 });
    }

    console.log(`adUser found: ${JSON.stringify(adUser)} | realEmpId: ${realEmpId}`);
    
    let firstName = externalData.firstName;
    let lastName = externalData.lastName;

    if (!firstName) {
      const nameDisplay = adUser.displayName || adUser.cn || username;
      const nameParts = nameDisplay.split(' ');
      firstName = nameParts[0];
      lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';
    }
    
    const userEmail = adUser.mail || `${username.toLowerCase()}@esp-group.asia`;
    let user = await prisma.user.findUnique({
      where: { empId: realEmpId } 
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          empId: realEmpId,
          username: username,
          firstName: firstName,
          lastName: lastName,
          email: userEmail,
          department: departmentName,
          team: teamName,
          role: 'USER' 
        }
      });
    } else {
      user = await prisma.user.update({
        where: { empId: realEmpId },
        data: {
          firstName: firstName,
          lastName: lastName,
          department: departmentName,
          team: teamName,
        }
      });
    }

    const response = NextResponse.json({ success: true, user });
    
    response.cookies.set('user_session', JSON.stringify({
      id: user.id,
      empId: user.empId,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      department: user.department,
      team: user.team,
      role: user.role,
      isAdmin: user.isAdmin,
      profileImage: user.profileImage || null,
    }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 1, 
    });

    return response;

  } catch (error: any) {
    console.error('System Error:', error);
    return NextResponse.json({ error: 'ระบบหลังบ้านขัดข้อง' }, { status: 500 });
  }
}