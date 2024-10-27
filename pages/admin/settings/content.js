// pages/admin/settings/content.js
import { useState, useEffect } from 'react'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import AdminLayout from '../../../components/AdminLayout'
import { Alert, AlertDescription } from '../../../components/ui/alert'
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/card'
import { Save } from 'lucide-react'

export default function ContentSettings() {
  const supabase = useSupabaseClient()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const [settings, setSettings] = useState({
    target_audience: {
      education_level: 'intermediate',
      industry: '',
      job_roles: '',
      age_range: '',
      interests: ''
    },
    content_preferences: {
      default_tone: 'professional',
      writing_style: 'informative',
      content_complexity: 'intermediate',
      target_countries: [],
      language_preferences: 'us_english'
    },
    seo_defaults: {
      keyword_density: 'moderate',
      internal_linking: true,
      meta_description_style: 'benefit_focused'
    }
  })

  useEffect(() => {
    fetchSettings()
  }, [])

  async function fetchSettings() {
    try {
      const { data, error } = await supabase
        .from('content_settings')
        .select('*')
        .single()

      if (error) throw error
      if (data) setSettings(data.settings)
    } catch (error) {
      console.error('Error fetching settings:', error)
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const { error } = await supabase
        .from('content_settings')
        .upsert({ 
          id: 1, // Using a single row for settings
          settings,
          updated_at: new Date()
        })

      if (error) throw error
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  function handleChange(section, field, value) {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }))
  }

  const toneOptions = [
    'professional', 'technical', 'friendly', 'casual', 
    'authoritative', 'conversational', 'formal', 'humorous'
  ]

  const complexityLevels = [
    'beginner', 'intermediate', 'advanced', 'expert'
  ]

  const educationLevels = [
    '8th Grader','high_school', 'undergraduate', 'graduate', 'professional'
  ]

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Content Settings</h1>
          <p className="mt-2 text-gray-600">
            Configure default settings for AI-generated content
          </p>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mb-6 bg-green-50 text-green-800 border-green-200">
            <AlertDescription>Settings saved successfully!</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Target Audience */}
          <Card>
            <CardHeader>
              <CardTitle>Target Audience</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Education Level
                </label>
                <select
                  value={settings.target_audience.education_level}
                  onChange={(e) => handleChange('target_audience', 'education_level', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-pool focus:ring focus:ring-emerald-pool focus:ring-opacity-50"
                >
                  {educationLevels.map(level => (
                    <option key={level} value={level}>
                      {level.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Industry Focus
                </label>
                <input
                  type="text"
                  value={settings.target_audience.industry}
                  onChange={(e) => handleChange('target_audience', 'industry', e.target.value)}
                  placeholder="e.g., Technology, Healthcare, Finance"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-pool focus:ring focus:ring-emerald-pool focus:ring-opacity-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Target Job Roles
                </label>
                <input
                  type="text"
                  value={settings.target_audience.job_roles}
                  onChange={(e) => handleChange('target_audience', 'job_roles', e.target.value)}
                  placeholder="e.g., Managers, Developers, Marketers"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-pool focus:ring focus:ring-emerald-pool focus:ring-opacity-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Age Range
                </label>
                <input
                  type="text"
                  value={settings.target_audience.age_range}
                  onChange={(e) => handleChange('target_audience', 'age_range', e.target.value)}
                  placeholder="e.g., 25-45"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-pool focus:ring focus:ring-emerald-pool focus:ring-opacity-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Interests & Pain Points
                </label>
                <textarea
                  value={settings.target_audience.interests}
                  onChange={(e) => handleChange('target_audience', 'interests', e.target.value)}
                  placeholder="Describe your audience's interests and challenges"
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-pool focus:ring focus:ring-emerald-pool focus:ring-opacity-50"
                />
              </div>
            </CardContent>
          </Card>

          {/* Content Preferences */}
          <Card>
            <CardHeader>
              <CardTitle>Content Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Default Tone
                </label>
                <select
                  value={settings.content_preferences.default_tone}
                  onChange={(e) => handleChange('content_preferences', 'default_tone', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-pool focus:ring focus:ring-emerald-pool focus:ring-opacity-50"
                >
                  {toneOptions.map(tone => (
                    <option key={tone} value={tone}>
                      {tone.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Writing Style
                </label>
                <select
                  value={settings.content_preferences.writing_style}
                  onChange={(e) => handleChange('content_preferences', 'writing_style', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-pool focus:ring focus:ring-emerald-pool focus:ring-opacity-50"
                >
                  <option value="informative">Informative</option>
                  <option value="storytelling">Storytelling</option>
                  <option value="analytical">Analytical</option>
                  <option value="persuasive">Persuasive</option>
                  <option value="descriptive">Descriptive</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Content Complexity
                </label>
                <select
                  value={settings.content_preferences.content_complexity}
                  onChange={(e) => handleChange('content_preferences', 'content_complexity', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-pool focus:ring focus:ring-emerald-pool focus:ring-opacity-50"
                >
                  {complexityLevels.map(level => (
                    <option key={level} value={level}>
                      {level.charAt(0).toUpperCase() + level.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Target Countries
                </label>
                <input
                  type="text"
                  value={settings.content_preferences.target_countries.join(', ')}
                  onChange={(e) => handleChange('content_preferences', 'target_countries', e.target.value.split(',').map(s => s.trim()))}
                  placeholder="e.g., US, UK, Canada"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-pool focus:ring focus:ring-emerald-pool focus:ring-opacity-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Language Preference
                </label>
                <select
                  value={settings.content_preferences.language_preferences}
                  onChange={(e) => handleChange('content_preferences', 'language_preferences', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-pool focus:ring focus:ring-emerald-pool focus:ring-opacity-50"
                >
                  <option value="us_english">US English</option>
                  <option value="uk_english">UK English</option>
                  <option value="australian_english">Australian English</option>
                  <option value="canadian_english">Canadian English</option>
                </select>
              </div>
            </CardContent>
          </Card>

          {/* SEO Defaults */}
          <Card>
            <CardHeader>
              <CardTitle>SEO Defaults</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Keyword Density
                </label>
                <select
                  value={settings.seo_defaults.keyword_density}
                  onChange={(e) => handleChange('seo_defaults', 'keyword_density', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-pool focus:ring focus:ring-emerald-pool focus:ring-opacity-50"
                >
                  <option value="light">Light</option>
                  <option value="moderate">Moderate</option>
                  <option value="aggressive">Aggressive</option>
                </select>
              </div>

              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.seo_defaults.internal_linking}
                    onChange={(e) => handleChange('seo_defaults', 'internal_linking', e.target.checked)}
                    className="rounded border-gray-300 text-emerald-pool focus:ring-emerald-pool"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    Enable Internal Linking Suggestions
                  </span>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Meta Description Style
                </label>
                <select
                  value={settings.seo_defaults.meta_description_style}
                  onChange={(e) => handleChange('seo_defaults', 'meta_description_style', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-pool focus:ring focus:ring-emerald-pool focus:ring-opacity-50"
                >
                  <option value="benefit_focused">Benefit Focused</option>
                  <option value="question_based">Question Based</option>
                  <option value="action_oriented">Action Oriented</option>
                </select>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-pool hover:bg-emerald-pool/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-pool disabled:opacity-50"
            >
              <Save className="h-4 w-4 mr-2" />
              {loading ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  )
}