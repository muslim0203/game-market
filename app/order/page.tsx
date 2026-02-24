import OrderLookupForm from "@/components/products/OrderLookupForm";

export default function OrderLookupPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-center text-3xl font-semibold">Track Your Order</h1>
      <p className="text-center text-sm text-slate-400">Enter your order ID to view payment and delivery status.</p>
      <OrderLookupForm />
    </div>
  );
}
