"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { motion } from "framer-motion"
import { Upload, FileText, Brain, Loader2, CheckCircle, AlertCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import Navbar from "@/components/navbar"
import { SparklesCore } from "@/components/sparkles"
import Link from "next/link"
import { Presentation, Mic, BarChart3 } from "lucide-react"

interface AnalysisResult {
  title: string
  abstract: string
  keyFindings: string[]
  methodology: string
  citations: number
  readingTime: string
  complexity: "Low" | "Medium" | "High"
  topics: string[]
}

export default function UploadPage() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisProgress, setAnalysisProgress] = useState(0)
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isDragActive, setIsDragActive] = useState(false)

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragActive(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragActive(false)
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragActive(false)

    const files = Array.from(e.dataTransfer.files)
    const file = files[0]

    if (file && isValidFileType(file)) {
      setUploadedFile(file)
      setError(null)
      setAnalysisResult(null)
    } else {
      setError("Please upload a valid file (PDF, DOC, DOCX, or TXT)")
    }
  }, [])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && isValidFileType(file)) {
      setUploadedFile(file)
      setError(null)
      setAnalysisResult(null)
    } else {
      setError("Please upload a valid file (PDF, DOC, DOCX, or TXT)")
    }
  }, [])

  const isValidFileType = (file: File) => {
    const validTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
    ]
    return validTypes.includes(file.type) && file.size <= 10 * 1024 * 1024 // 10MB
  }

  const analyzeWithGrok = async () => {
    if (!uploadedFile) return

    setIsAnalyzing(true)
    setAnalysisProgress(0)
    setError(null)

    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setAnalysisProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 500)

      // Create FormData for file upload
      const formData = new FormData()
      formData.append("file", uploadedFile)

      const response = await fetch("/api/analyze-paper", {
        method: "POST",
        body: formData,
      })

      clearInterval(progressInterval)

      if (!response.ok) {
        throw new Error("Failed to analyze paper")
      }

      const result = await response.json()
      setAnalysisProgress(100)
      setAnalysisResult(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred during analysis")
    } finally {
      setIsAnalyzing(false)
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
              Upload Your
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
                {" "}
                Research Paper
              </span>
            </h1>
            <p className="text-gray-400 text-xl max-w-3xl mx-auto">
              Let our AI-powered by Grok analyze your research and transform it into engaging content formats.
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto space-y-8">
            {/* Upload Section */}
            <Card className="bg-white/5 backdrop-blur-sm border-white/10">
              <CardHeader>
                <CardTitle className="text-white text-2xl flex items-center">
                  <Upload className="w-6 h-6 mr-2" />
                  Upload Document
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Supported formats: PDF, DOC, DOCX, TXT (Max 10MB)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div
                  onDragEnter={handleDragEnter}
                  onDragLeave={handleDragLeave}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-300 ${
                    isDragActive
                      ? "border-purple-500 bg-purple-500/10"
                      : "border-gray-600 hover:border-purple-500 hover:bg-white/5"
                  }`}
                >
                  <input
                    type="file"
                    onChange={handleFileSelect}
                    accept=".pdf,.doc,.docx,.txt"
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    {uploadedFile ? (
                      <div className="space-y-4">
                        <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
                        <div>
                          <p className="text-white font-medium">{uploadedFile.name}</p>
                          <p className="text-gray-400 text-sm">{(uploadedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                        <Button
                          onClick={analyzeWithGrok}
                          disabled={isAnalyzing}
                          className="bg-purple-600 hover:bg-purple-700"
                        >
                          {isAnalyzing ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Analyzing with Grok AI...
                            </>
                          ) : (
                            <>
                              <Brain className="w-4 h-4 mr-2" />
                              Analyze with Grok AI
                            </>
                          )}
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <FileText className="w-16 h-16 text-gray-400 mx-auto" />
                        <div>
                          <p className="text-white font-medium">
                            {isDragActive ? "Drop your file here" : "Drag & drop your research paper here"}
                          </p>
                          <p className="text-gray-400">or click to browse files</p>
                        </div>
                      </div>
                    )}
                  </label>
                </div>
              </CardContent>
            </Card>

            {/* Analysis Progress */}
            {isAnalyzing && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <Card className="bg-white/5 backdrop-blur-sm border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white text-xl flex items-center">
                      <Brain className="w-5 h-5 mr-2 text-purple-400" />
                      Grok AI Analysis in Progress
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Progress value={analysisProgress} className="w-full" />
                    <p className="text-gray-400 text-center">{analysisProgress}% Complete</p>
                    <div className="text-sm text-gray-400 space-y-1">
                      <p>• Extracting text and structure...</p>
                      <p>• Identifying key concepts and findings...</p>
                      <p>• Analyzing methodology and citations...</p>
                      <p>• Generating insights and summaries...</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Error Display */}
            {error && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <Card className="bg-red-500/10 backdrop-blur-sm border-red-500/20">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-3">
                      <AlertCircle className="w-6 h-6 text-red-400" />
                      <div>
                        <p className="text-red-400 font-medium">Analysis Failed</p>
                        <p className="text-red-300 text-sm">{error}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Analysis Results */}
            {analysisResult && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-6"
              >
                <Card className="bg-white/5 backdrop-blur-sm border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white text-2xl flex items-center">
                      <CheckCircle className="w-6 h-6 mr-2 text-green-500" />
                      Analysis Complete
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Paper Overview */}
                    <div>
                      <h3 className="text-white text-xl font-semibold mb-3">{analysisResult.title}</h3>
                      <p className="text-gray-300 leading-relaxed">{analysisResult.abstract}</p>
                    </div>

                    {/* Key Metrics */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-white/5 rounded-lg p-4 text-center">
                        <div className="text-2xl font-bold text-purple-400">{analysisResult.citations}</div>
                        <div className="text-gray-400 text-sm">Citations</div>
                      </div>
                      <div className="bg-white/5 rounded-lg p-4 text-center">
                        <div className="text-2xl font-bold text-blue-400">{analysisResult.readingTime}</div>
                        <div className="text-gray-400 text-sm">Reading Time</div>
                      </div>
                      <div className="bg-white/5 rounded-lg p-4 text-center">
                        <div
                          className={`text-2xl font-bold ${
                            analysisResult.complexity === "High"
                              ? "text-red-400"
                              : analysisResult.complexity === "Medium"
                                ? "text-yellow-400"
                                : "text-green-400"
                          }`}
                        >
                          {analysisResult.complexity}
                        </div>
                        <div className="text-gray-400 text-sm">Complexity</div>
                      </div>
                      <div className="bg-white/5 rounded-lg p-4 text-center">
                        <div className="text-2xl font-bold text-cyan-400">{analysisResult.topics.length}</div>
                        <div className="text-gray-400 text-sm">Topics</div>
                      </div>
                    </div>

                    {/* Key Findings */}
                    <div>
                      <h4 className="text-white text-lg font-semibold mb-3">Key Findings</h4>
                      <ul className="space-y-2">
                        {analysisResult.keyFindings.map((finding, index) => (
                          <li key={index} className="text-gray-300 flex items-start">
                            <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0" />
                            {finding}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Topics */}
                    <div>
                      <h4 className="text-white text-lg font-semibold mb-3">Research Topics</h4>
                      <div className="flex flex-wrap gap-2">
                        {analysisResult.topics.map((topic, index) => (
                          <div
                            key={index}
                            className="bg-purple-600/20 text-purple-300 border border-purple-500/30 rounded-full px-3 py-1 text-sm"
                          >
                            {topic}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-4 pt-4">
                      <Link href="/generate/presentation">
                        <Button className="bg-purple-600 hover:bg-purple-700">
                          <Presentation className="w-4 h-4 mr-2" />
                          Generate Presentation
                        </Button>
                      </Link>
                      <Link href="/generate/podcast">
                        <Button variant="outline" className="text-white border-gray-600 hover:bg-white/10">
                          <Mic className="w-4 h-4 mr-2" />
                          Create Podcast
                        </Button>
                      </Link>
                      <Link href="/generate/visual-summary">
                        <Button variant="outline" className="text-white border-gray-600 hover:bg-white/10">
                          <BarChart3 className="w-4 h-4 mr-2" />
                          Visual Summary
                        </Button>
                      </Link>
                      <Link href="/generate/executive-summary">
                        <Button variant="outline" className="text-white border-gray-600 hover:bg-white/10">
                          <FileText className="w-4 h-4 mr-2" />
                          Executive Summary
                        </Button>
                      </Link>
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
