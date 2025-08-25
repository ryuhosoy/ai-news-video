import { NextRequest, NextResponse } from 'next/server';
import { extractArticleFromUrl, extractMultipleArticles } from '@/lib/news-extractor';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url, urls, options } = body;

    // 単一URLの場合
    if (url) {
      const article = await extractArticleFromUrl(url, options);
      return NextResponse.json({
        success: true,
        data: article
      });
    }

    // 複数URLの場合
    if (urls && Array.isArray(urls)) {
      const articles = await extractMultipleArticles(urls, options);
      return NextResponse.json({
        success: true,
        data: articles
      });
    }

    return NextResponse.json({
      success: false,
      error: 'URLまたはURLsが必要です'
    }, { status: 400 });

  } catch (error) {
    console.error('記事抽出エラー:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : '不明なエラーが発生しました'
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');

  if (!url) {
    return NextResponse.json({
      success: false,
      error: 'URLパラメータが必要です'
    }, { status: 400 });
  }

  try {
    const article = await extractArticleFromUrl(url);
    return NextResponse.json({
      success: true,
      data: article
    });
  } catch (error) {
    console.error('記事抽出エラー:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : '不明なエラーが発生しました'
    }, { status: 500 });
  }
}
