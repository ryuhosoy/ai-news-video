import { NextRequest, NextResponse } from 'next/server';
import { createAndWaitForDIDVideo, getDIDPresenters, getDIDDrivers } from '@/lib/did-service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text, audioUrl, options } = body;

    console.log('🎬 D-ID 動画生成API リクエスト:', {
      text: text?.substring(0, 100) + (text?.length > 100 ? '...' : ''),
      textLength: text?.length || 0,
      hasOptions: !!options,
      voice: options?.voice,
      timestamp: new Date().toISOString()
    });

    if (!text || text.trim().length === 0) {
      console.log('❌ D-ID API Error: テキストが空です');
      return NextResponse.json({
        success: false,
        error: 'テキストが必要です'
      }, { status: 400 });
    }

    console.log('🚀 D-ID 動画生成開始...');
    
    // 動画生成を実行（動画の完了まで待機）
    const result = await createAndWaitForDIDVideo(text, {
      ...options,
      audioUrl: audioUrl
    });

    if (!result.success) {
      console.log('❌ D-ID API Error:', result.error);
      return NextResponse.json({
        success: false,
        error: result.error
      }, { status: 500 });
    }

    console.log('✅ D-ID 動画生成成功:', {
      videoId: result.videoId,
      videoUrl: result.videoUrl,
      duration: result.duration,
      hasVideoUrl: !!result.videoUrl,
      status: result.status
    });

    const responseData = {
      success: true,
      videoId: result.videoId,
      videoUrl: result.videoUrl,
      status: result.status,
      duration: result.duration
    };

    console.log('📤 D-ID API レスポンス送信:', responseData);

    return NextResponse.json(responseData);

  } catch (error) {
    console.error('💥 D-ID API エラー:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : '不明なエラーが発生しました'
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    console.log('📊 D-ID API GET リクエスト:', { action });

    if (action === 'presenters') {
      // プレゼンター一覧を取得
      const presentersResult = await getDIDPresenters();
      
      if (!presentersResult.success) {
        return NextResponse.json({
          success: false,
          error: presentersResult.error
        }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        presenters: presentersResult.presenters
      });

    } else if (action === 'drivers') {
      // ドライバー一覧を取得
      const driversResult = await getDIDDrivers();
      
      if (!driversResult.success) {
        return NextResponse.json({
          success: false,
          error: driversResult.error
        }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        drivers: driversResult.drivers
      });

    } else {
      return NextResponse.json({
        success: false,
        error: '無効なアクションです。action=presenters または action=drivers を指定してください'
      }, { status: 400 });
    }

  } catch (error) {
    console.error('💥 D-ID API GET エラー:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : '不明なエラーが発生しました'
    }, { status: 500 });
  }
}
