import TTS from './tts';
import { Config } from './types';
class XFYunClient {
    constructor(options: Config) {
        this.validateConfig(options)
        new TTS({ ...options })
    }
    private validateConfig(config: Config) {
        if (!config.appid || !config.apiKey || !config.apiSecret) {
            throw new Error('Missing required authenication parameters')
        }
    }
}
export default XFYunClient;