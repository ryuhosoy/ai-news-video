import { NextResponse } from 'next/server';
import { readdir, stat } from 'fs/promises';
import { join } from 'path';

export interface VideoInfo {
  id: string;
  filename: string;
  title: string;
  summary: string;
  videoUrl: string;
  duration: number;
  createdAt: string;
  quality: string;
  format: string;
  size: number;
}

export async function GET() {
  try {
    const videosDir = join(process.cwd(), 'public', 'generated-videos');
    
    // ディレクトリが存在しない場合は空配列を返す
    try {
      await stat(videosDir);
    } catch {
      return NextResponse.json({
        success: true,
        videos: []
      });
    }

    // ディレクトリ内のファイルを取得
    const files = await readdir(videosDir);
    const videoFiles = files.filter(file => file.endsWith('.mp4'));

    const videos: VideoInfo[] = [];

    for (const file of videoFiles) {
      try {
        const filePath = join(videosDir, file);
        const fileStats = await stat(filePath);
        
        // ファイル名から情報を抽出
        const filenameParts = file.replace('.mp4', '').split('-');
        const summary = filenameParts[0] || '動画';
        const quality = filenameParts[2] || 'standard';
        
        const video: VideoInfo = {
          id: file.replace('.mp4', ''),
          filename: file,
          title: summary,
          summary: `${summary}についての動画です。`,
          videoUrl: `/generated-videos/${file}`,
          duration: 15, // デフォルト値
          createdAt: fileStats.birthtime.toISOString(),
          quality: quality === 'high' ? '高画質' : quality === 'medium' ? '標準画質' : '低画質',
          format: '横型 (16:9)', // デフォルト値
          size: fileStats.size
        };
        
        videos.push(video);
      } catch (error) {
        console.error(`ファイル情報取得エラー (${file}):`, error);
      }
    }

    // 作成日時で降順ソート
    videos.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    console.log('📹 動画一覧取得成功:', {
      count: videos.length,
      videos: videos.map(v => ({ filename: v.filename, size: v.size }))
    });

    return NextResponse.json({
      success: true,
      videos
    });

  } catch (error) {
    console.error('💥 動画一覧取得エラー:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : '不明なエラーが発生しました'
    }, { status: 500 });
  }
}
