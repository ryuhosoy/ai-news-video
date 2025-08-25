import { NextRequest, NextResponse } from 'next/server';
import { generateSpeech, textToSpeech, getAvailableVoices, getVoicePresets } from '@/lib/tts-service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text, voiceType, options } = body;

    console.log('🎤 TTS API Request:', {
      textLength: text?.length || 0,
      voiceType,
      hasOptions: !!options,
      timestamp: new Date().toISOString()
    });

    if (!text || text.trim().length === 0) {
      console.log('❌ TTS API Error: テキストが空です');
      return NextResponse.json({
        success: false,
        error: 'テキストが必要です'
      }, { status: 400 });
    }

    console.log('🚀 音声合成を開始...');
    // 音声合成を実行
    const result = await generateSpeech(text, voiceType, options);

    if (!result.success) {
      console.log('❌ TTS API Error:', result.error);
      return NextResponse.json({
        success: false,
        error: result.error
      }, { status: 500 });
    }

    console.log('✅ 音声合成成功:', {
      audioSize: result.audioBuffer?.byteLength || 0,
      duration: result.duration,
      format: 'mp3'
    });

    // 音声データをBase64エンコードして返す
    const audioBase64 = Buffer.from(result.audioBuffer!).toString('base64');

    console.log('📤 TTS API Response sent');

    return NextResponse.json({
      success: true,
      audio: audioBase64,
      duration: result.duration,
      format: 'mp3'
    });

  } catch (error) {
    console.error('💥 TTS API エラー:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : '不明なエラーが発生しました'
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    console.log('🎵 TTS API: 音声一覧を取得中...');
    // 利用可能な音声一覧を取得
    const voicesResult = await getAvailableVoices();
    
    if (!voicesResult.success) {
      console.log('❌ TTS API Error: 音声一覧取得失敗:', voicesResult.error);
      return NextResponse.json({
        success: false,
        error: voicesResult.error
      }, { status: 500 });
    }

    console.log('✅ TTS API: 音声一覧取得成功:', {
      voiceCount: voicesResult.voices?.length || 0,
      timestamp: new Date().toISOString()
    });

    return NextResponse.json({
      success: true,
      voices: voicesResult.voices,
      presets: getVoicePresets()
    });

  } catch (error) {
    console.error('音声一覧取得エラー:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : '不明なエラーが発生しました'
    }, { status: 500 });
  }
}
