export type CompliancePageType = 'terms_of_service' | 'privacy_policy' | 'risk_disclosure' | 'aml_policy' | 'cookie_policy'

export interface ComplianceTemplate {
  id: string
  title: string
  pageType: CompliancePageType
  description: string
  content: string
}

interface TemplateVars {
  brandName: string
  domain: string
  jurisdiction: string
  niche: string
}

const COMPLIANCE_TEMPLATES: ComplianceTemplate[] = [
  {
    id: 'legal-tos-01',
    title: 'Terms of Service',
    pageType: 'terms_of_service',
    description: 'Terms and conditions for using {{brandName}} services.',
    content: `1. ACCEPTANCE OF TERMS\n\nBy accessing or using the services provided by {{brandName}} ("Company"), accessible at {{domain}}, you agree to be bound by these Terms of Service. If you do not agree, you must not use our services.\n\n2. SERVICES DESCRIPTION\n\n{{brandName}} provides online {{niche}} services including but not limited to: trading platform access, market data, educational resources, and account management tools. Services are provided "as is" and may be modified at any time.\n\n3. ACCOUNT REGISTRATION\n\nTo use our services, you must create an account and provide accurate, complete information. You are responsible for maintaining the confidentiality of your account credentials. You must be at least 18 years old to register. {{brandName}} reserves the right to refuse service or terminate accounts at its discretion.\n\n4. RISK DISCLOSURE\n\nTrading in financial instruments carries a high level of risk and may not be suitable for all investors. You should carefully consider your investment objectives, experience level, and risk appetite before using our services. Past performance is not indicative of future results.\n\n5. INTELLECTUAL PROPERTY\n\nAll content on {{domain}}, including text, graphics, logos, software, and data, is the property of {{brandName}} or its licensors and is protected by international copyright and trademark laws.\n\n6. LIMITATION OF LIABILITY\n\n{{brandName}} shall not be liable for any direct, indirect, incidental, special, or consequential damages resulting from the use or inability to use our services, including but not limited to trading losses, data loss, or service interruptions.\n\n7. GOVERNING LAW\n\nThese Terms shall be governed by and construed in accordance with the laws of {{jurisdiction}}. Any disputes shall be resolved through binding arbitration or in the courts of {{jurisdiction}}.\n\n8. CHANGES TO TERMS\n\n{{brandName}} reserves the right to modify these Terms at any time. Changes will be posted on {{domain}} and take effect immediately upon posting.`,
  },
  {
    id: 'legal-privacy-01',
    title: 'Privacy Policy',
    pageType: 'privacy_policy',
    description: 'How {{brandName}} collects, uses, and protects your personal data.',
    content: `1. INFORMATION WE COLLECT\n\n{{brandName}} collects information you provide directly: name, email address, phone number, government-issued identification, proof of address, and financial information. We also collect usage data automatically through cookies, IP addresses, browser type, device information, and interaction logs.\n\n2. HOW WE USE YOUR INFORMATION\n\nWe use your personal data to: provide and maintain our services, verify your identity (KYC/AML compliance), process transactions, send important service updates, improve our platform and user experience, comply with legal and regulatory obligations, and detect and prevent fraud.\n\n3. DATA SHARING\n\nWe may share your data with: regulatory authorities as required by law, payment processors, identity verification services, cloud hosting providers (data remains encrypted), and affiliated companies. We do NOT sell your personal data to third parties for marketing purposes.\n\n4. DATA SECURITY\n\n{{brandName}} implements industry-standard security measures including SSL/TLS encryption, two-factor authentication, encrypted data storage, regular security audits, and access controls.\n\n5. COOKIES & TRACKING\n\nWe use cookies and similar technologies for: session management, remembering your preferences, analytics and performance monitoring, and marketing attribution. You can control cookie settings through your browser.\n\n6. YOUR RIGHTS\n\nDepending on your jurisdiction, you may have the right to: access your personal data, correct inaccurate data, request deletion (right to be forgotten), restrict or object to processing, data portability, and withdraw consent. Contact us at privacy@{{domain}}.\n\n7. DATA RETENTION\n\nWe retain your data for as long as your account is active and for the period required by applicable regulations (typically 5-7 years for financial records).\n\n8. CONTACT\n\nFor privacy inquiries, contact our Data Protection Officer at privacy@{{domain}}.`,
  },
  {
    id: 'legal-risk-01',
    title: 'Risk Disclosure',
    pageType: 'risk_disclosure',
    description: 'Important risk warnings for {{brandName}} trading services.',
    content: `GENERAL RISK WARNING\n\nTrading in financial instruments including Forex, CFDs, cryptocurrencies, and other derivatives carries a high level of risk and may not be suitable for all investors. The high degree of leverage available can work against you as well as for you. Before deciding to trade, you should carefully consider your investment objectives, level of experience, and risk appetite.\n\nLEVERAGE RISK\n\nLeveraged trading means you can control large positions with relatively small deposits. While this magnifies potential profits, it equally magnifies potential losses. You could lose more than your initial deposit. {{brandName}} offers leverage up to the maximum permitted by applicable regulations.\n\nMARKET RISK\n\nFinancial markets are subject to rapid and unpredictable price movements caused by economic events, political developments, natural disasters, and market sentiment. Prices can gap significantly, and stop-loss orders may not execute at your specified price during periods of high volatility.\n\nTECHNOLOGY RISK\n\nOnline trading is subject to risks including internet connectivity failures, system downtime, software errors, and cyberattacks. {{brandName}} is not responsible for losses resulting from technology failures beyond our reasonable control.\n\nREGULATORY RISK\n\nFinancial regulations may change, potentially affecting your ability to trade certain instruments, the leverage available, or the protections you receive.\n\nPAST PERFORMANCE DISCLAIMER\n\nPast performance of any trading system, strategy, or individual trade is not indicative of future results.\n\nSEEK INDEPENDENT ADVICE\n\nYou should seek advice from an independent financial advisor if you are unsure whether {{niche}} services are appropriate for you. Do not trade with money you cannot afford to lose.`,
  },
  {
    id: 'legal-aml-01',
    title: 'AML Policy',
    pageType: 'aml_policy',
    description: '{{brandName}} Anti-Money Laundering and Know Your Customer policy.',
    content: `1. POLICY STATEMENT\n\n{{brandName}} is committed to the highest standards of Anti-Money Laundering (AML) and Counter-Terrorism Financing (CTF) compliance. This policy outlines our procedures for preventing the use of our services for money laundering or terrorist financing.\n\n2. CUSTOMER DUE DILIGENCE (KYC)\n\nAll clients must complete identity verification before accessing trading services. Required documents include: valid government-issued photo ID, proof of residential address (dated within 3 months), and source of funds documentation for deposits above applicable thresholds.\n\n3. ENHANCED DUE DILIGENCE\n\nEnhanced verification applies to: politically exposed persons (PEPs), clients from high-risk jurisdictions, high-value transactions, and accounts exhibiting unusual activity patterns.\n\n4. TRANSACTION MONITORING\n\n{{brandName}} employs automated transaction monitoring systems to detect suspicious activities including: unusual deposit/withdrawal patterns, structuring of transactions, rapid movement of funds without trading activity, and transactions involving high-risk jurisdictions.\n\n5. SUSPICIOUS ACTIVITY REPORTING\n\nWhere suspicious activity is identified, {{brandName}} will file Suspicious Activity Reports (SARs) with the relevant Financial Intelligence Unit (FIU). Clients will not be informed of such filings.\n\n6. RECORD KEEPING\n\nAll client identification records and transaction data are retained for a minimum of 5 years from the date of account closure.\n\n7. EMPLOYEE TRAINING\n\nAll {{brandName}} employees receive regular AML/CTF training covering: identifying suspicious activities, reporting procedures, regulatory updates, and their personal obligations.`,
  },
  {
    id: 'legal-cookie-01',
    title: 'Cookie Policy',
    pageType: 'cookie_policy',
    description: 'How {{brandName}} uses cookies and similar technologies.',
    content: `WHAT ARE COOKIES\n\nCookies are small text files placed on your device when you visit {{domain}}. They help us provide you with a better experience by remembering your preferences, maintaining your session, and analyzing how you use our platform.\n\nESSENTIAL COOKIES\n\nThese cookies are necessary for the website to function properly. They enable: user authentication and session management, security features, load balancing, and cookie consent preferences. These cannot be disabled.\n\nANALYTICS COOKIES\n\nWe use analytics cookies (such as Google Analytics) to understand how visitors interact with {{domain}}. These cookies collect aggregated and anonymized data about pages visited, navigation paths, and device information.\n\nFUNCTIONAL COOKIES\n\nThese cookies enable enhanced functionality including: language and currency preferences, chart settings, recently viewed instruments, and notification preferences.\n\nMARKETING COOKIES\n\nWith your consent, we use marketing cookies to: deliver relevant advertisements, measure campaign effectiveness, and track conversions. You can opt out of marketing cookies at any time.\n\nMANAGING COOKIES\n\nYou can manage your cookie preferences through our cookie consent banner, your browser settings, or opt-out links provided by third-party analytics providers.\n\nCONTACT\n\nFor questions about our cookie practices, contact us at privacy@{{domain}}.`,
  },
]

export function getComplianceTemplate(pageType: CompliancePageType): ComplianceTemplate | undefined {
  return COMPLIANCE_TEMPLATES.find((t) => t.pageType === pageType)
}

export function fillTemplate(template: ComplianceTemplate, vars: TemplateVars): ComplianceTemplate {
  const replace = (str: string) =>
    str
      .replace(/\{\{brandName\}\}/g, vars.brandName)
      .replace(/\{\{domain\}\}/g, vars.domain)
      .replace(/\{\{jurisdiction\}\}/g, vars.jurisdiction)
      .replace(/\{\{niche\}\}/g, vars.niche)

  return {
    ...template,
    title: replace(template.title),
    description: replace(template.description),
    content: replace(template.content),
  }
}

export const COMPLIANCE_PAGE_TYPES: { id: CompliancePageType; label: string; icon: string }[] = [
  { id: 'terms_of_service', label: 'Terms of Service', icon: '📋' },
  { id: 'privacy_policy', label: 'Privacy Policy', icon: '🔒' },
  { id: 'risk_disclosure', label: 'Risk Disclosure', icon: '⚠️' },
  { id: 'aml_policy', label: 'AML Policy', icon: '🛡️' },
  { id: 'cookie_policy', label: 'Cookie Policy', icon: '🍪' },
]
