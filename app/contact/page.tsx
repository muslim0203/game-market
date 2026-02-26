import Link from "next/link";
import { Mail, MapPin, MessageCircle, Clock } from "lucide-react";

import Button from "@/components/ui/Button";

export const metadata = {
  title: "Aloqa | ObunaPro",
  description: "ObunaPro bilan bog‘laning — savollar va buyurtmalar bo‘yicha qo‘llab-quvvatlash"
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Aloqa</h1>
        <p className="mt-2 text-muted-foreground">Savol yoki taklifingiz bo‘lsa, biz bilan bog‘laning</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <a
          href="mailto:support@obunapro.uz"
          className="glass-card flex gap-4 p-5 transition-all hover:-translate-y-0.5 hover:shadow-glass"
        >
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
            <Mail className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Email</h3>
            <p className="mt-1 text-sm text-muted-foreground">Savollar va buyurtmalar bo‘yicha</p>
            <p className="mt-2 text-primary">support@obunapro.uz</p>
          </div>
        </a>

        <a
          href="https://t.me/momiqcha_0"
          target="_blank"
          rel="noopener noreferrer"
          className="glass-card flex gap-4 p-5 transition-all hover:-translate-y-0.5 hover:shadow-glass"
        >
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
            <MessageCircle className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Qo‘llab-quvvatlash</h3>
            <p className="mt-1 text-sm text-muted-foreground">Buyurtma va to‘lov bo‘yicha yordam</p>
            <p className="mt-2 text-foreground/80">Telegram orqali ham javob beramiz — @momiqcha_0</p>
          </div>
        </a>

        <div className="glass-card flex gap-4 p-5 sm:col-span-2">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
            <MapPin className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Manzil</h3>
            <p className="mt-1 text-sm text-muted-foreground">O‘zbekiston</p>
            <p className="mt-2 text-foreground/80">Toshkent</p>
          </div>
        </div>

        <div className="glass-card flex gap-4 p-5 sm:col-span-2">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
            <Clock className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Ish vaqti</h3>
            <p className="mt-1 text-sm text-muted-foreground">Buyurtmalar va yetkazib berish</p>
            <p className="mt-2 text-foreground/80">24/7 — xarid qilish va avtomatik yetkazib berish doim ishlaydi</p>
          </div>
        </div>
      </div>

      <div className="glass-card rounded-2xl p-5 text-sm text-muted-foreground">
        <p className="font-medium text-foreground">Buyurtmani tekshirish</p>
        <p className="mt-1">
          Buyurtma ID orqali to‘lov va yetkazib berish holatini tekshirmoqchi bo‘lsangiz,{" "}
          <Link href="/order" className="text-primary hover:underline">
            Buyurtmani tekshirish
          </Link>{" "}
          sahifasidan foydalaning.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <Link href="/products">
          <Button>Mahsulotlar</Button>
        </Link>
        <Link href="/about">
          <Button variant="outline">Biz haqimizda</Button>
        </Link>
      </div>
    </div>
  );
}
