import Link from 'next/link'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import Cookies from 'universal-cookie'

import { AcceptButton, DisclaimerContent, DisclaimerOverlay, DisclaimerText, DisclaimerTitle } from './elements'

const Disclaimer = (): React.ReactNode => {
  const cookies = useRef(new Cookies()).current
  const [open, setOpen] = useState(true)

  useEffect(() => {
    if (cookies.get('disclaimer_accept') === 'true') {
      setOpen(false)
    }
  }, [])

  const closeDrawer = useCallback((): void => {
    setOpen(false)
    cookies.set('disclaimer_accept', 'true', { path: '/', sameSite: 'strict', secure: true })
  }, [])

  return (
    <DisclaimerOverlay isOpen={open}>
      <DisclaimerTitle>Cookie and Privacy Disclosure</DisclaimerTitle>
      <DisclaimerContent>
        <div className="flex flex-1 flex-col gap-2">
          <DisclaimerText>
            This site only uses essential cookies such as those used to keep you logged in. We collect no personally
            identifiable information and no contact information. Depending on your activity, your IP address may appear
            in our logs for up to 90 days. We never sell your information -- we intentionally don&apos;t have
            information to sell -- and WE DO NOT USE YOUR INTERACTIONS TO TRAIN AI MODELS.
          </DisclaimerText>
          <DisclaimerText>
            See our <Link href="/privacy-policy">privacy policy</Link> for more information.
          </DisclaimerText>
        </div>
        <div className="p-2 text-center">
          <AcceptButton onPress={closeDrawer} />
        </div>
      </DisclaimerContent>
    </DisclaimerOverlay>
  )
}

export default Disclaimer
