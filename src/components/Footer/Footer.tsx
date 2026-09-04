import { Link } from 'react-router-dom';
import styles from './Footer.module.css';

const footerGroups = [
  {
    title: 'Discover',
    links: ['Hotels', 'Lodges', 'Cabins', 'Villas', 'Glamping'],
  },
  {
    title: 'Company',
    links: ['About us', 'Careers', 'Press', 'Blog'],
  },
  {
    title: 'Support',
    links: ['Help centre', 'Cancellation policy', 'Safety', 'Contact'],
  },
];

function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.content}>
        <div className={styles.brandColumn}>
          <Link className={styles.brand} to="/" aria-label="Holidaze home">
            <img src="/images/logos/Logo-header+footerL-white.svg" alt="" />
            <strong>Holidaze</strong>
          </Link>
          <p>Curated stays for curious travellers.</p>
        </div>

        <div className={styles.linkGroups}>
          {footerGroups.map((group) => (
            <div className={styles.linkGroup} key={group.title}>
              <h2>{group.title}</h2>
              {group.links.map((link) => (
                <Link to="/search" key={link}>
                  {link}
                </Link>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className={styles.bottomBar}>
        <span>© 2026 Holidaze. All rights reserved.</span>
        <div>
          <Link to="/">Privacy</Link>
          <Link to="/">Terms</Link>
          <Link to="/">Cookies</Link>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
