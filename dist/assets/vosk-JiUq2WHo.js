let M;const P=new Uint8Array(16);function H(){if(!M&&(M=typeof crypto<"u"&&crypto.getRandomValues&&crypto.getRandomValues.bind(crypto),!M))throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");return M(P)}var N=/^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i;function V(t){return typeof t=="string"&&N.test(t)}const u=[];for(let t=0;t<256;++t)u.push((t+256).toString(16).slice(1));function W(t,r=0){return(u[t[r+0]]+u[t[r+1]]+u[t[r+2]]+u[t[r+3]]+"-"+u[t[r+4]]+u[t[r+5]]+"-"+u[t[r+6]]+u[t[r+7]]+"-"+u[t[r+8]]+u[t[r+9]]+"-"+u[t[r+10]]+u[t[r+11]]+u[t[r+12]]+u[t[r+13]]+u[t[r+14]]+u[t[r+15]]).toLowerCase()}function j(t){if(!V(t))throw TypeError("Invalid UUID");let r;const e=new Uint8Array(16);return e[0]=(r=parseInt(t.slice(0,8),16))>>>24,e[1]=r>>>16&255,e[2]=r>>>8&255,e[3]=r&255,e[4]=(r=parseInt(t.slice(9,13),16))>>>8,e[5]=r&255,e[6]=(r=parseInt(t.slice(14,18),16))>>>8,e[7]=r&255,e[8]=(r=parseInt(t.slice(19,23),16))>>>8,e[9]=r&255,e[10]=(r=parseInt(t.slice(24,36),16))/1099511627776&255,e[11]=r/4294967296&255,e[12]=r>>>24&255,e[13]=r>>>16&255,e[14]=r>>>8&255,e[15]=r&255,e}function B(t){t=unescape(encodeURIComponent(t));const r=[];for(let e=0;e<t.length;++e)r.push(t.charCodeAt(e));return r}const K="6ba7b810-9dad-11d1-80b4-00c04fd430c8",q="6ba7b811-9dad-11d1-80b4-00c04fd430c8";function T(t,r,e){function n(o,i,s,c){var a;if(typeof o=="string"&&(o=B(o)),typeof i=="string"&&(i=j(i)),((a=i)===null||a===void 0?void 0:a.length)!==16)throw TypeError("Namespace must be array-like (16 iterable integer values, 0-255)");let f=new Uint8Array(16+o.length);if(f.set(i),f.set(o,i.length),f=e(f),f[6]=f[6]&15|r,f[8]=f[8]&63|128,s){c=c||0;for(let w=0;w<16;++w)s[c+w]=f[w];return s}return W(f)}try{n.name=t}catch{}return n.DNS=K,n.URL=q,n}function x(t){if(typeof t=="string"){const r=unescape(encodeURIComponent(t));t=new Uint8Array(r.length);for(let e=0;e<r.length;++e)t[e]=r.charCodeAt(e)}return G(X(J(t),t.length*8))}function G(t){const r=[],e=t.length*32,n="0123456789abcdef";for(let o=0;o<e;o+=8){const i=t[o>>5]>>>o%32&255,s=parseInt(n.charAt(i>>>4&15)+n.charAt(i&15),16);r.push(s)}return r}function F(t){return(t+64>>>9<<4)+14+1}function X(t,r){t[r>>5]|=128<<r%32,t[F(r)-1]=r;let e=1732584193,n=-271733879,o=-1732584194,i=271733878;for(let s=0;s<t.length;s+=16){const c=e,a=n,f=o,w=i;e=d(e,n,o,i,t[s],7,-680876936),i=d(i,e,n,o,t[s+1],12,-389564586),o=d(o,i,e,n,t[s+2],17,606105819),n=d(n,o,i,e,t[s+3],22,-1044525330),e=d(e,n,o,i,t[s+4],7,-176418897),i=d(i,e,n,o,t[s+5],12,1200080426),o=d(o,i,e,n,t[s+6],17,-1473231341),n=d(n,o,i,e,t[s+7],22,-45705983),e=d(e,n,o,i,t[s+8],7,1770035416),i=d(i,e,n,o,t[s+9],12,-1958414417),o=d(o,i,e,n,t[s+10],17,-42063),n=d(n,o,i,e,t[s+11],22,-1990404162),e=d(e,n,o,i,t[s+12],7,1804603682),i=d(i,e,n,o,t[s+13],12,-40341101),o=d(o,i,e,n,t[s+14],17,-1502002290),n=d(n,o,i,e,t[s+15],22,1236535329),e=g(e,n,o,i,t[s+1],5,-165796510),i=g(i,e,n,o,t[s+6],9,-1069501632),o=g(o,i,e,n,t[s+11],14,643717713),n=g(n,o,i,e,t[s],20,-373897302),e=g(e,n,o,i,t[s+5],5,-701558691),i=g(i,e,n,o,t[s+10],9,38016083),o=g(o,i,e,n,t[s+15],14,-660478335),n=g(n,o,i,e,t[s+4],20,-405537848),e=g(e,n,o,i,t[s+9],5,568446438),i=g(i,e,n,o,t[s+14],9,-1019803690),o=g(o,i,e,n,t[s+3],14,-187363961),n=g(n,o,i,e,t[s+8],20,1163531501),e=g(e,n,o,i,t[s+13],5,-1444681467),i=g(i,e,n,o,t[s+2],9,-51403784),o=g(o,i,e,n,t[s+7],14,1735328473),n=g(n,o,i,e,t[s+12],20,-1926607734),e=h(e,n,o,i,t[s+5],4,-378558),i=h(i,e,n,o,t[s+8],11,-2022574463),o=h(o,i,e,n,t[s+11],16,1839030562),n=h(n,o,i,e,t[s+14],23,-35309556),e=h(e,n,o,i,t[s+1],4,-1530992060),i=h(i,e,n,o,t[s+4],11,1272893353),o=h(o,i,e,n,t[s+7],16,-155497632),n=h(n,o,i,e,t[s+10],23,-1094730640),e=h(e,n,o,i,t[s+13],4,681279174),i=h(i,e,n,o,t[s],11,-358537222),o=h(o,i,e,n,t[s+3],16,-722521979),n=h(n,o,i,e,t[s+6],23,76029189),e=h(e,n,o,i,t[s+9],4,-640364487),i=h(i,e,n,o,t[s+12],11,-421815835),o=h(o,i,e,n,t[s+15],16,530742520),n=h(n,o,i,e,t[s+2],23,-995338651),e=p(e,n,o,i,t[s],6,-198630844),i=p(i,e,n,o,t[s+7],10,1126891415),o=p(o,i,e,n,t[s+14],15,-1416354905),n=p(n,o,i,e,t[s+5],21,-57434055),e=p(e,n,o,i,t[s+12],6,1700485571),i=p(i,e,n,o,t[s+3],10,-1894986606),o=p(o,i,e,n,t[s+10],15,-1051523),n=p(n,o,i,e,t[s+1],21,-2054922799),e=p(e,n,o,i,t[s+8],6,1873313359),i=p(i,e,n,o,t[s+15],10,-30611744),o=p(o,i,e,n,t[s+6],15,-1560198380),n=p(n,o,i,e,t[s+13],21,1309151649),e=p(e,n,o,i,t[s+4],6,-145523070),i=p(i,e,n,o,t[s+11],10,-1120210379),o=p(o,i,e,n,t[s+2],15,718787259),n=p(n,o,i,e,t[s+9],21,-343485551),e=y(e,c),n=y(n,a),o=y(o,f),i=y(i,w)}return[e,n,o,i]}function J(t){if(t.length===0)return[];const r=t.length*8,e=new Uint32Array(F(r));for(let n=0;n<r;n+=8)e[n>>5]|=(t[n/8]&255)<<n%32;return e}function y(t,r){const e=(t&65535)+(r&65535);return(t>>16)+(r>>16)+(e>>16)<<16|e&65535}function Q(t,r){return t<<r|t>>>32-r}function _(t,r,e,n,o,i){return y(Q(y(y(r,t),y(n,i)),o),e)}function d(t,r,e,n,o,i,s){return _(r&e|~r&n,t,r,o,i,s)}function g(t,r,e,n,o,i,s){return _(r&n|e&~n,t,r,o,i,s)}function h(t,r,e,n,o,i,s){return _(r^e^n,t,r,o,i,s)}function p(t,r,e,n,o,i,s){return _(e^(r|~n),t,r,o,i,s)}T("v3",48,x);const Y=typeof crypto<"u"&&crypto.randomUUID&&crypto.randomUUID.bind(crypto);var C={randomUUID:Y};function Z(t,r,e){if(C.randomUUID&&!r&&!t)return C.randomUUID();t=t||{};const n=t.random||(t.rng||H)();return n[6]=n[6]&15|64,n[8]=n[8]&63|128,W(n)}function ee(t,r,e,n){switch(t){case 0:return r&e^~r&n;case 1:return r^e^n;case 2:return r&e^r&n^e&n;case 3:return r^e^n}}function A(t,r){return t<<r|t>>>32-r}function te(t){const r=[1518500249,1859775393,2400959708,3395469782],e=[1732584193,4023233417,2562383102,271733878,3285377520];if(typeof t=="string"){const s=unescape(encodeURIComponent(t));t=[];for(let c=0;c<s.length;++c)t.push(s.charCodeAt(c))}else Array.isArray(t)||(t=Array.prototype.slice.call(t));t.push(128);const n=t.length/4+2,o=Math.ceil(n/16),i=new Array(o);for(let s=0;s<o;++s){const c=new Uint32Array(16);for(let a=0;a<16;++a)c[a]=t[s*64+a*4]<<24|t[s*64+a*4+1]<<16|t[s*64+a*4+2]<<8|t[s*64+a*4+3];i[s]=c}i[o-1][14]=(t.length-1)*8/Math.pow(2,32),i[o-1][14]=Math.floor(i[o-1][14]),i[o-1][15]=(t.length-1)*8&4294967295;for(let s=0;s<o;++s){const c=new Uint32Array(80);for(let l=0;l<16;++l)c[l]=i[s][l];for(let l=16;l<80;++l)c[l]=A(c[l-3]^c[l-8]^c[l-14]^c[l-16],1);let a=e[0],f=e[1],w=e[2],L=e[3],U=e[4];for(let l=0;l<80;++l){const k=Math.floor(l/20),O=A(a,5)+ee(k,f,w,L)+U+r[k]+c[l]>>>0;U=L,L=w,w=A(f,30)>>>0,f=a,a=O}e[0]=e[0]+a>>>0,e[1]=e[1]+f>>>0,e[2]=e[2]+w>>>0,e[3]=e[3]+L>>>0,e[4]=e[4]+U>>>0}return[e[0]>>24&255,e[0]>>16&255,e[0]>>8&255,e[0]&255,e[1]>>24&255,e[1]>>16&255,e[1]>>8&255,e[1]&255,e[2]>>24&255,e[2]>>16&255,e[2]>>8&255,e[2]&255,e[3]>>24&255,e[3]>>16&255,e[3]>>8&255,e[3]&255,e[4]>>24&255,e[4]>>16&255,e[4]>>8&255,e[4]&255]}T("v5",80,te);var I;(function(t){function r(a){return(a==null?void 0:a.action)==="terminate"}t.isTerminateMessage=r;function e(a){return(a==null?void 0:a.action)==="load"}t.isLoadMessage=e;function n(a){return(a==null?void 0:a.action)==="set"}t.isSetMessage=n;function o(a){return(a==null?void 0:a.action)==="audioChunk"}t.isAudioChunkMessage=o;function i(a){return(a==null?void 0:a.action)==="create"}t.isRecognizerCreateMessage=i;function s(a){return(a==null?void 0:a.action)==="retrieveFinalResult"}t.isRecognizerRetrieveFinalResultMessage=s;function c(a){return(a==null?void 0:a.action)==="remove"}t.isRecognizerRemoveMessage=c})(I||(I={}));var z;(function(t){function r(e){return(e==null?void 0:e.event)==="load"}t.isLoadResult=r})(z||(z={}));var b;(function(t){function r(o){return["result","partialresult"].includes(o.event)||Reflect.has(o,"recognizerId")}t.isRecognizerMessage=r;function e(o){var i,s;return((i=o==null?void 0:o.result)==null?void 0:i.text)!=null||((s=o==null?void 0:o.result)==null?void 0:s.result)!=null}t.isResult=e;function n(o){var i;return((i=o==null?void 0:o.result)==null?void 0:i.partial)!=null}t.isPartialResult=n})(b||(b={}));class ne{constructor(r=0){this.logLevel=0,this.setLogLevel(r)}getLogLevel(){return this.logLevel}setLogLevel(r){typeof r=="number"&&(this.logLevel=r)}error(r){}warn(r){}info(r){}verbose(r){}debug(r){}}let R,m=null;function D(){return(m===null||m.byteLength===0)&&(m=new Float32Array(R.memory.buffer)),m}let S=0;function re(t,r){const e=r(t.length*4,4)>>>0;return D().set(t,e/4),S=t.length,e}let v=null;function E(){return(v===null||v.byteLength===0)&&(v=new Int32Array(R.memory.buffer)),v}function oe(t,r){return t=t>>>0,D().subarray(t/4,t/4+r)}function ie(t){try{const o=R.__wbindgen_add_to_stack_pointer(-16),i=re(t,R.__wbindgen_malloc),s=S;R.change_range(o,i,s);var r=E()[o/4+0],e=E()[o/4+1],n=oe(r,e).slice();return R.__wbindgen_free(r,e*4,4),n}finally{R.__wbindgen_add_to_stack_pointer(16)}}async function se(t,r){if(typeof Response=="function"&&t instanceof Response){if(typeof WebAssembly.instantiateStreaming=="function")try{return await WebAssembly.instantiateStreaming(t,r)}catch(n){if(t.headers.get("Content-Type")!="application/wasm")console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n",n);else throw n}const e=await t.arrayBuffer();return await WebAssembly.instantiate(e,r)}else{const e=await WebAssembly.instantiate(t,r);return e instanceof WebAssembly.Instance?{instance:e,module:t}:e}}function ae(){const t={};return t.wbg={},t}function ce(t,r){return R=t.exports,$.__wbindgen_wasm_module=r,m=null,v=null,R}async function $(t){if(R!==void 0)return R;typeof t>"u"&&(t=new URL(new URL(""+new URL("voice2text-helper_bg-CCDcHy2C.wasm",import.meta.url).href,import.meta.url).href,import.meta.url));const r=ae();(typeof t=="string"||typeof Request=="function"&&t instanceof Request||typeof URL=="function"&&t instanceof URL)&&(t=fetch(t));const{instance:e,module:n}=await se(await t,r);return ce(e,n)}$();class fe extends EventTarget{constructor(r,e=0){super(),this.modelUrl=r,this._ready=!1,this.logger=new ne,this.recognizers=new Map,this.logger.setLogLevel(e),window.Worker&&fetch(new URL(new URL(""+new URL("vosk-worker-DMhr_11l.js",import.meta.url).href,import.meta.url).href,import.meta.url).toString(),{mode:"cors"}).then(n=>n.blob()).then(n=>{const o=URL.createObjectURL(n);this.worker=new Worker(o,{name:new URL(new URL(""+new URL("vosk-DdwblAMH.wasm",import.meta.url).href,import.meta.url).href,import.meta.url).toString(),type:"module"}),this.initialize()}).catch(n=>{console.error(n)})}initialize(){this.worker.addEventListener("message",r=>this.handleMessage(r)),this.postMessage({action:"set",key:"logLevel",value:this.logger.getLogLevel()}),this.postMessage({action:"load",modelUrl:this.modelUrl})}postMessage(r,e){this.worker.postMessage(r,e)}handleMessage(r){const e=r.data;if(e){z.isLoadResult(e)&&(this._ready=e.result);const n=new CustomEvent(e.event,{detail:e});if(b.isRecognizerMessage(e)&&e.recognizerId){const o=this.recognizers.get(e.recognizerId);if(o){o.dispatchEvent(n);return}}this.dispatchEvent(n)}}on(r,e){this.addEventListener(r,n=>{n.detail&&!b.isRecognizerMessage(n.detail)&&e(n.detail)})}registerPort(r){this.logger.debug(`Registering port ${r}`),this.messagePort=r,this.messagePort.onmessage=this.forwardMessage.bind(this)}forwardMessage(r){const e=r.data;I.isAudioChunkMessage(e)&&this.postMessage(e,{transfer:[e.data.buffer]})}get ready(){return this._ready}terminate(){this.postMessage({action:"terminate"}),this._ready=!1}setLogLevel(r){this.logger.setLogLevel(r),this.postMessage({action:"set",key:"logLevel",value:r})}registerRecognizer(r){this.recognizers.set(r.id,r)}unregisterRecognizer(r){this.recognizers.delete(r)}get KaldiRecognizer(){const r=this;return class extends EventTarget{constructor(e,n){if(super(),this.id=Z(),!r.ready)throw new Error("Cannot create KaldiRecognizer. Model is either not ready or has been terminated");r.registerRecognizer(this),r.postMessage({action:"create",recognizerId:this.id,sampleRate:e,grammar:n})}on(e,n){this.addEventListener(e,o=>{n(o==null?void 0:o.detail)})}setWords(e){r.postMessage({action:"set",recognizerId:this.id,key:"words",value:e})}acceptWaveform(e){if(e.numberOfChannels<1)throw new Error("AudioBuffer should contain at least one channel");this.acceptWaveformFloat(e.getChannelData(0),e.sampleRate)}acceptWaveformFloat(e,n){const o=ie(e);if(!(o instanceof Float32Array))throw new Error(`Channel data is not a Float32Array as expected: ${o}`);r.logger.debug(`Recognizer (id: ${this.id}): Sending audioChunk 0=${o[0]} ${o.length}=${o[o.length-1]}`),r.postMessage({action:"audioChunk",data:o,recognizerId:this.id,sampleRate:n},{transfer:[o.buffer]})}retrieveFinalResult(){r.postMessage({action:"retrieveFinalResult",recognizerId:this.id})}remove(){r.unregisterRecognizer(this.id),r.postMessage({action:"remove",recognizerId:this.id})}}}}async function le(t,r=0){const e=new fe(t,r);return new Promise((n,o)=>e.on("load",i=>{i.result&&n(e),o()}))}export{fe as Model,le as createModel};
