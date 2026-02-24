import Link from "next/link";

import Button from "@/components/ui/Button";

export const metadata = {
  title: "Biz haqimizda | DigitalHub",
  description: "DigitalHub — premium obuna akkauntlari va litsenziyalar do‘koni haqida"
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Biz haqimizda</h1>
        <p className="mt-2 text-muted-foreground">DigitalHub jamoasi va xizmatlarimiz haqida</p>
      </div>

      <section className="glass-card space-y-4 p-6">
        <h2 className="text-xl font-semibold text-foreground">DigitalHub nima?</h2>
        <p className="leading-relaxed text-foreground/90">
          DigitalHub — premium obuna akkauntlari va litsenziyalarni xavfsiz va tez yetkazib beruvchi platforma. 
          Biz ChatGPT Plus, Canva Pro, Adobe Creative Cloud, Microsoft 365, N8N, Freepik va boshqa mashhur xizmatlarning 
          rasmiy narxdan arzonroq shaxsiy obunalarini taklif qilamiz.
        </p>
      </section>

      <section className="glass-card space-y-4 p-6">
        <h2 className="text-xl font-semibold text-foreground">Nima uchun biz?</h2>
        <ul className="list-inside list-disc space-y-2 text-foreground/90">
          <li>To‘lovdan keyin akkaunt yoki kalit darhol yetkaziladi</li>
          <li>Barcha ma’lumotlar shifrlangan holda saqlanadi</li>
          <li>Click, Payme va xalqaro to‘lov tizimlari qo‘llab-quvvatlanadi</li>
          <li>24/7 xarid qilish va buyurtmani tekshirish imkoniyati</li>
        </ul>
      </section>

      <section className="glass-card space-y-4 p-6">
        <h2 className="text-xl font-semibold text-foreground">Qanday ishlaymiz?</h2>
        <p className="leading-relaxed text-foreground/90">
          Siz mahsulotni tanlaysiz, to‘lovni amalga oshirasiz. To‘lov tasdiqlangach tizim avtomatik ravishda 
          sizga akkaunt ma’lumotlarini yoki litsenziya kalitini yetkazib beradi. Buyurtma holatini har doim 
          buyurtma ID orqali kuzatishingiz mumkin.
        </p>
      </section>

      <div className="flex flex-wrap gap-3">
        <Link href="/products">
          <Button>Mahsulotlarni ko‘rish</Button>
        </Link>
        <Link href="/contact">
          <Button variant="outline">Aloqa</Button>
        </Link>
      </div>
    </div>
  );
}
