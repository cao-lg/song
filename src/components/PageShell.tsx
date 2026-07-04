// 页面外壳 - 统一最大宽度、内边距、装饰背景、底部版权
import { cn } from "@/lib/utils";
import { Decorations } from "./Decorations";

interface PageShellProps {
  children: React.ReactNode;
  className?: string;
  decorationVariant?: "default" | "minimal";
  showFooter?: boolean;
}

export function PageShell({
  children,
  className,
  decorationVariant = "default",
  showFooter = true,
}: PageShellProps) {
  return (
    <div className="relative min-h-screen flex flex-col">
      <Decorations variant={decorationVariant} />
      <main
        className={cn(
          "relative z-10 flex-1 w-full max-w-[480px] mx-auto px-4 pt-4 pb-6 flex flex-col",
          className,
        )}
      >
        {children}
      </main>
      {showFooter && <Footer />}
    </div>
  );
}

function Footer() {
  return (
    <footer className="relative z-10 px-4 py-3 text-center">
      <p className="font-gothic text-[10px] text-white/50 tracking-wider">
        Preview provided courtesy of Apple Music
      </p>
    </footer>
  );
}
