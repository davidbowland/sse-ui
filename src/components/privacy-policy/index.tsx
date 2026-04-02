import Link from 'next/link'
import React from 'react'

import { PolicyBody, PolicyBodyDiv, PolicyContainer, PolicyH5, PolicyH6 } from './elements'

const PrivacyPolicy = (): React.ReactNode => {
  return (
    <PolicyContainer>
      <PolicyH5>StreetLogic AI Privacy Policy</PolicyH5>
      <PolicyBody>
        This Privacy Policy describes how your personal information is collected, used, and shared when you visit{' '}
        <Link href="https://sse.dbowland.com/">https://sse.dbowland.com</Link> (the &quot;Site&quot;).
      </PolicyBody>
      <PolicyH6>PERSONAL INFORMATION WE COLLECT</PolicyH6>
      <PolicyBody>
        When you visit the Site, we automatically collect certain information about your device, including information
        about your web browser, IP address, time zone, and some of the cookies that are installed on your device.
        Additionally, as you browse the Site, we collect information about the individual web pages or products that you
        view, what websites or search terms referred you to the Site, and information about how you interact with the
        Site. We refer to this automatically-collected information as &quot;Device Information.&quot;
      </PolicyBody>
      <PolicyBodyDiv>
        We collect Device Information using the following technologies:
        <ul>
          <li>
            &quot;Cookies&quot; are data files that are placed on your device or computer and often include an anonymous
            unique identifier. For more information about cookies, and how to disable cookies, visit{' '}
            <Link href="http://www.allaboutcookies.org">http://www.allaboutcookies.org</Link>.
          </li>
          <li>
            &quot;Log files&quot; track actions occurring on the Site, and collect data including your IP address,
            browser type, Internet service provider, referring/exit pages, and date/time stamps.
          </li>
        </ul>
      </PolicyBodyDiv>
      <PolicyBody>
        When we talk about &quot;Personal Information&quot; in this Privacy Policy, we are talking about Device
        Information.
      </PolicyBody>
      <PolicyH6>HOW DO WE USE YOUR PERSONAL INFORMATION?</PolicyH6>
      <PolicyBody>
        We use the Device Information that we collect to help us screen for potential risk and fraud (in particular,
        your IP address), and more generally to improve and optimize our Site (for example, by generating analytics
        about how our customers browse and interact with the Site, and to assess the success of our marketing and
        advertising campaigns).
      </PolicyBody>
      <PolicyBody>
        We do not share your Personal Information with third parties except in the extreme cases defined below.
      </PolicyBody>
      <PolicyBody>
        Finally, we may share your Personal Information to comply with applicable laws and regulations, to respond to a
        subpoena, search warrant or other lawful request for information we receive, or to otherwise protect our rights.
      </PolicyBody>
      <PolicyH6>DO NOT TRACK</PolicyH6>
      <PolicyBody>
        Please note that we do not alter our Site&apos;s data collection and use practices when we see a Do Not Track
        signal from your browser.
      </PolicyBody>
      <PolicyH6>YOUR RIGHTS</PolicyH6>
      <PolicyBody>
        If you are a European resident, you have the right to access personal information we hold about you and to ask
        that your personal information be corrected, updated, or deleted. If you would like to exercise this right,
        please contact us through the contact information below. Additionally, if you are a European resident we note
        that we are processing your information in order to fulfill contracts we might have with you (for example if you
        make an order through the Site), or otherwise to pursue our legitimate business interests listed above. Further,
        please note that your information will be transferred outside of Europe, including to the United States.
      </PolicyBody>
      <PolicyH6>DATA RETENTION</PolicyH6>
      <PolicyBody>
        We may maintain log files for up to 90 days. If you request data you entered into the site to be deleted, it
        will be removed within 30 days of your request.
      </PolicyBody>
      <PolicyH6>AI INTERACTIONS</PolicyH6>
      <PolicyBody>
        We do not use your interactions with the site to train AI models. We store claims and conversation chat history
        at least 24 hours to provide the opportunity to pause and resume conversations or refer back to them. Roughly
        24-48 hours after a chat session is initiated, all information about it is permanently deleted, including the
        claim and chat history.
      </PolicyBody>
      <PolicyH6>MINORS</PolicyH6>
      <PolicyBody>The Site is not intended for individuals under the age of 18.</PolicyBody>
      <PolicyH6>CHANGES</PolicyH6>
      <PolicyBody>
        We may update this privacy policy from time to time in order to reflect, for example, changes to our practices
        or for other operational, legal or regulatory reasons.
      </PolicyBody>
      <PolicyH6>CONTACT US</PolicyH6>
      <PolicyBody>
        For more information about our privacy practices, if you have questions, or if you would like to make a
        complaint, please contact us by e-mail at <Link href="mailto:privacy@dbowland.com">privacy@dbowland.com</Link>{' '}
        or by mail using the details provided below:
      </PolicyBody>
      <PolicyBody>dbowland.com Privacy Department, P.O. Box 81226, Seattle, WA, 98108-1226</PolicyBody>
    </PolicyContainer>
  )
}

export default PrivacyPolicy
