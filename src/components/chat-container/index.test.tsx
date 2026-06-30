import { confidenceLevels } from '@test/__mocks__'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useRouter } from 'next/router'
import React, { act } from 'react'

import ChatContainer from './index'

jest.mock('next/router', () => ({
  useRouter: jest.fn().mockReturnValue({ push: jest.fn() }),
}))

const mockObserve = jest.fn()
const mockDisconnect = jest.fn()
let intersectionCallback: IntersectionObserverCallback

beforeAll(() => {
  global.IntersectionObserver = jest.fn().mockImplementation((cb: IntersectionObserverCallback) => {
    intersectionCallback = cb
    return { observe: mockObserve, disconnect: mockDisconnect }
  })
})

describe('chat-container', () => {
  const initialConfidence = 'agree'
  const onConfidenceChange = jest.fn()

  function setup(props: Partial<React.ComponentProps<typeof ChatContainer>> = {}) {
    return render(
      <ChatContainer
        confidenceLevels={confidenceLevels}
        initialConfidence={initialConfidence}
        onConfidenceChange={onConfidenceChange}
        {...props}
      >
        fnord
      </ChatContainer>,
    )
  }

  it('renders children', async () => {
    setup()
    expect(screen.getByText(/fnord/)).toBeInTheDocument()
  })

  it('renders claim text when claim prop is provided', () => {
    setup({ claim: 'Free will is an illusion' })
    expect(screen.getByText('Free will is an illusion')).toBeInTheDocument()
  })

  it('renders error message when errorMessage prop is provided', () => {
    setup({ errorMessage: 'Session expired' })
    expect(screen.getByText(/Session expired/)).toBeInTheDocument()
  })

  it('compact claim strip is hidden initially', () => {
    setup({ claim: 'Free will is an illusion' })
    const strip = screen.getByTestId('compact-claim-strip')
    expect(strip).toHaveStyle({ opacity: '0' })
  })

  it('compact claim strip becomes visible when claim card exits viewport', async () => {
    setup({ claim: 'Free will is an illusion' })
    const strip = screen.getByTestId('compact-claim-strip')

    await act(async () => {
      intersectionCallback([{ isIntersecting: false } as IntersectionObserverEntry], {} as IntersectionObserver)
    })

    expect(strip).toHaveStyle({ opacity: '1' })
  })

  it('compact claim strip hides again when claim card re-enters viewport', async () => {
    setup({ claim: 'Free will is an illusion' })
    const strip = screen.getByTestId('compact-claim-strip')

    await act(async () => {
      intersectionCallback([{ isIntersecting: false } as IntersectionObserverEntry], {} as IntersectionObserver)
    })
    await act(async () => {
      intersectionCallback([{ isIntersecting: true } as IntersectionObserverEntry], {} as IntersectionObserver)
    })

    expect(strip).toHaveStyle({ opacity: '0' })
  })

  it.each([0])('invokes onConfidenceChange on confidence change', async (index: number) => {
    setup()
    const selects = screen.getAllByRole('combobox')
    await act(() => userEvent.selectOptions(selects[index], 'strongly agree'))
    expect(onConfidenceChange).toHaveBeenCalledWith('strongly agree')
  })

  it('navigates when clicking new claim button', async () => {
    setup()
    const newClaimButton = screen.getByText(/New claim/, { selector: 'button' })
    await act(() => userEvent.click(newClaimButton))
    expect(jest.mocked(useRouter)().push).toHaveBeenCalledWith('/')
  })
})
