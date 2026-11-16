import { describe, expect, it, vi } from 'vitest'
import { FORM_ENDPOINT, sendMessage } from './contact.ts'

function form(fields: Record<string, string> = {}) {
  const data = new FormData()
  data.set('name', 'A Visitor')
  data.set('email', 'visitor@example.com')
  data.set('message', 'Hello')
  for (const [key, value] of Object.entries(fields)) data.set(key, value)
  return data
}

const reply = (status: number) => vi.fn<typeof fetch>(() => Promise.resolve(new Response('{}', { status })))

describe('sendMessage', () => {
  it('posts the form to Formspree and reports success on a 2xx response', async () => {
    const post = reply(200)
    expect(await sendMessage(form(), 5000, post)).toBe(true)
    expect(post).toHaveBeenCalledOnce()
    expect(post.mock.calls[0]?.[0]).toBe(FORM_ENDPOINT)
    expect(post.mock.calls[0]?.[1]).toMatchObject({ method: 'POST', headers: { Accept: 'application/json' } })
  })

  it('reports failure when Formspree rejects the message', async () => {
    expect(await sendMessage(form(), 5000, reply(422))).toBe(false)
    expect(await sendMessage(form(), 5000, reply(500))).toBe(false)
  })

  it('reports failure when the network request fails', async () => {
    const post = vi.fn<typeof fetch>(() => Promise.reject(new TypeError('offline')))
    expect(await sendMessage(form(), 5000, post)).toBe(false)
  })

  it('sends nothing when the hidden field is filled in or the form is submitted too fast', async () => {
    const post = reply(200)
    expect(await sendMessage(form({ _gotcha: 'spam' }), 5000, post)).toBe(false)
    expect(await sendMessage(form(), 500, post)).toBe(false)
    expect(post).not.toHaveBeenCalled()
  })
})
