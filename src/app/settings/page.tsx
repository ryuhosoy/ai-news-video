"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"


import { Progress } from "@/components/ui/progress"
import { 
  Settings as SettingsIcon, 
  User, 
  Bell, 
  BarChart3,
  Key,
  Globe,
  Save,
  RefreshCw,
  TrendingUp,
  Eye,
  Video
} from 'lucide-react'

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general')
  const [settings, setSettings] = useState({
    // General Settings
    language: 'ja',
    timezone: 'Asia/Tokyo',
    autoSave: true,
    
    // AI Settings
    aiModel: 'gpt-4-turbo',
    summaryLength: 'medium',
    voiceDefault: 'female_voice',
    
    // Video Settings
    defaultFormat: 'vertical',
    defaultQuality: 'high',
    watermark: true,
    subtitles: true,
    
    // Notification Settings
    emailNotifications: true,
    pushNotifications: false,
    completionNotifications: true,
    
    // API Settings
    openaiApiKey: '',
    didApiKey: ''
  })

  const [analytics] = useState({
    totalVideos: 24,
    totalViews: 15420,
    avgEngagement: 89,
    topCategory: 'technology',
    monthlyGrowth: 12,
    weeklyViews: [1200, 1450, 1380, 1620, 1890, 2100, 1950]
  })

  const handleSettingChange = (key: string, value: string | boolean) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const handleSave = () => {
    // Simulate save
    console.log('Settings saved:', settings)
  }

  const handleReset = () => {
    // Reset to defaults
    setSettings({
      language: 'ja',
      timezone: 'Asia/Tokyo',
      autoSave: true,
      aiModel: 'gpt-4-turbo',
      summaryLength: 'medium',
      voiceDefault: 'female_voice',
      defaultFormat: 'vertical',
      defaultQuality: 'high',
      watermark: true,
      subtitles: true,
      emailNotifications: true,
      pushNotifications: false,
      completionNotifications: true,
      openaiApiKey: '',
      didApiKey: ''
    })
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">設定</h1>
        <p className="text-muted-foreground mt-2">
          アプリケーションの設定と分析データ
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="general" className="flex items-center space-x-2">
            <SettingsIcon className="h-4 w-4" />
            <span className="hidden md:inline">一般</span>
          </TabsTrigger>
          <TabsTrigger value="ai" className="flex items-center space-x-2">
            <User className="h-4 w-4" />
            <span className="hidden md:inline">AI設定</span>
          </TabsTrigger>
          <TabsTrigger value="video" className="flex items-center space-x-2">
            <Video className="h-4 w-4" />
            <span className="hidden md:inline">動画</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center space-x-2">
            <Bell className="h-4 w-4" />
            <span className="hidden md:inline">通知</span>
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center space-x-2">
            <BarChart3 className="h-4 w-4" />
            <span className="hidden md:inline">分析</span>
          </TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Globe className="h-5 w-5" />
                <span>基本設定</span>
              </CardTitle>
              <CardDescription>
                アプリケーションの基本的な設定
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="language">言語</Label>
                  <Select value={settings.language} onValueChange={(value) => handleSettingChange('language', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ja">日本語</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="ko">한국어</SelectItem>
                      <SelectItem value="zh">中文</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timezone">タイムゾーン</Label>
                  <Select value={settings.timezone} onValueChange={(value) => handleSettingChange('timezone', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Asia/Tokyo">Asia/Tokyo (JST)</SelectItem>
                      <SelectItem value="America/New_York">America/New_York (EST)</SelectItem>
                      <SelectItem value="Europe/London">Europe/London (GMT)</SelectItem>
                      <SelectItem value="Asia/Seoul">Asia/Seoul (KST)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>自動保存</Label>
                  <p className="text-sm text-muted-foreground">
                    作業内容を自動的に保存します
                  </p>
                </div>
                <Switch
                  checked={settings.autoSave}
                  onCheckedChange={(checked) => handleSettingChange('autoSave', checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* AI Settings */}
        <TabsContent value="ai" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>AI設定</span>
              </CardTitle>
              <CardDescription>
                AI要約と音声合成の設定
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="aiModel">AIモデル</Label>
                  <Select value={settings.aiModel} onValueChange={(value) => handleSettingChange('aiModel', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gpt-4-turbo">GPT-4 Turbo (推奨)</SelectItem>
                      <SelectItem value="gpt-4">GPT-4</SelectItem>
                      <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                      <SelectItem value="claude-3">Claude 3</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="summaryLength">要約の長さ</Label>
                  <Select value={settings.summaryLength} onValueChange={(value) => handleSettingChange('summaryLength', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="short">短い (10-15秒)</SelectItem>
                      <SelectItem value="medium">標準 (15-20秒)</SelectItem>
                      <SelectItem value="long">長い (20-30秒)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="voiceDefault">デフォルト音声</Label>
                  <Select value={settings.voiceDefault} onValueChange={(value) => handleSettingChange('voiceDefault', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="female_voice">女性の声（標準）</SelectItem>
                      <SelectItem value="male_voice">男性の声（標準）</SelectItem>
                      <SelectItem value="female_news">女性の声（ニュース調）</SelectItem>
                      <SelectItem value="male_news">男性の声（ニュース調）</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* API Keys */}
              <div className="space-y-4">
                <h4 className="font-medium flex items-center space-x-2">
                  <Key className="h-4 w-4" />
                  <span>API設定</span>
                </h4>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="openaiApiKey">OpenAI API Key</Label>
                    <Input
                      id="openaiApiKey"
                      type="password"
                      placeholder="sk-..."
                      value={settings.openaiApiKey}
                      onChange={(e) => handleSettingChange('openaiApiKey', e.target.value)}
                    />
                  </div>



                  <div className="space-y-2">
                    <Label htmlFor="didApiKey">D-ID API Key</Label>
                    <Input
                      id="didApiKey"
                      type="password"
                      placeholder="..."
                      value={settings.didApiKey}
                      onChange={(e) => handleSettingChange('didApiKey', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Video Settings */}
        <TabsContent value="video" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Video className="h-5 w-5" />
                <span>動画設定</span>
              </CardTitle>
              <CardDescription>
                動画生成のデフォルト設定
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="defaultFormat">デフォルトフォーマット</Label>
                  <Select value={settings.defaultFormat} onValueChange={(value) => handleSettingChange('defaultFormat', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="vertical">縦型 (9:16) - TikTok/Instagram</SelectItem>
                      <SelectItem value="square">正方形 (1:1) - Instagram</SelectItem>
                      <SelectItem value="horizontal">横型 (16:9) - YouTube</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="defaultQuality">デフォルト画質</Label>
                  <Select value={settings.defaultQuality} onValueChange={(value) => handleSettingChange('defaultQuality', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">高画質 (1080p)</SelectItem>
                      <SelectItem value="medium">標準画質 (720p)</SelectItem>
                      <SelectItem value="low">低画質 (480p)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>ウォーターマーク</Label>
                    <p className="text-sm text-muted-foreground">
                      動画にブランドロゴを追加
                    </p>
                  </div>
                  <Switch
                    checked={settings.watermark}
                    onCheckedChange={(checked) => handleSettingChange('watermark', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>字幕を自動追加</Label>
                    <p className="text-sm text-muted-foreground">
                      音声に合わせて字幕を自動生成
                    </p>
                  </div>
                  <Switch
                    checked={settings.subtitles}
                    onCheckedChange={(checked) => handleSettingChange('subtitles', checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="h-5 w-5" />
                <span>通知設定</span>
              </CardTitle>
              <CardDescription>
                通知の受信設定を管理
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>メール通知</Label>
                    <p className="text-sm text-muted-foreground">
                      重要な更新をメールで受信
                    </p>
                  </div>
                  <Switch
                    checked={settings.emailNotifications}
                    onCheckedChange={(checked) => handleSettingChange('emailNotifications', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>プッシュ通知</Label>
                    <p className="text-sm text-muted-foreground">
                      ブラウザでプッシュ通知を受信
                    </p>
                  </div>
                  <Switch
                    checked={settings.pushNotifications}
                    onCheckedChange={(checked) => handleSettingChange('pushNotifications', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>動画完成通知</Label>
                    <p className="text-sm text-muted-foreground">
                      動画生成完了時に通知
                    </p>
                  </div>
                  <Switch
                    checked={settings.completionNotifications}
                    onCheckedChange={(checked) => handleSettingChange('completionNotifications', checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">総動画数</CardTitle>
                <Video className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.totalVideos}</div>
                <p className="text-xs text-muted-foreground">
                  +3 今月
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">総再生数</CardTitle>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.totalViews.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  +{analytics.monthlyGrowth}% 先月比
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">平均エンゲージメント</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.avgEngagement}%</div>
                <p className="text-xs text-muted-foreground">
                  +5% 先週比
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">人気カテゴリー</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">テクノロジー</div>
                <p className="text-xs text-muted-foreground">
                  全体の35%
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>週間パフォーマンス</CardTitle>
              <CardDescription>
                過去7日間の再生数推移
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.weeklyViews.map((views, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <div className="w-12 text-sm text-muted-foreground">
                      {['月', '火', '水', '木', '金', '土', '日'][index]}
                    </div>
                    <div className="flex-1">
                      <Progress value={(views / Math.max(...analytics.weeklyViews)) * 100} className="h-2" />
                    </div>
                    <div className="w-16 text-sm text-right">
                      {views.toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Save/Reset Buttons */}
      {activeTab !== 'analytics' && (
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={handleReset}>
            <RefreshCw className="h-4 w-4 mr-2" />
            リセット
          </Button>
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            保存
          </Button>
        </div>
      )}
    </div>
  )
}
