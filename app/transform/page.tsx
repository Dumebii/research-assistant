"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Presentation, Mic, FileText, BarChart3, Download, Play, Loader2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import Navbar from "@/components/navbar"
import { SparklesCore } from "@/components/sparkles"

const contentTypes = [
  {
    id: "presentation",
    title: "Presentation Slides",
    description: "Transform your research into engaging slide presentations",
    icon: Presentation,
    color: "from-blue-500 to-cyan-500",
  },
  {
    id: "podcast",
    title: "Podcast Script",
    description: "Convert your paper into compelling audio content",
    icon: Mic,
    color: "from-green-500 to-emerald-500",
  },
  {
    id: "summary",
    title: "Executive Summary",
    description: "Create concise summaries for decision-makers",
    icon: FileText,
    color: "from-purple-500 to-pink-500",
  },
  {
    id: "visual",
    title: "Visual Content",
    description: "Generate infographics and visual representations",
    icon: BarChart3,
    color: "from-orange-500 to-red-500",
  },
]

export default function TransformPage() {
  const [selectedType, setSelectedType] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedContent, setGeneratedContent] = useState<string | null>(null)
  const [paperContent, setPaperContent] = useState("")

  const generateContent = async (contentType: string) => {
    if (!paperContent.trim()) {
      alert("Please paste your research paper content first")
      return
    }

    setIsGenerating(true)
    setSelectedType(contentType)

    try {
      const response = await fetch("/api/generate-content", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          paperContent,
          contentType,
          analysisResult: null, // Could be passed from previous analysis
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate content")
      }

      const result = await response.json()
      setGeneratedContent(result.generatedContent)
    } catch (error) {
      console.error("Generation error:", error)
      alert("Failed to generate content. Please try again.")
    } finally {
      setIsGenerating(false)
    }
  }

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
              Transform Your
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
                {" "}
                Research
              </span>
            </h1>
            <p className="text-gray-400 text-xl max-w-3xl mx-auto">
              Use Grok AI to transform your research into presentations, podcasts, summaries, and visual content.
            </p>
          </motion.div>

          <div className="max-w-6xl mx-auto space-y-8">
            {/* Input Section */}
            <Card className="bg-white/5 backdrop-blur-sm border-white/10">
              <CardHeader>
                <CardTitle className="text-white text-2xl">Research Paper Content</CardTitle>
                <CardDescription className="text-gray-400">
                  Paste your research paper content here to get started
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Paste your research paper content here..."
                  value={paperContent}
                  onChange={(e) => setPaperContent(e.target.value)}
                  className="min-h-[200px] bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                />
              </CardContent>
            </Card>

            {/* Content Type Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {contentTypes.map((type, index) => (
                <motion.div
                  key={type.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 transition-all duration-300 h-full cursor-pointer">
                    <CardHeader className="text-center">
                      <div
                        className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-r ${type.color} flex items-center justify-center mb-4`}
                      >
                        <type.icon className="w-8 h-8 text-white" />
                      </div>
                      <CardTitle className="text-white text-lg">{type.title}</CardTitle>
                      <CardDescription className="text-gray-400 text-sm">{type.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button
                        onClick={() => generateContent(type.id)}
                        disabled={isGenerating || !paperContent.trim()}
                        className="w-full bg-purple-600 hover:bg-purple-700"
                      >
                        {isGenerating && selectedType === type.id ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Generating...
                          </>
                        ) : (
                          `Generate ${type.title}`
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Generated Content */}
            {generatedContent && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <Card className="bg-white/5 backdrop-blur-sm border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white text-2xl flex items-center justify-between">
                      Generated Content
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="text-white border-gray-600">
                          <Play className="w-4 h-4 mr-2" />
                          Preview
                        </Button>
                        <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-black/20 rounded-lg p-4 max-h-96 overflow-y-auto">
                      <pre className="text-gray-300 whitespace-pre-wrap text-sm">{generatedContent}</pre>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
