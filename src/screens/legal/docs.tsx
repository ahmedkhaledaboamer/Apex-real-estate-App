import { CONTACT_EMAIL, CONTACT_PHONE, OFFICE_ADDRESS } from '@/lib/constants'
import { CookieCards, CookiePreferences } from './CookiePreferences'
import { A, B, H3, P, UL } from './prose'

/* Same template text and section structure as website/src/routes/legal/*.tsx. */

export type LegalSection = { id: string; title: string; content: React.ReactNode }
export type LegalDoc = { title: string; intro: React.ReactNode; sections: LegalSection[] }
export type DocKey = 'privacy' | 'terms' | 'cookies'

export const LEGAL_UPDATED = '24 Nov 2026'

export const LEGAL_LINKS: { key: DocKey; label: string }[] = [
  { key: 'privacy', label: 'Privacy policy' },
  { key: 'terms', label: 'Terms of use' },
  { key: 'cookies', label: 'Cookie policy' },
]

const mail = `mailto:${CONTACT_EMAIL}`

const PRIVACY: LegalDoc = {
  title: 'Privacy policy',
  intro: (
    <P first>
      Your privacy matters to us. This policy explains what personal data Apex Aora collects when you use our website or services, why we collect it, how we protect it and
      the choices you have.
    </P>
  ),
  sections: [
    {
      id: 'who-we-are',
      title: 'Who we are',
      content: (
        <>
          <P first>
            This website is operated by <B>Apex Aora Real Estate LLC</B> (“Apex Aora”, “we”, “us”), a real estate brokerage licensed in the Emirate of Dubai under Trade
            Licence No. [Trade Licence No.] and registered with the Real Estate Regulatory Agency (RERA) under Office Registration Number (ORN) [RERA ORN].
          </P>
          <P>
            Our registered office is {OFFICE_ADDRESS}. For the purposes of the UAE Personal Data Protection Law, Federal Decree-Law No. 45 of 2021 (“PDPL”), Apex Aora is
            the controller of the personal data described in this policy.
          </P>
        </>
      ),
    },
    {
      id: 'data-we-collect',
      title: 'Personal data we collect',
      content: (
        <>
          <P first>We collect only the information we need to help you buy, sell, rent or invest in property:</P>
          <H3>Information you give us</H3>
          <UL
            items={[
              'Contact details: name, phone / WhatsApp number, email address.',
              'Enquiry details: the properties, communities, budgets and timelines you tell us about, and any messages you send.',
              'Property details for valuations: address, building, size, condition and occupancy status.',
              'Know-your-customer (KYC) documents when a transaction proceeds: passport, Emirates ID, visa, proof of address and, where required, source-of-funds information.',
            ]}
          />
          <H3>Information collected automatically</H3>
          <UL
            items={[
              'Device and usage data: IP address, browser type, pages viewed and referring site.',
              <>
                Preferences stored on your device, such as currency, language and saved properties. See our <A to="/legal/cookies">cookie policy</A>.
              </>,
            ]}
          />
          <H3>Information from third parties</H3>
          <UL
            items={[
              'Property portals and partner agencies that pass on your enquiry.',
              'Public registers such as Dubai Land Department (DLD) title and transaction data, used to verify ownership and prepare valuations.',
            ]}
          />
        </>
      ),
    },
    {
      id: 'how-we-use',
      title: 'How we use your data',
      content: (
        <UL
          items={[
            'To respond to enquiries, arrange viewings and send property recommendations you asked for.',
            'To prepare valuations and market appraisals.',
            'To perform our brokerage agreements (RERA Form A, Form B, Form F / MOU) and to facilitate transfers at a Real Estate Registration Trustee office.',
            'To meet our legal obligations, including anti-money laundering checks under Federal Decree-Law No. 20 of 2018 and related regulations.',
            'To send market updates and newsletters, only where you have agreed or where permitted by law; you can opt out at any time.',
            'To keep our website secure and improve how it works.',
          ]}
        />
      ),
    },
    {
      id: 'legal-basis',
      title: 'Legal basis for processing',
      content: (
        <>
          <P first>Under the PDPL we process personal data on one or more of the following grounds:</P>
          <UL
            items={[
              <>
                <B>Consent</B> — for example, marketing messages and non-essential cookies.
              </>,
              <>
                <B>Contract</B> — to take steps at your request before entering into, or to perform, a brokerage agreement.
              </>,
              <>
                <B>Legal obligation</B> — KYC, AML and record-keeping duties set by UAE law, RERA and the DLD.
              </>,
              <>
                <B>Legitimate interests</B> — running and protecting our business, where those interests are not overridden by your rights.
              </>,
            ]}
          />
        </>
      ),
    },
    {
      id: 'sharing',
      title: 'Who we share data with',
      content: (
        <>
          <P first>We never sell your personal data. We share it only where necessary with:</P>
          <UL
            items={[
              'The other party to a transaction, their agent and conveyancer, to the extent needed to complete the deal.',
              'Developers, for off-plan reservations and No Objection Certificates (NOCs).',
              'Government authorities, including the DLD, RERA and Real Estate Registration Trustee offices.',
              'Mortgage brokers and banks, only when you ask us to introduce you.',
              'Service providers who host our website, CRM and communications, under written data-processing terms.',
              'Law enforcement or regulators where required by law.',
            ]}
          />
        </>
      ),
    },
    {
      id: 'transfers',
      title: 'International transfers',
      content: (
        <P first>
          Some of our service providers may store data outside the UAE. Where this happens we transfer data only to jurisdictions with adequate protection, or under
          safeguards permitted by Articles 22 and 23 of the PDPL and any implementing regulations, such as contractual clauses.
        </P>
      ),
    },
    {
      id: 'retention',
      title: 'How long we keep data',
      content: (
        <>
          <P first>We keep personal data only as long as needed for the purposes above:</P>
          <UL
            items={[
              'Enquiries that do not lead to a transaction: up to 24 months after our last contact.',
              'Transaction and KYC records: at least five years after the transaction, as required by UAE AML rules.',
              'Marketing preferences: until you withdraw consent.',
            ]}
          />
        </>
      ),
    },
    {
      id: 'your-rights',
      title: 'Your rights',
      content: (
        <>
          <P first>Subject to the PDPL, you have the right to:</P>
          <UL
            items={[
              'Obtain information about, and a copy of, the personal data we hold about you.',
              'Ask us to correct inaccurate or incomplete data.',
              'Ask us to erase data, where we no longer need it and no legal obligation requires us to keep it.',
              'Restrict or object to certain processing, including direct marketing.',
              'Withdraw consent at any time, without affecting earlier processing.',
              'Request transfer of your data to another controller in a structured, machine-readable format.',
            ]}
          />
          <P>
            To exercise any of these rights, email <A to={mail}>{CONTACT_EMAIL}</A>. We may ask you to verify your identity and will respond within 30 days. You may also
            lodge a complaint with the UAE Data Office.
          </P>
        </>
      ),
    },
    {
      id: 'security',
      title: 'Security',
      content: (
        <P first>
          We use technical and organisational measures appropriate to the risk, including encrypted connections, role-based access to our CRM, and staff training. KYC
          documents are stored separately with restricted access. No system is perfectly secure; if we become aware of a breach affecting your data we will notify you and the
          UAE Data Office as required by law.
        </P>
      ),
    },
    {
      id: 'changes',
      title: 'Changes to this policy',
      content: (
        <P first>
          We may update this policy from time to time. The “last updated” date at the top shows when it was last revised; significant changes will be highlighted on this page.
        </P>
      ),
    },
    {
      id: 'contact',
      title: 'Contact us',
      content: (
        <>
          <P first>Data protection contact: [Data Protection Officer name]</P>
          <UL
            items={[
              <>
                Email: <A to={mail}>{CONTACT_EMAIL}</A>
              </>,
              <>
                Phone: <A to={`tel:${CONTACT_PHONE.replace(/\s/g, '')}`}>{CONTACT_PHONE}</A>
              </>,
              `Post: ${OFFICE_ADDRESS}`,
            ]}
          />
        </>
      ),
    },
  ],
}

const TERMS: LegalDoc = {
  title: 'Terms of use',
  intro: <P first>Please read these terms carefully. They explain the rules for using the Apex Aora website and how our listings and tools should be relied on.</P>,
  sections: [
    {
      id: 'about-these-terms',
      title: 'About these terms',
      content: (
        <>
          <P first>
            These terms govern your use of this website, operated by <B>Apex Aora Real Estate LLC</B>, a real estate brokerage licensed in Dubai (Trade Licence No. [Trade
            Licence No.]; RERA ORN [RERA ORN]), whose office is at {OFFICE_ADDRESS}.
          </P>
          <P>By using the website you accept these terms. If you do not agree, please do not use the website.</P>
        </>
      ),
    },
    {
      id: 'listings',
      title: 'Property listings and information',
      content: (
        <>
          <P first>
            Every listing we advertise carries a valid advertising permit (Trakheesi) issued by the Dubai Land Department, and the permit number is shown on the listing. We
            take care to keep information accurate, but:
          </P>
          <UL
            items={[
              'Prices, sizes, layouts, service charges and availability are provided by owners or developers and may change without notice.',
              'Images and floor plans may be indicative, and off-plan renderings are artistic impressions.',
              'A listing is an invitation to make an enquiry, not an offer capable of acceptance.',
            ]}
          />
          <P>You should verify all material facts, including title, through the DLD and your own advisers before committing to a transaction.</P>
        </>
      ),
    },
    {
      id: 'no-advice',
      title: 'No financial or legal advice',
      content: (
        <>
          <P first>
            Market data, yield figures, calculators (mortgage, DLD fees, ROI, rent vs buy) and instant estimates on this website are for general information only. They are
            indicative and are not a formal valuation, financial, tax, immigration or legal advice.
          </P>
          <P>A formal valuation for mortgage purposes must be carried out by a RERA-registered valuer appointed by the lender.</P>
        </>
      ),
    },
    {
      id: 'brokerage',
      title: 'Brokerage services and fees',
      content: (
        <>
          <P first>
            Our brokerage services are provided under separate written agreements in the form required by RERA — Form A (seller / landlord listing), Form B (buyer / tenant),
            and Form I (agent-to-agent) — and, for sales, a Memorandum of Understanding (Form F). These agreements, not these website terms, set out the fees payable.
          </P>
          <P>
            Unless agreed otherwise in writing, commission on sales is typically 2% of the purchase price and on rentals typically 5% of the annual rent, plus VAT at 5%.
            Government fees (such as the DLD transfer fee and trustee office fees) are paid to the relevant authority and are separate from our fees.
          </P>
        </>
      ),
    },
    {
      id: 'your-use',
      title: 'Your use of the website',
      content: (
        <>
          <P first>You agree not to:</P>
          <UL
            items={[
              'Submit false enquiries or impersonate another person.',
              'Copy, scrape or republish listings or content without our written consent.',
              'Interfere with the security or operation of the website, or introduce malicious code.',
              'Use the website for any unlawful purpose, including in breach of Federal Decree-Law No. 34 of 2021 on Combatting Rumours and Cybercrimes.',
            ]}
          />
        </>
      ),
    },
    {
      id: 'intellectual-property',
      title: 'Intellectual property',
      content: (
        <P first>
          The Apex Aora name, logo, design, text, photography and software on this website are owned by or licensed to Apex Aora Real Estate LLC. You may view and print pages
          for personal, non-commercial use. Any other use requires our prior written permission.
        </P>
      ),
    },
    {
      id: 'third-party',
      title: 'Third-party links and services',
      content: (
        <P first>
          The website links to third-party sites such as the DLD, developer pages, map providers and WhatsApp. We are not responsible for their content or privacy practices,
          and a link does not imply endorsement.
        </P>
      ),
    },
    {
      id: 'liability',
      title: 'Limitation of liability',
      content: (
        <>
          <P first>
            To the fullest extent permitted by UAE law, Apex Aora is not liable for any indirect or consequential loss, or for any loss arising from reliance on information on
            this website, including indicative estimates and calculator results.
          </P>
          <P>Nothing in these terms limits liability that cannot be limited under UAE law, including liability for fraud or gross negligence.</P>
        </>
      ),
    },
    {
      id: 'privacy',
      title: 'Privacy and cookies',
      content: (
        <P first>
          Our use of personal data is described in our <A to="/legal/privacy">privacy policy</A>, and our use of cookies in our <A to="/legal/cookies">cookie policy</A>.
        </P>
      ),
    },
    {
      id: 'accessibility',
      title: 'Accessibility',
      content: (
        <P first>
          We aim to meet WCAG 2.1 level AA across the website. If you have difficulty using any part of it, email <A to={`${mail}?subject=Accessibility`}>{CONTACT_EMAIL}</A>{' '}
          and we will provide the information in another format.
        </P>
      ),
    },
    {
      id: 'complaints',
      title: 'Complaints',
      content: (
        <P first>
          If you are unhappy with our service, please <A to="/contact">contact us</A> and choose “Complaint”. We aim to acknowledge complaints within two working days and
          resolve them within 14 days. If a complaint is not resolved, you may refer it to the Real Estate Regulatory Agency (RERA) through the Dubai Land Department.
        </P>
      ),
    },
    {
      id: 'governing-law',
      title: 'Governing law',
      content: (
        <P first>
          These terms are governed by the laws of the Emirate of Dubai and the federal laws of the United Arab Emirates. The courts of Dubai have exclusive jurisdiction over
          any dispute arising from them.
        </P>
      ),
    },
    {
      id: 'changes',
      title: 'Changes to these terms',
      content: <P first>We may update these terms at any time. The version published on this page, with its “last updated” date, applies to your use of the website.</P>,
    },
  ],
}

const COOKIES_DOC: LegalDoc = {
  title: 'Cookie policy',
  intro: (
    <P first>
      This policy explains how Apex Aora Real Estate LLC uses cookies and similar technologies on this website, and how you can control them. You can update your choices at
      any time in <B>Manage preferences</B>.
    </P>
  ),
  sections: [
    {
      id: 'what-are-cookies',
      title: 'What cookies are',
      content: (
        <P first>
          Cookies are small text files placed on your device when you visit a website. We also use similar technologies such as local storage. Some are essential for the site
          to work; others help us understand usage or measure advertising and are used only with your consent, as required by the UAE Personal Data Protection Law (Federal
          Decree-Law No. 45 of 2021).
        </P>
      ),
    },
    {
      id: 'types',
      title: 'Types of cookies we use',
      content: (
        <UL
          items={[
            <>
              <B>Essential</B> — needed for security, your preferences and saved properties. These cannot be switched off.
            </>,
            <>
              <B>Analytics</B> — help us see how visitors use the site so we can improve it. Off unless you allow them.
            </>,
            <>
              <B>Marketing</B> — set by advertising partners to measure campaigns and show relevant ads. Off unless you allow them.
            </>,
          ]}
        />
      ),
    },
    {
      id: 'cookie-list',
      title: 'Cookies on this website',
      content: (
        <>
          <P first>The list below shows the cookies and storage items we use. Third-party cookie names may change; we review this list regularly.</P>
          <CookieCards />
        </>
      ),
    },
    {
      id: 'manage',
      title: 'Manage preferences',
      content: (
        <>
          <P first>Choose which optional cookies you allow. Your choice is saved on this device and you can change it at any time.</P>
          <CookiePreferences />
        </>
      ),
    },
    {
      id: 'browser-settings',
      title: 'Browser controls',
      content: (
        <P first>
          You can also block or delete cookies through your browser settings. Blocking essential cookies may stop parts of the site, such as saved properties and currency
          selection, from working.
        </P>
      ),
    },
    {
      id: 'more-information',
      title: 'More information',
      content: (
        <P first>
          For details on how we handle personal data, see our <A to="/legal/privacy">privacy policy</A>. Questions about cookies can be sent to{' '}
          <A to={`${mail}?subject=Cookies`}>{CONTACT_EMAIL}</A>.
        </P>
      ),
    },
  ],
}

export const LEGAL_DOCS: Record<DocKey, LegalDoc> = { privacy: PRIVACY, terms: TERMS, cookies: COOKIES_DOC }
export const isDocKey = (d: string | undefined): d is DocKey => d === 'privacy' || d === 'terms' || d === 'cookies'
