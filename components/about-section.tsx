import Image from "next/image"
import { Award, HardHat, Coffee, Factory } from "lucide-react"

const highlights = [
  {
    icon: Factory,
    title: "Food Processing",
    description:
      "Full-time NZ employment experience handling edible internal products at Silver Fern Farms under strict food safety and hygiene standards.",
  },
  {
    icon: HardHat,
    title: "Civil Engineering",
    description:
      "Diploma in Civil Engineering with hands-on experience in surveying, drafting, quality control, and site supervision on road and bridge projects.",
  },
  {
    icon: Coffee,
    title: "Barista",
    description:
      "Advanced barista certification with expertise in beverage preparation, customer service, cash handling, and coffee shop management.",
  },
  {
    icon: Award,
    title: "Continuous Learner",
    description:
      "Certified in AutoCAD, Revit, SketchUp, Full-Stack Web Development, Front-End Development, and Digital Marketing through LinkedIn Learning.",
  },
]

export function AboutSection() {
  return (
    <section id="about" className="px-4 py-20 lg:py-28">
      <div className="mx-auto max-w-6xl">
        {/* Section Header */}
        <div className="mb-14 text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-primary">
            About
          </p>
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl text-balance">
            About Chiranjivi Poudel
          </h2>
          <div className="mx-auto h-1 w-12 rounded-full bg-primary" />
        </div>

        <div className="flex flex-col items-center gap-12 lg:flex-row lg:gap-16">
          {/* Image */}
          <div className="relative flex-shrink-0">
            <div className="relative h-64 w-64 overflow-hidden rounded-2xl border border-border shadow-lg sm:h-72 sm:w-72">
              <Image
                src="/images/chiranjivi-casual.png"
                alt="Chiranjivi Poudel - Casual portrait"
                fill
                className="object-cover object-top"
                sizes="(max-width: 640px) 256px, 288px"
              />
            </div>
          </div>

          {/* Text Content */}
          <div className="flex-1">
            <p className="mb-4 text-base leading-relaxed text-muted-foreground">
              I am a reliable and hardworking professional currently based in Hamilton,
              Waikato, New Zealand. With full-time employment experience in the New Zealand
              meat processing industry, I bring a strong understanding of food safety, hygiene,
              and health and safety standards.
            </p>
            <p className="mb-6 text-base leading-relaxed text-muted-foreground">
              My background spans civil engineering, topographic and construction surveying,
              architectural drafting, and site supervision across multiple projects in Nepal.
              I am committed to long-term, dependable contribution across production,
              construction, or customer-focused roles. I hold a Diploma in Civil Engineering
              and am eligible to work full-time in New Zealand.
            </p>
          </div>
        </div>

        {/* Highlight Cards */}
        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {highlights.map((item) => (
            <div
              key={item.title}
              className="group rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/30 hover:shadow-md"
            >
              <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <item.icon className="h-5 w-5" />
              </div>
              <h3 className="mb-2 text-sm font-semibold text-foreground">{item.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
