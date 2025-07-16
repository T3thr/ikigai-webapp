'use client';

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle() {
    const [mounted, setMounted] = useState(false);
    const { setTheme, theme } = useTheme();

    // Prevent hydration mismatch
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <div className="bg-background text-foreground hover:bg-container flex h-12 w-12 items-center justify-center rounded-full border border-secondary shadow-lg transition-all duration-200">
                <div className="h-5 w-5 animate-pulse bg-secondary rounded" />
            </div>
        );
    }

    return (
        <button
            className="bg-background text-foreground hover:bg-container flex h-12 w-12 items-center justify-center rounded-full border border-secondary shadow-lg transition-all duration-200 hover:shadow-xl hover:scale-105 active:scale-95"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            aria-label="สลับธีม"
        >
            {theme === 'light' ? (
                <Sun className="h-5 w-5 text-foreground" />
            ) : (
                <Moon className="h-5 w-5 text-foreground" />
            )}
            <span className="sr-only">สลับธีม</span>
        </button>
    );
}