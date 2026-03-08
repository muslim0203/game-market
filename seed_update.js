const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const newProducts = [
  { name: 'ChatGPT Plus 1 oy', slug: 'chatgpt-plus-1-oy', price: 69000, originalPrice: 250000, duration: '1 oy', category: 'AI', logo: '/links/ChatGPT-Logo.png', description: `ChatGPT Plus — OpenAI tomonidan yaratilgan premium obuna bo'lib, kundalik vazifalarni, dasturlash va matn yaratish jarayonlarini tezlashtirish uchun mo'ljallangan. 💡

Asosiy afzalliklari:
1. GPT-4 va eng yangi modellar: Oddiy xizmatlardan ko'ra ancha aqlli va aniq javoblar.
2. Tezkor javob vaqti: Tarmoq yuklamasi yuqori bo'lgan paytlarda ham barqaror va tezkor ulanish.
3. DALL-E 3 bilan rasm yaratish: O'z g'oyalaringiz asosida bir necha soniya ichida yuqori sifatli vizuallar yarating.
4. Kengaytirilgan ma'lumotlar tahlili: Eksellar, hujjatlar va katta hajmdagi PDF fayllarni tahlil qiling.
5. Plaginlar va xizmatlar qo'llab-quvvatlashi: Internetsite-larni qidirish va maxsus sun'iy intellekt vositalaridan foydalanish imkoniyati.` },
  { name: 'ChatGPT Pro 1 oy', slug: 'chatgpt-pro-1-oy', price: 200000, originalPrice: 2500000, duration: '1 oy', category: 'AI', logo: '/links/ChatGPT-Logo.png', description: 'ChatGPT Pro — sun’iy intellektdan maksimal darajada foydalanish uchun yaratilgan premium tarif bo‘lib, u Plus va Go tariflariga qaraganda ancha kuchli imkoniyatlar va yuqori limitlarni taqdim etadi. Bu tarif professional foydalanuvchilar, dasturchilar, tadqiqotchilar va kontent yaratuvchilar uchun mo‘ljallangan. 🚀\n\nAsosiy afzalliklari\n\n1. Eng kuchli AI modellari\nPro foydalanuvchilari eng yangi va eng kuchli sun’iy intellekt modellaridan foydalanish imkoniyatiga ega. Bu murakkab savollar, chuqur tahlil, ilmiy izlanish va dasturlash vazifalarini yanada aniq bajarishga yordam beradi.\n\n2. Juda yuqori yoki deyarli cheksiz limitlar\nPro tarifida xabar yuborish, fayl yuklash va boshqa funksiyalar bo‘yicha limitlar juda yuqori bo‘ladi. Bu uzoq ishlash yoki katta loyihalarda qulaylik yaratadi.\n\n3. Eng tez ishlash tezligi\nServerlarda ustuvorlik berilgani sababli Pro foydalanuvchilari javoblarni tezroq oladi va yuklama yuqori bo‘lgan paytda ham barqaror ishlashdan foydalanadi.\n\n4. Kengaytirilgan tadqiqot imkoniyatlari\nPro tarifida murakkab ma’lumotlarni tahlil qilish, katta hujjatlar bilan ishlash va chuqur tadqiqot olib borish uchun kuchli vositalar mavjud.\n\n5. Rasm va video yaratish imkoniyatlari\nPro foydalanuvchilari sun’iy intellekt orqali rasm va video yaratishda kengroq imkoniyatlar hamda yuqori limitlardan foydalanishi mumkin.\n\n6. Professional ishlar uchun mos\nBu tarif katta loyihalar, biznes, kontent ishlab chiqarish, dasturlash va ilmiy ishlar uchun ideal hisoblanadi.' },
  { name: 'ChatGPT Plus 1 yil', slug: 'chatgpt-plus-1-yil', price: 420000, originalPrice: 1200000, duration: '1 yil', category: 'AI', logo: '/links/ChatGPT-Logo.png', description: `ChatGPT Plus — OpenAI tomonidan yaratilgan premium obuna bo'lib, kundalik vazifalarni, dasturlash va matn yaratish jarayonlarini tezlashtirish uchun mo'ljallangan. 💡

Asosiy afzalliklari:
1. GPT-4 va eng yangi modellar: Oddiy xizmatlardan ko'ra ancha aqlli va aniq javoblar.
2. Tezkor javob vaqti: Tarmoq yuklamasi yuqori bo'lgan paytlarda ham barqaror va tezkor ulanish.
3. DALL-E 3 bilan rasm yaratish: O'z g'oyalaringiz asosida bir necha soniya ichida yuqori sifatli vizuallar yarating.
4. Kengaytirilgan ma'lumotlar tahlili: Eksellar, hujjatlar va katta hajmdagi PDF fayllarni tahlil qiling.
5. Plaginlar va xizmatlar qo'llab-quvvatlashi: Internetsite-larni qidirish va maxsus sun'iy intellekt vositalaridan foydalanish imkoniyati.` },
  { name: 'ChatGPT Go 1 yil', slug: 'chatgpt-go-1-yil', price: 200000, originalPrice: 500000, duration: '1 yil', category: 'AI', logo: '/links/ChatGPT-Logo.png', description: `ChatGPT Go — kundalik savollar, matn tahrirlash va g'oyalar yaratish uchun mo'ljallangan qulay premium xizmat. Ushbu ta'rif orqali ChatGPT'ning ilg'or imkoniyatlaridan tejamkor tarzda foydalanasiz. 🚀

Asosiy afzalliklari:
1. Barqaror ulanish: Bepul versiyaga qaraganda har doim ustuvor kirish huquqi va qotmasdan ishlash.
2. Ishonchli yordamchi: Matnlarni tarjima qilish, maqolalar yozish va ijtimoiy tarmoqlar uchun postlar tayyorlashda yordam.
3. Arzon va uzoq muddatli: Boshqa ta'riflarga qaraganda ham hamyonbop, ham uzoq muddatli barqaror foydalanish.
4. Tezkor yechimlar: Har qanday vazifangizni yengillashtirish uchun kundalik ideal assistent.` },
  
  { name: 'CapCut Pro 1 oy', slug: 'capcut-pro-1-oy', price: 45000, originalPrice: 99000, duration: '1 oy', category: 'Video', logo: '/links/Capcut.jpg', description: `CapCut Pro — professional darajadagi video tahrirlash uchun eng zo'r vosita bo'lib, kreativ g'oyalaringizni hayotga tatbiq etish imkonini beradi. Ushbu premium tarif orqali barcha cheklovlardan xalos bo'lasiz va ijodingizni yangi bosqichga olib chiqasiz. 🎬

Asosiy afzalliklari:
1. Premium shablonlar va effektlar: Minglab noyob video effektlar, tranzishenlar va shablonlar.
2. Yuqori sifatli eksport: Videolaringizni 4K va 60 FPS formatlarida suv belgisisiz (watermark) saqlab oling.
3. Kengaytirilgan audio asboblar: Ovozni tozalash, shovqinni kamaytirish va minglab musiqalar kutubxonasiga kirish.
4. Sun'iy intellekt (AI) funksiyalari: Avtomatik subtitrlar, fonni olib tashlash va kadrlarni oson birlashtirish.
5. Muammosiz ishlash tezligi: Videolarni tezroq render qilish imkoniyati.` },
  { name: 'CapCut Pro 6 oy', slug: 'capcut-pro-6-oy', price: 169000, originalPrice: 594000, duration: '6 oy', category: 'Video', logo: '/links/Capcut.jpg', description: `CapCut Pro — professional darajadagi video tahrirlash uchun eng zo'r vosita bo'lib, kreativ g'oyalaringizni hayotga tatbiq etish imkonini beradi. Ushbu premium tarif orqali barcha cheklovlardan xalos bo'lasiz va ijodingizni yangi bosqichga olib chiqasiz. 🎬

Asosiy afzalliklari:
1. Premium shablonlar va effektlar: Minglab noyob video effektlar, tranzishenlar va shablonlar.
2. Yuqori sifatli eksport: Videolaringizni 4K va 60 FPS formatlarida suv belgisisiz (watermark) saqlab oling.
3. Kengaytirilgan audio asboblar: Ovozni tozalash, shovqinni kamaytirish va minglab musiqalar kutubxonasiga kirish.
4. Sun'iy intellekt (AI) funksiyalari: Avtomatik subtitrlar, fonni olib tashlash va kadrlarni oson birlashtirish.
5. Muammosiz ishlash tezligi: Videolarni tezroq render qilish imkoniyati.` },
  { name: 'CapCut Pro 1 yil', slug: 'capcut-pro-1-yil', price: 300000, originalPrice: 1188000, duration: '1 yil', category: 'Video', logo: '/links/Capcut.jpg', description: `CapCut Pro — professional darajadagi video tahrirlash uchun eng zo'r vosita bo'lib, kreativ g'oyalaringizni hayotga tatbiq etish imkonini beradi. Ushbu premium tarif orqali barcha cheklovlardan xalos bo'lasiz va ijodingizni yangi bosqichga olib chiqasiz. 🎬

Asosiy afzalliklari:
1. Premium shablonlar va effektlar: Minglab noyob video effektlar, tranzishenlar va shablonlar.
2. Yuqori sifatli eksport: Videolaringizni 4K va 60 FPS formatlarida suv belgisisiz (watermark) saqlab oling.
3. Kengaytirilgan audio asboblar: Ovozni tozalash, shovqinni kamaytirish va minglab musiqalar kutubxonasiga kirish.
4. Sun'iy intellekt (AI) funksiyalari: Avtomatik subtitrlar, fonni olib tashlash va kadrlarni oson birlashtirish.
5. Muammosiz ishlash tezligi: Videolarni tezroq render qilish imkoniyati.` },
  
  { name: 'Gemini Pro 1 oy', slug: 'gemini-pro-1-oy', price: 45000, originalPrice: 150000, duration: '1 oy', category: 'AI', logo: '/links/Gemini%20Ultra.jpg', description: `Gemini Pro — Google tomonidan taqdim etilgan eng ilg'or va aqlli sun'iy intellekt xizmati bo'lib, murakkab masalalarni yechish va chuqur tahliliy ishlarni bajarish uchun mo'ljallangan. 🧠

Asosiy afzalliklari:
1. Google'ning kuchli modeli: Aniqroq, mantiqiy va tasavvurga boy keng qamrovli javoblar.
2. Real vaqt ma'lumotlari: Google qidiruv tizimlariga to'g'ridan to'g'ri ulangan holda real vaqtdagi ma'lumotlarni tahlil qilish imkoniyati.
3. Dasturlashda kuchli assistent: Kod yozish, xatolarni topish va refaktoring kabi vazifalarda professional yordamchi.
4. Kuchli integratsiya: Google ekotizimi bilan muammosiz ishlash imkoniyati yaratilgan.
5. Multimodal yondashuv: Matn, video va rasmlarni osonlikcha tahlil qilish.` },
  { name: 'Gemini Pro 3 oy', slug: 'gemini-pro-3-oy', price: 149000, originalPrice: 450000, duration: '3 oy', category: 'AI', logo: '/links/Gemini%20Ultra.jpg', description: `Gemini Pro — Google tomonidan taqdim etilgan eng ilg'or va aqlli sun'iy intellekt xizmati bo'lib, murakkab masalalarni yechish va chuqur tahliliy ishlarni bajarish uchun mo'ljallangan. 🧠

Asosiy afzalliklari:
1. Google'ning kuchli modeli: Aniqroq, mantiqiy va tasavvurga boy keng qamrovli javoblar.
2. Real vaqt ma'lumotlari: Google qidiruv tizimlariga to'g'ridan to'g'ri ulangan holda real vaqtdagi ma'lumotlarni tahlil qilish imkoniyati.
3. Dasturlashda kuchli assistent: Kod yozish, xatolarni topish va refaktoring kabi vazifalarda professional yordamchi.
4. Kuchli integratsiya: Google ekotizimi bilan muammosiz ishlash imkoniyati yaratilgan.
5. Multimodal yondashuv: Matn, video va rasmlarni osonlikcha tahlil qilish.` },
  { name: 'Gemini Pro 1 yil', slug: 'gemini-pro-1-yil', price: 299000, originalPrice: 1800000, duration: '1 yil', category: 'AI', logo: '/links/Gemini%20Ultra.jpg', description: `Gemini Pro — Google tomonidan taqdim etilgan eng ilg'or va aqlli sun'iy intellekt xizmati bo'lib, murakkab masalalarni yechish va chuqur tahliliy ishlarni bajarish uchun mo'ljallangan. 🧠

Asosiy afzalliklari:
1. Google'ning kuchli modeli: Aniqroq, mantiqiy va tasavvurga boy keng qamrovli javoblar.
2. Real vaqt ma'lumotlari: Google qidiruv tizimlariga to'g'ridan to'g'ri ulangan holda real vaqtdagi ma'lumotlarni tahlil qilish imkoniyati.
3. Dasturlashda kuchli assistent: Kod yozish, xatolarni topish va refaktoring kabi vazifalarda professional yordamchi.
4. Kuchli integratsiya: Google ekotizimi bilan muammosiz ishlash imkoniyati yaratilgan.
5. Multimodal yondashuv: Matn, video va rasmlarni osonlikcha tahlil qilish.` },

  { name: 'Adobe Creative Cloud 1 oy', slug: 'adobe-creative-cloud-1-oy', price: 45000, originalPrice: 150000, duration: '1 oy', category: 'Dizayn', logo: '/links/Adobe.jpg', description: `Adobe Creative Cloud — barcha ijodkorlar, dizaynerlar va video montajchilar uchun to'liq professional dasturlar majmuasi. Sizning dizayn va kreativ g'oyalaringizni hayotga jozibali tasvirlar orqali olib chiqadi. 🎨

Asosiy afzalliklari:
1. 20 dan ortiq dasturlar majmuasi: Photoshop, Illustrator, Premiere Pro, After Effects va boshqalar bitta obuna ichida.
2. AI funksiyalari (Adobe Firefly): Generativ to'ldirish (Generative Fill) orqali rasmlarni va dizaynlarni avtomatik o'zgartirish va kengaytirish.
3. Bulutli hamkorlik: Loyihalaringizni istalgan qurilmada ochish va boshqalar bilan qulay ulashish uchun keng joy.
4. Boy kutubxona: Adobe Fonts, yuqori sifatli cho'tkalar (brushes) va tayyor template'lar.
5. Maksimal sifat: Istalgan platforma uchun professional va eng yuqori sifatdagi vizual kontent yaratish imkoniyati.` },
  { name: 'Adobe Creative Cloud 3 oy', slug: 'adobe-creative-cloud-3-oy', price: 199000, originalPrice: 450000, duration: '3 oy', category: 'Dizayn', logo: '/links/Adobe.jpg', description: `Adobe Creative Cloud — barcha ijodkorlar, dizaynerlar va video montajchilar uchun to'liq professional dasturlar majmuasi. Sizning dizayn va kreativ g'oyalaringizni hayotga jozibali tasvirlar orqali olib chiqadi. 🎨

Asosiy afzalliklari:
1. 20 dan ortiq dasturlar majmuasi: Photoshop, Illustrator, Premiere Pro, After Effects va boshqalar bitta obuna ichida.
2. AI funksiyalari (Adobe Firefly): Generativ to'ldirish (Generative Fill) orqali rasmlarni va dizaynlarni avtomatik o'zgartirish va kengaytirish.
3. Bulutli hamkorlik: Loyihalaringizni istalgan qurilmada ochish va boshqalar bilan qulay ulashish uchun keng joy.
4. Boy kutubxona: Adobe Fonts, yuqori sifatli cho'tkalar (brushes) va tayyor template'lar.
5. Maksimal sifat: Istalgan platforma uchun professional va eng yuqori sifatdagi vizual kontent yaratish imkoniyati.` },
  { name: 'Adobe Creative Cloud 4 oy', slug: 'adobe-creative-cloud-4-oy', price: 240000, originalPrice: 520000, duration: '4 oy', category: 'Dizayn', logo: '/links/Adobe.jpg', description: `Adobe Creative Cloud — barcha ijodkorlar, dizaynerlar va video montajchilar uchun to'liq professional dasturlar majmuasi. Sizning dizayn va kreativ g'oyalaringizni hayotga jozibali tasvirlar orqali olib chiqadi. 🎨

Asosiy afzalliklari:
1. 20 dan ortiq dasturlar majmuasi: Photoshop, Illustrator, Premiere Pro, After Effects va boshqalar bitta obuna ichida.
2. AI funksiyalari (Adobe Firefly): Generativ to'ldirish (Generative Fill) orqali rasmlarni va dizaynlarni avtomatik o'zgartirish va kengaytirish.
3. Bulutli hamkorlik: Loyihalaringizni istalgan qurilmada ochish va boshqalar bilan qulay ulashish uchun keng joy.
4. Boy kutubxona: Adobe Fonts, yuqori sifatli cho'tkalar (brushes) va tayyor template'lar.
5. Maksimal sifat: Istalgan platforma uchun professional va eng yuqori sifatdagi vizual kontent yaratish imkoniyati.` },

  { name: 'Canva Pro 1 oy', slug: 'canva-pro-1-oy', price: 45000, originalPrice: 130000, duration: '1 oy', category: 'Dizayn', logo: '/links/Canva.jpeg', description: `Canva Pro — jozibador grafik dizayn asarlarini professional bilimsiz ham osongina yaratish imkonini beruvchi onlayn platformaning pullik versiyasi. ✨

Asosiy afzalliklari:
1. Cheksiz premium resurslar: 100 milliondan ortiq sifatli rasmlar, videolar, grafik elementlarga to'liq va ochiq kirish.
2. Fonni tezkor o'chirish (Background Remover): Bitta bosish orqali barcha rasmlardagi orqa fonni mukammal tozalash va almashtirish.
3. Magic Resize funksiyasi: Tayyor dizaynlarni osongina turli platformalar hajmiga moslashtirish.
4. O'z brend kitobingiz (Brand Kit): Kompaniya rangi, logotipi va shriftlarini kiritib, barqaror uslubni saqlash.
5. AI orqali yordam (Magic Studio): Sun'iy intellekt orqali elementlar va matnlarni soniyalar ichida professional yaratish.` },
  { name: 'Canva Pro 1 yil', slug: 'canva-pro-1-yil', price: 100000, originalPrice: 1500000, duration: '1 yil', category: 'Dizayn', logo: '/links/Canva.jpeg', description: `Canva Pro — jozibador grafik dizayn asarlarini professional bilimsiz ham osongina yaratish imkonini beruvchi onlayn platformaning pullik versiyasi. ✨

Asosiy afzalliklari:
1. Cheksiz premium resurslar: 100 milliondan ortiq sifatli rasmlar, videolar, grafik elementlarga to'liq va ochiq kirish.
2. Fonni tezkor o'chirish (Background Remover): Bitta bosish orqali barcha rasmlardagi orqa fonni mukammal tozalash va almashtirish.
3. Magic Resize funksiyasi: Tayyor dizaynlarni osongina turli platformalar hajmiga moslashtirish.
4. O'z brend kitobingiz (Brand Kit): Kompaniya rangi, logotipi va shriftlarini kiritib, barqaror uslubni saqlash.
5. AI orqali yordam (Magic Studio): Sun'iy intellekt orqali elementlar va matnlarni soniyalar ichida professional yaratish.` }
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
