'use client';

import ScienceCanvas from '@/components/ScienceCanvas';

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <header className="border-b bg-white dark:bg-zinc-900 px-6 py-4">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
          Science Art Creator
        </h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Interactive scientific diagram builder — Iteration 1 Foundation
        </p>
      </header>
      <main className="flex justify-center py-8">
        <ScienceCanvas />
      </main>
    </div>
  );
}
