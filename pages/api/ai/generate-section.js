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

    const isIntroduction = section.includes('Introduction') || sectionIndex === 0
    const isConclusion = section.includes('Conclusion') || sectionIndex === totalSections - 1

    const naturalLanguageRequirements = `
NATURAL LANGUAGE PATTERNS:
1. Sentence Length Variation:
   - Use 30% short sentences (1-8 words)
   - Use 40% medium sentences (9-15 words)
   - Use 30% long sentences (16-25 words)
   - Include occasional very short sentences for emphasis
   - Break grammar rules occasionally for effect

2. Paragraph Structure:
   - Vary paragraph lengths (1-5 sentences)
   - Mix standalone sentences between paragraphs
   - Use occasional one-word paragraphs for emphasis
   - Include natural fragments where appropriate
   - Break paragraphs mid-thought sometimes

3. Speech Patterns:
   - Include natural speech hesitations (well, actually, you see)
   - Add parenthetical asides (natural ones)
   - Use contractions naturally
   - Mix formal and informal language
   - Include occasional self-corrections
   - Drop words like in natural speech

4. Break AI Patterns:
   - Avoid symmetrical sentence structures
   - Break the "rule of three" pattern
   - Mix bullet point lengths
   - Vary transition phrases
   - Use unexpected analogies
   - Break perfect parallelism
   - Interrupt thought patterns naturally

5. Style Variations:
   - Switch between abstract and concrete randomly
   - Mix metaphors with direct language
   - Include occasional slang (industry appropriate)
   - Vary technical density within paragraphs
   - Use unexpected word choices
   - Break standard paragraph flow

6. Value and Engagement:
   - Provide unique, non-obvious insights
   - Challenge common assumptions
   - Share specific examples with results
   - Create intellectual surprises
   - Build natural flow
   - Show deep expertise naturally`

    const contentRandomization = `
REQUIRED PATTERN BREAKS:
1. Section Structure Variation (Choose ONE randomly for each section):
   Pattern A: Disruption-First
   - Open with controversial statement
   - Present unexpected data
   - Challenge common practice
   - Reveal deeper insights
   - Share practical application

   Pattern B: Story-Evolution
   - Begin with failure scenario
   - Unpack root causes
   - Present research findings
   - Show transformation
   - Extract principles

   Pattern C: Insight-Action
   - Start with expert observation
   - Deep-dive analysis
   - Connect seemingly unrelated concepts
   - Present actionable framework
   - Project future implications

   Pattern D: Problem-Reframe
   - Present common assumption
   - Show why it's wrong
   - Reveal complexity
   - Offer new perspective
   - Build practical solution

   Pattern E: Data-Story
   - Lead with surprising statistic
   - Human impact story
   - Broader implications
   - Strategic approach
   - Implementation reality

2. Enforce Pattern Breaking:
   - Must switch patterns between sections
   - Break chosen pattern halfway through
   - Insert unexpected tangents
   - Change perspective suddenly
   - Mix analytical and narrative elements
   - Vary technical depth randomly

3. Natural Disruptions:
   - Add mid-thought breaks
   - Include relevant digressions
   - Question your own points
   - Share conflicting experiences
   - Add uncertainty where appropriate
   - Break formal structure occasionally

4. Content Flow Variations:
   - Alternate between high-level and detailed
   - Mix theory and practice randomly
   - Blend success and failure stories
   - Switch between past, present, future
   - Combine different expert viewpoints
   - Break expected information flow`

    const prompt = [
      {
        role: 'user',
        content: `Write ${isIntroduction ? 'an introduction' : isConclusion ? 'a conclusion' : `section ${sectionIndex + 1} of ${totalSections}`} for a ${tone} article titled "${title}".

SECTION TO WRITE:
${section}

CONTENT STRUCTURE REQUIREMENTS:
${isIntroduction ? `
- Maximum 120 words
- Hook with a specific pain point or challenge
- Include a relevant statistic or observation
- Present the value proposition clearly
- No generic introductions or "In this article" statements
- Set up the article's journey without listing contents` : isConclusion ? `
- Maximum 120 words
- Recap the main actionable takeaway
- Include a specific, compelling call-to-action
- Create urgency without being pushy
- Focus on the next step reader should take
- No generic summaries or "In conclusion" statements` : `
- Break complex ideas into digestible chunks
- Each point must have a practical example
- Include specific scenarios with results
- Add common pitfalls and solutions
- Provide implementation guidance naturally
- Include decision frameworks with criteria
- Add troubleshooting tips for challenges
- Show clear expertise through examples`}

ANTI-TEMPLATING REQUIREMENTS:
1. Section Structure:
   - Never follow the problem-example-solution-importance pattern
   - Avoid predictable progression of ideas
   - Break any pattern you find yourself following
   - Mix up how information is presented
   - Randomly alternate between story, analysis, and insight

2. Opening Variations (Never start sections with):
   - Generic statements about importance
   - Common industry observations
   - Standard definitions
   - "In today's world" type phrases
   - Problem statements
   Instead, open with:
   - Surprising data
   - Contrarian viewpoint
   - Specific scenario
   - Expert insight
   - Industry misconception

3. Content Flow:
   - Break expected reading patterns
   - Insert relevant tangents
   - Mix depth of technical detail
   - Switch perspectives
   - Blend different content types
   - Avoid linear progression

4. Tips and Examples:
   - Never use standalone "Pro Tips"
   - Integrate insights naturally within content
   - Present examples in varied formats
   - Break standard case study structure
   - Mix success and failure stories

${naturalLanguageRequirements}

${contentRandomization}

WRITING STYLE REQUIREMENTS:
1. Write in a ${tone}, ${writingStyle} style that connects with ${targetAudience}
2. Avoid clichés, marketing speak, and AI-typical phrases
3. Use varied sentence structures and natural transitions
4. Share insights as if explaining to a colleague
5. Include relevant analogies or metaphors
6. Write at ${contentComplexity} level while remaining accessible
7. Demonstrate deep understanding through specific examples
8. Challenge common assumptions with data
9. Provide fresh perspectives on standard topics

CREDIBILITY ELEMENTS:
${requiresResearch ? `
1. Include specific statistics with [Source] placeholders
2. Add expert insight placeholders [Expert: Role, Topic]
3. Reference industry benchmarks or standards
4. Include relevant research findings
5. Include relevant industry benchmarks
6. Cite specific statistics
7. Add data-driven examples
8. Reference real tools and platforms
9. Mention industry standards
10. Share actual implementation metrics` : ''}

SEO REQUIREMENTS:
- Include "${primaryKeyword}" naturally in first paragraph
- Use it in one H2 heading where relevant
- Add semantic variations throughout
- Integrate secondary keywords naturally
- Structure content for featured snippets
- Use clear heading hierarchy
- Include relevant LSI keywords

FORMAT OUTPUT WITH HTML:
- Use <h2> for main headings
- Use <h3> for subheadings
- Use <p> for paragraphs
- Use <div class="example"> for examples
- Use <div class="implementation"> for guides
- Break formatting patterns occasionally

STRICTLY AVOID:
- Generic advice without specifics
- Repetitive phrases or structures
- Overuse of any pattern
- Marketing buzzwords
- Obvious statements
- Unnecessary pro tips
- Filler content
- AI-typical phrases
- Vague recommendations
- Any variation of:
  * "The key is/here is..."
  * "For example/for instance..."
  * "Let's say..."
  * "Think about it..."
  * "You see..."
  * "What this looks like in practice:"
  * "Implementation Steps:"
  * "How to..."
  * "Let's be real"
  * "Now, I know what you're thinking..."
  * "But here's the thing..."
  * "At the end of the day..."
  * "When it comes to..."
  * "In today's world..."
  * "The truth is..."
  * "The fact is..."
  * "The bottom line..."
  * "It goes without saying..."
  * "Needless to say..."
  * "As you can imagine..."

${customInstructions ? `CUSTOM REQUIREMENTS: ${customInstructions}` : ''}

Remember: Write as a genuine expert sharing valuable insights conversationally, allowing natural imperfections while maintaining high value and engagement. Break any patterns you notice forming in your writing.`
      }
    ]

    const content = await callClaude(prompt, 0.7)

    const cleanContent = content
      .replace(/^##\s+/gm, (match) => {
        return Math.random() > 0.3 ? '<h2>' : '<h2 class="alternate-style">'
      })
      .replace(/^###\s+/gm, (match) => {
        return Math.random() > 0.3 ? '<h3>' : '<h3 class="alternate-style">'
      })
      .replace(/\[Expert:[^\]]+\]/g, (match) => {
        const styles = ['expert-quote', 'expert-insight', 'industry-expert']
        const randomStyle = styles[Math.floor(Math.random() * styles.length)]
        return `<div class="${randomStyle}">${match}</div>`
      })
      .replace(/\n\n/g, (match) => {
        return Math.random() > 0.2 ? '</p><p>' : '</p><p class="emphasis">'
      })
      .trim()

    res.status(200).json({ content: cleanContent })
  } catch (error) {
    console.error('Error generating section:', error)
    res.status(500).json({ error: 'Failed to generate section content' })
  }
}