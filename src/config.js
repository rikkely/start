/**
 * AURORA // LAUNCH BAY —— 起始页前端配置（独立可部署，挂载于 /start/）
 * 这是个纯静态仪表盘：搜索 + 快捷入口，全部在本文件里配置，无需后端。
 */
import avatar from './assets/images/avatar.png'

export default {
  site: {
    name: 'rikkely',
    suffix: '.top',
    avatar,
    author: 'rikkely',
    homeUrl: '/'
  },

  boot: { label: 'OPENING LAUNCH BAY', sub: 'FLIGHT DECK' },

  bay: {
    titleZh: '启航舱',
    titleEn: 'LAUNCH BAY',
    callsign: '指挥官' // 问候里的称呼
  },

  // 搜索引擎（提交时跳转，{q} 会被替换为关键词）
  engines: [
    { key: 'google', name: 'GOOGLE', url: 'https://www.google.com/search?q={q}' },
    { key: 'bing', name: 'BING', url: 'https://www.bing.com/search?q={q}' },
    { key: 'ddg', name: 'DUCKDUCKGO', url: 'https://duckduckgo.com/?q={q}' },
    { key: 'baidu', name: '百度', url: 'https://www.baidu.com/s?wd={q}' }
  ],

  // 快捷入口（同域名子站 + 外链）。icon 取 IconBase 里的描边图标名。
  tiles: [
    { name: '主控台', desc: 'HOME', icon: 'home', url: '/' },
    { name: '博客', desc: 'ARCHIVE', icon: 'book', url: '/blog/' },
    { name: '数据仓库', desc: 'VAULT', icon: 'folder', url: '/pan/' },
    { name: '声波甲板', desc: 'AUDIO', icon: 'music', url: '/music/' },
    { name: '导航目录', desc: 'CATALOG', icon: 'compass', url: '/nav/' },
    { name: '实验室', desc: 'LAB', icon: 'flask', url: '/lab/' },
    { name: 'GitHub', desc: 'CODE', icon: 'terminal', url: 'https://github.com/' },
    { name: '邮箱', desc: 'MAIL', icon: 'mail', url: 'mailto:hi@example.com' }
  ],

  background: { interval: 16000, images: [] },
  footer: { startYear: 2023, author: 'rikkely', icp: '', icpLink: 'https://beian.miit.gov.cn/' },

  theme: { accentA: '#67e8f9', accentB: '#a78bfa', accentC: '#f472b6' }
}
