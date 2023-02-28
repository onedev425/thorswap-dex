import hmacSHA512 from 'crypto-js/hmac-sha512';

const privateKey = '!%Zfh5EKmv7LoX9b*x75DQhK';

export const checkOrigin = () => {
  const [sub, site, dns] = window.location.host.split('.');

  console.log(window.location.host);

  return (
    window.location.host.includes('on.fleek') ||
    window.location.host.includes('ipfs') ||
    sub.includes('localhost') ||
    parseInt(site) === 0 ||
    hmacSHA512(`${site}.${dns}`, privateKey).toString().slice(-10) === '6240a643b9'
  );
};
