import hmacSHA512 from 'crypto-js/hmac-sha512';

export const checkOrigin = () => {
  const [, site, dns] = window.location.host.split('.');

  return (
    ['localhost', '.thorswap.finance', '.on.fleek.', '.ipns.', '.ipfs.'].some((s) =>
      window.location.host.includes(s),
    ) ||
    !window.location.href.includes('.') ||
    parseInt(site) === 0 ||
    hmacSHA512(`${site}.${dns}`, '!%Zfh5EKmv7LoX9b*x75DQhK').toString().slice(-10) === '6240a643b9'
  );
};
