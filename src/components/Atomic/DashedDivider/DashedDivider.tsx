import classNames from 'classnames'

type Props = {
  className?: string
}

export const DashedDivider = ({ className }: Props) => (
  <div
    className={classNames(
      'flex-grow h-0 border-t-0 border-x-0 border-b-1 border-dotted border-light-typo-gray dark:border-dark-typo-gray',
      className,
    )}
  />
)
