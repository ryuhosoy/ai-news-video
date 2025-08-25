"use client"

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Progress } from "@/components/ui/progress"

import { 
  FileText, 
  Mic, 
  User, 
  Video, 
  CheckCircle,
  Sparkles
} from 'lucide-react'
import { ProtectedRoute } from '@/components/ProtectedRoute'

function VideoGenerationContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [currentStep, setCurrentStep] = useState('summary')
  const [progress, setProgress] = useState(0)
  const [isGenerating, setIsGenerating] = useState(false)
  
  const [summaryData, setSummaryData] = useState({
    originalText: '',
    summary: 'AI技術の最新動向について、特に生成AIの進歩が注目されています。企業での導入が加速し、業務効率化に大きな影響を与えています。今後の発展に期待が高まっています。',
    duration: 15
  })

  // URLパラメータから記事テキストを受け取る
  useEffect(() => {
    const articleText = searchParams.get('articleText')
    const articleTitle = searchParams.get('articleTitle')
    
    console.log('📄 記事テキスト受信:', {
      hasArticleText: !!articleText,
      textLength: articleText?.length || 0,
      hasArticleTitle: !!articleTitle,
      title: articleTitle
    });
    
    if (articleText) {
      setSummaryData(prev => ({
        ...prev,
        originalText: articleText,
        summary: generateAISummary(articleText) // AI要約を生成
      }))
    }
  }, [searchParams])

  // AI要約を生成する関数
  const generateAISummary = (text: string): string => {
    if (!text) return ''
    
    // 簡易的なAI要約ロジック（実際のAI APIを使用する場合はここを変更）
    const sentences = text.split(/[。！？]/).filter(s => s.trim().length > 0)
    const importantSentences = sentences.slice(0, 3) // 最初の3文を重要と仮定
    
    return importantSentences.join('。') + '。'
  }



  const [voiceSettings, setVoiceSettings] = useState({
    voice: 'ja-JP-NanamiNeural',
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
    { value: 'ja-JP-NanamiNeural', label: '女性の声（Nanami）' },
    { value: 'ja-JP-KeitaNeural', label: '男性の声（Keita）' },
    { value: 'ja-JP-AoiNeural', label: '女性の声（Aoi）' },
    { value: 'ja-JP-DaichiNeural', label: '男性の声（Daichi）' }
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
    console.log('🚀 動画生成開始:', {
      summary: summaryData.summary,
      voiceType: voiceSettings.voice,
      duration: summaryData.duration,
      timestamp: new Date().toISOString()
    });

    setIsGenerating(true)
    setCurrentStep('generate')
    
    try {
      // Step 1: D-ID APIで動画生成 (0-80%)
      console.log('🎬 Step 1: D-ID 動画生成開始');
      console.log('📋 生成設定:', {
        text: summaryData.summary,
        presenterId: 'amy-Aq6OmG2joV',
        voice: voiceSettings.voice,
        quality: videoSettings.quality === 'high' ? 'hd' : 'premium',
        resolution: videoSettings.quality === 'high' ? '1080p' : '720p'
      });
      setProgress(0);
      
      // 実際のテキストで動画生成
      const requestBody = {
        text: summaryData.summary,
        options: {
          presenterId: 'amy-Aq6OmG2joV', // テストと同じプレゼンター
          backgroundType: 'color', // シンプルな背景
          voice: {
            type: 'microsoft',
            input: voiceSettings.voice
          },
          config: {
            fluent: true,
            padAudio: 0,
            stitch: true,
            resultFormat: 'mp4',
            quality: videoSettings.quality === 'high' ? 'hd' : 'premium',
            resolution: videoSettings.quality === 'high' ? '1080p' : '720p'
          }
        }
      };

      console.log('📤 D-ID API リクエスト:', {
        text: requestBody.text,
        textLength: requestBody.text.length,
        voice: requestBody.options.voice,
        quality: requestBody.options.config.quality
      });

      const didResponse = await fetch('/api/did-video', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!didResponse.ok) {
        const errorText = await didResponse.text();
        console.error('❌ D-ID API エラー:', {
          status: didResponse.status,
          statusText: didResponse.statusText,
          error: errorText
        });
        throw new Error(`D-ID API エラー ${didResponse.status}: ${errorText}`);
      }

      const didResult = await didResponse.json();
      console.log('📊 D-ID API レスポンス:', {
        success: didResult.success,
        videoId: didResult.videoId,
        videoUrl: didResult.videoUrl,
        hasVideoUrl: !!didResult.videoUrl,
        status: didResult.status,
        duration: didResult.duration,
        error: didResult.error
      });
      
      if (!didResult.success) {
        console.error('❌ D-ID 動画生成失敗:', didResult.error);
        throw new Error(`D-ID 動画生成失敗: ${didResult.error}`);
      }

      // 動画URLの確認
      if (!didResult.videoUrl) {
        console.error('❌ 動画URLが取得できません:', {
          success: didResult.success,
          videoId: didResult.videoId,
          status: didResult.status,
          error: didResult.error,
          hasVideoUrl: !!didResult.videoUrl,
          fullResponse: didResult
        });
        throw new Error(`動画URLが取得できませんでした。ステータス: ${didResult.status}, エラー: ${didResult.error || '不明'}, videoUrl: ${didResult.videoUrl || 'undefined'}`);
      }

      console.log('✅ Step 1: D-ID 動画生成完了', {
        videoId: didResult.videoId,
        videoUrl: didResult.videoUrl,
        duration: didResult.duration
      });
      setProgress(80);

      // 生成されたデータを保存
      const generatedData = {
        video: {
          videoId: didResult.videoId,
          videoUrl: didResult.videoUrl,
          duration: didResult.duration,
          localFile: null as { filename: string; filepath: string; publicUrl: string; size: number } | null
        },
        summary: summaryData.summary,
        voiceType: voiceSettings.voice,
        character: characterSettings.character,
        background: characterSettings.background,
        quality: videoSettings.quality,
        timestamp: new Date().toISOString()
      };

      // Step 2: 動画ファイルをディスクに保存 (80-100%)
      console.log('💾 Step 2: 動画ファイル保存開始');
      setProgress(80);
      
      if (didResult.videoUrl) {
        try {
          console.log('📡 動画保存APIを呼び出し中...');
          const videoSaveResponse = await fetch('/api/save-video', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              videoUrl: didResult.videoUrl,
              summary: summaryData.summary,
              character: characterSettings.character,
              quality: videoSettings.quality,
            }),
          });

          console.log('📥 動画保存APIレスポンス:', {
            status: videoSaveResponse.status,
            ok: videoSaveResponse.ok
          });

          if (videoSaveResponse.ok) {
            const videoSaveResult = await videoSaveResponse.json();
            console.log('📊 動画保存結果:', videoSaveResult);
            
            if (videoSaveResult.success) {
              console.log('✅ Step 2: 動画ファイル保存完了', videoSaveResult.videoInfo);
              generatedData.video.localFile = videoSaveResult.videoInfo;
              setProgress(95);
              
              // 保存成功の詳細ログ
              console.log('💾 保存されたファイル情報:', {
                filename: videoSaveResult.videoInfo.filename,
                filepath: videoSaveResult.videoInfo.filepath,
                publicUrl: videoSaveResult.videoInfo.publicUrl,
                size: `${(videoSaveResult.videoInfo.size / 1024).toFixed(2)} KB`
              });
            } else {
              console.error('❌ 動画ファイル保存失敗:', videoSaveResult.error);
              alert(`動画ファイルの保存に失敗しました: ${videoSaveResult.error}`);
            }
          } else {
            const errorText = await videoSaveResponse.text();
            console.error('❌ 動画ファイル保存API エラー:', {
              status: videoSaveResponse.status,
              error: errorText
            });
            alert(`動画ファイル保存API エラー: ${videoSaveResponse.status}`);
          }
        } catch (error) {
          console.error('💥 動画ファイル保存エラー:', error);
          alert(`動画ファイル保存エラー: ${error instanceof Error ? error.message : '不明なエラー'}`);
        }
      } else {
        console.warn('⚠️ 動画URLがありません');
        alert('動画URLが取得できませんでした');
      }

      // Step 3: 最終処理 (80-100%)
      console.log('🎯 Step 3: 最終処理開始');
      for (let i = 80; i <= 100; i += 5) {
        await new Promise(resolve => setTimeout(resolve, 200));
        setProgress(i);
      }

      console.log('🎉 動画生成完了');
      setProgress(100);
      
      console.log('💾 生成データ:', generatedData);
      console.log('🎬 生成された動画:', {
        videoId: didResult.videoId,
        videoUrl: didResult.videoUrl,
        duration: didResult.duration,
        localFile: generatedData.video.localFile,
        text: summaryData.summary.substring(0, 100)
      });
      
      // 保存成功の通知
      if (generatedData.video.localFile) {
        console.log('✅ 動画が正常に保存されました:', generatedData.video.localFile.publicUrl);
      }
      
      // 完了表示のため少し待機
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 成功メッセージを表示
      if (generatedData.video.localFile) {
        alert(`動画生成が完了しました！\nファイル: ${generatedData.video.localFile.filename}\n保存場所: public/generated-videos/\nテキスト: ${summaryData.summary.substring(0, 50)}...`);
      } else {
        alert('動画生成は完了しましたが、ファイルの保存に失敗しました。');
      }
      
    } catch (error) {
      console.error('💥 動画生成エラー:', error);
      alert(`動画生成に失敗しました: ${error instanceof Error ? error.message : '不明なエラー'}`);
    } finally {
      setIsGenerating(false);
      router.push('/video-library');
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 'summary':
        return (
          <div className="space-y-6">
            {/* 元の記事テキストの表示 */}
            {summaryData.originalText && (
              <div className="space-y-2">
                <Label>元の記事テキスト</Label>
                <div className="p-4 bg-muted/50 rounded-lg max-h-60 overflow-y-auto">
                  <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                    {summaryData.originalText}
                  </p>
                </div>
                <p className="text-sm text-muted-foreground">
                  元の記事テキスト（{summaryData.originalText.length}文字）
                </p>
              </div>
            )}

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
                要約を編集して、動画の内容を調整できます（{summaryData.summary.length}文字）
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

            <div className="space-y-4">
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  💡 音声の詳細設定は動画生成時に自動的に最適化されます。
                  選択した音声タイプに基づいて、Microsoft TTSが使用されます。
                </p>
              </div>
            </div>

            <div className="flex justify-center">
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-800">
                  🎵 音声プレビューは動画生成時に自動的に生成されます。
                  選択した音声タイプ: <strong>{voiceOptions.find(v => v.value === voiceSettings.voice)?.label}</strong>
                </p>
              </div>
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
                    <SelectItem value="vertical">縦型 (9:16) - TikTok/Instagram Reels</SelectItem>
                    <SelectItem value="square">正方形 (1:1) - Instagram Posts</SelectItem>
                    <SelectItem value="horizontal">横型 (16:9) - YouTube/YouTube Shorts</SelectItem>
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
                  {progress < 80 && <p>🎬 D-ID APIで動画を生成中...</p>}
                  {progress >= 80 && progress < 95 && <p>💾 動画ファイルを保存中...</p>}
                  {progress >= 95 && progress < 100 && <p>🎯 最終処理中...</p>}
                  {progress >= 100 && <p>✅ 生成完了！動画が generated-videos フォルダに保存されました</p>}
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
                  {Icon && <Icon className="h-5 w-5" />}
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

export default function VideoGenerationPage() {
  return (
    <ProtectedRoute>
      <Suspense fallback={<div>Loading...</div>}>
        <VideoGenerationContent />
      </Suspense>
    </ProtectedRoute>
  )
}
