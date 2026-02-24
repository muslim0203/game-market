import OrderLookupForm from "@/components/products/OrderLookupForm";

export default function OrderLookupPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-center text-3xl font-semibold text-foreground">Buyurtmani tekshirish</h1>
      <p className="text-center text-sm text-muted-foreground">Buyurtma ID ni kiriting — to‘lov va yetkazish holatini ko‘ring.</p>
      <OrderLookupForm />
    </div>
  );
}
