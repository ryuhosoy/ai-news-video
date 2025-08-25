import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

export interface SavedFileInfo {
  filename: string;
  filepath: string;
  publicUrl: string;
  size: number;
  timestamp: string;
}

/**
 * ユニークなファイル名を生成
 */
function generateUniqueFilename(prefix: string = 'audio', extension: string = 'mp3'): string {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const randomId = Math.random().toString(36).substring(2, 8);
  return `${prefix}-${timestamp}-${randomId}.${extension}`;
}

/**
 * 音声ファイル用のファイル名を生成
 */
function generateAudioFilename(summary: string, voiceType: string): string {
  // 要約テキストから最初の20文字を取得してファイル名に使用
  const summaryPrefix = summary.substring(0, 20).replace(/[^a-zA-Z0-9\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/g, '');
  const timestamp = new Date().toISOString().slice(0, 19).replace(/[:.]/g, '-');
  const randomId = Math.random().toString(36).substring(2, 6);
  
  return `${summaryPrefix}-${voiceType}-${timestamp}-${randomId}.mp3`;
}

/**
 * Base64データをファイルとして保存
 */
async function saveBase64ToFile(
  base64Data: string,
  filename: string,
  directory: string = 'generated-audio'
): Promise<SavedFileInfo> {
  try {
    // ディレクトリのパスを作成
    const publicDir = join(process.cwd(), 'public', directory);
    const fullPath = join(publicDir, filename);
    
    // ディレクトリが存在しない場合は作成
    await mkdir(publicDir, { recursive: true });
    
    // Base64データをバッファに変換
    const buffer = Buffer.from(base64Data, 'base64');
    
    // ファイルを保存
    await writeFile(fullPath, buffer);
    
    // ファイル情報を返す
    const fileInfo: SavedFileInfo = {
      filename,
      filepath: fullPath,
      publicUrl: `/${directory}/${filename}`,
      size: buffer.length,
      timestamp: new Date().toISOString()
    };
    
    console.log('💾 ファイル保存完了:', fileInfo);
    return fileInfo;
    
  } catch (error) {
    console.error('💥 ファイル保存エラー:', error);
    throw new Error(`ファイルの保存に失敗しました: ${error instanceof Error ? error.message : '不明なエラー'}`);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { audioData, summary, voiceType } = body;

    if (!audioData) {
      return NextResponse.json({
        success: false,
        error: '音声データが必要です'
      }, { status: 400 });
    }

    console.log('💾 音声ファイル保存開始:', {
      hasAudioData: !!audioData,
      summaryLength: summary?.length || 0,
      voiceType
    });

    // ファイル名を生成
    const filename = generateAudioFilename(summary || 'audio', voiceType || 'unknown');
    
    // ファイルを保存
    const savedFileInfo = await saveBase64ToFile(audioData, filename, 'generated-audio');

    console.log('✅ 音声ファイル保存完了:', {
      filename: savedFileInfo.filename,
      size: `${(savedFileInfo.size / 1024).toFixed(2)} KB`,
      publicUrl: savedFileInfo.publicUrl
    });

    return NextResponse.json({
      success: true,
      fileInfo: savedFileInfo
    });

  } catch (error) {
    console.error('💥 音声ファイル保存API エラー:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : '不明なエラーが発生しました'
    }, { status: 500 });
  }
}
