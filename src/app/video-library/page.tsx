"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { 
  Video, 
  Search, 
  Filter, 
  Download, 
  Share, 
  Edit, 
  Trash2, 
  Play,
  Eye,
  TrendingUp,
  Calendar,
  Clock,
  MoreVertical,
  ExternalLink
} from 'lucide-react'

export default function VideoLibraryPage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterCategory, setFilterCategory] = useState('all')
  const [selectedVideo, setSelectedVideo] = useState(null)

  const [videos, setVideos] = useState([
    {
      id: 1,
      title: "AI技術の最新動向について",
      description: "生成AIの進歩と企業での導入事例を解説",
      thumbnail: "/api/placeholder/320/180",
      duration: 15,
      views: 1250,
      engagement: 92,
      category: 'technology',
      status: 'published',
      createdAt: '2024-08-23T10:30:00Z',
      publishedAt: '2024-08-23T11:00:00Z',
      platforms: ['tiktok', 'instagram', 'youtube'],
      fileSize: '2.4 MB',
      format: 'vertical'
    },
    {
      id: 2,
      title: "経済ニュース：株価上昇の背景",
      description: "最近の株価上昇の要因と今後の見通し",
      thumbnail: "/api/placeholder/320/180",
      duration: 20,
      views: 890,
      engagement: 87,
      category: 'business',
      status: 'published',
      createdAt: '2024-08-23T08:15:00Z',
      publishedAt: '2024-08-23T09:00:00Z',
      platforms: ['tiktok', 'instagram'],
      fileSize: '3.1 MB',
      format: 'vertical'
    },
    {
      id: 3,
      title: "スポーツ：サッカー日本代表の活躍",
      description: "最新の試合結果と選手の活躍を紹介",
      thumbnail: "/api/placeholder/320/180",
      duration: 18,
      views: 0,
      engagement: 0,
      category: 'sports',
      status: 'processing',
      createdAt: '2024-08-23T12:00:00Z',
      publishedAt: null,
      platforms: [],
      fileSize: null,
      format: 'vertical'
    },
    {
      id: 4,
      title: "健康ニュース：新しい治療法の発見",
      description: "画期的な医療技術の開発について",
      thumbnail: "/api/placeholder/320/180",
      duration: 25,
      views: 2100,
      engagement: 94,
      category: 'health',
      status: 'published',
      createdAt: '2024-08-22T16:45:00Z',
      publishedAt: '2024-08-22T17:30:00Z',
      platforms: ['tiktok', 'instagram', 'youtube'],
      fileSize: '4.2 MB',
      format: 'square'
    }
  ])

  const categories = [
    { value: 'all', label: 'すべて' },
    { value: 'technology', label: 'テクノロジー' },
    { value: 'business', label: 'ビジネス' },
    { value: 'sports', label: 'スポーツ' },
    { value: 'health', label: '健康' },
    { value: 'entertainment', label: 'エンターテイメント' }
  ]

  const statusOptions = [
    { value: 'all', label: 'すべて' },
    { value: 'published', label: '公開済み' },
    { value: 'processing', label: '処理中' },
    { value: 'draft', label: '下書き' },
    { value: 'failed', label: '失敗' }
  ]

  const platformIcons = {
    tiktok: '🎵',
    instagram: '📷',
    youtube: '📺'
  }

  const filteredVideos = videos.filter(video => {
    const matchesSearch = video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         video.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || video.status === filterStatus
    const matchesCategory = filterCategory === 'all' || video.category === filterCategory
    
    return matchesSearch && matchesStatus && matchesCategory
  })

  const getStatusBadge = (status) => {
    const statusConfig = {
      published: { variant: 'default', label: '公開済み', color: 'bg-green-500' },
      processing: { variant: 'secondary', label: '処理中', color: 'bg-yellow-500' },
      draft: { variant: 'outline', label: '下書き', color: 'bg-gray-500' },
      failed: { variant: 'destructive', label: '失敗', color: 'bg-red-500' }
    }
    
    const config = statusConfig[status] || statusConfig.draft
    
    return (
      <Badge variant={config.variant} className="flex items-center space-x-1">
        <div className={`w-2 h-2 rounded-full ${config.color}`}></div>
        <span>{config.label}</span>
      </Badge>
    )
  }

  const formatDate = (dateString) => {
    if (!dateString) return '-'
    const date = new Date(dateString)
    return date.toLocaleDateString('ja-JP', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handleDownload = (video) => {
    // Simulate download
    console.log('Downloading video:', video.title)
  }

  const handleShare = (video) => {
    // Simulate share
    console.log('Sharing video:', video.title)
  }

  const handleDelete = (videoId) => {
    setVideos(prev => prev.filter(video => video.id !== videoId))
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">動画ライブラリ</h1>
          <p className="text-muted-foreground mt-2">
            生成された動画の管理と分析
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <Badge variant="outline" className="text-sm">
            {filteredVideos.length} 件の動画
          </Badge>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="動画を検索..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="ステータス" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="カテゴリー" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Video Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVideos.map((video) => (
          <Card key={video.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative">
              <div className="w-full h-48 bg-muted flex items-center justify-center">
                <Play className="h-12 w-12 text-muted-foreground" />
              </div>
              
              {/* Status overlay */}
              <div className="absolute top-2 left-2">
                {getStatusBadge(video.status)}
              </div>
              
              {/* Duration */}
              <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                {video.duration}s
              </div>
            </div>

            <CardContent className="p-4">
              <div className="space-y-3">
                <div>
                  <h3 className="font-semibold text-foreground line-clamp-2">
                    {video.title}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                    {video.description}
                  </p>
                </div>

                {/* Stats */}
                {video.status === 'published' && (
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Eye className="h-3 w-3" />
                      <span>{video.views.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <TrendingUp className="h-3 w-3" />
                      <span>{video.engagement}%</span>
                    </div>
                  </div>
                )}

                {/* Platforms */}
                {video.platforms.length > 0 && (
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-muted-foreground">投稿済み:</span>
                    <div className="flex space-x-1">
                      {video.platforms.map((platform) => (
                        <span key={platform} className="text-sm">
                          {platformIcons[platform]}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Date */}
                <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  <span>作成: {formatDate(video.createdAt)}</span>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setSelectedVideo(video)}
                      >
                        詳細
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>{selectedVideo?.title}</DialogTitle>
                        <DialogDescription>
                          動画の詳細情報と管理オプション
                        </DialogDescription>
                      </DialogHeader>
                      
                      {selectedVideo && (
                        <div className="space-y-6">
                          {/* Video Preview */}
                          <div className="w-full h-64 bg-muted rounded-lg flex items-center justify-center">
                            <Play className="h-16 w-16 text-muted-foreground" />
                          </div>

                          {/* Video Info */}
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-muted-foreground">ステータス:</span>
                              <div className="mt-1">{getStatusBadge(selectedVideo.status)}</div>
                            </div>
                            <div>
                              <span className="text-muted-foreground">カテゴリー:</span>
                              <p className="mt-1">{categories.find(c => c.value === selectedVideo.category)?.label}</p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">長さ:</span>
                              <p className="mt-1">{selectedVideo.duration}秒</p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">フォーマット:</span>
                              <p className="mt-1">{selectedVideo.format === 'vertical' ? '縦型' : selectedVideo.format === 'square' ? '正方形' : '横型'}</p>
                            </div>
                            {selectedVideo.fileSize && (
                              <div>
                                <span className="text-muted-foreground">ファイルサイズ:</span>
                                <p className="mt-1">{selectedVideo.fileSize}</p>
                              </div>
                            )}
                            <div>
                              <span className="text-muted-foreground">作成日:</span>
                              <p className="mt-1">{formatDate(selectedVideo.createdAt)}</p>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex flex-wrap gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleDownload(selectedVideo)}
                              className="flex items-center space-x-2"
                            >
                              <Download className="h-4 w-4" />
                              <span>ダウンロード</span>
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleShare(selectedVideo)}
                              className="flex items-center space-x-2"
                            >
                              <Share className="h-4 w-4" />
                              <span>共有</span>
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="flex items-center space-x-2"
                            >
                              <Edit className="h-4 w-4" />
                              <span>編集</span>
                            </Button>
                            <Button 
                              variant="destructive" 
                              size="sm"
                              onClick={() => handleDelete(selectedVideo.id)}
                              className="flex items-center space-x-2"
                            >
                              <Trash2 className="h-4 w-4" />
                              <span>削除</span>
                            </Button>
                          </div>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>

                  <div className="flex space-x-1">
                    {video.status === 'published' && (
                      <>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDownload(video)}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleShare(video)}
                        >
                          <Share className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredVideos.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <Video className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">動画が見つかりません</h3>
            <p className="text-muted-foreground mb-4">
              検索条件を変更するか、新しい動画を作成してください
            </p>
            <Button variant="outline">
              新しい動画を作成
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
