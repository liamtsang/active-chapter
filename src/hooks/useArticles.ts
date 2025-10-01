import useSWR from 'swr';

interface ArticleMetadata {
  id: string;
  title: string;
  author: string;
  journal: string;
  medium: string;
  publishDate: Date;
  tags: string[];
  coverImage: string;
}

interface Article extends ArticleMetadata {
  content: string;
}

const fetcherMetadata = async (url: string): Promise<ArticleMetadata[]> => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch: ${response.status}`);
  }
  return response.json();
};

const fetcherArticle = async (url: string): Promise<Article> => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch: ${response.status}`);
  }
  return response.json();
};

// Hook for article metadata (fast, cached)
export function useArticlesList() {
  const { data, error, isLoading, mutate } = useSWR<ArticleMetadata[]>(
    '/api/articles/list', 
    fetcherMetadata,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      refreshInterval: 5 * 60 * 1000, // 5 minutes
      keepPreviousData: true,
      // Dedupe requests within 2 seconds
      dedupingInterval: 2000,
    }
  );

  return {
    articles: data || [],
    isLoading,
    error,
    mutate,
  };
}

// Hook for individual article content (lazy loaded)
export function useArticleContent(title: string | null) {
  const shouldFetch = title !== null;
  const { data, error, isLoading, mutate } = useSWR<Article>(
    shouldFetch ? `/api/articles/title/${encodeURIComponent(title)}` : null,
    fetcherArticle,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      refreshInterval: 10 * 60 * 1000, // 10 minutes (longer for content)
      keepPreviousData: true,
      // Dedupe requests within 5 seconds
      dedupingInterval: 5000,
    }
  );

  return {
    article: data,
    isLoading: shouldFetch ? isLoading : false,
    error: shouldFetch ? error : null,
    mutate,
  };
}

// Hook for preloading article content (non-blocking)
export function useArticlePreload() {
  const preloadArticle = async (title: string) => {
    try {
      // Just fetch in the background to populate the cache
      await fetcherArticle(`/api/articles/title/${encodeURIComponent(title)}`);
    } catch (error) {
      // Silently fail for preloading
      console.warn('Failed to preload article:', error);
    }
  };

  return { preloadArticle };
}