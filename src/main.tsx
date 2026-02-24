import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "@/styles/index.css";
import { MoneyMaskProvider } from "@/hooks/use-money-mask";
import { Toaster } from "@/components/ui/toaster";
import { Auth0Provider } from "@auth0/auth0-react";
import { variables } from "@/utils/env";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import store, { persistedStore } from "@/store/store";
import App from "@/index";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistedStore}>
        <BrowserRouter>
          <MoneyMaskProvider>
            <Auth0Provider
              domain={variables().AUTH0_DOMAIN}
              clientId={variables().AUTH0_CLIENTID}
              authorizationParams={{
                redirect_uri: window.location.origin,
                audience: variables().AUTH0_AUDIENCE,
                connection: "a89-customers",
              }}
            >
              <App />
              <Toaster />
            </Auth0Provider>
          </MoneyMaskProvider>
        </BrowserRouter>
      </PersistGate>
    </Provider>
  </React.StrictMode>,
);
