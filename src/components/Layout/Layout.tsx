import { Sidebar } from 'components/Sidebar'

export type LayoutProp = {
  children: React.ReactNode
}

export const Layout = ({ children }: LayoutProp) => {
  return (
    <div className="relative flex w-full mx-auto my-0 max-w-8xl">
      <Sidebar options={[]} />
      {children}
    </div>
  )
}
