// SocialShare.js

import { Share } from 'react-native';

const shareAppLink = async () => {
  const url = `https://expo.dev/artifacts/eas/ptaU2ao7ieEBuHxXiHBEeE.apk`;

  try {
    await Share.share({
      title: 'Download ShowStarter Today!',
      message: 'Check out ShowStarter for your Smartphone. Download it today from\n' + url,
    });
  } catch (error) {
    console.log(error);
  }
};

export { shareAppLink };
