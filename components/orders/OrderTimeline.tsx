import { cn } from "@/lib/utils";

const steps = ["PENDING", "DELIVERED", "COMPLETED"];

export default function OrderTimeline({ status }: { status: string }) {
  const activeIndex = steps.findIndex((item) => item === status);

  return (
    <div className="flex flex-wrap items-center gap-3">
      {steps.map((step, index) => {
        const active = index <= activeIndex;
        return (
          <div key={step} className="flex items-center gap-3">
            <div
              className={cn(
                "flex h-9 min-w-9 items-center justify-center rounded-full border text-xs font-semibold",
                active ? "border-sky-400 bg-sky-500/20 text-sky-200" : "border-slate-700 bg-slate-900 text-slate-400"
              )}
            >
              {index + 1}
            </div>
            <span className={cn("text-xs", active ? "text-sky-200" : "text-slate-500")}>{step}</span>
          </div>
        );
      })}
    </div>
  );
}
