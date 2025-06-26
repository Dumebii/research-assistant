"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { FileText, Download, Loader2, ArrowLeft } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import Navbar from "@/components/navbar"
import { SparklesCore } from "@/components/sparkles"
import Link from "next/link"

interface ExecutiveSummary {
  title: string
  overview: string
  keyFindings: string[]
  implications: string[]
  recommendations: string[]
  conclusion: string
}

export default function ExecutiveSummaryPage() {
  const [paperContent, setPaperContent] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [progress, setProgress] = useState(0)
  const [executiveSummary, setExecutiveSummary] = useState<ExecutiveSummary | null>(null)

  const generateExecutiveSummary = async () => {
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
          contentType: "summary",
          analysisResult: null,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate executive summary")
      }

      const result = await response.json()

      // Parse the generated content into structured summary
      const content = result.generatedContent
      const sections = content.split("\n\n").filter((section: string) => section.trim())

      const summary: ExecutiveSummary = {
        title: "Executive Summary",
        overview: sections[0] || "This research provides valuable insights into the studied domain.",
        keyFindings: [
          "Primary research findings demonstrate significant patterns",
          "Data analysis reveals important correlations",
          "Methodology validation confirms research approach effectiveness",
        ],
        implications: [
          "Results have direct applications in the field",
          "Findings contribute to existing knowledge base",
          "Research opens new avenues for future investigation",
        ],
        recommendations: [
          "Implement findings in practical applications",
          "Conduct follow-up studies to validate results",
          "Consider broader implementation strategies",
        ],
        conclusion:
          sections[sections.length - 1] ||
          "This research contributes valuable insights to the field and provides a foundation for future work.",
      }

      // Try to extract more specific content from the generated text
      if (content.includes("findings") || content.includes("results")) {
        const findingsMatch = content.match(/(?:findings|results)[:\s]+(.*?)(?:\n\n|$)/i)
        if (findingsMatch) {
          summary.keyFindings = [findingsMatch[1].trim()]
        }
      }

      setExecutiveSummary(summary)
      setProgress(100)
    } catch (error) {
      console.error("Generation error:", error)
      alert("Failed to generate executive summary. Please try again.")
    } finally {
      clearInterval(progressInterval)
      setIsGenerating(false)
    }
  }

  const downloadSummary = () => {
    if (!executiveSummary) return

    const content = `# ${executiveSummary.title}\n\n## Overview\n${executiveSummary.overview}\n\n## Key Findings\n${executiveSummary.keyFindings.map((f) => `- ${f}`).join("\n")}\n\n## Implications\n${executiveSummary.implications.map((i) => `- ${i}`).join("\n")}\n\n## Recommendations\n${executiveSummary.recommendations.map((r) => `- ${r}`).join("\n")}\n\n## Conclusion\n${executiveSummary.conclusion}`

    const blob = new Blob([content], { type: "text/markdown" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "executive-summary.md"
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
              <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center mb-6">
                <FileText className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                Executive
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
                  {" "}
                  Summary
                </span>
              </h1>
              <p className="text-gray-400 text-xl max-w-3xl mx-auto">
                Generate concise executive summaries for decision-makers with Grok AI
              </p>
            </div>
          </motion.div>

          <div className="max-w-4xl mx-auto space-y-8">
            {!executiveSummary ? (
              <>
                <Card className="bg-white/5 backdrop-blur-sm border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white text-2xl">Research Paper Content</CardTitle>
                    <CardDescription className="text-gray-400">
                      Paste your research paper content to generate an executive summary
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
                        onClick={generateExecutiveSummary}
                        disabled={isGenerating || !paperContent.trim()}
                        className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-3 text-lg"
                      >
                        {isGenerating ? (
                          <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            Generating Summary...
                          </>
                        ) : (
                          <>
                            <FileText className="w-5 h-5 mr-2" />
                            Generate Executive Summary
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
                          <span>Generating executive summary...</span>
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
                      <CardTitle className="text-white text-2xl">{executiveSummary.title}</CardTitle>
                      <div className="flex gap-2">
                        <Button onClick={downloadSummary} className="bg-purple-600 hover:bg-purple-700">
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                        <Button
                          onClick={() => setExecutiveSummary(null)}
                          variant="outline"
                          className="text-white border-gray-600"
                        >
                          Generate New
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                </Card>

                {/* Overview */}
                <Card className="bg-white/5 backdrop-blur-sm border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white text-xl">Overview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-300 leading-relaxed">{executiveSummary.overview}</p>
                  </CardContent>
                </Card>

                {/* Key Findings */}
                <Card className="bg-white/5 backdrop-blur-sm border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white text-xl">Key Findings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {executiveSummary.keyFindings.map((finding, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0" />
                          <p className="text-gray-300">{finding}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Implications & Recommendations */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="bg-white/5 backdrop-blur-sm border-white/10">
                    <CardHeader>
                      <CardTitle className="text-white text-xl">Implications</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {executiveSummary.implications.map((implication, index) => (
                          <div key={index} className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0" />
                            <p className="text-gray-300 text-sm">{implication}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white/5 backdrop-blur-sm border-white/10">
                    <CardHeader>
                      <CardTitle className="text-white text-xl">Recommendations</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {executiveSummary.recommendations.map((recommendation, index) => (
                          <div key={index} className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0" />
                            <p className="text-gray-300 text-sm">{recommendation}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Conclusion */}
                <Card className="bg-white/5 backdrop-blur-sm border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white text-xl">Conclusion</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-300 leading-relaxed">{executiveSummary.conclusion}</p>
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
