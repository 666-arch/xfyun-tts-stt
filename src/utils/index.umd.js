!(function (t, i) {
  "object" == typeof exports && "undefined" != typeof module
    ? (module.exports = i())
    : "function" == typeof define && define.amd
    ? define(i)
    : ((t =
        "undefined" != typeof globalThis ? globalThis : t || self).AudioPlayer =
        i());
})(this, function () {
  "use strict";
  function t(t, i, a) {
    for (var e = 0; e < a.length; e++) t.setUint8(i + e, a.charCodeAt(e));
  }
  function i(i, a, e) {
    var o = (function (i, a, e, o, s) {
      var n = i.reduce(function (t, i) {
          return t + i.byteLength;
        }, 0),
        u = new ArrayBuffer(44 + n),
        r = new DataView(u),
        d = e,
        h = 0;
      return (
        t(r, h, "RIFF"),
        (h += 4),
        r.setUint32(h, 36 + n, !0),
        t(r, (h += 4), "WAVE"),
        t(r, (h += 4), "fmt "),
        (h += 4),
        r.setUint32(h, 16, !0),
        (h += 4),
        r.setUint16(h, 1, !0),
        (h += 2),
        r.setUint16(h, d, !0),
        (h += 2),
        r.setUint32(h, a, !0),
        (h += 4),
        r.setUint32(h, d * a * (o / 8), !0),
        (h += 4),
        r.setUint16(h, d * (o / 8), !0),
        (h += 2),
        r.setUint16(h, o, !0),
        t(r, (h += 2), "data"),
        (h += 4),
        r.setUint32(h, n, !0),
        (h += 4),
        i.forEach(function (t) {
          for (var i = new DataView(t.buffer), a = 0; a < t.byteLength; )
            r.setUint8(h, i.getUint8(a)), h++, a++;
        }),
        r
      );
    })(i, a || 16e3, 1, e || 16);
    return new Blob([o], { type: "audio/wav" });
  }
  return (function () {
    function t(t) {
      (this.toSampleRate = 22050),
        (this.resumePlayDuration = 1e3),
        (this.fromSampleRate = 16e3),
        (this.isAudioDataEnded = !1),
        (this.status = "uninit"),
        (this.audioDatas = []),
        (this.pcmAudioDatas = []),
        (this.audioDataOffset = 0),
        (this.processor = new Worker("".concat(t, "/processor.worker.js")));
    }
    return (
      (t.prototype.postMessage = function (t) {
        var i = t.type,
          a = t.data,
          e = t.isLastData;
        "uninit" !== this.status &&
          (this.processor.postMessage({ type: i, data: a }),
          (this.isAudioDataEnded = e));
      }),
      (t.prototype.playAudio = function () {
        var t = this;
        if ((clearTimeout(this.playAudioTime), this.audioContext)) {
          for (
            var i = 0, a = this.audioDataOffset;
            a < this.audioDatas.length;
            a++
          )
            i += this.audioDatas[a].length;
          if (!i)
            return void (
              "play" === this.status &&
              (this.isAudioDataEnded || this.resumePlayDuration <= 0
                ? this.stop()
                : (this.playAudioTime = setTimeout(function () {
                    t.playAudio();
                  }, this.resumePlayDuration)))
            );
          for (
            var e = this.audioContext.createBuffer(1, i, this.toSampleRate),
              o = e.getChannelData(0),
              s = this.audioDatas[this.audioDataOffset],
              n = 0;
            s;

          ) {
            if (((this.audioDataOffset += 1), e.copyToChannel))
              e.copyToChannel(s, 0, n), (n += s.length);
            else for (a = 0; a < s.length; a++) o[a] = s[a];
            s = this.audioDatas[this.audioDataOffset];
          }
          var u = this.audioContext.createBufferSource();
          (this.bufferSource = u),
            (u.buffer = e),
            u.connect(this.audioContext.destination),
            u.start(),
            (u.onended = function (i) {
              "play" === t.status &&
                (t.audioDatas.length
                  ? t.playAudio()
                  : t.isAudioDataEnded || t.resumePlayDuration <= 0
                  ? t.stop()
                  : (t.playAudioTime = setTimeout(function () {
                      t.playAudio();
                    }, t.resumePlayDuration)));
            });
        }
      }),
      (t.prototype.reset = function () {
        var t;
        (this.processor.onmessage = null),
          (this.audioDataOffset = 0),
          (this.audioDatas = []),
          (this.pcmAudioDatas = []),
          (this.status = "uninit"),
          (this.isAudioDataEnded = !1),
          clearTimeout(this.playAudioTime);
        try {
          null === (t = this.bufferSource) || void 0 === t || t.stop();
        } catch (t) {
          console.log(t);
        }
      }),
      (t.prototype.start = function (t) {
        var i = this,
          a = void 0 === t ? {} : t,
          e = a.autoPlay,
          o = void 0 === e || e,
          s = a.sampleRate,
          n = void 0 === s ? 16e3 : s,
          u = a.resumePlayDuration,
          r = void 0 === u ? 1e3 : u;
        this.reset(), (this.status = "init"), (this.resumePlayDuration = r);
        var d = n,
          h = Math.max(d, 22050);
        (h = Math.min(h, 96e3)),
          (this.fromSampleRate = d),
          (this.toSampleRate = h),
          this.processor.postMessage({
            type: "init",
            data: { fromSampleRate: d, toSampleRate: h },
          }),
          (this.processor.onmessage = function (t) {
            var a = t.data,
              e = a.audioData,
              s = a.pcmAudioData;
            i.audioDatas.push(e),
              i.pcmAudioDatas.push(s),
              1 === i.audioDatas.length && o && "init" === i.status && i.play();
          });
      }),
      (t.prototype.play = function () {
        var t;
        this.audioContext ||
          ((this.audioContext = new (window.AudioContext ||
            window.webkitAudioContext)()),
          this.audioContext.resume()),
          this.audioContext &&
            ((this.status = "play"),
            null === (t = this.onPlay) || void 0 === t || t.call(this),
            this.playAudio());
      }),
      (t.prototype.stop = function () {
        var t, i;
        (this.audioDataOffset = 0),
          (this.status = "stop"),
          clearTimeout(this.playAudioTime);
        try {
          null === (t = this.bufferSource) || void 0 === t || t.stop(),
            null === (i = this.onStop) ||
              void 0 === i ||
              i.call(this, this.audioDatas);
        } catch (t) {
          console.log(t);
        }
      }),
      (t.prototype.getAudioDataBlob = function (t) {
        var a, e;
        if (
          null === (a = this.pcmAudioDatas) || void 0 === a ? void 0 : a.length
        )
          return "wav" === t
            ? i(this.pcmAudioDatas, this.fromSampleRate, 16)
            : ((e = this.pcmAudioDatas), new Blob(e, { type: "audio/pcm" }));
      }),
      t
    );
  })();
});
