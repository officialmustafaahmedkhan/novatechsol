import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Chatbot } from "@/components/chatbot"

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <Chatbot />
    </>
  )
}
