!(function () {
  "use strict";
  self.onmessage = function (a) {
    var t = a.data,
      e = t.type,
      r = t.data,
      o = r;
    if ("init" === e) {
      var n = r.fromSampleRate,
        l = r.toSampleRate;
      return (self.fromSampleRate = n), void (self.toSampleRate = l);
    }
    if (("base64" === e && (o = atob(r)), "string" == typeof o)) {
      for (
        var f = new Uint8Array(o.length + (o.length % 2)), i = 0;
        i < o.length;
        ++i
      )
        f[i] = o.charCodeAt(i);
      o = new Int16Array(f.buffer);
    }
    var s = o;
    "Float32Array" !== e &&
      (o = (function (a) {
        for (var t = [], e = 0; e < a.length; e++) {
          var r = a[e] < 0 ? a[e] / 32768 : a[e] / 32767;
          t.push(r);
        }
        return new Float32Array(t);
      })(o)),
      (o = (function (a, t, e) {
        var r = Math.round(a.length * (e / t)),
          o = new Float32Array(r),
          n = (a.length - 1) / (r - 1);
        o[0] = a[0];
        for (var l = 1; l < r - 1; l++) {
          var f = l * n,
            i = Math.floor(f).toFixed(),
            s = Math.ceil(f).toFixed(),
            u = f - i;
          o[l] = a[i] + (a[s] - a[i]) * u;
        }
        return (o[r - 1] = a[a.length - 1]), o;
      })(o, self.fromSampleRate, self.toSampleRate)),
      self.postMessage({ audioData: o, pcmAudioData: s });
  };
})();
