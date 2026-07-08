import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Target, Eye, Award } from "lucide-react"

const values = [
  { title: "Our Mission", description: "To empower businesses with cutting-edge AI technology that drives innovation, efficiency, and sustainable growth.", icon: Target },
  { title: "Our Vision", description: "To be the leading provider of AI-powered business solutions, transforming how enterprises operate in the digital era.", icon: Eye },
  { title: "Our Values", description: "Innovation, integrity, and excellence are at the core of everything we do. We deliver results that matter.", icon: Award },
]

export default function AboutPage() {
  return (
    <div>
      <section className="bg-gradient-to-b from-primary/5 to-background py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold">About NovaTech Solutions</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            We are a team of passionate technologists, engineers, and innovators dedicated to
            transforming businesses through the power of artificial intelligence.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-2xl font-bold">Who We Are</h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Founded in 2020, NovaTech Solutions has grown from a small startup into a trusted
              technology partner for enterprises worldwide. Our team of 200+ engineers, data
              scientists, and business consultants brings deep expertise across AI, cloud computing,
              and software development.
            </p>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              We believe that every business deserves access to cutting-edge technology that can
              drive real results. That is why we focus on delivering practical, scalable solutions
              that address the unique challenges of each client.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-muted/50 py-16">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-3">
            {values.map((v) => {
              const Icon = v.icon
              return (
                <Card key={v.title} className="text-center">
                  <CardHeader>
                    <Icon className="mx-auto h-12 w-12 text-primary" />
                    <CardTitle>{v.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{v.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>
    </div>
  )
}
