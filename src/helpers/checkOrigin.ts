import hmacSHA512 from 'crypto-js/hmac-sha512';

const privateKey = '!%Zfh5EKmv7LoX9b*x75DQhK';

export const checkOrigin = () => {
  const [sub, site, dns] = window.location.host.split('.');

  console.error(window.location.host);

  return (
    ['.on.fleek.co', '.ipns.dweb.link', 'ipfs'].some((s) => window.location.host.includes(s)) ||
    !window.location.href.includes('.') ||
    sub.includes('localhost') ||
    parseInt(site) === 0 ||
    hmacSHA512(`${site}.${dns}`, privateKey).toString().slice(-10) === '6240a643b9'
  );
};
