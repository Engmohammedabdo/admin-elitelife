# Elite Life Medical Centre - Admin Panel

لوحة تحكم لإدارة مركز إيليت لايف الطبي في دبي.

## 🛠️ التقنيات

- **Framework:** Next.js 16+
- **Styling:** Tailwind CSS
- **Database:** Supabase (PostgreSQL)
- **Language:** TypeScript
- **UI Components:** shadcn/ui
- **Icons:** Lucide React

## 📱 الصفحات

| الصفحة | المسار | الوصف |
|--------|--------|-------|
| لوحة التحكم | `/` | إحصائيات سريعة وروابط |
| الأقسام | `/departments` | إدارة أقسام المركز |
| الأطباء | `/doctors` | إدارة الأطباء والتخصصات |
| الخدمات | `/services` | إدارة الخدمات الطبية |
| الجدول | `/schedule` | جدول مواعيد الأطباء |
| الإعدادات | `/settings` | إعدادات المركز |
| المعاينة | `/preview` | معاينة بيانات AI Agent |

## 🚀 التشغيل المحلي

```bash
# تثبيت المكتبات
npm install

# إنشاء ملف البيئة
cp .env.example .env.local

# تعديل متغيرات البيئة
# NEXT_PUBLIC_SUPABASE_URL=your_url
# NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key

# تشغيل السيرفر
npm run dev
```

## 🐳 Coolify Deployment

### Environment Variables

أضف هذه المتغيرات في Coolify:

```
NEXT_PUBLIC_SUPABASE_URL=https://elitelifedb.pyramedia.cloud
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

### Build Settings (Dockerfile)

- **Build Pack:** Dockerfile
- **Port:** 3000

### أو باستخدام Nixpacks:

- **Build Pack:** Nixpacks
- **Build Command:** `npm run build`
- **Start Command:** `npm start`
- **Port:** 3000

## 🗄️ Database Schema

الجداول المطلوبة في Supabase:

- `departments` - الأقسام
- `doctors` - الأطباء
- `services` - الخدمات
- `doctor_services` - ربط الأطباء بالخدمات
- `doctor_schedules` - جدول المواعيد
- `config` - الإعدادات

## 🎨 الألوان

```css
--primary: #722F37 (Maroon)
--secondary: #C5A572 (Gold)
--success: #10B981
--danger: #EF4444
```

## 📝 الميزات

- ✅ واجهة عربية RTL
- ✅ توليد تلقائي للأكواد
- ✅ دعم Dubai timezone
- ✅ علاقة N:N بين الأطباء والخدمات
- ✅ تقويم شهري لإدارة المواعيد
- ✅ Toast notifications
- ✅ Confirmation dialogs
- ✅ Responsive design

## 📄 License

MIT
