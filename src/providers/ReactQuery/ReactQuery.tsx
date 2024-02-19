import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

interface ReactQueryProps {
  children: React.ReactNode;
}

const ReactQuery = ({ children }: ReactQueryProps): JSX.Element => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

export { ReactQuery };
