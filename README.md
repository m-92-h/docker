## General Information

> Upload without code and without comment
```
git commit --allow-empty --allow-empty-message -m ""
```

> To generate a secret code instantly
```
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

> Display the clean file tree for the project, excluding files such as (node_modules, .next, .git).
```
find . -not -path "*/node_modules/*" -not -path "*/.next/*" -not -path "*/.git/*" | sort
```
```
find . -not -path './node_modules/*' -not -path './.git/*' | sort
```
---

 ## All Docker commands 🐳

 
 > 📥 Images
 ```images
  docker pull nginx              # تحميل image من Docker Hub
  docker pull nginx:1.25         # تحميل إصدار محدد
  docker images                  # عرض كل الـ images
  docker images -a               # عرض كل الـ images بما فيها الوسيطة
  docker rmi nginx               # حذف image
  docker rmi $(docker images -q) # حذف كل الـ images
  docker image prune             # حذف الـ images غير المستخدمة
  docker tag myapp myapp:v1      # إعادة تسمية image
  docker push myapp:v1           # رفع image إلى Docker Hub
  docker search redis            # البحث عن image في Hub
 ```


 > 🔨 Build Images
 ```build
  docker build .                        # بناء image من الـ Dockerfile
  docker build -t myapp .               # بناء مع تسمية
  docker build -t myapp:v2 .            # بناء مع tag محدد
  docker build -f Dockerfile.prod .     # بناء من ملف محدد
  docker build --no-cache .             # بناء بدون cache
  docker build --build-arg ENV=prod .   # تمرير متغير أثناء البناء
 ```


 > 🚀 Run — Containers
 ```run-containers
  docker run nginx                      # تشغيل container
  docker run -d nginx                   # تشغيل في الخلفية
  docker run -it ubuntu bash            # تشغيل مع terminal تفاعلي
  docker run -p 8080:80 nginx           # ربط port المضيف بالـ container
  docker run --name myapp nginx         # تسمية الـ container
  docker run -e DB_PASS=secret nginx    # تمرير متغير بيئة
  docker run --env-file .env nginx      # تحميل متغيرات من ملف .env
  docker run -v /data:/app/data nginx   # ربط مجلد
  docker run --rm nginx                 # حذف تلقائي بعد الإيقاف
  docker run --restart always nginx     # إعادة تشغيل تلقائي دائم
  docker run --memory=512m nginx        # تحديد الذاكرة القصوى
  docker run --cpus=1 nginx             # تحديد عدد الـ CPU
 ```

 
 > 📋 Manage — Containers
 ```
  docker ps                        # عرض الـ containers الشغالة
  docker ps -a                     # عرض كل الـ containers
  docker stop myapp                # إيقاف container
  docker start myapp               # تشغيل container متوقف
  docker restart myapp             # إعادة تشغيل container
  docker rm myapp                  # حذف container
  docker rm -f myapp               # حذف container شغال بالقوة
  docker rm $(docker ps -aq)       # حذف كل الـ containers المتوقفة
  docker rename oldname newname    # إعادة تسمية container
  docker container prune           # حذف كل المتوقفة دفعة واحدة
  docker pause myapp               # تجميد container مؤقتاً
  docker unpause myapp             # استئناف container مجمد
 ```

 
 > 🔍 Inspect — مراقبة وتشخيص
 ```
  docker logs myapp              # عرض السجلات
  docker logs -f myapp           # متابعة السجلات لحظياً
  docker logs --tail 50 myapp    # عرض آخر 50 سطر
  docker inspect myapp           # كل تفاصيل الـ container
  docker stats                   # مراقبة استهلاك الموارد لحظياً
  docker stats myapp             # مراقبة container محدد
  docker top myapp               # عرض العمليات داخل container
  docker port myapp              # عرض الـ ports المربوطة
  docker diff myapp              # الملفات التي تغيرت
  docker events                  # مراقبة أحداث Docker لحظياً
 ```

 
 > ⚡ Exec — الدخول والتنفيذ 
 ```
  docker exec -it myapp bash           # الدخول للـ container بـ bash
  docker exec -it myapp sh             # الدخول بـ sh (للـ Alpine)
  docker exec myapp ls /app            # تنفيذ أمر بدون دخول
  docker cp myapp:/app/file.txt .      # نسخ ملف من container للجهاز
  docker cp file.txt myapp:/app/       # نسخ ملف من الجهاز للـ container
 ```

 
 > 💾 Volumes 
 ```
  docker volume create mydata         # إنشاء volume جديد
  docker volume ls                    # عرض كل الـ volumes
  docker volume inspect mydata        # تفاصيل volume
  docker volume rm mydata             # حذف volume
  docker volume prune                 # حذف الـ volumes غير المستخدمة
  docker run -v mydata:/app/data nginx # استخدام volume في container
 ```

 
 > 🌐 Network
 ```
  docker network create mynet             # إنشاء شبكة جديدة
  docker network ls                       # عرض كل الشبكات
  docker network inspect mynet            # تفاصيل الشبكة
  docker network rm mynet                 # حذف شبكة
  docker network prune                    # حذف الشبكات غير المستخدمة
  docker run --network mynet nginx        # تشغيل container في شبكة
  docker network connect mynet myapp      # ربط container بشبكة
  docker network disconnect mynet myapp   # فصل container من شبكة
 ```


 > 📦 Docker Compose
 ```
  docker compose up              # تشغيل كل الـ services
  docker compose up -d           # تشغيل في الخلفية
  docker compose up --build      # بناء وتشغيل
  docker compose down            # إيقاف وحذف كل شيء
  docker compose down -v         # إيقاف + حذف الـ volumes
  docker compose ps              # حالة الـ services
  docker compose logs -f         # متابعة السجلات
  docker compose logs app        # سجلات service محددة
  docker compose restart app     # إعادة تشغيل service محددة
  docker compose exec app bash   # الدخول لـ service
  docker compose build           # بناء الـ images فقط
  docker compose pull            # تحديث الـ images
  docker compose stop            # إيقاف بدون حذف
  docker compose start           # تشغيل services متوقفة
  docker compose config          # التحقق من صحة الملف
 ```

 
 > 🛠️ System 
 ```
  docker system df             # عرض استهلاك المساحة
  docker system prune          # حذف كل غير المستخدم
  docker system prune -a       # حذف شامل بما فيها الـ images
  docker system info           # معلومات شاملة عن Docker
  docker version               # إصدار Docker
  docker info                  # إحصائيات النظام
  docker login                 # تسجيل دخول Docker Hub
  docker logout                # تسجيل خروج
  docker save myapp > out.tar  # تصدير image كملف
  docker load < out.tar        # استيراد image من ملف
  docker commit myapp myapp:v1 # حفظ حالة container كـ image جديدة
 ```
