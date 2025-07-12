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
            <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 flex h-12 w-12 items-center justify-center rounded-full border border-gray-200 dark:border-gray-600 shadow-lg transition-all duration-200">
                <div className="h-5 w-5 animate-pulse bg-gray-300 dark:bg-gray-600 rounded" />
            </div>
        );
    }

    return (
        <button
            className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 flex h-12 w-12 items-center justify-center rounded-full border border-gray-200 dark:border-gray-600 shadow-lg transition-all duration-200 hover:shadow-xl hover:scale-105 active:scale-95"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            aria-label="สลับธีม"
        >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all duration-300 dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all duration-300 dark:rotate-0 dark:scale-100" />
            <span className="sr-only">สลับธีม</span>
        </button>
    );
}