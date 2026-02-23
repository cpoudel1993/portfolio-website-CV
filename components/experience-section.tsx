import { MapPin, Calendar } from "lucide-react"

const experiences = [
  {
    title: "Process Worker - Internal Products",
    company: "Silver Fern Farms Ltd.",
    location: "Te Aroha, Waikato, New Zealand",
    period: "Nov 2025 - Present",
    type: "Evening Shift",
    responsibilities: [
      "Process edible internal products (red offals) in a high-volume food manufacturing environment",
      "Follow strict food safety, hygiene, and health & safety procedures in line with NZ standards",
      "Maintain product quality through careful handling, trimming, and processing tasks",
      "Support team productivity by meeting shift targets and maintaining consistent workflow",
      "Demonstrate reliability, punctuality, and effectiveness in a physically demanding role",
    ],
    tags: ["Food Safety", "Quality Control", "Teamwork", "H&S Compliance"],
  },
  {
    title: "Barista",
    company: "Espresso Organic Coffee Pvt. Ltd.",
    location: "Thapagaun, Kathmandu, Nepal",
    period: "Apr 2024 - Sep 2025",
    type: "Full-time",
    responsibilities: [
      "Prepared specialty coffee beverages to company standards",
      "Managed day-to-day coffee shop operations",
      "Delivered excellent customer service and maintained cleanliness and hygiene",
      "Handled cash transactions and maintained brand presentation",
    ],
    tags: ["Beverage Preparation", "Customer Service", "Cash Handling"],
  },
  {
    title: "Sub-Engineer",
    company: "Pathibhara Construction and Engineering Pvt. Ltd.",
    location: "Biratchowk, Morang, Nepal",
    period: "May 2021 - Jun 2023",
    type: "Full-time",
    responsibilities: [
      "Performed civil drafting, surveying, and valuation tasks",
      "Supervised construction sites and ensured quality standards",
      "Managed project timelines and coordinated with teams",
    ],
    tags: ["Civil Drafting", "Surveying", "Site Supervision", "Valuation"],
  },
  {
    title: "Draft Person / Surveyor",
    company: "Engineerko Ghar Pvt. Ltd.",
    location: "Jadibuti-32, Kathmandu, Nepal",
    period: "Jan 2020 - Apr 2021",
    type: "Full-time",
    responsibilities: [
      "Conducted site visits, data collection, and detailed engineering surveys",
      "Operated GPS and level machines for road and irrigation projects",
      "Created drafts and reports using CAD 2D, Photoshop, and Microsoft Office",
    ],
    tags: ["GPS Survey", "CAD 2D", "Engineering Survey", "Reporting"],
  },
  {
    title: "Surveyor / Supervisor",
    company: "Swachchhanda-Diwa JV",
    location: "Satdobato, Lalitpur-15, Nepal",
    period: "Feb 2018 - Jan 2020",
    type: "Full-time",
    responsibilities: [
      "Performed construction surveys, quality control, and design for construction",
      "Worked on Sardu Khola Bridge, Dattakiccha Khola Bridge, and Pakali-Nadaha Road projects",
      "Supervised construction activities and ensured adherence to design specifications",
    ],
    tags: ["Bridge Construction", "Road Construction", "Quality Control"],
  },
]

export function ExperienceSection() {
  return (
    <section id="experience" className="bg-secondary/50 px-4 py-20 lg:py-28">
      <div className="mx-auto max-w-4xl">
        {/* Section Header */}
        <div className="mb-14 text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-primary">
            Career
          </p>
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl text-balance">
            Professional Experience
          </h2>
          <div className="mx-auto h-1 w-12 rounded-full bg-primary" />
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-0 top-0 bottom-0 w-px bg-border md:left-1/2 md:-translate-x-px" />

          <div className="space-y-10">
            {experiences.map((exp, index) => (
              <div
                key={`${exp.company}-${exp.period}`}
                className={`relative flex flex-col md:flex-row ${
                  index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                }`}
              >
                {/* Timeline dot */}
                <div className="absolute left-0 top-8 z-10 h-3 w-3 -translate-x-1 rounded-full border-2 border-primary bg-background md:left-1/2 md:-translate-x-1.5" />

                {/* Content */}
                <div
                  className={`ml-6 w-full md:ml-0 md:w-1/2 ${
                    index % 2 === 0 ? "md:pr-10" : "md:pl-10"
                  }`}
                >
                  <div className="rounded-xl border border-border bg-card p-5 shadow-sm transition-shadow hover:shadow-md">
                    <div className="mb-1 flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                        {exp.type}
                      </span>
                    </div>

                    <h3 className="mb-1 text-base font-semibold text-foreground">{exp.title}</h3>
                    <p className="mb-2 text-sm font-medium text-primary">{exp.company}</p>

                    <div className="mb-3 flex flex-wrap gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {exp.period}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {exp.location}
                      </span>
                    </div>

                    <ul className="mb-4 space-y-1.5">
                      {exp.responsibilities.map((item, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2 text-sm leading-relaxed text-muted-foreground"
                        >
                          <span className="mt-2 h-1 w-1 flex-shrink-0 rounded-full bg-primary/60" />
                          {item}
                        </li>
                      ))}
                    </ul>

                    <div className="flex flex-wrap gap-1.5">
                      {exp.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-md border border-border bg-muted px-2 py-0.5 text-xs text-muted-foreground"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Education */}
        <div className="mt-16">
          <h3 className="mb-6 text-center text-xl font-bold text-foreground">
            Education
          </h3>
          <div className="mx-auto max-w-lg space-y-4">
            <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
              <h4 className="text-sm font-semibold text-foreground">
                Advanced in Barista
              </h4>
              <p className="text-sm text-primary">Espresso Organic Coffee Pvt. Ltd.</p>
              <p className="text-xs text-muted-foreground">Thapagaun, Kathmandu, Nepal &middot; 30 Days &middot; 2023</p>
            </div>
            <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
              <h4 className="text-sm font-semibold text-foreground">
                Diploma in Civil Engineering
              </h4>
              <p className="text-sm text-primary">
                Sushma Koirala Memorial Engineering College
              </p>
              <p className="text-xs text-muted-foreground">Nepal &middot; 2011 - 2014</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
