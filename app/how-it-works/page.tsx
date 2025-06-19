"use client"

import { motion } from "framer-motion"
import { Upload, Brain, Sparkles, Download } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Navbar from "@/components/navbar"
import { SparklesCore } from "@/components/sparkles"

const steps = [
  {
    step: 1,
    icon: Upload,
    title: "Upload Your Research",
    description: "Simply drag and drop your research paper (PDF, DOC, or TXT) into our secure platform.",
    details: [
      "Support for multiple file formats",
      "Secure cloud processing",
      "Batch upload capability",
      "OCR for scanned documents",
    ],
  },
  {
    step: 2,
    icon: Brain,
    title: "AI Analysis & Processing",
    description: "Our advanced AI analyzes your paper, extracting key insights, methodologies, and findings.",
    details: [
      "Natural language processing",
      "Citation analysis",
      "Methodology extraction",
      "Key finding identification",
    ],
  },
  {
    step: 3,
    icon: Sparkles,
    title: "Content Transformation",
    description: "Choose your desired output format and watch as AI transforms your research into engaging content.",
    details: ["Presentation slides", "Podcast scripts", "Visual infographics", "Executive summaries"],
  },
  {
    step: 4,
    icon: Download,
    title: "Download & Share",
    description: "Get your transformed content in professional formats ready for presentation or publication.",
    details: ["Multiple export formats", "Customizable templates", "Direct sharing options", "Version control"],
  },
]

export default function HowItWorksPage() {
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
              How It
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600"> Works</span>
            </h1>
            <p className="text-gray-400 text-xl max-w-3xl mx-auto">
              Transform your research papers into engaging content in just four simple steps. Our AI handles the
              complexity while you focus on what matters most.
            </p>
          </motion.div>

          <div className="space-y-16">
            {steps.map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className={`flex flex-col lg:flex-row items-center gap-8 ${
                  index % 2 === 1 ? "lg:flex-row-reverse" : ""
                }`}
              >
                <div className="flex-1">
                  <Card className="bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 transition-all duration-300">
                    <CardHeader>
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                          {step.step}
                        </div>
                        <step.icon className="w-8 h-8 text-purple-400" />
                      </div>
                      <CardTitle className="text-white text-2xl">{step.title}</CardTitle>
                      <CardDescription className="text-gray-400 text-lg">{step.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {step.details.map((detail, detailIndex) => (
                          <li key={detailIndex} className="text-gray-300 flex items-center">
                            <div className="w-2 h-2 bg-purple-500 rounded-full mr-3" />
                            {detail}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>

                <div className="flex-1 flex justify-center">
                  <div className="w-64 h-64 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/10">
                    <step.icon className="w-24 h-24 text-purple-400" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="text-center mt-16"
          >
            <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-white px-8">
              Get Started Now
            </Button>
          </motion.div>
        </div>
      </div>
    </main>
  )
}
