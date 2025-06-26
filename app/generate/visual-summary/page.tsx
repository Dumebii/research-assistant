"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { BarChart3, Download, Loader2, ArrowLeft } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import Navbar from "@/components/navbar"
import { SparklesCore } from "@/components/sparkles"
import Link from "next/link"

interface VisualElement {
  type: "chart" | "infographic" | "diagram" | "timeline"
  title: string
  description: string
  data?: any
  suggestions: string[]
}

interface VisualSummary {
  title: string
  overview: string
  elements: VisualElement[]
}

export default function VisualSummaryPage() {
  const [paperContent, setPaperContent] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [progress, setProgress] = useState(0)
  const [visualSummary, setVisualSummary] = useState<VisualSummary | null>(null)

  const generateVisualSummary = async () => {
    if (!paperContent.trim()) {
      alert("Please paste your research paper content first")
      return
    }

    setIsGenerating(true)
    setProgress(0)

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval)
          return 90
        }
        return prev + 10
      })
    }, 500)

    try {
      const response = await fetch("/api/generate-content", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          paperContent,
          contentType: "visual",
          analysisResult: null,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate visual summary")
      }

      const result = await response.json()

      // Parse the generated content into visual elements
      const content = result.generatedContent
      const sections = content.split("\n\n").filter((section: string) => section.trim())

      const elements: VisualElement[] = [
        {
          type: "infographic",
          title: "Key Findings Overview",
          description: "Visual representation of main research findings",
          suggestions: [
            "Use icons and illustrations to represent key concepts",
            "Create a flow chart showing the research methodology",
            "Include statistical highlights with visual emphasis",
          ],
        },
        {
          type: "chart",
          title: "Data Visualization",
          description: "Charts and graphs for quantitative data",
          suggestions: [
            "Bar charts for comparative data",
            "Line graphs for trends over time",
            "Pie charts for proportional data",
            "Scatter plots for correlations",
          ],
        },
        {
          type: "timeline",
          title: "Research Timeline",
          description: "Chronological representation of the study",
          suggestions: [
            "Show research phases and milestones",
            "Highlight key dates and events",
            "Include methodology timeline",
          ],
        },
        {
          type: "diagram",
          title: "Conceptual Framework",
          description: "Visual model of research concepts and relationships",
          suggestions: ["Mind map of key concepts", "Process flow diagrams", "Hierarchical structure diagrams"],
        },
      ]

      const summary: VisualSummary = {
        title: "Visual Research Summary",
        overview: content.slice(0, 300) + "...",
        elements,
      }

      setVisualSummary(summary)
      setProgress(100)
    } catch (error) {
      console.error("Generation error:", error)
      alert("Failed to generate visual summary. Please try again.")
    } finally {
      clearInterval(progressInterval)
      setIsGenerating(false)
    }
  }

  const downloadSummary = () => {
    if (!visualSummary) return

    const content = `# ${visualSummary.title}\n\n## Overview\n${visualSummary.overview}\n\n${visualSummary.elements
      .map(
        (element) =>
          `## ${element.title} (${element.type.toUpperCase()})\n\n${element.description}\n\n### Suggestions:\n${element.suggestions.map((s) => `- ${s}`).join("\n")}\n\n---\n`,
      )
      .join("")}`

    const blob = new Blob([content], { type: "text/markdown" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "visual-summary.md"
    a.click()
    URL.revokeObjectURL(url)
  }

  const getElementIcon = (type: string) => {
    switch (type) {
      case "chart":
        return "📊"
      case "infographic":
        return "🎨"
      case "diagram":
        return "🔄"
      case "timeline":
        return "⏰"
      default:
        return "📈"
    }
  }

  const getElementColor = (type: string) => {
    switch (type) {
      case "chart":
        return "from-blue-500 to-blue-600"
      case "infographic":
        return "from-purple-500 to-purple-600"
      case "diagram":
        return "from-green-500 to-green-600"
      case "timeline":
        return "from-orange-500 to-orange-600"
      default:
        return "from-gray-500 to-gray-600"
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
            className="mb-8"
          >
            <Link href="/" className="inline-flex items-center text-purple-400 hover:text-purple-300 mb-6">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>

            <div className="text-center">
              <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center mb-6">
                <BarChart3 className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                Visual
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-600">
                  {" "}
                  Summary
                </span>
              </h1>
              <p className="text-gray-400 text-xl max-w-3xl mx-auto">
                Create visual representations and infographics from your research with Grok AI
              </p>
            </div>
          </motion.div>

          <div className="max-w-4xl mx-auto space-y-8">
            {!visualSummary ? (
              <>
                <Card className="bg-white/5 backdrop-blur-sm border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white text-2xl">Research Paper Content</CardTitle>
                    <CardDescription className="text-gray-400">
                      Paste your research paper content to generate visual summary suggestions
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      placeholder="Paste your research paper content here..."
                      value={paperContent}
                      onChange={(e) => setPaperContent(e.target.value)}
                      className="min-h-[300px] bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                    />
                    <div className="mt-6 flex justify-center">
                      <Button
                        onClick={generateVisualSummary}
                        disabled={isGenerating || !paperContent.trim()}
                        className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-3 text-lg"
                      >
                        {isGenerating ? (
                          <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            Generating Visuals...
                          </>
                        ) : (
                          <>
                            <BarChart3 className="w-5 h-5 mr-2" />
                            Generate Visual Summary
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {isGenerating && (
                  <Card className="bg-white/5 backdrop-blur-sm border-white/10">
                    <CardContent className="pt-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between text-white">
                          <span>Generating visual summary...</span>
                          <span>{progress}%</span>
                        </div>
                        <Progress value={progress} className="h-2" />
                      </div>
                    </CardContent>
                  </Card>
                )}
              </>
            ) : (
              <div className="space-y-6">
                {/* Summary Header */}
                <Card className="bg-white/5 backdrop-blur-sm border-white/10">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-white text-2xl">{visualSummary.title}</CardTitle>
                        <CardDescription className="text-gray-400 mt-2">{visualSummary.overview}</CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={downloadSummary} className="bg-purple-600 hover:bg-purple-700">
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                        <Button
                          onClick={() => setVisualSummary(null)}
                          variant="outline"
                          className="text-white border-gray-600"
                        >
                          Generate New
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                </Card>

                {/* Visual Elements */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {visualSummary.elements.map((element, index) => (
                    <Card key={index} className="bg-white/5 backdrop-blur-sm border-white/10">
                      <CardHeader>
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-12 h-12 rounded-lg bg-gradient-to-r ${getElementColor(element.type)} flex items-center justify-center text-2xl`}
                          >
                            {getElementIcon(element.type)}
                          </div>
                          <div>
                            <CardTitle className="text-white text-lg">{element.title}</CardTitle>
                            <CardDescription className="text-gray-400 text-sm">
                              {element.type.toUpperCase()}
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-300 mb-4">{element.description}</p>
                        <div className="space-y-2">
                          <h4 className="text-white font-semibold text-sm">Suggestions:</h4>
                          {element.suggestions.map((suggestion, idx) => (
                            <div key={idx} className="flex items-start gap-2">
                              <div className="w-1.5 h-1.5 bg-orange-400 rounded-full mt-2 flex-shrink-0" />
                              <p className="text-gray-400 text-sm">{suggestion}</p>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
