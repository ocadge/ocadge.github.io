import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <span>© {new Date().getFullYear()} Ben Wilkinson</span>
        <span>Built with React, TypeScript and Vite</span>
      </div>
    </footer>
  )
}
