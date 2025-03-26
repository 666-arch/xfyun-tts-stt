export interface Config {
    appid: string;
    apiKey: string;
    apiSecret: string;
    content?: string; //需要转语音的文本 
}
export interface WebSocketMessage {
    code: number;
    data: {
        audio: string;
        status: number;
    }
}