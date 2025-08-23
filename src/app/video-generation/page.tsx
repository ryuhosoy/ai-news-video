"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { 
  FileText, 
  Mic, 
  User, 
  Video, 
  Settings,
  Play,
  Download,
  Share,
  CheckCircle,
  Clock,
  Sparkles
} from 'lucide-react'

export default function VideoGenerationPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState('summary')
  const [progress, setProgress] = useState(0)
  const [isGenerating, setIsGenerating] = useState(false)
  
  const [summaryData, setSummaryData] = useState({
    originalText: '',
    summary: 'AI技術の最新動向について、特に生成AIの進歩が注目されています。企業での導入が加速し、業務効率化に大きな影響を与えています。今後の発展に期待が高まっています。',
    duration: 15
  })

  const [voiceSettings, setVoiceSettings] = useState({
    voice: 'female_voice',
    speed: 1.0,
    pitch: 1.0,
    volume: 1.0
  })

  const [characterSettings, setCharacterSettings] = useState({
    character: 'avatar_1',
    background: 'news_studio',
    style: 'professional'
  })

  const [videoSettings, setVideoSettings] = useState({
    format: 'vertical',
    quality: 'high',
    subtitles: true,
    logo: true
  })

  const steps = [
    { id: 'summary', title: 'AI要約', icon: FileText },
    { id: 'voice', title: '音声設定', icon: Mic },
    { id: 'character', title: 'キャラクター', icon: User },
    { id: 'video', title: '動画設定', icon: Video },
    { id: 'generate', title: '生成', icon: Sparkles }
  ]

  const voiceOptions = [
    { value: 'female_voice', label: '女性の声（標準）' },
    { value: 'male_voice', label: '男性の声（標準）' },
    { value: 'female_news', label: '女性の声（ニュース調）' },
    { value: 'male_news', label: '男性の声（ニュース調）' }
  ]

  const characterOptions = [
    { value: 'avatar_1', label: 'アバター1（女性・ビジネス）', preview: '/api/placeholder/100/100' },
    { value: 'avatar_2', label: 'アバター2（男性・カジュアル）', preview: '/api/placeholder/100/100' },
    { value: 'avatar_3', label: 'アバター3（女性・ニュース）', preview: '/api/placeholder/100/100' },
    { value: 'avatar_4', label: 'アバター4（男性・プロフェッショナル）', preview: '/api/placeholder/100/100' }
  ]

  const backgroundOptions = [
    { value: 'news_studio', label: 'ニューススタジオ' },
    { value: 'office', label: 'オフィス' },
    { value: 'simple_white', label: 'シンプル（白）' },
    { value: 'gradient_blue', label: 'グラデーション（青）' }
  ]

  const handleNext = () => {
    const currentIndex = steps.findIndex(step => step.id === currentStep)
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1].id)
    }
  }

  const handlePrevious = () => {
    const currentIndex = steps.findIndex(step => step.id === currentStep)
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1].id)
    }
  }

  const handleGenerate = async () => {
    setIsGenerating(true)
    setCurrentStep('generate')
    
    // Simulate video generation process
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 500))
      setProgress(i)
    }
    
    setIsGenerating(false)
    router.push('/video-library')
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 'summary':
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="summary">AI生成要約</Label>
              <Textarea
                id="summary"
                value={summaryData.summary}
                onChange={(e) => setSummaryData(prev => ({ ...prev, summary: e.target.value }))}
                rows={6}
                placeholder="AI要約がここに表示されます..."
              />
              <p className="text-sm text-muted-foreground">
                要約を編集して、動画の内容を調整できます
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="duration">動画の長さ: {summaryData.duration}秒</Label>
              <Slider
                value={[summaryData.duration]}
                onValueChange={(value) => setSummaryData(prev => ({ ...prev, duration: value[0] }))}
                max={30}
                min={10}
                step={5}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>10秒</span>
                <span>30秒</span>
              </div>
            </div>
          </div>
        )

      case 'voice':
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="voice">音声の種類</Label>
              <Select value={voiceSettings.voice} onValueChange={(value) => setVoiceSettings(prev => ({ ...prev, voice: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {voiceOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>話速: {voiceSettings.speed}x</Label>
                <Slider
                  value={[voiceSettings.speed]}
                  onValueChange={(value) => setVoiceSettings(prev => ({ ...prev, speed: value[0] }))}
                  max={2.0}
                  min={0.5}
                  step={0.1}
                />
              </div>

              <div className="space-y-2">
                <Label>音程: {voiceSettings.pitch}</Label>
                <Slider
                  value={[voiceSettings.pitch]}
                  onValueChange={(value) => setVoiceSettings(prev => ({ ...prev, pitch: value[0] }))}
                  max={2.0}
                  min={0.5}
                  step={0.1}
                />
              </div>

              <div className="space-y-2">
                <Label>音量: {voiceSettings.volume}</Label>
                <Slider
                  value={[voiceSettings.volume]}
                  onValueChange={(value) => setVoiceSettings(prev => ({ ...prev, volume: value[0] }))}
                  max={2.0}
                  min={0.1}
                  step={0.1}
                />
              </div>
            </div>

            <div className="flex justify-center">
              <Button variant="outline" className="flex items-center space-x-2">
                <Play className="h-4 w-4" />
                <span>音声プレビュー</span>
              </Button>
            </div>
          </div>
        )

      case 'character':
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <Label>AIキャラクター</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {characterOptions.map((option) => (
                  <div
                    key={option.value}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      characterSettings.character === option.value 
                        ? 'border-primary bg-primary/10' 
                        : 'border-border hover:bg-muted/50'
                    }`}
                    onClick={() => setCharacterSettings(prev => ({ ...prev, character: option.value }))}
                  >
                    <div className="w-full h-20 bg-muted rounded mb-2 flex items-center justify-center">
                      <User className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <p className="text-sm text-center">{option.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="background">背景</Label>
              <Select value={characterSettings.background} onValueChange={(value) => setCharacterSettings(prev => ({ ...prev, background: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {backgroundOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )

      case 'video':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="format">動画フォーマット</Label>
                <Select value={videoSettings.format} onValueChange={(value) => setVideoSettings(prev => ({ ...prev, format: value }))}>
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
                <Label htmlFor="quality">画質</Label>
                <Select value={videoSettings.quality} onValueChange={(value) => setVideoSettings(prev => ({ ...prev, quality: value }))}>
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
                  <Label>字幕を表示</Label>
                  <p className="text-sm text-muted-foreground">音声に合わせて字幕を自動生成</p>
                </div>
                <Switch
                  checked={videoSettings.subtitles}
                  onCheckedChange={(checked) => setVideoSettings(prev => ({ ...prev, subtitles: checked }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>ロゴを表示</Label>
                  <p className="text-sm text-muted-foreground">動画にブランドロゴを追加</p>
                </div>
                <Switch
                  checked={videoSettings.logo}
                  onCheckedChange={(checked) => setVideoSettings(prev => ({ ...prev, logo: checked }))}
                />
              </div>
            </div>
          </div>
        )

      case 'generate':
        return (
          <div className="space-y-6 text-center">
            {isGenerating ? (
              <>
                <div className="space-y-4">
                  <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                    <Sparkles className="h-8 w-8 text-primary animate-pulse" />
                  </div>
                  <h3 className="text-xl font-semibold">動画を生成中...</h3>
                  <p className="text-muted-foreground">
                    AI要約、音声合成、動画編集を実行しています
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Progress value={progress} className="w-full" />
                  <p className="text-sm text-muted-foreground">{progress}% 完了</p>
                </div>

                <div className="space-y-2 text-sm text-muted-foreground">
                  {progress < 30 && <p>AI要約を処理中...</p>}
                  {progress >= 30 && progress < 60 && <p>音声を合成中...</p>}
                  {progress >= 60 && progress < 90 && <p>動画を生成中...</p>}
                  {progress >= 90 && <p>最終処理中...</p>}
                </div>
              </>
            ) : (
              <>
                <div className="space-y-4">
                  <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold">設定完了</h3>
                  <p className="text-muted-foreground">
                    動画生成の準備が整いました
                  </p>
                </div>

                <div className="bg-muted/50 p-4 rounded-lg space-y-2 text-left">
                  <h4 className="font-medium">生成設定の確認</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">動画の長さ:</span>
                      <span className="ml-2">{summaryData.duration}秒</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">音声:</span>
                      <span className="ml-2">{voiceOptions.find(v => v.value === voiceSettings.voice)?.label}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">フォーマット:</span>
                      <span className="ml-2">{videoSettings.format === 'vertical' ? '縦型' : videoSettings.format === 'square' ? '正方形' : '横型'}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">画質:</span>
                      <span className="ml-2">{videoSettings.quality === 'high' ? '高画質' : videoSettings.quality === 'medium' ? '標準' : '低画質'}</span>
                    </div>
                  </div>
                </div>

                <Button onClick={handleGenerate} size="lg" className="flex items-center space-x-2">
                  <Sparkles className="h-5 w-5" />
                  <span>動画生成を開始</span>
                </Button>
              </>
            )}
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">動画生成</h1>
        <p className="text-muted-foreground mt-2">
          AI要約からショート動画を生成します
        </p>
      </div>

      {/* Progress Steps */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const Icon = step.icon
              const isActive = step.id === currentStep
              const isCompleted = steps.findIndex(s => s.id === currentStep) > index
              
              return (
                <div key={step.id} className="flex items-center">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                    isActive 
                      ? 'border-primary bg-primary text-primary-foreground' 
                      : isCompleted 
                        ? 'border-green-500 bg-green-500 text-white'
                        : 'border-muted-foreground bg-background'
                  }`}>
                    {isCompleted ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : (
                      <Icon className="h-5 w-5" />
                    )}
                  </div>
                  <div className="ml-2 hidden md:block">
                    <p className={`text-sm font-medium ${isActive ? 'text-foreground' : 'text-muted-foreground'}`}>
                      {step.title}
                    </p>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-8 h-0.5 mx-4 ${isCompleted ? 'bg-green-500' : 'bg-muted'}`} />
                  )}
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Step Content */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            {(() => {
              const currentStepData = steps.find(step => step.id === currentStep)
              const Icon = currentStepData?.icon
              return (
                <>
                  <Icon className="h-5 w-5" />
                  <span>{currentStepData?.title}</span>
                </>
              )
            })()}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {renderStepContent()}
        </CardContent>
      </Card>

      {/* Navigation */}
      {currentStep !== 'generate' && (
        <div className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={handlePrevious}
            disabled={currentStep === 'summary'}
          >
            前へ
          </Button>
          <Button 
            onClick={currentStep === 'video' ? handleGenerate : handleNext}
          >
            {currentStep === 'video' ? '生成開始' : '次へ'}
          </Button>
        </div>
      )}
    </div>
  )
}
