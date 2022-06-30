import './Range.css'
import { useRef } from 'react'

import { Amount } from '@thorswap-lib/multichain-sdk'
import classNames from 'classnames'

import { useInputAmount } from 'components/InputAmount/useInputAmount'
import { useTheme } from 'components/Theme/ThemeContext'

type Props = {
  onAmountChange: (e: Amount) => void
  amountValue: Amount
}

const Range = ({ onAmountChange, amountValue }: Props) => {
  const slider = useRef(null)
  const { rawValue, onChange } = useInputAmount({
    amountValue,
    onAmountChange,
  })
  const { isLight } = useTheme()

  return (
    <input
      ref={slider}
      type="range"
      className={classNames('range', { light: isLight, dark: !isLight })}
      step="25"
      onChange={onChange}
      value={rawValue || '0'}
      min="0"
      max="100"
    />
  )
}

export default Range
