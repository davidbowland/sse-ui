import '@testing-library/jest-dom'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { render, screen } from '@testing-library/react'
import CssBaseline from '@mui/material/CssBaseline'
import React from 'react'
import useMediaQuery from '@mui/material/useMediaQuery'

import Disclaimer from '@components/disclaimer'
import { theme } from '@test/__mocks__'
import Themed from './index'

jest.mock('@aws-amplify/analytics')
jest.mock('@mui/material/CssBaseline')
jest.mock('@mui/material/styles', () => ({
  createTheme: jest.fn(),
  ThemeProvider: jest.fn(),
}))
jest.mock('@mui/material/useMediaQuery')
jest.mock('@components/disclaimer')

describe('Themed component', () => {
  const children = <>fnord</>

  beforeAll(() => {
    jest.mocked(CssBaseline).mockReturnValue(<>CssBaseline</>)
    jest.mocked(Disclaimer).mockReturnValue(<>Disclaimer</>)
    jest.mocked(ThemeProvider).mockImplementation(({ children }) => <>{children}</>)
    jest.mocked(createTheme).mockReturnValue(theme)
    jest.mocked(useMediaQuery).mockReturnValue(false)
  })

  test('expect rendering Themed has children in output', async () => {
    render(<Themed>{children}</Themed>)

    expect(await screen.findByText(/fnord/)).toBeInTheDocument()
  })

  test('expect rendering Themed renders CssBaseline', async () => {
    render(<Themed>{children}</Themed>)

    expect(jest.mocked(CssBaseline)).toHaveBeenCalledTimes(1)
  })

  test('expect rendering Themed renders Disclaimer', async () => {
    render(<Themed>{children}</Themed>)

    expect(jest.mocked(Disclaimer)).toHaveBeenCalledTimes(1)
  })

  test('expect rendering Themed uses light theme when requested', () => {
    render(<Themed>{children}</Themed>)

    expect(jest.mocked(createTheme)).toHaveBeenCalledWith({
      palette: {
        background: {
          default: '#ededed',
          paper: '#fff',
        },
        mode: 'light',
      },
    })
    expect(jest.mocked(ThemeProvider)).toHaveBeenCalledWith(expect.objectContaining({ theme }), {})
  })

  test('expect rendering Themed uses dark theme when reqeusted', () => {
    jest.mocked(useMediaQuery).mockReturnValueOnce(true)
    render(<Themed>{children}</Themed>)

    expect(jest.mocked(createTheme)).toHaveBeenCalledWith({
      palette: {
        background: {
          default: '#121212',
          paper: '#121212',
        },
        mode: 'dark',
      },
    })
    expect(jest.mocked(ThemeProvider)).toHaveBeenCalledWith(expect.objectContaining({ theme }), {})
  })
})
