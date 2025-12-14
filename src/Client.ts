import Socket from "./Socket";
import HTTPClient from "./HTTPClient";

export default class Client {
    private baseUrl: string = 'https://release-jdns-880.justdancenow.com';
    private http: HTTPClient = new HTTPClient(this.baseUrl);

    async getServer(roomId: number) {
        const res = await this.http.get<{
            drs: string;
            port: number;
        }>(`/checkRoomController?roomID=${roomId}`);

        return new Socket(res.drs, res.port);
    }

    /**
     * Get the client's geolocation information.
     * @returns An object containing the country and region.
     */
    async getGeolocation() {
        const res = await this.http.get<{
            country: string;
            region: string;
        }>('/getGeolocation');

        return {
            country: res.country,
            region: res.region,
        };
    }

    /**
     * Get the protocol version.
     * @returns The protocol version number.
     */
    async getProtocolVersion() {
        return this.http.get<number>('/protocolVersion');
    }

    /**
     * Get the user token for a given user ID.
     * @param {string} userId - The ID of the user.
     * @returns An object containing the user token.
     */
    async getUserToken(userId: string) {
        const res = await this.http.get<{ userToken: string; }>(`/getUserToken/?_id=${userId}`);
        return res.userToken;
    }

    /**
     * Send a hello request to the server.
     * @param {string} userId - The user ID.
     * @param {string} userToken - The user token, generated from `getUserToken`.
     * @param {string} lang - The language code.
     * @param {string} firstPartyId - ??
     * @param {string} teamPlayerId - ??
     * @param {string} ubisoftConnectId - The Ubisoft Connect ID.
     * @returns An object containing the user token.
     */
    async hello(userId: string, userToken: string, lang?: string, firstPartyId?: string, teamPlayerId?: string, ubisoftConnectId?: string) {
        const body = new URLSearchParams({
            text: userId,
            firstPartyId: firstPartyId || '',
            teamPlayerId: teamPlayerId || '',
            lang: lang || 'en',
            userToken: userToken || '',
            ubiConnectId: ubisoftConnectId || '',
        });
        // This endpoint took me too long to type oh my god
        return this.http.post<{
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
                        price: 'NA' | any;
                    };
                    lastCoinRegenTimestamp: number;
                    offeredBalance: number;
                    purchasedBalance: number;
                };
                lastScreen: string;
                seenPopup: {};
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
        }>('/hello', body);
    }

    /**
     * Find an available room.
     * @returns The ID of the found room.
     */
    async findRoom() {
        const res = await this.http.get<{ room: number }>('/findRoom');
        return res.room;
    }

}