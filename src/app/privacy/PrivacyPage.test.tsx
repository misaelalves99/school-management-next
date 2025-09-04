// src/pages/Privacy/PrivacyPage.test.tsx

import { render, screen } from '@testing-library/react';
import PrivacyPage from './page';

describe('PrivacyPage', () => {
  it('deve renderizar o título da política de privacidade', () => {
    render(<PrivacyPage />);
    expect(screen.getByRole('heading', { name: /privacy policy/i })).toBeInTheDocument();
  });

  it('deve renderizar o texto da política', () => {
    render(<PrivacyPage />);
    expect(
      screen.getByText(/use this page to detail your site's privacy policy\./i)
    ).toBeInTheDocument();
  });

  it('deve renderizar a lista de exemplos', () => {
    render(<PrivacyPage />);
    expect(screen.getByText(/exemplo de item 1/i)).toBeInTheDocument();
    expect(screen.getByText(/exemplo de item 2/i)).toBeInTheDocument();
  });
});
