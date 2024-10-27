// pages/admin/posts/ai-generator.js
import { useState, useEffect } from 'react'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { useRouter } from 'next/router'
import AdminLayout from '../../../components/AdminLayout'
import { Alert, AlertDescription } from '../../../components/ui/alert'
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/card'
import { Wand2, Loader2, RefreshCcw, CheckCircle, ChevronRight } from 'lucide-react'

export default function AIArticleGenerator() {
  const router = useRouter()
  const supabase = useSupabaseClient()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [generatingStep, setGeneratingStep] = useState(null) // 'outline', 'content', null
  const [contentSettings, setContentSettings] = useState(null)
  const [progress, setProgress] = useState(0)

  const [articleParams, setArticleParams] = useState({
    topic: '',
    primaryKeyword: '',
    secondaryKeywords: '',
    articleSize: 'small', // small, medium, large
    tone: 'professional',
    writingStyle: 'informative',
    contentComplexity: 'intermediate',
    targetAudience: '',
    targetCountries: [],
    requiresResearch: true,
    customInstructions: ''
  })

  const [generatedContent, setGeneratedContent] = useState({
    outline: null,
    sections: [],
    title: null
  })

  useEffect(() => {
    fetchContentSettings()
  }, [])

  async function fetchContentSettings() {
    try {
      const { data, error } = await supabase
        .from('content_settings')
        .select('settings')
        .single()

      if (error) throw error
      if (data) {
        setContentSettings(data.settings)
        // Pre-fill some article params from settings
        setArticleParams(prev => ({
          ...prev,
          tone: data.settings.content_preferences.default_tone,
          writingStyle: data.settings.content_preferences.writing_style,
          contentComplexity: data.settings.content_preferences.content_complexity,
          targetCountries: data.settings.content_preferences.target_countries,
        }))
      }
    } catch (error) {
      console.error('Error fetching settings:', error)
    }
  }

  const articleSizes = {
    small: { words: '1000-1500', headings: '5-7' },
    medium: { words: '2000-3000', headings: '8-11' },
    large: { words: '3500-5000', headings: '12-15' }
  }

  const toneOptions = [
    'professional', 'technical', 'friendly', 'casual',
    'authoritative', 'conversational', 'formal', 'humorous'
  ]

  const writingStyles = [
    'informative', 'analytical', 'storytelling',
    'persuasive', 'descriptive', 'tutorial'
  ]

  const complexityLevels = [
    'beginner', 'intermediate', 'advanced', 'expert'
  ]

  async function generateTitle() {
    try {
      const response = await fetch('/api/ai/generate-title', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: articleParams.topic,
          primaryKeyword: articleParams.primaryKeyword,
          tone: articleParams.tone
        })
      })

      if (!response.ok) throw new Error('Failed to generate title')
      const data = await response.json()
      setGeneratedContent(prev => ({ ...prev, title: data.title }))
      return data.title
    } catch (error) {
      throw new Error('Failed to generate title: ' + error.message)
    }
  }

  async function generateOutline(title) {
    try {
      const response = await fetch('/api/ai/generate-outline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          ...articleParams,
          size: articleSizes[articleParams.articleSize]
        })
      })

      if (!response.ok) throw new Error('Failed to generate outline')
      const data = await response.json()
      setGeneratedContent(prev => ({ ...prev, outline: data.outline }))
      return data.outline
    } catch (error) {
      throw new Error('Failed to generate outline: ' + error.message)
    }
  }

  async function generateContent(title, outline) {
    try {
      const sections = outline.split('\n\n')
      const results = []

      for (let i = 0; i < sections.length; i++) {
        setProgress(Math.round((i / sections.length) * 100))

        const response = await fetch('/api/ai/generate-section', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title,
            section: sections[i],
            sectionIndex: i,
            totalSections: sections.length,
            ...articleParams
          })
        })

        if (!response.ok) throw new Error(`Failed to generate section ${i + 1}`)
        const data = await response.json()
        results.push(data.content)
        setGeneratedContent(prev => ({
          ...prev,
          sections: [...prev.sections, data.content]
        }))
      }

      return results.join('\n\n')
    } catch (error) {
      throw new Error('Failed to generate content: ' + error.message)
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setGeneratedContent({ outline: null, sections: [], title: null })
    setProgress(0)

    try {
      // Generate Title
      setGeneratingStep('title')
      const title = await generateTitle()

      // Generate Outline
      setGeneratingStep('outline')
      const outline = await generateOutline(title)

      // Generate Content
      setGeneratingStep('content')
      const content = await generateContent(title, outline)

      // Create draft post
      const { data: post, error: postError } = await supabase
        .from('posts')
        .insert([{
          title,
          content,
          status: 'draft',
          author_id: (await supabase.auth.getUser()).data.user.id,
          created_at: new Date().toISOString(),
          is_ai_generated: true,
          generated_metadata: {
            topic: articleParams.topic,
            primaryKeyword: articleParams.primaryKeyword,
            secondaryKeywords: articleParams.secondaryKeywords,
            tone: articleParams.tone,
            writingStyle: articleParams.writingStyle,
            contentComplexity: articleParams.contentComplexity,
            articleSize: articleParams.articleSize,
            generatedAt: new Date().toISOString()
          }
        }])
        .select()
        .single()

      if (postError) throw postError

      // Redirect to post editor
      router.push(`/admin/posts/${post.id}`)
    } catch (error) {
      setError(error.message)
      setLoading(false)
    }
  }

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">AI Article Generator</h1>
          <p className="mt-2 text-gray-600">
            Generate comprehensive, well-researched articles using AI
          </p>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Topic
                </label>
                <input
                  type="text"
                  value={articleParams.topic}
                  onChange={(e) => setArticleParams(prev => ({
                    ...prev,
                    topic: e.target.value
                  }))}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-pool focus:ring focus:ring-emerald-pool focus:ring-opacity-50"
                  placeholder="e.g., Advanced SEO Techniques for E-commerce"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Primary Keyword
                </label>
                <input
                  type="text"
                  value={articleParams.primaryKeyword}
                  onChange={(e) => setArticleParams(prev => ({
                    ...prev,
                    primaryKeyword: e.target.value
                  }))}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-pool focus:ring focus:ring-emerald-pool focus:ring-opacity-50"
                  placeholder="e.g., e-commerce SEO"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Secondary Keywords (comma-separated)
                </label>
                <input
                  type="text"
                  value={articleParams.secondaryKeywords}
                  onChange={(e) => setArticleParams(prev => ({
                    ...prev,
                    secondaryKeywords: e.target.value
                  }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-pool focus:ring focus:ring-emerald-pool focus:ring-opacity-50"
                  placeholder="e.g., product optimization, site structure, internal linking"
                />
              </div>
            </CardContent>
          </Card>

          {/* Content Parameters */}
          <Card>
            <CardHeader>
              <CardTitle>Content Parameters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Article Size
                  </label>
                  <select
                    value={articleParams.articleSize}
                    onChange={(e) => setArticleParams(prev => ({
                      ...prev,
                      articleSize: e.target.value
                    }))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-pool focus:ring focus:ring-emerald-pool focus:ring-opacity-50"
                  >
                    <option value="small">Small ({articleSizes.small.words} words)</option>
                    <option value="medium">Medium ({articleSizes.medium.words} words)</option>
                    <option value="large">Large ({articleSizes.large.words} words)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Tone
                  </label>
                  <select
                    value={articleParams.tone}
                    onChange={(e) => setArticleParams(prev => ({
                      ...prev,
                      tone: e.target.value
                    }))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-pool focus:ring focus:ring-emerald-pool focus:ring-opacity-50"
                  >
                    {toneOptions.map(tone => (
                      <option key={tone} value={tone}>
                        {tone.charAt(0).toUpperCase() + tone.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Writing Style
                  </label>
                  <select
                    value={articleParams.writingStyle}
                    onChange={(e) => setArticleParams(prev => ({
                      ...prev,
                      writingStyle: e.target.value
                    }))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-pool focus:ring focus:ring-emerald-pool focus:ring-opacity-50"
                  >
                    {writingStyles.map(style => (
                      <option key={style} value={style}>
                        {style.charAt(0).toUpperCase() + style.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Content Complexity
                  </label>
                  <select
                    value={articleParams.contentComplexity}
                    onChange={(e) => setArticleParams(prev => ({
                      ...prev,
                      contentComplexity: e.target.value
                    }))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-pool focus:ring focus:ring-emerald-pool focus:ring-opacity-50"
                  >
                    {complexityLevels.map(level => (
                      <option key={level} value={level}>
                        {level.charAt(0).toUpperCase() + level.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Target Audience
                </label>
                <textarea
                  value={articleParams.targetAudience}
                  onChange={(e) => setArticleParams(prev => ({
                    ...prev,
                    targetAudience: e.target.value
                  }))}
                  rows={2}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-pool focus:ring focus:ring-emerald-pool focus:ring-opacity-50"
                  placeholder="Describe your target audience (e.g., e-commerce store owners with intermediate technical knowledge)"
                />
              </div>

              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={articleParams.requiresResearch}
                    onChange={(e) => setArticleParams(prev => ({
                      ...prev,
                      requiresResearch: e.target.checked
                    }))}
                    className="rounded border-gray-300 text-emerald-pool focus:ring-emerald-pool"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    Include research, statistics, and expert opinions (with placeholder citations)
                  </span>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Custom Instructions (Optional)
                </label>
                <textarea
                  value={articleParams.customInstructions}
                  onChange={(e) => setArticleParams(prev => ({
                    ...prev,
                    customInstructions: e.target.value
                  }))}
                rows={3}
                                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-pool focus:ring focus:ring-emerald-pool focus:ring-opacity-50"
                                  placeholder="Any specific requirements or points to cover in the article"
                                />
                              </div>
                            </CardContent>
                          </Card>

                          {/* Generation Progress */}
                          {loading && (
                            <Card>
                              <CardContent className="py-6">
                                <div className="space-y-4">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                      {generatingStep === 'title' ? (
                                        <Loader2 className="w-5 h-5 animate-spin text-emerald-pool" />
                                      ) : generatedContent.title ? (
                                        <CheckCircle className="w-5 h-5 text-green-500" />
                                      ) : (
                                        <ChevronRight className="w-5 h-5 text-gray-400" />
                                      )}
                                      <span className={`text-sm ${generatingStep === 'title' ? 'text-emerald-pool font-medium' : 'text-gray-600'}`}>
                                        Generating Title
                                      </span>
                                    </div>
                                    {generatedContent.title && (
                                      <span className="text-sm text-gray-600 italic">
                                        {generatedContent.title}
                                      </span>
                                    )}
                                  </div>

                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                      {generatingStep === 'outline' ? (
                                        <Loader2 className="w-5 h-5 animate-spin text-emerald-pool" />
                                      ) : generatedContent.outline ? (
                                        <CheckCircle className="w-5 h-5 text-green-500" />
                                      ) : (
                                        <ChevronRight className="w-5 h-5 text-gray-400" />
                                      )}
                                      <span className={`text-sm ${generatingStep === 'outline' ? 'text-emerald-pool font-medium' : 'text-gray-600'}`}>
                                        Creating Outline
                                      </span>
                                    </div>
                                  </div>

                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                      {generatingStep === 'content' ? (
                                        <Loader2 className="w-5 h-5 animate-spin text-emerald-pool" />
                                      ) : generatedContent.sections.length > 0 ? (
                                        <CheckCircle className="w-5 h-5 text-green-500" />
                                      ) : (
                                        <ChevronRight className="w-5 h-5 text-gray-400" />
                                      )}
                                      <span className={`text-sm ${generatingStep === 'content' ? 'text-emerald-pool font-medium' : 'text-gray-600'}`}>
                                        Writing Content
                                      </span>
                                    </div>
                                    {generatingStep === 'content' && (
                                      <span className="text-sm text-gray-600">
                                        {progress}% Complete
                                      </span>
                                    )}
                                  </div>

                                  {/* Progress Bar */}
                                  {generatingStep === 'content' && (
                                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                                      <div
                                        className="bg-emerald-pool h-2.5 rounded-full transition-all duration-500"
                                        style={{ width: `${progress}%` }}
                                      ></div>
                                    </div>
                                  )}
                                </div>
                              </CardContent>
                            </Card>
                          )}

                          {/* Submit Button */}
                          <div className="flex justify-end">
                            <button
                              type="submit"
                              disabled={loading}
                              className="inline-flex items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-emerald-pool hover:bg-emerald-pool/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-pool disabled:opacity-50"
                            >
                              {loading ? (
                                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                              ) : (
                                <Wand2 className="w-5 h-5 mr-2" />
                              )}
                              {loading ? 'Generating Article...' : 'Generate Article'}
                            </button>
                          </div>
                        </form>
                      </div>
                    </AdminLayout>
                  )
                }