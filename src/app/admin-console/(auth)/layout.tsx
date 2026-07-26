import { ShieldCheck } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#F7F7FA] flex flex-col items-center justify-center p-4">
      <div className="mb-8 flex flex-col items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#7C3AED]">
          <ShieldCheck className="h-7 w-7 text-white" />
        </div>
        <div className="text-center">
          <h1 className="text-xl font-semibold text-[#17171B]">Qaliye Console</h1>
          <p className="text-sm text-[#666672]">Admin Operations</p>
        </div>
      </div>
      {children}
    </div>
  );
}
