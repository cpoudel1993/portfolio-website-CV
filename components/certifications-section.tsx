import { ExternalLink, Clock, Award, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"

const certifications = [
  {
    title: "Healthcare Taster Training Courses",
    platform: "MSD / MySkill",
    type: "Certificate",
    date: "Mar 2, 2026",
    duration: "",
    skills: ["Support Worker", "Household Management", "Personal Cares"],
    certId: "",
    pdfUrl: "/certificates/healthcare-taster-training-courses-msd-myskill.pdf",
  },
  {
    title: "Your Role as a Support Worker",
    platform: "MSD / MySkill",
    type: "Course",
    date: "Mar 2, 2026",
    duration: "",
    skills: ["Support Worker", "Healthcare"],
    certId: "",
    pdfUrl: "/certificates/your-role-as-a-support-worker-msd-myskill.pdf",
  },
  {
    title: "Become a Full-Stack Web Developer",
    platform: "LinkedIn Learning",
    type: "Learning Path",
    date: "Dec 13, 2023",
    duration: "105 hours 27 minutes",
    skills: ["Web Development", "Full-Stack Development"],
    certId: "7ada2e72e72ca4f234bd054ff84cfd3f8f063df6a4686bc9cc09214a94d38dea",
    pdfUrl: "",
  },
  {
    title: "Explore a Career in Front-End Web Development",
    platform: "LinkedIn Learning",
    type: "Learning Path",
    date: "Dec 31, 2023",
    duration: "32 hours 11 minutes",
    skills: ["Front-End Development"],
    certId: "5725126b852434f99a81a85b7511f66054f1d455d57869cdf2d66c567eda34b0",
    pdfUrl: "",
  },
  {
    title: "Master Digital Marketing",
    platform: "LinkedIn Learning",
    type: "Learning Path",
    date: "Dec 13, 2023",
    duration: "9 hours 5 minutes",
    skills: ["Digital Marketing", "SEO", "SEO Copywriting"],
    certId: "fc212952956edd287854f7462d75759db6229c02cb3d5fa0bea2a8c65758b4ea",
    pdfUrl: "",
  },
  {
    title: "AutoCAD 2024 Essential Training",
    platform: "LinkedIn Learning",
    type: "Course",
    date: "Jan 18, 2026",
    duration: "10 hours 6 minutes",
    skills: ["AutoCAD"],
    certId: "2302b44eb4397bb2e28238a62bad52dca4004d10296428b51f66bbc3754b7209",
    pdfUrl: "",
  },
  {
    title: "Revit 2022: Essential Training for Architecture",
    platform: "LinkedIn Learning",
    type: "Course",
    date: "Jun 15, 2025",
    duration: "13 hours 51 minutes",
    skills: ["Revit"],
    certId: "d00b199dd9ef4f1f6b12e5fa05d6c94aa22d4651883d074f1107df643067058b",
    pdfUrl: "",
  },
  {
    title: "SketchUp Pro 2024 Essential Training",
    platform: "LinkedIn Learning",
    type: "Course",
    date: "Jun 17, 2025",
    duration: "3 hours 17 minutes",
    skills: ["SketchUp"],
    certId: "a52243711a1d700e8ef66b643ec81b09820cb279b38d6f347691bc2694bb4316",
    pdfUrl: "",
  },
]

export function CertificationsSection() {
  return (
    <section id="certifications" className="bg-secondary/50 px-4 py-20 lg:py-28">
      <div className="mx-auto max-w-6xl">
        {/* Section Header */}
        <div className="mb-14 text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-primary">
            Credentials
          </p>
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl text-balance">
            Certifications & Training
          </h2>
          <div className="mx-auto h-1 w-12 rounded-full bg-primary" />
        </div>

        {/* Certification Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {certifications.map((cert) => (
            <div
              key={cert.certId}
              className="group flex flex-col rounded-xl border border-border bg-card p-5 transition-all hover:border-primary/30 hover:shadow-md"
            >
              <div className="mb-3 flex items-start justify-between gap-2">
                <div className="inline-flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Award className="h-4 w-4" />
                </div>
                <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                  {cert.type}
                </span>
              </div>

              <h3 className="mb-1 text-sm font-semibold text-foreground leading-snug">
                {cert.title}
              </h3>
              <p className="mb-3 text-xs text-primary">{cert.platform}</p>

              <div className="mb-4 flex flex-wrap gap-3 text-xs text-muted-foreground">
                {cert.duration && (
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {cert.duration}
                  </span>
                )}
                <span>{cert.date}</span>
              </div>

              <div className="mb-4 flex flex-wrap gap-1.5">
                {cert.skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-md border border-primary/20 bg-primary/5 px-2 py-0.5 text-xs text-primary"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              <div className="mt-auto flex gap-2">
                {cert.certId && (
                  <Button variant="ghost" size="sm" className="h-auto gap-1.5 px-0 text-xs text-muted-foreground hover:text-primary" asChild>
                    <a
                      href={`https://www.linkedin.com/learning/certificates/${cert.certId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Verify Certificate
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </Button>
                )}
                {cert.pdfUrl && (
                  <Button variant="ghost" size="sm" className="h-auto gap-1.5 px-0 text-xs text-muted-foreground hover:text-primary" asChild>
                    <a
                      href={cert.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View PDF
                      <FileText className="h-3 w-3" />
                    </a>
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
