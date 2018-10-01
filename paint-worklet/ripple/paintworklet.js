/*
Copyright 2016 Google, Inc. All Rights Reserved.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

let main_foo = WebAssembly;

/*
fetch('main.wasm').then(response =>
  response.arrayBuffer()
).then(bytes => WebAssembly.instantiate(bytes)).then(results => {
  instance = results.instance;
  main_foo = instance.exports.main(10);
}).catch(console.error);
*/

registerPaint('ripple', class {
    static get inputProperties() { return ['background-color', '--ripple-color', '--animation-tick', '--ripple-x', '--ripple-y']; }
    paint(ctx, geom, properties) {
      console.log('function', typeof main_foo);
      console.log(this);
      const bgColor = properties.get('background-color').toString();
      const rippleColor = properties.get('--ripple-color').toString();
      const x = parseFloat(properties.get('--ripple-x').toString());
      const y = parseFloat(properties.get('--ripple-y').toString());
      let tick = parseFloat(properties.get('--animation-tick').toString());
      if(tick < 0)
        tick = 0;
      if(tick > 1000)
        tick = 1000;

      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, geom.width, geom.height);
      ctx.fillRect(0, 0, geom.width, geom.height);

      ctx.fillStyle = rippleColor;
      ctx.globalAlpha = 1 - tick/1000;
      ctx.arc(
        x, y, // center
        geom.width * tick/1000, // radius
        0, // startAngle
        2 * Math.PI //endAngle
      );
      ctx.fill();
    }
});

function _base64ToArrayBuffer(base64) {
  var binary_string =  atob(base64);
  var len = binary_string.length;
  var bytes = new Uint8Array( len );
  for (var i = 0; i < len; i++)        {
      bytes[i] = binary_string.charCodeAt(i);
  }
  return bytes.buffer;
}

const wasmBase64 = 'AGFzbQEAAAABCQJgAABgAX8BfwMDAgABBAUBcAEBAQUDAQACBhUDfwFBgIgEC38AQYCIBAt/AEGACAsHLAQGbWVtb3J5AgALX19oZWFwX2Jhc2UDAQpfX2RhdGFfZW5kAwIEbWFpbgABCgwCAgALBwAgAEEqagsAWQsuZGVidWdfaW5mb0kAAAAEAAAAAAAEAQAAAAAMACMAAAAAAAAAQwAAAAUAAAAHAAAAAgUAAAAHAAAAXAAAAAEERQAAAANlAAAAAQRFAAAAAARhAAAABQQAABAOLmRlYnVnX21hY2luZm8AAE8NLmRlYnVnX2FiYnJldgERASUOEwUDDhAXGw4RARIGAAACLgERARIGAw46CzsLJxlJEz8ZAAADBQADDjoLOwtJEwAABCQAAw4+CwsLAAAAAGILLmRlYnVnX2xpbmVSAAAABAA3AAAAAQEB+w4NAAEBAQEAAAABAAABL3RtcC9idWlsZF9naTkyenp2Z2FqdS4kAABmaWxlLmMAAQAAAAAFAgUAAAAVBQwKIQUDBlgCAQABAQByCi5kZWJ1Z19zdHJjbGFuZyB2ZXJzaW9uIDguMC4wICh0cnVuayAzNDE5NjApAC90bXAvYnVpbGRfZ2k5Mnp6dmdhanUuJC9maWxlLmMAL3RtcC9idWlsZF9naTkyenp2Z2FqdS4kAG1haW4AaW50AGEAACEEbmFtZQEaAgARX193YXNtX2NhbGxfY3RvcnMBBG1haW4=';
const ba = _base64ToArrayBuffer(wasmBase64);
WebAssembly.instantiate(ba).then(c => console.log(c));