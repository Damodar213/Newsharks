"use client"

import Link from "next/link"
import { ArrowRight, BarChart3, LightbulbIcon, TrendingUp, Users } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">NEW SHARKS</span>
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link href="/how-it-works" className="text-sm font-medium hover:underline underline-offset-4">
              How It Works
            </Link>
            <Link href="/browse" className="text-sm font-medium hover:underline underline-offset-4">
              Browse Ideas
            </Link>
            <Link href="/success-stories" className="text-sm font-medium hover:underline underline-offset-4">
              Success Stories
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="outline" size="sm">
                Log In
              </Button>
            </Link>
            <Link href="/signup">
              <Button size="sm">Sign Up</Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-white to-gray-100 dark:from-gray-900 dark:to-gray-800">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="space-y-4">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Connect Your Ideas with Investors Who Believe in You
                </h1>
                <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  NEW SHARKS bridges the gap between innovative entrepreneurs and potential investors, making funding
                  more accessible, transparent, and efficient.
                </p>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/signup?role=entrepreneur">
                    <Button className="w-full min-[400px]:w-auto">
                      Submit Your Idea
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/signup?role=investor">
                    <Button variant="outline" className="w-full min-[400px]:w-auto">
                      Become an Investor
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="flex justify-center">
                <div className="relative w-full max-w-[500px] aspect-video rounded-xl overflow-hidden shadow-xl">
                  <img
                    src="/placeholder.svg?height=400&width=600"
                    alt="Entrepreneurs and investors collaborating"
                    className="object-cover w-full h-full"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">How It Works</h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  Our platform simplifies the funding process with a transparent and efficient approach
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3 lg:gap-12 mt-8">
              <div className="flex flex-col items-center space-y-2 border rounded-lg p-6 shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <LightbulbIcon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">Submit Your Idea</h3>
                <p className="text-center text-gray-500 dark:text-gray-400">
                  Entrepreneurs create detailed pitches with business plans, funding goals, and equity offerings
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 border rounded-lg p-6 shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Users className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">Connect with Sharks</h3>
                <p className="text-center text-gray-500 dark:text-gray-400">
                  Investors browse ideas, evaluate potential, and connect directly with entrepreneurs
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 border rounded-lg p-6 shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <BarChart3 className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">Secure Funding</h3>
                <p className="text-center text-gray-500 dark:text-gray-400">
                  Transparent investment process with secure transactions and progress tracking
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Why Choose NEW SHARKS</h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  Our platform offers unique advantages over traditional funding methods
                </p>
              </div>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mt-8">
              <div className="flex flex-col space-y-2 border rounded-lg p-6 bg-white dark:bg-gray-950 shadow-sm">
                <h3 className="text-xl font-bold">Direct Interaction</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Connect directly with investors who are interested in your industry
                </p>
              </div>
              <div className="flex flex-col space-y-2 border rounded-lg p-6 bg-white dark:bg-gray-950 shadow-sm">
                <h3 className="text-xl font-bold">Flexible Funding</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Multiple investment models to suit different business needs
                </p>
              </div>
              <div className="flex flex-col space-y-2 border rounded-lg p-6 bg-white dark:bg-gray-950 shadow-sm">
                <h3 className="text-xl font-bold">Efficient Process</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Admin-approved streamlined funding with minimal paperwork
                </p>
              </div>
              <div className="flex flex-col space-y-2 border rounded-lg p-6 bg-white dark:bg-gray-950 shadow-sm">
                <h3 className="text-xl font-bold">Transparent Tracking</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Real-time updates on investments and business progress
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t">
        <div className="container flex flex-col gap-4 py-10 md:flex-row md:gap-8 md:py-12 px-4 md:px-6">
          <div className="flex flex-col gap-2 md:gap-4 md:w-1/3">
            <Link href="/" className="flex items-center gap-2">
              <TrendingUp className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">NEW SHARKS</span>
            </Link>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Connecting innovative ideas with the right investors since 2023
            </p>
          </div>
          <div className="grid flex-1 grid-cols-2 md:grid-cols-3 gap-8">
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Platform</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/how-it-works" className="text-gray-500 hover:underline dark:text-gray-400">
                    How It Works
                  </Link>
                </li>
                <li>
                  <Link href="/browse" className="text-gray-500 hover:underline dark:text-gray-400">
                    Browse Ideas
                  </Link>
                </li>
                <li>
                  <Link href="/success-stories" className="text-gray-500 hover:underline dark:text-gray-400">
                    Success Stories
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Company</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/about" className="text-gray-500 hover:underline dark:text-gray-400">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-gray-500 hover:underline dark:text-gray-400">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/careers" className="text-gray-500 hover:underline dark:text-gray-400">
                    Careers
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/privacy" className="text-gray-500 hover:underline dark:text-gray-400">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-gray-500 hover:underline dark:text-gray-400">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="border-t py-6 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>© 2023 NEW SHARKS. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
