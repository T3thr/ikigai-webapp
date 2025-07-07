'use client';

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
    const { setTheme, theme } = useTheme();

    return (
        <button
            className="bg-container text-foreground hover:bg-secondary/80 flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 dark:border-neutral-700"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            aria-label="สลับธีม"
        >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">สลับธีม</span>
        </button>
    );
} 