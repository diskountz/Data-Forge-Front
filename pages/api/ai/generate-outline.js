// pages/api/ai/generate-outline.js
import { callClaude } from '../../../utils/claude'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const {
      title,
      primaryKeyword,
      secondaryKeywords,
      size,
      tone,
      writingStyle,
      contentComplexity,
      targetAudience,
      customInstructions
    } = req.body

    const prompt = [
      {
        role: 'user',
        content: `Create a detailed outline for a ${tone} article titled "${title}". 

Article Parameters:
- Primary Keyword: ${primaryKeyword}
- Secondary Keywords: ${secondaryKeywords}
- Length: ${size.words} words
- Style: ${writingStyle}
- Complexity: ${contentComplexity}
- Target Audience: ${targetAudience}
${customInstructions ? `- Custom Requirements: ${customInstructions}` : ''}

Requirements:
1. Create exactly ${size.headings} main sections (H2)
2. Include 2-3 subsections (H3) under each main section
3. Focus on depth and unique insights
4. Cover advanced/technical aspects
5. Include sections for case studies or real-world applications
6. Each main section should solve a specific problem or address a distinct aspect and Address common misconceptions
7. Provide actionable takeaways
8. Consider SEO structure and featured snippet opportunities

Format:
- Use ## for H2 headings
- Use ### for H3 headings
- No content under headings, just the structure
- No bullet points or numbering

AVOID:
- Generic introductions or "In this article" statements
- Filler sections or redundant information
- Obvious or basic information
- Unnecessary background information
- Fluff or padding content

Provide only the outline structure without any additional text or explanations.`
      }
    ]

    const outline = await callClaude(prompt, 0.7)
    res.status(200).json({ outline: outline.trim() })
  } catch (error) {
    console.error('Error generating outline:', error)
    res.status(500).json({ error: 'Failed to generate outline' })
  }
}