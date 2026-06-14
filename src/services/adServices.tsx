import React from "react";
import {
  AdEventType,
  BannerAd,
  BannerAdSize,
  InterstitialAd,
  TestIds,
} from "react-native-google-mobile-ads";

const adUnitIdBanner = __DEV__
  ? TestIds.BANNER
  : "ca-app-pub-9263495687323879/7087819968";

const adUnitIdInterstitial = __DEV__
  ? TestIds.INTERSTITIAL
  : 'ca-app-pub-9263495687323879/7279994294';

let interstitial = InterstitialAd.createForAdRequest(adUnitIdInterstitial);


export default function AppBannerAd() {
  return (
    <BannerAd
      unitId={adUnitIdBanner}
      size={BannerAdSize.LARGE_ANCHORED_ADAPTIVE_BANNER}
    />
  );
}

export const loadInterstitial = () => {
  interstitial.load();
};

export const showInterstitial = () => {
  return new Promise<void>((resolve) => {
    const unsubscribeLoaded = interstitial.addAdEventListener(
      AdEventType.LOADED,
      () => {
        interstitial.show();
      }
    );

    const unsubscribeClosed = interstitial.addAdEventListener(
      AdEventType.CLOSED,
      () => {
        unsubscribeLoaded();
        unsubscribeClosed();

        interstitial = InterstitialAd.createForAdRequest(adUnitIdInterstitial);
        interstitial.load();

        resolve();
      }
    );

    interstitial.load();
  });
};