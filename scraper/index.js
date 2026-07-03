#!/usr/bin/env node
/**
 * Udyam Registration Scraper (Cheerio + Axios)
 *
 * This scraper attempts to fetch the Udyam registration page and extract
 * labels, input ids, placeholders, button names and input types for the
 * first two steps of registration using Cheerio (no headless browser).
 *
 * Notes / fallback behavior:
 * - The live Udyam site may return 404, redirect, or render forms via JS,
 *   which Cheerio cannot execute. In such cases the scraper will still
 *   produce a useful fallback `schema.json` that models the first two
 *   steps' fields (Aadhaar, Entrepreneur Name, OTP flow, PAN, etc.) so the
 *   frontend can be developed against a stable schema.
 * - We intentionally avoid Puppeteer and keep Cheerio as requested.
 */

const fs = require('fs')
const path = require('path')
const axios = require('axios')
const cheerio = require('cheerio')
const { URL } = require('url')

const UDYAM_URL = process.env.UDYAM_URL || 'https://udyamregistration.gov.in/Udyam_Registration'
const OUT_FILE = path.resolve(__dirname, 'schema.json')

// A deterministic fallback schema covering the requested fields. This will
// be used when the live site cannot be scraped programmatically.
const fallbackSchema = {
  step1: {
    labels: [
      { text: 'Aadhaar Number', htmlFor: 'aadhaar' },
      { text: 'Entrepreneur Name', htmlFor: 'entrepreneurName' }
    ],
    inputs: [
      { tag: 'input', id: 'aadhaar', name: 'aadhaar', placeholder: 'Enter Aadhaar Number', type: 'text' },
      { tag: 'input', id: 'entrepreneurName', name: 'entrepreneurName', placeholder: 'Enter Name as on Aadhaar', type: 'text' }
    ],
    buttons: [
      { tag: 'button', text: 'Validate & Generate OTP', id: 'validateAadhaar', name: 'validateAadhaar', type: 'button' }
    ]
  },
  step2: {
    labels: [
      { text: 'OTP', htmlFor: 'otp' },
      { text: 'PAN Number', htmlFor: 'pan' },
      { text: 'PAN Type', htmlFor: 'panType' },
      { text: 'Declaration', htmlFor: 'declaration' }
    ],
    inputs: [
      { tag: 'input', id: 'otp', name: 'otp', placeholder: 'Enter OTP', type: 'text' },
      { tag: 'input', id: 'pan', name: 'pan', placeholder: 'Enter PAN Number', type: 'text' },
      { tag: 'select', id: 'panType', name: 'panType', placeholder: null, type: 'select' },
      { tag: 'input', id: 'declaration', name: 'declaration', placeholder: null, type: 'checkbox' }
    ],
    buttons: [
      { tag: 'button', text: 'Validate PAN', id: 'validatePan', name: 'validatePan', type: 'button' }
    ]
  }
}

function extract($) {
  const text = (el) => $(el).text().trim()
  const labels = []
  $('label').each((_, l) => labels.push({ text: text(l), htmlFor: $(l).attr('for') || null }))

  const inputs = []
  $('input, select, textarea').each((_, i) => {
    const tag = i.tagName.toLowerCase()
    inputs.push({ tag, id: $(i).attr('id') || null, name: $(i).attr('name') || null, placeholder: $(i).attr('placeholder') || null, type: $(i).attr('type') || null })
  })

  const buttons = []
  $('button, input[type="button"], input[type="submit"]').each((_, b) => {
    const tag = b.tagName.toLowerCase()
    buttons.push({ tag, text: text(b), id: $(b).attr('id') || null, name: $(b).attr('name') || null, type: $(b).attr('type') || null })
  })

  return { labels, inputs, buttons }
}

async function fetchUrl(url) {
  const res = await axios.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (compatible)' }, maxRedirects: 5 })
  return res.data
}

function ensureRequiredFields(result) {
  // Ensure the fallback fields exist in the result; if not, merge them.
  const requiredKeys = ['step1', 'step2']
  for (const key of requiredKeys) {
    if (!result[key] || !result[key].inputs) {
      result[key] = fallbackSchema[key]
      console.warn(`Using fallback for ${key}`)
      continue
    }
    // Ensure each required field from fallback exists (by id)
    const ids = new Set(result[key].inputs.map(i => i.id).filter(Boolean))
    for (const inp of fallbackSchema[key].inputs) {
      if (inp.id && !ids.has(inp.id)) result[key].inputs.push(inp)
    }
    const btnIds = new Set(result[key].buttons.map(b => b.id).filter(Boolean))
    for (const btn of fallbackSchema[key].buttons) {
      if (btn.id && !btnIds.has(btn.id)) result[key].buttons.push(btn)
    }
    const lblTexts = new Set(result[key].labels.map(l => l.text).filter(Boolean))
    for (const lbl of fallbackSchema[key].labels) {
      if (lbl.text && !lblTexts.has(lbl.text)) result[key].labels.push(lbl)
    }
  }
}

;(async () => {
  let result = { step1: { labels: [], inputs: [], buttons: [] }, step2: { labels: [], inputs: [], buttons: [] } }
  try {
    console.log('Fetching', UDYAM_URL)
    let html1
    try {
      html1 = await fetchUrl(UDYAM_URL)
    } catch (err) {
      console.warn('Primary URL failed, attempting site root to discover registration link')
      try {
        const root = new URL(UDYAM_URL).origin
        const rootHtml = await fetchUrl(root)
        const $root = cheerio.load(rootHtml)
        // try to find a link that mentions registration
        let found = null
        $root('a').each((_, a) => {
          const href = $root(a).attr('href') || ''
          const txt = ($root(a).text() || '').toLowerCase()
          if (/register|registration|udyam/i.test(href) || /register|registration|udyam/i.test(txt)) {
            found = href
            return false
          }
        })
        if (found) {
          const resolved = new URL(found, root).toString()
          console.log('Discovered registration link:', resolved)
          html1 = await fetchUrl(resolved)
        } else {
          throw err
        }
      } catch (innerErr) {
        console.error('Failed to discover registration page from root:', innerErr && innerErr.message)
        // fall through to produce fallback schema
      }
    }

    if (html1) {
      try {
        const $1 = cheerio.load(html1)
        result.step1 = extract($1)

        // Try to find a link or form action that looks like "next"
        const nextKeywords = ['next', 'proceed', 'continue', 'save & continue', 'save & proceed', 'submit', 'register', 'validate', 'generate otp', 'generate otp']

        let step2Url = null
        $1('a').each((_, a) => {
          const txt = ($1(a).text() || '').toLowerCase()
          const href = $1(a).attr('href')
          if (href && nextKeywords.some(k => txt.includes(k)) && !step2Url) step2Url = href
        })

        if (!step2Url) {
          $1('form').each((_, f) => {
            const method = ($1(f).attr('method') || 'get').toLowerCase()
            const action = $1(f).attr('action')
            if (action && method === 'get' && !step2Url) {
              const btnText = ($1(f).find('button').text() || '').toLowerCase()
              if (nextKeywords.some(k => btnText.includes(k))) step2Url = action
            }
          })
        }

        if (step2Url) {
          try {
            const base = new URL(UDYAM_URL)
            const resolved = new URL(step2Url, base).toString()
            console.log('Fetching step2 from', resolved)
            const html2 = await fetchUrl(resolved)
            const $2 = cheerio.load(html2)
            result.step2 = extract($2)
          } catch (err) {
            console.warn('Failed to fetch step2:', err && err.message)
          }
        }
      } catch (err) {
        console.error('HTML parse/extract error:', err && err.message)
      }
    }
  } catch (err) {
    console.error('Scraper error:', err && err.message)
  } finally {
    // Ensure the required fields exist in the final schema; merge fallback if necessary.
    ensureRequiredFields(result)

    try {
      fs.writeFileSync(OUT_FILE, JSON.stringify(result, null, 2))
      console.log('Saved schema to', OUT_FILE)
    } catch (writeErr) {
      console.error('Failed to write schema.json:', writeErr && writeErr.message)
      process.exit(1)
    }
  }
})()
