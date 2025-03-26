type ISaveAudioData = "pcm" | "wav";

/**
* @description AudioPlayer 科大讯飞语音识别内置 js
*/
declare class RecorderManager {
    constructor(processorPath: string);
    private audioBuffers;
    private processorPath;
    private audioContext?;
    private audioTracks?;
    private audioWorklet?;
    onStop?: (audioBuffers: ArrayBuffer[]) => void;
    onFrameRecorded?: (params: {
        isLastFrame: boolean;
        frameBuffer: ArrayBuffer;
    }) => void;
    /**
     * 监听录音开始事件
     */
    onStart?: () => void;
    start({ sampleRate, frameSize, arrayBufferType, }: {
        sampleRate?: number;
        frameSize?: number;
        arrayBufferType?: "short16" | "float32";
    }): Promise<void>;
    stop(): void;
}

/**
* @description AudioPlayer 科大讯飞语音合成内置 js
*/
declare class AudioPlayer {
    constructor(processorPath?: string);
    private toSampleRate;
    private resumePlayDuration;
    private fromSampleRate;
    private isAudioDataEnded;
    private playAudioTime?;
    private status;
    private audioContext?;
    private bufferSource?;
    private audioDatas;
    private pcmAudioDatas;
    private audioDataOffset;
    private processor;
    postMessage({ type, data, isLastData }: {
        type: "base64" | "string" | "Int16Array" | "Float32Array";
        data: string | Int16Array | Float32Array;
        isLastData: boolean;
    }): void;
    private playAudio;
    onPlay?: any;
    onStop?: any;
    reset(): void;
    start({ autoPlay, sampleRate, resumePlayDuration }?: {
        autoPlay?: boolean; // 是否自动播放
        sampleRate?: number;
        resumePlayDuration?: number;
    }): void;
    play(): void;
    stop(): void;
    getAudioDataBlob(type: ISaveAudioData): Blob | undefined;
}
