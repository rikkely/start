import { ref } from 'vue'
import config from '../config.js'

const t = config.theme || {}

// 与主页完全一致的三套 HUD 配色。localStorage key 也相同（'hud-theme'），
// 同域名下主页改了配色，进博客会自动沿用。
export const PALETTES = {
  cyan: {
    label: 'CYAN',
    a: t.accentA || '#67e8f9',
    b: t.accentB || '#a78bfa',
    c: t.accentC || '#f472b6'
  },
  red: { label: 'RED', a: '#ff5d6c', b: '#ff8e53', c: '#ffd166' },
  green: { label: 'GREEN', a: '#34d399', b: '#a3e635', c: '#22d3ee' }
}

const KEY = 'hud-theme'
const active = ref('cyan')

function apply(name) {
  const p = PALETTES[name] || PALETTES.cyan
  const s = document.documentElement.style
  s.setProperty('--accent-a', p.a)
  s.setProperty('--accent-b', p.b)
  s.setProperty('--accent-c', p.c)
  active.value = name
  try {
    localStorage.setItem(KEY, name)
  } catch (e) {
    /* ignore */
  }
}

export function useTheme() {
  const init = () => {
    let saved = null
    try {
      saved = localStorage.getItem(KEY)
    } catch (e) {
      /* ignore */
    }
    apply(saved && PALETTES[saved] ? saved : 'cyan')
  }
  return { active, palettes: PALETTES, setTheme: apply, initTheme: init }
}
