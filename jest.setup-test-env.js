// Environment variables
process.env.NEXT_PUBLIC_SSE_API_BASE_URL = 'http://localhost'
process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY = 'test-recaptcha-site-key'

window.URL.createObjectURL = jest.fn()
