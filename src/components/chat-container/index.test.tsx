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

describe('chat-container', () => {
  const initialConfidence = 'agree'
  const onConfidenceChange = jest.fn()

  it('renders children', async () => {
    render(
      <ChatContainer
        confidenceLevels={confidenceLevels}
        initialConfidence={initialConfidence}
        onConfidenceChange={onConfidenceChange}
      >
        fnord
      </ChatContainer>,
    )

    expect(screen.getByText(/fnord/)).toBeInTheDocument()
  })

  it.each([0])('invokes onConfidenceChange on confidence change', async (index: number) => {
    render(
      <ChatContainer
        confidenceLevels={confidenceLevels}
        initialConfidence={initialConfidence}
        onConfidenceChange={onConfidenceChange}
      >
        fnord
      </ChatContainer>,
    )

    const selects = screen.getAllByRole('combobox')
    await act(() => userEvent.selectOptions(selects[index], 'strongly agree'))

    expect(onConfidenceChange).toHaveBeenCalledWith('strongly agree')
  })

  it('navigates when clicking new claim button', async () => {
    render(
      <ChatContainer
        confidenceLevels={confidenceLevels}
        initialConfidence={initialConfidence}
        onConfidenceChange={onConfidenceChange}
      >
        fnord
      </ChatContainer>,
    )

    const newClaimButton = screen.getByText(/New claim/, { selector: 'button' })
    await act(() => userEvent.click(newClaimButton))

    expect(jest.mocked(useRouter)().push).toHaveBeenCalledWith('/')
  })
})
