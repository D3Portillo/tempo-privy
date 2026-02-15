"use client"

import { PrivyProvider as BasePrivyProvider } from "@privy-io/react-auth"
import { tempo } from "@/lib/chain"

export function PrivyProvider({ children }: { children: React.ReactNode }) {
  return (
    <BasePrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID!}
      config={{
        supportedChains: [tempo],
        embeddedWallets: {
          showWalletUIs: false,
          ethereum: {
            createOnLogin: "all-users",
          },
        },
      }}
    >
      {children}
    </BasePrivyProvider>
  )
}
