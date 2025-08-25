"use client"

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Play, 
  Download, 
  Share, 
  Clock, 
  FileVideo,
  ExternalLink,
  Copy
} from 'lucide-react'

interface VideoItem {
  id: string
  filename: string
  title: string
  summary: string
  videoUrl: string
  duration: number
  createdAt: string
  quality: string
  format: string
  size: number
}

export default function VideoLibraryPage() {
  const [videos, setVideos] = useState<VideoItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // APIから動画一覧を取得
    const loadVideos = async () => {
      try {
        console.log('📡 動画一覧を取得中...');
        const response = await fetch('/api/videos');
        
        if (response.ok) {
          const result = await response.json();
          if (result.success) {
            console.log('✅ 動画一覧取得成功:', result.videos.length, '件');
            setVideos(result.videos);
          } else {
            console.error('❌ 動画一覧取得失敗:', result.error);
          }
        } else {
          console.error('❌ 動画一覧API エラー:', response.status);
        }
      } catch (error) {
        console.error('💥 動画読み込みエラー:', error);
      } finally {
        setLoading(false);
      }
    }
    
    loadVideos();
  }, [])

  const handleDownload = async (video: VideoItem) => {
    try {
      const response = await fetch(video.videoUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${video.title}.mp4`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('ダウンロードエラー:', error)
      alert('ダウンロードに失敗しました')
    }
  }

  const handleShare = async (video: VideoItem) => {
    try {
      await navigator.clipboard.writeText(video.videoUrl)
      alert('動画URLをクリップボードにコピーしました')
    } catch (error) {
      console.error('共有エラー:', error)
      alert('共有に失敗しました')
    }
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">動画を読み込み中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">動画ライブラリ</h1>
        <p className="text-muted-foreground mt-2">
          生成された動画の一覧です。YouTubeやSNSにアップロードできます。
        </p>
      </div>

      {/* Video Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map((video) => (
          <Card key={video.id} className="overflow-hidden">
            <div className="aspect-video bg-muted relative">
              <video
                src={video.videoUrl}
                className="w-full h-full object-cover"
                controls
                preload="metadata"
              />
              <div className="absolute top-2 right-2">
                <Badge variant="secondary" className="text-xs">
                  {formatDuration(video.duration)}
                </Badge>
              </div>
            </div>
            
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">{video.title}</CardTitle>
              <CardDescription className="line-clamp-2">
                {video.summary}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="pt-0">
              <div className="space-y-3">
                {/* Video Info */}
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4" />
                    <span>{formatDate(video.createdAt)}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FileVideo className="h-4 w-4" />
                    <span>{video.quality}</span>
                  </div>
                </div>
                
                <div className="text-sm text-muted-foreground">
                  <span>フォーマット: {video.format}</span>
                  <span className="ml-4">サイズ: {(video.size / 1024).toFixed(1)} KB</span>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownload(video)}
                    className="flex-1"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    ダウンロード
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleShare(video)}
                    className="flex-1"
                  >
                    <Share className="h-4 w-4 mr-2" />
                    共有
                  </Button>
                </div>

                {/* Platform Upload Buttons */}
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground font-medium">
                    📤 プラットフォームにアップロード:
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open('https://www.youtube.com/upload', '_blank')}
                      className="text-xs"
                    >
                      <ExternalLink className="h-3 w-3 mr-1" />
                      YouTube
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open('https://www.tiktok.com/upload', '_blank')}
                      className="text-xs"
                    >
                      <ExternalLink className="h-3 w-3 mr-1" />
                      TikTok
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open('https://www.instagram.com', '_blank')}
                      className="text-xs"
                    >
                      <ExternalLink className="h-3 w-3 mr-1" />
                      Instagram
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open('https://twitter.com/compose/tweet', '_blank')}
                      className="text-xs"
                    >
                      <ExternalLink className="h-3 w-3 mr-1" />
                      Twitter/X
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {videos.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <FileVideo className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">動画がありません</h3>
            <p className="text-muted-foreground mb-4">
              まだ動画が生成されていません。動画生成ページで新しい動画を作成してください。
            </p>
            <Button onClick={() => window.location.href = '/video-generation'}>
              動画生成を開始
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
