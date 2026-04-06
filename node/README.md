# 📒 Guestbook App — مشروع تعليمي

تطبيق **دفتر الضيوف** هو مشروع تعليمي بسيط يهدف إلى تعلم كيفية بناء بيئة تطوير وإنتاج كاملة باستخدام **Node.js + PostgreSQL + Docker + GitHub Actions**.

---

## 🗂️ هيكل المشروع

```
project/
├── server.js            # الخادم الرئيسي (Express)
├── package.json         # تبعيات Node.js
├── init.sql             # إنشاء قاعدة البيانات عند التشغيل الأول
├── Dockerfile           # وصفة بناء صورة التطبيق
├── docker-compose.yml   # تشغيل التطبيق وقاعدة البيانات معاً
├── .env                 # متغيرات البيئة (لا يُرفع لـ Git)
├── .env.example         # نموذج للمتغيرات المطلوبة
├── .dockerignore        # ملفات يتجاهلها Docker عند البناء
├── .gitignore           # ملفات يتجاهلها Git
└── .github/
    └── workflows/
        └── ci.yml       # سكريبت CI/CD على GitHub Actions
```

---

## ⚙️ المتطلبات

- [Docker](https://www.docker.com/) و Docker Compose
- [Node.js](https://nodejs.org/) (اختياري، للتطوير المحلي بدون Docker)

---

## 🚀 طريقة التشغيل

### 1. إعداد متغيرات البيئة

انسخ ملف `.env.example` وأعد تسميته إلى `.env` ثم عدّل القيم:

```bash
cp .env.example .env
```

```env
PORT=3000
NODE_ENV=development

DB_NAME=guestbook
DB_USER=admin
DB_PASSWORD=secret
DB_PORT=5432
```

### 2. تشغيل المشروع بـ Docker Compose

```bash
docker compose up --build
```

ثم افتح المتصفح على: **http://localhost:3000**

### 3. إيقاف المشروع

```bash
# إيقاف الحاويات فقط
docker compose down

# إيقاف الحاويات + حذف قاعدة البيانات (البيانات تُمسح!)
docker compose down -v
```

---

## 🔍 شرح كل ملف

### `server.js` — قلب التطبيق

```
Express App
    │
    ├── GET  /      → جلب كل المستخدمين من DB وعرضهم
    └── POST /add   → إضافة مستخدم جديد ثم إعادة التوجيه
```

يتصل التطبيق بـ PostgreSQL عبر مكتبة `postgres`. لاحظ هذا السطر المهم:

```js
host: process.env.NODE_ENV === "production" ? "db" : "localhost"
```

- في **Docker**: اسم الخدمة `db` هو الـ hostname (شبكة Docker الداخلية).
- في **التطوير المحلي**: يتصل بـ `localhost` مباشرة.

---

### `Dockerfile` — وصفة بناء صورة التطبيق

```dockerfile
FROM node:24-alpine        # صورة أساسية خفيفة الوزن

WORKDIR /app               # مجلد العمل داخل الحاوية

COPY package*.json ./      # نسخ ملفات التبعية أولاً (استفادة من cache)

ENV NODE_ENV=production    # تحديد بيئة الإنتاج

RUN npm ci --only=production  # تثبيت تبعيات الإنتاج فقط (أسرع وأصغر)

COPY . .                   # نسخ باقي الكود

EXPOSE 3000                # إخبار Docker بأن التطبيق يعمل على هذا المنفذ

CMD ["npm", "start"]       # الأمر الذي يُشغَّل عند إطلاق الحاوية
```

> **💡 لماذا نسخ `package*.json` أولاً؟**
> Docker يبني كل خطوة (Layer) ويخزّنها في الـ cache. إذا لم يتغير `package.json`، يتخطى Docker خطوة `npm ci` ويوفر وقت البناء.

---

### `docker-compose.yml` — تنسيق تشغيل الخدمات

يُشغّل خدمتين معاً:

| الخدمة | الصورة | الدور |
|--------|--------|-------|
| `db` | `postgres:17-alpine` | قاعدة البيانات |
| `app` | مبنية من `Dockerfile` | خادم Node.js |

**نقاط مهمة:**

```yaml
depends_on:
  - db
```
يضمن أن حاوية `app` لا تبدأ إلا بعد بدء `db` (لكن لا يضمن جاهزية DB، فقط بدء تشغيلها).

```yaml
volumes:
  - data:/var/lib/postgresql/data   # حفظ بيانات DB خارج الحاوية
  - ./init.sql:/docker-entrypoint-initdb.d/init.sql  # تهيئة DB تلقائياً
```

- **Volume `data`**: يحفظ البيانات حتى بعد حذف الحاوية.
- **`init.sql`**: PostgreSQL ينفذ أي `.sql` داخل مجلد `docker-entrypoint-initdb.d` تلقائياً عند **أول تشغيل فقط**.

```yaml
networks:
  - my_network
```
كلا الخدمتين على نفس الشبكة الداخلية، مما يسمح لـ `app` بالوصول لـ `db` باسمها.

---

### `init.sql` — إعداد قاعدة البيانات

```sql
CREATE TABLE IF NOT EXISTS users (
    id   SERIAL PRIMARY KEY,
    name TEXT NOT NULL
);
```

يُنفَّذ تلقائياً عند **أول** تشغيل للحاوية، ولا يُعاد تنفيذه إذا كانت البيانات موجودة مسبقاً.

---

### `.env` و `.env.example` — متغيرات البيئة

- **`.env`**: يحتوي القيم الحقيقية (كلمات مرور، أسماء). **لا يُرفع لـ Git أبداً.**
- **`.env.example`**: نموذج فارغ يُرفع لـ Git ليعرف المطورون الآخرون ما المطلوب.

---

### `ci.yml` — سكريبت CI/CD على GitHub Actions

يُشغَّل تلقائياً عند كل `push` أو `pull request` على فرع `main`.

```
trigger: push/PR → main
         │
         ├── 1. سحب الكود (checkout)
         ├── 2. إعداد Node.js وتثبيت المكتبات (للتحقق)
         ├── 3. تسجيل الدخول إلى GitHub Container Registry
         ├── 4. استخراج معلومات Tag (latest + SHA)
         └── 5. بناء صورة Docker ورفعها (push فقط عند push مباشر)
```

الصورة تُرفع إلى `ghcr.io` (GitHub Container Registry) بتاغين:
- `latest` — دائماً آخر نسخة من الـ main branch
- `sha-xxxxxxx` — مرتبط بـ commit hash للتتبع الدقيق

---

## 🔄 تدفق البيانات

```
المتصفح
   │
   │  HTTP GET /
   ▼
Express (server.js)
   │
   │  SELECT * FROM users
   ▼
PostgreSQL (db container)
   │
   │  [قائمة المستخدمين]
   ▼
Express → HTML Response
   │
   ▼
المتصفح يعرض الصفحة
```

---

## 🧠 ما تعلمته من هذا المشروع

| المفهوم | ما طبّقته |
|---------|-----------|
| **Dockerfile** | بناء صورة Node.js خفيفة بـ Alpine |
| **Docker Compose** | تشغيل تطبيق متعدد الخدمات |
| **Docker Networks** | تواصل الحاويات بالاسم |
| **Docker Volumes** | حفظ بيانات DB بشكل دائم |
| **Environment Variables** | فصل الإعدادات عن الكود |
| **CI/CD** | أتمتة البناء والنشر بـ GitHub Actions |
| **Container Registry** | رفع الصور إلى GHCR |

---

## 📌 أوامر Docker مفيدة

```bash
# عرض الحاويات الشغّالة
docker ps

# عرض logs التطبيق
docker compose logs app

# الدخول إلى قاعدة البيانات مباشرة
docker compose exec db psql -U <DB_USER> -d <DB_NAME>

# إعادة بناء الصورة بعد تعديل الكود
docker compose up --build

# حذف كل شيء (حاويات + volumes + شبكات)
docker compose down -v --remove-orphans
```
