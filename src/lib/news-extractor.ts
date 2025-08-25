import { Readability } from '@mozilla/readability';
import { JSDOM } from 'jsdom';

export interface ExtractedArticle {
  title: string;
  content: string;
  contentText: string; // HTMLタグを除去した純粋なテキスト
  excerpt: string;
  siteName?: string;
  publishedTime?: string;
  author?: string;
  url: string;
  wordCount: number;
  readingTime: number;
}

export interface ExtractionOptions {
  timeout?: number;
  userAgent?: string;
  maxRetries?: number;
}

/**
 * ニュース記事のURLから本文を高精度で抽出する
 */
export async function extractArticleFromUrl(
  url: string,
  options: ExtractionOptions = {}
): Promise<ExtractedArticle> {
  const {
    timeout = 10000,
    userAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    maxRetries = 3
  } = options;

  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': userAgent,
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'ja,en-US;q=0.7,en;q=0.3',
          'Accept-Encoding': 'gzip, deflate, br',
          'DNT': '1',
          'Connection': 'keep-alive',
          'Upgrade-Insecure-Requests': '1',
        },
        signal: AbortSignal.timeout(timeout),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const html = await response.text();
      return extractArticleFromHtml(html, url);

    } catch (error) {
      lastError = error as Error;
      console.warn(`Attempt ${attempt} failed for ${url}:`, error);
      
      if (attempt < maxRetries) {
        // 指数バックオフでリトライ
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
      }
    }
  }

  throw new Error(`Failed to extract article from ${url} after ${maxRetries} attempts: ${lastError?.message}`);
}

/**
 * HTML文字列から記事の本文を抽出する
 */
export function extractArticleFromHtml(html: string, url: string): ExtractedArticle {
  const dom = new JSDOM(html, {
    url,
    pretendToBeVisual: true,
  });

  const reader = new Readability(dom.window.document);
  const article = reader.parse();

  if (!article) {
    throw new Error('記事の内容を抽出できませんでした');
  }

  // メタデータを抽出
  const meta = extractMetaData(dom.window.document);

  // HTMLタグを除去したテキストを取得
  const contentText = stripHtmlTags(article.content || '');
  
  // 文字数と読書時間を計算（純粋なテキストで計算）
  const wordCount = countWords(contentText);
  const readingTime = Math.ceil(wordCount / 400); // 1分間に400文字と仮定

  return {
    title: article.title || meta.title || 'タイトルなし',
    content: article.content || '',
    contentText: contentText,
    excerpt: article.excerpt || '',
    siteName: meta.siteName,
    publishedTime: meta.publishedTime,
    author: meta.author,
    url,
    wordCount,
    readingTime,
  };
}

/**
 * HTMLドキュメントからメタデータを抽出
 */
function extractMetaData(document: Document) {
  const meta: {
    title?: string;
    siteName?: string;
    publishedTime?: string;
    author?: string;
  } = {};

  // タイトル
  const titleElement = document.querySelector('title');
  if (titleElement) {
    meta.title = titleElement.textContent?.trim();
  }

  // サイト名
  const siteNameMeta = document.querySelector('meta[property="og:site_name"]');
  if (siteNameMeta) {
    meta.siteName = siteNameMeta.getAttribute('content')?.trim();
  }

  // 公開日時
  const publishedTimeMeta = document.querySelector('meta[property="article:published_time"]') ||
                           document.querySelector('meta[name="published_time"]') ||
                           document.querySelector('time[datetime]');
  if (publishedTimeMeta) {
    meta.publishedTime = publishedTimeMeta.getAttribute('content') || 
                        publishedTimeMeta.getAttribute('datetime')?.trim();
  }

  // 著者
  const authorMeta = document.querySelector('meta[name="author"]') ||
                    document.querySelector('meta[property="article:author"]') ||
                    document.querySelector('meta[property="og:author"]');
  if (authorMeta) {
    meta.author = authorMeta.getAttribute('content')?.trim();
  }

  return meta;
}

/**
 * HTMLタグを除去して純粋なテキストを取得
 */
function stripHtmlTags(html: string): string {
  if (!html) return '';
  
  // JSDOMを使用してHTMLをパース
  const dom = new JSDOM(html);
  const document = dom.window.document;
  
  // リンクのテキストを保持しながらHTMLタグを除去
  const links = document.querySelectorAll('a');
  links.forEach(link => {
    const linkText = link.textContent || '';
    if (linkText.trim()) {
      // リンクテキストを保持してリンクを置換
      link.replaceWith(linkText);
    } else {
      // 空のリンクは削除
      link.remove();
    }
  });
  
  // その他のHTMLタグを除去
  const textWithoutTags = document.body.textContent || '';
  
  // 複数の空白を単一の空白に置換
  const textWithoutExtraSpaces = textWithoutTags.replace(/\s+/g, ' ');
  
  // 前後の空白を除去
  return textWithoutExtraSpaces.trim();
}

/**
 * テキストの文字数をカウント（日本語と英語を考慮）
 */
function countWords(text: string): number {
  if (!text) return 0;
  
  // 日本語の文字数（ひらがな、カタカナ、漢字）
  const japaneseChars = text.match(/[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/g)?.length || 0;
  
  // 英語の単語数
  const englishWords = text.match(/[a-zA-Z]+/g)?.length || 0;
  
  // 数字と記号
  const otherChars = text.match(/[0-9\u3000-\u303F\uFF00-\uFFEF]/g)?.length || 0;
  
  return japaneseChars + englishWords + otherChars;
}

/**
 * 複数のURLから記事を一括抽出
 */
export async function extractMultipleArticles(
  urls: string[],
  options: ExtractionOptions = {}
): Promise<ExtractedArticle[]> {
  const results: ExtractedArticle[] = [];
  
  // 並列処理で複数のURLを処理（同時実行数を制限）
  const concurrency = 3;
  const chunks = [];
  
  for (let i = 0; i < urls.length; i += concurrency) {
    chunks.push(urls.slice(i, i + concurrency));
  }
  
  for (const chunk of chunks) {
    const promises = chunk.map(url => 
      extractArticleFromUrl(url, options).catch(error => {
        console.error(`Failed to extract ${url}:`, error);
        return null;
      })
    );
    
    const chunkResults = await Promise.all(promises);
    results.push(...chunkResults.filter(Boolean) as ExtractedArticle[]);
  }
  
  return results;
}
