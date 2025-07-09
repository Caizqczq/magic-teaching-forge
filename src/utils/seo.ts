// SEO optimization utilities

interface SEOMetaData {
  title?: string;
  description?: string;
  keywords?: string;
  author?: string;
  image?: string;
  url?: string;
  type?: string;
  siteName?: string;
}

/**
 * Set meta tags for SEO
 */
export const setSEOMetaTags = (meta: SEOMetaData) => {
  const { title, description, keywords, author, image, url, type = 'website', siteName } = meta;
  
  // Title
  if (title) {
    document.title = title;
    setMetaTag('property', 'og:title', title);
    setMetaTag('name', 'twitter:title', title);
  }
  
  // Description
  if (description) {
    setMetaTag('name', 'description', description);
    setMetaTag('property', 'og:description', description);
    setMetaTag('name', 'twitter:description', description);
  }
  
  // Keywords
  if (keywords) {
    setMetaTag('name', 'keywords', keywords);
  }
  
  // Author
  if (author) {
    setMetaTag('name', 'author', author);
  }
  
  // Image
  if (image) {
    setMetaTag('property', 'og:image', image);
    setMetaTag('name', 'twitter:image', image);
  }
  
  // URL
  if (url) {
    setMetaTag('property', 'og:url', url);
    setMetaTag('name', 'twitter:url', url);
  }
  
  // Type
  setMetaTag('property', 'og:type', type);
  
  // Site name
  if (siteName) {
    setMetaTag('property', 'og:site_name', siteName);
  }
  
  // Twitter card type
  setMetaTag('name', 'twitter:card', 'summary_large_image');
};

/**
 * Helper function to set meta tags
 */
const setMetaTag = (attribute: string, name: string, content: string) => {
  let element = document.querySelector(`meta[${attribute}="${name}"]`) as HTMLMetaElement;
  
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, name);
    document.head.appendChild(element);
  }
  
  element.setAttribute('content', content);
};

/**
 * Generate structured data (JSON-LD)
 */
export const setStructuredData = (data: any) => {
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(data);
  
  // Remove existing structured data
  const existing = document.querySelector('script[type="application/ld+json"]');
  if (existing) {
    existing.remove();
  }
  
  document.head.appendChild(script);
};

/**
 * Set canonical URL
 */
export const setCanonicalURL = (url: string) => {
  let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
  
  if (!canonical) {
    canonical = document.createElement('link');
    canonical.rel = 'canonical';
    document.head.appendChild(canonical);
  }
  
  canonical.href = url;
};

/**
 * Add hreflang tags for internationalization
 */
export const setHreflangTags = (languages: { lang: string; url: string }[]) => {
  // Remove existing hreflang tags
  const existing = document.querySelectorAll('link[rel="alternate"][hreflang]');
  existing.forEach(tag => tag.remove());
  
  // Add new hreflang tags
  languages.forEach(({ lang, url }) => {
    const link = document.createElement('link');
    link.rel = 'alternate';
    link.hreflang = lang;
    link.href = url;
    document.head.appendChild(link);
  });
};

/**
 * Generate sitemap data
 */
export const generateSitemapData = (routes: Array<{
  path: string;
  lastModified?: Date;
  changeFreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}>) => {
  const baseUrl = window.location.origin;
  
  return routes.map(route => ({
    loc: `${baseUrl}${route.path}`,
    lastmod: route.lastModified?.toISOString().split('T')[0] || new Date().toISOString().split('T')[0],
    changefreq: route.changeFreq || 'weekly',
    priority: route.priority || 0.5,
  }));
};

/**
 * Page-specific SEO configurations
 */
export const pageSEOConfigs = {
  dashboard: {
    title: 'AI教学设计平台 - 智能教学资源生成',
    description: '使用AI技术快速生成专业的教学设计、课件、测试题等教学资源，提升教学效率和质量。',
    keywords: 'AI教学设计,智能教学,教学资源,课件生成,教案设计',
  },
  
  createWizard: {
    title: '创建教学设计 - AI教学设计平台',
    description: '通过简单的步骤，让AI为您生成个性化的教学设计方案，包括教案、PPT、配图等完整资源。',
    keywords: '创建教学设计,教学向导,AI生成,教学资源创建',
  },
  
  projectDetail: {
    title: '项目详情 - AI教学设计平台',
    description: '查看和管理您的教学设计项目，下载生成的教学资源，分享给教学团队。',
    keywords: '项目管理,教学资源下载,教学设计详情',
  },
  
  community: {
    title: '教学社区 - AI教学设计平台',
    description: '与其他教师交流教学经验，分享优秀的教学设计，共同提升教学水平。',
    keywords: '教学社区,教师交流,教学分享,教学经验',
  },
  
  knowledgeBase: {
    title: '知识库 - AI教学设计平台',
    description: '丰富的教学资源知识库，包含各学科的优质教学材料和参考资源。',
    keywords: '教学知识库,教学资源,学习材料,教学参考',
  },
  
  analytics: {
    title: '教学分析 - AI教学设计平台',
    description: '深入分析您的教学数据，了解学生学习情况，优化教学策略。',
    keywords: '教学分析,学习数据,教学效果,数据驱动教学',
  },
};

/**
 * Initialize SEO for a specific page
 */
export const initPageSEO = (page: keyof typeof pageSEOConfigs, customMeta?: Partial<SEOMetaData>) => {
  const config = pageSEOConfigs[page];
  const baseUrl = window.location.origin;
  const currentPath = window.location.pathname;
  
  setSEOMetaTags({
    ...config,
    url: `${baseUrl}${currentPath}`,
    siteName: 'AI教学设计平台',
    type: 'website',
    image: `${baseUrl}/og-image.png`, // 需要添加实际的 OG 图片
    ...customMeta,
  });
  
  setCanonicalURL(`${baseUrl}${currentPath}`);
  
  // 设置结构化数据
  setStructuredData({
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'AI教学设计平台',
    description: 'AI驱动的智能教学设计和资源生成平台',
    url: baseUrl,
    applicationCategory: 'EducationalApplication',
    operatingSystem: 'Web',
    author: {
      '@type': 'Organization',
      name: 'AI教学设计平台',
    },
  });
};