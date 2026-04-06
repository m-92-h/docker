-- إنشاء الجدول إذا لم يكن موجوداً مسبقاً
CREATE TABLE IF NOT EXISTS messages (
    id SERIAL PRIMARY KEY,            -- معرف تلقائي فريد
    content TEXT NOT NULL,            -- نص الرسالة (إلزامي)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP -- توقيت الإضافة تلقائياً
);

-- (اختياري) إضافة بيانات تجريبية للتأكد من أن الربط يعمل
INSERT INTO messages (content) VALUES ('أهلاً بك في مشروع MEENA!');
INSERT INTO messages (content) VALUES ('قاعدة بيانات Postgres تعمل بنجاح عبر Docker.');