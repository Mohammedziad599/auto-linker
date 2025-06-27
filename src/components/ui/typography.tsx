export function TypographyInlineCode({ children }: { children: React.ReactNode }) {
  return (
    <code className="bg-muted relative rounded px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
      {children}
    </code>
  )
}

export function TypographyMuted({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-muted-foreground text-sm">{children}</p>
  )
}

export function TypographyP({ children }: { children: React.ReactNode }) {
  return (
    <p className="leading-7 text-xs">
      {children}
    </p>
  )
}
