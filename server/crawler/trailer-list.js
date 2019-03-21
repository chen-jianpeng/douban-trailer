const puppeteer = require('puppeteer')

const url = `https://movie.douban.com/cinema/nowplaying/hangzhou/`

const sleep = time =>
  new Promise(resolve => {
    setTimeout(resolve, time)
  })
;(async () => {
  const browser = await puppeteer.launch({
    args: ['--no-sandbox'],
    dumpio: false
  })
  const page = await browser.newPage()

  // 打开网页
  console.log('opening ' + url)
  await page.goto(url, {
    waitUntil: 'networkidle2'
  })

  // 获取更多
  await sleep(3000)
  await page.waitForSelector('.more')
  for (let i = 0; i < 0; i++) {
    console.log('geting more ' + i)
    await sleep(3000)
    await page.click('.more')
  }

  // 遍历dom， 获取数据
  const result = await page.evaluate(() => {
    const $ = window.$
    const items = Array.from($('#nowplaying').find('.list-item'))
    const links = []

    items.forEach(item => {
      const it = $(item)
      const doubanId = it[0].id
      const title = it.data('title')
      const rate = Number(it.data('score'))
      const poster = it.find('img').attr('src')
      const posterThumbnail = poster.replace('s_ratio', 'l_ratio')
      links.push({
        doubanId,
        title,
        rate,
        poster,
        posterThumbnail
      })
    })
    return links
  })

  await browser.close()

  process.send({
    result
  })
  process.exit(0)
})()