// pages/api/ai/generate-section.js
import { callClaude } from '../../../utils/claude'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const {
      title,
      section,
      sectionIndex,
      totalSections,
      primaryKeyword,
      secondaryKeywords,
      tone,
      writingStyle,
      contentComplexity,
      targetAudience,
      requiresResearch,
      customInstructions
    } = req.body

    const prompt = [
      {
        role: 'user',
        content: `Write section ${sectionIndex + 1} of ${totalSections} for a ${tone} article titled "${title}". 

Section Outline:
${section}

Parameters:
- Primary Keyword: ${primaryKeyword}
- Secondary Keywords: ${secondaryKeywords}
- Style: ${writingStyle}
- Complexity: ${contentComplexity}
- Target Audience: ${targetAudience}
${customInstructions ? `- Custom Requirements: ${customInstructions}` : ''}

IMPORTANT FORMATTING REQUIREMENTS:
1. Use proper HTML tags:
   - <h2> for main headings (instead of ##)
   - <h3> for subheadings (instead of ###)
   - <p> for paragraphs
   - <ul> and <li> for lists
   - <blockquote> for quotes
2. Add line breaks between paragraphs
3. Ensure proper nesting of tags
4. Keep paragraphs concise (2-3 sentences) for better readability

Content Requirements:
1. Write engaging, in-depth content for each heading
2. Maintain ${tone} tone and ${writingStyle} style
3. Use appropriate complexity for ${contentComplexity} level
4. Include specific examples and practical applications
5. Write naturally flowing paragraphs
${requiresResearch ? `6. Include relevant statistics and expert opinions with placeholder citations [Source: Description]
7. Add credible source placeholders in brackets [Source: Relevant publication]` : ''}

${sectionIndex > 0 ? 'Ensure smooth transition from previous section.' : ''}
${sectionIndex < totalSections - 1 ? 'Set up transition to next section.' : ''}

Provide the content with proper HTML formatting for a rich text editor.`
      }
    ]

    const content = await callClaude(prompt, 0.7)

    // Clean up any markdown that might have slipped through
    const cleanContent = content
      .replace(/^##\s+/gm, '<h2>')
      .replace(/^###\s+/gm, '<h3>')
      .replace(/\n\n/g, '</p><p>')
      .trim()

    res.status(200).json({ content: cleanContent })
  } catch (error) {
    console.error('Error generating section:', error)
    res.status(500).json({ error: 'Failed to generate section content' })
  }
}