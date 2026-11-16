import { useState, type FormEvent } from 'react'
import { sendMessage } from '../../lib/contact.ts'
import Section from '../Section/Section.tsx'
import styles from './Contact.module.css'

type Status = 'idle' | 'sending' | 'sent' | 'failed'

export default function Contact() {
  const [status, setStatus] = useState<Status>('idle')

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    // Read the fields before the first await: React clears the event afterwards.
    const form = new FormData(event.currentTarget)
    setStatus('sending')
    // event.timeStamp is the time since the page opened, in milliseconds.
    setStatus((await sendMessage(form, event.timeStamp)) ? 'sent' : 'failed')
  }

  return (
    <Section id="contact" title="Get in touch">
      {status === 'sent' ? (
        <p role="status" className={styles.sent}>
          Thanks, your message is sent. I&apos;ll reply by email.
        </p>
      ) : (
        <form className={styles.form} onSubmit={(event) => void onSubmit(event)}>
          <label className={styles.field}>
            Name
            <input type="text" name="name" autoComplete="name" required maxLength={100} />
          </label>
          <label className={styles.field}>
            Email
            <input type="email" name="email" autoComplete="email" required maxLength={200} />
          </label>
          <label className={styles.field}>
            Message
            <textarea name="message" rows={6} required maxLength={2000} />
          </label>
          {/* A trap for spam bots: hidden from people, so only a bot fills it in. */}
          <input type="text" name="_gotcha" className={styles.trap} tabIndex={-1} autoComplete="off" />

          <button type="submit" className={styles.send} disabled={status === 'sending'}>
            {status === 'sending' ? 'Sending…' : 'Send message'}
          </button>

          {status === 'failed' && (
            <p role="alert" className={styles.failed}>
              Sorry, that didn&apos;t send. Please try again in a moment, or reach me through{' '}
              <a href="https://github.com/ocadge" rel="noopener noreferrer">
                GitHub
              </a>
              .
            </p>
          )}
          <p className={styles.note}>
            Your message goes to my inbox through Formspree, a form service. I only use your name and email to
            reply.
          </p>
        </form>
      )}
    </Section>
  )
}
