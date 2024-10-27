// pages/api/ai/generate-title.js
import { callClaude } from '../../../utils/claude'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { topic, primaryKeyword, tone } = req.body

    const prompt = [
      {
        role: 'user',
        content: `Create a natural, engaging title for a ${tone} article about "${topic}" that includes the keyword "${primaryKeyword}". 

STRICT RULES:
1. Maximum 70 characters
2. Must be a SINGLE phrase - NO COLONS OR SPLITS
3. Must include "${primaryKeyword}" naturally
4. NO "How to", "Why You Should", or similar generic starts
5. AVOID words like "Ultimate", "Complete", "Comprehensive"
6. Must sound natural, like a respected publication wrote it
7. NO clickbait or listicle style ("X Ways to...", "X Tips for...")
8. NO questions in the title

GOOD EXAMPLES:
- "Advanced SEO Strategies That Actually Drive Traffic"
- "The Psychology Behind Successful Sales Conversations"
- "Building High-Performance Remote Development Teams"
- "Effective Data Analysis Methods for Business Growth"

BAD EXAMPLES (DO NOT USE):
- "Sales Productivity Tips: Master Your Time Management"
- "How to Improve Your Marketing Strategy"
- "10 Ways to Boost Your SEO Rankings"
- "The Ultimate Guide to Content Marketing"

Provide only the title without any explanations or additional text.`
      }
    ]

    const title = await callClaude(prompt, 0.7)
    res.status(200).json({ title: title.trim() })
  } catch (error) {
    console.error('Error generating title:', error)
    res.status(500).json({ error: 'Failed to generate title' })
  }
}