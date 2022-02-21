import { ElementRef, useRef } from 'react'

import { Box } from 'components/Box'
import { Collapse } from 'components/Collapse'
import { Link } from 'components/Link'
import { SidebarItemProps } from 'components/Sidebar/types'
import { Typography } from 'components/Typography'

type Props = {
  to: string
  label: string
  items?: SidebarItemProps[]
  hideMenu: () => void
}

type LinkItem = {
  to: string
  label: string
  onClick: () => void
}

type CollapseLinkItem = {
  label: string
  onClick: () => void
  children: SidebarItemProps[]
}

const NavLink = ({ to, onClick, label }: LinkItem) => (
  <Link key={label} to={to}>
    <Box px={3} py={3} onClick={onClick}>
      <Typography>{label}</Typography>
    </Box>
  </Link>
)

const CollapseLink = ({ onClick, label, children }: CollapseLinkItem) => {
  const collapseRef = useRef<ElementRef<typeof Collapse>>(null)

  const handleCollapseClick = () => {
    collapseRef.current?.toggle()
    onClick()
  }

  return (
    <Collapse
      ref={collapseRef}
      shadow={false}
      title={<Typography>{label}</Typography>}
    >
      {children.map((childLink) => (
        <NavLink
          key={childLink.label}
          to={childLink.href}
          label={childLink.label}
          onClick={handleCollapseClick}
        />
      ))}
    </Collapse>
  )
}

export const NavMenuItems = ({ items, label, to, hideMenu }: Props) => {
  if (items && items.length > 0) {
    return (
      <CollapseLink
        onClick={hideMenu}
        label={label}
        key={label}
        children={items}
      />
    )
  }

  return <NavLink label={label} to={to} onClick={hideMenu} />
}
