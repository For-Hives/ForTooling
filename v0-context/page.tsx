import Link from "next/link"
import { Construction, Wrench, User, Building } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
  const quickLinks = [
    {
      title: "Projects",
      description: "Manage construction projects and sites",
      icon: Construction,
      href: "/projects",
      color: "bg-blue-100 text-blue-700",
    },
    {
      title: "Equipment",
      description: "Track and manage all equipment",
      icon: Wrench,
      href: "/equipment",
      color: "bg-amber-100 text-amber-700",
    },
    {
      title: "Users",
      description: "Manage users and permissions",
      icon: User,
      href: "/users",
      color: "bg-green-100 text-green-700",
    },
    {
      title: "Organization",
      description: "Company settings and configuration",
      icon: Building,
      href: "/organization",
      color: "bg-purple-100 text-purple-700",
    },
  ]

  return (
    <div className="w-full">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">Quick Access</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
        {quickLinks.map((link) => (
          <Link href={link.href} key={link.title} className="block group">
            <Card className="h-full transition-all hover:shadow-md">
              <CardHeader className="pb-2">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${link.color}`}>
                  <link.icon className="h-6 w-6" />
                </div>
              </CardHeader>
              <CardContent>
                <CardTitle className="text-lg group-hover:text-primary transition-colors">{link.title}</CardTitle>
                <CardDescription className="mt-1 text-sm">{link.description}</CardDescription>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}

