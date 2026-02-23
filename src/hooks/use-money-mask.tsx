import * as React from "react"

type MoneyMaskContextType = {
  isMasked: boolean
  toggleMask: () => void
}

const MoneyMaskContext = React.createContext<MoneyMaskContextType | undefined>(undefined)

export function MoneyMaskProvider({ children }: { children: React.ReactNode }) {
  const [isMasked, setIsMasked] = React.useState(false)

  const toggleMask = React.useCallback(() => {
    setIsMasked((prev) => !prev)
  }, [])

  return (
    <MoneyMaskContext.Provider value={{ isMasked, toggleMask }}>
      {children}
    </MoneyMaskContext.Provider>
  )
}

export function useMoneyMask() {
  const context = React.useContext(MoneyMaskContext)
  if (context === undefined) {
    throw new Error("useMoneyMask must be used within a MoneyMaskProvider")
  }
  return context
}
