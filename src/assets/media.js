/**
 * 自动收集 src/assets/images/bg/ 下的图片作为背景轮播源。
 * 想增减背景，直接往该目录丢 / 删文件即可，无需改代码。
 */
const bgGlob = import.meta.glob('./images/bg/*.{webp,avif,jpg,jpeg,png}', {
  eager: true,
  query: '?url',
  import: 'default'
})

function naturalSort(a, b) {
  return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' })
}

export const bundledBackgrounds = Object.keys(bgGlob)
  .sort(naturalSort)
  .map((k) => bgGlob[k])
