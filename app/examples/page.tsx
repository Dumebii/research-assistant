"use client"

import { motion } from "framer-motion"
import { FileText, Presentation, Mic, BarChart3, Play, Download } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Navbar from "@/components/navbar"
import { SparklesCore } from "@/components/sparkles"

const examples = [
  {
    id: 1,
    title: "Machine Learning in Healthcare",
    originalType: "Research Paper",
    transformedType: "Interactive Presentation",
    description:
      "A 45-page research paper on ML applications in medical diagnosis transformed into a 15-slide presentation with interactive charts.",
    tags: ["Healthcare", "Machine Learning", "Data Science"],
    icon: Presentation,
    color: "from-blue-500 to-cyan-500",
    stats: { pages: 45, slides: 15, duration: "12 min" },
  },
  {
    id: 2,
    title: "Climate Change Impact Analysis",
    originalType: "Academic Study",
    transformedType: "Podcast Episode",
    description:
      "Environmental research converted into a compelling 20-minute podcast with expert narration and background music.",
    tags: ["Environment", "Climate", "Policy"],
    icon: Mic,
    color: "from-green-500 to-emerald-500",
    stats: { pages: 32, duration: "20 min", voices: 2 },
  },
  {
    id: 3,
    title: "Quantum Computing Breakthrough",
    originalType: "Technical Paper",
    transformedType: "Visual Infographic",
    description: "Complex quantum computing concepts simplified into an engaging visual story with animated diagrams.",
    tags: ["Quantum", "Computing", "Physics"],
    icon: BarChart3,
    color: "from-purple-500 to-pink-500",
    stats: { pages: 28, visuals: 12, concepts: 8 },
  },
  {
    id: 4,
    title: "Economic Policy Analysis",
    originalType: "Policy Document",
    transformedType: "Executive Summary",
    description: "A comprehensive economic policy paper distilled into key insights and actionable recommendations.",
    tags: ["Economics", "Policy", "Government"],
    icon: FileText,
    color: "from-orange-500 to-red-500",
    stats: { pages: 67, summary: "3 pages", insights: 15 },
  },
]

export default function ExamplesPage() {
  return (
    <main className="min-h-screen bg-black/[0.96] antialiased bg-grid-white/[0.02] relative overflow-hidden">
      <div className="h-full w-full absolute inset-0 z-0">
        <SparklesCore
          id="tsparticlesfullpage"
          background="transparent"
          minSize={0.6}
          maxSize={1.4}
          particleDensity={50}
          className="w-full h-full"
          particleColor="#FFFFFF"
        />
      </div>

      <div className="relative z-10">
        <Navbar />

        <div className="container mx-auto px-6 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              See It In
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
                {" "}
                Action
              </span>
            </h1>
            <p className="text-gray-400 text-xl max-w-3xl mx-auto">
              Explore real examples of how researchers have transformed their complex papers into engaging, accessible
              content using our AI platform.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {examples.map((example, index) => (
              <motion.div
                key={example.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 transition-all duration-300 h-full">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-4">
                      <div
                        className={`w-12 h-12 rounded-lg bg-gradient-to-r ${example.color} flex items-center justify-center`}
                      >
                        <example.icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="bg-purple-600/20 text-purple-300 border border-purple-500/30 rounded-full px-3 py-1 text-sm">
                        {example.transformedType}
                      </div>
                    </div>
                    <CardTitle className="text-white text-xl mb-2">{example.title}</CardTitle>
                    <CardDescription className="text-gray-400 mb-4">{example.description}</CardDescription>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {example.tags.map((tag) => (
                        <div key={tag} className="text-gray-300 border border-gray-600 rounded-full px-2 py-1 text-xs">
                          {tag}
                        </div>
                      ))}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-3 gap-4 text-center">
                        {Object.entries(example.stats).map(([key, value]) => (
                          <div key={key} className="bg-white/5 rounded-lg p-3">
                            <div className="text-white font-semibold">{value}</div>
                            <div className="text-gray-400 text-sm capitalize">{key}</div>
                          </div>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" className="flex-1 bg-purple-600 hover:bg-purple-700">
                          <Play className="w-4 h-4 mr-2" />
                          Preview
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1 text-white border-gray-600 hover:bg-white/10"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="text-center mt-16"
          >
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold text-white mb-4">Ready to Transform Your Research?</h3>
              <p className="text-gray-400 mb-6">
                Join thousands of researchers who have already transformed their work into engaging content.
              </p>
              <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-white px-8">
                Start Your Transformation
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  )
}
