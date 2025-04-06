import { Sidebar } from "lucide-react"
import { ComponentProps, createContext, ReactNode, useContext, useEffect, useState } from "react"
import { Breadcrumbs } from "./breadcrumbs"
import { Button } from "./ui/button"
import { useSidebar } from "./ui/sidebar"

type ToolbarPortalContextProps = {
  portalContent: ReactNode
  setPortalContent: (node: ReactNode) => void
}

const ToolbarPortalContext = createContext<ToolbarPortalContextProps>({
  portalContent: null,
  setPortalContent: () => { }
})

/**
 * useToolbar is a custom hook that let's you render a component into the
 * {@link ToolBar} component's portal from any of its children.
 *
 *
 * Make sure you only use it once in your component hierarchy.
 *
 * @param {function(): ReactNode} renderContent
 * @param {unknown[]} deps
 */
export function useToolbar(renderContent: () => ReactNode, deps: unknown[]) {
  const { setPortalContent } = useContext(ToolbarPortalContext)

  useEffect(() => {
    if (typeof window === "undefined") return () => { }

    setPortalContent(renderContent())

    return () => { setPortalContent(null) }
  }, [setPortalContent, typeof window, ...deps])
}

export function ToolBar({ children }: ComponentProps<"div">) {
  const [portalContent, setPortalContent] = useState<ReactNode>(null)
  const { toggleSidebar } = useSidebar()

  return (
    <ToolbarPortalContext.Provider value={{ portalContent, setPortalContent }}>
      <div className="bg-background sticky top-0 z-30 flex gap-2 items-center p-2 border-b">
        <Button
          type="button"
          onClick={toggleSidebar}
          variant={"ghost"}
        >
          <Sidebar />
        </Button>
        <Breadcrumbs />
        <span className="grow content-[' ']" />
        {portalContent}
      </div>

      {children}
    </ToolbarPortalContext.Provider>
  )
}