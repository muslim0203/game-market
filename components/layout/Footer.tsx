import Link from "next/link";
import Image from "next/image";
import { Mail, MapPin, MessageCircle } from "lucide-react";

const SITE_LOGO = "/links/DigitalHub.jpg";

export default function Footer() {
  return (
    <footer className="glass mt-auto border-x-0 border-b-0 border-t border-white/20">
      <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Logo va qisqa tavsif */}
          <div className="space-y-3">
            <Link href="/" className="inline-block transition-opacity hover:opacity-90">
              <Image
                src={SITE_LOGO}
                alt="DigitalHub"
                width={220}
                height={64}
                className="h-14 w-auto object-contain object-left sm:h-16"
                unoptimized
              />
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Premium obuna akkauntlari — ChatGPT, Canva, Adobe, Microsoft va boshqalar. To‘lovdan keyin avtomatik yetkazib berish.
            </p>
          </div>

          {/* Do‘kon */}
          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-foreground">
              Do‘kon
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/products" className="text-muted-foreground transition-colors hover:text-foreground">
                  Mahsulotlar
                </Link>
              </li>
              <li>
                <Link href="/order" className="text-muted-foreground transition-colors hover:text-foreground">
                  Buyurtmani tekshirish
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-muted-foreground transition-colors hover:text-foreground">
                  Biz haqimizda
                </Link>
              </li>
            </ul>
          </div>

          {/* Aloqa */}
          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-foreground">
              Aloqa
            </h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 transition-colors hover:text-foreground"
                >
                  <MessageCircle className="h-4 w-4 shrink-0" />
                  Aloqa sahifasi
                </Link>
              </li>
              <li>
                <a
                  href="mailto:support@digitalhub.uz"
                  className="inline-flex items-center gap-2 transition-colors hover:text-foreground"
                >
                  <Mail className="h-4 w-4 shrink-0" />
                  support@digitalhub.uz
                </a>
              </li>
              <li className="inline-flex items-center gap-2">
                <MapPin className="h-4 w-4 shrink-0" />
                Toshkent, O‘zbekiston
              </li>
            </ul>
          </div>

          {/* Biz haqimizda */}
          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-foreground">
              Biz haqimizda
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              DigitalHub — premium obuna va litsenziyalarni xavfsiz va tez yetkazib beruvchi platforma. Har bir buyurtma shifrlangan holda qayta ishlanadi.
            </p>
            <Link
              href="/about"
              className="mt-3 inline-block text-sm font-medium text-primary hover:text-primary/90"
            >
              Batafsil →
            </Link>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-2 border-t border-border pt-6 text-sm text-muted-foreground sm:flex-row">
          <p>© {new Date().getFullYear()} DigitalHub. Barcha huquqlar himoyalangan.</p>
          <p>To‘lovdan keyin avtomatik yetkazib berish • Shifrlangan ma’lumotlar</p>
        </div>
      </div>
    </footer>
  );
}
