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
const wasmHolder = {};

registerPaint('ripple', class {
    static get inputProperties() { return ['background-color', '--ripple-color', '--animation-tick', '--ripple-x', '--ripple-y']; }
    paint(ctx, geom, properties) {
      if (typeof wasmHolder.main === 'function') {
        console.log('wasm invocation', wasmHolder.main(10));
      } else {
        console.log('wasm is not ready yet');
      }
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

var Base64Binary = {
	_keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
	
	/* will return a  Uint8Array type */
	decodeArrayBuffer: function(input) {
		var bytes = (input.length/4) * 3;
		var ab = new ArrayBuffer(bytes);
		this.decode(input, ab);
		
		return ab;
	},

	removePaddingChars: function(input){
		var lkey = this._keyStr.indexOf(input.charAt(input.length - 1));
		if(lkey == 64){
			return input.substring(0,input.length - 1);
		}
		return input;
	},

	decode: function (input, arrayBuffer) {
		//get last chars to see if are valid
		input = this.removePaddingChars(input);
		input = this.removePaddingChars(input);

		var bytes = parseInt((input.length / 4) * 3, 10);
		
		var uarray;
		var chr1, chr2, chr3;
		var enc1, enc2, enc3, enc4;
		var i = 0;
		var j = 0;
		
		if (arrayBuffer)
			uarray = new Uint8Array(arrayBuffer);
		else
			uarray = new Uint8Array(bytes);
		
		input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
		
		for (i=0; i<bytes; i+=3) {	
			//get the 3 octects in 4 ascii chars
			enc1 = this._keyStr.indexOf(input.charAt(j++));
			enc2 = this._keyStr.indexOf(input.charAt(j++));
			enc3 = this._keyStr.indexOf(input.charAt(j++));
			enc4 = this._keyStr.indexOf(input.charAt(j++));
	
			chr1 = (enc1 << 2) | (enc2 >> 4);
			chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
			chr3 = ((enc3 & 3) << 6) | enc4;
	
			uarray[i] = chr1;			
			if (enc3 != 64) uarray[i+1] = chr2;
			if (enc4 != 64) uarray[i+2] = chr3;
		}
	
		return uarray;	
	}
}

const wasmBase64 = 'AGFzbQEAAAABCQJgAABgAX8BfwMDAgABBAUBcAEBAQUDAQACBhUDfwFBgIgEC38AQYCIBAt/AEGACAsHLAQGbWVtb3J5AgALX19oZWFwX2Jhc2UDAQpfX2RhdGFfZW5kAwIEbWFpbgABCgwCAgALBwAgAEEqagsAWQsuZGVidWdfaW5mb0kAAAAEAAAAAAAEAQAAAAAMACMAAAAAAAAAQwAAAAUAAAAHAAAAAgUAAAAHAAAAXAAAAAEERQAAAANlAAAAAQRFAAAAAARhAAAABQQAABAOLmRlYnVnX21hY2luZm8AAE8NLmRlYnVnX2FiYnJldgERASUOEwUDDhAXGw4RARIGAAACLgERARIGAw46CzsLJxlJEz8ZAAADBQADDjoLOwtJEwAABCQAAw4+CwsLAAAAAGILLmRlYnVnX2xpbmVSAAAABAA3AAAAAQEB+w4NAAEBAQEAAAABAAABL3RtcC9idWlsZF9naTkyenp2Z2FqdS4kAABmaWxlLmMAAQAAAAAFAgUAAAAVBQwKIQUDBlgCAQABAQByCi5kZWJ1Z19zdHJjbGFuZyB2ZXJzaW9uIDguMC4wICh0cnVuayAzNDE5NjApAC90bXAvYnVpbGRfZ2k5Mnp6dmdhanUuJC9maWxlLmMAL3RtcC9idWlsZF9naTkyenp2Z2FqdS4kAG1haW4AaW50AGEAACEEbmFtZQEaAgARX193YXNtX2NhbGxfY3RvcnMBBG1haW4=';

const ba = Base64Binary.decode(wasmBase64);

WebAssembly.instantiate(ba).then(result => {
  wasmHolder.main = result.instance.exports.main;
});