import React, { useEffect, useState } from 'react';
import './tm29-visual-contact.css';

type ContactConfig = { publicEmail: string; recipientEmail: string; phone: string; whatsappPhone: string; address: string; openingHours: string; facebook: string; whatsapp: string; youtube: string; linkedin: string; instagram: string; tiktok: string; website: string };
const KEY = 'tm29_contact_settings_v1';
const empty: ContactConfig = { publicEmail: '', recipientEmail: '', phone: '', whatsappPhone: '', address: '', openingHours: '', facebook: '', whatsapp: '', youtube: '', linkedin: '', instagram: '', tiktok: '', website: '' };
const networks: Array<{ key: keyof ContactConfig; label: string; icon: string }> = [
  { key: 'facebook', label: 'Facebook', icon: 'f' }, { key: 'whatsapp', label: 'WhatsApp', icon: 'â—‰' }, { key: 'youtube', label: 'YouTube', icon: 'â–¶' }, { key: 'linkedin', label: 'LinkedIn', icon: 'in' }, { key: 'instagram', label: 'Instagram', icon: 'â—Ž' }, { key: 'tiktok', label: 'TikTok', icon: 'â™ª' }, { key: 'website', label: 'Site web', icon: 'â†—' },
];
function readConfig(): ContactConfig { try { const raw = localStorage.getItem(KEY); return raw ? { ...empty, ...JSON.parse(raw) } : empty; } catch { return empty; } }
function safeUrl(raw: string): string { const value = raw.trim(); if (/^https?:\/\//i.test(value)) return value; if (/^[\w.-]+\.[a-z]{2,}(\/.*)?$/i.test(value)) return `https://${value}`; return ''; }
export default function Tm29ContactSection() {
  const [config, setConfig] = useState<ContactConfig>(empty); const [subject, setSubject] = useState('Demande de contact â€” Tantsaha Miombona'); const [message, setMessage] = useState('');
  useEffect(() => { setConfig(readConfig()); const refresh = () => setConfig(readConfig()); window.addEventListener('storage', refresh); window.addEventListener('tm29-contact-updated', refresh); return () => { window.removeEventListener('storage', refresh); window.removeEventListener('tm29-contact-updated', refresh); }; }, []);
  const recipient = config.recipientEmail.trim() || config.publicEmail.trim();
  const socials = networks.map((item) => ({ ...item, href: safeUrl(String(config[item.key] || '')) })).filter((item) => item.href);
  const send = (event: React.FormEvent<HTMLFormElement>) => { event.preventDefault(); if (!recipient) return; window.location.href = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`; };
  return (
    <section className="tm29-contact" id="contact" aria-labelledby="tm29-contact-title">
      <div className="tm29-shell">
        <div className="tm29-contact-heading"><span className="tm29-eyebrow">CONTACT</span><h2 id="tm29-contact-title">Restons en contact</h2><p>Une question, une suggestion ou un projet de partenariat ? Ã‰changeons pour mieux valoriser les produits agricoles de Madagascar.</p></div>
        <div className="tm29-contact-grid">
          <div className="tm29-contact-info">
            <div className="tm29-contact-info__mark" aria-hidden="true">âœ‰</div><h3>Parlons de votre projet</h3><p>Producteur, point focal, transformateur, distributeur ou partenaire : votre message est le bienvenu.</p>
            {config.publicEmail && <a href={`mailto:${config.publicEmail}`}><strong>E-mail</strong><span>{config.publicEmail}</span></a>}
            {config.phone && <a href={`tel:${config.phone.replace(/[^+\d]/g, '')}`}><strong>TÃ©lÃ©phone</strong><span>{config.phone}</span></a>}
            {config.whatsappPhone && <a href={`https://wa.me/${config.whatsappPhone.replace(/\D/g, '')}`} target="_blank" rel="noreferrer"><strong>WhatsApp</strong><span>{config.whatsappPhone}</span></a>}
            {config.address && <div className="tm29-contact-detail"><strong>Adresse</strong><span>{config.address}</span></div>}
            {config.openingHours && <div className="tm29-contact-detail"><strong>DisponibilitÃ©</strong><span>{config.openingHours}</span></div>}
            {!config.publicEmail && !config.phone && !config.address && <p className="tm29-contact-empty">Les coordonnÃ©es seront affichÃ©es dÃ¨s quâ€™elles auront Ã©tÃ© renseignÃ©es dans les paramÃ¨tres du tableau de bord.</p>}
          </div>
          <form className="tm29-contact-form" onSubmit={send}><h3>Envoyer un message</h3><label>Objet<input value={subject} onChange={(e) => setSubject(e.target.value)} required /></label><label>Votre message<textarea rows={5} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="DÃ©crivez votre demandeâ€¦" required /></label><button type="submit" disabled={!recipient}>Envoyer par e-mail <span aria-hidden="true">â†’</span></button>{!recipient && <small>Configurez lâ€™e-mail destinataire dans le tableau de bord pour activer lâ€™envoi.</small>}</form>
        </div>
        {socials.length > 0 && <div className="tm29-socials"><h3>Retrouvez-nous sur les rÃ©seaux</h3><div>{socials.map((item) => <a key={item.key} href={item.href} target="_blank" rel="noreferrer"><span aria-hidden="true">{item.icon}</span>{item.label}</a>)}</div></div>}
      </div>
    </section>
  );
}
