import webSocket from 'websocket'
import { Config } from './types';
import CryptoJS from 'crypto-js';

class TTS {
    private appid: string;
    private apiKey: string;
    private apiSecret: string;
    private ttsWS: WebSocket | null;
    constructor(options: Config) {
        this.appid = options.appid;
        this.apiKey = options.apiKey;
        this.apiSecret = options.apiSecret;
        this.ttsWS = null;
    }
    /**
     * api接口鉴权
     * @returns wsUrl
     */
    private authWebSoketUrl() {
        const url = "wss://tts-api.xfyun.cn/v2/tts";
        const host = location.host;
        const date = new Date().toUTCString();
        const algorithm = "hmac-sha256";
        const headers = "host date request-line";
        const signatureOrigin = `host: ${host}\ndate: ${date}\nGET /v2/tts HTTP/1.1`;
        const signatureSha = CryptoJS.HmacSHA256(signatureOrigin, this.apiSecret);
        const signature = CryptoJS.enc.Base64.stringify(signatureSha);
        const authorizationOrigin = `api_key="${this.apiKey}", algorithm="${algorithm}", headers="${headers}", signature="${signature}"`;
        const authorization = btoa(authorizationOrigin);
        return `${url}?authorization=${authorization}&date=${date}&host=${host}`;
    }
    public synthesize() {
        const url = this.authWebSoketUrl();
        if ("WebSocket" in window) {
            this.ttsWS = new WebSocket(url);
        } else {
            throw new Error('WebSocket not supported')
        }
        this.ttsWS.onopen = () => {

        }
    }
}
export default TTS;