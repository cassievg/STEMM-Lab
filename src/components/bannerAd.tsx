import React from "react";
import {
    BannerAd,
    BannerAdSize,
    TestIds,
} from "react-native-google-mobile-ads";

const adUnitId = __DEV__
  ? TestIds.BANNER
  : "ca-app-pub-9263495687323879/7087819968";

export default function AppBannerAd() {
  return (
    <BannerAd
      unitId={adUnitId}
      size={BannerAdSize.LARGE_ANCHORED_ADAPTIVE_BANNER}
    />
  );
}