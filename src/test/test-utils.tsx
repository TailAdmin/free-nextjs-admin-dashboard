import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';

// Custom render function that can include providers
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      {/* Add providers here when implemented (Theme, Auth, etc.) */}
      {children}
    </>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };
