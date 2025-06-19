"use client"

import { motion } from "framer-motion"
import { Bot, FileText, Mic, Presentation, Sparkles, Zap, Brain, Globe } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Navbar from "@/components/navbar"
import { SparklesCore } from "@/components/sparkles"

const features = [
  {
    icon: FileText,
    title: "Smart Paper Analysis",
    description: "Upload any research paper and our AI instantly extracts key insights, methodologies, and findings.",
    color: "text-blue-500",
  },
  {
    icon: Presentation,
    title: "Auto Presentation Generation",
    description: "Transform complex research into beautiful, engaging presentations with just one click.",
    color: "text-purple-500",
  },
  {
    icon: Mic,
    title: "Podcast Creation",
    description: "Convert your research into compelling audio content with natural-sounding AI voices.",
    color: "text-green-500",
  },
  {
    icon: Brain,
    title: "Intelligent Summarization",
    description: "Get concise, accurate summaries that capture the essence of your research work.",
    color: "text-orange-500",
  },
  {
    icon: Sparkles,
    title: "Visual Content Generation",
    description: "Create infographics, charts, and visual aids that make your research more accessible.",
    color: "text-pink-500",
  },
  {
    icon: Globe,
    title: "Multi-Language Support",
    description: "Translate and adapt your research content for global audiences automatically.",
    color: "text-cyan-500",
  },
  {
    icon: Zap,
    title: "Lightning Fast Processing",
    description: "Process even the most complex research papers in seconds, not hours.",
    color: "text-yellow-500",
  },
  {
    icon: Bot,
    title: "AI Research Assistant",
    description: "Get intelligent answers about your research and discover related work instantly.",
    color: "text-red-500",
  },
]

export default function FeaturesPage() {
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
              Powerful Features for
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
                {" "}
                Modern Research
              </span>
            </h1>
            <p className="text-gray-400 text-xl max-w-3xl mx-auto">
              Discover how our AI-powered platform transforms the way you work with research papers, making complex
              academic content accessible and engaging.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 transition-all duration-300 h-full">
                  <CardHeader>
                    <feature.icon className={`w-12 h-12 ${feature.color} mb-4`} />
                    <CardTitle className="text-white text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-400">{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
