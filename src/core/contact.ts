const sanitizePhone = (phone?: string | null) => {
  if (!phone) return null;

  const trimmed = phone.trim();
  if (!trimmed) return null;

  const tel = trimmed.replace(/[^+\d]/g, '');

  if (!tel) return null;

  return {
    formatted: trimmed,
    href: `tel:${tel}`,
  } as const;
};

const fallbackEmail = 'info@lomanpsychologie.nl';

const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL || fallbackEmail;
const contactPhone = sanitizePhone(process.env.NEXT_PUBLIC_CONTACT_PHONE || undefined);

export const CONTACT_DETAILS = {
  email: {
    address: contactEmail,
    href: `mailto:${contactEmail}`,
  },
  phone: contactPhone,
};

