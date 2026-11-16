// Sends the contact form to Formspree, the form service that forwards messages to my inbox.
// The form ID in this address is public, not a secret.
export const FORM_ENDPOINT = 'https://formspree.io/f/mrgjpdkn'

const MIN_FILL_MS = 3000

// True only when Formspree accepts the message (a 2xx response). `msOnPage` is how long the
// page had been open when the form was submitted.
export async function sendMessage(
  form: FormData,
  msOnPage: number,
  post: typeof fetch = fetch,
): Promise<boolean> {
  // Bots fill the hidden field or submit straight away. People do neither.
  if (form.get('_gotcha') || msOnPage < MIN_FILL_MS) return false
  try {
    const response = await post(FORM_ENDPOINT, {
      method: 'POST',
      body: form,
      headers: { Accept: 'application/json' },
    })
    return response.ok
  } catch {
    return false
  }
}
