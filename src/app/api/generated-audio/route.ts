import { NextRequest, NextResponse } from 'next/server';
import { readdir, stat } from 'fs/promises';
import { join } from 'path';

export async function GET(request: NextRequest) {
  try {
    const audioDir = join(process.cwd(), 'public', 'generated-audio');
    
    // ディレクトリ内のファイル一覧を取得
    const files = await readdir(audioDir);
    
    // mp3ファイルのみをフィルタリング
    const mp3Files = files.filter(file => file.endsWith('.mp3'));
    
    // ファイル情報を取得
    const fileInfos = await Promise.all(
      mp3Files.map(async (filename) => {
        const filePath = join(audioDir, filename);
        const stats = await stat(filePath);
        
        return {
          filename,
          publicUrl: `/generated-audio/${filename}`,
          size: stats.size,
          sizeFormatted: `${(stats.size / 1024).toFixed(2)} KB`,
          createdAt: stats.birthtime.toISOString(),
          modifiedAt: stats.mtime.toISOString()
        };
      })
    );
    
    // 作成日時でソート（新しい順）
    fileInfos.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    console.log('📁 生成された音声ファイル一覧:', {
      totalFiles: fileInfos.length,
      totalSize: `${(fileInfos.reduce((acc, file) => acc + file.size, 0) / 1024 / 1024).toFixed(2)} MB`
    });
    
    return NextResponse.json({
      success: true,
      files: fileInfos,
      totalCount: fileInfos.length
    });
    
  } catch (error) {
    console.error('💥 音声ファイル一覧取得エラー:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : '不明なエラーが発生しました',
      files: []
    }, { status: 500 });
  }
}
