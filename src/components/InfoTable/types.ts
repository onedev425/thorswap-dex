import { InfoRowConfig, InfoRowSize } from 'components/InfoRow/types'

export type InfoTableRows = InfoRowConfig[]

export type InfoTableProps = {
  items: InfoTableRows
  size?: InfoRowSize
  showBorder?: boolean
}
