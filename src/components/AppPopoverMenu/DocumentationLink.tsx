import { Button, Icon, Link } from 'components/Atomic'

import { t } from 'services/i18n'

export const DocumentationLink = () => {
  return (
    <Link to="https://docs.thorswap.finance/" external={true}>
      <Button
        className="!px-2"
        type="borderless"
        variant="tint"
        startIcon={<Icon name="documentation" />}
        tooltip={t('common.documentation')}
      />
    </Link>
  )
}
