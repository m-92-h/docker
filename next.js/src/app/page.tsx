import sql, { Message } from "@/lib/db";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const messages = await sql<Message[]>`
    SELECT id, content, created_at FROM messages ORDER BY created_at DESC
  `;

  async function createMessage(formData: FormData) {
    "use server";
    const content = formData.get("content") as string;
    if (!content) return;
    await sql`INSERT INTO messages (content) VALUES (${content})`;
    revalidatePath("/");
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col items-center justify-start px-4 py-16 font-mono">

      {/* Background grid pattern */}
      <div
        className="fixed inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Header */}
      <header className="w-full max-w-2xl mb-12 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-md bg-emerald-400 flex items-center justify-center">
            <span className="text-zinc-950 text-xs font-black">M</span>
          </div>
          <div>
            <p className="text-[10px] text-zinc-500 uppercase tracking-[0.2em]">
              MEENA Project
            </p>
            <h1 className="text-sm font-bold text-zinc-100 leading-none">
              Database Console
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[10px] text-zinc-500 uppercase tracking-widest">
            Connected
          </span>
        </div>
      </header>

      {/* Main card */}
      <div className="w-full max-w-2xl space-y-6 relative z-10">

        {/* Input Section */}
        <section className="border border-zinc-800 rounded-xl bg-zinc-900/60 backdrop-blur-sm overflow-hidden">
          <div className="px-5 py-3 border-b border-zinc-800 flex items-center gap-2">
            <span className="text-emerald-400 text-xs">▸</span>
            <span className="text-[11px] text-zinc-400 uppercase tracking-widest">
              New Record
            </span>
          </div>
          <div className="p-5">
            <form action={createMessage} className="flex gap-3">
              <input
                type="text"
                name="content"
                placeholder="Enter message to store..."
                className="flex-1 bg-zinc-950 border border-zinc-700 rounded-lg px-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30 transition-all duration-200"
                required
              />
              <button
                type="submit"
                className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-zinc-950 text-sm font-bold rounded-lg transition-all duration-150 whitespace-nowrap"
              >
                Insert →
              </button>
            </form>
          </div>
        </section>

        {/* Records Section */}
        <section className="border border-zinc-800 rounded-xl bg-zinc-900/60 backdrop-blur-sm overflow-hidden">
          <div className="px-5 py-3 border-b border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-emerald-400 text-xs">▸</span>
              <span className="text-[11px] text-zinc-400 uppercase tracking-widest">
                Records
              </span>
            </div>
            <span className="text-[11px] text-zinc-600 font-mono tabular-nums">
              {messages.length} row{messages.length !== 1 ? "s" : ""}
            </span>
          </div>

          {/* Table header */}
          <div className="grid grid-cols-[1fr_auto] px-5 py-2 border-b border-zinc-800/60 bg-zinc-950/40">
            <span className="text-[10px] text-zinc-600 uppercase tracking-widest">
              content
            </span>
            <span className="text-[10px] text-zinc-600 uppercase tracking-widest">
              created_at
            </span>
          </div>

          {/* Rows */}
          <div className="divide-y divide-zinc-800/50">
            {messages.length === 0 ? (
              <div className="px-5 py-10 text-center">
                <p className="text-zinc-700 text-xs uppercase tracking-widest">
                  — No records found —
                </p>
              </div>
            ) : (
              messages.map((msg, i) => (
                <div
                  key={msg.id}
                  className="grid grid-cols-[1fr_auto] items-center px-5 py-3.5 hover:bg-zinc-800/30 transition-colors duration-100 group"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] text-zinc-700 tabular-nums w-5 shrink-0">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <p className="text-sm text-zinc-200 group-hover:text-white transition-colors">
                      {msg.content}
                    </p>
                  </div>
                  <time className="text-[11px] text-zinc-600 tabular-nums shrink-0 pl-6">
                    {new Date(msg.created_at).toLocaleString("en-US", {
                      month: "short",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </time>
                </div>
              ))
            )}
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="mt-12 text-[10px] text-zinc-700 uppercase tracking-widest">
        MEENA · PostgreSQL · Next.js
      </footer>
    </main>
  );
}