import TTS from './tts';
interface IOptions {
    APP_ID: string;
    API_KEY: string;
    API_SECRET: string;
}
class XFYunClient {
    private APP_ID: string;
    private API_KEY: string;
    private API_SECRET: string;
    // private TTS: TTS
    constructor(options: IOptions) {
        this.APP_ID = options.APP_ID;
        this.API_KEY = options.API_KEY;
        this.API_SECRET = options.API_SECRET;
        
    }
}
export default XFYunClient;