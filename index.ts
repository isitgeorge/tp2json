/* eslint no-await-in-loop: 0 */
import puppeteer, { type Page, type ElementHandle } from 'puppeteer'
import { type Config } from './types/config.js'
import { type Review } from './types/review.js'

const isDevelopment = false

export default async function tp2json(config?: Config): Promise<Review[]> {
  config ||= {
    country: 'uk',
    profile: 'trustpilot.com',
    limit: 100,
  }
  const browser = await puppeteer.launch({
    headless: !isDevelopment,
    devtools: isDevelopment,
  })
  const page = await browser.newPage()
  const buildUrl = `https://${config.country}.trustpilot.com/review/${config.profile}`
  const ua = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36'
  await page.setUserAgent(ua)
  await page.goto(buildUrl)

  try {
    await page.waitForSelector('[id="onetrust-accept-btn-handler"]', { timeout: 5000 })
    await page.click('[id="onetrust-accept-btn-handler"]')
  } catch { }

  let remaining: number = config.limit
  const reviews: Review[] = []

  while ((remaining > 1)) {
    const parsedReviews = await parseReviews(page, remaining, config)
    remaining -= parsedReviews.length
    reviews.push(...parsedReviews)

    if (!await nextPageExists(page)) {
      break
    }

    await navigateToNext(page)
  }

  await browser.close()
  return reviews
}

async function getValue(selector: string, source: ElementHandle, attribute?: string): Promise<string> {
  let element
  try {
    element = await source.waitForSelector(selector, { timeout: 1000 })
  } catch {
    return ''
  }

  if (element) {
    const value = await element.evaluate((element_, attribute) => {
      if (attribute) {
        return element_.getAttribute(attribute)
      }

      return element_.textContent
    }, attribute)
    return value ?? ''
  }

  return ''
}

function format(string: string) {
  return string.trim()
}

async function nextPageExists(page: Page): Promise<boolean> {
  const ariaArray = await page.$$eval('[data-pagination-button-next-link]', element => element.map(x => x.getAttribute('aria-disabled')))
  return ariaArray.includes(null)
}

async function parseReviews(page: Page, remaining: number, config: Config): Promise<Review[]> {
  const reviewWrapper = await page.$$('[class^="styles_cardWrapper__"]')
  const reviews: Review[] = []

  for (const [i, reviewElement] of reviewWrapper.entries()) {
    if ((remaining - i) < 1) {
      break
    }

    const author = await getValue('[data-consumer-name-typography]', reviewElement)
    const title = await getValue('[data-service-review-title-typography]', reviewElement)
    const summary = await getValue('[data-service-review-text-typography]', reviewElement)
    const date = await getValue('[data-service-review-date-of-experience-typography]', reviewElement)
    const rating = await getValue('[data-service-review-rating]', reviewElement, 'data-service-review-rating')
    const url = await getValue('[data-review-title-typography]', reviewElement, 'href')
    const location = await getValue('[data-consumer-country-typography]', reviewElement)

    const review: Review = {
      author: format(author),
      date: Date.parse(date),
      summary: format(summary),
      title: format(title),
      rating: Number.parseInt(rating, 10),
      url: `https://${config.country}.trustpilot.com${url}`,
      location: format(location),
    }
    reviews.push(review)
  }

  return reviews
}

async function navigateToNext(page: Page): Promise<void> {
  await page.$eval('[data-pagination-button-next-link]', elem => (elem as HTMLElement).click());
  await Promise.all([
    page.waitForNavigation(),
    page.$eval('[data-pagination-button-next-link]', elem => (elem as HTMLElement).click()),
  ])
}
