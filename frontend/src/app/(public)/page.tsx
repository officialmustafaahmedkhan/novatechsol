import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, Bot, Cloud, Code, BarChart3 } from "lucide-react"

const features = [
  { title: "AI Automation", description: "Intelligent automation solutions that streamline your business processes and reduce operational costs.", icon: Bot },
  { title: "Cloud Infrastructure", description: "Scalable cloud architecture consulting and migration services for enterprise-grade reliability.", icon: Cloud },
  { title: "Custom Software", description: "Tailored software development to solve your unique business challenges with modern technology.", icon: Code },
  { title: "Data Analytics", description: "Transform raw data into actionable insights with our advanced analytics and visualization tools.", icon: BarChart3 },
]

export default function HomePage() {
  return (
    <div>
      <section className="bg-gradient-to-b from-primary/5 to-background py-24 md:py-32">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
            Empower Your Business with{" "}
            <span className="text-primary">AI-Driven Solutions</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            NovaTech Solutions delivers cutting-edge AI-powered business automation, cloud infrastructure,
            and custom software development to help enterprises thrive in the digital age.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button asChild size="lg">
              <Link href="/products">Explore Products <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-center text-3xl font-bold">Our Solutions</h2>
          <p className="mx-auto mt-4 max-w-xl text-center text-muted-foreground">
            Comprehensive technology solutions designed for modern enterprises
          </p>
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => {
              const Icon = feature.icon
              return (
                <Card key={feature.title} className="border-2 transition-colors hover:border-primary">
                  <CardHeader>
                    <Icon className="h-10 w-10 text-primary" />
                    <CardTitle className="mt-4">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      <section className="bg-muted/50 py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold">Ready to Transform Your Business?</h2>
          <p className="mx-auto mt-4 max-w-lg text-muted-foreground">
            Get in touch with our team to discuss how we can help you achieve your goals.
          </p>
          <Button asChild size="lg" className="mt-8">
            <Link href="/contact">Get Started</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
