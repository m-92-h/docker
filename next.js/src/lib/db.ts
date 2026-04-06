import postgres from 'postgres';

// تعريف واجهة البيانات (Interface) لجدول الرسائل
export interface Message {
  id: number;
  content: string;
  created_at: Date;
}

// إعداد خزان الاتصالات (Connection Pool)
const connectionString = process.env.DATABASE_URL as string;

const sql = postgres(connectionString, {
  idle_timeout: 20,
  max: 10,
  // تحويل أسماء الأعمدة من snake_case إلى camelCase تلقائياً (اختياري)
  transform: postgres.camel, 
});

export default sql;