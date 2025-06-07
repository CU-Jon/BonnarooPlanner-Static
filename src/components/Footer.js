import React from 'react';
import {
  EMAIL_USER,
  EMAIL_DOMAIN,
  EMAIL_SUBJECT,
  EMAIL_LINK_TEXT,
  FOOTER_HTML
} from '../config';

export default function Footer() {
  const subject = encodeURIComponent(EMAIL_SUBJECT);
  const emailLink = EMAIL_USER && EMAIL_DOMAIN
    ? `<a href="mailto:${EMAIL_USER}&#64;${EMAIL_DOMAIN.replace(/\./g, '&#46;')}?subject=${subject}" target="_blank" rel="noopener noreferrer">${EMAIL_LINK_TEXT}</a>`
    : '';

  // Only replace if the token exists
  const html = FOOTER_HTML.includes('{{EMAIL_LINK}}')
    ? FOOTER_HTML.replace('{{EMAIL_LINK}}', emailLink)
    : FOOTER_HTML;

  return (
    <footer
      className="app-footer"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}