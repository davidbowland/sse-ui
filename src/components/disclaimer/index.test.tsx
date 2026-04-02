import '@testing-library/jest-dom'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React, { act } from 'react'
import Cookies from 'universal-cookie'

import Disclaimer from './index'

jest.mock('universal-cookie')

describe('disclaimer component', () => {
  const mockCookieGet = jest.fn()
  const mockCookieSet = jest.fn()

  beforeAll(() => {
    jest.mocked(Cookies).mockReturnValue({
      get: mockCookieGet,
      set: mockCookieSet,
    } as unknown as Cookies)
  })

  it('loads under normal circumstances', async () => {
    render(<Disclaimer />)

    expect(await screen.findByText(/Accept & continue/i)).toBeInTheDocument()
    expect(screen.getByTestId('disclaimer-overlay')).not.toHaveClass('hidden')
  })

  it('closes when button clicked', async () => {
    render(<Disclaimer />)

    const closeButton = (await screen.findByText(/Accept & continue/i, {
      selector: 'button',
    })) as HTMLButtonElement
    await act(() => userEvent.click(closeButton))

    expect(mockCookieSet).toHaveBeenCalledWith('disclaimer_accept', 'true', {
      path: '/',
      sameSite: 'strict',
      secure: true,
    })
    expect(screen.getByTestId('disclaimer-overlay')).toHaveClass('hidden')
  })

  it('loads closed when cookie is set', async () => {
    mockCookieGet.mockReturnValueOnce('true')
    render(<Disclaimer />)

    await waitFor(() => {
      expect(mockCookieGet).toHaveBeenCalledWith('disclaimer_accept')
      expect(screen.getByTestId('disclaimer-overlay')).toHaveClass('hidden')
    })
  })
})
