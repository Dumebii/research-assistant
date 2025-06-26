"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Mic, Download, Loader2, ArrowLeft } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import Navbar from "@/components/navbar"
import { SparklesCore } from "@/components/sparkles"
import Link from "next/link"

interface PodcastScript {
  title: string
  duration: string
  segments: {
    timestamp: string
    speaker: string
    content: string
    notes?: string
  }[]
}

export default function CreatePodcastPage() {
  const [paperContent, setPaperContent] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [progress, setProgress] = useState(0)
  const [podcastScript, setPodcastScript] = useState<PodcastScript | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  const generatePodcast = async () => {
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
          contentType: "podcast",
          analysisResult: null,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate podcast script")
      }

      const result = await response.json()

      // Parse the generated content into podcast format
      const lines = result.generatedContent.split("\n").filter((line: string) => line.trim())
      const segments: PodcastScript["segments"] = []
      let currentTime = 0

      lines.forEach((line: string, index: number) => {
        if (line.trim()) {
          const minutes = Math.floor(currentTime / 60)
          const seconds = currentTime % 60
          const timestamp = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`

          segments.push({
            timestamp,
            speaker: index % 2 === 0 ? "Host" : "Expert",
            content: line.trim(),
            notes: index === 0 ? "Introduction" : index === lines.length - 1 ? "Conclusion" : undefined,
          })

          // Estimate 3 seconds per 10 words
          const wordCount = line.split(" ").length
          currentTime += Math.max(3, Math.floor(wordCount / 10) * 3)
        }
      })

      const script: PodcastScript = {
        title: "Research Podcast: Key Insights",
        duration: `${Math.floor(currentTime / 60)}:${(currentTime % 60).toString().padStart(2, "0")}`,
        segments,
      }

      setPodcastScript(script)
      setProgress(100)
    } catch (error) {
      console.error("Generation error:", error)
      alert("Failed to generate podcast script. Please try again.")
    } finally {
      clearInterval(progressInterval)
      setIsGenerating(false)
    }
  }

  const downloadScript = () => {
    if (!podcastScript) return

    const content = `# ${podcastScript.title}\n\n**Duration:** ${podcastScript.duration}\n\n${podcastScript.segments
      .map(
        (segment) =>
          `## ${segment.timestamp} - ${segment.speaker}\n\n${segment.content}\n\n${segment.notes ? `*${segment.notes}*\n\n` : ""}---\n`,
      )
      .join("")}`

    const blob = new Blob([content], { type: "text/markdown" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "podcast-script.md"
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
              <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center mb-6">
                <Mic className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                Create
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600">
                  {" "}
                  Podcast
                </span>
              </h1>
              <p className="text-gray-400 text-xl max-w-3xl mx-auto">
                Transform your research into engaging podcast scripts with Grok AI
              </p>
            </div>
          </motion.div>

          <div className="max-w-4xl mx-auto space-y-8">
            {!podcastScript ? (
              <>
                <Card className="bg-white/5 backdrop-blur-sm border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white text-2xl">Research Paper Content</CardTitle>
                    <CardDescription className="text-gray-400">
                      Paste your research paper content to generate a podcast script
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
                        onClick={generatePodcast}
                        disabled={isGenerating || !paperContent.trim()}
                        className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-8 py-3 text-lg"
                      >
                        {isGenerating ? (
                          <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            Generating Script...
                          </>
                        ) : (
                          <>
                            <Mic className="w-5 h-5 mr-2" />
                            Generate Podcast Script
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
                          <span>Generating podcast script...</span>
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
                {/* Podcast Info */}
                <Card className="bg-white/5 backdrop-blur-sm border-white/10">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-white text-2xl">{podcastScript.title}</CardTitle>
                        <CardDescription className="text-gray-400">
                          Duration: {podcastScript.duration} • {podcastScript.segments.length} segments
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={downloadScript} className="bg-purple-600 hover:bg-purple-700">
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                        <Button
                          onClick={() => setPodcastScript(null)}
                          variant="outline"
                          className="text-white border-gray-600"
                        >
                          Generate New
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                </Card>

                {/* Script Segments */}
                <Card className="bg-white/5 backdrop-blur-sm border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white">Podcast Script</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {podcastScript.segments.map((segment, index) => (
                        <div key={index} className="border-l-4 border-green-500 pl-4">
                          <div className="flex items-center gap-4 mb-2">
                            <span className="text-green-400 font-mono text-sm">{segment.timestamp}</span>
                            <span className="text-white font-semibold">{segment.speaker}</span>
                            {segment.notes && (
                              <span className="text-xs bg-green-500/20 text-green-300 px-2 py-1 rounded">
                                {segment.notes}
                              </span>
                            )}
                          </div>
                          <p className="text-gray-300 leading-relaxed">{segment.content}</p>
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
