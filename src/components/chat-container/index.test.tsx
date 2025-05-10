import { confidenceLevels } from '@test/__mocks__'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import * as gatsby from 'gatsby'
import React, { act } from 'react'

import ChatContainer from './index'

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

  it.each([0, 1])('invokes onConfidenceChange on confidence change', async (index: number) => {
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

    const confidenceOptionList = screen.getAllByText(/Agree/)[index]
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
