import Link from "next/link"

export function AdminFooter() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-border bg-card/50 px-4 py-4 md:px-6 lg:px-8">
      <div className="flex flex-col items-center justify-between gap-2 text-xs text-muted-foreground sm:flex-row">
        <p>
          Built by{" "}
          <Link
            href="https://www.chiranjivipoudel.com.np"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-foreground hover:text-primary transition-colors"
          >
            Chiranjivi Poudel
          </Link>
        </p>
        <p>{`\u00A9 ${currentYear} All rights reserved.`}</p>
      </div>
    </footer>
  )
}
