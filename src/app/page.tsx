"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/contexts/AuthContext"
import { 
  Video, 
  FileText, 
  TrendingUp, 
  Clock, 
  Play,
  Plus,
  BarChart3,
  Eye,
  LogIn
} from "lucide-react"

// モックデータ
const stats = {
  totalVideos: 24,
  totalViews: 15420,
  totalEngagement: 89,
  processingVideos: 2
}

const recentVideos = [
  {
    id: 1,
    title: "AI技術の最新動向について",
    thumbnail: "/api/placeholder/160/90",
    views: 1250,
    engagement: 92,
    createdAt: "2時間前",
    status: "published"
  },
  {
    id: 2,
    title: "経済ニュース：株価上昇の背景",
    thumbnail: "/api/placeholder/160/90",
    views: 890,
    engagement: 87,
    createdAt: "5時間前",
    status: "published"
  },
  {
    id: 3,
    title: "スポーツ：サッカー日本代表の活躍",
    thumbnail: "/api/placeholder/160/90",
    views: 0,
    engagement: 0,
    createdAt: "処理中",
    status: "processing"
  }
]

export default function Dashboard() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">読み込み中...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="space-y-8">
        {/* Welcome Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-foreground">AI動画生成アプリへようこそ</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            AI要約×ショート動画生成で、ニュース記事を魅力的な動画コンテンツに変換しましょう
          </p>
          <div className="flex justify-center space-x-4">
            <Link href="/login">
              <Button size="lg" className="flex items-center space-x-2">
                <LogIn className="h-5 w-5" />
                <span>ログイン</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>AI要約</span>
              </CardTitle>
              <CardDescription>
                ニュース記事をAIが自動で要約し、重要なポイントを抽出
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Video className="h-5 w-5" />
                <span>動画生成</span>
              </CardTitle>
              <CardDescription>
                AIキャラクターと音声合成で魅力的な動画を自動生成
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5" />
                <span>簡単共有</span>
              </CardTitle>
              <CardDescription>
                生成された動画をSNSに簡単にアップロード
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">ダッシュボード</h1>
          <p className="text-muted-foreground mt-2">
            AI要約×ショート動画生成の管理画面
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex space-x-2">
          <Link href="/news-input">
            <Button className="flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>新しい動画を作成</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">総動画数</CardTitle>
            <Video className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalVideos}</div>
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
            <div className="text-2xl font-bold">{stats.totalViews.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +12% 先週比
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">平均エンゲージメント</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalEngagement}%</div>
            <p className="text-xs text-muted-foreground">
              +5% 先月比
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">処理中</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.processingVideos}</div>
            <p className="text-xs text-muted-foreground">
              動画生成中
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Videos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Video className="h-5 w-5" />
            <span>最近の動画</span>
          </CardTitle>
          <CardDescription>
            最近作成された動画の一覧
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentVideos.map((video) => (
              <div key={video.id} className="flex items-center space-x-4 p-4 border border-border rounded-lg">
                <div className="w-20 h-12 bg-muted rounded flex items-center justify-center">
                  <Play className="h-6 w-6 text-muted-foreground" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-foreground truncate">
                    {video.title}
                  </h3>
                  <div className="flex items-center space-x-4 mt-1 text-sm text-muted-foreground">
                    <span className="flex items-center space-x-1">
                      <Eye className="h-3 w-3" />
                      <span>{video.views.toLocaleString()} 回再生</span>
                    </span>
                    {video.status === 'published' && (
                      <span className="flex items-center space-x-1">
                        <TrendingUp className="h-3 w-3" />
                        <span>{video.engagement}% エンゲージメント</span>
                      </span>
                    )}
                    <span>{video.createdAt}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {video.status === 'processing' ? (
                    <Badge variant="secondary" className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                      <span>処理中</span>
                    </Badge>
                  ) : (
                    <Badge className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>公開済み</span>
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 text-center">
            <Link href="/video-library">
              <Button variant="outline">
                すべての動画を見る
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <Link href="/news-input">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>ニュース記事から動画作成</span>
              </CardTitle>
              <CardDescription>
                URLまたはテキストから自動で動画を生成
              </CardDescription>
            </CardHeader>
          </Link>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <Link href="/video-generation">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Video className="h-5 w-5" />
                <span>カスタム動画生成</span>
              </CardTitle>
              <CardDescription>
                詳細設定で動画をカスタマイズ
              </CardDescription>
            </CardHeader>
          </Link>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <Link href="/settings">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5" />
                <span>分析とレポート</span>
              </CardTitle>
              <CardDescription>
                動画のパフォーマンスを確認
              </CardDescription>
            </CardHeader>
          </Link>
        </Card>
      </div>
    </div>
  )
}
