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
  TrendingUp
} from 'lucide-react'

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
    { name: '日経新聞', url: 'https://www.nikkei.com/', category: 'business' }
  ]

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      router.push('/video-generation')
    }, 2000)
  }

  const handleQuickSource = (source) => {
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
                <Input
                  id="url"
                  placeholder="https://example.com/news-article"
                  value={formData.url}
                  onChange={(e) => handleInputChange('url', e.target.value)}
                />
                <p className="text-sm text-muted-foreground">
                  ニュース記事のURLを入力してください。自動で記事内容を取得します。
                </p>
              </div>
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
