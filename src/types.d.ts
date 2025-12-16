interface HelloResponse {
  serverTime: number;
  dancercard: {
    publicID: string;
    session: string;
    pName: string;
    avatar: number;
    totalScore: number;
    largestDanceRoom: number;
    totalDances: number;
    danceStreak: number;
    kcalBurned: number;
    highscores: {
      song: string;
      score: number;
    }[];
    nbDistinctMapsPlayed: number;
    platform: 'android' | 'ios';
    // Two-letter country code
    country: string;
    globalLevel: number;
    xpInfo: {
      prevXPLevel: number;
      nextXPLevel: number;
      // Percentage to next level
      completed: number;
      globalXP: number;
    };
    mapsPlayed: string[];
    geoLocation: string;
    favorites: unknown[];
    dancerOfWeekCount: number;
    age: number;
    ageUpdatedTimestamp: number;
    // JSON encoded string
    ftueDates: string;
    unlockedAvatars: [];
    newlyUnlockedRewards: ({
      reason: 'song';
      rewardValue: number;
      type: 'avatar';
    } | {
      reason: 'achievement';
      achievementLocalizedName: string;
      achievementName: string;
      rewardValue: string;
      type: 'alias';
    })[];
    freeSongList: [];
    purchasedSongList: [];
    isUVSPlayer: boolean;
    // Actually it's a stringified number
    customBGID: string;
    isOpenBetaPlayer: number;
    // User ID
    _id: string;
    expiration: number;
    renewalDate: number;
    payedForGame: boolean;
    wallet: {
      balance: number;
      history: [];
      lastPurchase: {
        product: string;
        price: 'NA' | string;
      };
      lastCoinRegenTimestamp: number;
      offeredBalance: number;
      purchasedBalance: number;
    };
    lastScreen: string;
    seenPopup: object;
    appleId: string;
    googleId: string;
    lgDeviceId: string|null;
    sessionsNb: number;
    monetizationStatus: 'Free';
    population: `Population${number}`;
    // Date formatted as ISO 8601
    lastLogin: string;
    moneySpentInEuro: number;
    overallTimeSpentInGame: number;
    persoDiscount: number;
    processData: boolean;
    currentDataProtectionPolicy: string;
    isPlayerVip: boolean;
    averageScore: number;
    favoritesDuration: number;
    ubiConnectIdMapped: boolean;
    ubiConnectId: string;
    specialUnlockedAvatars: number[];
    unlockedAlias: string[];
    unlockedBanners: string[];
    unlockedAppIcons: number[];
    teamPlayerId: string;
    achievementId: string;
    banner: string;
    alias: string;
    activePurchaseProductId: string;
    superStarCount: number;
    megaStarCount: number;
    configId: string;
    nextRegenInMillisecond: number;
    adVideoSeenCount: number;
    ghostOn: boolean;
    coinRegen: {
      regenTickAmount: number;
      regenTickFrequency: number;
      regenCoinsCap: number;
      happyHourRegenTickFrequency: number;
      happyHourStartTime: number;
      happyHourEndTime: number;
    };
    videoReward: {
      nbVideo: number;
      videoRewardAmount: number;
    };
    canUseCoins: boolean;
    // In-App purchase IDs
    iapIds: string[];
    rateUsPopup: {
      rateUsIntervalData: number[];
      rateUsTvosSession: number[];
      rateUsStarsRequired: number;
    };
    rateUsPopUpEvents: {
      rateUsEvents: string[];
      rateUsActivePeriod: string[];
      rateUsInterval: number;
    };
    isUbiWebAuthEnabled: boolean;
    ubiConnectLoginFlow: string;
    ubiWebAuthFrequency: number;
  };
  tier: `TIER_${number}`;
  cdn: string;
  routes: `${number}:${string}`[];
  api: string;
  chromecastAppID: string;
  compensationInfo: {
    execution: number;
  };
  memoryRequired: number;
  authToken: string;
  ABTestingEnabled: boolean;
  songsPrice: number;
  countryFilter: string[];
}