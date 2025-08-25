"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { 
  Link, 
  FileText, 
  Rss, 
  Search,
  ArrowRight,
  Globe,
  Newspaper,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react'
import { ExtractedArticle } from '@/lib/news-extractor'

export default function NewsInputPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('url')
  const [formData, setFormData] = useState({
    url: '',
    text: '',
    source: 'manual',
    category: 'general'
  })
  const [isLoading, setIsLoading] = useState(false)
  const [extractedArticle, setExtractedArticle] = useState<ExtractedArticle | null>(null)
  const [extractionError, setExtractionError] = useState<string | null>(null)
  const [isExtracting, setIsExtracting] = useState(false)

  const newsCategories = [
    { value: 'general', label: '一般ニュース', icon: Newspaper },
    { value: 'technology', label: 'テクノロジー', icon: Globe },
    { value: 'business', label: 'ビジネス', icon: TrendingUp },
    { value: 'sports', label: 'スポーツ', icon: TrendingUp },
    { value: 'entertainment', label: 'エンターテイメント', icon: TrendingUp }
  ]

  const popularSources = [
    { name: 'NHK ニュース', url: 'https://www3.nhk.or.jp/news/', category: 'general' },
    { name: 'Yahoo! ニュース', url: 'https://news.yahoo.co.jp/', category: 'general' },
    { name: 'ITmedia', url: 'https://www.itmedia.co.jp/', category: 'technology' },
    { name: '日経新聞', url: 'https://www.nikkei.com/', category: 'business' },
    { name: 'テスト用記事', url: 'https://www.bbc.com/news/world-us-canada-67856735', category: 'general' }
  ]

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const extractArticle = async (url: string) => {
    setIsExtracting(true)
    setExtractionError(null)
    setExtractedArticle(null)

    try {
      const response = await fetch('/api/extract-article', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      })

      const result = await response.json()

      if (result.success) {
        setExtractedArticle(result.data)
        // 抽出された記事の内容をテキストフィールドに設定（HTMLタグを除去したテキストを使用）
        setFormData(prev => ({
          ...prev,
          text: result.data.contentText
        }))
      } else {
        setExtractionError(result.error || '記事の抽出に失敗しました')
      }
    } catch (error) {
      setExtractionError('記事の抽出中にエラーが発生しました')
      console.error('記事抽出エラー:', error)
    } finally {
      setIsExtracting(false)
    }
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    
    // 記事テキストをURLパラメータとして渡す
    const articleText = formData.text || extractedArticle?.contentText || ''
    const articleTitle = extractedArticle?.title || ''
    
    // URLエンコードしてパラメータを作成
    const params = new URLSearchParams()
    if (articleText) {
      params.append('articleText', articleText)
    }
    if (articleTitle) {
      params.append('articleTitle', articleTitle)
    }
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      router.push(`/video-generation?${params.toString()}`)
    }, 2000)
  }

  const handleQuickSource = (source: { url: string; category: string }) => {
    setFormData(prev => ({
      ...prev,
      url: source.url,
      category: source.category
    }))
    setActiveTab('url')
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">ニュース記事入力</h1>
        <p className="text-muted-foreground mt-2">
          ニュース記事のURLまたはテキストを入力して、AI要約動画を作成しましょう
        </p>
      </div>

      {/* Quick Sources */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Rss className="h-5 w-5" />
            <span>人気のニュースソース</span>
          </CardTitle>
          <CardDescription>
            よく使用されるニュースサイトから選択
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {popularSources.map((source, index) => (
              <div 
                key={index}
                className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                onClick={() => handleQuickSource(source)}
              >
                <div className="flex items-center space-x-3">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="font-medium">{source.name}</div>
                    <div className="text-sm text-muted-foreground">{source.url}</div>
                  </div>
                </div>
                <Badge variant="secondary">
                  {newsCategories.find(cat => cat.value === source.category)?.label}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Input Form */}
      <Card>
        <CardHeader>
          <CardTitle>ニュース記事の入力</CardTitle>
          <CardDescription>
            URLまたは記事テキストを直接入力してください
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="url" className="flex items-center space-x-2">
                <Link className="h-4 w-4" />
                <span>URL入力</span>
              </TabsTrigger>
              <TabsTrigger value="text" className="flex items-center space-x-2">
                <FileText className="h-4 w-4" />
                <span>テキスト入力</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="url" className="space-y-4 mt-6">
              <div className="space-y-2">
                <Label htmlFor="url">記事URL</Label>
                <div className="flex space-x-2">
                  <Input
                    id="url"
                    placeholder="https://example.com/news-article"
                    value={formData.url}
                    onChange={(e) => handleInputChange('url', e.target.value)}
                  />
                  <Button
                    onClick={() => extractArticle(formData.url)}
                    disabled={!formData.url || isExtracting}
                    variant="outline"
                    className="whitespace-nowrap"
                  >
                    {isExtracting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        抽出中...
                      </>
                    ) : (
                      <>
                        <Search className="h-4 w-4 mr-2" />
                        記事抽出
                      </>
                    )}
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  ニュース記事のURLを入力して「記事抽出」ボタンをクリックすると、自動で記事内容を取得します。
                </p>
              </div>

              {/* 抽出結果の表示 */}
              {extractedArticle && (
                <div className="p-4 border border-green-200 bg-green-50 rounded-lg">
                  <div className="flex items-center space-x-2 mb-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <h4 className="font-medium text-green-800">記事の抽出が完了しました</h4>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div><strong>タイトル:</strong> {extractedArticle.title}</div>
                    <div><strong>サイト:</strong> {extractedArticle.siteName || '不明'}</div>
                    <div><strong>文字数:</strong> {extractedArticle.wordCount}文字</div>
                    <div><strong>読書時間:</strong> 約{extractedArticle.readingTime}分</div>
                    {extractedArticle.author && (
                      <div><strong>著者:</strong> {extractedArticle.author}</div>
                    )}
                  </div>
                </div>
              )}

              {extractionError && (
                <div className="p-4 border border-red-200 bg-red-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="h-5 w-5 text-red-600" />
                    <h4 className="font-medium text-red-800">抽出エラー</h4>
                  </div>
                  <p className="text-sm text-red-700 mt-2">{extractionError}</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="text" className="space-y-4 mt-6">
              <div className="space-y-2">
                <Label htmlFor="text">記事テキスト</Label>
                <Textarea
                  id="text"
                  placeholder="ニュース記事の内容をここに貼り付けてください..."
                  rows={8}
                  value={formData.text}
                  onChange={(e) => handleInputChange('text', e.target.value)}
                />
                <p className="text-sm text-muted-foreground">
                  記事の本文を直接入力または貼り付けてください。
                </p>
              </div>
            </TabsContent>
          </Tabs>

          {/* Category Selection */}
          <div className="space-y-2 mt-6">
            <Label htmlFor="category">カテゴリー</Label>
            <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
              <SelectTrigger>
                <SelectValue placeholder="カテゴリーを選択" />
              </SelectTrigger>
              <SelectContent>
                {newsCategories.map((category) => {
                  const Icon = category.icon
                  return (
                    <SelectItem key={category.value} value={category.value}>
                      <div className="flex items-center space-x-2">
                        <Icon className="h-4 w-4" />
                        <span>{category.label}</span>
                      </div>
                    </SelectItem>
                  )
                })}
              </SelectContent>
            </Select>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end mt-8">
            <Button 
              onClick={handleSubmit}
              disabled={isLoading || (!formData.url && !formData.text)}
              className="flex items-center space-x-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>処理中...</span>
                </>
              ) : (
                <>
                  <span>AI要約を開始</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tips */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Search className="h-5 w-5" />
            <span>使用のヒント</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <h4 className="font-medium">URL入力の場合</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• 主要ニュースサイトのURLに対応</li>
                <li>• 記事の本文を自動で抽出</li>
                <li>• 画像も自動で取得</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">テキスト入力の場合</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• 記事の見出しと本文を含める</li>
                <li>• 500文字以上推奨</li>
                <li>• 重要な情報を含める</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
