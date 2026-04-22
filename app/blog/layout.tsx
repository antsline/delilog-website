import { BlogHeader } from "@/app/components/blog/BlogHeader";
import { BlogFooter } from "@/app/components/blog/BlogFooter";

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-primary/20 flex flex-col">
      <BlogHeader />
      <main className="flex-1">{children}</main>
      <BlogFooter />
    </div>
  );
}
