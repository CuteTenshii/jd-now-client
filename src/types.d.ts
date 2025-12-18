interface HelloResponse {
  serverTime: number;
  dancercard: {
    publicID: string;
    session: string;
    // Player name
    pName: string;
    /**
     * ID of the avatar
     * @see https://github.com/CuteTenshii/jd-now-client/wiki/Assets#avatars
     */
    avatar: number;
    totalScore: number;
    largestDanceRoom: number;
    totalDances: number;
    danceStreak: number;
    kcalBurned: number;
    highscores: {
      song: string;
      score: number;
      achievements?: {
        superstar?: {
          moveNr: number;
        };
        megastar?: {
          moveNr: number;
        }
      }
    }[];
    nbDistinctMapsPlayed: number;
    platform: Platform;
    /**
     * Two-letter country code
     * @see https://github.com/CuteTenshii/jd-now-client/wiki/Assets#countries-flags
     */
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
    monetizationStatus: 'Free' | 'Vip';
    population: `Population${number}`;
    // Date formatted as ISO 8601
    lastLogin: string;
    moneySpentInEuro: number;
    overallTimeSpentInGame: number;
    persoDiscount: number;
    processData: boolean;
    currentDataProtectionPolicy: string;
    renewalData?: {
      status: 'DID_CHANGE_RENEWAL_STATUS';
      last_status_update_date: string;
    };
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
    // Banner ID
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

type Platform = 'android' | 'ios' | 'web';

enum DifficultyLevel {
  Easy = 1,
  Medium = 2,
  Hard = 3,
  Extreme = 4,
}

interface PublishedSong {
  _id: string;
  id: string;
  artist: string;
  name: string;
  coaches: number;
  status: 'QC_VERIFIED';
  credits: string[];
  avatars: number[];
  // Duration in milliseconds
  duration: number;
  version: number;
  /**
   * Difficulty level (1-4).
   * @see DifficultyLevel
   */
  difficulty: DifficultyLevel;
  // The Just Dance game this song was introduced in
  jdversion: number;
  isSongPackSong: boolean;
  isLGESong: boolean;
  /**
   * Base URL for the song assets.
   * @example https://jdnow-api-contentapistoragest.justdancenow.com/songs/24K_1600079320167
   */
  base: `https://jdnow-api-contentapistoragest.justdancenow.com/songs/${string}_${number}`;
  /**
   * Base URL for the app avatars assets.
   * @example https://jdnow-api-contentapistoragest.justdancenow.com/songs/24K_1600079320167/assets/app/avatars
   */
  app_avatars: `https://jdnow-api-contentapistoragest.justdancenow.com/songs/${string}_${number}/assets/app/avatars`;
  /**
   * Direct URL to the song's background image.
   * @example https://jdnow-api-contentapistoragest.justdancenow.com/map_bkg/24K_map_bkg.jpg
   */
  bkg_image: `https://jdnow-api-contentapistoragest.justdancenow.com/map_bkg/${string}_map_bkg.jpg`;
}

interface SongDetail {
  MapName: string;
  // The Just Dance game this song was introduced in
  JDVersion: number;
  OriginalJDVersion: number;
  Artist: string;
  Title: string;
  Credits: string;
  NumCoach: number;
  CountInProgression: boolean;
  DancerName: 'Unknown Dancer' | string;
  LocaleId: number;
  MojoValue: number;
  Mode: number;
  Status: number;
  LyricsType: number;
  BackgroundType: number;
  Difficulty: DifficultyLevel;
  // Colors in the format "0xRRGGBBOO"
  DefaultColors: {
    lyrics: string;
    theme: string;
    [key: string]: string;
  };
  // Color in the format "#RRGGBB"
  lyricsColor: string;
  videoOffset: number;
  beats: number[];
  lyrics: Lyric[];
  pictos: Picto[];
  AudioPreview: {
    coverflow: {
      startbeat: number;
    };
    prelobby: {
      startbeat: number;
    };
  }
  AudioPreviewFadeTime: number;
}

/**
 * If you already played JD you've probably seen that lyrics appear like a karaoke.
 * Each line is split into multiple parts, each with its own timing.
 * @see https://github.com/CuteTenshii/jd-now-client/wiki/Lyrics
 */
interface Lyric {
  time: number;
  duration: number;
  text: string;
  // Values observed are only 0 and 1, so this should be a boolean. However, Ubisoft uses numbers for whatever reason.
  isLineEnding: number;
}

interface Picto {
  time: number;
  duration: number;
  /**
   * File name of the picto asset
   */
  name: string;
}

interface SongMove {
  name: string;
  time: number;
  duration: number;
}