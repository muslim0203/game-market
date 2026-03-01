import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Admin kirish (seed dan keyin shu ma'lumotlar bilan kiring)
const ADMIN_EMAIL = "admin@obunapro.uz";
const ADMIN_PASSWORD = "admin1234";

const products = [
  {
    name: "CapCut Pro 1 oy",
    slug: "capcut-pro-1-oy",
    description:
      "CapCut Pro 1 oylik premium obuna — arzon narx, xavfsiz aktivatsiya, 24/7 xizmat. Hoziroq faollashtirish.",
    logo: "/links/Capcut.jpg",
    category: "Video",
    price: 45_000,
    originalPrice: 99_000,
    currency: "UZS",
    duration: "1 oy",
    isActive: true,
    stock: 10
  },
  {
    name: "CapCut Pro 6 oy",
    slug: "capcut-pro-6-oy",
    description:
      "CapCut Pro 6 oylik premium obuna — arzon narx, xavfsiz aktivatsiya, 24/7 xizmat. Buyurtma berish.",
    logo: "/links/Capcut.jpg",
    category: "Video",
    price: 169_000,
    originalPrice: 594_000,
    currency: "UZS",
    duration: "6 oy",
    isActive: true,
    stock: 10
  },
  {
    name: "CapCut Pro 1 yil",
    slug: "capcut-pro-1-yil",
    description:
      "CapCut Pro 1 yillik premium obuna — arzon narx, xavfsiz aktivatsiya, 24/7 xizmat. Buyurtma berish.",
    logo: "/links/Capcut.jpg",
    category: "Video",
    price: 300_000,
    originalPrice: 1_188_000,
    currency: "UZS",
    duration: "1 yil",
    isActive: true,
    stock: 10
  },
  {
    name: "Canva Pro 1 yil",
    slug: "canva-pro-1-yil",
    description:
      "Canva Pro 1 yillik premium obuna — arzon narx, xavfsiz aktivatsiya, 24/7 xizmat. Buyurtma berish.",
    logo: "/links/Canva.jpeg",
    category: "Dizayn",
    price: 100_000,
    originalPrice: 1_500_000,
    currency: "UZS",
    duration: "1 yil",
    isActive: true,
    stock: 10
  },
  {
    name: "ChatGPT Plus 1 oy",
    slug: "chatgpt-plus-1-oy",
    description:
      "ChatGPT Plus 1 oylik premium obuna — arzon narx, xavfsiz aktivatsiya, 24/7 xizmat. Hoziroq faollashtirish.",
    logo: "/links/ChatGPT-Logo.png",
    category: "AI",
    price: 69_000,
    originalPrice: 250_000,
    currency: "UZS",
    duration: "1 oy",
    isActive: true,
    stock: 10
  },
  {
    name: "Gemini Ultra 1 oy",
    slug: "gemini-ultra-1-oy",
    description:
      "Google Gemini Pro 1 oylik premium obuna — arzon narx, xavfsiz aktivatsiya, 24/7 xizmat. Hoziroq faollashtirish.",
    logo: "/links/Gemini%20Ultra.jpg",
    category: "AI",
    price: 45_000,
    originalPrice: 375_000,
    currency: "UZS",
    duration: "1 oy",
    isActive: true,
    stock: 10
  },
  {
    name: "Adobe Creative Cloud 4 oy",
    slug: "adobe-creative-cloud-4-oy",
    description:
      "Adobe Creative Cloud 4 oylik premium obuna — arzon narx, xavfsiz aktivatsiya, 24/7 xizmat. Buyurtma berish.",
    logo: "/links/Adobe.jpg",
    category: "Dizayn",
    price: 240_000,
    originalPrice: 520_000,
    currency: "UZS",
    duration: "4 oy",
    isActive: true,
    stock: 10
  },
  {
    name: "Google One AI 1 oy",
    slug: "google-one-ai-1-oy",
    description:
      "Google One AI — Gemini Advanced, 2 TB saqlash, Google AI xususiyatlari. 1 oylik premium obuna, rasmiy narxdan arzon.",
    logo: "/links/Google%20one.jpg",
    category: "AI",
    price: 175_000,
    originalPrice: 250_000,
    currency: "UZS",
    duration: "1 oy",
    isActive: true,
    stock: 10
  },
  {
    name: "Microsoft 365 Personal 1 yil",
    slug: "microsoft-365-personal-1-yil",
    description:
      "Microsoft 365 Personal — shaxsiy hisob (Global). Word, Excel, PowerPoint, Outlook, OneDrive 1 TB, Teams. 1 yillik to'liq obuna, rasmiy narxdan arzon.",
    logo: "/links/Microsoft.jpg",
    category: "Ofis",
    price: 150_000,
    originalPrice: 450_000,
    currency: "UZS",
    duration: "1 yil",
    isActive: true,
    stock: 10
  },
  {
    name: "Windows 11 Pro N Key (Global)",
    slug: "windows-11-pro-n-key-global",
    description:
      "Windows 11 Pro N — rasmiy litsenziya kaliti (Global). Media Player siz versiya, bitta kompyuter uchun doimiy faollashtirish. Yetkazib berish: kalit matni.",
    logo: "/links/Windows.webp",
    category: "Tizim",
    price: 150_000,
    originalPrice: 350_000,
    currency: "UZS",
    duration: "Litsenziya",
    isActive: true,
    stock: 10
  },
  {
    name: "Freepik Premium 12 oy (Global)",
    slug: "freepik-premium-12-oy-global",
    description: `TAVSIFNI O'QIMASDAN MAHSULOTNI SOTIB OLMANG!

⚠️ MUHIM: Generativ AI yo'q — video yuklab olish yo'q — faqat rasm va vektor yuklab olish paneli.

12 oylik shaxsiy Freepik yuklab olish paneli. Tez | Xavfsiz | Avtomatik yetkazib berish.

Panel sun'iy intellekt yordamida rasm yoki video yaratishga ruxsat bermaydi. Siz faqat mavjud kontentni (rasm, vektor) yuklab olishingiz mumkin.

Bu akkauntni bo'lishish xizmati EMAS — faqat siz uchun yaratilgan shaxsiy, xavfsiz yuklab olish paneli.

Paket: 12 oy • Shaxsiy panel • Kunlik 20 ta fayl • Rasmlar va vektorlar • Darhol yetkazib berish • 24/7 xarid.

Foydalanish muddati aktivatsiya kodini panelga kiritganingizdan so'ng boshlanadi.`,
    logo: "/links/Freepik.webp",
    category: "Dizayn",
    price: 150_000,
    originalPrice: 380_000,
    currency: "UZS",
    duration: "12 oy",
    isActive: true,
    stock: 10
  },
  {
    name: "N8N Starter 1 yil (Shaxsiy akkaunt)",
    slug: "n8n-starter-1-yil-shaxsiy-akkaunt",
    description: `N8N Starter — ilovalarni o'zaro ulash, jarayonlarni avtomatlashtirish va maxsus integratsiyalar yaratish imkonini beruvchi kuchli workflow avtomatlashtirish platformasiga darhol kirish huquqiga ega bo'ling.

Dasturchilar, marketologlar, startaplar va vaqtni tejash hamda samarali kengayishni istagan jamoalar uchun ideal yechim.

Starter Tarif Rejasi Imkoniyatlari:

• Premium N8N Cloud funksiyalariga kirish
• 50 ta AI Workflow Builder krediti
• Avtomatik masshtablanuvchi xavfsiz bulutli hosting
• Real vaqt rejimida bajarilish loglari va batafsil analitika
• Hamkorlik vositalari va umumiy (shared) muhitlar
• Ustuvor qo'llab-quvvatlash va yangilanishlar

Muhim Eslatma (Foydalanish Shartlari):

Yillik obuna shaxsiy N8N akkauntingizda faollashtirilgandan so'ng, rasmiy interfeys orqali to'lov usulini o'zgartirishga yoki tarif rejasini yangilashga urinmang. Bunday harakatlar ularning ichki tizimlari tomonidan avtomatik bekor qilinishiga olib kelishi mumkin.

Foydalanuvchi tomonidan kiritilgan o'zgarishlar sababli yuzaga kelgan bekor qilinishlar uchun biz javobgar emasmiz. Muvaffaqiyatli faollashtirilgandan so'ng pul qaytarilmaydi.`,
    logo: "/links/n8n.png",
    category: "Avtomatlashtirish",
    price: 390_000,
    originalPrice: 550_000,
    currency: "UZS",
    duration: "1 yil",
    isActive: true,
    stock: 10
  },
  {
    name: "Grok SuperGrok 1 oy (Shaxsiy akkaunt, Global)",
    slug: "grok-supergrok-1-oy-shaxsiy-akkaunt-global",
    description: `1 oylik amal qiluvchi shaxsiy akkaunt orqali SuperGrok Premium xizmatiga to'liq kirish imkoniyatiga ega bo'ling. Ushbu akkaunt to'liq maxfiylik uchun parolni o'zgartirish imkonini beradi hamda GPT-4 kabi yuqori darajadagi til modellariga teng kuchli sun'iy intellekt funksiyalarini taqdim etadi.

Asosiy Imkoniyatlar:

• Har 2 soatda 100 ta so'rov yuborish imkoniyati
• 128 000 tokenli kontekst oynasi (uzun matnlar va chuqur tahlil uchun ideal)
• Dasturlash, matematika, fan, huquq va boshqa sohalarda ilg'or mantiqiy tahlil
• "Big Brain" rejimi: yuqori aniqlik va murakkab vazifalar uchun optimallashtirilgan
• "DeepSearch" funksiyasi: internet va X (sobiq Twitter) dan real vaqt ma'lumotlarini yig'ish
• Xarid qilingandan so'ng darhol yetkazib berish

Akkaunt Tafsilotlari:

• A'zolik turi: SuperGrok Premium
• Amal qilish muddati: 1 oy
• Shaxsiy akkaunt (parolni o'zgartirish mumkin)
• Akkaunt ulashish taqiqlanadi

Kimlar Uchun Mos:

• Talabalar va tadqiqotchilar
• Dasturchilar va texnik mutaxassislar
• Yozuvchilar, tahlilchilar va kontent yaratuvchilar
• Real vaqt ma'lumotlariga ega ishonchli sun'iy intellektga muhtoj bo'lgan har qanday foydalanuvchi`,
    logo: "/links/Grok.png",
    category: "AI",
    price: 150_000,
    originalPrice: 280_000,
    currency: "UZS",
    duration: "1 oy",
    isActive: true,
    stock: 10
  },
  {
    name: "Antigravity Pro 1 yil",
    slug: "antigravity-pro-1-yil",
    description: `🚀 ObunaPro — Dunyodagi eng kuchli AI endi sizning xizmatingizda!
Google-ning eng ilg'or texnologiyasi — Gemini Advanced va 2TB xotiraga ega bo'lish imkoniyatini boy bermang! ⚡️
📧 O'z emailingiz orqali faollashtirish (faqat email manzili kerak, parol so'ralmaydi)
👨‍👩‍👧‍👦 Guruhga qo'shilish: Email kelganidan so'ng, Gemini Pro-dan foydalanish uchun shunchaki "Oilaviy guruh"ga (Family group) qo'shilish tugmasini bosing.

✨ Nimalarga ega bo'lasiz?
🧠 Gemini Advanced: Murakkab vazifalar, tahlil va ijod uchun eng aqlli AI.
☁️ 2TB Google One: Rasmlar, videolar va fayllar uchun ulkan bulutli xotira.
🎬 Veo 3: Sun'iy intellekt yordamida professional videolar yarating.
🔗 Integratsiya: Gmail, Docs va Sheets ilovalarida bevosita AI yordamidan foydalaning.
💻 Dasturchilar uchun: Antigravity va CLI'da yuqori so'rov limitlari.

💎 Nega aynan ObunaPro?
✅ 12 oylik: Bir yil davomida uzluksiz xizmat.
✅ Xavfsiz faollashtirish: Parolingiz shart emas, faqat emailingiz orqali "Family Group"ga qo'shilasiz.
✅ Hamyonbop narx: Rasmiy narxdan bir necha barobar arzon va qulay.

⚠️ Muhim: Agar "boshqa davlat" muammosi chiqsa, shunchaki kartangizni profilingizdan yechib qo'ysangiz kifoya — xizmat dunyo bo'ylab ishlaydi! 🌍
📥 Hoziroq obuna bo'ling va ish unumdorligingizni yangi bosqichga olib chiqing!`,
    logo: "/links/Antigravity.png",
    category: "AI",
    price: 149_000,
    originalPrice: 375_000,
    currency: "UZS",
    duration: "1 yil",
    stock: 10
  },
  {
    name: "Cursor Pro (Tez kunda)",
    slug: "cursor-pro",
    description: `🚀 ObunaPro — Tez kunda Cursor Pro sizning xizmatingizda!
Dasturchilar uchun maxsus yaratilgan eng aqlli AI kod redaktori.

✨ Nimalarga ega bo'lasiz?
🧠 GPT-4, Claude 3.5 Sonnet va boshqa top modellarga tezkor access.
💻 Kod yozish, tahlil qilish, refaktoring va xatolarni to'g'rilashda AI yordami.
⚡️ Autocomplete va butun loyiha (codebase) bo'ylab kontekstual qidiruv.

⚠️ Hozircha ushbu obuna sotuvda emas, tez kunda platformamizga qo'shiladi! Yangiliklarni kuzatib boring.`,
    logo: "/links/Cursor.png",
    category: "AI",
    price: 0,
    originalPrice: 250_000,
    currency: "UZS",
    duration: "1 oy",
    isActive: true,
    stock: 0
  }
];

async function main() {
  const adminHash = await bcrypt.hash(ADMIN_PASSWORD, 12);
  await prisma.admin.upsert({
    where: { email: ADMIN_EMAIL },
    update: {},
    create: { email: ADMIN_EMAIL, password: adminHash }
  });
  console.log("Admin yaratildi. Login:", ADMIN_EMAIL, "| Parol:", ADMIN_PASSWORD);

  for (const p of products) {
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: {
        name: p.name,
        description: p.description,
        logo: p.logo,
        category: p.category,
        price: p.price,
        originalPrice: p.originalPrice,
        currency: p.currency,
        duration: p.duration,
        isActive: p.isActive,
        stock: p.stock
      },
      create: p
    });
  }
  console.log("Seed tamamlandi:", products.length, "ta mahsulot");
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
