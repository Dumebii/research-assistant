"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Presentation, Download, Loader2, ArrowLeft } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import Navbar from "@/components/navbar"
import { SparklesCore } from "@/components/sparkles"
import Link from "next/link"

interface Slide {
  title: string
  content: string[]
  speakerNotes: string
}

interface PresentationData {
  title: string
  slides: Slide[]
}

export default function GeneratePresentationPage() {
  const [paperContent, setPaperContent] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [progress, setProgress] = useState(0)
  const [presentation, setPresentation] = useState<PresentationData | null>(null)
  const [currentSlide, setCurrentSlide] = useState(0)

  const generatePresentation = async () => {
    if (!paperContent.trim()) {
      alert("Please paste your research paper content first")
      return
    }

    setIsGenerating(true)
    setProgress(0)

    // Simulate progress
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
          contentType: "presentation",
          analysisResult: null,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate presentation")
      }

      const result = await response.json()

      // Try to parse JSON response, fallback to text format
      let presentationData: PresentationData
      try {
        presentationData = JSON.parse(result.generatedContent)
      } catch {
        // If not JSON, create slides from text
        const lines = result.generatedContent.split("\n").filter((line: string) => line.trim())
        const slides: Slide[] = []
        let currentSlideData: Partial<Slide> = {}

        lines.forEach((line: string) => {
          if (line.startsWith("# ") || line.startsWith("## ")) {
            if (currentSlideData.title) {
              slides.push({
                title: currentSlideData.title,
                content: currentSlideData.content || [],
                speakerNotes: currentSlideData.speakerNotes || "",
              })
            }
            currentSlideData = {
              title: line.replace(/^#+\s/, ""),
              content: [],
              speakerNotes: "",
            }
          } else if (line.startsWith("- ") || line.startsWith("* ")) {
            if (!currentSlideData.content) currentSlideData.content = []
            currentSlideData.content.push(line.replace(/^[-*]\s/, ""))
          }
        })

        if (currentSlideData.title) {
          slides.push({
            title: currentSlideData.title,
            content: currentSlideData.content || [],
            speakerNotes: currentSlideData.speakerNotes || "",
          })
        }

        presentationData = {
          title: "Research Presentation",
          slides:
            slides.length > 0
              ? slides
              : [
                  {
                    title: "Generated Presentation",
                    content: [result.generatedContent],
                    speakerNotes: "Generated from research paper",
                  },
                ],
        }
      }

      setPresentation(presentationData)
      setProgress(100)
    } catch (error) {
      console.error("Generation error:", error)
      alert("Failed to generate presentation. Please try again.")
    } finally {
      clearInterval(progressInterval)
      setIsGenerating(false)
    }
  }

  const downloadPresentation = () => {
    if (!presentation) return

    const content = `# ${presentation.title}\n\n${presentation.slides
      .map(
        (slide, index) =>
          `## Slide ${index + 1}: ${slide.title}\n\n${slide.content.map((point) => `- ${point}`).join("\n")}\n\n**Speaker Notes:** ${slide.speakerNotes}\n\n---\n`,
      )
      .join("")}`

    const blob = new Blob([content], { type: "text/markdown" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "presentation.md"
    a.click()
    URL.revokeObjectURL(url)
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
              <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center mb-6">
                <Presentation className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                Generate
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-600">
                  {" "}
                  Presentation
                </span>
              </h1>
              <p className="text-gray-400 text-xl max-w-3xl mx-auto">
                Transform your research paper into engaging presentation slides with Grok AI
              </p>
            </div>
          </motion.div>

          <div className="max-w-4xl mx-auto space-y-8">
            {!presentation ? (
              <>
                {/* Input Section */}
                <Card className="bg-white/5 backdrop-blur-sm border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white text-2xl">Research Paper Content</CardTitle>
                    <CardDescription className="text-gray-400">
                      Paste your research paper content to generate presentation slides
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
                        onClick={generatePresentation}
                        disabled={isGenerating || !paperContent.trim()}
                        className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-8 py-3 text-lg"
                      >
                        {isGenerating ? (
                          <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            Generating Presentation...
                          </>
                        ) : (
                          <>
                            <Presentation className="w-5 h-5 mr-2" />
                            Generate Presentation
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Progress */}
                {isGenerating && (
                  <Card className="bg-white/5 backdrop-blur-sm border-white/10">
                    <CardContent className="pt-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between text-white">
                          <span>Generating presentation slides...</span>
                          <span>{progress}%</span>
                        </div>
                        <Progress value={progress} className="h-2" />
                      </div>
                    </CardContent>
                  </Card>
                )}
              </>
            ) : (
              /* Presentation Display */
              <div className="space-y-6">
                {/* Controls */}
                <Card className="bg-white/5 backdrop-blur-sm border-white/10">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Button
                          onClick={() => setCurrentSlide(Math.max(0, currentSlide - 1))}
                          disabled={currentSlide === 0}
                          variant="outline"
                          className="text-white border-gray-600"
                        >
                          Previous
                        </Button>
                        <span className="text-white">
                          Slide {currentSlide + 1} of {presentation.slides.length}
                        </span>
                        <Button
                          onClick={() => setCurrentSlide(Math.min(presentation.slides.length - 1, currentSlide + 1))}
                          disabled={currentSlide === presentation.slides.length - 1}
                          variant="outline"
                          className="text-white border-gray-600"
                        >
                          Next
                        </Button>
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={downloadPresentation} className="bg-purple-600 hover:bg-purple-700">
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                        <Button
                          onClick={() => setPresentation(null)}
                          variant="outline"
                          className="text-white border-gray-600"
                        >
                          Generate New
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Current Slide */}
                <Card className="bg-white/5 backdrop-blur-sm border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white text-3xl text-center">
                      {presentation.slides[currentSlide]?.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {presentation.slides[currentSlide]?.content.map((point, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0" />
                          <p className="text-gray-300 text-lg">{point}</p>
                        </div>
                      ))}
                    </div>
                    {presentation.slides[currentSlide]?.speakerNotes && (
                      <div className="mt-8 p-4 bg-black/20 rounded-lg">
                        <h4 className="text-white font-semibold mb-2">Speaker Notes:</h4>
                        <p className="text-gray-400">{presentation.slides[currentSlide].speakerNotes}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Slide Thumbnails */}
                <Card className="bg-white/5 backdrop-blur-sm border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white">All Slides</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {presentation.slides.map((slide, index) => (
                        <div
                          key={index}
                          onClick={() => setCurrentSlide(index)}
                          className={`p-3 rounded-lg cursor-pointer transition-all ${
                            currentSlide === index
                              ? "bg-blue-500/20 border-2 border-blue-400"
                              : "bg-white/5 border border-white/10 hover:bg-white/10"
                          }`}
                        >
                          <div className="text-white text-sm font-semibold mb-2">Slide {index + 1}</div>
                          <div className="text-gray-400 text-xs truncate">{slide.title}</div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
