import { Box, Link, Typography } from 'components/Atomic';
import { THORSWAP_MULTI_SIG } from 'config/constants';
import { t } from 'services/i18n';
import { useAppSelector } from 'store/store';
import { MultisigCreateTile } from 'views/Multisig/MultisigCreate/MultisigCreateTile';
import { MultisigImportTile } from 'views/Multisig/MultisigImport/MultisigImportTile';
import { MultisigInfo } from 'views/Multisig/MultisigInfo';

const Multisig = () => {
  const hasWallet = useAppSelector((state) => !!state.multisig.address);

  return hasWallet ? (
    <MultisigInfo />
  ) : (
    <Box col>
      <Box className="gap-5">
        <Box alignCenter flex={1} justify="between">
          <Typography className="mb-5 mx-3" variant="h3">
            {t('views.multisig.thorSafeWallet')}
          </Typography>
        </Box>
      </Box>
      <Box col className="gap-3 mb-3 mx-3 lg:w-11/12">
        <Typography color="secondary" fontWeight="semibold" variant="caption">
          {t('views.multisig.thorsafeDescription')}
        </Typography>
        <Typography color="secondary" fontWeight="normal" variant="caption">
          {t('views.multisig.thorsafeSecondDescription')}
          <Link className="text-twitter-blue" to={THORSWAP_MULTI_SIG}>
            {t('common.learnMore')}
          </Link>
        </Typography>
      </Box>

      <Box className="flex-col md:flex-row gap-5">
        <Box className="gap-4 basis-full">
          <MultisigCreateTile />
        </Box>
        <Box className="gap-4 basis-full">
          <MultisigImportTile />
        </Box>
      </Box>
    </Box>
  );
};

export default Multisig;
