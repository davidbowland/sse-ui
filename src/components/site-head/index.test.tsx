import '@testing-library/jest-dom'
import { render } from '@testing-library/react'
import React from 'react'

import SiteHead from './index'

describe('site-head component', () => {
  it('sets the document title', () => {
    render(<SiteHead title="StreetLogic AI | Test" />)

    expect(document.title).toBe('StreetLogic AI | Test')
  })

  it('sets matching og:title and twitter:title meta tags', () => {
    render(<SiteHead title="StreetLogic AI | Test" />)

    expect(document.querySelector('meta[property="og:title"]')).toHaveAttribute('content', 'StreetLogic AI | Test')
    expect(document.querySelector('meta[name="twitter:title"]')).toHaveAttribute('content', 'StreetLogic AI | Test')
  })

  it('sets the viewport meta tag', () => {
    render(<SiteHead title="StreetLogic AI | Test" />)

    expect(document.querySelector('meta[name="viewport"]')).toHaveAttribute(
      'content',
      'width=device-width, initial-scale=1',
    )
  })
})
