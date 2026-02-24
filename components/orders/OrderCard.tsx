import Badge from "@/components/ui/Badge";
import { toMoney } from "@/lib/utils";

type OrderCardProps = {
  order: {
    id: string;
    amount: number | string;
    status: string;
    listing: {
      title: string;
      game: string;
    };
    seller: {
      username: string;
    };
    buyer: {
      username: string;
    };
    createdAt: Date;
  };
  asBuyer?: boolean;
};

export default function OrderCard({ order, asBuyer = true }: OrderCardProps) {
  return (
    <article className="rounded-2xl border border-slate-800 bg-slate-900/50 p-4">
      <div className="mb-3 flex items-start justify-between gap-2">
        <div>
          <h3 className="font-semibold text-slate-100">{order.listing.title}</h3>
          <p className="text-sm text-slate-400">{order.listing.game}</p>
        </div>
        <Badge tone={order.status === "COMPLETED" ? "success" : order.status === "DISPUTED" ? "warning" : "info"}>{order.status}</Badge>
      </div>

      <div className="grid gap-1 text-sm text-slate-300">
        <p>{asBuyer ? `Seller: @${order.seller.username}` : `Buyer: @${order.buyer.username}`}</p>
        <p>Amount: {toMoney(order.amount)}</p>
        <p>{new Date(order.createdAt).toLocaleString()}</p>
      </div>
    </article>
  );
}
