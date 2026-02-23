/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react-hooks/exhaustive-deps */
import { AppRouter } from "./router";
import { QueryClientProvider } from "@tanstack/react-query";

import { withAuthenticationRequired } from "@auth0/auth0-react";
import { queryClient } from "./utils/query-client";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppRouter />
    </QueryClientProvider>
  );
}

export default App 
