import { ShieldCheck, HardHat, Pencil, Users, Monitor, Wrench } from "lucide-react"

const skillCategories = [
  {
    icon: ShieldCheck,
    title: "Production & Food Safety",
    skills: [
      { name: "Meat Processing", level: 90 },
      { name: "NZ Food Safety Standards", level: 95 },
      { name: "Hygiene Compliance", level: 95 },
      { name: "Manual Handling", level: 90 },
      { name: "Night Shift Operations", level: 85 },
    ],
  },
  {
    icon: HardHat,
    title: "Construction & Surveying",
    skills: [
      { name: "Topographic Survey", level: 90 },
      { name: "Construction Survey", level: 85 },
      { name: "Site Data Collection", level: 88 },
      { name: "GPS & Level Operation", level: 85 },
      { name: "Quality Control", level: 80 },
    ],
  },
  {
    icon: Pencil,
    title: "Drafting & Design",
    skills: [
      { name: "AutoCAD 2D", level: 85 },
      { name: "SketchUp Pro", level: 80 },
      { name: "Revit Architecture", level: 75 },
      { name: "Architectural Plans", level: 82 },
      { name: "Adobe Photoshop", level: 70 },
    ],
  },
  {
    icon: Monitor,
    title: "Software & Digital",
    skills: [
      { name: "Microsoft Office", level: 85 },
      { name: "Canva", level: 80 },
      { name: "WordPress", level: 75 },
      { name: "Web Development", level: 70 },
      { name: "Digital Marketing", level: 65 },
    ],
  },
  {
    icon: Users,
    title: "Teamwork & Reliability",
    skills: [
      { name: "Team Collaboration", level: 95 },
      { name: "Site Supervision", level: 88 },
      { name: "Punctuality", level: 95 },
      { name: "Adaptability", level: 90 },
      { name: "Work Ethic", level: 95 },
    ],
  },
  {
    icon: Wrench,
    title: "Technical & Hardware",
    skills: [
      { name: "Computer Hardware", level: 70 },
      { name: "Software Installation", level: 75 },
      { name: "Basic Repair", level: 70 },
      { name: "Troubleshooting", level: 72 },
      { name: "Barista Equipment", level: 85 },
    ],
  },
]

export function SkillsSection() {
  return (
    <section id="skills" className="px-4 py-20 lg:py-28">
      <div className="mx-auto max-w-6xl">
        {/* Section Header */}
        <div className="mb-14 text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-primary">
            Expertise
          </p>
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl text-balance">
            Skills & Competencies
          </h2>
          <div className="mx-auto h-1 w-12 rounded-full bg-primary" />
        </div>

        {/* Skills Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {skillCategories.map((category) => (
            <div
              key={category.title}
              className="group rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/30 hover:shadow-md"
            >
              <div className="mb-5 flex items-center gap-3">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <category.icon className="h-5 w-5" />
                </div>
                <h3 className="text-sm font-semibold text-foreground">{category.title}</h3>
              </div>

              <div className="space-y-3.5">
                {category.skills.map((skill) => (
                  <div key={skill.name}>
                    <div className="mb-1 flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">{skill.name}</span>
                      <span className="text-xs font-medium text-primary">{skill.level}%</span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-primary/70 transition-all duration-700"
                        style={{ width: `${skill.level}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
