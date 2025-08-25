export interface DIDVideoOptions {
  presenterId?: string;
  backgroundUrl?: string;
  backgroundType?: 'image' | 'video' | 'color';
  driverId?: string;
  driverType?: 'video' | 'audio';
  audioUrl?: string; // 音声ファイルのURL
  voice?: {
    type: string;
    input: string;
    stitch?: boolean;
    resultFormat?: 'mp4' | 'webm';
    quality?: 'draft' | 'premium' | 'hd';
    resolution?: '360p' | '480p' | '720p' | '1080p';
  };
}

export interface DIDVideoResponse {
  success: boolean;
  videoUrl?: string;
  videoId?: string;
  status?: string;
  error?: string;
  duration?: number;
}

// D-ID APIキーを取得
function getDIDApiKey(): string {
  // 提供されたAPIキーを使用
  const apiKey = 'bG9uZ3Bpbmd4aWd1QGdtYWlsLmNvbQ:zfmflBldtTMqqFStj8SAy';

  console.log('🔑 DID_API_KEY:', apiKey);
  
  console.log('🔑 D-ID API Key Status:', {
    hasKey: !!apiKey,
    keyLength: apiKey.length,
    keyPreview: apiKey ? `${apiKey.substring(0, 10)}...` : 'Not set'
  });
  
  if (!apiKey) {
    console.warn('⚠️ DID_API_KEYが設定されていません');
  }
  
  return apiKey;
}

// D-ID APIのベースURL
const DID_API_BASE_URL = 'https://api.d-id.com';

/**
 * D-ID APIにリクエストを送信
 */
async function didApiRequest(endpoint: string, method: string = 'GET', body?: Record<string, unknown>) {
  const apiKey = getDIDApiKey();
  
  if (!apiKey) {
    throw new Error('DID_API_KEYが設定されていません');
  }

  const url = `${DID_API_BASE_URL}${endpoint}`;
  const options: RequestInit = {
    method,
    headers: {
      'Authorization': `Basic ${apiKey}`,
      'Content-Type': 'application/json',
    },
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  console.log(`📡 D-ID API ${method} ${endpoint}:`, body || '');
  
  const response = await fetch(url, options);
  
      if (!response.ok) {
      const errorText = await response.text();
      console.error(`💥 D-ID API Error ${response.status}:`, errorText);
      
      // 詳細なエラー情報を表示
      if (response.status === 401) {
        console.error('🔑 認証エラー: APIキーが無効または期限切れです');
      } else if (response.status === 402) {
        console.error('💰 クレジット不足: 動画生成のクレジットが不足しています');
        console.error('💡 解決方法: D-ID Studioで有料プランにアップグレードしてください');
      } else if (response.status === 403) {
        console.error('🚫 権限エラー: このAPIエンドポイントへのアクセス権限がありません');
        console.error('💡 解決方法: D-ID Studioで有料プランにアップグレードしてください');
      } else if (response.status === 429) {
        console.error('⏰ レート制限: API呼び出し回数が上限に達しました');
      }
      
      throw new Error(`D-ID API Error ${response.status}: ${errorText}`);
    }

  return await response.json();
}

/**
 * 動画を生成
 */
export async function createDIDVideo(
  text: string,
  options: DIDVideoOptions = {}
): Promise<DIDVideoResponse> {
  try {
    if (!text || text.trim().length === 0) {
      throw new Error('テキストが空です');
    }

    console.log('🎬 D-ID 動画生成開始:', {
      textLength: text.length,
      presenterId: options.presenterId,
      backgroundType: options.backgroundType,
      driverType: options.driverType,
      audioUrl: options.audioUrl
    });

    // APIキーが正しく設定されているか確認
    const apiKey = getDIDApiKey();
    if (!apiKey) {
      throw new Error('DID_API_KEYが設定されていません');
    }

    // デフォルト設定
    const defaultOptions: DIDVideoOptions = {
      presenterId: 'amy-Aq6OmG2joV',
      backgroundType: 'color',
      driverType: 'audio',
      config: {
        fluent: true,
        padAudio: 0,
        stitch: true,
        resultFormat: 'mp4',
        quality: 'premium',
        resolution: '720p'
      }
    };

    // オプションをマージ
    const mergedOptions = { ...defaultOptions, ...options };

    // 動画生成リクエストを作成
    const requestBody: Record<string, unknown> = {
      script: {
        type: options.audioUrl ? 'audio' : 'text',
        input: text,
        audio_url: options.audioUrl || '',
        provider: options.audioUrl ? undefined : {
          type: 'microsoft',
          voice_id: options.voice?.input || 'ja-JP-NanamiNeural'
        }
      },
      config: mergedOptions.config,
      presenter_id: mergedOptions.presenterId,
      driver_id: mergedOptions.driverId,
      source_url: 'https://d-id-talks-prod.s3.us-west-2.amazonaws.com/google-oauth2%7C104911415641133930950/tlk_SvgTTEAvQI-lBKKQX3zxf/source/alice.jpg?AWSAccessKeyId=AKIA5CUMPJBIK65W6FGA&Expires=1756169146&Signature=fQSwpdSsgYyWmrGD%2F5oe6mGQrO4%3D'
    };

    // 背景設定がある場合
    if (mergedOptions.backgroundUrl) {
      requestBody.background = {
        type: mergedOptions.backgroundType,
        url: mergedOptions.backgroundUrl
      };
    }

    console.log('📡 D-ID API リクエスト送信:', requestBody);

    // 動画生成を開始
    const response = await didApiRequest('/talks', 'POST', requestBody);

    console.log('✅ D-ID 動画生成リクエスト成功:', {
      videoId: response.id,
      status: response.status
    });

    return {
      success: true,
      videoId: response.id,
      status: response.status
    };

  } catch (error) {
    console.error('💥 D-ID 動画生成エラー:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '不明なエラーが発生しました'
    };
  }
}

/**
 * 動画の状態を確認
 */
export async function getDIDVideoStatus(videoId: string): Promise<DIDVideoResponse> {
  try {
    console.log('📊 D-ID 動画状態確認:', { videoId });

    const response = await didApiRequest(`/talks/${videoId}`);

    console.log('✅ D-ID 動画状態取得成功:', {
      videoId: response.id,
      status: response.status,
      result: response.result,
      resultKeys: response.result ? Object.keys(response.result) : [],
      fullResponse: response
    });

    // 動画URLを複数の場所から探す
    const videoUrl = response.result_url || 
                    response.result?.video_url || 
                    response.result?.url || 
                    response.result?.videoUrl ||
                    response.video_url ||
                    response.url;

    console.log('🔍 動画URL検索結果:', {
      videoUrl,
      resultUrl: response.result_url,
      resultVideoUrl: response.result?.video_url,
      resultUrlAlt: response.result?.url,
      resultVideoUrlAlt: response.result?.videoUrl,
      responseVideoUrl: response.video_url,
      responseUrl: response.url
    });

    return {
      success: true,
      videoId: response.id,
      status: response.status,
      videoUrl: videoUrl,
      duration: response.result?.duration
    };

  } catch (error) {
    console.error('💥 D-ID 動画状態確認エラー:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '不明なエラーが発生しました'
    };
  }
}

/**
 * 動画生成の完了を待つ
 */
export async function waitForDIDVideoCompletion(
  videoId: string,
  maxWaitTime: number = 300000 // 5分
): Promise<DIDVideoResponse> {
  const startTime = Date.now();
  const checkInterval = 5000; // 5秒間隔

  while (Date.now() - startTime < maxWaitTime) {
    const status = await getDIDVideoStatus(videoId);
    
    if (!status.success) {
      return status;
    }

    if (status.status === 'done') {
      console.log('🎉 D-ID 動画生成完了:', { 
        videoId, 
        videoUrl: status.videoUrl,
        hasVideoUrl: !!status.videoUrl,
        fullStatus: status
      });
      return status;
    }

    if (status.status === 'error') {
      console.error('❌ D-ID 動画生成エラー:', { videoId, error: status.error });
      return {
        success: false,
        error: '動画生成中にエラーが発生しました'
      };
    }

    console.log('⏳ D-ID 動画生成中:', { videoId, status: status.status });
    await new Promise(resolve => setTimeout(resolve, checkInterval));
  }

  return {
    success: false,
    error: '動画生成がタイムアウトしました'
  };
}

/**
 * 利用可能なプレゼンター一覧を取得
 */
export async function getDIDPresenters() {
  try {
    // D-ID APIにはプレゼンター一覧取得APIがないため、固定リストを返す
    return {
      success: true,
      presenters: [
        { id: 'amy-Aq6OmG2joV', name: 'Amy' },
        { id: 'john-doe', name: 'John' },
        { id: 'sarah-jones', name: 'Sarah' }
      ]
    };
  } catch (error) {
    console.error('💥 D-ID プレゼンター一覧取得エラー:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '不明なエラーが発生しました'
    };
  }
}

/**
 * 利用可能なドライバー一覧を取得
 */
export async function getDIDDrivers() {
  try {
    // D-ID APIにはドライバー一覧取得APIがないため、固定リストを返す
    return {
      success: true,
      drivers: [
        { id: 'audio', name: 'Audio Driver' },
        { id: 'video', name: 'Video Driver' }
      ]
    };
  } catch (error) {
    console.error('💥 D-ID ドライバー一覧取得エラー:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '不明なエラーが発生しました'
    };
  }
}

/**
 * 動画生成と完了待ちのヘルパー関数
 */
export async function createAndWaitForDIDVideo(
  text: string,
  options: DIDVideoOptions = {}
): Promise<DIDVideoResponse> {
  console.log('🚀 createAndWaitForDIDVideo 開始:', { textLength: text.length, options });
  
  const createResult = await createDIDVideo(text, options);
  
  console.log('📋 動画生成リクエスト結果:', {
    success: createResult.success,
    videoId: createResult.videoId,
    error: createResult.error
  });
  
  if (!createResult.success || !createResult.videoId) {
    console.log('❌ 動画生成リクエスト失敗:', createResult);
    return createResult;
  }

  console.log('⏳ 動画完了待機開始:', { videoId: createResult.videoId });
  const waitResult = await waitForDIDVideoCompletion(createResult.videoId);
  
  console.log('🏁 動画完了待機結果:', {
    success: waitResult.success,
    videoId: waitResult.videoId,
    videoUrl: waitResult.videoUrl,
    status: waitResult.status,
    error: waitResult.error
  });
  
  return waitResult;
}
