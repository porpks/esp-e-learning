import { NextResponse } from 'next/server';

export async function POST() {
  // ในระบบ Stateless JWT หลังบ้านไม่ต้องทำลาย Session แล้ว
  // การ Logout ที่แท้จริงคือการที่ฝั่งหน้าบ้าน (Client) ลบ Token ทิ้ง
  return NextResponse.json({ success: true, message: 'Logged out successfully' });
}