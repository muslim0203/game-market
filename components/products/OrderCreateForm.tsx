"use client";

const TELEGRAM_USERNAME = "zarifjon0203";
const TELEGRAM_URL = `https://t.me/${TELEGRAM_USERNAME}`;

function buildTelegramMessage(productName: string, price: string, duration: string): string {
  return `Assalomu alaykum! "${productName}" mahsulotini sotib olmoqchiman.\nNarx: ${price}\nMuddat: ${duration}`;
}

type Props = {
  productId: string;
  productName: string;
  productPrice: number;
  productCurrency: string;
  productDuration: string;
  stock: number;
};

export default function OrderCreateForm({
  productName,
  productPrice,
  productCurrency,
  productDuration,
  stock
}: Props) {
  const priceFormatted = `${new Intl.NumberFormat("uz-UZ").format(productPrice)} ${productCurrency}`;
  const message = buildTelegramMessage(productName, priceFormatted, productDuration);
  const telegramLink = `${TELEGRAM_URL}?text=${encodeURIComponent(message)}`;

  return (
    <div className="space-y-3">
      <a
        href={telegramLink}
        target="_blank"
        rel="noopener noreferrer"
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#0088cc] px-4 py-3 text-center font-medium text-white shadow-lg transition hover:bg-[#0077b5] hover:shadow-xl"
      >
        <svg className="h-6 w-6 shrink-0" viewBox="0 0 24 24" fill="currentColor">
          <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
        </svg>
        Telegram orqali buyurtma berish
      </a>
      {stock <= 0 && (
        <p className="text-center text-sm text-muted-foreground">Hozircha mahsulot tugagan. Telegram orqali so‘rang.</p>
      )}
      <p className="text-center text-xs text-muted-foreground">
        @{TELEGRAM_USERNAME} — buyurtma va to‘lov bo‘yicha operatorimiz
      </p>
    </div>
  );
}
