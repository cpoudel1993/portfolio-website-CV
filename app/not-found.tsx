import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-black px-4 text-center">
      {/* Glowing 404 + PAGE NOT FOUND stack */}
      <div className="relative flex flex-col items-center justify-center">
        <h1 className="select-none text-[28vw] font-extrabold leading-none tracking-tighter text-transparent sm:text-[20vw] md:text-[16rem]"
          style={{
            WebkitTextStroke: '2px #ff1f6b',
            textShadow:
              '0 0 12px rgba(255,31,107,0.7), 0 0 32px rgba(124,58,237,0.5)',
          }}
        >
          404
        </h1>

        <h2
          className="absolute whitespace-nowrap text-[7vw] font-bold uppercase tracking-[0.25em] text-white sm:text-4xl md:text-5xl"
          style={{
            textShadow:
              '0 0 8px rgba(255,255,255,0.6), 0 0 24px rgba(255,31,107,0.5)',
          }}
        >
          Page Not Found
        </h2>
      </div>

      {/* Homepage button */}
      <Link
        href="/"
        className="mt-10 inline-block rounded-sm border-2 px-10 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-white transition-colors duration-300 hover:bg-[#ff1f6b]/10"
        style={{
          borderColor: '#ff1f6b',
          boxShadow:
            '0 0 10px rgba(255,31,107,0.6), inset 0 0 10px rgba(255,31,107,0.3)',
          textShadow: '0 0 8px rgba(255,31,107,0.7)',
        }}
      >
        Homepage
      </Link>
    </main>
  )
}
