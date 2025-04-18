import '@testing-library/jest-dom'
import * as gatsby from 'gatsby'
import React, { act } from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import ChatContainer from './index'
import { confidenceLevels } from '@test/__mocks__'

jest.mock('@aws-amplify/analytics')
jest.mock('gatsby')

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

  it('invokes onConfidenceChange on confidence change', async () => {
    const newConfidence = 'strongly agree'
    render(
      <ChatContainer
        confidenceLevels={confidenceLevels}
        initialConfidence={initialConfidence}
        onConfidenceChange={onConfidenceChange}
      >
        fnord
      </ChatContainer>,
    )

    const confidenceOptionList = screen.getByText(/Agree/)
    await act(() => userEvent.click(confidenceOptionList))
    const confidenceOptionItem = await screen.findByText(newConfidence, { exact: false })
    await act(() => userEvent.click(confidenceOptionItem))

    expect(onConfidenceChange).toHaveBeenCalledWith(newConfidence)
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

    expect(gatsby.navigate).toHaveBeenCalledWith('/')
  })
})
