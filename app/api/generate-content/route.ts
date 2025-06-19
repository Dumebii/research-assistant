import { type NextRequest, NextResponse } from "next/server"
import { xai } from "@ai-sdk/xai"
import { generateText } from "ai"

export async function POST(request: NextRequest) {
  try {
    const { paperContent, contentType, analysisResult } = await request.json()

    if (!paperContent || !contentType) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 })
    }

    let systemPrompt = ""
    let userPrompt = ""

    switch (contentType) {
      case "presentation":
        systemPrompt = `You are an expert presentation designer. Create a compelling slide presentation from research papers. 
        Generate a structured presentation with clear slides, each containing a title, bullet points, and speaker notes.
        Format as JSON with slides array containing: title, content, speakerNotes.`
        userPrompt = `Create a 10-15 slide presentation from this research paper analysis: ${JSON.stringify(analysisResult)}\n\nOriginal content: ${paperContent.slice(0, 4000)}`
        break

      case "podcast":
        systemPrompt = `You are a podcast script writer. Transform research papers into engaging audio content.
        Create a conversational script with natural dialogue, explanations, and engaging storytelling.
        Include timestamps and speaker cues.`
        userPrompt = `Create a 15-20 minute podcast script from this research: ${JSON.stringify(analysisResult)}\n\nContent: ${paperContent.slice(0, 4000)}`
        break

      case "summary":
        systemPrompt = `You are an executive summary writer. Create concise, actionable summaries of research papers.
        Focus on key insights, implications, and recommendations for decision-makers.`
        userPrompt = `Create an executive summary from this research analysis: ${JSON.stringify(analysisResult)}\n\nContent: ${paperContent.slice(0, 4000)}`
        break

      case "visual":
        systemPrompt = `You are a data visualization expert. Create descriptions for visual content based on research papers.
        Suggest charts, infographics, and visual elements that would best represent the data and findings.`
        userPrompt = `Suggest visual representations for this research: ${JSON.stringify(analysisResult)}\n\nContent: ${paperContent.slice(0, 4000)}`
        break

      default:
        return NextResponse.json({ error: "Invalid content type" }, { status: 400 })
    }

    const { text: generatedContent } = await generateText({
      model: xai("grok-3"),
      system: systemPrompt,
      prompt: userPrompt,
    })

    return NextResponse.json({
      contentType,
      generatedContent,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Content generation error:", error)
    return NextResponse.json({ error: "Failed to generate content" }, { status: 500 })
  }
}
