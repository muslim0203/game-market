const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const newProducts = [
  { name: 'ChatGPT Plus 1 oy', slug: 'chatgpt-plus-1-oy', price: 69000, originalPrice: 250000, duration: '1 oy', category: 'AI', logo: '/links/ChatGPT-Logo.png', description: 'ChatGPT Plus 1 oylik premium obuna, arzon narx, xavfsiz aktivatsiya, 24/7 xizmat. Buyurtma berish.' },
  { name: 'ChatGPT Pro 1 oy', slug: 'chatgpt-pro-1-oy', price: 200000, originalPrice: 2500000, duration: '1 oy', category: 'AI', logo: '/links/ChatGPT-Logo.png', description: 'ChatGPT Pro — sun’iy intellektdan maksimal darajada foydalanish uchun yaratilgan premium tarif bo‘lib, u Plus va Go tariflariga qaraganda ancha kuchli imkoniyatlar va yuqori limitlarni taqdim etadi. Bu tarif professional foydalanuvchilar, dasturchilar, tadqiqotchilar va kontent yaratuvchilar uchun mo‘ljallangan. 🚀\n\nAsosiy afzalliklari\n\n1. Eng kuchli AI modellari\nPro foydalanuvchilari eng yangi va eng kuchli sun’iy intellekt modellaridan foydalanish imkoniyatiga ega. Bu murakkab savollar, chuqur tahlil, ilmiy izlanish va dasturlash vazifalarini yanada aniq bajarishga yordam beradi.\n\n2. Juda yuqori yoki deyarli cheksiz limitlar\nPro tarifida xabar yuborish, fayl yuklash va boshqa funksiyalar bo‘yicha limitlar juda yuqori bo‘ladi. Bu uzoq ishlash yoki katta loyihalarda qulaylik yaratadi.\n\n3. Eng tez ishlash tezligi\nServerlarda ustuvorlik berilgani sababli Pro foydalanuvchilari javoblarni tezroq oladi va yuklama yuqori bo‘lgan paytda ham barqaror ishlashdan foydalanadi.\n\n4. Kengaytirilgan tadqiqot imkoniyatlari\nPro tarifida murakkab ma’lumotlarni tahlil qilish, katta hujjatlar bilan ishlash va chuqur tadqiqot olib borish uchun kuchli vositalar mavjud.\n\n5. Rasm va video yaratish imkoniyatlari\nPro foydalanuvchilari sun’iy intellekt orqali rasm va video yaratishda kengroq imkoniyatlar hamda yuqori limitlardan foydalanishi mumkin.\n\n6. Professional ishlar uchun mos\nBu tarif katta loyihalar, biznes, kontent ishlab chiqarish, dasturlash va ilmiy ishlar uchun ideal hisoblanadi.' },
  { name: 'ChatGPT Plus 1 yil', slug: 'chatgpt-plus-1-yil', price: 420000, originalPrice: 1200000, duration: '1 yil', category: 'AI', logo: '/links/ChatGPT-Logo.png', description: 'ChatGPT Plus 1 yillik premium obuna, arzon narx, xavfsiz aktivatsiya, 24/7 xizmat. Hoziroq faollashtirish.' },
  { name: 'ChatGPT Go 1 yil', slug: 'chatgpt-go-1-yil', price: 200000, originalPrice: 500000, duration: '1 yil', category: 'AI', logo: '/links/ChatGPT-Logo.png', description: 'ChatGPT Go 1 yillik premium obuna, arzon narx, xavfsiz aktivatsiya, 24/7 xizmat. Buyurtma berish.' },
  
  { name: 'CapCut Pro 1 oy', slug: 'capcut-pro-1-oy', price: 45000, originalPrice: 99000, duration: '1 oy', category: 'Video', logo: '/links/Capcut.jpg', description: 'CapCut Pro 1 oylik premium obuna, arzon narx, xavfsiz aktivatsiya, 24/7 xizmat. Buyurtma berish.' },
  { name: 'CapCut Pro 6 oy', slug: 'capcut-pro-6-oy', price: 169000, originalPrice: 594000, duration: '6 oy', category: 'Video', logo: '/links/Capcut.jpg', description: 'CapCut Pro 6 oylik premium obuna, arzon narx, xavfsiz aktivatsiya, 24/7 xizmat. Buyurtma berish.' },
  { name: 'CapCut Pro 1 yil', slug: 'capcut-pro-1-yil', price: 300000, originalPrice: 1188000, duration: '1 yil', category: 'Video', logo: '/links/Capcut.jpg', description: 'CapCut Pro 1 yillik premium obuna, arzon narx, xavfsiz aktivatsiya, 24/7 xizmat. Hoziroq faollashtirish.' },
  
  { name: 'Gemini Pro 1 oy', slug: 'gemini-pro-1-oy', price: 45000, originalPrice: 150000, duration: '1 oy', category: 'AI', logo: '/links/Gemini%20Ultra.jpg', description: 'Gemini Pro 1 oylik premium obuna, arzon narx, xavfsiz aktivatsiya, 24/7 xizmat. Buyurtma berish.' },
  { name: 'Gemini Pro 3 oy', slug: 'gemini-pro-3-oy', price: 149000, originalPrice: 450000, duration: '3 oy', category: 'AI', logo: '/links/Gemini%20Ultra.jpg', description: 'Gemini Pro 3 oylik premium obuna, arzon narx, xavfsiz aktivatsiya, 24/7 xizmat. Buyurtma berish.' },
  { name: 'Gemini Pro 1 yil', slug: 'gemini-pro-1-yil', price: 299000, originalPrice: 1800000, duration: '1 yil', category: 'AI', logo: '/links/Gemini%20Ultra.jpg', description: 'Gemini Pro 1 yillik premium obuna, arzon narx, xavfsiz aktivatsiya, 24/7 xizmat. Hoziroq faollashtirish.' },

  { name: 'Adobe Creative Cloud 1 oy', slug: 'adobe-creative-cloud-1-oy', price: 45000, originalPrice: 150000, duration: '1 oy', category: 'Dizayn', logo: '/links/Adobe.jpg', description: 'Adobe Creative Cloud 1 oylik premium obuna, arzon narx, xavfsiz aktivatsiya, 24/7 xizmat. Buyurtma berish.' },
  { name: 'Adobe Creative Cloud 3 oy', slug: 'adobe-creative-cloud-3-oy', price: 199000, originalPrice: 450000, duration: '3 oy', category: 'Dizayn', logo: '/links/Adobe.jpg', description: 'Adobe Creative Cloud 3 oylik premium obuna, arzon narx, xavfsiz aktivatsiya, 24/7 xizmat. Buyurtma berish.' },
  { name: 'Adobe Creative Cloud 4 oy', slug: 'adobe-creative-cloud-4-oy', price: 240000, originalPrice: 520000, duration: '4 oy', category: 'Dizayn', logo: '/links/Adobe.jpg', description: 'Adobe Creative Cloud 4 oylik premium obuna, arzon narx, xavfsiz aktivatsiya, 24/7 xizmat. Hoziroq faollashtirish.' },

  { name: 'Canva Pro 1 oy', slug: 'canva-pro-1-oy', price: 45000, originalPrice: 130000, duration: '1 oy', category: 'Dizayn', logo: '/links/Canva.jpeg', description: 'Canva Pro 1 oylik premium obuna, arzon narx, xavfsiz aktivatsiya, 24/7 xizmat. Buyurtma berish.' },
  { name: 'Canva Pro 1 yil', slug: 'canva-pro-1-yil', price: 100000, originalPrice: 1500000, duration: '1 yil', category: 'Dizayn', logo: '/links/Canva.jpeg', description: 'Canva Pro 1 yillik premium obuna, arzon narx, xavfsiz aktivatsiya, 24/7 xizmat. Buyurtma berish.' }
];

async function updateDB() {
  for (const p of newProducts) {
    p.currency = 'UZS';
    p.isActive = true;
    p.stock = 10;
    
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: p,
      create: p
    });
  }
  
  // optionally deactivate deprecated ones like gemini-ultra-1-oy if needed, but not specified.
  console.log('Done updating DB');
}

updateDB().catch(console.error).finally(() => prisma.$disconnect());
