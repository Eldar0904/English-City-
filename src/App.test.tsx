import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import App from './App'

describe('English City', () => {
  it('renders the first course unit', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Start here' })).toBeInTheDocument()
    expect(screen.getByText('When did you last try something new?')).toBeInTheDocument()
  })
})
