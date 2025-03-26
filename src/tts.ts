import { Config, WebSocketMessage } from './types';
import CryptoJS from 'crypto-js';
class TTS {
    private appid: string;
    private apiKey: string;
    private apiSecret: string;
    private ttsWS: WebSocket | null;
    private audioPlayer: AudioPlayer;
    private content: string;
    constructor(options: Config) {
        this.appid = options.appid;
        this.apiKey = options.apiKey;
        this.apiSecret = options.apiSecret;
        this.ttsWS = null;
        this.audioPlayer = new AudioPlayer("./utils");
        this.content = options.content!
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
            this.audioPlayer.start({
                autoPlay: true,
                sampleRate: 16000,
                resumePlayDuration: 1000
            });
            const params = {
                common: {
                    app_id: this.appid,
                },
                business: {
                    aue: "raw",
                    auf: "audio/L16;rate=16000",
                    vcn: "xiaoyan",
                    speed: 50,
                    volume: 50,
                    pitch: 50,
                    tte: "UTF8",
                },
                data: {
                    status: 2,
                    text: btoa(String.fromCharCode(...new TextEncoder().encode(this.content))),
                },
            }
            this.ttsWS?.send(JSON.stringify(params));
        };

        this.ttsWS.onmessage = (e) => {
            const jsonData: WebSocketMessage = JSON.parse(e.data);
            if (jsonData.code === 0) {
                this.audioPlayer!.postMessage({
                    type: "base64",
                    data: jsonData.data.audio,
                    isLastData: jsonData.data.status === 2
                });
                this.audioPlayer!.onPlay = () => {
                };
                this.audioPlayer!.onStop = () => {
                    //播报完毕重启收音
                };
            } else {
                console.error('发生错误');
                this.ttsWS!.close();
            }
        }
    }
}
export default TTS;