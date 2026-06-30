import Link from 'next/link'
import React from 'react'

import {
  PolicyEyebrow,
  PolicyFooter,
  PolicyIntro,
  PolicyPage,
  PolicySection,
  PolicySectionBody,
  PolicySectionLabel,
  PolicyTitle,
} from './elements'

const PrivacyPolicy = (): React.ReactNode => (
  <PolicyPage>
    <PolicyEyebrow />
    <PolicyTitle>Privacy Policy</PolicyTitle>
    <PolicyIntro>
      This policy describes how{' '}
      <Link href="https://sse.dbowland.com/" style={{ color: 'var(--accent)' }}>
        sse.dbowland.com
      </Link>{' '}
      handles your data. The short version: we collect very little, we keep it briefly, and we never sell it.
    </PolicyIntro>

    <PolicySection>
      <PolicySectionLabel>What we collect</PolicySectionLabel>
      <PolicySectionBody>
        Our servers automatically log your IP address, browser type, and the pages you visit. We use these logs to
        detect abuse and keep the site running. That&apos;s everything we collect.
      </PolicySectionBody>
    </PolicySection>

    <PolicySection>
      <PolicySectionLabel>Why we collect it</PolicySectionLabel>
      <PolicySectionBody>
        We process server log data under legitimate interests — operating a secure, functional website. We don&apos;t
        rely on your consent, and we don&apos;t use your data for advertising or profiling.
      </PolicySectionBody>
    </PolicySection>

    <PolicySection>
      <PolicySectionLabel>What we don&apos;t do</PolicySectionLabel>
      <PolicySectionBody>
        We don&apos;t sell your data. We don&apos;t share it with advertisers. We don&apos;t build profiles. We
        intentionally don&apos;t collect contact information or anything personally identifying beyond what appears in a
        standard server log. We do not use your interactions to train AI models.
      </PolicySectionBody>
    </PolicySection>

    <PolicySection>
      <PolicySectionLabel>AI interactions</PolicySectionLabel>
      <PolicySectionBody>
        Claims and chat history are stored for 24–48 hours so you can pause and resume conversations. After that window,
        everything — the claim and the full chat history — is permanently deleted.
      </PolicySectionBody>
    </PolicySection>

    <PolicySection>
      <PolicySectionLabel>When we share your data</PolicySectionLabel>
      <PolicySectionBody>
        We share data only when legally required — for example, in response to a valid court order or law enforcement
        request.
      </PolicySectionBody>
    </PolicySection>

    <PolicySection>
      <PolicySectionLabel>Your rights</PolicySectionLabel>
      <PolicySectionBody>
        Depending on where you live, you may have legal rights over your personal data — such as the right to access,
        correct, or delete it. To exercise any such rights, contact us at{' '}
        <Link href="mailto:privacy@dbowland.com" style={{ color: 'var(--accent)' }}>
          privacy@dbowland.com
        </Link>
        .
      </PolicySectionBody>
    </PolicySection>

    <PolicySection>
      <PolicySectionLabel>Data retention</PolicySectionLabel>
      <PolicySectionBody>
        Server logs are kept for up to 90 days, then deleted. Chat session data is deleted 24–48 hours after it&apos;s
        created.
      </PolicySectionBody>
    </PolicySection>

    <PolicySection>
      <PolicySectionLabel>Age</PolicySectionLabel>
      <PolicySectionBody>This site is intended for people 18 and older.</PolicySectionBody>
    </PolicySection>

    <PolicySection>
      <PolicySectionLabel>Changes</PolicySectionLabel>
      <PolicySectionBody>
        If we change how we handle data in a meaningful way, we&apos;ll update this page. The date at the bottom
        reflects the last revision.
      </PolicySectionBody>
    </PolicySection>

    <PolicySection>
      <PolicySectionLabel>Contact</PolicySectionLabel>
      <PolicySectionBody>
        Questions about this policy? Email{' '}
        <Link href="mailto:privacy@dbowland.com" style={{ color: 'var(--accent)' }}>
          privacy@dbowland.com
        </Link>{' '}
        or write to: StreetLogic AI Privacy, P.O. Box 81226, Seattle, WA 98108-1226.
      </PolicySectionBody>
    </PolicySection>

    <PolicyFooter>
      <Link href="/" style={{ fontSize: '13px', color: 'var(--text-muted)', fontFamily: 'var(--font)' }}>
        ← Back to StreetLogic AI
      </Link>
      <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontFamily: 'var(--font)' }}>
        Last updated June 2026
      </span>
    </PolicyFooter>
  </PolicyPage>
)

export default PrivacyPolicy
