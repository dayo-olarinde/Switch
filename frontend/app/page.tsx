"use client";

import { BoardPreview } from "@/components/landing/BoardPreview";
import { Features } from "@/components/landing/Features";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useMe } from "@/hooks/useAuth";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-base";

export default function MarketingPage() {
  const { data: user, isLoading } = useMe();

  const primaryHref = user ? "/dashboard" : "/register";
  const primaryLabel = user ? "Open dashboard" : "Start for free";

  return (
    <div className="landing min-h-screen font-sans">
      <header className="sticky top-0 z-50 border-b border-border bg-base/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center gap-4 px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <Image
              src="/logo.svg"
              alt="Switch"
              width={28}
              height={28}
              priority
            />
            <span className="text-base font-semibold tracking-tight text-fg">
              Switch
            </span>
          </Link>

          <nav className="ml-6 hidden items-center gap-6 md:flex">
            <a
              href="#features"
              className="text-sm font-medium text-fg-secondary transition-colors duration-150 hover:text-fg"
            >
              Features
            </a>
            <a
              href="#board"
              className="text-sm font-medium text-fg-secondary transition-colors duration-150 hover:text-fg"
            >
              The board
            </a>
          </nav>

          <div className="ml-auto flex items-center gap-2">
            <ThemeToggle />

            {isLoading ? (
              <div className="h-10 w-28 animate-pulse rounded-sm bg-fill-2" />
            ) : user ? (
              <Link
                href="/dashboard"
                className={`inline-flex h-10 items-center gap-1.5 rounded-sm bg-accent-solid px-4 text-sm font-semibold text-on-accent transition-colors duration-150 hover:bg-accent-solid/90 ${FOCUS_RING}`}
              >
                Dashboard
                <ArrowRight size={14} />
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className={`hidden h-10 items-center rounded-sm px-3 text-sm font-medium text-fg-secondary transition-colors duration-150 hover:text-fg sm:inline-flex ${FOCUS_RING}`}
                >
                  Sign in
                </Link>
                <Link
                  href="/register"
                  className={`inline-flex h-10 items-center gap-1.5 rounded-sm bg-accent-solid px-4 text-sm font-semibold text-on-accent transition-colors duration-150 hover:bg-accent-solid/90 ${FOCUS_RING}`}
                >
                  Get started
                  <ArrowRight size={14} />
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden">
          <div className="landing-grid pointer-events-none absolute inset-0" />

          <div className="relative mx-auto w-full max-w-6xl px-6 pt-20 pb-16 sm:pt-28">
            <div className="mx-auto max-w-2xl text-center">
              <h1 className="landing-text-balance text-4xl font-semibold tracking-tight text-fg sm:text-5xl lg:text-6xl">
                Kanban, without the clutter.
              </h1>

              <p className="landing-text-pretty mx-auto mt-5 max-w-xl text-base leading-relaxed text-fg-secondary sm:text-lg">
                A deliberately small project management tool for developers who
                would rather ship than administrate. One board, live presence,
                and nothing you did not ask for.
              </p>

              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Link
                  href={primaryHref}
                  className={`group inline-flex h-11 w-full items-center justify-center gap-2 rounded-sm bg-accent-solid px-6 text-sm font-semibold text-on-accent transition-colors duration-150 hover:bg-accent-solid/90 sm:w-auto ${FOCUS_RING}`}
                >
                  {primaryLabel}
                  <ArrowRight
                    size={15}
                    className="transition-transform duration-200 group-hover:translate-x-0.5"
                  />
                </Link>

                {!user && !isLoading && (
                  <Link
                    href="/login"
                    className={`inline-flex h-11 w-full items-center justify-center rounded-sm border border-border-md bg-fill-1 px-6 text-sm font-semibold text-fg transition-colors duration-150 hover:border-border-lg hover:bg-fill-2 sm:w-auto ${FOCUS_RING}`}
                  >
                    Sign in to workspace
                  </Link>
                )}
              </div>

              <p className="mt-4 text-xs font-medium text-fg-muted">
                Free while in beta · No credit card
              </p>
            </div>

            <div id="board" className="mt-16 sm:mt-20">
              <BoardPreview />
            </div>
          </div>
        </section>

        <Features />
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-3 px-6 py-8 sm:flex-row">
          <div className="flex items-center gap-2.5">
            <Image src="/logo.svg" alt="" width={20} height={20} />
            <span className="text-sm font-semibold text-fg">Switch</span>
          </div>

          <p className="text-xs font-medium text-fg-muted">
            Designed with simplicity in mind · Switch © 2026
          </p>
        </div>
      </footer>
    </div>
  );
}
