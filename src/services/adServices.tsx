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
  : "ca-app-pub-9263495687323879/7279994294";

let interstitial = InterstitialAd.createForAdRequest(adUnitIdInterstitial);

let isLoaded = false;

interstitial.addAdEventListener(
  AdEventType.LOADED,
  () => {
    console.log("Interstitial loaded");
    isLoaded = true;
  }
);

interstitial.addAdEventListener(
  AdEventType.ERROR,
  (error) => {
    console.log("Interstitial error:", error);
    isLoaded = false;
  }
);

interstitial.addAdEventListener(
  AdEventType.CLOSED,
  () => {
    console.log("Interstitial closed");

    isLoaded = false;

    interstitial = InterstitialAd.createForAdRequest(
      adUnitIdInterstitial
    );

    attachListeners();
    interstitial.load();
  }
);

function attachListeners() {
  interstitial.addAdEventListener(
    AdEventType.LOADED,
    () => {
      console.log("Interstitial loaded");
      isLoaded = true;
    }
  );

  interstitial.addAdEventListener(
    AdEventType.ERROR,
    (error) => {
      console.log("Interstitial error:", error);
      isLoaded = false;
    }
  );
}

export default function AppBannerAd() {
  return (
    <BannerAd
      unitId={adUnitIdBanner}
      size={BannerAdSize.LARGE_ANCHORED_ADAPTIVE_BANNER}
    />
  );
}

export const loadInterstitial = () => {
  console.log("Loading interstitial...");
  interstitial.load();
};

export const showInterstitial = () => {
  return new Promise<void>((resolve) => {
    if (!isLoaded) {
      console.log("Interstitial not ready");
      resolve();
      return;
    }

    const unsubscribe = interstitial.addAdEventListener(
      AdEventType.CLOSED,
      () => {
        unsubscribe();
        resolve();
      }
    );

    interstitial.show();
  });
};