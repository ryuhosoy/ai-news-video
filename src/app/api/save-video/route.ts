import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

export interface SavedVideoInfo {
  filename: string;
  filepath: string;
  publicUrl: string;
  size: number;
  timestamp: string;
}

/**
 * 動画ファイル用のファイル名を生成
 */
function generateVideoFilename(summary: string, character: string, quality: string): string {
  // 要約テキストから最初の20文字を取得してファイル名に使用
  const summaryPrefix = summary.substring(0, 20).replace(/[^a-zA-Z0-9\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/g, '');
  const timestamp = new Date().toISOString().slice(0, 19).replace(/[:.]/g, '-');
  const randomId = Math.random().toString(36).substring(2, 6);
  
  return `${summaryPrefix}-${character}-${quality}-${timestamp}-${randomId}.mp4`;
}

/**
 * URLから動画ファイルをダウンロードして保存
 */
async function downloadAndSaveVideo(
  videoUrl: string,
  filename: string,
  directory: string = 'generated-videos'
): Promise<SavedVideoInfo> {
  try {
    // ディレクトリのパスを作成
    const publicDir = join(process.cwd(), 'public', directory);
    const fullPath = join(publicDir, filename);
    
    // ディレクトリが存在しない場合は作成
    await mkdir(publicDir, { recursive: true });
    
    // 動画ファイルをダウンロード
    const response = await fetch(videoUrl);
    
    if (!response.ok) {
      throw new Error(`動画ダウンロード失敗: ${response.status}`);
    }
    
    const videoBuffer = await response.arrayBuffer();
    
    // ファイルを保存
    await writeFile(fullPath, Buffer.from(videoBuffer));
    
    // ファイル情報を返す
    const fileInfo: SavedVideoInfo = {
      filename,
      filepath: fullPath,
      publicUrl: `/${directory}/${filename}`,
      size: videoBuffer.byteLength,
      timestamp: new Date().toISOString()
    };
    
    console.log('💾 動画ファイル保存完了:', fileInfo);
    return fileInfo;
    
  } catch (error) {
    console.error('💥 動画ファイル保存エラー:', error);
    throw new Error(`動画ファイルの保存に失敗しました: ${error instanceof Error ? error.message : '不明なエラー'}`);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { videoUrl, summary, character, quality } = body;

    if (!videoUrl) {
      return NextResponse.json({
        success: false,
        error: '動画URLが必要です'
      }, { status: 400 });
    }

    console.log('💾 動画ファイル保存開始:', {
      hasVideoUrl: !!videoUrl,
      summaryLength: summary?.length || 0,
      character,
      quality
    });

    // ファイル名を生成
    const filename = generateVideoFilename(summary || 'video', character || 'unknown', quality || 'standard');
    
    // 動画ファイルをダウンロードして保存
    const savedVideoInfo = await downloadAndSaveVideo(videoUrl, filename, 'generated-videos');

    console.log('✅ 動画ファイル保存完了:', {
      filename: savedVideoInfo.filename,
      size: `${(savedVideoInfo.size / 1024 / 1024).toFixed(2)} MB`,
      publicUrl: savedVideoInfo.publicUrl
    });

    return NextResponse.json({
      success: true,
      videoInfo: savedVideoInfo
    });

  } catch (error) {
    console.error('💥 動画ファイル保存API エラー:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : '不明なエラーが発生しました'
    }, { status: 500 });
  }
}
