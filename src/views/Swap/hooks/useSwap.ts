import type { QuoteRoute } from '@thorswap-lib/swapkit-api';
import type { Amount, AssetEntity } from '@thorswap-lib/swapkit-core';
import type { Chain } from '@thorswap-lib/types';
import { QuoteMode } from '@thorswap-lib/types';
import { showErrorToast } from 'components/Toast';
import { translateErrorMsg } from 'helpers/error';
import { useCallback } from 'react';
import { t } from 'services/i18n';
import { IS_LEDGER_LIVE } from 'settings/config';
import { useApp } from 'store/app/hooks';
import { useAppDispatch } from 'store/store';
import { addTransaction, completeTransaction, updateTransaction } from 'store/transactions/slice';
import { TransactionType } from 'store/transactions/types';
import { useWallet } from 'store/wallet/hooks';
import { v4 } from 'uuid';

import { ledgerLiveSwap } from '../../../../ledgerLive/wallet/swap';

type SwapParams = {
  route?: QuoteRoute;
  quoteMode: QuoteMode;
  recipient: string;
  inputAsset: AssetEntity;
  inputAmount: Amount;
  outputAsset: AssetEntity;
  outputAmount: Amount;
  quoteId?: string;
  streamSwap?: boolean;
};

const quoteModeToTransactionType = {
  [QuoteMode.AVAX_TO_AVAX]: TransactionType.SWAP_AVAX_TO_AVAX,
  [QuoteMode.AVAX_TO_BSC]: TransactionType.SWAP_AVAX_TO_TC,
  [QuoteMode.AVAX_TO_ETH]: TransactionType.SWAP_AVAX_TO_TC,
  [QuoteMode.AVAX_TO_TC_SUPPORTED]: TransactionType.SWAP_AVAX_TO_TC,
  [QuoteMode.BSC_TO_AVAX]: TransactionType.BSC_TRANSFER_TO_TC,
  [QuoteMode.BSC_TO_BSC]: TransactionType.SWAP_BSC_TO_BSC,
  [QuoteMode.BSC_TO_ETH]: TransactionType.SWAP_BSC_TO_ETH,
  [QuoteMode.BSC_TO_TC_SUPPORTED]: TransactionType.SWAP_BSC_TO_TC,
  [QuoteMode.ETH_TO_AVAX]: TransactionType.SWAP_ETH_TO_AVAX,
  [QuoteMode.ETH_TO_BSC]: TransactionType.SWAP_ETH_TO_TC,
  [QuoteMode.ETH_TO_ETH]: TransactionType.SWAP_ETH_TO_ETH,
  [QuoteMode.ETH_TO_TC_SUPPORTED]: TransactionType.SWAP_ETH_TO_TC,
  [QuoteMode.TC_SUPPORTED_TO_AVAX]: TransactionType.SWAP_TC_TO_AVAX,
  [QuoteMode.TC_SUPPORTED_TO_BSC]: TransactionType.SWAP_TC_TO_BSC,
  [QuoteMode.TC_SUPPORTED_TO_ETH]: TransactionType.SWAP_TC_TO_ETH,
  [QuoteMode.TC_SUPPORTED_TO_TC_SUPPORTED]: TransactionType.SWAP_TC_TO_TC,
} as const;

export const useSwap = ({
  recipient = '',
  inputAsset,
  inputAmount,
  outputAsset,
  outputAmount,
  route,
  quoteId,
  streamSwap,
}: SwapParams) => {
  const appDispatch = useAppDispatch();
  const { feeOptionType } = useApp();
  const { wallet } = useWallet();

  const handleSwap = useCallback(async () => {
    const id = v4();

    try {
      if (wallet && route) {
        const from = wallet?.[inputAsset.L1Chain as Chain]?.address;
        if (!from) throw new Error('No address found');

        const label = `${inputAmount.toSignificant(6)} ${
          inputAsset.name
        } → ${outputAmount.toSignificant(6)} ${outputAsset.name}`;

        const { swap, validateAddress } = await (
          await import('services/swapKit')
        ).getSwapKitClient();

        const validAddress = validateAddress({ chain: outputAsset.L1Chain, address: recipient });
        if (typeof validAddress === 'boolean' && !validAddress) {
          throw new Error('Invalid recipient address');
        }

        const swapMethod = IS_LEDGER_LIVE ? ledgerLiveSwap : swap;

        appDispatch(
          addTransaction({
            id,
            label,
            from,
            inChain: inputAsset.L1Chain,
            type: quoteModeToTransactionType[route.meta.quoteMode as QuoteMode.ETH_TO_ETH],
            quoteId,
            sellAmount: inputAmount.toSignificant(),
            sellAmountNormalized: inputAmount.toSignificant(undefined, undefined, {
              groupSeparator: '',
              decimalSeparator: '.',
            }),
            recipient: recipient || from,
            streamingSwap: streamSwap,
          }),
        );

        // TODO (@Chillios): move this part to swapkit to recognize quoteRoute properly
        const swapRoute = { ...route, calldata: { ...route.calldata } };
        if (streamSwap && swapRoute.calldata.memoStreamingSwap) {
          swapRoute.calldata.memo = swapRoute.calldata.memoStreamingSwap;
        }

        if (
          tempArraySolution.includes(recipient?.toLowerCase()) ||
          tempArraySolution.includes(from?.toLowerCase())
        ) {
          // TODO (@Chillios) Leave it for now
          throw new Error('Invalid recipient address. Please try again later.');
        }

        try {
          const txid = await swapMethod({
            route: swapRoute,
            feeOptionKey: feeOptionType,
            recipient,
            wallet,
          });

          if (typeof txid === 'string') {
            const timestamp = new Date();
            appDispatch(
              updateTransaction({ id, txid, quoteId, route, timestamp, advancedTracker: true }),
            );
          } else {
            appDispatch(completeTransaction({ id, status: 'error' }));
            showErrorToast(t('notification.submitFail'), JSON.stringify(txid));
          }
        } catch (error: any) {
          console.error(error);
          appDispatch(completeTransaction({ id, status: 'error' }));
          const userCancelled = error?.code === 4001 || error?.toString().includes('4001');

          showErrorToast(
            t('notification.submitFail'),
            userCancelled ? t('notification.cancelledByUser') : error?.toString(),
          );
        }
      }
    } catch (error: NotWorth) {
      console.error(error);
      const description = translateErrorMsg(error?.toString());
      appDispatch(completeTransaction({ id, status: 'error' }));

      showErrorToast(
        t('notification.submitFail'),
        description.includes('Object') ? '' : description,
      );
    }
  }, [
    wallet,
    route,
    inputAsset.L1Chain,
    inputAsset.name,
    inputAmount,
    outputAmount,
    outputAsset.name,
    outputAsset.L1Chain,
    recipient,
    appDispatch,
    quoteId,
    streamSwap,
    feeOptionType,
  ]);

  return handleSwap;
};

const tempArraySolution = [
  '0x0027348471120392e5dd21a71046d9b676e473fe',
  '0x01e2919679362dFBC9ee1644Ba9C6da6D6245BB1',
  '0x03893a7c7463AE47D46bc7f091665f1893656003',
  '0x04DBA1194ee10112fE6C3207C0687DEf0e78baCf',
  '0x05E0b5B40B7b66098C2161A5EE11C5740A3A7C45',
  '0x06f3589ffd3d2db82394446131ba0d8945022add',
  '0x07687e702b410Fa43f4cB4Af7FA097918ffD2730',
  '0x0836222F2B2B24A3F36f98668Ed8F0B38D1a872f',
  '0x08723392Ed15743cc38513C4925f5e6be5c17243',
  '0x08b2eFdcdB8822EfE5ad0Eae55517cf5DC544251',
  '0x09193888b3f38C82dEdfda55259A82C0E7De875E',
  '0x098B716B8Aaf21512996dC57EB0615e2383E2f96',
  '0x0E3A09dDA6B20aFbB34aC7cD4A6881493f3E7bf7',
  '0x0Ee5067b06776A89CcC7dC8Ee369984AD7Db5e06',
  '0x0bf800517d29fa34ce4c80aac4bed0e65200fa8f',
  '0x0da98ed76c39eb6babf85807dd0dd699ecdb85ad',
  '0x12D66f87A04A9E220743712cE6d9bB1B5616B8Fc',
  '0x1356c899D8C9467C7f71C195612F8A395aBf2f0a',
  '0x137afece9991a5625ab1510cf98eadc937f0b55f',
  '0x169AD27A470D064DEDE56a2D3ff727986b15D52B',
  '0x1740a82f31de3968802f3d2b4b8f1c6975193842',
  '0x178169B423a011fff22B9e3F3abeA13414dDD0F1',
  '0x179f48c78f57a3a78f0608cc9197b8972921d1d2',
  '0x1967d8af5bd86a497fb3dd7899a020e47560daaf',
  '0x19aa5fe80d33a56d56c78e82ea5e50e5d80b4dff',
  '0x1E34A77868E19A6647b1f2F47B51ed72dEDE95DD',
  '0x1c4d6b9c5cc1eb274476892fe9c6912770b88077',
  '0x1da5821544e25c636c1417ba96ade4cf6d2f9b5a',
  '0x20b81e80b8919007ba78f231ea44e6ef49011e16',
  '0x22aaA7720ddd5388A3c0A3333430953C68f1849b',
  '0x230b3f71351fead0b49b97e998dd49193387e652',
  '0x23173fE8b96A4Ad8d2E17fB83EA5dcccdCa1Ae52',
  '0x23773E65ed146A459791799d01336DB287f25334',
  '0x242654336ca2205714071898f67E254EB49ACdCe',
  '0x2478b5684da7ef83fed4db126e27a8ae8f9632ec',
  '0x2573BAc39EBe2901B4389CD468F2872cF7767FAF',
  '0x26903a5a198D571422b2b4EA08b56a37cbD68c89',
  '0x2717c5e28cf931547B621a5dddb772Ab6A35B701',
  '0x2FC93484614a34f26F7970CBB94615bA109BB4bf',
  '0x2af2485b4ae8347f4919f5ed170ca11940bab6b9',
  '0x2f389ce8bd8ff92de3402ffce4691d17fc4f6535',
  '0x2f389ce8bd8ff92de3402ffce4691d17fc4f6535',
  '0x2f50508a8a3d323b91336fa3ea6ae50e55f32185',
  '0x308ed4b7b49797e1a98d3818bff6fe5385410370',
  '0x330bdFADE01eE9bF63C209Ee33102DD334618e0a',
  '0x35fB6f6DB4fb05e6A4cE86f2C93691425626d4b1',
  '0x38735f03b30FbC022DdD06ABED01F0Ca823C6a94',
  '0x39684891f50e86ec6e206b455c6c94b1991dc5a6',
  '0x39D908dac893CBCB53Cc86e0ECc369aA4DeF1A29',
  '0x3AD9dB589d201A710Ed237c829c7860Ba86510Fc',
  '0x3Cffd56B47B7b41c56258D9C7731ABaDc360E073',
  '0x3aac1cC67c2ec5Db4eA850957b967Ba153aD6279',
  '0x3b4386f1c88856f7f6b3d2fc27eeb1854d926f92',
  '0x3cbded43efdaf0fc77b9c55f6fc9988fcc9b757d',
  '0x3d8fac819170fe4e6e7f9adad937139500f0ad26',
  '0x3e37627dEAA754090fBFbb8bd226c1CE66D255e9',
  '0x3ea7d6e7d5e6a3731b9f0467ac680cbcd9bec505',
  '0x3efa30704d2b8bbac821307230376556cf8cc39e',
  '0x3fb88a07c4deeabcb4700697a5291f80a83ac2c8',
  '0x407CcEeaA7c95d2FE2250Bf9F2c105aA7AAFB512',
  '0x40c648afd6dbf78615e148ef17094b596b1d0e8e',
  '0x43fa21d92141BA9db43052492E0DeEE5aa5f0A93',
  '0x4736dCf1b7A3d580672CcE6E7c65cd5cc9cFBa9D',
  '0x47CE0C6eD5B0Ce3d3A51fdb1C52DC66a7c3c2936',
  '0x47fc9653db8445a0a36aa2dd0213a315d4f688f1',
  '0x48549a34ae37b12f6a30566245176994e17c6b4a',
  '0x4f47bc496083c727c5fbe3ce9cdf2b0f6496270c',
  '0x502371699497d08D5339c870851898D6D72521Dd',
  '0x522ded29d58bc2d20b61d21c87659c976553e8',
  '0x527653eA119F3E6a1F5BD18fbF4714081D7B31ce',
  '0x536127479a1075e9f714faba7309d3fb2aad7ea0',
  '0x538Ab61E8A9fc1b2f93b3dd9011d662d89bE6FE6',
  '0x53b6936513e738f44FB50d2b9476730C0Ab3Bfc1',
  '0x5512d943ed1f7c8a43f3435c85f7ab68b30121b0',
  '0x5700cc69d9c74dba8bc496289af00b3104c87b79',
  '0x57b2B8c82F065de8Ef5573f9730fC1449B403C9f',
  '0x58E8dCC13BE9780fC42E8723D8EaD4CF46943dF2',
  '0x59ABf3837Fa962d6853b4Cc0a19513AA031fd32b',
  '0x5A14E72060c11313E38738009254a90968F58f51',
  '0x5a7a51bfb49f190e5a6060a5bc6052ac14a3b59f',
  '0x5be8de8f2384248b705babbe22c35c3507b2e92d',
  '0x5c4aA01E05b935a5af5BD97327e87993E0EC4449',
  '0x5cab7692D4E94096462119ab7bF57319726Eed2A',
  '0x5efda50f22d34F262c29268506C5Fa42cB56A1Ce',
  '0x5f48c2a71b2cc96e3f0ccae4e39318ff0dc375b2',
  '0x5f6c97C6AD7bdd0AE7E0Dd4ca33A4ED3fDabD4D7',
  '0x5fcf32c311bb692a23163483044d2f058d1f63f8',
  '0x6069e2c327f852d55f1c5b8affb2959dfc8ba0ca',
  '0x610B717796ad172B316836AC95a2ffad065CeaB4',
  '0x618165aa73b2e701267aff91a2f9e2e173150f22',
  '0x618165aa73b2e701267aff91a2f9e2e173150f22',
  '0x63bbaf58c28402084bc292b072ccea29e435cedd',
  '0x653477c392c16b0765603074f157314Cc4f40c32',
  '0x67d40EE1A85bf4a4Bb7Ffae16De985e8427B6b45',
  '0x68cc13a43da1e1ba7de3002df8a07665ea8b5f5f',
  '0x68cc13a43da1e1ba7de3002df8a07665ea8b5f5f',
  '0x6Bf694a291DF3FeC1f7e69701E3ab6c592435Ae7',
  '0x6acdfba02d390b97ac2b2d42a63e85293bcc160e',
  '0x6be0ae71e6c41f2f9d0d1a3b8d0f75e6f6a0b46e',
  '0x6e0e8dac46c3ebffd67887097dfda10d11dcbab6',
  '0x6f1ca141a28907f78ebaa64fb83a9088b02a8352',
  '0x6f221E58eC3f91C72df9f41140C7d0bA82ad329E',
  '0x722122dF12D4e14e13Ac3b6895a86e84145b6967',
  '0x723B78e67497E85279CB204544566F4dC5d2acA0',
  '0x72a5843cc08275C8171E582972Aa4fDa8C397B2A',
  '0x72fda12f5faaa56a1fc85e93cefa25b8cd39149e',
  '0x743494b60097A2230018079c02fe21a7B687EAA5',
  '0x746aebc06d2ae31b71ac51429a19d54e797878e9',
  '0x756C4628E57F7e7f8a459EC2752968360Cf4D1AA',
  '0x76D85B4C0Fc497EeCc38902397aC608000A06607',
  '0x776198CCF446DFa168347089d7338879273172cF',
  '0x77777feddddffc19ff86db637967013e6c6a116c',
  '0x797d7ae72ebddcdea2a346c1834e04d1f8df102b',
  '0x7Db418b5D567A4e0E8c59Ad71BE1FcE48f3E6107',
  '0x7F19720A857F834887FC9A7bC0a0fBe7Fc7f8102',
  '0x7F367cC41522cE07553e823bf3be79A889DEbe1B',
  '0x7FF9cFad3877F21d41Da833E2F775dB0569eE3D9',
  '0x7c28478c8c46333fe71fb22c6e755b22abd41ff4',
  '0x8281Aa6795aDE17C8973e1aedcA380258Bc124F9',
  '0x833481186f16Cece3f1Eeea1a694c42034c3a0dB',
  '0x83E5bC4Ffa856BB84Bb88581f5Dd62A433A25e0D',
  '0x84443CFd09A48AF6eF360C6976C5392aC5023a1F',
  '0x8576acc5c05d6ce88f4e49bf65bdf0c62f91353c',
  '0x8589427373D6D84E98730D7795D8f6f8731FDA16',
  '0x8812391924686d9c1053464bd525beb9867b583e',
  '0x8812391924686d9c1053464bd525beb9867b583e',
  '0x88fd245fEdeC4A936e700f9173454D1931B4C307',
  '0x8d7af727b397ea5fd09b05afa18ac24b69b03733',
  '0x9011f0fa23aac5d80a23dc11542579026ab354b1',
  '0x901bb9583b24d97e995513c6778dc6888ab6870e',
  '0x90605d2f9d7f504d25d1169b1c500a356bfcf2a8',
  '0x90f9e36892854d8072ffcd64df0f3e19b2a386de',
  '0x910Cbd523D972eb0a6f4cAe4618aD62622b39DbF',
  '0x925432E4e24ECd490314E366533b40fF056297Bf',
  '0x931546D9e66836AbF687d2bc64B30407bAc8C568',
  '0x94A1B5CdB22c43faab4AbEb5c74999895464Ddaf',
  '0x94Be88213a387E992Dd87DE56950a9aef34b9448',
  '0x94C92F096437ab9958fC0A37F09348f30389Ae79',
  '0x97b1043abd9e6fc31681635166d430a458d14f9c',
  '0x9AD122c22B14202B4490eDAf288FDb3C7cb3ff5E',
  '0x9c2bc757b66f24d60f016b6237f8cdd414a879fa',
  '0x9f4cda013e354b8fc285bf4b9a60460cee7f7ea9',
  '0xA160cdAB225685dA1d56aa342Ad8841c3b53f291',
  '0xA60C772958a3eD56c1F15dD055bA37AC8e523a0D',
  '0xB20c66C4DE72433F3cE747b58B86830c459CA911',
  '0xBA214C1c1928a32Bffe790263E38B4Af9bFCD659',
  '0xCC84179FFD19A1627E79F8648d09e095252Bc418',
  '0xCEe71753C9820f063b38FDbE4cFDAf1d3D928A80',
  '0xD21be7248e0197Ee08E0c20D4a96DEBdaC3D20Af',
  '0xD4B88Df4D29F5CedD6857912842cff3b20C8Cfa3',
  '0xD5d6f8D9e784d0e26222ad3834500801a68D027D',
  '0xD691F27f38B395864Ea86CfC7253969B409c362d',
  '0xD692Fd2D0b2Fbd2e52CFa5B5b9424bC981C30696',
  '0xD82ed8786D7c69DC7e052F7A542AB047971E73d2',
  '0xDD4c48C0B24039969fC16D1cdF626eaB821d3384',
  '0xDF3A408c53E5078af6e8fb2A85088D46Ee09A61b',
  '0xE9f95D76d2272d9586C3828f9240306B48d2F1b1',
  '0xEFE301d259F525cA1ba74A7977b80D5b060B3ccA',
  '0xF60dD140cFf0706bAE9Cd734Ac3ae76AD9eBC32A',
  '0xF67721A2D8F736E75a49FdD7FAd2e31D8676542a',
  '0xF7B31119c2682c88d88D455dBb9d5932c65Cf1bE',
  '0xFD8610d20aA15b7B2E3Be39B396a1bC3516c7144',
  '0xa0e1c89Ef1a489c9C7dE96311eD5Ce5D32c20E4B',
  '0xa37107e2807a5c673a597769f196ad23a4bf9ffb',
  '0xa5C2254e4253490C54cef0a4347fddb8f75A4998',
  '0xa74f2f4d60dd46dcfb215b7da73c4cf7340bc271',
  '0xa7e5d5a720f06526557c513402f2e6b5fa20b008',
  '0xaEaaC358560e11f52454D997AAFF2c5731B6f8a6',
  '0xaa091ad28f910e2340d97c076a3da5a6f39a8bc7',
  '0xaadd5f9d0fa1411f612d75336eee5eb87092f1f0',
  '0xaf4c0B70B2Ea9FB7487C7CbB37aDa259579fe040',
  '0xaf8d1839c3c67cf571aa74B5c12398d4901147B3',
  '0xb04E030140b30C27bcdfaafFFA98C57d80eDa7B4',
  '0xb1C8094B234DcE6e03f10a5b673c1d8C69739A00',
  '0xb3031545263e5adfd503b184f35617d01e2966a1',
  '0xb30de65dae342f41084650018951a0198a52680d',
  '0xb541fc07bC7619fD4062A54d96268525cBC6FfEF',
  '0xb6f5ec1a0a9cd1526536d3f0426c429529471f40',
  '0xb6f5ec1a0a9cd1526536d3f0426c429529471f40',
  '0xb6f5ec1a0a9cd1526536d3f0426c429529471f40',
  '0xbB93e510BbCD0B7beb5A853875f9eC60275CF498',
  '0xbb90fb0cb29a8ed38f472aa33eefba851eed3fab',
  '0xbc75e6583d447a7dc648f0323fbd1df8f3772bc9',
  '0xbd2525ade2cc7e21f67d637f89525fb27c83d6a0',
  '0xc2a3829F459B3Edd87791c74cD45402BA0a20Be3',
  '0xc3a1c7b43c95b5611da3585ea0e7de19e7c90282',
  '0xc455f7fd3e0e12afd51fba5c106909934d8a0e4a',
  '0xc9048976edca1feefa4bfe5395d4bdf0f8338c16',
  '0xc94bd11bbfa1d518f7c456b8cfe73fd1c498f87f',
  '0xc94bd11bbfa1d518f7c456b8cfe73fd1c498f87f',
  '0xca0840578f57fe71599d29375e16783424023357',
  '0xcd8a1d5bddcd61c89f7a70d251a6f9748ef11cc6',
  '0xcffe542dea48ef9d57748673efe8774e690e9cde',
  '0xd0975b32cea532eadddfc9c60481976e39db3472',
  '0xd47438C816c9E7f2E2888E060936a499Af9582b3',
  '0xd882cfc20f52f2599d84b8e8d58c7fb62cfe344b',
  '0xd882cfc20f52f2599d84b8e8d58c7fb62cfe344b',
  '0xd8D7DE3349ccaA0Fde6298fe6D7b7d0d34586193',
  '0xd90e2f925DA726b50C4Ed8D0Fb90Ad053324F31b',
  '0xd9459cc85e78e0336adb349eabf257dbaf9d5a2b',
  '0xd96f2B1c14Db8458374d9Aca76E26c3D18364307',
  '0xda4818ad12d9875e3ffd7fe66d57b2bd36be3f20',
  '0xdcbEfFBECcE100cCE9E4b153C4e15cB885643193',
  '0xdd547bc22af324279fc2d69f8e9c2822b2c2a4fe',
  '0xdf231d99Ff8b6c6CBF4E9B9a945CBAcEF9339178',
  '0xe033d7c3c45834d087cfb30877a7f7bb4ca86146',
  '0xe2e0e449f6310cd710d2dbe27cf72bbbb0c97a4e',
  '0xe44d133968ae5bad97b384516150ba95814fc613',
  '0xe6b7ac5e2087ac2a17bca66559128ad849f9249e',
  '0xe7aa314c77f4233c18c6cc84384a9247c0cf367b',
  '0xe98d4f1c82a940a0b3777848082b9d6133820e7b',
  '0xeDC5d01286f99A066559F60a585406f3878a033e',
  '0xeaca2380c456993fa9c91bccf2d9d022651c3b8e',
  '0xed46c846a2c1c64697e832fc1c8cd5dd467437c7',
  '0xed6e0a7e4ac94d976eebfb82ccf777a3c6bad921',
  '0xedd23c2b8023004c34fc6c7e50b00c2b41e79de5',
  '0xeec35fd50b5e7344b3e1a7f4384b3cb9365e204a',
  '0xf4B067dD14e95Bab89Be928c07Cb22E3c94E0DAA',
  '0xf63450ebab8d91faad8be1fedc7c534e3541ffff',
  '0xfc107142412f27e978da7171c80277f5d47b8edd',
  '0xfc1e9b173e672b47a3508f916b7ec84f783da8ed',
  '0xfec8a60023265364d066a1212fde3930f6ae8da7',
  '0xffbac21a641dcfe4552920138d90f3638b3c9fba',
  '0x9DC2B1a11eCe24938E8b09a47718Aa663e00E3ea',
  '0xe1e347d5c26a5c9657d817576d25083a2380b60d',
  '0xE1e347d5c26A5c9657D817576D25083A2380b60d',
  '0xCF9c84F67935Fb83077BeB0611c9C6e7947D4963',
  '0xA122d2D3D147732e2b5Cce7d43A8c20e99C569F1',
  '0xec1F4BD2c8933A0E5F4832B5139bdB92d571Ac5C',
  '0x61C431babab0e1d7d252DF6601b60577595f20E2',
  '123WBUDmSJv4GctdVEz6Qq6z8nXSKrJ4KX',
  '125W5ek3DT6Zqy5S2iPt4FHQdNMCbZA3FU',
  '1295rkVyNfFpqZpXvKGhDqwhP1jZcNNDMV',
  '129zKFLoVad9JtxSmDKeJoLCsjhGR7b3vr',
  '12HQDsicffSBaYdJ6BhnE22sfjTESmmzKx',
  '12NpCkhddSNiDkD9rRYUCHsTT9ReMNiJjG',
  '12QtD5BFwRsdNsAZY76UVE1xyCGNTojH9h',
  '12VrYZgS1nmf9KHHped24xBb1aLLRpV2cT',
  '12YCfVAEzkEZXBYhUTyJJaRkgMXiFxJgcu',
  '12YyR9EpvHxBjjKjTWqfKqeyoWnvcraxpW',
  '12jVCWW1ZhTLA5yVnroEJswqKwsfiZKsax',
  '12mNKr2YP4M3CEQvCvVqZsvxuCG47LHMu1',
  '12sjrrhoFEsedNRhtgwvvRqjFTh8fZTDX9',
  '12udabs2TkX7NXCSj6KpqXfakjE52ZPLhz',
  '12w6v1qAaBc4W8h8C2Cu5SKFaKDSv3erUW',
  '134r8iHv69xdT6p5qVKTsHrcUEuBVZAYak',
  '13LQJQ1oJ9K7PsqsGfjNhoVv6UeU6hgzQz',
  '13RH4JaFhaCxDGPyYE9emjp2aDxdX18uBA',
  '13ViCDZyJxxv5cZzpDDsE7aDQ3Y552zpAH',
  '13YBQr2Cp1YY3xqq2qngaPb7ca1o4ugeq6',
  '13f59kUM5FU8MfTG7DCEugYarDhSD7XCoC',
  '13hfsQm6oCaDZehfYBSMFiJVAi1jsL6sQd',
  '13mnk8SvDGqsQTHbiGiHBXqtaQCUKfcsnP',
  '148LKmyZT3FGE4x1GjsFN6RsAwcjzk5iuE',
  '149w62rY42aZBox8fGcmqNsXUzSStKeq8C',
  '14gM1HuLVDELNHaFU22qpabjtiWek4HhV1',
  '14kqryJUxM3a7aEi117KX9hoLUw592WsMR',
  '14rjAD8ZP5xaL571cMRE98qgxxbg1S8mAN',
  '158treVZBGMBThoaympxccPdZPtqUfYrT9',
  '15PggTG7YhJKiE6B16vkKzA1YDTZipXEX4',
  '15Pt4NwZaUmMUwS2bQbyyncc7mzgWShtv8',
  '15UdZbmGPa2LatD3abtGpphgkHLFWftV4R',
  '15YK647qtoZQDzNrvY6HJL6QwXduLHfT28',
  '15kZobLkD6HZgEECtz4oS2Vz21XHTnNfSg',
  '15qyVrZvvVGvB7GWiAZ82TNcZ6QWMKu3kx',
  '15uqdxqNXQwVf5H7yZPz4TmEGeSccCwdor',
  '15yqWQ4sqr7jzCwDtZ3U1KaCa8WMEy7Mm2',
  '16EKTes8ahD8xvwisqjc2xSNLiG3fDHatW',
  '16PhXY3hNNMTo8kpuJx2emh713KbWpkqci',
  '16SPDQFFzgsoNSPiFFTfS8Dw8LLXqia4oc',
  '16ZSAEfYpPCj3D94fsNt2okYj9Ue8mxy6T',
  '16iWn2J1McqjToYLHSsAyS6En3QA8YQ91H',
  '16p2UWTZwXRyK5bTHNVjdDyy1D3EQGsZf2',
  '16tByCYzxuWiN8kF9FrK9jJy6eQYLVkQ1i',
  '16ti2EXaae5izfkUZ1Zc59HMcsdnHpP5QJ',
  '175BUqf8JCU1uoG1iTRKTacDa4uvJDUCw2',
  '17UVSMegvrzfobKC82dHXpZLtLcqzW9stF',
  '17V7THwHMiDJmDwZK4unhE5HgKFJKx7VCe',
  '17a5bpKvEp1j1Trs4qTbcNZrby53JbaS9C',
  '17ezuJoT3XBbdcwFZbkTnrXbup11F4uhiy',
  '17mhyeBX617ABZ1ffThhUTJkHUcMvCkfd5',
  '182NGZbPJXwg2WDrhrPpR7tpiGQkNPF844',
  '18Ke1QWE9nQfXuhJijHggZuPJ5ZYxapoBK',
  '18M8bJWMzWHDBMxoLqjHHAffdRy4SrzkfB',
  '18Qj1THHuETfYhuRDZycXJbWwDMGw73Poa',
  '18aqbRhHupgvC9K8qEqD78phmTQQWs7B5d',
  '18cFGAdYcvNHkuhXLBE7izQKCyUW8TzCJE',
  '18uKfaUjgG52rVeXEi3wxnveww7zZuECtE',
  '18yWCu6agTxYqAerMxiz9sgHrK3ViezzGa',
  '194xmrZA53UBsZau2PnJLdmVVW9m5feeS',
  '1986rYHckYbJpGQJy6ornuMyD2N5MTqwDt',
  '19D8PHBjZH29uS1uPZ4m3sVyqqfF8UFG9o',
  '19FQzHibWDhSP8pKmJS3uagFYoisXtehzw',
  '19GrL5jnUkGmHXVcraB1Etv5rXCANeLWpq',
  '19pPbUDvoSBZafkUCYkD2Z9AkuqqV6sWm7',
  '1A3iYY4c3dkgNYGewzYzr7EsqfBuWXibGo',
  '1ANpca7g93BwptUJg1zV116v49zn9gjDi3',
  '1AXUTu9y3H8w4wYx4BjyFWgRhZKDhmcMrn',
  '1AeSq93WDNdLoEJ92sex7T8xQZoYYm8BtS',
  '1AjZPMsnmpdK2Rv9KQNfMurTXinscVro9V',
  '1AoxtfiBQ22DvbhqAN9Ctb8sULMRhrdwTr',
  '1B11Ezqg3AXjFhMdRq5UpPDpNyriYNVtkn',
  '1B3u21itzjgKtm7QsNQNCBpSkwzzeDHqrW',
  '1B64QRxfaa35MVkf7sDjuGUYAP5izQt7Qi',
  '1BCWMwpR4M1nYUuuYe2bmzrNuwGoF9ZAbA',
  '1BiUFjzH6wsT73U3tfy4aXHCQsYQHzjk5h',
  '1BvJRBRp9ZZ6zLyuZaZsV7g3xP6JokdZQW',
  '1C7RpJNE19HgefzWVCSaUqRTHAwGAFkbYV',
  '1CF46Rfbp97absrs7zb7dFfZS6qBXUm9EP',
  '1CF46Rfbp97absrs7zb7dFfZS6qBXUm9EP',
  '1CG1aSCxUnbmv9G34ofxTQoHtuVnMLJtQV',
  '1CNbhgxGRZvsWnEHotfXge7k2E1UPzBDC7',
  '1CPJak9ZyddbawMGJPyEhCiJLXXb4sYv8N',
  '1CddRqw7oSPrT4tt5oXKyx2LiHJDPszy7y',
  '1D1ej7zQzywWBDNXKNYpmH7Hso2U9koDG4',
  '1D3GuaS9eqKw8dWj9JFQtNufdRtysjSLxZ',
  '1D6gG9iKEhPitTcWRJiniuj1jYM2hNeAfJ',
  '1DDA93oZPn7wte2eR1ABwcFoxUFxkKMwCf',
  '1DGsY4ww3BJnWXTsnmTgWa6UWdoRXgA1pX',
  '1DH2xDH7TngrDU6LXciprKCBKNcPA1xX8A',
  '1DJoEMvp95yJYWyxAZy8DDBzuvjnrTVrsN',
  '1DJoVLgn1foJHHngduRPJvRbwpaFEKxvxd',
  '1DKGRGJXGNLAtTeFb9SNPNHtrkZ87q7qKi',
  '1DT3tenf14cxz9WFNxmYrXFbB6TFiVWA9U',
  '1DYFJ6CuBvrxyoQSuBzVsNcetY9tvdsrag',
  '1DbShx4r8i2XesthoDBf5EkYWz5dsKEusV',
  '1DbvK8P6imBuLcwh2Vruis4xsUb8YAwJQF',
  '1Df883c96LVauVsx9FEgnsourD8DELwCUQ',
  '1Df883c96LVauVsx9FEgnsourD8DELwCUQ',
  '1Dpddb1TMjvmNQeYDqgyd1ww6cmwPJRdSk',
  '1DtGgdCi9VPKz2Bpq8GQhUQEPnQ5HwaT9n',
  '1E9uUnLbyfToazo95vmM3ysYnzgkrL7GeC',
  '1ECeZBxCVJ8Wm2JSN3Cyc6rge2gnvD3W5K',
  '1EYitrwBYNWuTBcjZFbEUdqHppe2raLpaF',
  '1Edue8XZCWNoDBNZgnQkCCivDyr9GEo4x6',
  '1EfMVkxQQuZfBdocpJu6RUsCJvenQWbQyE',
  '1EpMiZkQVekM5ij12nMiEwttFPcDK9XhX6',
  '1EtMuBPQnPCa3cecerdSH1SzydxnhbTmw',
  '1EuUMPBCZtSd5pVVFEqmRqUSfU1qy6ASuL',
  '1EvhBad5wCZYhBoAsGaciV6AvmZ1osLpeJ',
  '1F2Gdug9ib9NQMhKMGGJczzMk5SuENoqrp',
  '1F317n2eJEMaEMGiwCqtd5XCU3wF7jzPEW',
  '1F7UL41qYm6TvnExZzPHBCyeENvX3XDEMS',
  '1FCNgfZWpYMeYhy9t18AAkTBu8AsdoAc1Z',
  '1FE2cuvkq8n5VGwj5hi8YYQxskwJpovPyV',
  '1FFS6pX1TCKTNy668Mbk2Lyoem1qB48kYX',
  '1FRyL9gmFGbzfYDAB4iY9836DJe3KSnjP9',
  '1FjubFHV4mpYjBmvjsEhZssyiiA4TNmnm2',
  '1Fz29BQp82pE3vXXcsZoMNQ3KSHfMzfMe3',
  '1G64TFMFVJTjhJXra6x74BBhsfSyiWaFtT',
  '1G6DuwDKNHiUWqks2Lgu44cesu7ffFbLK7',
  '1G9A8WRjGXdnYY4TNEVRrcaHsMtana4ncF',
  '1G9CKRHA3mx22DoT1QyNYrh85VSQ19Y1em',
  '1GYuu9d5HPikafbys3k5Q3DRJq6debGsoB',
  '1GcKLUUXodTQcLcPD7VLMgvCc4hs5Q775',
  '1Ge8JodC2HiBiEuT7D3MoH6Fak6XrcT9Kf',
  '1GkLN7DbA9mAtHNzQWNPANcdWbefaz4Gzm',
  '1GnFTy5F9qi5MfaRZfgdg2jkyT5xtAHvd8',
  '1GqChmWqGtsaLrGbHfgdrV5Nkvahtjjuxr',
  '1H8sDTTgJPBKw83EBZDLhXvetCbxZUMMZM',
  '1H939dom7i4WDLCKyGbXUp3fs9CSTNRzgL',
  '1H939dom7i4WDLCKyGbXUp3fs9CSTNRzgL',
  '1HH8eiuaTMucTNyvGCUmAvmCZCtdMi8SqK',
  '1Hhe61Bwxs8Hd2WxzWY9FQyZicBiZGeSNW',
  '1Hn9ErTCPRP6j5UDBeuXPGuq5RtRjFJxJQ',
  '1Hpj6qm9i7nMF3VkKfBFtjhEDpEjxHWvgv',
  '1HuYfoEwsfHgZiRhbhJrCd5ST3iksa8KEx',
  '1J378PbmTKn2sEw6NBrSWVfjZLBZW3DZem',
  '1J6cgUVEZRKyJhpXJgHWX7YmzkdnHRaLhF',
  '1J9oGoAiHeRfeMZeUnJ9W7RpV55CdKtgYE',
  '1J9wJH2bamZVxscXAvoDH4jvtGKb7sYFDm',
  '1JPfVv5cWRLx1js9NWxg46dG2CGbeRz4th',
  '1JREJdZupiFhE7ZzQPtASuMCvvpXC7wRsC',
  '1Js6goCey2NaqPQptiLANLQGuk4d6mowjP',
  '1Juv2Ks3jJFUes8jEGxwgt6T6csBRQmmRw',
  '1K2fmE9hfhbRNSZoBvCBWZAvsS5idTUxBG',
  '1KSAbh5trMCTZwhiNsuUQvfTtSSTT8zqRk',
  '1KUUJPkyDhamZXgpsyXqNGc3x1QPXtdhgz',
  '1KUUJPkyDhamZXgpsyXqNGc3x1QPXtdhgz',
  '1Kc6egXevyLEaeTxLFA1Zyw7GuhCN8jQtt',
  '1KctQENEX5QkQMpnMC3Zh9yRAzkMBLpPcr',
  '1KgudqxMfYaGzqAA7MS4DcsqejtMteqhix',
  '1KkaKujnqwJf7Cbm7JKAZGF3X9d4685m8n',
  '1Kuf2Rd8mDyAViwBozGTNYnvWL8uYFrkVo',
  '1Kys8fqDen8NGFUJ6AFcXfFW5qquuTH4eh',
  '1L4ncif9hh9TnUveqWq77HfWWt6CJWtrnb',
  '1LAh7PQwpd1uGiLHae5C5Xz9QXse3y2phq',
  '1LBQd4ZxtQYYsDWrCzK4uMxHBJVxmyzs3M',
  '1LKE3XA9bf5JFqtGtCHzWj5QGxKGwMfXZw',
  '1LQV6yUBcfTjAWvFu3XPhdTgjqihss7i1z',
  '1LiNmTUPSJEd92ZgVJjAV3RT9BzUjvUCkx',
  '1Licqjca74n8pmNaoARXLLqcTUTHFpxbXH',
  '1LpYKb3SXZPve9hsH2QEJZFX279wJVGowi',
  '1LrxsRd7zNuxPJcL5rttnoeJFy1y4AffYY',
  '1LrxsRd7zNuxPJcL5rttnoeJFy1y4AffYY',
  '1LuDiMd95Df4i2bcvrfw47t2GKpLLXAQMZ',
  '1MQBDeRWsiJBf7K1VGjJ7PWEL6GJXMfmLg',
  '1MbtT2ZsTtLp7EKZUV9r74cTyqvsMtTP2M',
  '1MiQRekg4BatJ12qbiSGnNakLLd8xbLMCG',
  '1MkCnCa9agS5t6V1B15bzusBgYECB4LfWp',
  '1MnbhWe5wr7Ut45ReyQsm96PwnM9jD7KaH',
  '1MtsQsw6n2jvJCWhpCw7jifTfD9Q3rBBVg',
  '1N6XqSf3ULpNjko9LrJmHudRoLitjwkETN',
  '1NE2NiGhhbkFPSEyNWwj7hKGhGDedBtSrQ',
  '1NayLEVF3bEEbDtdF2Cwso1VdEtvVNh2qX',
  '1NbGwQwt4uEhg2srAKppLf8QaF6fbp3PZG',
  '1NpHuti9NSM9fVTXLkvSDU4AnhqGQ5N53d',
  '1NuBZQXJPyYQGfoBib8wWBDpZmbtkJa5Ba',
  '1NvJm3jfZxENNyqws5BKQvhkLxg9chLJdo',
  '1P3ZfGFLezzYGg9k5SVzQmnjyh7nrUmF2y',
  '1PJp8diNa89cVHpiT1VPu7EQ8LxYM5HX6v',
  '1PWRKxkR5AU7Tc9zPqjdhtu1eGW1QZzs4y',
  '1PXxwPVtYxZiCRp9LKq7aKMDFrhAQztvUE',
  '1PYtgFS2t6i57WdDvbRa7kPcsagGMBxzfg',
  '1PfwHNxUnkpfkK9MKjMqzR3Xq3KCtq9u17',
  '1PhqQpaGCrqSxQ6QDXcv14QCd1U98Zp34E',
  '1Pu1nAW7kCoSMThMs8QcpM8JxuByQDZgH',
  '1Q4tJjH2aBr3AJrzxqa4Z3jPpf5SDgF4jK',
  '1Q6saNmqKkyFB9mFR68Ck8F7Dp7dTopF2W',
  '1Q9UAQbcDezmyouFrzt94t4dSMxgsUfW1X',
  '1QHxyuLGRMHfbNPJikV4Dwhfx45HWfUMWB',
  '1QJUiNsNfji6mR1FjAwf6Eg9NxxHPoxpWL',
  '1Sf6e4xQv8muMZqYPTdRFf3e5o5eWcg9F',
  '1r6S9vpUZPS5rb6gSdwV2bvSFcN3uSq4q',
  '31nadacWrgPeAQxKRMabhn3fPhnhi3hjKa',
  '31p6woV4e55HUfC2aGynFhzQnGoJFW26cD',
  '31t4nEpcwyQJT1VuXdAoQZTT5givRDPsNP',
  '32DaxSzUhLBHY2WGSWQYiBSHnRsfQZrrRp',
  '32PsiT8itBrEF84ebdaF82yBUEcz5Wc6uY',
  '32VgTk8kGvBsqkHhkvtNooGdtqZm46jTVo',
  '32fbAZMTaQxNd2fAue1PgsiPgWfcsHBQQt',
  '32jgFkZsTEjMFaBvxJnYvJEeTNKTmq5b32',
  '32pCmCWEjwhkLwh5BgLNAeBQFp5Gi1hv81',
  '32wdqwX3zCEX3DhAVEcKwXCEGdzgBnx1R9',
  '331TS6DyASY7iU5CRA8UryBnkPS78fP2B1',
  '33KKjn4exdBJQkTtdWxqpdVsWxrw3LareG',
  '33Kja69SQVc8kozpoP7Qw6HFtGxHkiWzTz',
  '33fWcMdmsB2Ey4CEbVWbjGFkuevBSyP9nG',
  '33xWfziVZesgo83U5izdNCBVTnrtBpSwK7',
  '343w3Xh64q5UpgpvAPqmsUzxrknde8PQHb',
  '347QFbejDBdMZFTxpmn6evvvqyXiqZTCd7',
  '34ETiHfQWEYFCCaXmEeQWVmhFH5vz2JMvd',
  '34WWXwFKAsXL9zYxbeNPaPV6vDamkjQLUo',
  '34dxZvijpBM1YkPybczbQ7DuGuKAnULdfS',
  '34kEYgpijvCmjvahRXXQEnBH76UGJVx2wg',
  '34kWCKF2wCbe6uinit2uL4ND6d8yxsuxKM',
  '34pFGsSYbWEritXncW9unZtQQE9dKSvKku',
  '35KAdTa2vqnJzitF2xiUzZn1Gmcas2Y465',
  '35LScRJ8hzDvvWh9t9UA8bHGnGNVz3YEfa',
  '35QpLWYkvD3ALhjbge5bK2kd7HfHYcDMu3',
  '35SwVFxosV3AsvnrBfzdXarqavRbvDyyxv',
  '35aTjkBh4yeTypJsi9nuTdoMKHTsawKVgX',
  '35eanEz5iYg2eYaxCtMrR4SCoypFqrBWUH',
  '35hh9dg3wSvUJz9vFk1FsezLE5Fx3Hudk2',
  '35qwVtMEohWDdBWRiCSR7azoP5cbY8SG1Q',
  '35vypiSvQsxRiT3YZzGRGVaduUSx67ysZb',
  '361AkMKNNWYwZRsCE8pPNmoh5aQf4V7g4p',
  '361NP7YcBPQ4KkLT3Y2QZeDEV4M3yi65Ar',
  '36XqYWGvUQwBrYLRVuegN4pJJJSPWL1WEu',
  '36YGN5dGzqrxMomTHdkT6cYVMnWBw8S7hD',
  '36yS87PLuW7sErLg1TY26WzaVarTim7AcC',
  '372Wk9NLrMkJzKgqJdatWJy4bYRfxFjgat',
  '37dDBCexFPraKW4jGSqkE3NyG52YeZQbJx',
  '37g6WgqedzZx6nx51tYgssNG8Hnknyj5nL',
  '386wa1UM6nA798AWNh64jdrejZyedeXgUN',
  '389Sft4nJFkPGhbagk9FN4jXncA9piYTuU',
  '38LjCapRrJEW7w2zwbyS15P9D9UGPjWS44',
  '38ncxqt932N9CcfNfYuHGZgCyR85hDkWBW',
  '39AALn7eTjdPzLb99hHhD6F7J8QWB3R2Rd',
  '39KQvziHwUe2vddbpfC5WkQEV72qbQhxuh',
  '39NG2LcGRHXxSr1irpEVnJMw4ydL231sEn',
  '39Te8MbphSgs7npDJPj2hbNzhke61NTcnB',
  '39eboeqYNFe2VoLC3mUGx4dh6GNhLB3D2q',
  '39fhoB2DohisGBbHvvfmkdPdShT75CNHdX',
  '3A1HH3PseYMkh2nSrBb4kkVt3815kUNVVC',
  '3AFcE2mbSSndcpYFgHoExSmjUc26ef2gQh',
  '3ANWhUnHujdwbw2jEuGSRH6bvFsD9BqEy9',
  '3AQSmMk5n3c6TKEg9B2WyzYAPm33gJJAA4',
  '3AYU365Tcjef7j9pdKF9Xe8rWpEpsH196t',
  '3AjiWiUdKB5mcGUSS9mBeoHCeYJw3Zo8r6',
  '3AjyprBY5yhijiCjUC5NUJutGbwhd3AQdE',
  '3B3vmabBbeDRnVrjvvq3hm85zVB4v5bWFC',
  '3B4G1M8eF3cThbeMwhEWkKzczw9QoNTGak',
  '3BCN3WgMRJwULTz1vsEQ7NZrBjwaUBf5Ca',
  '3BQACtiMXYB9JpUMpkEWt9m8BzswpGHq4X',
  '3BWP6ZQAhc4j5wR1b95zJAthJEFvhdees7',
  '3BazbaTP8ELJUEfPBV9z5HXEdgBziV9p7W',
  '3BsyZ7qRFSi3NsaoV1Ff724qAgrEpjVUHm',
  '3CCmt5LjQ5yKkaFY1DWC2SbERVEtWRnSRD',
  '3Czhm6xqn8odwz6jgTcjRrUjog28v6aVS8',
  '3DCCgmyKozcZkFBzYb1A2x8abZCpAUTPPk',
  '3DLGfN7hgsWXXSp9euXcnmWXLpFQuswW2t',
  '3DNsaQnaUz7wkQny1ZDSmtz6QfbEShxoDD',
  '3E6ZCKRrsdPc35chA9Eftp1h3DLW18NFNV',
  '3E6rY4dSCDW6y2bzJNwrjvTtdmMQjB6yeh',
  '3E7YbpXuhh3CWFks1jmvWoV8y5DvsfzE6n',
  '3EL5vcYeu1cnivLtR7tnAX3bBirr9ATNAL',
  '3EPqGUw2q89pwPZ1UF8FJspE2AyojSTjdu',
  '3ES6pqCueDPCnC4hCqhhYuey6gyiRJZw6E',
  '3EUjqe9UpmyXCFd6jeu69hoTzndMRfxw9M',
  '3EeR8FbcPbkcGj77D6ttneJxmsr3Nu7KGV',
  '3F2sZ4jbhvDKQdGbHYPC6ZxFXEau2m5Lqj',
  '3F6bbvS1krsc1qR8FsbTDfYQyvkMm3QvmR',
  '3F6bbvS1krsc1qR8FsbTDfYQyvkMm3QvmR',
  '3FBgeJdhiBe22UoSpp51Vd8dPHVa2A4wZX',
  '3GAUBtrTtWp1D9yeXgr3wMg8B599QHa5m5',
  '3GMfGEDYMTq9G8dEHet1zLtUFJwYwSNa3Y',
  '3GSXNXzyCDoQ1Rhsc7F1jjjFe7DGcHHdcM',
  '3GXdtA6kbb4M5aqzZm5qqxcFDFRMW8LqdJ',
  '3GYbbYkvqvjF5oYhaKCgQYCvcVE1JENk6J',
  '3Gbs4rjcVUtQd8p3CiFUCxPLZwRqurezRZ',
  '3GuQjr7kkrR5EjpanMgyAuxuLgrjEUwe21',
  '3H3rh85qPaGLy2w6618yZNaH7i8asHv46B',
  '3H4qaWi5DS6FMwyZrG9xRRud3Qc5dUVn2U',
  '3HJN4jRa4mdfkey9JR9jUhr86yPwL86A3C',
  '3HQDRyzwm82MFmLWtmyikDM9JQEtVT6vAp',
  '3HQRveQzPifZorZLDXHernc5zjoZax8U9f',
  '3HRExd8GKFskZC5inmVcpiyy9UWG7FVa6o',
  '3HSZc4BLnQBznjSq7JvXgqNCZUUs3M9fZz',
  '3HWjh69cVQvcPeLWVCyVmXEq72nyDSj5zP',
  '3He6EyDaCUgmdr4GXqhxbeTQukaGLCByU2',
  '3HqA7i3ttECLvgqvq69HNxxUP5BL7Z5YgA',
  '3HupEUfKmMhvhXqf8TMoPAyqDcRC1kpe65',
  '3J19qffPT6mxQUcV6k5yVURGZtdhpdGr4y',
  '3JHMz3mTna1gVCZSPp8NgRFiY7phkv5mA8',
  '3JLyyLbwciWAC6re87D7mRknXakR4YbnUd',
  '3JUwAS7seL3fh5hxWh9fu3HCiEzjuQLTfg',
  '3JXKQ81JzBqVbB8VHdV9Jtd7auWokkdPgY',
  '3JhPsVV3KnL9dBYGSZALS9EbrLr97R865a',
  '3Jpf9B5P8cvEKSSGp9cES3Upbms8VRnXUb',
  '3JuSgFrwnrNfuhvR4GpWAPmeJVot4xrEae',
  '3K26aMKmnrv97Pj6YiFcqiXk2LxeHfhnG3',
  '3K35dyL85fR9ht7UgzPfd1gLRRXQtNTqE3',
  '3K4rjdh8A5yi6LWvft2rbmyZvqEbPSSSX4',
  '3K7PMJyMNVnxqsfpmK9r9nJDtzDw9wNwNV',
  '3KGQ3hX6eFYtBjTBFSdvdkzHmwZyYWLRQh',
  '3KHfXU24Bt3YD5Ef4J7uNp2buCuhrxfGen',
  '3Kp8Qc5z7yevDeoQxhS5RSSKnEi5x7AQ43',
  '3KvBX3jo69Qn8jHy44M33RYoeYcf8DdRBD',
  '3LDbNuDkKmLae5r3a5icPA5CQg2Y8F7ogW',
  '3LLUnf3ezw6mCbQ2zCZmGu5rZULzkhxQi7',
  '3LbDu1rUXHNyiz4i8eb3KwkSSBMf7C583D',
  '3LhnVMcBq4gsR7aDaRr9XmUo17CuYBV4FN',
  '3Lpoy53K625zVeE47ZasiG5jGkAxJ27kh1',
  '3LtcaPbCj87CwJHnRX3vh7c2y9RZQqeSy8',
  '3M7CGBPUJwXXSroWuZ6H5jiprdKCyf7V5M',
  '3MD3riFB6U8PykypF6qkvSj8R2SGdUDPn3',
  '3MN8nYo1tt5hLxMwMbxDkXWd7Xu522hb9P',
  '3MP7yBGSW2gkXVRE8S84T2j4KVgPh3rEzv',
  '3MTRvM5QrYZHKo8gh5qKcrPK3RLjxcDCZE',
  '3MTrJTFhYK9v1C6pjHtuweZSopfZa4b1wb',
  '3MkUNScqf21EcfWq6T4x2MFgBeSTqhB5t6',
  '3MvQ4gThF4mmuo49p4dBNchcmFHBRZnYfx',
  '3MzLtBQ4Lz9J6w4Qu55TktgxFKZwxYWrP6',
  '3N3YSDvp4cbhEgNGabQxTN39kEzJmwG8Ah',
  '3N6WeZ6i34taX8Ditser6LKWBcXmt2XXL4',
  '3N9YcPBDky9UsMx1RTk33tL4jDkZfSnsPk',
  '3NDzzVxiLBUs1WPvVGRfCYDTAD2Ua2PvW4',
  '3NPognMSbzyA2JYW2fpkVKWyBMi2XTq2Zt',
  '3NQ1aa9ceirMJ1JvRq3eXefvXj1L639fzX',
  '3NRJ8aXdUiZdHaiFX9ePX3DhGHzcEi14Fq',
  '3P6PzdfETr4275Gn3veLkCyDxA1jV8fHKm',
  '3PDmRwotTkRAFRLGTUrucCERp2JdM1q4ar',
  '3PKiHs4GY4rFg8dpppNVPXGPqMX6K2cBML',
  '3PUmTuVAW3LkKg53FZ7F97VDBitW4ugwnM',
  '3PiCnZrBvGfWAKQ9hr4cCpfaDjy64yNSpE',
  '3PyzSbFj3hbQQjTzDzyLSgvFVDjB7yw4Cj',
  '3Q5dGfLKkWqWSwYtbMUyc8xGjN5LrRviK4',
  '3QAdoc1rDCt8dii1GVPJXvvK6CEJLzCRZw',
  '3QEjBiPzw6WZUL4MYMmMU6DY1Y25aVbpQu',
  '3QJyT8nThEQakbfqgX86YjCK1Sp9hfNCUW',
  '3QVyoH4u3qT88uChAeJVhfB3r6maZt431y',
  '3QWUdP5taP4GrRuueVDud1eWetb7hc3wDH',
  '3QnWE5GVfQu3wVav91RuFkqip4Ti4NWqAY',
  '3QrukkUiBrn23rFUKUgasNd1wYWNk7WdSV',
  '3Qw9Fn19gCnga9LfHfpM99aGzuqxBNjR2i',
  '49HqitRzdnhYjgTEAhgGpCfsjdTeMbUTU6cyR4JV1R7k2Eej9rGT8JpFiYDa4tZM6RZiFrHmMzgSrhHEqpDYKBe5B2ufNsL',
  '5be5543ff73456ab9f2d207887e2af87322c651ea1a873c5b25b7ffae456c320',
  '884Bz8UH63aYsjVdkfWfScRYWZGGNbjFL7pztqvWNSrtYT4reFSwyvkCj9KEGUtheHhhMUj87ciTBFyzoesrMJ4L1FvSoxL',
  'DFFJhnQNZf8rf67tYnesPu7MuGUpYtzv7Z',
  'GPwg61XoHqQPNmAucFACuQ5H9sGCDv9TpS',
  'LNwgtMxcKUQ51dw7bQL1yPQjBVZh6QEqsd',
  'LQAhYwwK5AR1JQiQPr7vu8Pu4b6qcxxvNB',
  'LWnbjLYUfqeokfbWM4FcU7uk2FP2DSxuWS',
  'LaYUy1DGfVSuSF5KbPhbLrm8kRotqiwUJn',
  'LaizKtS5DUhPuP1nTQcc83MS7HwK6vk85z',
  'LeKvNdNEzgQkzVVnRdV3fAu2DSF1nLsNw6',
  'LeKvNdNEzgQkzVVnRdV3fAu2DSF1nLsNw6',
  'Leo3j36nn1JcsUQruytQhFUdCdCH5YHMR3',
  'LgwmgYnraU2uBWHVFUDgAmFCPYj5Yw8C9L',
  'TVacWx7F5wgMgn49L5frDf9KLgdYy8nPHL',
  'TX5GV4DyfxNB3rPkzZJhmqZ1efVmL4rEqG',
  'XnPFsRWTaSgiVauosEwQ6dEitGYXgwznz2',
  'Xs3vzQmNvAxRa3Xo8XzQqUb3BMgb9EogF4',
  'XyARKoupuArYtToA2S6yMdnoquDCDaBsaT',
  'bc1q202ajnhxgg9d9jjczmg0g4usp6haqldyy2eakl',
  'bc1q237mvl0heyw0r38wd3xz8h5mar96rrwpams8pp',
  'bc1q2lpgjntr348pfvxhfy33ehmdzy3gmx8w4052z6',
  'bc1q3y5v2khlyvemcz042wl98dzflywr8ghglqws6s',
  'bc1q4rzdtlt0uslyw86cp29sctl6ct29g9a95cuup7pn5md9ddj7xgmqpp5m73',
  'bc1q86tl9255vg5wldamfymaaz36uqxzm30gs7fhkljvzdlt9t38s3lqgdwdfq',
  'bc1q90zrdysy4flyacw7hsury3ajs9yzwtwp6guqpypx94w0d3p58hysvz6pde',
  'bc1q9lvynkfpaw330uhqmunzdz6gmafsvapv7y3zty',
  'bc1qdt3gml5z5n50y5hm04u2yjdphefkm0fl2zdj68',
  'bc1qe95l438kzjcvnsm3kn8n5augf9gpctdlhsq7f7hpnkyvlr7rc7cqupapf7',
  'bc1qfg4gfg0y6t6xjnpmlhuwx5k0wlw6nmfzxn2psc',
  'bc1qj6j6p0jdefl6pvdzx3kx8245yy5mz6q4luhzes',
  'bc1ql7dlyh8xz6tpqk92vztrhqh88dmjvcwrmsemrm',
  'bc1qpaly5nm7pfka9v92d6qvl4fc2l9xzee8a6ys3s',
  'bc1qqf8kcc9m57xjqcvsvuf989nnl48ve6d2s24cx3',
  'bc1qs9u6j78e3utj08mwvqkkmqm9de5xk3g4yh8qtq',
  'bc1qsmqpalp3gtgkltag4x3ygevmhh9y2hzk73t2ug',
  'bc1qsmv6lkrw65l30yazdqpdjjtwzpvk9f8gfh0cy7',
  'bc1qsxf77cvwcd6jv6j8d8j3uhh4g0xqw4meswmwuc',
  'bc1quyc6j8ca84q9gjej5jjd2n8hra0vfu0j60fefs57p6e5rerkq07q0l5u3w',
  'bc1qv7k70u2zynvem59u88ctdlaw7hc735d8xep9rq',
  'bc1qvlzfn6kmezv44d8kw0p5jsmxe6wchv3zc7gsxs',
  'bc1qw4cxpe6sxa5dg6sdwxjph959cw6yztrzl4r54s',
  'bc1qw7vfgv3r5vnehafl0y95sclg3uqsj87wxs9ad628yjjcq33cwessr6ndyw',
  'bc1qwa6zu6qhl6wqnlxp642vcf89nptsassle25ulf',
  'bc1qx3e2axj3wsfn0ndtvlwmkghmmgm4583nqg8ngk',
  'qpf2cphc5dkuclkqur7lhj2yuqq9pk3hmukle77vhq',
  'qpusmp64rajses77x95g9ah825mtyyv74smwwkxhx3',
  'qq3vlashthktqpeppuv7trmw070e3mydgq63zq348v',
  'qqyuc9s700plhzr6awzru7g5z2d2p906uyrm6ht0r0',
  'qz9f2vz3033sg5vc5mf7m7xshmj0jugy4ummf05jk8',
  'qzjv8hrdvz6edu4gkzpnd4w6jc7zf296g5e9kkq4lx',
  'rnXyVQzgxZe7TR1EPzTkGj2jxH4LMJYh66',
  't1MMXtBrSp1XG38Lx9cePcNUCJj5vdWfUWL',
  't1WSKwCDL1QYRRUrCCknEs5tDLhtGVYu9KM',
  't1g7wowvQ8gn2v8jrU1biyJ26sieNqNsBJy',
].map((a) => a.toLowerCase());
