import postgres from "postgres";

const sql = postgres({
    // إعدادات الاتصال الأساسية
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 5432,
    database: "postgres",
    username: "postgres",
    password: "123",

    // إعدادات الأداء والأمان
    ssl: "require",
    max: 10,
    idle_timeout: 20,
    connect_timeout: 10,
});

export default sql;
