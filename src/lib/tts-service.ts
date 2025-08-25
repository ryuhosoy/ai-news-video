import { ElevenLabsClient } from '@elevenlabs/elevenlabs-js';

export interface TTSOptions {
  voiceId?: string;
  modelId?: string;
  outputFormat?: string;
  stability?: number;
  similarityBoost?: number;
  style?: number;
  useSpeakerBoost?: boolean;
}

export interface TTSResponse {
  success: boolean;
  audioUrl?: string;
  audioBuffer?: ArrayBuffer;
  error?: string;
  duration?: number;
}

// ElevenLabsの音声ID（日本語対応）
const VOICE_IDS = {
  female_voice: 'JBFqnCBsd6RMkjVDRZzb', // 女性の声（標準）
  male_voice: 'pNInz6obpgDQGcFmaJgB',   // 男性の声（標準）
  female_news: '21m00Tcm4TlvDq8ikWAM', // 女性の声（ニュース調）
  male_news: 'AZnzlk1XvdvUeBnXmlld',   // 男性の声（ニュース調）
  female_japanese: 'JBFqnCBsd6RMkjVDRZzb', // 日本語女性
  male_japanese: 'pNInz6obpgDQGcFmaJgB',   // 日本語男性
};

// デフォルト設定
const DEFAULT_OPTIONS: TTSOptions = {
  voiceId: VOICE_IDS.female_voice,
  modelId: 'eleven_multilingual_v2', // 多言語対応モデル
  outputFormat: 'mp3_44100_128',
  stability: 0.5,
  similarityBoost: 0.75,
  style: 0.0,
  useSpeakerBoost: true,
};

// ElevenLabs APIキーを取得
function getElevenLabsApiKey(): string {
  const apiKey = process.env.ELEVENLABS_API_KEY || '';
  console.log('🔑 ElevenLabs API Key Status:', {
    hasKey: !!apiKey,
    keyLength: apiKey.length,
    keyPreview: apiKey ? `${apiKey.substring(0, 10)}...` : 'Not set'
  });
  
  if (!apiKey) {
    console.warn('⚠️ ELEVENLABS_API_KEYが設定されていません');
  }
  
  return apiKey;
}

// ElevenLabsクライアントを初期化
function createElevenLabsClient() {
  const apiKey = getElevenLabsApiKey();
  
  if (!apiKey) {
    throw new Error('ELEVENLABS_API_KEYが設定されていません');
  }
  
  const client = new ElevenLabsClient({
    apiKey: apiKey,
  });
  
  console.log('✅ ElevenLabs Client initialized');
  return client;
}

/**
 * テキストを音声に変換
 */
export async function textToSpeech(
  text: string,
  options: TTSOptions = {}
): Promise<TTSResponse> {
  try {
    const apiKey = getElevenLabsApiKey();
    
    if (!apiKey) {
      throw new Error('ELEVENLABS_API_KEYが設定されていません');
    }

    if (!text || text.trim().length === 0) {
      throw new Error('テキストが空です');
    }

    // オプションをマージ
    const mergedOptions = { ...DEFAULT_OPTIONS, ...options };
    
    // 音声IDを取得
    const voiceId = mergedOptions.voiceId || DEFAULT_OPTIONS.voiceId!;

    console.log('音声合成を開始:', {
      textLength: text.length,
      voiceId,
      modelId: mergedOptions.modelId,
    });

    const client = createElevenLabsClient();

    // 音声合成を実行
    console.log('🎵 ElevenLabs API呼び出し開始');
    const audio = await client.textToSpeech.convert(voiceId, {
      text: text,
      modelId: mergedOptions.modelId!,
      outputFormat: mergedOptions.outputFormat as any,
      voiceSettings: {
        stability: mergedOptions.stability!,
        similarityBoost: mergedOptions.similarityBoost!,
        style: mergedOptions.style!,
        useSpeakerBoost: mergedOptions.useSpeakerBoost!,
      },
    });
    console.log('🎵 ElevenLabs API呼び出し完了');

    // 音声データをArrayBufferに変換
    let audioBuffer: ArrayBuffer;
    
    console.log('🔍 音声データの型を確認:', {
      type: typeof audio,
      constructor: audio?.constructor?.name,
      hasArrayBuffer: typeof (audio as any)?.arrayBuffer === 'function',
      isResponse: audio instanceof Response,
      isReadableStream: audio instanceof ReadableStream,
      keys: audio ? Object.keys(audio) : []
    });
    
    try {
      if (audio instanceof Response) {
        // Responseオブジェクトの場合
        audioBuffer = await audio.arrayBuffer();
      } else if (audio instanceof ReadableStream) {
        // ReadableStreamの場合
        const reader = audio.getReader();
        const chunks: Uint8Array[] = [];
        
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          chunks.push(value);
        }
        
        const totalLength = chunks.reduce((acc, chunk) => acc + chunk.length, 0);
        const audioArray = new Uint8Array(totalLength);
        let offset = 0;
        
        for (const chunk of chunks) {
          audioArray.set(chunk, offset);
          offset += chunk.length;
        }
        
        audioBuffer = audioArray.buffer;
      } else if (typeof (audio as any)?.arrayBuffer === 'function') {
        // arrayBufferメソッドが存在する場合
        audioBuffer = await (audio as any).arrayBuffer();
      } else if ((audio as any) instanceof ArrayBuffer) {
        // すでにArrayBufferの場合
        audioBuffer = audio as ArrayBuffer;
      } else if ((audio as any) instanceof Uint8Array) {
        // Uint8Arrayの場合
        const uint8Array = audio as Uint8Array;
        audioBuffer = uint8Array.buffer.slice(0) as ArrayBuffer;
      } else {
        // その他の場合、音声データを直接使用
        console.error('❌ サポートされていない音声データ形式:', audio);
        throw new Error(`サポートされていない音声データ形式: ${typeof audio}`);
      }
    } catch (error) {
      console.error('💥 音声データ変換エラー:', error);
      throw new Error(`音声データの変換に失敗しました: ${error instanceof Error ? error.message : '不明なエラー'}`);
    }

    // 音声の長さを推定（概算）
    const duration = estimateDuration(text);

    console.log('🎵 音声合成完了:', {
      audioSize: audioBuffer.byteLength,
      estimatedDuration: duration,
      textLength: text.length,
      voiceId: voiceId,
      modelId: mergedOptions.modelId,
    });

    return {
      success: true,
      audioBuffer,
      duration,
    };

  } catch (error) {
    console.error('音声合成エラー:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '不明なエラーが発生しました',
    };
  }
}

/**
 * 音声の長さを推定（概算）
 */
function estimateDuration(text: string): number {
  // 日本語の場合、1文字あたり約0.3秒と仮定
  const japaneseChars = text.match(/[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/g)?.length || 0;
  
  // 英語の場合、1単語あたり約0.5秒と仮定
  const englishWords = text.match(/[a-zA-Z]+/g)?.length || 0;
  
  // 句読点や記号も考慮
  const punctuation = text.match(/[。！？、，．]/g)?.length || 0;
  
  const duration = (japaneseChars * 0.3) + (englishWords * 0.5) + (punctuation * 0.2);
  
  return Math.max(duration, 1); // 最低1秒
}

/**
 * 利用可能な音声一覧を取得
 */
export async function getAvailableVoices() {
  try {
    const client = createElevenLabsClient();
    const voices = await client.voices.getAll();
    return {
      success: true,
      voices: voices.voices,
    };
  } catch (error) {
    console.error('音声一覧取得エラー:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '不明なエラーが発生しました',
    };
  }
}

/**
 * 音声設定のプリセット
 */
export function getVoicePresets() {
  return {
    news: {
      stability: 0.7,
      similarityBoost: 0.8,
      style: 0.0,
      useSpeakerBoost: true,
    },
    casual: {
      stability: 0.3,
      similarityBoost: 0.6,
      style: 0.3,
      useSpeakerBoost: false,
    },
    professional: {
      stability: 0.8,
      similarityBoost: 0.9,
      style: 0.0,
      useSpeakerBoost: true,
    },
  };
}

/**
 * 音声IDを取得
 */
export function getVoiceId(voiceType: string): string {
  return VOICE_IDS[voiceType as keyof typeof VOICE_IDS] || VOICE_IDS.female_voice;
}

/**
 * 音声合成のヘルパー関数
 */
export async function generateSpeech(
  text: string,
  voiceType: string = 'female_voice',
  options: Partial<TTSOptions> = {}
): Promise<TTSResponse> {
  const voiceId = getVoiceId(voiceType);
  
  return await textToSpeech(text, {
    voiceId,
    ...options,
  });
}
