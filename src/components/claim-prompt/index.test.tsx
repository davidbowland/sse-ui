import { confidenceLevels, suggestedClaims } from '@test/__mocks__'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React, { act } from 'react'

import ClaimPrompt from './index'
import { useBrowserLanguage } from '@hooks/useBrowserLanguage'
import { useConfidenceLevels } from '@hooks/useConfidenceLevels'
import { useSuggestedClaims } from '@hooks/useSuggestedClaims'

jest.mock('@hooks/useBrowserLanguage')
jest.mock('@hooks/useConfidenceLevels')
jest.mock('@hooks/useSuggestedClaims')

describe('claim-prompt', () => {
  const mockFetchSuggestedClaims = jest.fn()
  const mockOnClaimSelect = jest.fn()
  const mockScrollIntoView = jest.fn()
  const mockValidateClaim = jest.fn()

  const errorMessage = undefined
  const validatedClaims = ['An awesome claim', 'A super claim', 'An okay claim']

  beforeAll(() => {
    console.error = jest.fn()
    window.HTMLElement.prototype.scrollIntoView = mockScrollIntoView
  })

  beforeEach(() => {
    jest.mocked(useConfidenceLevels).mockReturnValue({ confidenceLevels })
    jest.mocked(useSuggestedClaims).mockReturnValue({
      errorMessage,
      fetchSuggestedClaims: mockFetchSuggestedClaims,
      suggestedClaims,
      validateClaim: mockValidateClaim,
    })
    jest.mocked(useBrowserLanguage).mockReturnValue({ browserLanguage: 'en-US' })

    mockOnClaimSelect.mockResolvedValue(undefined)
    mockValidateClaim.mockReturnValue({ inappropriate: false, isTruthClaim: true, suggestions: validatedClaims })
  })

  it('generates and selects a claim', async () => {
    render(<ClaimPrompt onClaimSelect={mockOnClaimSelect} />)

    const suggestClaimsButton = await screen.findByText(/Suggest claims/, { selector: 'button' })
    await act(() => userEvent.click(suggestClaimsButton))

    const claimToSelect = await screen.findByText(/The US should only intervene militarily when directly attacked\./)
    await act(() => userEvent.click(claimToSelect))
    const claimConfirmButton = screen.getByText(/Select/, { selector: 'button' })
    await act(() => userEvent.click(claimConfirmButton))

    const confidenceToSelect = await screen.findByText(/Strongly agree/)
    await act(() => userEvent.click(confidenceToSelect))
    await screen.findByText(/The US should only intervene militarily when directly attacked\./)
    const confidenceConfirmButton = screen.getByText(/Select/, { selector: 'button' })
    await act(() => userEvent.click(confidenceConfirmButton))

    await screen.findByText(/Creating chat session/)

    expect(mockFetchSuggestedClaims).toHaveBeenCalledWith('en-US')
    expect(mockOnClaimSelect).toHaveBeenCalledWith(
      'The US should only intervene militarily when directly attacked.',
      'strongly agree',
      'en-US',
    )
  })

  it('validates and selects a claim', async () => {
    jest.mocked(useSuggestedClaims).mockReturnValue({
      errorMessage,
      fetchSuggestedClaims: mockFetchSuggestedClaims,
      suggestedClaims: validatedClaims,
      validateClaim: mockValidateClaim,
    })

    render(<ClaimPrompt onClaimSelect={mockOnClaimSelect} />)

    const claimInput = await screen.findByLabelText(/Truth claim/)
    await act(() => userEvent.type(claimInput, 'An awesome claim'))
    const submitClaimButton = screen.getByText(/Submit/, { selector: 'button' })
    await act(() => userEvent.click(submitClaimButton))

    const claimToSelect = await screen.findByText(/A super claim/)
    await act(() => userEvent.click(claimToSelect))
    const claimConfirmButton = screen.getByText(/Select/, { selector: 'button' })
    await act(() => userEvent.click(claimConfirmButton))

    const confidenceToSelect = await screen.findByText(/Strongly disagree/)
    await act(() => userEvent.click(confidenceToSelect))
    await screen.findByText(/A super claim/)
    const confidenceConfirmButton = screen.getByText(/Select/, { selector: 'button' })
    await act(() => userEvent.click(confidenceConfirmButton))

    await screen.findByText(/Creating chat session/)

    expect(mockValidateClaim).toHaveBeenCalledWith('An awesome claim', 'en-US')
    expect(mockOnClaimSelect).toHaveBeenCalledWith('A super claim', 'strongly disagree', 'en-US')
  })

  it('validates a claim on enter being pressed', async () => {
    jest.mocked(useSuggestedClaims).mockReturnValue({
      errorMessage,
      fetchSuggestedClaims: mockFetchSuggestedClaims,
      suggestedClaims: validatedClaims,
      validateClaim: mockValidateClaim,
    })

    render(<ClaimPrompt onClaimSelect={mockOnClaimSelect} />)

    const claimInput = await screen.findByLabelText(/Truth claim/)
    await act(() => userEvent.type(claimInput, 'An awesome claim{enter}'))

    expect(mockValidateClaim).toHaveBeenCalledWith('An awesome claim', 'en-US')
  })

  it("doesn't show language option when browser language is en-US", async () => {
    render(<ClaimPrompt onClaimSelect={mockOnClaimSelect} />)

    expect(screen.queryByText(/en-US/)).not.toBeInTheDocument()
  })

  it('renders language option when browser language is NOT en-US', async () => {
    jest.mocked(useBrowserLanguage).mockReturnValue({ browserLanguage: 'es-PA' })
    render(<ClaimPrompt onClaimSelect={mockOnClaimSelect} />)

    expect(screen.getByText(/Chat language/)).toBeInTheDocument()
    expect(screen.getByText(/es-PA/)).toBeInTheDocument()
  })

  it('uses selected language for generated claims', async () => {
    jest.mocked(useBrowserLanguage).mockReturnValue({ browserLanguage: 'es-PA' })
    render(<ClaimPrompt onClaimSelect={mockOnClaimSelect} />)

    const chatLanguageSwitch = await screen.findByRole('checkbox')
    await act(() => userEvent.click(chatLanguageSwitch))

    const suggestClaimsButton = screen.getByText(/Suggest claims/, { selector: 'button' })
    await act(() => userEvent.click(suggestClaimsButton))

    const claimToSelect = await screen.findByText(/Military intervention causes more harm than good\./)
    await act(() => userEvent.click(claimToSelect))
    const claimConfirmButton = screen.getByText(/Select/, { selector: 'button' })
    await act(() => userEvent.click(claimConfirmButton))

    const confidenceToSelect = await screen.findByText(/Slightly agree/)
    await act(() => userEvent.click(confidenceToSelect))
    await screen.findByText(/Military intervention causes more harm than good\./)
    const confidenceConfirmButton = screen.getByText(/Select/, { selector: 'button' })
    await act(() => userEvent.click(confidenceConfirmButton))

    await screen.findByText(/Creating chat session/)

    expect(mockFetchSuggestedClaims).toHaveBeenCalledWith('es-PA')
    expect(mockOnClaimSelect).toHaveBeenCalledWith(
      'Military intervention causes more harm than good.',
      'slightly agree',
      'es-PA',
    )
  })

  it('allows deselecting language for generated claims', async () => {
    jest.mocked(useBrowserLanguage).mockReturnValue({ browserLanguage: 'fr-FR' })
    render(<ClaimPrompt onClaimSelect={mockOnClaimSelect} />)

    const chatLanguageSwitch = await screen.findByRole('checkbox')
    await act(() => userEvent.click(chatLanguageSwitch))
    await act(() => userEvent.click(chatLanguageSwitch))

    const suggestClaimsButton = screen.getByText(/Suggest claims/, { selector: 'button' })
    await act(() => userEvent.click(suggestClaimsButton))

    expect(mockFetchSuggestedClaims).toHaveBeenCalledWith('en-US')
  })

  it('uses selected language for validated claims', async () => {
    jest.mocked(useBrowserLanguage).mockReturnValue({ browserLanguage: 'es-SP' })
    jest.mocked(useSuggestedClaims).mockReturnValue({
      errorMessage,
      fetchSuggestedClaims: mockFetchSuggestedClaims,
      suggestedClaims: validatedClaims,
      validateClaim: mockValidateClaim,
    })

    render(<ClaimPrompt onClaimSelect={mockOnClaimSelect} />)

    const chatLanguageSwitch = await screen.findByRole('checkbox')
    await act(() => userEvent.click(chatLanguageSwitch))

    const claimInput = await screen.findByLabelText(/Truth claim/)
    await act(() => userEvent.type(claimInput, 'A cool claim'))
    const submitClaimButton = screen.getByText(/Submit/, { selector: 'button' })
    await act(() => userEvent.click(submitClaimButton))

    const claimToSelect = await screen.findByText(/An okay claim/)
    await act(() => userEvent.click(claimToSelect))
    const claimConfirmButton = screen.getByText(/Select/, { selector: 'button' })
    await act(() => userEvent.click(claimConfirmButton))

    const confidenceToSelect = await screen.findByText(/Strongly disagree/)
    await act(() => userEvent.click(confidenceToSelect))
    await screen.findByText(/An okay claim/)
    const confidenceConfirmButton = screen.getByText(/Select/, { selector: 'button' })
    await act(() => userEvent.click(confidenceConfirmButton))

    await screen.findByText(/Creating chat session/)

    expect(mockValidateClaim).toHaveBeenCalledWith('A cool claim', 'es-SP')
    expect(mockOnClaimSelect).toHaveBeenCalledWith('An okay claim', 'strongly disagree', 'es-SP')
  })

  it('pre-selects valid input claim', async () => {
    jest.mocked(useSuggestedClaims).mockReturnValue({
      errorMessage,
      fetchSuggestedClaims: mockFetchSuggestedClaims,
      suggestedClaims: validatedClaims,
      validateClaim: mockValidateClaim,
    })

    render(<ClaimPrompt onClaimSelect={mockOnClaimSelect} />)

    const claimInput = await screen.findByLabelText(/Truth claim/)
    await act(() => userEvent.type(claimInput, 'An awesome claim'))
    const submitClaimButton = screen.getByText(/Submit/, { selector: 'button' })
    await act(() => userEvent.click(submitClaimButton))

    const claimConfirmButton = await screen.findByText(/Select/, { selector: 'button' })
    await act(() => userEvent.click(claimConfirmButton))

    const confidenceToSelect = await screen.findByText(/Slightly disagree/)
    await act(() => userEvent.click(confidenceToSelect))
    await screen.findByText(/An awesome claim/)
    const confidenceConfirmButton = screen.getByText(/Select/, { selector: 'button' })
    await act(() => userEvent.click(confidenceConfirmButton))

    await screen.findByText(/Creating chat session/)

    expect(mockValidateClaim).toHaveBeenCalledWith('An awesome claim', 'en-US')
    expect(mockOnClaimSelect).toHaveBeenCalledWith('An awesome claim', 'slightly disagree', 'en-US')
  })

  it('rejects inappropraite claims', async () => {
    mockValidateClaim.mockResolvedValueOnce({ inappropriate: true, isTruthClaim: true, suggestions: validatedClaims })
    render(<ClaimPrompt onClaimSelect={mockOnClaimSelect} />)

    const claimInput = await screen.findByLabelText(/Truth claim/)
    await act(() => userEvent.type(claimInput, 'An inappropriate claim'))
    const submitClaimButton = screen.getByText(/Submit/, { selector: 'button' })
    await act(() => userEvent.click(submitClaimButton))

    expect(
      await screen.findByText(
        /Error validating claim\. It may be invalid or inappropriate\. Please input a new claim to try again\./,
      ),
    ).toBeInTheDocument()
  })

  it('allows backwards navigation', async () => {
    render(<ClaimPrompt onClaimSelect={mockOnClaimSelect} />)

    const suggestClaimsButton = screen.getByText(/Suggest claims/, { selector: 'button' })
    await act(() => userEvent.click(suggestClaimsButton))

    const claimToSelect = await screen.findByText(
      /US foreign policy should focus on diplomacy rather than military action./,
    )
    await act(() => userEvent.click(claimToSelect))
    const claimConfirmButton = screen.getByText(/Select/, { selector: 'button' })
    await act(() => userEvent.click(claimConfirmButton))

    const confidenceToSelect = await screen.findByText(/Slightly agree/)
    await act(() => userEvent.click(confidenceToSelect))
    await screen.findByText(/US foreign policy should focus on diplomacy rather than military action\./)
    const confidenceBackButton = screen.getByText(/Back/, { selector: 'button' })
    await act(() => userEvent.click(confidenceBackButton))

    await screen.findByText(/Select a claim/)
    const claimBackButton = screen.getByText(/Back/, { selector: 'button' })
    await act(() => userEvent.click(claimBackButton))

    expect(await screen.findByText(/Suggest claims/, { selector: 'button' })).toBeInTheDocument()
  })

  it('shows error on confidence screen when confidence levels fail to load', async () => {
    jest.mocked(useConfidenceLevels).mockReturnValue({ confidenceLevels: [] })
    render(<ClaimPrompt onClaimSelect={mockOnClaimSelect} />)

    const suggestClaimsButton = screen.getByText(/Suggest claims/, { selector: 'button' })
    await act(() => userEvent.click(suggestClaimsButton))

    const claimToSelect = await screen.findByText(/US military spending should be reduced\./)
    await act(() => userEvent.click(claimToSelect))
    const claimConfirmButton = screen.getByText(/Select/, { selector: 'button' })
    await act(() => userEvent.click(claimConfirmButton))

    expect(
      await screen.findByText(/Error loading confidence levels. Please refresh to try again\./),
    ).toBeInTheDocument()
  })

  it('skips first scroll when prompted', async () => {
    render(<ClaimPrompt onClaimSelect={mockOnClaimSelect} skipFirstScroll={true} />)

    const suggestClaimsButton = screen.getByText(/Suggest claims/, { selector: 'button' })
    await act(() => userEvent.click(suggestClaimsButton))

    expect(mockScrollIntoView).not.toHaveBeenCalled()
  })

  it('displays error message when no claims returned', async () => {
    jest.mocked(useSuggestedClaims).mockReturnValue({
      errorMessage,
      fetchSuggestedClaims: mockFetchSuggestedClaims,
      suggestedClaims: [],
      validateClaim: mockValidateClaim,
    })
    render(<ClaimPrompt onClaimSelect={mockOnClaimSelect} />)

    const suggestClaimsButton = await screen.findByText(/Suggest claims/, { selector: 'button' })
    await act(() => userEvent.click(suggestClaimsButton))

    expect(await screen.findByText(/Error generating suggested claims\. Please try again later\./)).toBeInTheDocument()
  })

  it('shows error alert when confidence levels fail to load', async () => {
    jest.mocked(useConfidenceLevels).mockReturnValue({ confidenceLevels, errorMessage: 'A nasty error.' })
    render(<ClaimPrompt onClaimSelect={mockOnClaimSelect} />)

    expect(await screen.findByText(/A nasty error\./)).toBeInTheDocument()
  })

  it('shows error alert when suggestions fail to load', async () => {
    jest.mocked(useSuggestedClaims).mockReturnValue({
      errorMessage: 'An unwelcome error.',
      fetchSuggestedClaims: mockFetchSuggestedClaims,
      suggestedClaims: [],
      validateClaim: mockValidateClaim,
    })
    render(<ClaimPrompt onClaimSelect={mockOnClaimSelect} />)

    const suggestClaimsButton = screen.getByText(/Suggest claims/, { selector: 'button' })
    await act(() => userEvent.click(suggestClaimsButton))

    expect(await screen.findByText(/An unwelcome error\./)).toBeInTheDocument()
  })

  it('shows both error alerts when confidence levels and suggestsions fail to load', async () => {
    jest.mocked(useConfidenceLevels).mockReturnValue({ confidenceLevels, errorMessage: 'The worst error.' })
    jest.mocked(useSuggestedClaims).mockReturnValue({
      errorMessage: 'How many errors?',
      fetchSuggestedClaims: mockFetchSuggestedClaims,
      suggestedClaims: [],
      validateClaim: mockValidateClaim,
    })
    render(<ClaimPrompt onClaimSelect={mockOnClaimSelect} />)

    const suggestClaimsButton = screen.getByText(/Suggest claims/, { selector: 'button' })
    await act(() => userEvent.click(suggestClaimsButton))

    expect(await screen.findByText(/The worst error\. How many errors\?/)).toBeInTheDocument()
  })

  it('handles onClaimSelect errors and returns to confidence stage', async () => {
    const mockOnClaimSelectWithError = jest.fn().mockRejectedValue(new Error('Session creation failed'))
    render(<ClaimPrompt onClaimSelect={mockOnClaimSelectWithError} />)

    const suggestClaimsButton = await screen.findByText(/Suggest claims/, { selector: 'button' })
    await act(() => userEvent.click(suggestClaimsButton))

    const claimToSelect = await screen.findByText(/The US should only intervene militarily when directly attacked\./)
    await act(() => userEvent.click(claimToSelect))
    const claimConfirmButton = screen.getByText(/Select/, { selector: 'button' })
    await act(() => userEvent.click(claimConfirmButton))

    const confidenceToSelect = await screen.findByText(/Strongly agree/)
    await act(() => userEvent.click(confidenceToSelect))
    const confidenceConfirmButton = screen.getByText(/Select/, { selector: 'button' })
    await act(() => userEvent.click(confidenceConfirmButton))

    // Should show error message and return to confidence stage
    expect(await screen.findByText(/Error creating chat session\. Please try again later\./)).toBeInTheDocument()
    expect(await screen.findByText(/Select your stance/)).toBeInTheDocument()

    expect(mockOnClaimSelectWithError).toHaveBeenCalledTimes(1)
    expect(mockOnClaimSelectWithError).toHaveBeenCalledWith(
      'The US should only intervene militarily when directly attacked.',
      'strongly agree',
      'en-US',
    )
  })

  it('succeeds on onClaimSelect success', async () => {
    const mockOnClaimSelectSuccess = jest.fn().mockResolvedValueOnce(undefined)

    render(<ClaimPrompt onClaimSelect={mockOnClaimSelectSuccess} />)

    const suggestClaimsButton = await screen.findByText(/Suggest claims/, { selector: 'button' })
    await act(() => userEvent.click(suggestClaimsButton))

    const claimToSelect = await screen.findByText(/The US should only intervene militarily when directly attacked\./)
    await act(() => userEvent.click(claimToSelect))
    const claimConfirmButton = screen.getByText(/Select/, { selector: 'button' })
    await act(() => userEvent.click(claimConfirmButton))

    const confidenceToSelect = await screen.findByText(/Strongly agree/)
    await act(() => userEvent.click(confidenceToSelect))
    const confidenceConfirmButton = screen.getByText(/Select/, { selector: 'button' })
    await act(() => userEvent.click(confidenceConfirmButton))

    // Should proceed to submitted stage after successful call
    await screen.findByText(/Creating chat session/)

    // Should be called once
    expect(mockOnClaimSelectSuccess).toHaveBeenCalledTimes(1)
    expect(mockOnClaimSelectSuccess).toHaveBeenCalledWith(
      'The US should only intervene militarily when directly attacked.',
      'strongly agree',
      'en-US',
    )
  })
})
