import '@testing-library/jest-dom'
import * as gatsby from 'gatsby'
import React, { act } from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { assistantMessage, dividers, userMessage } from '@test/__mocks__'
import ChatWindow from './index'

jest.mock('@aws-amplify/analytics')
jest.mock('gatsby')

describe('chat-window', () => {
  const finished = false
  const history = [userMessage, assistantMessage]
  const isTyping = false
  const message = 'a friendly message'
  const mockScrollIntoView = jest.fn()
  const mockSendChatMessage = jest.fn()

  beforeAll(() => {
    window.HTMLElement.prototype.scrollIntoView = mockScrollIntoView
  })

  it('renders history in chat window', () => {
    render(
      <ChatWindow
        dividers={dividers}
        finished={finished}
        history={history}
        isTyping={isTyping}
        sendChatMessage={mockSendChatMessage}
      />,
    )

    expect(screen.getByText(userMessage.content)).toBeInTheDocument()
    expect(screen.getByText(assistantMessage.content)).toBeInTheDocument()
  })

  it('sends a message', async () => {
    render(
      <ChatWindow
        dividers={dividers}
        finished={finished}
        history={history}
        isTyping={isTyping}
        sendChatMessage={mockSendChatMessage}
      />,
    )

    const inputBox = screen.getByLabelText(/Message/)
    await act(() => userEvent.type(inputBox, message))
    const sendButton = screen.getByText(/Send/, { selector: 'button' })
    await act(() => userEvent.click(sendButton))

    expect(mockSendChatMessage).toHaveBeenCalledWith(message)
    expect(inputBox.innerText).toBeFalsy()
  })

  it("won't send a message when typing", async () => {
    render(
      <ChatWindow
        dividers={dividers}
        finished={finished}
        history={history}
        isTyping={true}
        sendChatMessage={mockSendChatMessage}
      />,
    )

    const inputBox = screen.getByLabelText(/Message/)
    await act(() => userEvent.type(inputBox, message))
    const sendButton = screen.getByText(/Send/, { selector: 'button' })
    await act(() => userEvent.click(sendButton.parentElement as HTMLDivElement))

    expect(inputBox.innerText).toBeFalsy()
    expect(mockSendChatMessage).not.toHaveBeenCalled()
  })

  it("won't send an empty message", async () => {
    render(
      <ChatWindow
        dividers={dividers}
        finished={finished}
        history={history}
        isTyping={isTyping}
        sendChatMessage={mockSendChatMessage}
      />,
    )

    const inputBox = screen.getByLabelText(/Message/)
    const sendButton = screen.getByText(/Send/, { selector: 'button' })
    await act(() => userEvent.click(sendButton.parentElement as HTMLDivElement))

    expect(inputBox.innerText).toBeFalsy()
    expect(mockSendChatMessage).not.toHaveBeenCalled()
  })

  it('shows new claim button when finished', async () => {
    render(
      <ChatWindow
        dividers={dividers}
        finished={true}
        history={history}
        isTyping={isTyping}
        sendChatMessage={mockSendChatMessage}
      />,
    )

    const newClaimButton = screen.getByText(/New claim/, { selector: 'button' })
    await act(() => userEvent.click(newClaimButton))

    expect(screen.queryByText(/Send/, { selector: 'button' })).not.toBeInTheDocument()
    expect(gatsby.navigate).toHaveBeenCalledWith('/')
  })
})
