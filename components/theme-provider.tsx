"use client"

import type * as React from "react"
import { useState, useEffect, createContext, useContext } from "react"

type Theme = "light" | "dark" | "system"

interface ThemeContextProps {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextProps>({
  theme: "system",
  setTheme: () => {},
})

interface ThemeProviderProps extends React.PropsWithChildren {
  attribute?: string
  defaultTheme?: Theme
  enableSystem?: boolean
  disableTransitionOnChange?: boolean
}

export function ThemeProvider({
  attribute = "class",
  defaultTheme = "system",
  enableSystem = true,
  disableTransitionOnChange = false,
  children,
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(defaultTheme)

  useEffect(() => {
    const root = window.document.documentElement

    function updateTheme(theme: Theme) {
      if (!theme) return

      const isSystem = theme === "system"
      const nextTheme = isSystem ? getSystemTheme() : theme

      if (nextTheme === "dark") {
        root.classList.add("dark")
      } else {
        root.classList.remove("dark")
      }

      root.setAttribute(attribute, nextTheme)
    }

    function getSystemTheme(): Theme {
      return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
    }

    updateTheme(theme)

    if (enableSystem) {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
      const handleChange = () => updateTheme(theme)
      mediaQuery.addEventListener("change", handleChange)
      return () => mediaQuery.removeEventListener("change", handleChange)
    }
  }, [attribute, enableSystem, theme])

  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  return useContext(ThemeContext)
}
