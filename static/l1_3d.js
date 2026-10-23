(()=>{var ld=Object.defineProperty;var cd=(i,e,t)=>e in i?ld(i,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):i[e]=t;var Bn=(i,e,t)=>cd(i,typeof e!="symbol"?e+"":e,t);var po="186";var Nh=0,Ql=1,Uh=2;var ns=1,Fh=2,Vs=3,Oi=0,cn=1,Ht=2,ii=0,zi=1,jt=2,jl=3,ec=4,Bh=5;var is=100,Oh=101,zh=102,Gh=103,Vh=104,kh=200,Hh=201,Wh=202,Xh=203,tc=204,nc=205,qh=206,Yh=207,Zh=208,Jh=209,$h=210,Kh=211,Qh=212,jh=213,eu=214,Ea=0,Ca=1,Ra=2,Rs=3,Pa=4,Ia=5,La=6,Da=7,ic=0,tu=1,nu=2,Xn=0,sc=1,rc=2,ac=3,Br=4,oc=5,lc=6,cc=7;var hc=300,Gi=301,ss=302,mo=303,go=304,Or=306,Ii=1e3,Kn=1001,Na=1002,on=1003,iu=1004;var zr=1005;var ln=1006,_o=1007;var Vi=1008;var bn=1009,uc=1010,dc=1011,ks=1012,xo=1013,qn=1014,Ln=1015,Yn=1016,yo=1017,vo=1018,Hs=1020,fc=35902,pc=35899,mc=1021,gc=1022,Dn=1023,Qn=1026,ki=1027,Mo=1028,So=1029,Hi=1030,bo=1031;var To=1033,Gr=33776,Vr=33777,kr=33778,Hr=33779,wo=35840,Ao=35841,Eo=35842,Co=35843,Ro=36196,Po=37492,Io=37496,Lo=37488,Do=37489,Wr=37490,No=37491,Uo=37808,Fo=37809,Bo=37810,Oo=37811,zo=37812,Go=37813,Vo=37814,ko=37815,Ho=37816,Wo=37817,Xo=37818,qo=37819,Yo=37820,Zo=37821,Jo=36492,$o=36494,Ko=36495,Qo=36283,jo=36284,Xr=36285,el=36286;var ur=2300,Ua=2301,wa=2302,Vl=2303,kl=2400,Hl=2401,Wl=2402;var su=3200;var tl=0,ru=1,xi="",qt="srgb",dr="srgb-linear",fr="linear",Tt="srgb";var Aa=7680;var au=519,ou=512,lu=513,cu=514,nl=515,hu=516,uu=517,il=518,du=519,_c=35044;var xc="300 es",kn=2e3,Ps=2001;function hd(i){for(let e=i.length-1;e>=0;--e)if(i[e]>=65535)return!0;return!1}function ud(i){return ArrayBuffer.isView(i)&&!(i instanceof DataView)}function pr(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function fu(){let i=pr("canvas");return i.style.display="block",i}var Qc={},Is=null;function mr(...i){let e="THREE."+i.shift();Is?Is("log",e,...i):console.log(e,...i)}function pu(i){let e=i[0];if(typeof e=="string"&&e.startsWith("TSL:")){let t=i[1];t&&t.isStackTrace?i[0]+=" "+t.getLocation():i[1]='Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.'}return i}function qe(...i){i=pu(i);let e="THREE."+i.shift();if(Is)Is("warn",e,...i);else{let t=i[0];t&&t.isStackTrace?console.warn(t.getError(e)):console.warn(e,...i)}}function Ze(...i){i=pu(i);let e="THREE."+i.shift();if(Is)Is("error",e,...i);else{let t=i[0];t&&t.isStackTrace?console.error(t.getError(e)):console.error(e,...i)}}function Zi(...i){let e=i.join(" ");e in Qc||(Qc[e]=!0,qe(...i))}function mu(i,e,t){return new Promise(function(n,s){function r(){switch(i.clientWaitSync(e,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:s();break;case i.TIMEOUT_EXPIRED:setTimeout(r,t);break;default:n()}}setTimeout(r,t)})}var gu={[Ea]:Ca,[Ra]:La,[Pa]:Da,[Rs]:Ia,[Ca]:Ea,[La]:Ra,[Da]:Pa,[Ia]:Rs},jn=class{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});let n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){let n=this._listeners;return n===void 0?!1:n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){let n=this._listeners;if(n===void 0)return;let s=n[e];if(s!==void 0){let r=s.indexOf(t);r!==-1&&s.splice(r,1)}}dispatchEvent(e){let t=this._listeners;if(t===void 0)return;let n=t[e.type];if(n!==void 0){e.target=this;let s=n.slice(0);for(let r=0,a=s.length;r<a;r++)s[r].call(this,e);e.target=null}}},fn=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];var fl=Math.PI/180,gr=180/Math.PI;function Pi(){let i=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(fn[i&255]+fn[i>>8&255]+fn[i>>16&255]+fn[i>>24&255]+"-"+fn[e&255]+fn[e>>8&255]+"-"+fn[e>>16&15|64]+fn[e>>24&255]+"-"+fn[t&63|128]+fn[t>>8&255]+"-"+fn[t>>16&255]+fn[t>>24&255]+fn[n&255]+fn[n>>8&255]+fn[n>>16&255]+fn[n>>24&255]).toLowerCase()}function ht(i,e,t){return Math.max(e,Math.min(t,i))}function dd(i,e){return(i%e+e)%e}function pl(i,e,t){return(1-t)*i+t*e}function $n(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:case Uint8ClampedArray:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("THREE.MathUtils: Invalid component type.")}}function Ct(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:case Uint8ClampedArray:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("THREE.MathUtils: Invalid component type.")}}var Tc=class Tc{constructor(e=0,t=0){this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("THREE.Vector2: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("THREE.Vector2: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){let t=this.x,n=this.y,s=e.elements;return this.x=s[0]*t+s[3]*n+s[6],this.y=s[1]*t+s[4]*n+s[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=ht(this.x,e.x,t.x),this.y=ht(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=ht(this.x,e,t),this.y=ht(this.y,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(ht(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(ht(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){let n=Math.cos(t),s=Math.sin(t),r=this.x-e.x,a=this.y-e.y;return this.x=r*n-a*s+e.x,this.y=r*s+a*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}};Tc.prototype.isVector2=!0;var Pe=Tc,ei=class{constructor(e=0,t=0,n=0,s=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=s}static slerpFlat(e,t,n,s,r,a,o){let c=n[s+0],l=n[s+1],u=n[s+2],p=n[s+3],h=r[a+0],f=r[a+1],g=r[a+2],v=r[a+3];if(p!==v||c!==h||l!==f||u!==g){let m=c*h+l*f+u*g+p*v;m<0&&(h=-h,f=-f,g=-g,v=-v,m=-m);let d=1-o;if(m<.9995){let S=Math.acos(m),E=Math.sin(S);d=Math.sin(d*S)/E,o=Math.sin(o*S)/E,c=c*d+h*o,l=l*d+f*o,u=u*d+g*o,p=p*d+v*o}else{c=c*d+h*o,l=l*d+f*o,u=u*d+g*o,p=p*d+v*o;let S=1/Math.sqrt(c*c+l*l+u*u+p*p);c*=S,l*=S,u*=S,p*=S}}e[t]=c,e[t+1]=l,e[t+2]=u,e[t+3]=p}static multiplyQuaternionsFlat(e,t,n,s,r,a){let o=n[s],c=n[s+1],l=n[s+2],u=n[s+3],p=r[a],h=r[a+1],f=r[a+2],g=r[a+3];return e[t]=o*g+u*p+c*f-l*h,e[t+1]=c*g+u*h+l*p-o*f,e[t+2]=l*g+u*f+o*h-c*p,e[t+3]=u*g-o*p-c*h-l*f,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,s){return this._x=e,this._y=t,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){let n=e._x,s=e._y,r=e._z,a=e._order,o=Math.cos,c=Math.sin,l=o(n/2),u=o(s/2),p=o(r/2),h=c(n/2),f=c(s/2),g=c(r/2);switch(a){case"XYZ":this._x=h*u*p+l*f*g,this._y=l*f*p-h*u*g,this._z=l*u*g+h*f*p,this._w=l*u*p-h*f*g;break;case"YXZ":this._x=h*u*p+l*f*g,this._y=l*f*p-h*u*g,this._z=l*u*g-h*f*p,this._w=l*u*p+h*f*g;break;case"ZXY":this._x=h*u*p-l*f*g,this._y=l*f*p+h*u*g,this._z=l*u*g+h*f*p,this._w=l*u*p-h*f*g;break;case"ZYX":this._x=h*u*p-l*f*g,this._y=l*f*p+h*u*g,this._z=l*u*g-h*f*p,this._w=l*u*p+h*f*g;break;case"YZX":this._x=h*u*p+l*f*g,this._y=l*f*p+h*u*g,this._z=l*u*g-h*f*p,this._w=l*u*p-h*f*g;break;case"XZY":this._x=h*u*p-l*f*g,this._y=l*f*p-h*u*g,this._z=l*u*g+h*f*p,this._w=l*u*p+h*f*g;break;default:qe("Quaternion: .setFromEuler() encountered an unknown order: "+a)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){let n=t/2,s=Math.sin(n);return this._x=e.x*s,this._y=e.y*s,this._z=e.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){let t=e.elements,n=t[0],s=t[4],r=t[8],a=t[1],o=t[5],c=t[9],l=t[2],u=t[6],p=t[10],h=n+o+p;if(h>0){let f=.5/Math.sqrt(h+1);this._w=.25/f,this._x=(u-c)*f,this._y=(r-l)*f,this._z=(a-s)*f}else if(n>o&&n>p){let f=2*Math.sqrt(1+n-o-p);this._w=(u-c)/f,this._x=.25*f,this._y=(s+a)/f,this._z=(r+l)/f}else if(o>p){let f=2*Math.sqrt(1+o-n-p);this._w=(r-l)/f,this._x=(s+a)/f,this._y=.25*f,this._z=(c+u)/f}else{let f=2*Math.sqrt(1+p-n-o);this._w=(a-s)/f,this._x=(r+l)/f,this._y=(c+u)/f,this._z=.25*f}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<1e-8?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(ht(this.dot(e),-1,1)))}rotateTowards(e,t){let n=this.angleTo(e);if(n===0)return this;let s=Math.min(1,t/n);return this.slerp(e,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){let n=e._x,s=e._y,r=e._z,a=e._w,o=t._x,c=t._y,l=t._z,u=t._w;return this._x=n*u+a*o+s*l-r*c,this._y=s*u+a*c+r*o-n*l,this._z=r*u+a*l+n*c-s*o,this._w=a*u-n*o-s*c-r*l,this._onChangeCallback(),this}slerp(e,t){let n=e._x,s=e._y,r=e._z,a=e._w,o=this.dot(e);o<0&&(n=-n,s=-s,r=-r,a=-a,o=-o);let c=1-t;if(o<.9995){let l=Math.acos(o),u=Math.sin(l);c=Math.sin(c*l)/u,t=Math.sin(t*l)/u,this._x=this._x*c+n*t,this._y=this._y*c+s*t,this._z=this._z*c+r*t,this._w=this._w*c+a*t,this._onChangeCallback()}else this._x=this._x*c+n*t,this._y=this._y*c+s*t,this._z=this._z*c+r*t,this._w=this._w*c+a*t,this.normalize();return this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){let e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),s=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(s*Math.sin(e),s*Math.cos(e),r*Math.sin(t),r*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},wc=class wc{constructor(e=0,t=0,n=0){this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("THREE.Vector3: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("THREE.Vector3: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(jc.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(jc.setFromAxisAngle(e,t))}applyMatrix3(e){let t=this.x,n=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6]*s,this.y=r[1]*t+r[4]*n+r[7]*s,this.z=r[2]*t+r[5]*n+r[8]*s,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){let t=this.x,n=this.y,s=this.z,r=e.elements,a=1/(r[3]*t+r[7]*n+r[11]*s+r[15]);return this.x=(r[0]*t+r[4]*n+r[8]*s+r[12])*a,this.y=(r[1]*t+r[5]*n+r[9]*s+r[13])*a,this.z=(r[2]*t+r[6]*n+r[10]*s+r[14])*a,this}applyQuaternion(e){let t=this.x,n=this.y,s=this.z,r=e.x,a=e.y,o=e.z,c=e.w,l=2*(a*s-o*n),u=2*(o*t-r*s),p=2*(r*n-a*t);return this.x=t+c*l+a*p-o*u,this.y=n+c*u+o*l-r*p,this.z=s+c*p+r*u-a*l,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){let t=this.x,n=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[4]*n+r[8]*s,this.y=r[1]*t+r[5]*n+r[9]*s,this.z=r[2]*t+r[6]*n+r[10]*s,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=ht(this.x,e.x,t.x),this.y=ht(this.y,e.y,t.y),this.z=ht(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=ht(this.x,e,t),this.y=ht(this.y,e,t),this.z=ht(this.z,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(ht(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){let n=e.x,s=e.y,r=e.z,a=t.x,o=t.y,c=t.z;return this.x=s*c-r*o,this.y=r*a-n*c,this.z=n*o-s*a,this}projectOnVector(e){let t=e.lengthSq();if(t===0)return this.set(0,0,0);let n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return ml.copy(this).projectOnVector(e),this.sub(ml)}reflect(e){return this.sub(ml.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(ht(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y,s=this.z-e.z;return t*t+n*n+s*s}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){let s=Math.sin(t)*e;return this.x=s*Math.sin(n),this.y=Math.cos(t)*e,this.z=s*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){let t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),s=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=s,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}};wc.prototype.isVector3=!0;var P=wc,ml=new P,jc=new ei,Ac=class Ac{constructor(e,t,n,s,r,a,o,c,l){this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,s,r,a,o,c,l)}set(e,t,n,s,r,a,o,c,l){let u=this.elements;return u[0]=e,u[1]=s,u[2]=o,u[3]=t,u[4]=r,u[5]=c,u[6]=n,u[7]=a,u[8]=l,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){let t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,s=t.elements,r=this.elements,a=n[0],o=n[3],c=n[6],l=n[1],u=n[4],p=n[7],h=n[2],f=n[5],g=n[8],v=s[0],m=s[3],d=s[6],S=s[1],E=s[4],y=s[7],b=s[2],T=s[5],I=s[8];return r[0]=a*v+o*S+c*b,r[3]=a*m+o*E+c*T,r[6]=a*d+o*y+c*I,r[1]=l*v+u*S+p*b,r[4]=l*m+u*E+p*T,r[7]=l*d+u*y+p*I,r[2]=h*v+f*S+g*b,r[5]=h*m+f*E+g*T,r[8]=h*d+f*y+g*I,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],a=e[4],o=e[5],c=e[6],l=e[7],u=e[8];return t*a*u-t*o*l-n*r*u+n*o*c+s*r*l-s*a*c}invert(){let e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],a=e[4],o=e[5],c=e[6],l=e[7],u=e[8],p=u*a-o*l,h=o*c-u*r,f=l*r-a*c,g=t*p+n*h+s*f;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);let v=1/g;return e[0]=p*v,e[1]=(s*l-u*n)*v,e[2]=(o*n-s*a)*v,e[3]=h*v,e[4]=(u*t-s*c)*v,e[5]=(s*r-o*t)*v,e[6]=f*v,e[7]=(n*c-l*t)*v,e[8]=(a*t-n*r)*v,this}transpose(){let e,t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){let t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,s,r,a,o){let c=Math.cos(r),l=Math.sin(r);return this.set(n*c,n*l,-n*(c*a+l*o)+a+e,-s*l,s*c,-s*(-l*a+c*o)+o+t,0,0,1),this}scale(e,t){return Zi("Matrix3: .scale() is deprecated. Use .makeScale() instead."),this.premultiply(gl.makeScale(e,t)),this}rotate(e){return Zi("Matrix3: .rotate() is deprecated. Use .makeRotation() instead."),this.premultiply(gl.makeRotation(-e)),this}translate(e,t){return Zi("Matrix3: .translate() is deprecated. Use .makeTranslation() instead."),this.premultiply(gl.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){let t=this.elements,n=e.elements;for(let s=0;s<9;s++)if(t[s]!==n[s])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}};Ac.prototype.isMatrix3=!0;var je=Ac,gl=new je,eh=new je().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),th=new je().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function fd(){let i={enabled:!0,workingColorSpace:dr,spaces:{},convert:function(s,r,a){return this.enabled===!1||r===a||!r||!a||(this.spaces[r].transfer===Tt&&(s.r=di(s.r),s.g=di(s.g),s.b=di(s.b)),this.spaces[r].primaries!==this.spaces[a].primaries&&(s.applyMatrix3(this.spaces[r].toXYZ),s.applyMatrix3(this.spaces[a].fromXYZ)),this.spaces[a].transfer===Tt&&(s.r=Cs(s.r),s.g=Cs(s.g),s.b=Cs(s.b))),s},workingToColorSpace:function(s,r){return this.convert(s,this.workingColorSpace,r)},colorSpaceToWorking:function(s,r){return this.convert(s,r,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===xi?fr:this.spaces[s].transfer},getToneMappingMode:function(s){return this.spaces[s].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(s,r=this.workingColorSpace){return s.fromArray(this.spaces[r].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,r,a){return s.copy(this.spaces[r].toXYZ).multiply(this.spaces[a].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(s,r){return Zi("ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),i.workingToColorSpace(s,r)},toWorkingColorSpace:function(s,r){return Zi("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),i.colorSpaceToWorking(s,r)}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],n=[.3127,.329];return i.define({[dr]:{primaries:e,whitePoint:n,transfer:fr,toXYZ:eh,fromXYZ:th,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:qt},outputColorSpaceConfig:{drawingBufferColorSpace:qt}},[qt]:{primaries:e,whitePoint:n,transfer:Tt,toXYZ:eh,fromXYZ:th,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:qt}}}),i}var dt=fd();function di(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function Cs(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}var hs,Fa=class{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let n;if(e instanceof HTMLCanvasElement)n=e;else{hs===void 0&&(hs=pr("canvas")),hs.width=e.width,hs.height=e.height;let s=hs.getContext("2d");e instanceof ImageData?s.putImageData(e,0,0):s.drawImage(e,0,0,e.width,e.height),n=hs}return n.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){let t=pr("canvas");t.width=e.width,t.height=e.height;let n=t.getContext("2d");n.drawImage(e,0,0,e.width,e.height);let s=n.getImageData(0,0,e.width,e.height),r=s.data;for(let a=0;a<r.length;a++)r[a]=di(r[a]/255)*255;return n.putImageData(s,0,0),t}else if(e.data){let t=e.data.slice(0);for(let n=0;n<t.length;n++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[n]=Math.floor(di(t[n]/255)*255):t[n]=di(t[n]);return{data:t,width:e.width,height:e.height}}else return qe("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}},pd=0,Ls=class{constructor(e=null){this.isTextureSource=!0,Object.defineProperty(this,"id",{value:pd++}),this.uuid=Pi(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){let t=this.data;return typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):typeof VideoFrame<"u"&&t instanceof VideoFrame?e.set(t.displayWidth,t.displayHeight,0):t!==null?e.set(t.width,t.height,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];let n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let a=0,o=s.length;a<o;a++)s[a].isDataTexture?r.push(_l(s[a].image)):r.push(_l(s[a]))}else r=_l(s);n.url=r}return t||(e.images[this.uuid]=n),n}};function _l(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?Fa.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(qe("Texture: Unable to serialize Texture."),{})}var md=0,xl=new P,xn=class i extends jn{constructor(e=i.DEFAULT_IMAGE,t=i.DEFAULT_MAPPING,n=Kn,s=Kn,r=ln,a=Vi,o=Dn,c=bn,l=i.DEFAULT_ANISOTROPY,u=xi){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:md++}),this.uuid=Pi(),this.name="",this.source=new Ls(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=r,this.minFilter=a,this.anisotropy=l,this.format=o,this.internalFormat=null,this.type=c,this.offset=new Pe(0,0),this.repeat=new Pe(1,1),this.center=new Pe(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new je,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=u,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0,this.normalized=!1}get width(){return this.source.getSize(xl).x}get height(){return this.source.getSize(xl).y}get depth(){return this.source.getSize(xl).z}get image(){return this.source.data}set image(e){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.normalized=e.normalized,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(let t in e){let n=e[t];if(n===void 0){qe(`Texture.setValues(): parameter '${t}' has value of undefined.`);continue}let s=this[t];if(s===void 0){qe(`Texture.setValues(): property '${t}' does not exist.`);continue}s&&n&&s.isVector2&&n.isVector2||s&&n&&s.isVector3&&n.isVector3||s&&n&&s.isMatrix3&&n.isMatrix3?s.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];let n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==hc)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case Ii:e.x=e.x-Math.floor(e.x);break;case Kn:e.x=e.x<0?0:1;break;case Na:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case Ii:e.y=e.y-Math.floor(e.y);break;case Kn:e.y=e.y<0?0:1;break;case Na:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}};xn.DEFAULT_IMAGE=null;xn.DEFAULT_MAPPING=hc;xn.DEFAULT_ANISOTROPY=1;var Ec=class Ec{constructor(e=0,t=0,n=0,s=1){this.x=e,this.y=t,this.z=n,this.w=s}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,s){return this.x=e,this.y=t,this.z=n,this.w=s,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("THREE.Vector4: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("THREE.Vector4: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){let t=this.x,n=this.y,s=this.z,r=this.w,a=e.elements;return this.x=a[0]*t+a[4]*n+a[8]*s+a[12]*r,this.y=a[1]*t+a[5]*n+a[9]*s+a[13]*r,this.z=a[2]*t+a[6]*n+a[10]*s+a[14]*r,this.w=a[3]*t+a[7]*n+a[11]*s+a[15]*r,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);let t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,s,r,c=e.elements,l=c[0],u=c[4],p=c[8],h=c[1],f=c[5],g=c[9],v=c[2],m=c[6],d=c[10];if(Math.abs(u-h)<.01&&Math.abs(p-v)<.01&&Math.abs(g-m)<.01){if(Math.abs(u+h)<.1&&Math.abs(p+v)<.1&&Math.abs(g+m)<.1&&Math.abs(l+f+d-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;let E=(l+1)/2,y=(f+1)/2,b=(d+1)/2,T=(u+h)/4,I=(p+v)/4,x=(g+m)/4;return E>y&&E>b?E<.01?(n=0,s=.707106781,r=.707106781):(n=Math.sqrt(E),s=T/n,r=I/n):y>b?y<.01?(n=.707106781,s=0,r=.707106781):(s=Math.sqrt(y),n=T/s,r=x/s):b<.01?(n=.707106781,s=.707106781,r=0):(r=Math.sqrt(b),n=I/r,s=x/r),this.set(n,s,r,t),this}let S=Math.sqrt((m-g)*(m-g)+(p-v)*(p-v)+(h-u)*(h-u));return Math.abs(S)<.001&&(S=1),this.x=(m-g)/S,this.y=(p-v)/S,this.z=(h-u)/S,this.w=Math.acos((l+f+d-1)/2),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=ht(this.x,e.x,t.x),this.y=ht(this.y,e.y,t.y),this.z=ht(this.z,e.z,t.z),this.w=ht(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=ht(this.x,e,t),this.y=ht(this.y,e,t),this.z=ht(this.z,e,t),this.w=ht(this.w,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(ht(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}};Ec.prototype.isVector4=!0;var Gt=Ec,Ba=class extends jn{constructor(e=1,t=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:ln,depthBuffer:!0,stencilBuffer:!1,resolveColorBuffer:!0,resolveDepthBuffer:!0,resolveStencilBuffer:!0,storeMultisampledColorBuffer:!0,storeMultisampledDepthBuffer:!0,storeMultisampledStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1,useArrayDepthTexture:!1},n),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=n.depth,this.scissor=new Gt(0,0,e,t),this.scissorTest=!1,this.viewport=new Gt(0,0,e,t),this.textures=[];let s={width:e,height:t,depth:n.depth},r=new xn(s),a=n.count;for(let o=0;o<a;o++)this.textures[o]=r.clone(),this.textures[o].isRenderTargetTexture=!0,this.textures[o].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveColorBuffer=n.resolveColorBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this.storeMultisampledColorBuffer=n.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=n.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=n.storeMultisampledStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview,this.useArrayDepthTexture=n.useArrayDepthTexture}_setTextureOptions(e={}){let t={minFilter:ln,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&this._depthTexture.renderTarget===this&&(this._depthTexture.renderTarget=null),e!==null&&e.renderTarget===null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=e,this.textures[s].image.height=t,this.textures[s].image.depth=n,this.textures[s].isData3DTexture!==!0&&(this.textures[s].isArrayTexture=this.textures[s].image.depth>1);this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,n=e.textures.length;t<n;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;let s=Object.assign({},e.textures[t].image);this.textures[t].source=new Ls(s)}if(this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveColorBuffer=e.resolveColorBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,this.storeMultisampledColorBuffer=e.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=e.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=e.storeMultisampledStencilBuffer,e.depthTexture!==null)if(e.depthTexture.renderTarget===e){let t=e.depthTexture.clone();t.renderTarget=null,this.depthTexture=t}else this.depthTexture=e.depthTexture;return this.samples=e.samples,this.multiview=e.multiview,this.useArrayDepthTexture=e.useArrayDepthTexture,this}dispose(){this.dispatchEvent({type:"dispose"})}},Mn=class extends Ba{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}},_r=class extends xn{constructor(e=null,t=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:s},this.magFilter=on,this.minFilter=on,this.wrapR=Kn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}};var Oa=class extends xn{constructor(e=null,t=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:s},this.magFilter=on,this.minFilter=on,this.wrapR=Kn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}};var fo=class fo{constructor(e,t,n,s,r,a,o,c,l,u,p,h,f,g,v,m){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,s,r,a,o,c,l,u,p,h,f,g,v,m)}set(e,t,n,s,r,a,o,c,l,u,p,h,f,g,v,m){let d=this.elements;return d[0]=e,d[4]=t,d[8]=n,d[12]=s,d[1]=r,d[5]=a,d[9]=o,d[13]=c,d[2]=l,d[6]=u,d[10]=p,d[14]=h,d[3]=f,d[7]=g,d[11]=v,d[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new fo().fromArray(this.elements)}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){let t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){let t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return this.determinantAffine()===0?(e.set(1,0,0),t.set(0,1,0),n.set(0,0,1),this):(e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this)}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){if(e.determinantAffine()===0)return this.identity();let t=this.elements,n=e.elements,s=1/us.setFromMatrixColumn(e,0).length(),r=1/us.setFromMatrixColumn(e,1).length(),a=1/us.setFromMatrixColumn(e,2).length();return t[0]=n[0]*s,t[1]=n[1]*s,t[2]=n[2]*s,t[3]=0,t[4]=n[4]*r,t[5]=n[5]*r,t[6]=n[6]*r,t[7]=0,t[8]=n[8]*a,t[9]=n[9]*a,t[10]=n[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){let t=this.elements,n=e.x,s=e.y,r=e.z,a=Math.cos(n),o=Math.sin(n),c=Math.cos(s),l=Math.sin(s),u=Math.cos(r),p=Math.sin(r);if(e.order==="XYZ"){let h=a*u,f=a*p,g=o*u,v=o*p;t[0]=c*u,t[4]=-c*p,t[8]=l,t[1]=f+g*l,t[5]=h-v*l,t[9]=-o*c,t[2]=v-h*l,t[6]=g+f*l,t[10]=a*c}else if(e.order==="YXZ"){let h=c*u,f=c*p,g=l*u,v=l*p;t[0]=h+v*o,t[4]=g*o-f,t[8]=a*l,t[1]=a*p,t[5]=a*u,t[9]=-o,t[2]=f*o-g,t[6]=v+h*o,t[10]=a*c}else if(e.order==="ZXY"){let h=c*u,f=c*p,g=l*u,v=l*p;t[0]=h-v*o,t[4]=-a*p,t[8]=g+f*o,t[1]=f+g*o,t[5]=a*u,t[9]=v-h*o,t[2]=-a*l,t[6]=o,t[10]=a*c}else if(e.order==="ZYX"){let h=a*u,f=a*p,g=o*u,v=o*p;t[0]=c*u,t[4]=g*l-f,t[8]=h*l+v,t[1]=c*p,t[5]=v*l+h,t[9]=f*l-g,t[2]=-l,t[6]=o*c,t[10]=a*c}else if(e.order==="YZX"){let h=a*c,f=a*l,g=o*c,v=o*l;t[0]=c*u,t[4]=v-h*p,t[8]=g*p+f,t[1]=p,t[5]=a*u,t[9]=-o*u,t[2]=-l*u,t[6]=f*p+g,t[10]=h-v*p}else if(e.order==="XZY"){let h=a*c,f=a*l,g=o*c,v=o*l;t[0]=c*u,t[4]=-p,t[8]=l*u,t[1]=h*p+v,t[5]=a*u,t[9]=f*p-g,t[2]=g*p-f,t[6]=o*u,t[10]=v*p+h}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(gd,e,_d)}lookAt(e,t,n){let s=this.elements;return wn.subVectors(e,t),wn.lengthSq()===0&&(wn.z=1),wn.normalize(),wi.crossVectors(n,wn),wi.lengthSq()===0&&(Math.abs(n.z)===1?wn.x+=1e-4:wn.z+=1e-4,wn.normalize(),wi.crossVectors(n,wn)),wi.normalize(),Qr.crossVectors(wn,wi),s[0]=wi.x,s[4]=Qr.x,s[8]=wn.x,s[1]=wi.y,s[5]=Qr.y,s[9]=wn.y,s[2]=wi.z,s[6]=Qr.z,s[10]=wn.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,s=t.elements,r=this.elements,a=n[0],o=n[4],c=n[8],l=n[12],u=n[1],p=n[5],h=n[9],f=n[13],g=n[2],v=n[6],m=n[10],d=n[14],S=n[3],E=n[7],y=n[11],b=n[15],T=s[0],I=s[4],x=s[8],w=s[12],R=s[1],O=s[5],V=s[9],W=s[13],B=s[2],J=s[6],ne=s[10],ie=s[14],de=s[3],j=s[7],oe=s[11],ue=s[15];return r[0]=a*T+o*R+c*B+l*de,r[4]=a*I+o*O+c*J+l*j,r[8]=a*x+o*V+c*ne+l*oe,r[12]=a*w+o*W+c*ie+l*ue,r[1]=u*T+p*R+h*B+f*de,r[5]=u*I+p*O+h*J+f*j,r[9]=u*x+p*V+h*ne+f*oe,r[13]=u*w+p*W+h*ie+f*ue,r[2]=g*T+v*R+m*B+d*de,r[6]=g*I+v*O+m*J+d*j,r[10]=g*x+v*V+m*ne+d*oe,r[14]=g*w+v*W+m*ie+d*ue,r[3]=S*T+E*R+y*B+b*de,r[7]=S*I+E*O+y*J+b*j,r[11]=S*x+E*V+y*ne+b*oe,r[15]=S*w+E*W+y*ie+b*ue,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[4],s=e[8],r=e[12],a=e[1],o=e[5],c=e[9],l=e[13],u=e[2],p=e[6],h=e[10],f=e[14],g=e[3],v=e[7],m=e[11],d=e[15],S=c*f-l*h,E=o*f-l*p,y=o*h-c*p,b=a*f-l*u,T=a*h-c*u,I=a*p-o*u;return t*(v*S-m*E+d*y)-n*(g*S-m*b+d*T)+s*(g*E-v*b+d*I)-r*(g*y-v*T+m*I)}determinantAffine(){let e=this.elements,t=e[0],n=e[4],s=e[8],r=e[1],a=e[5],o=e[9],c=e[2],l=e[6],u=e[10];return t*(a*u-o*l)-n*(r*u-o*c)+s*(r*l-a*c)}transpose(){let e=this.elements,t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){let s=this.elements;return e.isVector3?(s[12]=e.x,s[13]=e.y,s[14]=e.z):(s[12]=e,s[13]=t,s[14]=n),this}invert(){let e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],a=e[4],o=e[5],c=e[6],l=e[7],u=e[8],p=e[9],h=e[10],f=e[11],g=e[12],v=e[13],m=e[14],d=e[15],S=t*o-n*a,E=t*c-s*a,y=t*l-r*a,b=n*c-s*o,T=n*l-r*o,I=s*l-r*c,x=u*v-p*g,w=u*m-h*g,R=u*d-f*g,O=p*m-h*v,V=p*d-f*v,W=h*d-f*m,B=S*W-E*V+y*O+b*R-T*w+I*x;if(B===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let J=1/B;return e[0]=(o*W-c*V+l*O)*J,e[1]=(s*V-n*W-r*O)*J,e[2]=(v*I-m*T+d*b)*J,e[3]=(h*T-p*I-f*b)*J,e[4]=(c*R-a*W-l*w)*J,e[5]=(t*W-s*R+r*w)*J,e[6]=(m*y-g*I-d*E)*J,e[7]=(u*I-h*y+f*E)*J,e[8]=(a*V-o*R+l*x)*J,e[9]=(n*R-t*V-r*x)*J,e[10]=(g*T-v*y+d*S)*J,e[11]=(p*y-u*T-f*S)*J,e[12]=(o*w-a*O-c*x)*J,e[13]=(t*O-n*w+s*x)*J,e[14]=(v*E-g*b-m*S)*J,e[15]=(u*b-p*E+h*S)*J,this}scale(e){let t=this.elements,n=e.x,s=e.y,r=e.z;return t[0]*=n,t[4]*=s,t[8]*=r,t[1]*=n,t[5]*=s,t[9]*=r,t[2]*=n,t[6]*=s,t[10]*=r,t[3]*=n,t[7]*=s,t[11]*=r,this}getMaxScaleOnAxis(){let e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],s=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,s))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){let t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){let n=Math.cos(t),s=Math.sin(t),r=1-n,a=e.x,o=e.y,c=e.z,l=r*a,u=r*o;return this.set(l*a+n,l*o-s*c,l*c+s*o,0,l*o+s*c,u*o+n,u*c-s*a,0,l*c-s*o,u*c+s*a,r*c*c+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,s,r,a){return this.set(1,n,r,0,e,1,a,0,t,s,1,0,0,0,0,1),this}compose(e,t,n){let s=this.elements,r=t._x,a=t._y,o=t._z,c=t._w,l=r+r,u=a+a,p=o+o,h=r*l,f=r*u,g=r*p,v=a*u,m=a*p,d=o*p,S=c*l,E=c*u,y=c*p,b=n.x,T=n.y,I=n.z;return s[0]=(1-(v+d))*b,s[1]=(f+y)*b,s[2]=(g-E)*b,s[3]=0,s[4]=(f-y)*T,s[5]=(1-(h+d))*T,s[6]=(m+S)*T,s[7]=0,s[8]=(g+E)*I,s[9]=(m-S)*I,s[10]=(1-(h+v))*I,s[11]=0,s[12]=e.x,s[13]=e.y,s[14]=e.z,s[15]=1,this}decompose(e,t,n){let s=this.elements;e.x=s[12],e.y=s[13],e.z=s[14];let r=this.determinantAffine();if(r===0)return n.set(1,1,1),t.identity(),this;let a=us.set(s[0],s[1],s[2]).length(),o=us.set(s[4],s[5],s[6]).length(),c=us.set(s[8],s[9],s[10]).length();r<0&&(a=-a),On.copy(this);let l=1/a,u=1/o,p=1/c;return On.elements[0]*=l,On.elements[1]*=l,On.elements[2]*=l,On.elements[4]*=u,On.elements[5]*=u,On.elements[6]*=u,On.elements[8]*=p,On.elements[9]*=p,On.elements[10]*=p,t.setFromRotationMatrix(On),n.x=a,n.y=o,n.z=c,this}makePerspective(e,t,n,s,r,a,o=kn,c=!1){let l=this.elements,u=2*r/(t-e),p=2*r/(n-s),h=(t+e)/(t-e),f=(n+s)/(n-s),g,v;if(c)g=r/(a-r),v=a*r/(a-r);else if(o===kn)g=-(a+r)/(a-r),v=-2*a*r/(a-r);else if(o===Ps)g=-a/(a-r),v=-a*r/(a-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return l[0]=u,l[4]=0,l[8]=h,l[12]=0,l[1]=0,l[5]=p,l[9]=f,l[13]=0,l[2]=0,l[6]=0,l[10]=g,l[14]=v,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(e,t,n,s,r,a,o=kn,c=!1){let l=this.elements,u=2/(t-e),p=2/(n-s),h=-(t+e)/(t-e),f=-(n+s)/(n-s),g,v;if(c)g=1/(a-r),v=a/(a-r);else if(o===kn)g=-2/(a-r),v=-(a+r)/(a-r);else if(o===Ps)g=-1/(a-r),v=-r/(a-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return l[0]=u,l[4]=0,l[8]=0,l[12]=h,l[1]=0,l[5]=p,l[9]=0,l[13]=f,l[2]=0,l[6]=0,l[10]=g,l[14]=v,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(e){let t=this.elements,n=e.elements;for(let s=0;s<16;s++)if(t[s]!==n[s])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}};fo.prototype.isMatrix4=!0;var gt=fo,us=new P,On=new gt,gd=new P(0,0,0),_d=new P(1,1,1),wi=new P,Qr=new P,wn=new P,nh=new gt,ih=new ei,fi=class i{constructor(e=0,t=0,n=0,s=i.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=n,this._order=s}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,s=this._order){return this._x=e,this._y=t,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){let s=e.elements,r=s[0],a=s[4],o=s[8],c=s[1],l=s[5],u=s[9],p=s[2],h=s[6],f=s[10];switch(t){case"XYZ":this._y=Math.asin(ht(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-u,f),this._z=Math.atan2(-a,r)):(this._x=Math.atan2(h,l),this._z=0);break;case"YXZ":this._x=Math.asin(-ht(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(o,f),this._z=Math.atan2(c,l)):(this._y=Math.atan2(-p,r),this._z=0);break;case"ZXY":this._x=Math.asin(ht(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(-p,f),this._z=Math.atan2(-a,l)):(this._y=0,this._z=Math.atan2(c,r));break;case"ZYX":this._y=Math.asin(-ht(p,-1,1)),Math.abs(p)<.9999999?(this._x=Math.atan2(h,f),this._z=Math.atan2(c,r)):(this._x=0,this._z=Math.atan2(-a,l));break;case"YZX":this._z=Math.asin(ht(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-u,l),this._y=Math.atan2(-p,r)):(this._x=0,this._y=Math.atan2(o,f));break;case"XZY":this._z=Math.asin(-ht(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(h,l),this._y=Math.atan2(o,r)):(this._x=Math.atan2(-u,f),this._y=0);break;default:qe("Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return nh.makeRotationFromQuaternion(e),this.setFromRotationMatrix(nh,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return ih.setFromEuler(this),this.setFromQuaternion(ih,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};fi.DEFAULT_ORDER="XYZ";var Ds=class{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}},xd=0,sh=new P,ds=new ei,ai=new gt,jr=new P,js=new P,yd=new P,vd=new ei,rh=new P(1,0,0),ah=new P(0,1,0),oh=new P(0,0,1),lh={type:"added"},Md={type:"removed"},fs={type:"childadded",child:null},yl={type:"childremoved",child:null},Vt=class i extends jn{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:xd++}),this.uuid=Pi(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=i.DEFAULT_UP.clone();let e=new P,t=new fi,n=new ei,s=new P(1,1,1);function r(){n.setFromEuler(t,!1)}function a(){t.setFromQuaternion(n,void 0,!1)}t._onChange(r),n._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new gt},normalMatrix:{value:new je}}),this.matrix=new gt,this.matrixWorld=new gt,this.matrixAutoUpdate=i.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=i.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Ds,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return ds.setFromAxisAngle(e,t),this.quaternion.multiply(ds),this}rotateOnWorldAxis(e,t){return ds.setFromAxisAngle(e,t),this.quaternion.premultiply(ds),this}rotateX(e){return this.rotateOnAxis(rh,e)}rotateY(e){return this.rotateOnAxis(ah,e)}rotateZ(e){return this.rotateOnAxis(oh,e)}translateOnAxis(e,t){return sh.copy(e).applyQuaternion(this.quaternion),this.position.add(sh.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(rh,e)}translateY(e){return this.translateOnAxis(ah,e)}translateZ(e){return this.translateOnAxis(oh,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(ai.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?jr.copy(e):jr.set(e,t,n);let s=this.parent;this.updateWorldMatrix(!0,!1),js.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?ai.lookAt(js,jr,this.up):ai.lookAt(jr,js,this.up),this.quaternion.setFromRotationMatrix(ai),s&&(ai.extractRotation(s.matrixWorld),ds.setFromRotationMatrix(ai),this.quaternion.premultiply(ds.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(Ze("Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(lh),fs.child=e,this.dispatchEvent(fs),fs.child=null):Ze("Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}let t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(Md),yl.child=e,this.dispatchEvent(yl),yl.child=null),this}removeFromParent(){let e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),ai.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),ai.multiply(e.parent.matrixWorld)),e.applyMatrix4(ai),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(lh),fs.child=e,this.dispatchEvent(fs),fs.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,s=this.children.length;n<s;n++){let a=this.children[n].getObjectByProperty(e,t);if(a!==void 0)return a}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);let s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(js,e,yd),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(js,vd,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);let t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}intersectsFrustum(){}traverse(e){e(this);let t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);let t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].traverseVisible(e)}traverseAncestors(e){let t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);let e=this.pivot;if(e!==null){let t=e.x,n=e.y,s=e.z,r=this.matrix.elements;r[12]+=t-r[0]*t-r[4]*n-r[8]*s,r[13]+=n-r[1]*t-r[5]*n-r[9]*s,r[14]+=s-r[2]*t-r[6]*n-r[10]*s}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);let t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t,n=!1){let s=this.parent;if(e===!0&&s!==null&&s.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||n)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,n=!0),t===!0){let r=this.children;for(let a=0,o=r.length;a<o;a++)r[a].updateWorldMatrix(!1,!0,n)}}toJSON(e){let t=e===void 0||typeof e=="string",n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});let s={};s.uuid=this.uuid,s.type=this.type,s.name=this.name,s.castShadow=this.castShadow,s.receiveShadow=this.receiveShadow,s.visible=this.visible,s.frustumCulled=this.frustumCulled,s.renderOrder=this.renderOrder,s.static=this.static,s.matrixAutoUpdate=this.matrixAutoUpdate,Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.pivot!==null&&(s.pivot=this.pivot.toArray()),this.morphTargetDictionary!==void 0&&(s.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(s.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.geometryInfo=this._geometryInfo.map(o=>({...o,boundingBox:o.boundingBox?o.boundingBox.toJSON():void 0,boundingSphere:o.boundingSphere?o.boundingSphere.toJSON():void 0})),s.instanceInfo=this._instanceInfo.map(o=>({...o})),s.availableInstanceIds=this._availableInstanceIds.slice(),s.availableGeometryIds=this._availableGeometryIds.slice(),s.nextIndexStart=this._nextIndexStart,s.nextVertexStart=this._nextVertexStart,s.geometryCount=this._geometryCount,s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.matricesTexture=this._matricesTexture.toJSON(e),s.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(s.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(s.boundingBox=this.boundingBox.toJSON()));function r(o,c){return o[c.uuid]===void 0&&(o[c.uuid]=c.toJSON(e)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(e.geometries,this.geometry);let o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){let c=o.shapes;if(Array.isArray(c))for(let l=0,u=c.length;l<u;l++){let p=c[l];r(e.shapes,p)}else r(e.shapes,c)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(e.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let o=[];for(let c=0,l=this.material.length;c<l;c++)o.push(r(e.materials,this.material[c]));s.material=o}else s.material=r(e.materials,this.material);if(this.children.length>0){s.children=[];for(let o=0;o<this.children.length;o++)s.children.push(this.children[o].toJSON(e).object)}if(this.animations.length>0){s.animations=[];for(let o=0;o<this.animations.length;o++){let c=this.animations[o];s.animations.push(r(e.animations,c))}}if(t){let o=a(e.geometries),c=a(e.materials),l=a(e.textures),u=a(e.images),p=a(e.shapes),h=a(e.skeletons),f=a(e.animations),g=a(e.nodes);o.length>0&&(n.geometries=o),c.length>0&&(n.materials=c),l.length>0&&(n.textures=l),u.length>0&&(n.images=u),p.length>0&&(n.shapes=p),h.length>0&&(n.skeletons=h),f.length>0&&(n.animations=f),g.length>0&&(n.nodes=g)}return n.object=s,n;function a(o){let c=[];for(let l in o){let u=o[l];delete u.metadata,c.push(u)}return c}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.pivot=e.pivot!==null?e.pivot.clone():null,this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.static=e.static,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let n=0;n<e.children.length;n++){let s=e.children[n];this.add(s.clone())}return this}dispose(){this.dispatchEvent({type:"dispose"})}};Vt.DEFAULT_UP=new P(0,1,0);Vt.DEFAULT_MATRIX_AUTO_UPDATE=!0;Vt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var $e=class extends Vt{constructor(){super(),this.isGroup=!0,this.type="Group"}},Sd={type:"move"},Ns=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new $e,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new $e,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new P,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new P),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new $e,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new P,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new P,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){let t=this._hand;if(t)for(let n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let s=null,r=null,a=null,o=this._targetRay,c=this._grip,l=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(l&&e.hand){a=!0;for(let v of e.hand.values()){let m=t.getJointPose(v,n),d=this._getHandJoint(l,v);m!==null&&(d.matrix.fromArray(m.transform.matrix),d.matrix.decompose(d.position,d.rotation,d.scale),d.matrixWorldNeedsUpdate=!0,d.jointRadius=m.radius),d.visible=m!==null}let u=l.joints["index-finger-tip"],p=l.joints["thumb-tip"],h=u.position.distanceTo(p.position),f=.02,g=.005;l.inputState.pinching&&h>f+g?(l.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!l.inputState.pinching&&h<=f-g&&(l.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else c!==null&&e.gripSpace&&(r=t.getPose(e.gripSpace,n),r!==null&&(c.matrix.fromArray(r.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,r.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(r.linearVelocity)):c.hasLinearVelocity=!1,r.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(r.angularVelocity)):c.hasAngularVelocity=!1,c.eventsEnabled&&c.dispatchEvent({type:"gripUpdated",data:e,target:this})));o!==null&&(s=t.getPose(e.targetRaySpace,n),s===null&&r!==null&&(s=r),s!==null&&(o.matrix.fromArray(s.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,s.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(s.linearVelocity)):o.hasLinearVelocity=!1,s.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(s.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(Sd)))}return o!==null&&(o.visible=s!==null),c!==null&&(c.visible=r!==null),l!==null&&(l.visible=a!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){let n=new $e;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}},_u={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Ai={h:0,s:0,l:0},ea={h:0,s:0,l:0};function vl(i,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?i+(e-i)*6*t:t<1/2?e:t<2/3?i+(e-i)*6*(2/3-t):i}var We=class{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){let s=e;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=qt){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,dt.colorSpaceToWorking(this,t),this}setRGB(e,t,n,s=dt.workingColorSpace){return this.r=e,this.g=t,this.b=n,dt.colorSpaceToWorking(this,s),this}setHSL(e,t,n,s=dt.workingColorSpace){if(e=dd(e,1),t=ht(t,0,1),n=ht(n,0,1),t===0)this.r=this.g=this.b=n;else{let r=n<=.5?n*(1+t):n+t-n*t,a=2*n-r;this.r=vl(a,r,e+1/3),this.g=vl(a,r,e),this.b=vl(a,r,e-1/3)}return dt.colorSpaceToWorking(this,s),this}setStyle(e,t=qt){function n(r){r!==void 0&&parseFloat(r)<1&&qe("Color: Alpha component of "+e+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(e)){let r,a=s[1],o=s[2];switch(a){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,t);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,t);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,t);break;default:qe("Color: Unknown color model "+e)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(e)){let r=s[1],a=r.length;if(a===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,t);if(a===6)return this.setHex(parseInt(r,16),t);qe("Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=qt){let n=_u[e.toLowerCase()];return n!==void 0?this.setHex(n,t):qe("Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=di(e.r),this.g=di(e.g),this.b=di(e.b),this}copyLinearToSRGB(e){return this.r=Cs(e.r),this.g=Cs(e.g),this.b=Cs(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=qt){return dt.workingToColorSpace(pn.copy(this),e),Math.round(ht(pn.r*255,0,255))*65536+Math.round(ht(pn.g*255,0,255))*256+Math.round(ht(pn.b*255,0,255))}getHexString(e=qt){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=dt.workingColorSpace){dt.workingToColorSpace(pn.copy(this),t);let n=pn.r,s=pn.g,r=pn.b,a=Math.max(n,s,r),o=Math.min(n,s,r),c,l,u=(o+a)/2;if(o===a)c=0,l=0;else{let p=a-o;switch(l=u<=.5?p/(a+o):p/(2-a-o),a){case n:c=(s-r)/p+(s<r?6:0);break;case s:c=(r-n)/p+2;break;case r:c=(n-s)/p+4;break}c/=6}return e.h=c,e.s=l,e.l=u,e}getRGB(e,t=dt.workingColorSpace){return dt.workingToColorSpace(pn.copy(this),t),e.r=pn.r,e.g=pn.g,e.b=pn.b,e}getStyle(e=qt){dt.workingToColorSpace(pn.copy(this),e);let t=pn.r,n=pn.g,s=pn.b;return e!==qt?`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(e,t,n){return this.getHSL(Ai),this.setHSL(Ai.h+e,Ai.s+t,Ai.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(Ai),e.getHSL(ea);let n=pl(Ai.h,ea.h,t),s=pl(Ai.s,ea.s,t),r=pl(Ai.l,ea.l,t);return this.setHSL(n,s,r),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){let t=this.r,n=this.g,s=this.b,r=e.elements;return this.r=r[0]*t+r[3]*n+r[6]*s,this.g=r[1]*t+r[4]*n+r[7]*s,this.b=r[2]*t+r[5]*n+r[8]*s,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},pn=new We;We.NAMES=_u;var Hn=class i{constructor(e,t=1,n=1e3){this.isFog=!0,this.name="",this.color=new We(e),this.near=t,this.far=n}clone(){return new i(this.color,this.near,this.far)}toJSON(){return{type:"Fog",name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}},xr=class extends Vt{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new fi,this.environmentIntensity=1,this.environmentRotation=new fi,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){let t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),t.object.backgroundBlurriness=this.backgroundBlurriness,t.object.backgroundIntensity=this.backgroundIntensity,t.object.backgroundRotation=this.backgroundRotation.toArray(),t.object.environmentIntensity=this.environmentIntensity,t.object.environmentRotation=this.environmentRotation.toArray(),t}},zn=new P,oi=new P,Ml=new P,li=new P,ps=new P,ms=new P,ch=new P,Sl=new P,bl=new P,Tl=new P,wl=new Gt,Al=new Gt,El=new Gt,ui=class i{constructor(e=new P,t=new P,n=new P){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,s){s.subVectors(n,t),zn.subVectors(e,t),s.cross(zn);let r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(e,t,n,s,r){zn.subVectors(s,t),oi.subVectors(n,t),Ml.subVectors(e,t);let a=zn.dot(zn),o=zn.dot(oi),c=zn.dot(Ml),l=oi.dot(oi),u=oi.dot(Ml),p=a*l-o*o;if(p===0)return r.set(0,0,0),null;let h=1/p,f=(l*c-o*u)*h,g=(a*u-o*c)*h;return r.set(1-f-g,g,f)}static containsPoint(e,t,n,s){return this.getBarycoord(e,t,n,s,li)===null?!1:li.x>=0&&li.y>=0&&li.x+li.y<=1}static getInterpolation(e,t,n,s,r,a,o,c){return this.getBarycoord(e,t,n,s,li)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(r,li.x),c.addScaledVector(a,li.y),c.addScaledVector(o,li.z),c)}static getInterpolatedAttribute(e,t,n,s,r,a){return wl.setScalar(0),Al.setScalar(0),El.setScalar(0),wl.fromBufferAttribute(e,t),Al.fromBufferAttribute(e,n),El.fromBufferAttribute(e,s),a.setScalar(0),a.addScaledVector(wl,r.x),a.addScaledVector(Al,r.y),a.addScaledVector(El,r.z),a}static isFrontFacing(e,t,n,s){return zn.subVectors(n,t),oi.subVectors(e,t),zn.cross(oi).dot(s)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,s){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[s]),this}setFromAttributeAndIndices(e,t,n,s){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,s),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return zn.subVectors(this.c,this.b),oi.subVectors(this.a,this.b),zn.cross(oi).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return i.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return i.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,n,s,r){return i.getInterpolation(e,this.a,this.b,this.c,t,n,s,r)}containsPoint(e){return i.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return i.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){let n=this.a,s=this.b,r=this.c,a,o;ps.subVectors(s,n),ms.subVectors(r,n),Sl.subVectors(e,n);let c=ps.dot(Sl),l=ms.dot(Sl);if(c<=0&&l<=0)return t.copy(n);bl.subVectors(e,s);let u=ps.dot(bl),p=ms.dot(bl);if(u>=0&&p<=u)return t.copy(s);let h=c*p-u*l;if(h<=0&&c>=0&&u<=0)return a=c/(c-u),t.copy(n).addScaledVector(ps,a);Tl.subVectors(e,r);let f=ps.dot(Tl),g=ms.dot(Tl);if(g>=0&&f<=g)return t.copy(r);let v=f*l-c*g;if(v<=0&&l>=0&&g<=0)return o=l/(l-g),t.copy(n).addScaledVector(ms,o);let m=u*g-f*p;if(m<=0&&p-u>=0&&f-g>=0)return ch.subVectors(r,s),o=(p-u)/(p-u+(f-g)),t.copy(s).addScaledVector(ch,o);let d=1/(m+v+h);return a=v*d,o=h*d,t.copy(n).addScaledVector(ps,a).addScaledVector(ms,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}},ti=class{constructor(e=new P(1/0,1/0,1/0),t=new P(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(Gn.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(Gn.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){let n=Gn.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);let n=e.geometry;if(n!==void 0){let r=n.getAttribute("position");if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let a=0,o=r.count;a<o;a++)e.isMesh===!0?e.getVertexPosition(a,Gn):Gn.fromBufferAttribute(r,a),Gn.applyMatrix4(e.matrixWorld),this.expandByPoint(Gn);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),ta.copy(e.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),ta.copy(n.boundingBox)),ta.applyMatrix4(e.matrixWorld),this.union(ta)}let s=e.children;for(let r=0,a=s.length;r<a;r++)this.expandByObject(s[r],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,Gn),Gn.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(er),na.subVectors(this.max,er),gs.subVectors(e.a,er),_s.subVectors(e.b,er),xs.subVectors(e.c,er),Ei.subVectors(_s,gs),Ci.subVectors(xs,_s),Wi.subVectors(gs,xs);let t=[0,-Ei.z,Ei.y,0,-Ci.z,Ci.y,0,-Wi.z,Wi.y,Ei.z,0,-Ei.x,Ci.z,0,-Ci.x,Wi.z,0,-Wi.x,-Ei.y,Ei.x,0,-Ci.y,Ci.x,0,-Wi.y,Wi.x,0];return!Cl(t,gs,_s,xs,na)||(t=[1,0,0,0,1,0,0,0,1],!Cl(t,gs,_s,xs,na))?!1:(ia.crossVectors(Ei,Ci),t=[ia.x,ia.y,ia.z],Cl(t,gs,_s,xs,na))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,Gn).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(Gn).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(ci[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),ci[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),ci[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),ci[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),ci[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),ci[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),ci[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),ci[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(ci),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}},ci=[new P,new P,new P,new P,new P,new P,new P,new P],Gn=new P,ta=new ti,gs=new P,_s=new P,xs=new P,Ei=new P,Ci=new P,Wi=new P,er=new P,na=new P,ia=new P,Xi=new P;function Cl(i,e,t,n,s){for(let r=0,a=i.length-3;r<=a;r+=3){Xi.fromArray(i,r);let o=s.x*Math.abs(Xi.x)+s.y*Math.abs(Xi.y)+s.z*Math.abs(Xi.z),c=e.dot(Xi),l=t.dot(Xi),u=n.dot(Xi);if(Math.max(-Math.max(c,l,u),Math.min(c,l,u))>o)return!1}return!0}var Jt=new P,sa=new Pe,bd=0,Yt=class extends jn{constructor(e,t,n=!1){if(super(),Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:bd++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=n,this.usage=_c,this.updateRanges=[],this.gpuType=Ln,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[e+s]=t.array[n+s];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)sa.fromBufferAttribute(this,t),sa.applyMatrix3(e),this.setXY(t,sa.x,sa.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)Jt.fromBufferAttribute(this,t),Jt.applyMatrix3(e),this.setXYZ(t,Jt.x,Jt.y,Jt.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)Jt.fromBufferAttribute(this,t),Jt.applyMatrix4(e),this.setXYZ(t,Jt.x,Jt.y,Jt.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)Jt.fromBufferAttribute(this,t),Jt.applyNormalMatrix(e),this.setXYZ(t,Jt.x,Jt.y,Jt.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)Jt.fromBufferAttribute(this,t),Jt.transformDirection(e),this.setXYZ(t,Jt.x,Jt.y,Jt.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=$n(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=Ct(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=$n(t,this.array)),t}setX(e,t){return this.normalized&&(t=Ct(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=$n(t,this.array)),t}setY(e,t){return this.normalized&&(t=Ct(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=$n(t,this.array)),t}setZ(e,t){return this.normalized&&(t=Ct(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=$n(t,this.array)),t}setW(e,t){return this.normalized&&(t=Ct(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=Ct(t,this.array),n=Ct(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,s){return e*=this.itemSize,this.normalized&&(t=Ct(t,this.array),n=Ct(n,this.array),s=Ct(s,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=s,this}setXYZW(e,t,n,s,r){return e*=this.itemSize,this.normalized&&(t=Ct(t,this.array),n=Ct(n,this.array),s=Ct(s,this.array),r=Ct(r,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=s,this.array[e+3]=r,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return e.name=this.name,e.usage=this.usage,e.gpuType=this.gpuType,e}dispose(){this.dispatchEvent({type:"dispose"})}};var yr=class extends Yt{constructor(e,t,n){super(new Uint16Array(e),t,n)}};var vr=class extends Yt{constructor(e,t,n){super(new Uint32Array(e),t,n)}};var st=class extends Yt{constructor(e,t,n){super(new Float32Array(e),t,n)}},Td=new ti,tr=new P,Rl=new P,ni=class{constructor(e=new P,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){let n=this.center;t!==void 0?n.copy(t):Td.setFromPoints(e).getCenter(n);let s=0;for(let r=0,a=e.length;r<a;r++)s=Math.max(s,n.distanceToSquared(e[r]));return this.radius=Math.sqrt(s),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){let t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){let n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;tr.subVectors(e,this.center);let t=tr.lengthSq();if(t>this.radius*this.radius){let n=Math.sqrt(t),s=(n-this.radius)*.5;this.center.addScaledVector(tr,s/n),this.radius+=s}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(Rl.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(tr.copy(e.center).add(Rl)),this.expandByPoint(tr.copy(e.center).sub(Rl))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}},wd=0,Pn=new gt,Pl=new Vt,ys=new P,An=new ti,nr=new ti,rn=new P,Rt=class i extends jn{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:wd++}),this.uuid=Pi(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={},this._transformed=!1}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(hd(e)?vr:yr)(e,1):this.index=e,this}setIndirect(e,t=0){return this.indirect=e,this.indirectOffset=t,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){let t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);let n=this.attributes.normal;if(n!==void 0){let r=new je().getNormalMatrix(e);n.applyNormalMatrix(r),n.needsUpdate=!0}let s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(e),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this._transformed=!0,this}applyQuaternion(e){return Pn.makeRotationFromQuaternion(e),this.applyMatrix4(Pn),this}rotateX(e){return Pn.makeRotationX(e),this.applyMatrix4(Pn),this}rotateY(e){return Pn.makeRotationY(e),this.applyMatrix4(Pn),this}rotateZ(e){return Pn.makeRotationZ(e),this.applyMatrix4(Pn),this}translate(e,t,n){return Pn.makeTranslation(e,t,n),this.applyMatrix4(Pn),this}scale(e,t,n){return Pn.makeScale(e,t,n),this.applyMatrix4(Pn),this}lookAt(e){return Pl.lookAt(e),Pl.updateMatrix(),this.applyMatrix4(Pl.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(ys).negate(),this.translate(ys.x,ys.y,ys.z),this}setFromPoints(e){let t=this.getAttribute("position");if(t===void 0){let n=[];for(let s=0,r=e.length;s<r;s++){let a=e[s];n.push(a.x,a.y,a.z||0)}this.setAttribute("position",new st(n,3))}else{let n=Math.min(e.length,t.count);for(let s=0;s<n;s++){let r=e[s];t.setXYZ(s,r.x,r.y,r.z||0)}e.length>t.count&&qe("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new ti);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){Ze("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new P(-1/0,-1/0,-1/0),new P(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let n=0,s=t.length;n<s;n++){let r=t[n];An.setFromBufferAttribute(r),this.morphTargetsRelative?(rn.addVectors(this.boundingBox.min,An.min),this.boundingBox.expandByPoint(rn),rn.addVectors(this.boundingBox.max,An.max),this.boundingBox.expandByPoint(rn)):(this.boundingBox.expandByPoint(An.min),this.boundingBox.expandByPoint(An.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&Ze('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new ni);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){Ze("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new P,1/0);return}if(e){let n=this.boundingSphere.center;if(An.setFromBufferAttribute(e),t)for(let r=0,a=t.length;r<a;r++){let o=t[r];nr.setFromBufferAttribute(o),this.morphTargetsRelative?(rn.addVectors(An.min,nr.min),An.expandByPoint(rn),rn.addVectors(An.max,nr.max),An.expandByPoint(rn)):(An.expandByPoint(nr.min),An.expandByPoint(nr.max))}An.getCenter(n);let s=0;for(let r=0,a=e.count;r<a;r++)rn.fromBufferAttribute(e,r),s=Math.max(s,n.distanceToSquared(rn));if(t)for(let r=0,a=t.length;r<a;r++){let o=t[r],c=this.morphTargetsRelative;for(let l=0,u=o.count;l<u;l++)rn.fromBufferAttribute(o,l),c&&(ys.fromBufferAttribute(e,l),rn.add(ys)),s=Math.max(s,n.distanceToSquared(rn))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&Ze('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){Ze("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}let n=t.position,s=t.normal,r=t.uv,a=this.getAttribute("tangent");(a===void 0||a.count!==n.count)&&(a=new Yt(new Float32Array(4*n.count),4),this.setAttribute("tangent",a));let o=[],c=[];for(let x=0;x<n.count;x++)o[x]=new P,c[x]=new P;let l=new P,u=new P,p=new P,h=new Pe,f=new Pe,g=new Pe,v=new P,m=new P;function d(x,w,R){l.fromBufferAttribute(n,x),u.fromBufferAttribute(n,w),p.fromBufferAttribute(n,R),h.fromBufferAttribute(r,x),f.fromBufferAttribute(r,w),g.fromBufferAttribute(r,R),u.sub(l),p.sub(l),f.sub(h),g.sub(h);let O=1/(f.x*g.y-g.x*f.y);isFinite(O)&&(v.copy(u).multiplyScalar(g.y).addScaledVector(p,-f.y).multiplyScalar(O),m.copy(p).multiplyScalar(f.x).addScaledVector(u,-g.x).multiplyScalar(O),o[x].add(v),o[w].add(v),o[R].add(v),c[x].add(m),c[w].add(m),c[R].add(m))}let S=this.groups;S.length===0&&(S=[{start:0,count:e.count}]);for(let x=0,w=S.length;x<w;++x){let R=S[x],O=R.start,V=R.count;for(let W=O,B=O+V;W<B;W+=3)d(e.getX(W+0),e.getX(W+1),e.getX(W+2))}let E=new P,y=new P,b=new P,T=new P;function I(x){b.fromBufferAttribute(s,x),T.copy(b);let w=o[x];E.copy(w),E.sub(b.multiplyScalar(b.dot(w))).normalize(),y.crossVectors(T,w);let O=y.dot(c[x])<0?-1:1;a.setXYZW(x,E.x,E.y,E.z,O)}for(let x=0,w=S.length;x<w;++x){let R=S[x],O=R.start,V=R.count;for(let W=O,B=O+V;W<B;W+=3)I(e.getX(W+0)),I(e.getX(W+1)),I(e.getX(W+2))}this._transformed=!0}computeVertexNormals(){let e=this.index,t=this.getAttribute("position");if(t!==void 0){let n=this.getAttribute("normal");if(n===void 0||n.count!==t.count)n=new Yt(new Float32Array(t.count*3),3),this.setAttribute("normal",n);else for(let h=0,f=n.count;h<f;h++)n.setXYZ(h,0,0,0);let s=new P,r=new P,a=new P,o=new P,c=new P,l=new P,u=new P,p=new P;if(e)for(let h=0,f=e.count;h<f;h+=3){let g=e.getX(h+0),v=e.getX(h+1),m=e.getX(h+2);s.fromBufferAttribute(t,g),r.fromBufferAttribute(t,v),a.fromBufferAttribute(t,m),u.subVectors(a,r),p.subVectors(s,r),u.cross(p),o.fromBufferAttribute(n,g),c.fromBufferAttribute(n,v),l.fromBufferAttribute(n,m),o.add(u),c.add(u),l.add(u),n.setXYZ(g,o.x,o.y,o.z),n.setXYZ(v,c.x,c.y,c.z),n.setXYZ(m,l.x,l.y,l.z)}else for(let h=0,f=t.count;h<f;h+=3)s.fromBufferAttribute(t,h+0),r.fromBufferAttribute(t,h+1),a.fromBufferAttribute(t,h+2),u.subVectors(a,r),p.subVectors(s,r),u.cross(p),n.setXYZ(h+0,u.x,u.y,u.z),n.setXYZ(h+1,u.x,u.y,u.z),n.setXYZ(h+2,u.x,u.y,u.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){let e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)rn.fromBufferAttribute(e,t),rn.normalize(),e.setXYZ(t,rn.x,rn.y,rn.z)}toNonIndexed(){function e(o,c){let l=o.array,u=o.itemSize,p=o.normalized,h=new l.constructor(c.length*u),f=0,g=0;for(let v=0,m=c.length;v<m;v++){o.isInterleavedBufferAttribute?f=c[v]*o.data.stride+o.offset:f=c[v]*u;for(let d=0;d<u;d++)h[g++]=l[f++]}return new Yt(h,u,p)}if(this.index===null)return qe("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let t=new i,n=this.index.array,s=this.attributes;for(let o in s){let c=s[o],l=e(c,n);t.setAttribute(o,l)}let r=this.morphAttributes;for(let o in r){let c=[],l=r[o];for(let u=0,p=l.length;u<p;u++){let h=l[u],f=e(h,n);c.push(f)}t.morphAttributes[o]=c}t.morphTargetsRelative=this.morphTargetsRelative;let a=this.groups;for(let o=0,c=a.length;o<c;o++){let l=a[o];t.addGroup(l.start,l.count,l.materialIndex)}return t}toJSON(){let e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.parameters!==void 0&&this._transformed===!0?"BufferGeometry":this.type,e.name=this.name,Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0&&this._transformed!==!0){let c=this.parameters;for(let l in c)c[l]!==void 0&&(e[l]=c[l]);return e}e.data={attributes:{}};let t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});let n=this.attributes;for(let c in n){let l=n[c];e.data.attributes[c]=l.toJSON(e.data)}let s={},r=!1;for(let c in this.morphAttributes){let l=this.morphAttributes[c],u=[];for(let p=0,h=l.length;p<h;p++){let f=l[p];u.push(f.toJSON(e.data))}u.length>0&&(s[c]=u,r=!0)}r&&(e.data.morphAttributes=s,e.data.morphTargetsRelative=this.morphTargetsRelative);let a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));let o=this.boundingSphere;return o!==null&&(e.data.boundingSphere=o.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let t={};this.name=e.name;let n=e.index;n!==null&&this.setIndex(n.clone());let s=e.attributes;for(let l in s){let u=s[l];this.setAttribute(l,u.clone(t))}let r=e.morphAttributes;for(let l in r){let u=[],p=r[l];for(let h=0,f=p.length;h<f;h++)u.push(p[h].clone(t));this.morphAttributes[l]=u}this.morphTargetsRelative=e.morphTargetsRelative;let a=e.groups;for(let l=0,u=a.length;l<u;l++){let p=a[l];this.addGroup(p.start,p.count,p.materialIndex)}let o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());let c=e.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this._transformed=e._transformed,this}dispose(){this.dispatchEvent({type:"dispose"})}},za=class{constructor(e,t){this.isInterleavedBuffer=!0,this.array=e,this.stride=t,this.count=e!==void 0?e.length/t:0,this.usage=_c,this.updateRanges=[],this.version=0,this.uuid=Pi()}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,t,n){e*=this.stride,n*=t.stride;for(let s=0,r=this.stride;s<r;s++)this.array[e+s]=t.array[n+s];return this}set(e,t=0){return this.array.set(e,t),this}clone(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Pi()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);let t=new this.array.constructor(e.arrayBuffers[this.array.buffer._uuid]),n=new this.constructor(t,this.stride);return n.setUsage(this.usage),n}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Pi()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer)));let t={uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride};return t.usage=this.usage,t}},_n=new P,Mr=class i{constructor(e,t,n,s=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=e,this.itemSize=t,this.offset=n,this.normalized=s}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(e){this.data.needsUpdate=e}applyMatrix4(e){for(let t=0,n=this.data.count;t<n;t++)_n.fromBufferAttribute(this,t),_n.applyMatrix4(e),this.setXYZ(t,_n.x,_n.y,_n.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)_n.fromBufferAttribute(this,t),_n.applyNormalMatrix(e),this.setXYZ(t,_n.x,_n.y,_n.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)_n.fromBufferAttribute(this,t),_n.transformDirection(e),this.setXYZ(t,_n.x,_n.y,_n.z);return this}getComponent(e,t){let n=this.array[e*this.data.stride+this.offset+t];return this.normalized&&(n=$n(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=Ct(n,this.array)),this.data.array[e*this.data.stride+this.offset+t]=n,this}setX(e,t){return this.normalized&&(t=Ct(t,this.array)),this.data.array[e*this.data.stride+this.offset]=t,this}setY(e,t){return this.normalized&&(t=Ct(t,this.array)),this.data.array[e*this.data.stride+this.offset+1]=t,this}setZ(e,t){return this.normalized&&(t=Ct(t,this.array)),this.data.array[e*this.data.stride+this.offset+2]=t,this}setW(e,t){return this.normalized&&(t=Ct(t,this.array)),this.data.array[e*this.data.stride+this.offset+3]=t,this}getX(e){let t=this.data.array[e*this.data.stride+this.offset];return this.normalized&&(t=$n(t,this.array)),t}getY(e){let t=this.data.array[e*this.data.stride+this.offset+1];return this.normalized&&(t=$n(t,this.array)),t}getZ(e){let t=this.data.array[e*this.data.stride+this.offset+2];return this.normalized&&(t=$n(t,this.array)),t}getW(e){let t=this.data.array[e*this.data.stride+this.offset+3];return this.normalized&&(t=$n(t,this.array)),t}setXY(e,t,n){return e=e*this.data.stride+this.offset,this.normalized&&(t=Ct(t,this.array),n=Ct(n,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this}setXYZ(e,t,n,s){return e=e*this.data.stride+this.offset,this.normalized&&(t=Ct(t,this.array),n=Ct(n,this.array),s=Ct(s,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=s,this}setXYZW(e,t,n,s,r){return e=e*this.data.stride+this.offset,this.normalized&&(t=Ct(t,this.array),n=Ct(n,this.array),s=Ct(s,this.array),r=Ct(r,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=s,this.data.array[e+3]=r,this}clone(e){if(e===void 0){mr("InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");let t=[];for(let n=0;n<this.count;n++){let s=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[s+r])}return new Yt(new this.array.constructor(t),this.itemSize,this.normalized)}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.clone(e)),new i(e.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(e){if(e===void 0){mr("InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");let t=[];for(let n=0;n<this.count;n++){let s=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[s+r])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:t,normalized:this.normalized}}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.toJSON(e)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}},Il=new P,Ad=new P,Ed=new je,Vn=class{constructor(e=new P(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,s){return this.normal.set(e,t,n),this.constant=s,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){let s=Il.subVectors(n,t).cross(Ad.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(s,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){let e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t,n=!0){let s=e.delta(Il),r=this.normal.dot(s);if(r===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;let a=-(e.start.dot(this.normal)+this.constant)/r;return n===!0&&(a<0||a>1)?null:t.copy(e.start).addScaledVector(s,a)}intersectsLine(e){let t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){let n=t||Ed.getNormalMatrix(e),s=this.coplanarPoint(Il).applyMatrix4(e),r=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(r),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}toJSON(){return{normal:this.normal.toArray(),constant:this.constant}}fromJSON(e){return this.normal.fromArray(e.normal),this.constant=e.constant,this}},Cd=0,Wn=class extends jn{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Cd++}),this.uuid=Pi(),this.name="",this.type="Material",this.blending=zi,this.side=Oi,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=tc,this.blendDst=nc,this.blendEquation=is,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new We(0,0,0),this.blendAlpha=0,this.depthFunc=Rs,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=au,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Aa,this.stencilZFail=Aa,this.stencilZPass=Aa,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(let t in e){let n=e[t];if(n===void 0){qe(`Material: parameter '${t}' has value of undefined.`);continue}let s=this[t];if(s===void 0){qe(`Material: '${t}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector2&&n&&n.isVector2||s&&s.isEuler&&n&&n.isEuler||s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});let n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,n.blending=this.blending,n.side=this.side,n.shadowSide=this.shadowSide,n.vertexColors=this.vertexColors,n.opacity=this.opacity,n.transparent=this.transparent,n.blendSrc=this.blendSrc,n.blendDst=this.blendDst,n.blendEquation=this.blendEquation,n.blendSrcAlpha=this.blendSrcAlpha,n.blendDstAlpha=this.blendDstAlpha,n.blendEquationAlpha=this.blendEquationAlpha,n.blendColor=this.blendColor.getHex(),n.blendAlpha=this.blendAlpha,n.depthFunc=this.depthFunc,n.depthTest=this.depthTest,n.depthWrite=this.depthWrite,n.colorWrite=this.colorWrite,n.clipIntersection=this.clipIntersection,n.clipShadows=this.clipShadows,n.stencilWriteMask=this.stencilWriteMask,n.stencilFunc=this.stencilFunc,n.stencilRef=this.stencilRef,n.stencilFuncMask=this.stencilFuncMask,n.stencilFail=this.stencilFail,n.stencilZFail=this.stencilZFail,n.stencilZPass=this.stencilZPass,n.stencilWrite=this.stencilWrite,n.polygonOffset=this.polygonOffset,n.polygonOffsetFactor=this.polygonOffsetFactor,n.polygonOffsetUnits=this.polygonOffsetUnits,n.dithering=this.dithering,n.alphaTest=this.alphaTest,n.alphaHash=this.alphaHash,n.alphaToCoverage=this.alphaToCoverage,n.premultipliedAlpha=this.premultipliedAlpha,n.forceSinglePass=this.forceSinglePass,n.allowOverride=this.allowOverride,n.visible=this.visible,n.toneMapped=this.toneMapped,n.name=this.name,this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.retroreflectivity!==void 0&&(n.retroreflectivity=this.retroreflectivity),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),Array.isArray(this.clippingPlanes)&&this.clippingPlanes.length>0&&(n.clippingPlanes=this.clippingPlanes.map(r=>r.toJSON())),this.rotation!==void 0&&(n.rotation=this.rotation),this.depthPacking!==void 0&&(n.depthPacking=this.depthPacking),this.linewidth!==void 0&&(n.linewidth=this.linewidth),this.linecap!==void 0&&(n.linecap=this.linecap),this.linejoin!==void 0&&(n.linejoin=this.linejoin),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.wireframe!==void 0&&(n.wireframe=this.wireframe),this.wireframeLinewidth!==void 0&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!==void 0&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!==void 0&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading!==void 0&&(n.flatShading=this.flatShading),this.fog!==void 0&&(n.fog=this.fog),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(r){let a=[];for(let o in r){let c=r[o];delete c.metadata,a.push(c)}return a}if(t){let r=s(e.textures),a=s(e.images);r.length>0&&(n.textures=r),a.length>0&&(n.images=a)}return n}fromJSON(e,t){if(e.uuid!==void 0&&(this.uuid=e.uuid),e.name!==void 0&&(this.name=e.name),e.color!==void 0&&this.color!==void 0&&this.color.setHex(e.color),e.roughness!==void 0&&(this.roughness=e.roughness),e.metalness!==void 0&&(this.metalness=e.metalness),e.sheen!==void 0&&(this.sheen=e.sheen),e.sheenColor!==void 0&&(this.sheenColor=new We().setHex(e.sheenColor)),e.sheenRoughness!==void 0&&(this.sheenRoughness=e.sheenRoughness),e.emissive!==void 0&&this.emissive!==void 0&&this.emissive.setHex(e.emissive),e.specular!==void 0&&this.specular!==void 0&&this.specular.setHex(e.specular),e.specularIntensity!==void 0&&(this.specularIntensity=e.specularIntensity),e.specularColor!==void 0&&this.specularColor!==void 0&&this.specularColor.setHex(e.specularColor),e.shininess!==void 0&&(this.shininess=e.shininess),e.clearcoat!==void 0&&(this.clearcoat=e.clearcoat),e.clearcoatRoughness!==void 0&&(this.clearcoatRoughness=e.clearcoatRoughness),e.dispersion!==void 0&&(this.dispersion=e.dispersion),e.retroreflectivity!==void 0&&(this.retroreflectivity=e.retroreflectivity),e.iridescence!==void 0&&(this.iridescence=e.iridescence),e.iridescenceIOR!==void 0&&(this.iridescenceIOR=e.iridescenceIOR),e.iridescenceThicknessRange!==void 0&&(this.iridescenceThicknessRange=e.iridescenceThicknessRange),e.transmission!==void 0&&(this.transmission=e.transmission),e.thickness!==void 0&&(this.thickness=e.thickness),e.attenuationDistance!==void 0&&(this.attenuationDistance=e.attenuationDistance),e.attenuationColor!==void 0&&this.attenuationColor!==void 0&&this.attenuationColor.setHex(e.attenuationColor),e.anisotropy!==void 0&&(this.anisotropy=e.anisotropy),e.anisotropyRotation!==void 0&&(this.anisotropyRotation=e.anisotropyRotation),e.fog!==void 0&&(this.fog=e.fog),e.flatShading!==void 0&&(this.flatShading=e.flatShading),e.blending!==void 0&&(this.blending=e.blending),e.combine!==void 0&&(this.combine=e.combine),e.side!==void 0&&(this.side=e.side),e.shadowSide!==void 0&&(this.shadowSide=e.shadowSide),e.opacity!==void 0&&(this.opacity=e.opacity),e.transparent!==void 0&&(this.transparent=e.transparent),e.alphaTest!==void 0&&(this.alphaTest=e.alphaTest),e.alphaHash!==void 0&&(this.alphaHash=e.alphaHash),e.depthFunc!==void 0&&(this.depthFunc=e.depthFunc),e.depthTest!==void 0&&(this.depthTest=e.depthTest),e.depthWrite!==void 0&&(this.depthWrite=e.depthWrite),e.colorWrite!==void 0&&(this.colorWrite=e.colorWrite),e.clippingPlanes!==void 0&&(this.clippingPlanes=e.clippingPlanes.map(n=>new Vn().fromJSON(n))),e.clipIntersection!==void 0&&(this.clipIntersection=e.clipIntersection),e.clipShadows!==void 0&&(this.clipShadows=e.clipShadows),e.depthPacking!==void 0&&(this.depthPacking=e.depthPacking),e.blendSrc!==void 0&&(this.blendSrc=e.blendSrc),e.blendDst!==void 0&&(this.blendDst=e.blendDst),e.blendEquation!==void 0&&(this.blendEquation=e.blendEquation),e.blendSrcAlpha!==void 0&&(this.blendSrcAlpha=e.blendSrcAlpha),e.blendDstAlpha!==void 0&&(this.blendDstAlpha=e.blendDstAlpha),e.blendEquationAlpha!==void 0&&(this.blendEquationAlpha=e.blendEquationAlpha),e.blendColor!==void 0&&this.blendColor!==void 0&&this.blendColor.setHex(e.blendColor),e.blendAlpha!==void 0&&(this.blendAlpha=e.blendAlpha),e.stencilWriteMask!==void 0&&(this.stencilWriteMask=e.stencilWriteMask),e.stencilFunc!==void 0&&(this.stencilFunc=e.stencilFunc),e.stencilRef!==void 0&&(this.stencilRef=e.stencilRef),e.stencilFuncMask!==void 0&&(this.stencilFuncMask=e.stencilFuncMask),e.stencilFail!==void 0&&(this.stencilFail=e.stencilFail),e.stencilZFail!==void 0&&(this.stencilZFail=e.stencilZFail),e.stencilZPass!==void 0&&(this.stencilZPass=e.stencilZPass),e.stencilWrite!==void 0&&(this.stencilWrite=e.stencilWrite),e.wireframe!==void 0&&(this.wireframe=e.wireframe),e.wireframeLinewidth!==void 0&&(this.wireframeLinewidth=e.wireframeLinewidth),e.wireframeLinecap!==void 0&&(this.wireframeLinecap=e.wireframeLinecap),e.wireframeLinejoin!==void 0&&(this.wireframeLinejoin=e.wireframeLinejoin),e.rotation!==void 0&&(this.rotation=e.rotation),e.linewidth!==void 0&&(this.linewidth=e.linewidth),e.linecap!==void 0&&(this.linecap=e.linecap),e.linejoin!==void 0&&(this.linejoin=e.linejoin),e.dashSize!==void 0&&(this.dashSize=e.dashSize),e.gapSize!==void 0&&(this.gapSize=e.gapSize),e.scale!==void 0&&(this.scale=e.scale),e.polygonOffset!==void 0&&(this.polygonOffset=e.polygonOffset),e.polygonOffsetFactor!==void 0&&(this.polygonOffsetFactor=e.polygonOffsetFactor),e.polygonOffsetUnits!==void 0&&(this.polygonOffsetUnits=e.polygonOffsetUnits),e.dithering!==void 0&&(this.dithering=e.dithering),e.alphaToCoverage!==void 0&&(this.alphaToCoverage=e.alphaToCoverage),e.premultipliedAlpha!==void 0&&(this.premultipliedAlpha=e.premultipliedAlpha),e.forceSinglePass!==void 0&&(this.forceSinglePass=e.forceSinglePass),e.allowOverride!==void 0&&(this.allowOverride=e.allowOverride),e.visible!==void 0&&(this.visible=e.visible),e.toneMapped!==void 0&&(this.toneMapped=e.toneMapped),e.userData!==void 0&&(this.userData=e.userData),e.vertexColors!==void 0&&(typeof e.vertexColors=="number"?this.vertexColors=e.vertexColors>0:this.vertexColors=e.vertexColors),e.size!==void 0&&(this.size=e.size),e.sizeAttenuation!==void 0&&(this.sizeAttenuation=e.sizeAttenuation),e.map!==void 0&&(this.map=t[e.map]||null),e.matcap!==void 0&&(this.matcap=t[e.matcap]||null),e.alphaMap!==void 0&&(this.alphaMap=t[e.alphaMap]||null),e.bumpMap!==void 0&&(this.bumpMap=t[e.bumpMap]||null),e.bumpScale!==void 0&&(this.bumpScale=e.bumpScale),e.normalMap!==void 0&&(this.normalMap=t[e.normalMap]||null),e.normalMapType!==void 0&&(this.normalMapType=e.normalMapType),e.normalScale!==void 0){let n=e.normalScale;Array.isArray(n)===!1&&(n=[n,n]),this.normalScale=new Pe().fromArray(n)}return e.displacementMap!==void 0&&(this.displacementMap=t[e.displacementMap]||null),e.displacementScale!==void 0&&(this.displacementScale=e.displacementScale),e.displacementBias!==void 0&&(this.displacementBias=e.displacementBias),e.roughnessMap!==void 0&&(this.roughnessMap=t[e.roughnessMap]||null),e.metalnessMap!==void 0&&(this.metalnessMap=t[e.metalnessMap]||null),e.emissiveMap!==void 0&&(this.emissiveMap=t[e.emissiveMap]||null),e.emissiveIntensity!==void 0&&(this.emissiveIntensity=e.emissiveIntensity),e.specularMap!==void 0&&(this.specularMap=t[e.specularMap]||null),e.specularIntensityMap!==void 0&&(this.specularIntensityMap=t[e.specularIntensityMap]||null),e.specularColorMap!==void 0&&(this.specularColorMap=t[e.specularColorMap]||null),e.envMap!==void 0&&(this.envMap=t[e.envMap]||null),e.envMapRotation!==void 0&&this.envMapRotation.fromArray(e.envMapRotation),e.envMapIntensity!==void 0&&(this.envMapIntensity=e.envMapIntensity),e.reflectivity!==void 0&&(this.reflectivity=e.reflectivity),e.refractionRatio!==void 0&&(this.refractionRatio=e.refractionRatio),e.lightMap!==void 0&&(this.lightMap=t[e.lightMap]||null),e.lightMapIntensity!==void 0&&(this.lightMapIntensity=e.lightMapIntensity),e.aoMap!==void 0&&(this.aoMap=t[e.aoMap]||null),e.aoMapIntensity!==void 0&&(this.aoMapIntensity=e.aoMapIntensity),e.gradientMap!==void 0&&(this.gradientMap=t[e.gradientMap]||null),e.clearcoatMap!==void 0&&(this.clearcoatMap=t[e.clearcoatMap]||null),e.clearcoatRoughnessMap!==void 0&&(this.clearcoatRoughnessMap=t[e.clearcoatRoughnessMap]||null),e.clearcoatNormalMap!==void 0&&(this.clearcoatNormalMap=t[e.clearcoatNormalMap]||null),e.clearcoatNormalScale!==void 0&&(this.clearcoatNormalScale=new Pe().fromArray(e.clearcoatNormalScale)),e.iridescenceMap!==void 0&&(this.iridescenceMap=t[e.iridescenceMap]||null),e.iridescenceThicknessMap!==void 0&&(this.iridescenceThicknessMap=t[e.iridescenceThicknessMap]||null),e.transmissionMap!==void 0&&(this.transmissionMap=t[e.transmissionMap]||null),e.thicknessMap!==void 0&&(this.thicknessMap=t[e.thicknessMap]||null),e.anisotropyMap!==void 0&&(this.anisotropyMap=t[e.anisotropyMap]||null),e.sheenColorMap!==void 0&&(this.sheenColorMap=t[e.sheenColorMap]||null),e.sheenRoughnessMap!==void 0&&(this.sheenRoughnessMap=t[e.sheenRoughnessMap]||null),this}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;let t=e.clippingPlanes,n=null;if(t!==null){let s=t.length;n=new Array(s);for(let r=0;r!==s;++r)n[r]=t[r].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.allowOverride=e.allowOverride,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}},Li=class extends Wn{constructor(e){super(),this.isSpriteMaterial=!0,this.type="SpriteMaterial",this.color=new We(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.rotation=e.rotation,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}},vs,ir=new P,Ms=new P,Ss=new P,bs=new Pe,sr=new Pe,xu=new gt,ra=new P,rr=new P,aa=new P,hh=new Pe,Ll=new Pe,uh=new Pe,Ji=class extends Vt{constructor(e=new Li){if(super(),this.isSprite=!0,this.type="Sprite",vs===void 0){vs=new Rt;let t=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),n=new za(t,5);vs.setIndex([0,1,2,0,2,3]),vs.setAttribute("position",new Mr(n,3,0,!1)),vs.setAttribute("uv",new Mr(n,2,3,!1))}this.geometry=vs,this.material=e,this.center=new Pe(.5,.5),this.count=1}intersectsFrustum(e){return e.intersectsSprite(this)}raycast(e,t){e.camera===null&&Ze('Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),Ms.setFromMatrixScale(this.matrixWorld),xu.copy(e.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(e.camera.matrixWorldInverse,this.matrixWorld),Ss.setFromMatrixPosition(this.modelViewMatrix),e.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&Ms.multiplyScalar(-Ss.z);let n=this.material.rotation,s,r;n!==0&&(r=Math.cos(n),s=Math.sin(n));let a=this.center;oa(ra.set(-.5,-.5,0),Ss,a,Ms,s,r),oa(rr.set(.5,-.5,0),Ss,a,Ms,s,r),oa(aa.set(.5,.5,0),Ss,a,Ms,s,r),hh.set(0,0),Ll.set(1,0),uh.set(1,1);let o=e.ray.intersectTriangle(ra,rr,aa,!1,ir);if(o===null&&(oa(rr.set(-.5,.5,0),Ss,a,Ms,s,r),Ll.set(0,1),o=e.ray.intersectTriangle(ra,aa,rr,!1,ir),o===null))return;let c=e.ray.origin.distanceTo(ir);c<e.near||c>e.far||t.push({distance:c,point:ir.clone(),uv:ui.getInterpolation(ir,ra,rr,aa,hh,Ll,uh,new Pe),face:null,object:this})}copy(e,t){return super.copy(e,t),e.center!==void 0&&this.center.copy(e.center),this.material=e.material,this}};function oa(i,e,t,n,s,r){bs.subVectors(i,t).addScalar(.5).multiply(n),s!==void 0?(sr.x=r*bs.x-s*bs.y,sr.y=s*bs.x+r*bs.y):sr.copy(bs),i.copy(e),i.x+=sr.x,i.y+=sr.y,i.applyMatrix4(xu)}var hi=new P,Dl=new P,la=new P,ca=new P,$i=class{constructor(e=new P,t=new P(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,hi)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);let n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){let t=hi.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(hi.copy(this.origin).addScaledVector(this.direction,t),hi.distanceToSquared(e))}distanceSqToSegment(e,t,n,s){Dl.copy(e).add(t).multiplyScalar(.5),la.copy(t).sub(e).normalize(),ca.copy(this.origin).sub(Dl);let r=e.distanceTo(t)*.5,a=-this.direction.dot(la),o=ca.dot(this.direction),c=-ca.dot(la),l=ca.lengthSq(),u=Math.abs(1-a*a),p,h,f,g;if(u>0)if(p=a*c-o,h=a*o-c,g=r*u,p>=0)if(h>=-g)if(h<=g){let v=1/u;p*=v,h*=v,f=p*(p+a*h+2*o)+h*(a*p+h+2*c)+l}else h=r,p=Math.max(0,-(a*h+o)),f=-p*p+h*(h+2*c)+l;else h=-r,p=Math.max(0,-(a*h+o)),f=-p*p+h*(h+2*c)+l;else h<=-g?(p=Math.max(0,-(-a*r+o)),h=p>0?-r:Math.min(Math.max(-r,-c),r),f=-p*p+h*(h+2*c)+l):h<=g?(p=0,h=Math.min(Math.max(-r,-c),r),f=h*(h+2*c)+l):(p=Math.max(0,-(a*r+o)),h=p>0?r:Math.min(Math.max(-r,-c),r),f=-p*p+h*(h+2*c)+l);else h=a>0?-r:r,p=Math.max(0,-(a*h+o)),f=-p*p+h*(h+2*c)+l;return n&&n.copy(this.origin).addScaledVector(this.direction,p),s&&s.copy(Dl).addScaledVector(la,h),f}intersectSphere(e,t){if(e.radius<0)return null;hi.subVectors(e.center,this.origin);let n=hi.dot(this.direction),s=hi.dot(hi)-n*n,r=e.radius*e.radius;if(s>r)return null;let a=Math.sqrt(r-s),o=n-a,c=n+a;return c<0?null:o<0?this.at(c,t):this.at(o,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){let t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;let n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){let n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){let t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,s,r,a,o,c,l=1/this.direction.x,u=1/this.direction.y,p=1/this.direction.z,h=this.origin;return l>=0?(n=(e.min.x-h.x)*l,s=(e.max.x-h.x)*l):(n=(e.max.x-h.x)*l,s=(e.min.x-h.x)*l),u>=0?(r=(e.min.y-h.y)*u,a=(e.max.y-h.y)*u):(r=(e.max.y-h.y)*u,a=(e.min.y-h.y)*u),n>a||r>s||((r>n||isNaN(n))&&(n=r),(a<s||isNaN(s))&&(s=a),p>=0?(o=(e.min.z-h.z)*p,c=(e.max.z-h.z)*p):(o=(e.max.z-h.z)*p,c=(e.min.z-h.z)*p),n>c||o>s)||((o>n||n!==n)&&(n=o),(c<s||s!==s)&&(s=c),s<0)?null:this.at(n>=0?n:s,t)}intersectsBox(e){return this.intersectBox(e,hi)!==null}intersectTriangle(e,t,n,s,r){let a=this.origin,o=this.direction,c=o.x,l=o.y,u=o.z,p=e.x-a.x,h=e.y-a.y,f=e.z-a.z,g=t.x-a.x,v=t.y-a.y,m=t.z-a.z,d=n.x-a.x,S=n.y-a.y,E=n.z-a.z,y=Math.abs(c),b=Math.abs(l),T=Math.abs(u),I,x,w,R,O,V,W,B,J,ne,ie,de;if(y>=b&&y>=T?(w=c,V=p,J=g,de=d,c>=0?(I=l,x=u,R=h,O=f,W=v,B=m,ne=S,ie=E):(I=u,x=l,R=f,O=h,W=m,B=v,ne=E,ie=S)):b>=T?(w=l,V=h,J=v,de=S,l>=0?(I=u,x=c,R=f,O=p,W=m,B=g,ne=E,ie=d):(I=c,x=u,R=p,O=f,W=g,B=m,ne=d,ie=E)):(w=u,V=f,J=m,de=E,u>=0?(I=c,x=l,R=p,O=h,W=g,B=v,ne=d,ie=S):(I=l,x=c,R=h,O=p,W=v,B=g,ne=S,ie=d)),w===0)return null;let j=I/w,oe=x/w,ue=1/w,Ve=R-j*V,Ie=O-oe*V,pt=W-j*J,tt=B-oe*J,rt=ne-j*de,te=ie-oe*de,le=rt*tt-te*pt,Ae=Ve*te-Ie*rt,Je=pt*Ie-tt*Ve;if(s){if(le<0||Ae<0||Je<0)return null}else if((le<0||Ae<0||Je<0)&&(le>0||Ae>0||Je>0))return null;let Re=le+Ae+Je;if(Re===0)return null;let nt=ue*(le*V+Ae*J+Je*de);return(Re>0?nt<0:nt>0)?null:this.at(nt/Re,r)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},ft=class extends Wn{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new We(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new fi,this.combine=ic,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}},dh=new gt,qi=new $i,ha=new ni,fh=new P,ua=new P,da=new P,fa=new P,Nl=new P,pa=new P,ph=new P,ma=new P,Xe=class extends Vt{constructor(e=new Rt,t=new ft){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){let t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){let s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){let o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}getVertexPosition(e,t){let n=this.geometry,s=n.attributes.position,r=n.morphAttributes.position,a=n.morphTargetsRelative;t.fromBufferAttribute(s,e);let o=this.morphTargetInfluences;if(r&&o){pa.set(0,0,0);for(let c=0,l=r.length;c<l;c++){let u=o[c],p=r[c];u!==0&&(Nl.fromBufferAttribute(p,e),a?pa.addScaledVector(Nl,u):pa.addScaledVector(Nl.sub(t),u))}t.add(pa)}return t}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){let n=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),ha.copy(n.boundingSphere),ha.applyMatrix4(r),qi.copy(e.ray).recast(e.near),!(ha.containsPoint(qi.origin)===!1&&(qi.intersectSphere(ha,fh)===null||qi.origin.distanceToSquared(fh)>(e.far-e.near)**2))&&(dh.copy(r).invert(),qi.copy(e.ray).applyMatrix4(dh),!(n.boundingBox!==null&&qi.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(e,t,qi)))}_computeIntersections(e,t,n){let s,r=this.geometry,a=this.material,o=r.index,c=r.attributes.position,l=r.attributes.uv,u=r.attributes.uv1,p=r.attributes.normal,h=r.groups,f=r.drawRange;if(o!==null)if(Array.isArray(a))for(let g=0,v=h.length;g<v;g++){let m=h[g],d=a[m.materialIndex],S=Math.max(m.start,f.start),E=Math.min(o.count,Math.min(m.start+m.count,f.start+f.count));for(let y=S,b=E;y<b;y+=3){let T=o.getX(y),I=o.getX(y+1),x=o.getX(y+2);s=ga(this,d,e,n,l,u,p,T,I,x),s&&(s.faceIndex=Math.floor(y/3),s.face.materialIndex=m.materialIndex,t.push(s))}}else{let g=Math.max(0,f.start),v=Math.min(o.count,f.start+f.count);for(let m=g,d=v;m<d;m+=3){let S=o.getX(m),E=o.getX(m+1),y=o.getX(m+2);s=ga(this,a,e,n,l,u,p,S,E,y),s&&(s.faceIndex=Math.floor(m/3),t.push(s))}}else if(c!==void 0)if(Array.isArray(a))for(let g=0,v=h.length;g<v;g++){let m=h[g],d=a[m.materialIndex],S=Math.max(m.start,f.start),E=Math.min(c.count,Math.min(m.start+m.count,f.start+f.count));for(let y=S,b=E;y<b;y+=3){let T=y,I=y+1,x=y+2;s=ga(this,d,e,n,l,u,p,T,I,x),s&&(s.faceIndex=Math.floor(y/3),s.face.materialIndex=m.materialIndex,t.push(s))}}else{let g=Math.max(0,f.start),v=Math.min(c.count,f.start+f.count);for(let m=g,d=v;m<d;m+=3){let S=m,E=m+1,y=m+2;s=ga(this,a,e,n,l,u,p,S,E,y),s&&(s.faceIndex=Math.floor(m/3),t.push(s))}}}};function Rd(i,e,t,n,s,r,a,o){let c;if(e.side===cn?c=n.intersectTriangle(a,r,s,!0,o):c=n.intersectTriangle(s,r,a,e.side===Oi,o),c===null)return null;ma.copy(o),ma.applyMatrix4(i.matrixWorld);let l=t.ray.origin.distanceTo(ma);return l<t.near||l>t.far?null:{distance:l,point:ma.clone(),object:i}}function ga(i,e,t,n,s,r,a,o,c,l){i.getVertexPosition(o,ua),i.getVertexPosition(c,da),i.getVertexPosition(l,fa);let u=Rd(i,e,t,n,ua,da,fa,ph);if(u){let p=new P;ui.getBarycoord(ph,ua,da,fa,p),s&&(u.uv=ui.getInterpolatedAttribute(s,o,c,l,p,new Pe)),r&&(u.uv1=ui.getInterpolatedAttribute(r,o,c,l,p,new Pe)),a&&(u.normal=ui.getInterpolatedAttribute(a,o,c,l,p,new P),u.normal.dot(n.direction)>0&&u.normal.multiplyScalar(-1));let h={a:o,b:c,c:l,normal:new P,materialIndex:0};ui.getNormal(ua,da,fa,h.normal),u.face=h,u.barycoord=p}return u}var Sr=class extends xn{constructor(e=null,t=1,n=1,s,r,a,o,c,l=on,u=on,p,h){super(null,a,o,c,l,u,s,r,p,h),this.isDataTexture=!0,this.image={data:e,width:t,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var br=class extends Yt{constructor(e,t,n,s=1){super(e,t,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=s}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){let e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}},Ts=new gt,mh=new gt,_a=[],gh=new ti,Pd=new gt,ar=new Xe,or=new ni,pi=class extends Xe{constructor(e,t,n){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new br(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let s=0;s<n;s++)this.setMatrixAt(s,Pd)}computeBoundingBox(){let e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new ti),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,Ts),gh.copy(e.boundingBox).applyMatrix4(Ts),this.boundingBox.union(gh)}computeBoundingSphere(){let e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new ni),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,Ts),or.copy(e.boundingSphere).applyMatrix4(Ts),this.boundingSphere.union(or)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),e.morphTexture!==null&&(this.morphTexture=e.morphTexture.clone()),e.instanceColor!==null&&(this.instanceColor=e.instanceColor.clone()),this.count=e.count,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}getColorAt(e,t){return this.instanceColor===null?t.setRGB(1,1,1):t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){return t.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,t){let n=t.morphTargetInfluences,s=this.morphTexture.source.data.data,r=n.length+1,a=e*r+1;for(let o=0;o<n.length;o++)n[o]=s[a+o]}raycast(e,t){let n=this.matrixWorld,s=this.count;if(ar.geometry=this.geometry,ar.material=this.material,ar.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),or.copy(this.boundingSphere),or.applyMatrix4(n),e.ray.intersectsSphere(or)!==!1))for(let r=0;r<s;r++){this.getMatrixAt(r,Ts),mh.multiplyMatrices(n,Ts),ar.matrixWorld=mh,ar.raycast(e,_a);for(let a=0,o=_a.length;a<o;a++){let c=_a[a];c.instanceId=r,c.object=this,t.push(c)}_a.length=0}}setColorAt(e,t){return this.instanceColor===null&&(this.instanceColor=new br(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),t.toArray(this.instanceColor.array,e*3),this}setMatrixAt(e,t){return t.toArray(this.instanceMatrix.array,e*16),this}setMorphAt(e,t){let n=t.morphTargetInfluences,s=n.length+1;this.morphTexture===null&&(this.morphTexture=new Sr(new Float32Array(s*this.count),s,this.count,Mo,Ln));let r=this.morphTexture.source.data.data,a=0;for(let l=0;l<n.length;l++)a+=n[l];let o=this.geometry.morphTargetsRelative?1:1-a,c=s*e;return r[c]=o,r.set(n,c+1),this}updateMorphTargets(){}dispose(){super.dispose(),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}},Yi=new ni,Id=new Pe(.5,.5),xa=new P,Us=class{constructor(e=new Vn,t=new Vn,n=new Vn,s=new Vn,r=new Vn,a=new Vn){this.planes=[e,t,n,s,r,a]}set(e,t,n,s,r,a){let o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(n),o[3].copy(s),o[4].copy(r),o[5].copy(a),this}copy(e){let t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=kn,n=!1){let s=this.planes,r=e.elements,a=r[0],o=r[1],c=r[2],l=r[3],u=r[4],p=r[5],h=r[6],f=r[7],g=r[8],v=r[9],m=r[10],d=r[11],S=r[12],E=r[13],y=r[14],b=r[15];if(s[0].setComponents(l-a,f-u,d-g,b-S).normalize(),s[1].setComponents(l+a,f+u,d+g,b+S).normalize(),s[2].setComponents(l+o,f+p,d+v,b+E).normalize(),s[3].setComponents(l-o,f-p,d-v,b-E).normalize(),n)s[4].setComponents(c,h,m,y).normalize(),s[5].setComponents(l-c,f-h,d-m,b-y).normalize();else if(s[4].setComponents(l-c,f-h,d-m,b-y).normalize(),t===kn)s[5].setComponents(l+c,f+h,d+m,b+y).normalize();else if(t===Ps)s[5].setComponents(c,h,m,y).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),Yi.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{let t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),Yi.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(Yi)}intersectsSprite(e){Yi.center.set(0,0,0);let t=Id.distanceTo(e.center);return Yi.radius=.7071067811865476+t,Yi.applyMatrix4(e.matrixWorld),this.intersectsSphere(Yi)}intersectsSphere(e){let t=this.planes,n=e.center,s=-e.radius;for(let r=0;r<6;r++)if(t[r].distanceToPoint(n)<s)return!1;return!0}intersectsBox(e){let t=this.planes;for(let n=0;n<6;n++){let s=t[n];if(xa.x=s.normal.x>0?e.max.x:e.min.x,xa.y=s.normal.y>0?e.max.y:e.min.y,xa.z=s.normal.z>0?e.max.z:e.min.z,s.distanceToPoint(xa)<0)return!1}return!0}containsPoint(e){let t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}};var Fs=class extends Wn{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new We(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}},Ga=new P,Va=new P,_h=new gt,lr=new $i,ya=new ni,Ul=new P,xh=new P,ka=class extends Vt{constructor(e=new Rt,t=new Fs){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){let e=this.geometry;if(e.index===null){let t=e.attributes.position,n=[0];for(let s=1,r=t.count;s<r;s++)Ga.fromBufferAttribute(t,s-1),Va.fromBufferAttribute(t,s),n[s]=n[s-1],n[s]+=Ga.distanceTo(Va);e.setAttribute("lineDistance",new st(n,1))}else qe("Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){let n=this.geometry,s=this.matrixWorld,r=e.params.Line.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),ya.copy(n.boundingSphere),ya.applyMatrix4(s),ya.radius+=r,e.ray.intersectsSphere(ya)===!1)return;_h.copy(s).invert(),lr.copy(e.ray).applyMatrix4(_h);let o=r/((this.scale.x+this.scale.y+this.scale.z)/3),c=o*o,l=this.isLineSegments?2:1,u=n.index,h=n.attributes.position;if(u!==null){let f=Math.max(0,a.start),g=Math.min(u.count,a.start+a.count);for(let v=f,m=g-1;v<m;v+=l){let d=u.getX(v),S=u.getX(v+1),E=va(this,e,lr,c,d,S,v);E&&t.push(E)}if(this.isLineLoop){let v=u.getX(g-1),m=u.getX(f),d=va(this,e,lr,c,v,m,g-1);d&&t.push(d)}}else{let f=Math.max(0,a.start),g=Math.min(h.count,a.start+a.count);for(let v=f,m=g-1;v<m;v+=l){let d=va(this,e,lr,c,v,v+1,v);d&&t.push(d)}if(this.isLineLoop){let v=va(this,e,lr,c,g-1,f,g-1);v&&t.push(v)}}}updateMorphTargets(){let t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){let s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){let o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}};function va(i,e,t,n,s,r,a){let o=i.geometry.attributes.position;if(Ga.fromBufferAttribute(o,s),Va.fromBufferAttribute(o,r),t.distanceSqToSegment(Ga,Va,Ul,xh)>n)return;Ul.applyMatrix4(i.matrixWorld);let l=e.ray.origin.distanceTo(Ul);if(!(l<e.near||l>e.far))return{distance:l,point:xh.clone().applyMatrix4(i.matrixWorld),index:a,face:null,faceIndex:null,barycoord:null,object:i}}var yh=new P,vh=new P,Tr=class extends ka{constructor(e,t){super(e,t),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){let e=this.geometry;if(e.index===null){let t=e.attributes.position,n=[];for(let s=0,r=t.count;s<r;s+=2)yh.fromBufferAttribute(t,s),vh.fromBufferAttribute(t,s+1),n[s]=s===0?0:n[s-1],n[s+1]=n[s]+yh.distanceTo(vh);e.setAttribute("lineDistance",new st(n,1))}else qe("LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}};var Di=class extends Wn{constructor(e){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new We(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}},Mh=new gt,Xl=new $i,Ma=new ni,Sa=new P,Ki=class extends Vt{constructor(e=new Rt,t=new Di){super(),this.isPoints=!0,this.type="Points",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){let n=this.geometry,s=this.matrixWorld,r=e.params.Points.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Ma.copy(n.boundingSphere),Ma.applyMatrix4(s),Ma.radius+=r,e.ray.intersectsSphere(Ma)===!1)return;Mh.copy(s).invert(),Xl.copy(e.ray).applyMatrix4(Mh);let o=r/((this.scale.x+this.scale.y+this.scale.z)/3),c=o*o,l=n.index,p=n.attributes.position;if(l!==null){let h=Math.max(0,a.start),f=Math.min(l.count,a.start+a.count);for(let g=h,v=f;g<v;g++){let m=l.getX(g);Sa.fromBufferAttribute(p,m),Sh(Sa,m,c,s,e,t,this)}}else{let h=Math.max(0,a.start),f=Math.min(p.count,a.start+a.count);for(let g=h,v=f;g<v;g++)Sa.fromBufferAttribute(p,g),Sh(Sa,g,c,s,e,t,this)}}updateMorphTargets(){let t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){let s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){let o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}};function Sh(i,e,t,n,s,r,a){let o=Xl.distanceSqToPoint(i);if(o<t){let c=new P;Xl.closestPointToPoint(i,c),c.applyMatrix4(n);let l=s.ray.origin.distanceTo(c);if(l<s.near||l>s.far)return;r.push({distance:l,distanceToRay:Math.sqrt(o),point:c,index:e,face:null,faceIndex:null,barycoord:null,object:a})}}var wr=class extends xn{constructor(e=[],t=Gi,n,s,r,a,o,c,l,u){super(e,t,n,s,r,a,o,c,l,u),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}},mi=class extends xn{constructor(e,t,n,s,r,a,o,c,l){super(e,t,n,s,r,a,o,c,l),this.isCanvasTexture=!0,this.needsUpdate=!0}};var Ni=class extends xn{constructor(e,t,n=qn,s,r,a,o=on,c=on,l,u=Qn,p=1){if(u!==Qn&&u!==ki)throw new Error("THREE.DepthTexture: format must be either THREE.DepthFormat or THREE.DepthStencilFormat");let h={width:e,height:t,depth:p};super(h,s,r,a,o,c,u,n,l),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new Ls(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){let t=super.toJSON(e);return t.compareFunction=this.compareFunction,t}},Ha=class extends Ni{constructor(e,t=qn,n=Gi,s,r,a=on,o=on,c,l=Qn){let u={width:e,height:e,depth:1},p=[u,u,u,u,u,u];super(e,e,t,n,s,r,a,o,c,l),this.image=p,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(e){this.image=e}},Ar=class extends xn{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}},pe=class i extends Rt{constructor(e=1,t=1,n=1,s=1,r=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:n,widthSegments:s,heightSegments:r,depthSegments:a};let o=this;s=Math.floor(s),r=Math.floor(r),a=Math.floor(a);let c=[],l=[],u=[],p=[],h=0,f=0;g("z","y","x",-1,-1,n,t,e,a,r,0),g("z","y","x",1,-1,n,t,-e,a,r,1),g("x","z","y",1,1,e,n,t,s,a,2),g("x","z","y",1,-1,e,n,-t,s,a,3),g("x","y","z",1,-1,e,t,n,s,r,4),g("x","y","z",-1,-1,e,t,-n,s,r,5),this.setIndex(c),this.setAttribute("position",new st(l,3)),this.setAttribute("normal",new st(u,3)),this.setAttribute("uv",new st(p,2));function g(v,m,d,S,E,y,b,T,I,x,w){let R=y/I,O=b/x,V=y/2,W=b/2,B=T/2,J=I+1,ne=x+1,ie=0,de=0,j=new P;for(let oe=0;oe<ne;oe++){let ue=oe*O-W;for(let Ve=0;Ve<J;Ve++){let Ie=Ve*R-V;j[v]=Ie*S,j[m]=ue*E,j[d]=B,l.push(j.x,j.y,j.z),j[v]=0,j[m]=0,j[d]=T>0?1:-1,u.push(j.x,j.y,j.z),p.push(Ve/I),p.push(1-oe/x),ie+=1}}for(let oe=0;oe<x;oe++)for(let ue=0;ue<I;ue++){let Ve=h+ue+J*oe,Ie=h+ue+J*(oe+1),pt=h+(ue+1)+J*(oe+1),tt=h+(ue+1)+J*oe;c.push(Ve,Ie,tt),c.push(Ie,pt,tt),de+=6}o.addGroup(f,de,w),f+=de,h+=ie}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}},Qi=class i extends Rt{constructor(e=1,t=1,n=4,s=8,r=1){super(),this.type="CapsuleGeometry",this.parameters={radius:e,height:t,capSegments:n,radialSegments:s,heightSegments:r},t=Math.max(0,t),n=Math.max(1,Math.floor(n)),s=Math.max(3,Math.floor(s)),r=Math.max(1,Math.floor(r));let a=[],o=[],c=[],l=[],u=t/2,p=Math.PI/2*e,h=t,f=2*p+h,g=n*2+r,v=s+1,m=new P,d=new P;for(let S=0;S<=g;S++){let E=0,y=0,b=0,T=0;if(S<=n){let w=S/n,R=w*Math.PI/2;y=-u-e*Math.cos(R),b=e*Math.sin(R),T=-e*Math.cos(R),E=w*p}else if(S<=n+r){let w=(S-n)/r;y=-u+w*t,b=e,T=0,E=p+w*h}else{let w=(S-n-r)/n,R=w*Math.PI/2;y=u+e*Math.sin(R),b=e*Math.cos(R),T=e*Math.sin(R),E=p+h+w*p}let I=Math.max(0,Math.min(1,E/f)),x=0;S===0?x=.5/s:S===g&&(x=-.5/s);for(let w=0;w<=s;w++){let R=w/s,O=R*Math.PI*2,V=Math.sin(O),W=Math.cos(O);d.x=-b*W,d.y=y,d.z=b*V,o.push(d.x,d.y,d.z),m.set(-b*W,T,b*V),m.normalize(),c.push(m.x,m.y,m.z),l.push(R+x,I)}if(S>0){let w=(S-1)*v;for(let R=0;R<s;R++){let O=w+R,V=w+R+1,W=S*v+R,B=S*v+R+1;a.push(O,V,W),a.push(V,B,W)}}}this.setIndex(a),this.setAttribute("position",new st(o,3)),this.setAttribute("normal",new st(c,3)),this.setAttribute("uv",new st(l,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.radius,e.height,e.capSegments,e.radialSegments,e.heightSegments)}},Sn=class i extends Rt{constructor(e=1,t=32,n=0,s=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:e,segments:t,thetaStart:n,thetaLength:s},t=Math.max(3,t);let r=[],a=[],o=[],c=[],l=new P,u=new Pe;a.push(0,0,0),o.push(0,0,1),c.push(.5,.5);for(let p=0,h=3;p<=t;p++,h+=3){let f=n+p/t*s;l.x=e*Math.cos(f),l.y=e*Math.sin(f),a.push(l.x,l.y,l.z),o.push(0,0,1),u.x=(a[h]/e+1)/2,u.y=(a[h+1]/e+1)/2,c.push(u.x,u.y)}for(let p=1;p<=t;p++)r.push(p,p+1,0);this.setIndex(r),this.setAttribute("position",new st(a,3)),this.setAttribute("normal",new st(o,3)),this.setAttribute("uv",new st(c,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.radius,e.segments,e.thetaStart,e.thetaLength)}},et=class i extends Rt{constructor(e=1,t=1,n=1,s=32,r=1,a=!1,o=0,c=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:n,radialSegments:s,heightSegments:r,openEnded:a,thetaStart:o,thetaLength:c};let l=this;s=Math.floor(s),r=Math.floor(r);let u=[],p=[],h=[],f=[],g=0,v=[],m=n/2,d=0;S(),a===!1&&(e>0&&E(!0),t>0&&E(!1)),this.setIndex(u),this.setAttribute("position",new st(p,3)),this.setAttribute("normal",new st(h,3)),this.setAttribute("uv",new st(f,2));function S(){let y=new P,b=new P,T=0,I=(t-e)/n;for(let x=0;x<=r;x++){let w=[],R=x/r,O=R*(t-e)+e;for(let V=0;V<=s;V++){let W=V/s,B=W*c+o,J=Math.sin(B),ne=Math.cos(B);b.x=O*J,b.y=-R*n+m,b.z=O*ne,p.push(b.x,b.y,b.z),y.set(J,I,ne).normalize(),h.push(y.x,y.y,y.z),f.push(W,1-R),w.push(g++)}v.push(w)}for(let x=0;x<s;x++)for(let w=0;w<r;w++){let R=v[w][x],O=v[w+1][x],V=v[w+1][x+1],W=v[w][x+1];(e>0||w!==0)&&(u.push(R,O,W),T+=3),(t>0||w!==r-1)&&(u.push(O,V,W),T+=3)}l.addGroup(d,T,0),d+=T}function E(y){let b=g,T=new Pe,I=new P,x=0,w=y===!0?e:t,R=y===!0?1:-1;for(let V=1;V<=s;V++)p.push(0,m*R,0),h.push(0,R,0),f.push(.5,.5),g++;let O=g;for(let V=0;V<=s;V++){let B=V/s*c+o,J=Math.cos(B),ne=Math.sin(B);I.x=w*ne,I.y=m*R,I.z=w*J,p.push(I.x,I.y,I.z),h.push(0,R,0),T.x=J*.5+.5,T.y=ne*.5*R+.5,f.push(T.x,T.y),g++}for(let V=0;V<s;V++){let W=b+V,B=O+V;y===!0?u.push(B,B+1,W):u.push(B+1,B,W),x+=3}l.addGroup(d,x,y===!0?1:2),d+=x}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}},$t=class i extends et{constructor(e=1,t=1,n=32,s=1,r=!1,a=0,o=Math.PI*2){super(0,e,t,n,s,r,a,o),this.type="ConeGeometry",this.parameters={radius:e,height:t,radialSegments:n,heightSegments:s,openEnded:r,thetaStart:a,thetaLength:o}}static fromJSON(e){return new i(e.radius,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}},Er=class i extends Rt{constructor(e=[],t=[],n=1,s=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:e,indices:t,radius:n,detail:s};let r=[],a=[];o(s),l(n),u(),this.setAttribute("position",new st(r,3)),this.setAttribute("normal",new st(r.slice(),3)),this.setAttribute("uv",new st(a,2)),s===0?this.computeVertexNormals():this.normalizeNormals();function o(S){let E=new P,y=new P,b=new P;for(let T=0;T<t.length;T+=3)f(t[T+0],E),f(t[T+1],y),f(t[T+2],b),c(E,y,b,S)}function c(S,E,y,b){let T=b+1,I=[];for(let x=0;x<=T;x++){I[x]=[];let w=S.clone().lerp(y,x/T),R=E.clone().lerp(y,x/T),O=T-x;for(let V=0;V<=O;V++)V===0&&x===T?I[x][V]=w:I[x][V]=w.clone().lerp(R,V/O)}for(let x=0;x<T;x++)for(let w=0;w<2*(T-x)-1;w++){let R=Math.floor(w/2);w%2===0?(h(I[x][R+1]),h(I[x+1][R]),h(I[x][R])):(h(I[x][R+1]),h(I[x+1][R+1]),h(I[x+1][R]))}}function l(S){let E=new P;for(let y=0;y<r.length;y+=3)E.x=r[y+0],E.y=r[y+1],E.z=r[y+2],E.normalize().multiplyScalar(S),r[y+0]=E.x,r[y+1]=E.y,r[y+2]=E.z}function u(){let S=new P;for(let E=0;E<r.length;E+=3){S.x=r[E+0],S.y=r[E+1],S.z=r[E+2];let y=m(S)/2/Math.PI+.5,b=d(S)/Math.PI+.5;a.push(y,1-b)}g(),p()}function p(){for(let S=0;S<a.length;S+=6){let E=a[S+0],y=a[S+2],b=a[S+4],T=Math.max(E,y,b),I=Math.min(E,y,b);T>.9&&I<.1&&(E<.2&&(a[S+0]+=1),y<.2&&(a[S+2]+=1),b<.2&&(a[S+4]+=1))}}function h(S){r.push(S.x,S.y,S.z)}function f(S,E){let y=S*3;E.x=e[y+0],E.y=e[y+1],E.z=e[y+2]}function g(){let S=new P,E=new P,y=new P,b=new P,T=new Pe,I=new Pe,x=new Pe;for(let w=0,R=0;w<r.length;w+=9,R+=6){S.set(r[w+0],r[w+1],r[w+2]),E.set(r[w+3],r[w+4],r[w+5]),y.set(r[w+6],r[w+7],r[w+8]),T.set(a[R+0],a[R+1]),I.set(a[R+2],a[R+3]),x.set(a[R+4],a[R+5]),b.copy(S).add(E).add(y).divideScalar(3);let O=m(b);v(T,R+0,S,O),v(I,R+2,E,O),v(x,R+4,y,O)}}function v(S,E,y,b){b<0&&S.x===1&&(a[E]=S.x-1),y.x===0&&y.z===0&&(a[E]=b/2/Math.PI+.5)}function m(S){return Math.atan2(S.z,-S.x)}function d(S){return Math.atan2(-S.y,Math.sqrt(S.x*S.x+S.z*S.z))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.vertices,e.indices,e.radius,e.detail)}},Cr=class i extends Er{constructor(e=1,t=0){let n=(1+Math.sqrt(5))/2,s=1/n,r=[-1,-1,-1,-1,-1,1,-1,1,-1,-1,1,1,1,-1,-1,1,-1,1,1,1,-1,1,1,1,0,-s,-n,0,-s,n,0,s,-n,0,s,n,-s,-n,0,-s,n,0,s,-n,0,s,n,0,-n,0,-s,n,0,-s,-n,0,s,n,0,s],a=[3,11,7,3,7,15,3,15,13,7,19,17,7,17,6,7,6,15,17,4,8,17,8,10,17,10,6,8,0,16,8,16,2,8,2,10,0,12,1,0,1,18,0,18,16,6,10,2,6,2,13,6,13,15,2,16,18,2,18,3,2,3,13,18,1,9,18,9,11,18,11,3,4,14,12,4,12,0,4,0,8,11,9,5,11,5,19,11,19,7,19,5,14,19,14,4,19,4,17,1,12,14,1,14,5,1,5,9];super(r,a,e,t),this.type="DodecahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new i(e.radius,e.detail)}};var In=class{constructor(){this.type="Curve",this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){qe("Curve: .getPoint() not implemented.")}getPointAt(e,t){let n=this.getUtoTmapping(e);return this.getPoint(n,t)}getPoints(e=5){let t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return t}getSpacedPoints(e=5){let t=[];for(let n=0;n<=e;n++)t.push(this.getPointAt(n/e));return t}getLength(){let e=this.getLengths();return e[e.length-1]}getLengths(e=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===e+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;let t=[],n,s=this.getPoint(0),r=0;t.push(0);for(let a=1;a<=e;a++)n=this.getPoint(a/e),r+=n.distanceTo(s),t.push(r),s=n;return this.cacheArcLengths=t,t}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(e,t=null){let n=this.getLengths(),s=0,r=n.length,a;t?a=t:a=e*n[r-1];let o=0,c=r-1,l;for(;o<=c;)if(s=Math.floor(o+(c-o)/2),l=n[s]-a,l<0)o=s+1;else if(l>0)c=s-1;else{c=s;break}if(s=c,n[s]===a)return s/(r-1);let u=n[s],h=n[s+1]-u,f=(a-u)/h;return(s+f)/(r-1)}getTangent(e,t){let s=e-1e-4,r=e+1e-4;s<0&&(s=0),r>1&&(r=1);let a=this.getPoint(s),o=this.getPoint(r),c=t||(a.isVector2?new Pe:new P);return c.copy(o).sub(a).normalize(),c}getTangentAt(e,t){let n=this.getUtoTmapping(e);return this.getTangent(n,t)}computeFrenetFrames(e,t=!1){let n=new P,s=[],r=[],a=[],o=new P,c=new gt;for(let f=0;f<=e;f++){let g=f/e;s[f]=this.getTangentAt(g,new P)}r[0]=new P,a[0]=new P;let l=Number.MAX_VALUE,u=Math.abs(s[0].x),p=Math.abs(s[0].y),h=Math.abs(s[0].z);u<=l&&(l=u,n.set(1,0,0)),p<=l&&(l=p,n.set(0,1,0)),h<=l&&n.set(0,0,1),o.crossVectors(s[0],n).normalize(),r[0].crossVectors(s[0],o),a[0].crossVectors(s[0],r[0]);for(let f=1;f<=e;f++){if(r[f]=r[f-1].clone(),a[f]=a[f-1].clone(),o.crossVectors(s[f-1],s[f]),o.length()>Number.EPSILON){o.normalize();let g=Math.acos(ht(s[f-1].dot(s[f]),-1,1));r[f].applyMatrix4(c.makeRotationAxis(o,g))}a[f].crossVectors(s[f],r[f])}if(t===!0){let f=Math.acos(ht(r[0].dot(r[e]),-1,1));f/=e,s[0].dot(o.crossVectors(r[0],r[e]))>0&&(f=-f);for(let g=1;g<=e;g++)r[g].applyMatrix4(c.makeRotationAxis(s[g],f*g)),a[g].crossVectors(s[g],r[g])}return{tangents:s,normals:r,binormals:a}}clone(){return new this.constructor().copy(this)}copy(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}toJSON(){let e={metadata:{version:4.7,type:"Curve",generator:"Curve.toJSON"}};return e.arcLengthDivisions=this.arcLengthDivisions,e.type=this.type,e}fromJSON(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}},Rr=class extends In{constructor(e=0,t=0,n=1,s=1,r=0,a=Math.PI*2,o=!1,c=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=e,this.aY=t,this.xRadius=n,this.yRadius=s,this.aStartAngle=r,this.aEndAngle=a,this.aClockwise=o,this.aRotation=c}getPoint(e,t=new Pe){let n=t,s=Math.PI*2,r=this.aEndAngle-this.aStartAngle,a=Math.abs(r)<Number.EPSILON;for(;r<0;)r+=s;for(;r>s;)r-=s;r<Number.EPSILON&&(a?r=0:r=s),this.aClockwise===!0&&!a&&(r===s?r=-s:r=r-s);let o=this.aStartAngle+e*r,c=this.aX+this.xRadius*Math.cos(o),l=this.aY+this.yRadius*Math.sin(o);if(this.aRotation!==0){let u=Math.cos(this.aRotation),p=Math.sin(this.aRotation),h=c-this.aX,f=l-this.aY;c=h*u-f*p+this.aX,l=h*p+f*u+this.aY}return n.set(c,l)}copy(e){return super.copy(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}toJSON(){let e=super.toJSON();return e.aX=this.aX,e.aY=this.aY,e.xRadius=this.xRadius,e.yRadius=this.yRadius,e.aStartAngle=this.aStartAngle,e.aEndAngle=this.aEndAngle,e.aClockwise=this.aClockwise,e.aRotation=this.aRotation,e}fromJSON(e){return super.fromJSON(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}},Wa=class extends Rr{constructor(e,t,n,s,r,a){super(e,t,n,n,s,r,a),this.isArcCurve=!0,this.type="ArcCurve"}};function yc(){let i=0,e=0,t=0,n=0;function s(r,a,o,c){i=r,e=o,t=-3*r+3*a-2*o-c,n=2*r-2*a+o+c}return{initCatmullRom:function(r,a,o,c,l){s(a,o,l*(o-r),l*(c-a))},initNonuniformCatmullRom:function(r,a,o,c,l,u,p){let h=(a-r)/l-(o-r)/(l+u)+(o-a)/u,f=(o-a)/u-(c-a)/(u+p)+(c-o)/p;h*=u,f*=u,s(a,o,h,f)},calc:function(r){let a=r*r,o=a*r;return i+e*r+t*a+n*o}}}var bh=new P,Th=new P,Fl=new yc,Bl=new yc,Ol=new yc,gi=class extends In{constructor(e=[],t=!1,n="centripetal",s=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=e,this.closed=t,this.curveType=n,this.tension=s}getPoint(e,t=new P){let n=t,s=this.points,r=s.length,a=(r-(this.closed?0:1))*e,o=Math.floor(a),c=a-o;this.closed?o+=o>0?0:(Math.floor(Math.abs(o)/r)+1)*r:c===0&&o===r-1&&(o=r-2,c=1);let l,u;this.closed||o>0?l=s[(o-1)%r]:(Th.subVectors(s[0],s[1]).add(s[0]),l=Th);let p=s[o%r],h=s[(o+1)%r];if(this.closed||o+2<r?u=s[(o+2)%r]:(bh.subVectors(s[r-1],s[r-2]).add(s[r-1]),u=bh),this.curveType==="centripetal"||this.curveType==="chordal"){let f=this.curveType==="chordal"?.5:.25,g=Math.pow(l.distanceToSquared(p),f),v=Math.pow(p.distanceToSquared(h),f),m=Math.pow(h.distanceToSquared(u),f);v<1e-4&&(v=1),g<1e-4&&(g=v),m<1e-4&&(m=v),Fl.initNonuniformCatmullRom(l.x,p.x,h.x,u.x,g,v,m),Bl.initNonuniformCatmullRom(l.y,p.y,h.y,u.y,g,v,m),Ol.initNonuniformCatmullRom(l.z,p.z,h.z,u.z,g,v,m)}else this.curveType==="catmullrom"&&(Fl.initCatmullRom(l.x,p.x,h.x,u.x,this.tension),Bl.initCatmullRom(l.y,p.y,h.y,u.y,this.tension),Ol.initCatmullRom(l.z,p.z,h.z,u.z,this.tension));return n.set(Fl.calc(c),Bl.calc(c),Ol.calc(c)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let s=e.points[t];this.points.push(s.clone())}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}toJSON(){let e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){let s=this.points[t];e.points.push(s.toArray())}return e.closed=this.closed,e.curveType=this.curveType,e.tension=this.tension,e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let s=e.points[t];this.points.push(new P().fromArray(s))}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}};function wh(i,e,t,n,s){let r=(n-e)*.5,a=(s-t)*.5,o=i*i,c=i*o;return(2*t-2*n+r+a)*c+(-3*t+3*n-2*r-a)*o+r*i+t}function Ld(i,e){let t=1-i;return t*t*e}function Dd(i,e){return 2*(1-i)*i*e}function Nd(i,e){return i*i*e}function cr(i,e,t,n){return Ld(i,e)+Dd(i,t)+Nd(i,n)}function Ud(i,e){let t=1-i;return t*t*t*e}function Fd(i,e){let t=1-i;return 3*t*t*i*e}function Bd(i,e){return 3*(1-i)*i*i*e}function Od(i,e){return i*i*i*e}function hr(i,e,t,n,s){return Ud(i,e)+Fd(i,t)+Bd(i,n)+Od(i,s)}var Xa=class extends In{constructor(e=new Pe,t=new Pe,n=new Pe,s=new Pe){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=e,this.v1=t,this.v2=n,this.v3=s}getPoint(e,t=new Pe){let n=t,s=this.v0,r=this.v1,a=this.v2,o=this.v3;return n.set(hr(e,s.x,r.x,a.x,o.x),hr(e,s.y,r.y,a.y,o.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}},qa=class extends In{constructor(e=new P,t=new P,n=new P,s=new P){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=e,this.v1=t,this.v2=n,this.v3=s}getPoint(e,t=new P){let n=t,s=this.v0,r=this.v1,a=this.v2,o=this.v3;return n.set(hr(e,s.x,r.x,a.x,o.x),hr(e,s.y,r.y,a.y,o.y),hr(e,s.z,r.z,a.z,o.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}},Ya=class extends In{constructor(e=new Pe,t=new Pe){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=e,this.v2=t}getPoint(e,t=new Pe){let n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new Pe){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},Za=class extends In{constructor(e=new P,t=new P){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=e,this.v2=t}getPoint(e,t=new P){let n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new P){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},Ja=class extends In{constructor(e=new Pe,t=new Pe,n=new Pe){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new Pe){let n=t,s=this.v0,r=this.v1,a=this.v2;return n.set(cr(e,s.x,r.x,a.x),cr(e,s.y,r.y,a.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},Pr=class extends In{constructor(e=new P,t=new P,n=new P){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new P){let n=t,s=this.v0,r=this.v1,a=this.v2;return n.set(cr(e,s.x,r.x,a.x),cr(e,s.y,r.y,a.y),cr(e,s.z,r.z,a.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},$a=class extends In{constructor(e=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=e}getPoint(e,t=new Pe){let n=t,s=this.points,r=(s.length-1)*e,a=Math.floor(r),o=r-a,c=s[a===0?a:a-1],l=s[a],u=s[a>s.length-2?s.length-1:a+1],p=s[a>s.length-3?s.length-1:a+2];return n.set(wh(o,c.x,l.x,u.x,p.x),wh(o,c.y,l.y,u.y,p.y)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let s=e.points[t];this.points.push(s.clone())}return this}toJSON(){let e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){let s=this.points[t];e.points.push(s.toArray())}return e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let s=e.points[t];this.points.push(new Pe().fromArray(s))}return this}},zd=Object.freeze({__proto__:null,ArcCurve:Wa,CatmullRomCurve3:gi,CubicBezierCurve:Xa,CubicBezierCurve3:qa,EllipseCurve:Rr,LineCurve:Ya,LineCurve3:Za,QuadraticBezierCurve:Ja,QuadraticBezierCurve3:Pr,SplineCurve:$a});var Ir=class i extends Er{constructor(e=1,t=0){let n=(1+Math.sqrt(5))/2,s=[-1,n,0,1,n,0,-1,-n,0,1,-n,0,0,-1,n,0,1,n,0,-1,-n,0,1,-n,n,0,-1,n,0,1,-n,0,-1,-n,0,1],r=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(s,r,e,t),this.type="IcosahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new i(e.radius,e.detail)}};var _t=class i extends Rt{constructor(e=1,t=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:n,heightSegments:s};let r=e/2,a=t/2,o=Math.floor(n),c=Math.floor(s),l=o+1,u=c+1,p=e/o,h=t/c,f=[],g=[],v=[],m=[];for(let d=0;d<u;d++){let S=d*h-a;for(let E=0;E<l;E++){let y=E*p-r;g.push(y,-S,0),v.push(0,0,1),m.push(E/o),m.push(1-d/c)}}for(let d=0;d<c;d++)for(let S=0;S<o;S++){let E=S+l*d,y=S+l*(d+1),b=S+1+l*(d+1),T=S+1+l*d;f.push(E,y,T),f.push(y,b,T)}this.setIndex(f),this.setAttribute("position",new st(g,3)),this.setAttribute("normal",new st(v,3)),this.setAttribute("uv",new st(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.width,e.height,e.widthSegments,e.heightSegments)}},Bs=class i extends Rt{constructor(e=.5,t=1,n=32,s=1,r=0,a=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:e,outerRadius:t,thetaSegments:n,phiSegments:s,thetaStart:r,thetaLength:a},n=Math.max(3,n),s=Math.max(1,s);let o=[],c=[],l=[],u=[],p=e,h=(t-e)/s,f=new P,g=new Pe;for(let v=0;v<=s;v++){for(let m=0;m<=n;m++){let d=r+m/n*a;f.x=p*Math.cos(d),f.y=p*Math.sin(d),c.push(f.x,f.y,f.z),l.push(0,0,1),g.x=(f.x/t+1)/2,g.y=(f.y/t+1)/2,u.push(g.x,g.y)}p+=h}for(let v=0;v<s;v++){let m=v*(n+1);for(let d=0;d<n;d++){let S=d+m,E=S,y=S+n+1,b=S+n+2,T=S+1;o.push(E,y,T),o.push(y,b,T)}}this.setIndex(o),this.setAttribute("position",new st(c,3)),this.setAttribute("normal",new st(l,3)),this.setAttribute("uv",new st(u,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.innerRadius,e.outerRadius,e.thetaSegments,e.phiSegments,e.thetaStart,e.thetaLength)}};var vt=class i extends Rt{constructor(e=1,t=32,n=16,s=0,r=Math.PI*2,a=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:n,phiStart:s,phiLength:r,thetaStart:a,thetaLength:o},t=Math.max(3,Math.floor(t)),n=Math.max(2,Math.floor(n));let c=Math.min(a+o,Math.PI),l=0,u=[],p=new P,h=new P,f=[],g=[],v=[],m=[];for(let d=0;d<=n;d++){let S=[],E=d/n,y=a+E*o,b=e*Math.cos(y),T=Math.sqrt(e*e-b*b),I=0;d===0&&a===0?I=.5/t:d===n&&c===Math.PI&&(I=-.5/t);for(let x=0;x<=t;x++){let w=x/t,R=s+w*r;p.x=-T*Math.cos(R),p.y=b,p.z=T*Math.sin(R),g.push(p.x,p.y,p.z),h.copy(p).normalize(),v.push(h.x,h.y,h.z),m.push(w+I,1-E),S.push(l++)}u.push(S)}for(let d=0;d<n;d++)for(let S=0;S<t;S++){let E=u[d][S+1],y=u[d][S],b=u[d+1][S],T=u[d+1][S+1];(d!==0||a>0)&&f.push(E,y,T),(d!==n-1||c<Math.PI)&&f.push(y,b,T)}this.setIndex(f),this.setAttribute("position",new st(g,3)),this.setAttribute("normal",new st(v,3)),this.setAttribute("uv",new st(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}};var yn=class i extends Rt{constructor(e=1,t=.4,n=12,s=48,r=Math.PI*2,a=0,o=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:e,tube:t,radialSegments:n,tubularSegments:s,arc:r,thetaStart:a,thetaLength:o},n=Math.floor(n),s=Math.floor(s);let c=[],l=[],u=[],p=[],h=new P,f=new P,g=new P;for(let v=0;v<=n;v++){let m=a+v/n*o;for(let d=0;d<=s;d++){let S=d/s*r;f.x=(e+t*Math.cos(m))*Math.cos(S),f.y=(e+t*Math.cos(m))*Math.sin(S),f.z=t*Math.sin(m),l.push(f.x,f.y,f.z),h.x=e*Math.cos(S),h.y=e*Math.sin(S),g.subVectors(f,h).normalize(),u.push(g.x,g.y,g.z),p.push(d/s),p.push(v/n)}}for(let v=1;v<=n;v++)for(let m=1;m<=s;m++){let d=(s+1)*v+m-1,S=(s+1)*(v-1)+m-1,E=(s+1)*(v-1)+m,y=(s+1)*v+m;c.push(d,S,y),c.push(S,E,y)}this.setIndex(c),this.setAttribute("position",new st(l,3)),this.setAttribute("normal",new st(u,3)),this.setAttribute("uv",new st(p,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.radius,e.tube,e.radialSegments,e.tubularSegments,e.arc,e.thetaStart,e.thetaLength)}};var Os=class i extends Rt{constructor(e=new Pr(new P(-1,-1,0),new P(-1,1,0),new P(1,1,0)),t=64,n=1,s=8,r=!1){super(),this.type="TubeGeometry",this.parameters={path:e,tubularSegments:t,radius:n,radialSegments:s,closed:r};let a=e.computeFrenetFrames(t,r);this.tangents=a.tangents,this.normals=a.normals,this.binormals=a.binormals;let o=new P,c=new P,l=new Pe,u=new P,p=[],h=[],f=[],g=[];v(),this.setIndex(g),this.setAttribute("position",new st(p,3)),this.setAttribute("normal",new st(h,3)),this.setAttribute("uv",new st(f,2));function v(){for(let E=0;E<t;E++)m(E);m(r===!1?t:0),S(),d()}function m(E){u=e.getPointAt(E/t,u);let y=a.normals[E],b=a.binormals[E];for(let T=0;T<=s;T++){let I=T/s*Math.PI*2,x=Math.sin(I),w=-Math.cos(I);c.x=w*y.x+x*b.x,c.y=w*y.y+x*b.y,c.z=w*y.z+x*b.z,c.normalize(),h.push(c.x,c.y,c.z),o.x=u.x+n*c.x,o.y=u.y+n*c.y,o.z=u.z+n*c.z,p.push(o.x,o.y,o.z)}}function d(){for(let E=1;E<=t;E++)for(let y=1;y<=s;y++){let b=(s+1)*(E-1)+(y-1),T=(s+1)*E+(y-1),I=(s+1)*E+y,x=(s+1)*(E-1)+y;g.push(b,T,x),g.push(T,I,x)}}function S(){for(let E=0;E<=t;E++)for(let y=0;y<=s;y++)l.x=E/t,l.y=y/s,f.push(l.x,l.y)}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){let e=super.toJSON();return e.path=this.parameters.path.toJSON(),e}static fromJSON(e){return new i(new zd[e.path.type]().fromJSON(e.path),e.tubularSegments,e.radius,e.radialSegments,e.closed)}};function rs(i){let e={};for(let t in i){e[t]={};for(let n in i[t]){let s=i[t][n];if(Ah(s))s.isRenderTargetTexture?(qe("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][n]=null):e[t][n]=s.clone();else if(Array.isArray(s))if(Ah(s[0])){let r=[];for(let a=0,o=s.length;a<o;a++)r[a]=s[a].clone();e[t][n]=r}else e[t][n]=s.slice();else e[t][n]=s}}return e}function mn(i){let e={};for(let t=0;t<i.length;t++){let n=rs(i[t]);for(let s in n)e[s]=n[s]}return e}function Ah(i){return i&&(i.isColor||i.isMatrix3||i.isMatrix4||i.isVector2||i.isVector3||i.isVector4||i.isTexture||i.isQuaternion)}function Gd(i){let e=[];for(let t=0;t<i.length;t++)e.push(i[t].clone());return e}function vc(i){let e=i.getRenderTarget();return e===null?i.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:dt.workingColorSpace}var yu={clone:rs,merge:mn},Vd=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,kd=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,vn=class extends Wn{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Vd,this.fragmentShader=kd,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=rs(e.uniforms),this.uniformsGroups=Gd(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this.defaultAttributeValues=Object.assign({},e.defaultAttributeValues),this.index0AttributeName=e.index0AttributeName,this.uniformsNeedUpdate=e.uniformsNeedUpdate,this}toJSON(e){let t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(let s in this.uniforms){let a=this.uniforms[s].value;a&&a.isTexture?t.uniforms[s]={type:"t",value:a.toJSON(e).uuid}:a&&a.isColor?t.uniforms[s]={type:"c",value:a.getHex()}:a&&a.isVector2?t.uniforms[s]={type:"v2",value:a.toArray()}:a&&a.isVector3?t.uniforms[s]={type:"v3",value:a.toArray()}:a&&a.isVector4?t.uniforms[s]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?t.uniforms[s]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?t.uniforms[s]={type:"m4",value:a.toArray()}:t.uniforms[s]={value:a}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;let n={};for(let s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}fromJSON(e,t){if(super.fromJSON(e,t),e.uniforms!==void 0)for(let n in e.uniforms){let s=e.uniforms[n];switch(this.uniforms[n]={},s.type){case"t":this.uniforms[n].value=t[s.value]||null;break;case"c":this.uniforms[n].value=new We().setHex(s.value);break;case"v2":this.uniforms[n].value=new Pe().fromArray(s.value);break;case"v3":this.uniforms[n].value=new P().fromArray(s.value);break;case"v4":this.uniforms[n].value=new Gt().fromArray(s.value);break;case"m3":this.uniforms[n].value=new je().fromArray(s.value);break;case"m4":this.uniforms[n].value=new gt().fromArray(s.value);break;default:this.uniforms[n].value=s.value}}if(e.defines!==void 0&&(this.defines=e.defines),e.vertexShader!==void 0&&(this.vertexShader=e.vertexShader),e.fragmentShader!==void 0&&(this.fragmentShader=e.fragmentShader),e.glslVersion!==void 0&&(this.glslVersion=e.glslVersion),e.extensions!==void 0)for(let n in e.extensions)this.extensions[n]=e.extensions[n];return e.lights!==void 0&&(this.lights=e.lights),e.clipping!==void 0&&(this.clipping=e.clipping),this}},Ka=class extends vn{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}},Nt=class extends Wn{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new We(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new We(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=tl,this.normalScale=new Pe(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new fi,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}},Lr=class extends Nt{constructor(e){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:"",PHYSICAL:""},this.type="MeshPhysicalMaterial",this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new Pe(1,1),this.clearcoatNormalMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return ht(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(t){this.ior=(1+.4*t)/(1-.4*t)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessRange=[100,400],this.iridescenceThicknessMap=null,this.sheenColor=new We(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new We(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new We(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._dispersion=0,this._iridescence=0,this._retroreflectivity=0,this._sheen=0,this._transmission=0,this.setValues(e)}get anisotropy(){return this._anisotropy}set anisotropy(e){this._anisotropy>0!=e>0&&this.version++,this._anisotropy=e}get clearcoat(){return this._clearcoat}set clearcoat(e){this._clearcoat>0!=e>0&&this.version++,this._clearcoat=e}get iridescence(){return this._iridescence}set iridescence(e){this._iridescence>0!=e>0&&this.version++,this._iridescence=e}get dispersion(){return this._dispersion}set dispersion(e){this._dispersion>0!=e>0&&this.version++,this._dispersion=e}get retroreflectivity(){return this._retroreflectivity}set retroreflectivity(e){this._retroreflectivity>0!=e>0&&this.version++,this._retroreflectivity=e}get sheen(){return this._sheen}set sheen(e){this._sheen>0!=e>0&&this.version++,this._sheen=e}get transmission(){return this._transmission}set transmission(e){this._transmission>0!=e>0&&this.version++,this._transmission=e}copy(e){return super.copy(e),this.defines={STANDARD:"",PHYSICAL:""},this.anisotropy=e.anisotropy,this.anisotropyRotation=e.anisotropyRotation,this.anisotropyMap=e.anisotropyMap,this.clearcoat=e.clearcoat,this.clearcoatMap=e.clearcoatMap,this.clearcoatRoughness=e.clearcoatRoughness,this.clearcoatRoughnessMap=e.clearcoatRoughnessMap,this.clearcoatNormalMap=e.clearcoatNormalMap,this.clearcoatNormalScale.copy(e.clearcoatNormalScale),this.dispersion=e.dispersion,this.ior=e.ior,this.iridescence=e.iridescence,this.iridescenceMap=e.iridescenceMap,this.iridescenceIOR=e.iridescenceIOR,this.iridescenceThicknessRange=[...e.iridescenceThicknessRange],this.iridescenceThicknessMap=e.iridescenceThicknessMap,this.retroreflectivity=e.retroreflectivity,this.sheen=e.sheen,this.sheenColor.copy(e.sheenColor),this.sheenColorMap=e.sheenColorMap,this.sheenRoughness=e.sheenRoughness,this.sheenRoughnessMap=e.sheenRoughnessMap,this.transmission=e.transmission,this.transmissionMap=e.transmissionMap,this.thickness=e.thickness,this.thicknessMap=e.thicknessMap,this.attenuationDistance=e.attenuationDistance,this.attenuationColor.copy(e.attenuationColor),this.specularIntensity=e.specularIntensity,this.specularIntensityMap=e.specularIntensityMap,this.specularColor.copy(e.specularColor),this.specularColorMap=e.specularColorMap,this}};var Qa=class extends Wn{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=su,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}},ja=class extends Wn{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}};function ws(i,e){return!i||i.constructor===e?i:typeof e.BYTES_PER_ELEMENT=="number"?new e(i):Array.prototype.slice.call(i)}function zl(i){return i!==void 0&&i.inTangents!==void 0&&i.outTangents!==void 0}var Ui=class{constructor(e,t,n,s){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=s!==void 0?s:new t.constructor(n),this.sampleValues=t,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(e){let t=this.parameterPositions,n=this._cachedIndex,s=t[n],r=t[n-1];n:{e:{let a;t:{i:if(!(e<s)){for(let o=n+2;;){if(s===void 0){if(e<r)break i;return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===o)break;if(r=s,s=t[++n],e<s)break e}a=t.length;break t}if(!(e>=r)){let o=t[1];e<o&&(n=2,r=o);for(let c=n-2;;){if(r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===c)break;if(s=r,r=t[--n-1],e>=r)break e}a=n,n=0;break t}break n}for(;n<a;){let o=n+a>>>1;e<t[o]?a=o:n=o+1}if(s=t[n],r=t[n-1],r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(s===void 0)return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,r,s)}return this.interpolate_(n,r,e,s)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){let t=this.resultBuffer,n=this.sampleValues,s=this.valueSize,r=e*s;for(let a=0;a!==s;++a)t[a]=n[r+a];return t}interpolate_(){throw new Error("THREE.Interpolant: Call to abstract method.")}intervalChanged_(){}},eo=class extends Ui{constructor(e,t,n,s){super(e,t,n,s),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:kl,endingEnd:kl}}intervalChanged_(e,t,n){let s=this.parameterPositions,r=e-2,a=e+1,o=s[r],c=s[a];if(o===void 0)switch(this.getSettings_().endingStart){case Hl:r=e,o=2*t-n;break;case Wl:r=s.length-2,o=t+s[r]-s[r+1];break;default:r=e,o=n}if(c===void 0)switch(this.getSettings_().endingEnd){case Hl:a=e,c=2*n-t;break;case Wl:a=1,c=n+s[1]-s[0];break;default:a=e-1,c=t}let l=(n-t)*.5,u=this.valueSize;this._weightPrev=l/(t-o),this._weightNext=l/(c-n),this._offsetPrev=r*u,this._offsetNext=a*u}interpolate_(e,t,n,s){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,c=e*o,l=c-o,u=this._offsetPrev,p=this._offsetNext,h=this._weightPrev,f=this._weightNext,g=(n-t)/(s-t),v=g*g,m=v*g,d=-h*m+2*h*v-h*g,S=(1+h)*m+(-1.5-2*h)*v+(-.5+h)*g+1,E=(-1-f)*m+(1.5+f)*v+.5*g,y=f*m-f*v;for(let b=0;b!==o;++b)r[b]=d*a[u+b]+S*a[l+b]+E*a[c+b]+y*a[p+b];return r}},to=class extends Ui{constructor(e,t,n,s){super(e,t,n,s)}interpolate_(e,t,n,s){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,c=e*o,l=c-o,u=(n-t)/(s-t),p=1-u;for(let h=0;h!==o;++h)r[h]=a[l+h]*p+a[c+h]*u;return r}},no=class extends Ui{constructor(e,t,n,s){super(e,t,n,s)}interpolate_(e){return this.copySampleValue_(e-1)}},io=class extends Ui{interpolate_(e,t,n,s){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,c=e*o,l=c-o,u=this.inTangents,p=this.outTangents;if(!u||!p){let g=(n-t)/(s-t),v=1-g;for(let m=0;m!==o;++m)r[m]=a[l+m]*v+a[c+m]*g;return r}let h=o*2,f=e-1;for(let g=0;g!==o;++g){let v=a[l+g],m=a[c+g],d=f*h+g*2,S=p[d],E=p[d+1],y=e*h+g*2,b=u[y],T=u[y+1],I=Wd(n,t,S,b,s);r[g]=vu(I,v,E,T,m)}return r}};function vu(i,e,t,n,s){let r=1-i;return r*r*r*e+3*r*r*i*t+3*r*i*i*n+i*i*i*s}function Hd(i,e,t,n,s){let r=1-i;return 3*r*r*(t-e)+6*r*i*(n-t)+3*i*i*(s-n)}function Wd(i,e,t,n,s){let r=(i-e)/(s-e);for(let a=0;a<8;a++){let o=vu(r,e,t,n,s)-i;if(Math.abs(o)<1e-10)break;let c=Hd(r,e,t,n,s);if(Math.abs(c)<1e-10)break;r=Math.max(0,Math.min(1,r-o/c))}return r}var En=class{constructor(e,t,n,s){if(e===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(t===void 0||t.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+e);this.name=e,this.times=ws(t,this.TimeBufferType),this.values=ws(n,this.ValueBufferType),this.setInterpolation(s||this.DefaultInterpolation)}static toJSON(e){let t=e.constructor,n;if(t.toJSON!==this.toJSON)n=t.toJSON(e);else{n={name:e.name,times:ws(e.times,Array),values:ws(e.values,Array)};let s=e.getInterpolation();s!==e.DefaultInterpolation&&(n.interpolation=s),zl(e.settings)&&(n.settings={inTangents:ws(e.settings.inTangents,Array),outTangents:ws(e.settings.outTangents,Array)})}return n.type=e.ValueTypeName,n}InterpolantFactoryMethodDiscrete(e){return new no(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new to(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new eo(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodBezier(e){let t=new io(this.times,this.values,this.getValueSize(),e);return this.settings&&(t.inTangents=this.settings.inTangents,t.outTangents=this.settings.outTangents),t}setInterpolation(e){let t;switch(e){case ur:t=this.InterpolantFactoryMethodDiscrete;break;case Ua:t=this.InterpolantFactoryMethodLinear;break;case wa:t=this.InterpolantFactoryMethodSmooth;break;case Vl:t=this.InterpolantFactoryMethodBezier;break}if(t===void 0){let n="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(n);return qe("KeyframeTrack:",n),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return ur;case this.InterpolantFactoryMethodLinear:return Ua;case this.InterpolantFactoryMethodSmooth:return wa;case this.InterpolantFactoryMethodBezier:return Vl}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){let t=this.times;for(let n=0,s=t.length;n!==s;++n)t[n]+=e}return this}scale(e){if(e!==1){let t=this.times;for(let n=0,s=t.length;n!==s;++n)t[n]*=e;zl(this.settings)&&(Eh(this.settings.inTangents,e),Eh(this.settings.outTangents,e))}return this}trim(e,t){let n=this.times,s=n.length,r=0,a=s-1;for(;r!==s&&n[r]<e;)++r;for(;a!==-1&&n[a]>t;)--a;if(++a,r!==0||a!==s){r>=a&&(a=Math.max(a,1),r=a-1);let o=this.getValueSize();this.times=n.slice(r,a),this.values=this.values.slice(r*o,a*o)}return this}validate(){let e=!0,t=this.getValueSize();t-Math.floor(t)!==0&&(Ze("KeyframeTrack: Invalid value size in track.",this),e=!1);let n=this.times,s=this.values,r=n.length;r===0&&(Ze("KeyframeTrack: Track is empty.",this),e=!1);let a=null;for(let o=0;o!==r;o++){let c=n[o];if(typeof c=="number"&&isNaN(c)){Ze("KeyframeTrack: Time is not a valid number.",this,o,c),e=!1;break}if(a!==null&&a>c){Ze("KeyframeTrack: Out of order keys.",this,o,c,a),e=!1;break}a=c}if(s!==void 0&&ud(s))for(let o=0,c=s.length;o!==c;++o){let l=s[o];if(isNaN(l)){Ze("KeyframeTrack: Value is not a valid number.",this,o,l),e=!1;break}}return e}optimize(){let e=this.times.slice(),t=this.values.slice(),n=this.getValueSize(),s=this.getInterpolation()===wa,r=e.length-1,a=1;for(let o=1;o<r;++o){let c=!1,l=e[o],u=e[o+1];if(l!==u&&(o!==1||l!==e[0]))if(s)c=!0;else{let p=o*n,h=p-n,f=p+n;for(let g=0;g!==n;++g){let v=t[p+g];if(v!==t[h+g]||v!==t[f+g]){c=!0;break}}}if(c){if(o!==a){e[a]=e[o];let p=o*n,h=a*n;for(let f=0;f!==n;++f)t[h+f]=t[p+f]}++a}}if(r>0){e[a]=e[r];for(let o=r*n,c=a*n,l=0;l!==n;++l)t[c+l]=t[o+l];++a}return a!==e.length?(this.times=e.slice(0,a),this.values=t.slice(0,a*n)):(this.times=e,this.values=t),this}clone(){let e=this.times.slice(),t=this.values.slice(),n=this.constructor,s=new n(this.name,e,t);return s.createInterpolant=this.createInterpolant,zl(this.settings)&&(s.settings={inTangents:this.settings.inTangents.slice(),outTangents:this.settings.outTangents.slice()}),s}};function Eh(i,e){for(let t=0,n=i.length;t!==n;t+=2)i[t]*=e}En.prototype.ValueTypeName="";En.prototype.TimeBufferType=Float32Array;En.prototype.ValueBufferType=Float32Array;En.prototype.DefaultInterpolation=Ua;var Fi=class extends En{constructor(e,t,n){super(e,t,n)}};Fi.prototype.ValueTypeName="bool";Fi.prototype.ValueBufferType=Array;Fi.prototype.DefaultInterpolation=ur;Fi.prototype.InterpolantFactoryMethodLinear=void 0;Fi.prototype.InterpolantFactoryMethodSmooth=void 0;var so=class extends En{constructor(e,t,n,s){super(e,t,n,s)}};so.prototype.ValueTypeName="color";var ro=class extends En{constructor(e,t,n,s){super(e,t,n,s)}};ro.prototype.ValueTypeName="number";var ao=class extends Ui{constructor(e,t,n,s){super(e,t,n,s)}interpolate_(e,t,n,s){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,c=(n-t)/(s-t),l=e*o;for(let u=l+o;l!==u;l+=4)ei.slerpFlat(r,0,a,l-o,a,l,c);return r}},Dr=class extends En{constructor(e,t,n,s){super(e,t,n,s)}InterpolantFactoryMethodLinear(e){return new ao(this.times,this.values,this.getValueSize(),e)}};Dr.prototype.ValueTypeName="quaternion";Dr.prototype.InterpolantFactoryMethodSmooth=void 0;var Bi=class extends En{constructor(e,t,n){super(e,t,n)}};Bi.prototype.ValueTypeName="string";Bi.prototype.ValueBufferType=Array;Bi.prototype.DefaultInterpolation=ur;Bi.prototype.InterpolantFactoryMethodLinear=void 0;Bi.prototype.InterpolantFactoryMethodSmooth=void 0;var oo=class extends En{constructor(e,t,n,s){super(e,t,n,s)}};oo.prototype.ValueTypeName="vector";var lo=class{constructor(e,t,n){let s=this,r=!1,a=0,o=0,c,l=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=n,this._abortController=null,this.itemStart=function(u){o++,r===!1&&s.onStart!==void 0&&s.onStart(u,a,o),r=!0},this.itemEnd=function(u){a++,s.onProgress!==void 0&&s.onProgress(u,a,o),a===o&&(r=!1,s.onLoad!==void 0&&s.onLoad())},this.itemError=function(u){s.onError!==void 0&&s.onError(u)},this.resolveURL=function(u){return u=u.normalize("NFC"),c?c(u):u},this.setURLModifier=function(u){return c=u,this},this.addHandler=function(u,p){return l.push(u,p),this},this.removeHandler=function(u){let p=l.indexOf(u);return p!==-1&&l.splice(p,2),this},this.getHandler=function(u){for(let p=0,h=l.length;p<h;p+=2){let f=l[p],g=l[p+1];if(f.global&&(f.lastIndex=0),f.test(u))return g}return null},this.abort=function(){return this.abortController.abort(),this._abortController=null,this}}get abortController(){return this._abortController||(this._abortController=new AbortController),this._abortController}},Mu=new lo,co=class{constructor(e){this.manager=e!==void 0?e:Mu,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}load(){}loadAsync(e,t){let n=this;return new Promise(function(s,r){n.load(e,s,t,r)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}abort(){return this}};co.DEFAULT_MATERIAL_NAME="__DEFAULT";var ji=class extends Vt{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new We(e),this.intensity=t}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){let t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,t}},es=class extends ji{constructor(e,t,n){super(e,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(Vt.DEFAULT_UP),this.updateMatrix(),this.groundColor=new We(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}toJSON(e){let t=super.toJSON(e);return t.object.groundColor=this.groundColor.getHex(),t}},Gl=new gt,Ch=new P,Rh=new P,zs=class{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.biasNode=null,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new Pe(512,512),this.mapType=bn,this.map=null,this.mapPass=null,this.matrix=new gt,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Us,this._frameExtents=new Pe(1,1),this._viewportCount=1,this._viewports=[new Gt(0,0,1,1)]}getViewportCount(){return this._viewportCount}getCamera(){return this.camera}getFrustum(){return this._frustum}updateMatrices(e){let t=this.camera;Ch.setFromMatrixPosition(e.matrixWorld),t.position.copy(Ch),Rh.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(Rh),t.updateMatrixWorld(),this._updateMatrix(t,this.matrix,this._frustum)}_updateMatrix(e,t,n,s){Gl.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),n.setFromProjectionMatrix(Gl,e.coordinateSystem,e.reversedDepth);let r=this._frameExtents,a=s?s.z/r.x:1,o=s?s.w/r.y:1,c=s?s.x/r.x:0,l=s?s.y/r.y:0;e.coordinateSystem===Ps||e.reversedDepth?t.set(.5*a,0,0,.5*a+c,0,.5*o,0,.5*o+l,0,0,1,0,0,0,0,1):t.set(.5*a,0,0,.5*a+c,0,.5*o,0,.5*o+l,0,0,.5,.5,0,0,0,1),t.multiply(Gl)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this.biasNode=e.biasNode,this}clone(){return new this.constructor().copy(this)}toJSON(){let e={};return e.intensity=this.intensity,e.bias=this.bias,e.normalBias=this.normalBias,e.radius=this.radius,e.blurSamples=this.blurSamples,e.mapSize=this.mapSize.toArray(),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}},ba=new P,Ta=new ei,Jn=new P,Nr=class extends Vt{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new gt,this.projectionMatrix=new gt,this.projectionMatrixInverse=new gt,this.coordinateSystem=kn,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorld.decompose(ba,Ta,Jn),Jn.x===1&&Jn.y===1&&Jn.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(ba,Ta,Jn.set(1,1,1)).invert()}updateWorldMatrix(e,t,n=!1){super.updateWorldMatrix(e,t,n),this.matrixWorld.decompose(ba,Ta,Jn),Jn.x===1&&Jn.y===1&&Jn.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(ba,Ta,Jn.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}},Ri=new P,Ph=new Pe,Ih=new Pe,an=class extends Nr{constructor(e=50,t=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){let t=.5*this.getFilmHeight()/e;this.fov=gr*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){let e=Math.tan(fl*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return gr*2*Math.atan(Math.tan(fl*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){Ri.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(Ri.x,Ri.y).multiplyScalar(-e/Ri.z),Ri.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(Ri.x,Ri.y).multiplyScalar(-e/Ri.z)}getViewSize(e,t){return this.getViewBounds(e,Ph,Ih),t.subVectors(Ih,Ph)}setViewOffset(e,t,n,s,r,a){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=this.near,t=e*Math.tan(fl*.5*this.fov)/this.zoom,n=2*t,s=this.aspect*n,r=-.5*s,a=this.view;if(this.view!==null&&this.view.enabled){let c=a.fullWidth,l=a.fullHeight;r+=a.offsetX*s/c,t-=a.offsetY*n/l,s*=a.width/c,n*=a.height/l}let o=this.filmOffset;o!==0&&(r+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,t,t-n,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}},ql=class extends zs{constructor(){super(new an(50,1,.5,500)),this.isSpotLightShadow=!0,this.focus=1,this.aspect=1}updateMatrices(e){let t=this.camera,n=gr*2*e.angle*this.focus,s=this.mapSize.width/this.mapSize.height*this.aspect,r=e.distance||t.far;(n!==t.fov||s!==t.aspect||r!==t.far)&&(t.fov=n,t.aspect=s,t.far=r,t.updateProjectionMatrix()),super.updateMatrices(e)}copy(e){return super.copy(e),this.focus=e.focus,this.aspect=e.aspect,this}toJSON(){let e=super.toJSON();return e.focus=this.focus,e.aspect=this.aspect,e}},Ur=class extends ji{constructor(e,t,n=0,s=Math.PI/3,r=0,a=2){super(e,t),this.isSpotLight=!0,this.type="SpotLight",this.position.copy(Vt.DEFAULT_UP),this.updateMatrix(),this.target=new Vt,this.distance=n,this.angle=s,this.penumbra=r,this.decay=a,this.map=null,this.shadow=new ql}get power(){return this.intensity*Math.PI}set power(e){this.intensity=e/Math.PI}dispose(){super.dispose(),this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.angle=e.angle,this.penumbra=e.penumbra,this.decay=e.decay,this.target=e.target.clone(),this.map=e.map,this.shadow=e.shadow.clone(),this}toJSON(e){let t=super.toJSON(e);return t.object.distance=this.distance,t.object.angle=this.angle,t.object.decay=this.decay,t.object.penumbra=this.penumbra,t.object.target=this.target.uuid,this.map&&this.map.isTexture&&(t.object.map=this.map.toJSON(e).uuid),t.object.shadow=this.shadow.toJSON(),t}},Yl=class extends zs{constructor(){super(new an(90,1,.5,500)),this.isPointLightShadow=!0}},_i=class extends ji{constructor(e,t,n=0,s=2){super(e,t),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=s,this.shadow=new Yl}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){super.dispose(),this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}toJSON(e){let t=super.toJSON(e);return t.object.distance=this.distance,t.object.decay=this.decay,t.object.shadow=this.shadow.toJSON(),t}},Gs=class extends Nr{constructor(e=-1,t=1,n=1,s=-1,r=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=s,this.near=r,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,s,r,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2,r=n-e,a=n+e,o=s+t,c=s-t;if(this.view!==null&&this.view.enabled){let l=(this.right-this.left)/this.view.fullWidth/this.zoom,u=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=l*this.view.offsetX,a=r+l*this.view.width,o-=u*this.view.offsetY,c=o-u*this.view.height}this.projectionMatrix.makeOrthographic(r,a,o,c,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}},Zl=class extends zs{constructor(){super(new Gs(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}},ts=class extends ji{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Vt.DEFAULT_UP),this.updateMatrix(),this.target=new Vt,this.shadow=new Zl}dispose(){super.dispose(),this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}toJSON(e){let t=super.toJSON(e);return t.object.shadow=this.shadow.toJSON(),t.object.target=this.target.uuid,t}};var As=-90,Es=1,ho=class extends Vt{constructor(e,t,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;let s=new an(As,Es,e,t);s.layers=this.layers,this.add(s);let r=new an(As,Es,e,t);r.layers=this.layers,this.add(r);let a=new an(As,Es,e,t);a.layers=this.layers,this.add(a);let o=new an(As,Es,e,t);o.layers=this.layers,this.add(o);let c=new an(As,Es,e,t);c.layers=this.layers,this.add(c);let l=new an(As,Es,e,t);l.layers=this.layers,this.add(l)}updateCoordinateSystem(){let e=this.coordinateSystem,t=this.children.concat(),[n,s,r,a,o,c]=t;for(let l of t)this.remove(l);if(e===kn)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(e===Ps)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(let l of t)this.add(l),l.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();let{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());let[r,a,o,c,l,u]=this.children,p=e.getRenderTarget(),h=e.getActiveCubeFace(),f=e.getActiveMipmapLevel(),g=e.xr.enabled;e.xr.enabled=!1;let v=n.texture.generateMipmaps;n.texture.generateMipmaps=!1;let m=!1;e.isWebGLRenderer===!0?m=e.state.buffers.depth.getReversed():m=e.reversedDepthBuffer,e.setRenderTarget(n,0,s),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,r),e.setRenderTarget(n,1,s),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,a),e.setRenderTarget(n,2,s),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,o),e.setRenderTarget(n,3,s),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,c),e.setRenderTarget(n,4,s),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,l),n.texture.generateMipmaps=v,e.setRenderTarget(n,5,s),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,u),e.setRenderTarget(p,h,f),e.xr.enabled=g,n.texture.needsPMREMUpdate=!0}},uo=class extends an{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}};var Mc="\\[\\]\\.:\\/",Xd=new RegExp("["+Mc+"]","g"),Sc="[^"+Mc+"]",qd="[^"+Mc.replace("\\.","")+"]",Yd=/((?:WC+[\/:])*)/.source.replace("WC",Sc),Zd=/(WCOD+)?/.source.replace("WCOD",qd),Jd=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",Sc),$d=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",Sc),Kd=new RegExp("^"+Yd+Zd+Jd+$d+"$"),Qd=["material","materials","bones","map"],Jl=class{constructor(e,t,n){let s=n||Ot.parseTrackName(t);this._targetGroup=e,this._bindings=e.subscribe_(t,s)}getValue(e,t){this.bind();let n=this._targetGroup.nCachedObjects_,s=this._bindings[n];s!==void 0&&s.getValue(e,t)}setValue(e,t){let n=this._bindings;for(let s=this._targetGroup.nCachedObjects_,r=n.length;s!==r;++s)n[s].setValue(e,t)}bind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].bind()}unbind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].unbind()}},Ot=class i{constructor(e,t,n){this.path=t,this.parsedPath=n||i.parseTrackName(t),this.node=i.findNode(e,this.parsedPath.nodeName),this.rootNode=e,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(e,t,n){return e&&e.isAnimationObjectGroup?new i.Composite(e,t,n):new i(e,t,n)}static sanitizeNodeName(e){return e.replace(/\s/g,"_").replace(Xd,"")}static parseTrackName(e){let t=Kd.exec(e);if(t===null)throw new Error("THREE.PropertyBinding: Cannot parse trackName: "+e);let n={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},s=n.nodeName&&n.nodeName.lastIndexOf(".");if(s!==void 0&&s!==-1){let r=n.nodeName.substring(s+1);Qd.indexOf(r)!==-1&&(n.nodeName=n.nodeName.substring(0,s),n.objectName=r)}if(n.propertyName===null||n.propertyName.length===0)throw new Error("THREE.PropertyBinding: can not parse propertyName from trackName: "+e);return n}static findNode(e,t){if(t===void 0||t===""||t==="."||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){let n=e.skeleton.getBoneByName(t);if(n!==void 0)return n}if(e.children){let n=function(r){for(let a=0;a<r.length;a++){let o=r[a];if(o.name===t||o.uuid===t)return o;let c=n(o.children);if(c)return c}return null},s=n(e.children);if(s)return s}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)e[t++]=n[s]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=e[t++]}_setValue_array_setNeedsUpdate(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let e=this.node,t=this.parsedPath,n=t.objectName,s=t.propertyName,r=t.propertyIndex;if(e||(e=i.findNode(this.rootNode,t.nodeName),this.node=e),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!e){qe("PropertyBinding: No target node found for track: "+this.path+".");return}if(n){let l=t.objectIndex;switch(n){case"materials":if(!e.material){Ze("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.materials){Ze("PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}e=e.material.materials;break;case"bones":if(!e.skeleton){Ze("PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}e=e.skeleton.bones;for(let u=0;u<e.length;u++)if(e[u].name===l){l=u;break}break;case"map":if("map"in e){e=e.map;break}if(!e.material){Ze("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.map){Ze("PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}e=e.material.map;break;default:if(e[n]===void 0){Ze("PropertyBinding: Can not bind to objectName of node undefined.",this);return}e=e[n]}if(l!==void 0){if(e[l]===void 0){Ze("PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,e);return}e=e[l]}}let a=e[s];if(a===void 0){let l=t.nodeName;Ze("PropertyBinding: Trying to update property for track: "+l+"."+s+" but it wasn't found.",e);return}let o=this.Versioning.None;this.targetObject=e,e.isMaterial===!0?o=this.Versioning.NeedsUpdate:e.isObject3D===!0&&(o=this.Versioning.MatrixWorldNeedsUpdate);let c=this.BindingType.Direct;if(r!==void 0){if(s==="morphTargetInfluences"){if(!e.geometry){Ze("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!e.geometry.morphAttributes){Ze("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}e.morphTargetDictionary[r]!==void 0&&(r=e.morphTargetDictionary[r])}c=this.BindingType.ArrayElement,this.resolvedProperty=a,this.propertyIndex=r}else a.fromArray!==void 0&&a.toArray!==void 0?(c=this.BindingType.HasFromToArray,this.resolvedProperty=a):Array.isArray(a)?(c=this.BindingType.EntireArray,this.resolvedProperty=a):this.propertyName=s;this.getValue=this.GetterByBindingType[c],this.setValue=this.SetterByBindingTypeAndVersioning[c][o]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};Ot.Composite=Jl;Ot.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};Ot.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};Ot.prototype.GetterByBindingType=[Ot.prototype._getValue_direct,Ot.prototype._getValue_array,Ot.prototype._getValue_arrayElement,Ot.prototype._getValue_toArray];Ot.prototype.SetterByBindingTypeAndVersioning=[[Ot.prototype._setValue_direct,Ot.prototype._setValue_direct_setNeedsUpdate,Ot.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[Ot.prototype._setValue_array,Ot.prototype._setValue_array_setNeedsUpdate,Ot.prototype._setValue_array_setMatrixWorldNeedsUpdate],[Ot.prototype._setValue_arrayElement,Ot.prototype._setValue_arrayElement_setNeedsUpdate,Ot.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[Ot.prototype._setValue_fromArray,Ot.prototype._setValue_fromArray_setNeedsUpdate,Ot.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var y_=new Float32Array(1);var Lh=new gt,Fr=class{constructor(e,t,n=0,s=1/0){this.ray=new $i(e,t),this.near=n,this.far=s,this.camera=null,this.layers=new Ds,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(e,t){this.ray.set(e,t)}setFromCamera(e,t){t.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(e.x,e.y,.5).unproject(t).sub(this.ray.origin).normalize(),this.camera=t):t.isOrthographicCamera?(this.ray.origin.set(e.x,e.y,t.projectionMatrix.elements[14]).unproject(t),this.ray.direction.set(0,0,-1).transformDirection(t.matrixWorld),this.camera=t):Ze("Raycaster: Unsupported camera type: "+t.type)}setFromXRController(e){return Lh.identity().extractRotation(e.matrixWorld),this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(Lh),this}intersectObject(e,t=!0,n=[]){return $l(e,this,n,t),n.sort(Dh),n}intersectObjects(e,t=!0,n=[]){for(let s=0,r=e.length;s<r;s++)$l(e[s],this,n,t);return n.sort(Dh),n}};function Dh(i,e){return i.distance-e.distance}function $l(i,e,t,n){let s=!0;if(i.layers.test(e.layers)&&i.raycast(e,t)===!1&&(s=!1),s===!0&&n===!0){let r=i.children;for(let a=0,o=r.length;a<o;a++)$l(r[a],e,t,!0)}}var Cc=class Cc{constructor(e,t,n,s){this.elements=[1,0,0,1],e!==void 0&&this.set(e,t,n,s)}identity(){return this.set(1,0,0,1),this}fromArray(e,t=0){for(let n=0;n<4;n++)this.elements[n]=e[n+t];return this}set(e,t,n,s){let r=this.elements;return r[0]=e,r[2]=t,r[1]=n,r[3]=s,this}};Cc.prototype.isMatrix2=!0;var Kl=Cc;function bc(i,e,t,n){let s=jd(n);switch(t){case mc:return i*e;case Mo:return i*e/s.components*s.byteLength;case So:return i*e/s.components*s.byteLength;case Hi:return i*e*2/s.components*s.byteLength;case bo:return i*e*2/s.components*s.byteLength;case gc:return i*e*3/s.components*s.byteLength;case Dn:return i*e*4/s.components*s.byteLength;case To:return i*e*4/s.components*s.byteLength;case Gr:case Vr:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case kr:case Hr:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case Ao:case Co:return Math.max(i,16)*Math.max(e,8)/4;case wo:case Eo:return Math.max(i,8)*Math.max(e,8)/2;case Ro:case Po:case Lo:case Do:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case Io:case Wr:case No:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case Uo:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case Fo:return Math.floor((i+4)/5)*Math.floor((e+3)/4)*16;case Bo:return Math.floor((i+4)/5)*Math.floor((e+4)/5)*16;case Oo:return Math.floor((i+5)/6)*Math.floor((e+4)/5)*16;case zo:return Math.floor((i+5)/6)*Math.floor((e+5)/6)*16;case Go:return Math.floor((i+7)/8)*Math.floor((e+4)/5)*16;case Vo:return Math.floor((i+7)/8)*Math.floor((e+5)/6)*16;case ko:return Math.floor((i+7)/8)*Math.floor((e+7)/8)*16;case Ho:return Math.floor((i+9)/10)*Math.floor((e+4)/5)*16;case Wo:return Math.floor((i+9)/10)*Math.floor((e+5)/6)*16;case Xo:return Math.floor((i+9)/10)*Math.floor((e+7)/8)*16;case qo:return Math.floor((i+9)/10)*Math.floor((e+9)/10)*16;case Yo:return Math.floor((i+11)/12)*Math.floor((e+9)/10)*16;case Zo:return Math.floor((i+11)/12)*Math.floor((e+11)/12)*16;case Jo:case $o:case Ko:return Math.ceil(i/4)*Math.ceil(e/4)*16;case Qo:case jo:return Math.ceil(i/4)*Math.ceil(e/4)*8;case Xr:case el:return Math.ceil(i/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function jd(i){switch(i){case bn:case uc:return{byteLength:1,components:1};case ks:case dc:case Yn:return{byteLength:2,components:1};case yo:case vo:return{byteLength:2,components:4};case qn:case xo:case Ln:return{byteLength:4,components:1};case fc:case pc:return{byteLength:4,components:3}}throw new Error(`THREE.TextureUtils: Unknown texture type ${i}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:po}}));typeof window<"u"&&(window.__THREE__?qe("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=po);function Hu(){let i=null,e=!1,t=null,n=null;function s(r,a){n=i.requestAnimationFrame(s),t(r,a)}return{start:function(){e!==!0&&t!==null&&i!==null&&(n=i.requestAnimationFrame(s),e=!0)},stop:function(){i!==null&&i.cancelAnimationFrame(n),e=!1},setAnimationLoop:function(r){t=r},setContext:function(r){i=r}}}function ef(i){let e=new WeakMap;function t(o,c){let l=o.array,u=o.usage,p=l.byteLength,h=i.createBuffer();i.bindBuffer(c,h),i.bufferData(c,l,u),o.onUploadCallback();let f;if(l instanceof Float32Array)f=i.FLOAT;else if(typeof Float16Array<"u"&&l instanceof Float16Array)f=i.HALF_FLOAT;else if(l instanceof Uint16Array)o.isFloat16BufferAttribute?f=i.HALF_FLOAT:f=i.UNSIGNED_SHORT;else if(l instanceof Int16Array)f=i.SHORT;else if(l instanceof Uint32Array)f=i.UNSIGNED_INT;else if(l instanceof Int32Array)f=i.INT;else if(l instanceof Int8Array)f=i.BYTE;else if(l instanceof Uint8Array)f=i.UNSIGNED_BYTE;else if(l instanceof Uint8ClampedArray)f=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+l);return{buffer:h,type:f,bytesPerElement:l.BYTES_PER_ELEMENT,version:o.version,size:p}}function n(o,c,l){let u=c.array,p=c.updateRanges;if(i.bindBuffer(l,o),p.length===0)i.bufferSubData(l,0,u);else{p.sort((f,g)=>f.start-g.start);let h=0;for(let f=1;f<p.length;f++){let g=p[h],v=p[f];v.start<=g.start+g.count+1?g.count=Math.max(g.count,v.start+v.count-g.start):(++h,p[h]=v)}p.length=h+1;for(let f=0,g=p.length;f<g;f++){let v=p[f];i.bufferSubData(l,v.start*u.BYTES_PER_ELEMENT,u,v.start,v.count)}c.clearUpdateRanges()}c.onUploadCallback()}function s(o){return o.isInterleavedBufferAttribute&&(o=o.data),e.get(o)}function r(o){o.isInterleavedBufferAttribute&&(o=o.data);let c=e.get(o);c&&(i.deleteBuffer(c.buffer),e.delete(o))}function a(o,c){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){let u=e.get(o);(!u||u.version<o.version)&&e.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}let l=e.get(o);if(l===void 0)e.set(o,t(o,c));else if(l.version<o.version){if(l.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(l.buffer,o,c),l.version=o.version}}return{get:s,remove:r,update:a}}var tf=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,nf=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,sf=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,rf=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,af=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,of=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,lf=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,cf=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,hf=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec4 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 );
	}
#endif`,uf=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,df=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,ff=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,pf=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,mf=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,gf=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,_f=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,xf=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,yf=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,vf=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Mf=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,Sf=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,bf=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,Tf=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec4( 1.0 );
#endif
#ifdef USE_COLOR_ALPHA
	vColor *= color;
#elif defined( USE_COLOR )
	vColor.rgb *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.rgb *= instanceColor.rgb;
#endif
#ifdef USE_BATCHING_COLOR
	vColor *= getBatchingColor( getIndirectIndex( gl_DrawID ) );
#endif`,wf=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
#define inverseTransformDirection transformDirectionByInverseViewMatrix
vec3 transformNormalByInverseViewMatrix( in vec3 normal, in mat4 viewMatrix ) {
	return normalize( ( vec4( normal, 0.0 ) * viewMatrix ).xyz );
}
vec3 transformDirectionByInverseViewMatrix( in vec3 dir, in mat4 viewMatrix ) {
	return normalize( ( vec4( dir, 0.0 ) * viewMatrix ).xyz );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,Af=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,Ef=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
#endif`,Cf=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Rf=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Pf=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,If=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Lf="gl_FragColor = linearToOutputTexel( gl_FragColor );",Df=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Nf=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * reflectVec );
		#ifdef ENVMAP_BLENDING_MULTIPLY
			outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_MIX )
			outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_ADD )
			outgoingLight += envColor.xyz * specularStrength * reflectivity;
		#endif
	#endif
#endif`,Uf=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,Ff=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,Bf=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Of=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,zf=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Gf=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Vf=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,kf=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Hf=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,Wf=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Xf=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,qf=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Yf=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_SUN_LIGHTS > 0
	struct SunLight {
		vec3 direction;
		vec3 color;
	};
	uniform SunLight sunLights[ NUM_SUN_LIGHTS ];
	void getSunLightInfo( const in SunLight sunLight, out IncidentLight light ) {
		light.color = sunLight.color;
		light.direction = sunLight.direction;
		light.visible = true;
	}
#endif
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif
#include <lightprobes_pars_fragment>`,Zf=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, pow4( roughness ) ) );
			reflectVec = transformDirectionByInverseViewMatrix( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_RETROREFLECTION
		vec3 getIBLRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 retroVec = normalize( mix( viewDir, normal, pow4( roughness ) ) );
				retroVec = transformDirectionByInverseViewMatrix( retroVec, viewMatrix );
				vec4 envMapColor = textureCubeUV( envMap, envMapRotation * retroVec, roughness );
				return envMapColor.rgb * envMapIntensity;
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
		#ifdef USE_RETROREFLECTION
			vec3 getIBLAnisotropyRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
				#ifdef ENVMAP_TYPE_CUBE_UV
					vec3 bentNormal = cross( bitangent, viewDir );
					bentNormal = normalize( cross( bentNormal, bitangent ) );
					bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
					return getIBLRetroRadiance( viewDir, bentNormal, roughness );
				#else
					return vec3( 0.0 );
				#endif
			}
		#endif
	#endif
#endif`,Jf=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,$f=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Kf=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Qf=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,jf=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.diffuseContribution = diffuseColor.rgb * ( 1.0 - metalnessFactor );
material.metalness = metalnessFactor;
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor;
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = vec3( 0.04 );
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_RETROREFLECTION
	material.retroreflectivity = retroreflectivity;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.0001, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,ep=`uniform sampler2D dfgLUT;
struct PhysicalMaterial {
	vec3 diffuseColor;
	vec3 diffuseContribution;
	vec3 specularColor;
	vec3 specularColorBlended;
	float roughness;
	float metalness;
	float specularF90;
	float dispersion;
	vec2 dfg;
	vec3 multiScatteringCompensation;
	#ifdef USE_RETROREFLECTION
		float retroreflectivity;
	#endif
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0Dielectric;
		vec3 iridescenceF0Metallic;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		return 0.5 / max( gv + gl, EPSILON );
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColorBlended;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transpose( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float rInv = 1.0 / ( roughness + 0.1 );
	float a = -1.9362 + 1.0678 * roughness + 0.4573 * r2 - 0.8469 * rInv;
	float b = -0.6014 + 0.5538 * roughness - 0.4670 * r2 - 0.1255 * rInv;
	float DG = exp( a * dotNV + b );
	return saturate( DG );
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec2 fab, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec2 fab, const in vec3 specularColor, const in float specularF90, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColorBlended * t2.x + ( material.specularF90 - material.specularColorBlended ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseContribution * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
		#ifdef USE_CLEARCOAT
			vec3 Ncc = geometryClearcoatNormal;
			vec2 uvClearcoat = LTC_Uv( Ncc, viewDir, material.clearcoatRoughness );
			vec4 t1Clearcoat = texture2D( ltc_1, uvClearcoat );
			vec4 t2Clearcoat = texture2D( ltc_2, uvClearcoat );
			mat3 mInvClearcoat = mat3(
				vec3( t1Clearcoat.x, 0, t1Clearcoat.y ),
				vec3(             0, 1,             0 ),
				vec3( t1Clearcoat.z, 0, t1Clearcoat.w )
			);
			vec3 fresnelClearcoat = material.clearcoatF0 * t2Clearcoat.x + ( material.clearcoatF90 - material.clearcoatF0 ) * t2Clearcoat.y;
			clearcoatSpecularDirect += lightColor * fresnelClearcoat * LTC_Evaluate( Ncc, viewDir, position, mInvClearcoat, rectCoords );
		#endif
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
 
 		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
 
 		float sheenAlbedoV = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
 		float sheenAlbedoL = IBLSheenBRDF( geometryNormal, directLight.direction, material.sheenRoughness );
 
 		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * max( sheenAlbedoV, sheenAlbedoL );
 
 		irradiance *= sheenEnergyComp;
 
 	#endif
	vec3 specularBRDF = BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	#ifdef USE_RETROREFLECTION
		vec3 retroViewDir = reflect( - geometryViewDir, geometryNormal );
		vec3 retroSpecularBRDF = BRDF_GGX( directLight.direction, retroViewDir, geometryNormal, material );
		specularBRDF = mix( specularBRDF, retroSpecularBRDF, saturate( material.retroreflectivity ) );
	#endif
	reflectedLight.directSpecular += irradiance * specularBRDF * material.multiScatteringCompensation;
	vec3 halfDir = normalize( directLight.direction + geometryViewDir );
	float dotVH = saturate( dot( geometryViewDir, halfDir ) );
	vec3 F = F_Schlick( material.specularColor, material.specularF90, dotVH );
	#ifdef USE_RETROREFLECTION
		vec3 retroHalfDir = normalize( directLight.direction + retroViewDir );
		float dotRetroVH = saturate( dot( retroViewDir, retroHalfDir ) );
		vec3 retroF = F_Schlick( material.specularColor, material.specularF90, dotRetroVH );
		F = mix( F, retroF, saturate( material.retroreflectivity ) );
	#endif
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseContribution ) * ( 1.0 - F );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScattering, multiScattering );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScattering, multiScattering );
	#endif
	vec3 diffuse = irradiance * BRDF_Lambert( material.diffuseContribution ) * ( 1.0 - singleScattering - multiScattering );
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		sheenSpecularIndirect += irradiance * material.sheenColor * sheenAlbedo * RECIPROCAL_PI;
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		diffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectDiffuse += diffuse;
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness ) * RECIPROCAL_PI;
 	#endif
	vec3 singleScatteringDielectric = vec3( 0.0 );
	vec3 multiScatteringDielectric = vec3( 0.0 );
	vec3 singleScatteringMetallic = vec3( 0.0 );
	vec3 multiScatteringMetallic = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscatteringIridescence( material.dfg, material.diffuseColor, material.specularF90, material.iridescence, material.iridescenceF0Metallic, singleScatteringMetallic, multiScatteringMetallic );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscattering( material.dfg, material.diffuseColor, material.specularF90, singleScatteringMetallic, multiScatteringMetallic );
	#endif
	vec3 singleScattering = mix( singleScatteringDielectric, singleScatteringMetallic, material.metalness );
	vec3 multiScattering = mix( multiScatteringDielectric, multiScatteringMetallic, material.metalness );
	vec3 totalScatteringDielectric = singleScatteringDielectric + multiScatteringDielectric;
	vec3 diffuse = material.diffuseContribution * ( 1.0 - totalScatteringDielectric );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	vec3 indirectSpecular = radiance * singleScattering;
	indirectSpecular += multiScattering * cosineWeightedIrradiance;
	vec3 indirectDiffuse = diffuse * cosineWeightedIrradiance;
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		indirectSpecular *= sheenEnergyComp;
		indirectDiffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectSpecular += indirectSpecular;
	reflectedLight.indirectDiffuse += indirectDiffuse;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,tp=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		vec3 iridescenceFresnelDielectric = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		vec3 iridescenceFresnelMetallic = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.diffuseColor );
		material.iridescenceFresnel = mix( iridescenceFresnelDielectric, iridescenceFresnelMetallic, material.metalness );
		material.iridescenceF0Dielectric = Schlick_to_F0( iridescenceFresnelDielectric, 1.0, dotNVi );
		material.iridescenceF0Metallic = Schlick_to_F0( iridescenceFresnelMetallic, 1.0, dotNVi );
	}
#endif
#ifdef STANDARD
	float dotNVms = saturate( dot( geometryNormal, geometryViewDir ) );
	material.dfg = texture2D( dfgLUT, vec2( material.roughness, dotNVms ) ).rg;
	#if ( NUM_SUN_LIGHTS > 0 || NUM_DIR_LIGHTS > 0 || NUM_POINT_LIGHTS > 0 || NUM_SPOT_LIGHTS > 0 )
		float EssMs = material.dfg.x + material.dfg.y;
		material.multiScatteringCompensation = 1.0 + material.specularColorBlended * ( 1.0 / EssMs - 1.0 );
	#endif
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS ) && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SUN_LIGHTS > 0 ) && defined( RE_Direct )
	SunLight sunLight;
	#if defined( USE_SHADOWMAP ) && NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHTS; i ++ ) {
		sunLight = sunLights[ i ];
		getSunLightInfo( sunLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SUN_LIGHT_SHADOWS )
		sunLightShadow = sunLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getSunShadow( sunShadowMap[ i ], sunLightShadow, UNROLLED_LOOP_INDEX ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
	#ifdef USE_LIGHT_PROBES_GRID
		vec3 probeWorldPos = ( ( vec4( geometryPosition, 1.0 ) - viewMatrix[ 3 ] ) * viewMatrix ).xyz;
		vec3 probeWorldNormal = transformNormalByInverseViewMatrix( geometryNormal, viewMatrix );
		irradiance += getLightProbeGridIrradiance( probeWorldPos, probeWorldNormal );
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,np=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( ENVMAP_TYPE_CUBE_UV )
		#if defined( STANDARD ) || defined( LAMBERT ) || defined( PHONG )
			iblIrradiance += getIBLIrradiance( geometryNormal );
		#endif
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		vec3 iblRadiance = getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		vec3 iblRadiance = getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_RETROREFLECTION
		#ifdef USE_ANISOTROPY
			vec3 retroIBLRadiance = getIBLAnisotropyRetroRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
		#else
			vec3 retroIBLRadiance = getIBLRetroRadiance( geometryViewDir, geometryNormal, material.roughness );
		#endif
		iblRadiance = mix( iblRadiance, retroIBLRadiance, saturate( material.retroreflectivity ) );
	#endif
	radiance += iblRadiance;
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,ip=`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,sp=`#ifdef USE_LIGHT_PROBES_GRID
uniform highp sampler3D probesSH;
uniform vec3 probesMin;
uniform vec3 probesMax;
uniform vec3 probesResolution;
vec3 getLightProbeGridIrradiance( vec3 worldPos, vec3 worldNormal ) {
	vec3 res = probesResolution;
	vec3 gridRange = probesMax - probesMin;
	vec3 resMinusOne = res - 1.0;
	vec3 probeSpacing = gridRange / resMinusOne;
	vec3 samplePos = worldPos + worldNormal * probeSpacing * 0.5;
	vec3 uvw = clamp( ( samplePos - probesMin ) / gridRange, 0.0, 1.0 );
	uvw = uvw * resMinusOne / res + 0.5 / res;
	float nz          = res.z;
	float paddedSlices = nz + 2.0;
	float atlasDepth  = 7.0 * paddedSlices;
	float uvZBase     = uvw.z * nz + 1.0;
	vec4 s0 = texture( probesSH, vec3( uvw.xy, ( uvZBase                       ) / atlasDepth ) );
	vec4 s1 = texture( probesSH, vec3( uvw.xy, ( uvZBase +       paddedSlices   ) / atlasDepth ) );
	vec4 s2 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 2.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s3 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 3.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s4 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 4.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s5 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 5.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s6 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 6.0 * paddedSlices   ) / atlasDepth ) );
	vec3 c0 = s0.xyz;
	vec3 c1 = vec3( s0.w, s1.xy );
	vec3 c2 = vec3( s1.zw, s2.x );
	vec3 c3 = s2.yzw;
	vec3 c4 = s3.xyz;
	vec3 c5 = vec3( s3.w, s4.xy );
	vec3 c6 = vec3( s4.zw, s5.x );
	vec3 c7 = s5.yzw;
	vec3 c8 = s6.xyz;
	float x = worldNormal.x, y = worldNormal.y, z = worldNormal.z;
	vec3 result = c0 * 0.886227;
	result += c1 * 2.0 * 0.511664 * y;
	result += c2 * 2.0 * 0.511664 * z;
	result += c3 * 2.0 * 0.511664 * x;
	result += c4 * 2.0 * 0.429043 * x * y;
	result += c5 * 2.0 * 0.429043 * y * z;
	result += c6 * ( 0.743125 * z * z - 0.247708 );
	result += c7 * 2.0 * 0.429043 * x * z;
	result += c8 * 0.429043 * ( x * x - y * y );
	return max( result, vec3( 0.0 ) );
}
#endif`,rp=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,ap=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,op=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,lp=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,cp=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,hp=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,up=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,dp=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,fp=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,pp=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,mp=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,gp=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,_p=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,xp=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,yp=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,vp=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#ifdef DOUBLE_SIDED
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#ifdef DOUBLE_SIDED
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,Mp=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#if defined( USE_PACKED_NORMALMAP )
		mapN = vec3( mapN.xy, sqrt( saturate( 1.0 - dot( mapN.xy, mapN.xy ) ) ) );
	#endif
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,Sp=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,bp=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Tp=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,wp=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,Ap=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Ep=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Cp=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Rp=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Pp=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Ip=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	#ifdef USE_REVERSED_DEPTH_BUFFER
	
		return depth * ( far - near ) - far;
	#else
		return depth * ( near - far ) - near;
	#endif
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	
	#ifdef USE_REVERSED_DEPTH_BUFFER
		return ( near * far ) / ( ( near - far ) * depth - near );
	#else
		return ( near * far ) / ( ( far - near ) * depth - far );
	#endif
}`,Lp=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Dp=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Np=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Up=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Fp=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Bp=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Op=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		#define SUN_LIGHT_CASCADES 2
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#else
			uniform sampler2D sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#endif
		uniform mat4 sunShadowMatrix[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		uniform vec4 sunShadowCascade[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
		struct SunLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SunLightShadow sunLightShadows[ NUM_SUN_LIGHT_SHADOWS ];
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#else
			uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#endif
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#else
			uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#endif
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform samplerCubeShadow pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#elif defined( SHADOWMAP_TYPE_BASIC )
			uniform samplerCube pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#endif
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float interleavedGradientNoise( vec2 position ) {
			return fract( 52.9829189 * fract( dot( position, vec2( 0.06711056, 0.00583715 ) ) ) );
		}
		vec2 vogelDiskSample( int sampleIndex, int samplesCount, float phi ) {
			const float goldenAngle = 2.399963229728653;
			float r = sqrt( ( float( sampleIndex ) + 0.5 ) / float( samplesCount ) );
			float theta = float( sampleIndex ) * goldenAngle + phi;
			return vec2( cos( theta ), sin( theta ) ) * r;
		}
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float getShadow( sampler2DShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			shadowCoord.z += shadowBias;
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
				float radius = shadowRadius * texelSize.x;
				float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
				shadow = (
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 0, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 1, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 2, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 3, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 4, 5, phi ) * radius, shadowCoord.z ) )
				) * 0.2;
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#elif defined( SHADOWMAP_TYPE_VSM )
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 distribution = texture2D( shadowMap, shadowCoord.xy ).rg;
				float mean = distribution.x;
				float variance = distribution.y * distribution.y;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					float hard_shadow = step( mean, shadowCoord.z );
				#else
					float hard_shadow = step( shadowCoord.z, mean );
				#endif
				
				if ( hard_shadow == 1.0 ) {
					shadow = 1.0;
				} else {
					variance = max( variance, 0.0000001 );
					float d = shadowCoord.z - mean;
					float p_max = variance / ( variance + d * d );
					p_max = clamp( ( p_max - 0.3 ) / 0.65, 0.0, 1.0 );
					shadow = max( hard_shadow, p_max );
				}
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#else
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				float depth = texture2D( shadowMap, shadowCoord.xy ).r;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					shadow = step( depth, shadowCoord.z );
				#else
					shadow = step( shadowCoord.z, depth );
				#endif
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#endif
	#if NUM_SUN_LIGHT_SHADOWS > 0
		float getSunShadow(
			#if defined( SHADOWMAP_TYPE_PCF )
				sampler2DShadow shadowMap,
			#else
				sampler2D shadowMap,
			#endif
			SunLightShadow sunLightShadow,
			int shadowIndex
		) {
			vec4 shadowWorldPosition = vec4( vSunShadowWorldPosition.xyz + vSunShadowWorldNormal * sunLightShadow.shadowNormalBias, 1.0 );
			float viewDepth = vSunShadowWorldPosition.w;
			int cascadeOffset = shadowIndex * SUN_LIGHT_CASCADES;
			float shadow = 1.0;
			for ( int i = SUN_LIGHT_CASCADES - 1; i >= 0; i -- ) {
				vec4 cascade = sunShadowCascade[ cascadeOffset + i ];
				if ( viewDepth >= cascade.x && viewDepth < cascade.y ) {
					float cascadeShadow = getShadow(
						shadowMap,
						sunLightShadow.shadowMapSize,
						sunLightShadow.shadowIntensity,
						sunLightShadow.shadowBias,
						sunLightShadow.shadowRadius,
						sunShadowMatrix[ cascadeOffset + i ] * shadowWorldPosition
					);
					shadow = mix( cascadeShadow, shadow, smoothstep( cascade.z, cascade.y, viewDepth ) );
				}
			}
			return shadow;
		}
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	#if defined( SHADOWMAP_TYPE_PCF )
	float getPointShadow( samplerCubeShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 bd3D = normalize( lightToPosition );
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			#ifdef USE_REVERSED_DEPTH_BUFFER
				float dp = ( shadowCameraNear * ( shadowCameraFar - viewSpaceZ ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp -= shadowBias;
			#else
				float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp += shadowBias;
			#endif
			float texelSize = shadowRadius / shadowMapSize.x;
			vec3 absDir = abs( bd3D );
			vec3 tangent = absDir.x > absDir.z ? vec3( 0.0, 1.0, 0.0 ) : vec3( 1.0, 0.0, 0.0 );
			tangent = normalize( cross( bd3D, tangent ) );
			vec3 bitangent = cross( bd3D, tangent );
			float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
			vec2 sample0 = vogelDiskSample( 0, 5, phi );
			vec2 sample1 = vogelDiskSample( 1, 5, phi );
			vec2 sample2 = vogelDiskSample( 2, 5, phi );
			vec2 sample3 = vogelDiskSample( 3, 5, phi );
			vec2 sample4 = vogelDiskSample( 4, 5, phi );
			shadow = (
				texture( shadowMap, vec4( bd3D + ( tangent * sample0.x + bitangent * sample0.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample1.x + bitangent * sample1.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample2.x + bitangent * sample2.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample3.x + bitangent * sample3.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample4.x + bitangent * sample4.y ) * texelSize, dp ) )
			) * 0.2;
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#elif defined( SHADOWMAP_TYPE_BASIC )
	float getPointShadow( samplerCube shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			float depth = textureCube( shadowMap, bd3D ).r;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				depth = 1.0 - depth;
			#endif
			shadow = step( dp, depth );
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#endif
	#endif
#endif`,zp=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,Gp=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_SUN_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	#ifdef HAS_NORMAL
		vec3 shadowWorldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
	#else
		vec3 shadowWorldNormal = vec3( 0.0 );
	#endif
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_SUN_LIGHT_SHADOWS > 0
		vSunShadowWorldPosition = vec4( worldPosition.xyz, - mvPosition.z );
		vSunShadowWorldNormal = shadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,Vp=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHT_SHADOWS; i ++ ) {
		sunLight = sunLightShadows[ i ];
		shadow *= receiveShadow ? getSunShadow( sunShadowMap[ i ], sunLight, UNROLLED_LOOP_INDEX ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0 && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,kp=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Hp=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,Wp=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Xp=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,qp=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Yp=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,Zp=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,Jp=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,$p=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseContribution, material.specularColorBlended, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,Kp=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,Qp=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,jp=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,em=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,tm=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,nm=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,im=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,sm=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,rm=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vWorldDirection );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,am=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,om=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,lm=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,cm=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,hm=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,um=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = vec4( dist, 0.0, 0.0, 1.0 );
}`,dm=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,fm=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,pm=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,mm=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,gm=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,_m=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,xm=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,ym=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,vm=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,Mm=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Sm=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,bm=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( normalize( normal ) * 0.5 + 0.5, diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,Tm=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,wm=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Am=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,Em=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_RETROREFLECTION
	uniform float retroreflectivity;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
 
		outgoingLight = outgoingLight + sheenSpecularDirect + sheenSpecularIndirect;
 
 	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Cm=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Rm=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Pm=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,Im=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Lm=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Dm=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Nm=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,Um=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,ot={alphahash_fragment:tf,alphahash_pars_fragment:nf,alphamap_fragment:sf,alphamap_pars_fragment:rf,alphatest_fragment:af,alphatest_pars_fragment:of,aomap_fragment:lf,aomap_pars_fragment:cf,batching_pars_vertex:hf,batching_vertex:uf,begin_vertex:df,beginnormal_vertex:ff,bsdfs:pf,iridescence_fragment:mf,bumpmap_pars_fragment:gf,clipping_planes_fragment:_f,clipping_planes_pars_fragment:xf,clipping_planes_pars_vertex:yf,clipping_planes_vertex:vf,color_fragment:Mf,color_pars_fragment:Sf,color_pars_vertex:bf,color_vertex:Tf,common:wf,cube_uv_reflection_fragment:Af,defaultnormal_vertex:Ef,displacementmap_pars_vertex:Cf,displacementmap_vertex:Rf,emissivemap_fragment:Pf,emissivemap_pars_fragment:If,colorspace_fragment:Lf,colorspace_pars_fragment:Df,envmap_fragment:Nf,envmap_common_pars_fragment:Uf,envmap_pars_fragment:Ff,envmap_pars_vertex:Bf,envmap_physical_pars_fragment:Zf,envmap_vertex:Of,fog_vertex:zf,fog_pars_vertex:Gf,fog_fragment:Vf,fog_pars_fragment:kf,gradientmap_pars_fragment:Hf,lightmap_pars_fragment:Wf,lights_lambert_fragment:Xf,lights_lambert_pars_fragment:qf,lights_pars_begin:Yf,lights_toon_fragment:Jf,lights_toon_pars_fragment:$f,lights_phong_fragment:Kf,lights_phong_pars_fragment:Qf,lights_physical_fragment:jf,lights_physical_pars_fragment:ep,lights_fragment_begin:tp,lights_fragment_maps:np,lights_fragment_end:ip,lightprobes_pars_fragment:sp,logdepthbuf_fragment:rp,logdepthbuf_pars_fragment:ap,logdepthbuf_pars_vertex:op,logdepthbuf_vertex:lp,map_fragment:cp,map_pars_fragment:hp,map_particle_fragment:up,map_particle_pars_fragment:dp,metalnessmap_fragment:fp,metalnessmap_pars_fragment:pp,morphinstance_vertex:mp,morphcolor_vertex:gp,morphnormal_vertex:_p,morphtarget_pars_vertex:xp,morphtarget_vertex:yp,normal_fragment_begin:vp,normal_fragment_maps:Mp,normal_pars_fragment:Sp,normal_pars_vertex:bp,normal_vertex:Tp,normalmap_pars_fragment:wp,clearcoat_normal_fragment_begin:Ap,clearcoat_normal_fragment_maps:Ep,clearcoat_pars_fragment:Cp,iridescence_pars_fragment:Rp,opaque_fragment:Pp,packing:Ip,premultiplied_alpha_fragment:Lp,project_vertex:Dp,dithering_fragment:Np,dithering_pars_fragment:Up,roughnessmap_fragment:Fp,roughnessmap_pars_fragment:Bp,shadowmap_pars_fragment:Op,shadowmap_pars_vertex:zp,shadowmap_vertex:Gp,shadowmask_pars_fragment:Vp,skinbase_vertex:kp,skinning_pars_vertex:Hp,skinning_vertex:Wp,skinnormal_vertex:Xp,specularmap_fragment:qp,specularmap_pars_fragment:Yp,tonemapping_fragment:Zp,tonemapping_pars_fragment:Jp,transmission_fragment:$p,transmission_pars_fragment:Kp,uv_pars_fragment:Qp,uv_pars_vertex:jp,uv_vertex:em,worldpos_vertex:tm,background_vert:nm,background_frag:im,backgroundCube_vert:sm,backgroundCube_frag:rm,cube_vert:am,cube_frag:om,depth_vert:lm,depth_frag:cm,distance_vert:hm,distance_frag:um,equirect_vert:dm,equirect_frag:fm,linedashed_vert:pm,linedashed_frag:mm,meshbasic_vert:gm,meshbasic_frag:_m,meshlambert_vert:xm,meshlambert_frag:ym,meshmatcap_vert:vm,meshmatcap_frag:Mm,meshnormal_vert:Sm,meshnormal_frag:bm,meshphong_vert:Tm,meshphong_frag:wm,meshphysical_vert:Am,meshphysical_frag:Em,meshtoon_vert:Cm,meshtoon_frag:Rm,points_vert:Pm,points_frag:Im,shadow_vert:Lm,shadow_frag:Dm,sprite_vert:Nm,sprite_frag:Um},we={common:{diffuse:{value:new We(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new je},alphaMap:{value:null},alphaMapTransform:{value:new je},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new je}},envmap:{envMap:{value:null},envMapRotation:{value:new je},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new je}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new je}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new je},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new je},normalScale:{value:new Pe(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new je},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new je}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new je}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new je}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new We(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},sunLights:{value:[],properties:{direction:{},color:{}}},sunLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},sunShadowMatrix:{value:[]},sunShadowCascade:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:null},probesMin:{value:new P},probesMax:{value:new P},probesResolution:{value:new P}},points:{diffuse:{value:new We(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new je},alphaTest:{value:0},uvTransform:{value:new je}},sprite:{diffuse:{value:new We(16777215)},opacity:{value:1},center:{value:new Pe(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new je},alphaMap:{value:null},alphaMapTransform:{value:new je},alphaTest:{value:0}}},ri={basic:{uniforms:mn([we.common,we.specularmap,we.envmap,we.aomap,we.lightmap,we.fog]),vertexShader:ot.meshbasic_vert,fragmentShader:ot.meshbasic_frag},lambert:{uniforms:mn([we.common,we.specularmap,we.envmap,we.aomap,we.lightmap,we.emissivemap,we.bumpmap,we.normalmap,we.displacementmap,we.fog,we.lights,{emissive:{value:new We(0)},envMapIntensity:{value:1}}]),vertexShader:ot.meshlambert_vert,fragmentShader:ot.meshlambert_frag},phong:{uniforms:mn([we.common,we.specularmap,we.envmap,we.aomap,we.lightmap,we.emissivemap,we.bumpmap,we.normalmap,we.displacementmap,we.fog,we.lights,{emissive:{value:new We(0)},specular:{value:new We(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:ot.meshphong_vert,fragmentShader:ot.meshphong_frag},standard:{uniforms:mn([we.common,we.envmap,we.aomap,we.lightmap,we.emissivemap,we.bumpmap,we.normalmap,we.displacementmap,we.roughnessmap,we.metalnessmap,we.fog,we.lights,{emissive:{value:new We(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:ot.meshphysical_vert,fragmentShader:ot.meshphysical_frag},toon:{uniforms:mn([we.common,we.aomap,we.lightmap,we.emissivemap,we.bumpmap,we.normalmap,we.displacementmap,we.gradientmap,we.fog,we.lights,{emissive:{value:new We(0)}}]),vertexShader:ot.meshtoon_vert,fragmentShader:ot.meshtoon_frag},matcap:{uniforms:mn([we.common,we.bumpmap,we.normalmap,we.displacementmap,we.fog,{matcap:{value:null}}]),vertexShader:ot.meshmatcap_vert,fragmentShader:ot.meshmatcap_frag},points:{uniforms:mn([we.points,we.fog]),vertexShader:ot.points_vert,fragmentShader:ot.points_frag},dashed:{uniforms:mn([we.common,we.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:ot.linedashed_vert,fragmentShader:ot.linedashed_frag},depth:{uniforms:mn([we.common,we.displacementmap]),vertexShader:ot.depth_vert,fragmentShader:ot.depth_frag},normal:{uniforms:mn([we.common,we.bumpmap,we.normalmap,we.displacementmap,{opacity:{value:1}}]),vertexShader:ot.meshnormal_vert,fragmentShader:ot.meshnormal_frag},sprite:{uniforms:mn([we.sprite,we.fog]),vertexShader:ot.sprite_vert,fragmentShader:ot.sprite_frag},background:{uniforms:{uvTransform:{value:new je},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:ot.background_vert,fragmentShader:ot.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new je}},vertexShader:ot.backgroundCube_vert,fragmentShader:ot.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:ot.cube_vert,fragmentShader:ot.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:ot.equirect_vert,fragmentShader:ot.equirect_frag},distance:{uniforms:mn([we.common,we.displacementmap,{referencePosition:{value:new P},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:ot.distance_vert,fragmentShader:ot.distance_frag},shadow:{uniforms:mn([we.lights,we.fog,{color:{value:new We(0)},opacity:{value:1}}]),vertexShader:ot.shadow_vert,fragmentShader:ot.shadow_frag}};ri.physical={uniforms:mn([ri.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new je},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new je},clearcoatNormalScale:{value:new Pe(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new je},dispersion:{value:0},retroreflectivity:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new je},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new je},sheen:{value:0},sheenColor:{value:new We(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new je},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new je},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new je},transmissionSamplerSize:{value:new Pe},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new je},attenuationDistance:{value:0},attenuationColor:{value:new We(0)},specularColor:{value:new We(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new je},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new je},anisotropyVector:{value:new Pe},anisotropyMap:{value:null},anisotropyMapTransform:{value:new je}}]),vertexShader:ot.meshphysical_vert,fragmentShader:ot.meshphysical_frag};var sl={r:0,b:0,g:0},Fm=new gt,Wu=new je;Wu.set(-1,0,0,0,1,0,0,0,1);function Bm(i,e,t,n,s,r){let a=new We(0),o=s===!0?0:1,c,l,u=null,p=0,h=null;function f(S){let E=S.isScene===!0?S.background:null;if(E&&E.isTexture){let y=S.backgroundBlurriness>0;E=e.get(E,y)}return E}function g(S){let E=!1,y=f(S);y===null?m(a,o):y&&y.isColor&&(m(y,1),E=!0);let b=i.xr.getEnvironmentBlendMode();b==="additive"?t.buffers.color.setClear(0,0,0,1,r):b==="alpha-blend"&&t.buffers.color.setClear(0,0,0,0,r),(i.autoClear||E)&&(t.buffers.depth.setTest(!0),t.buffers.depth.setMask(!0),t.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function v(S,E){let y=f(E);y&&(y.isCubeTexture||y.mapping===Or)?(l===void 0&&(l=new Xe(new pe(1,1,1),new vn({name:"BackgroundCubeMaterial",uniforms:rs(ri.backgroundCube.uniforms),vertexShader:ri.backgroundCube.vertexShader,fragmentShader:ri.backgroundCube.fragmentShader,side:cn,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),l.geometry.deleteAttribute("uv"),l.onBeforeRender=function(b,T,I){this.matrixWorld.copyPosition(I.matrixWorld)},Object.defineProperty(l.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),n.update(l)),l.material.uniforms.envMap.value=y,l.material.uniforms.backgroundBlurriness.value=E.backgroundBlurriness,l.material.uniforms.backgroundIntensity.value=E.backgroundIntensity,l.material.uniforms.backgroundRotation.value.setFromMatrix4(Fm.makeRotationFromEuler(E.backgroundRotation)).transpose(),y.isCubeTexture&&y.isRenderTargetTexture===!1&&l.material.uniforms.backgroundRotation.value.premultiply(Wu),l.material.toneMapped=dt.getTransfer(y.colorSpace)!==Tt,(u!==y||p!==y.version||h!==i.toneMapping)&&(l.material.needsUpdate=!0,u=y,p=y.version,h=i.toneMapping),l.layers.enableAll(),S.unshift(l,l.geometry,l.material,0,0,null)):y&&y.isTexture&&(c===void 0&&(c=new Xe(new _t(2,2),new vn({name:"BackgroundMaterial",uniforms:rs(ri.background.uniforms),vertexShader:ri.background.vertexShader,fragmentShader:ri.background.fragmentShader,side:Oi,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),n.update(c)),c.material.uniforms.t2D.value=y,c.material.uniforms.backgroundIntensity.value=E.backgroundIntensity,c.material.toneMapped=dt.getTransfer(y.colorSpace)!==Tt,y.matrixAutoUpdate===!0&&y.updateMatrix(),c.material.uniforms.uvTransform.value.copy(y.matrix),(u!==y||p!==y.version||h!==i.toneMapping)&&(c.material.needsUpdate=!0,u=y,p=y.version,h=i.toneMapping),c.layers.enableAll(),S.unshift(c,c.geometry,c.material,0,0,null))}function m(S,E){S.getRGB(sl,vc(i)),t.buffers.color.setClear(sl.r,sl.g,sl.b,E,r)}function d(){l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0),c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0)}return{getClearColor:function(){return a},setClearColor:function(S,E=1){a.set(S),o=E,m(a,o)},getClearAlpha:function(){return o},setClearAlpha:function(S){o=S,m(a,o)},render:g,addToRenderList:v,dispose:d}}function Om(i,e){let t=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},s=h(null),r=s,a=!1;function o(O,V,W,B,J){let ne=!1,ie=p(O,B,W,V);r!==ie&&(r=ie,l(r.object)),ne=f(O,B,W,J),ne&&g(O,B,W,J),J!==null&&e.update(J,i.ELEMENT_ARRAY_BUFFER),(ne||a)&&(a=!1,y(O,V,W,B),J!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,e.get(J).buffer))}function c(){return i.createVertexArray()}function l(O){return i.bindVertexArray(O)}function u(O){return i.deleteVertexArray(O)}function p(O,V,W,B){let J=B.wireframe===!0,ne=n[V.id];ne===void 0&&(ne={},n[V.id]=ne);let ie=O.isInstancedMesh===!0?O.id:0,de=ne[ie];de===void 0&&(de={},ne[ie]=de);let j=de[W.id];j===void 0&&(j={},de[W.id]=j);let oe=j[J];return oe===void 0&&(oe=h(c()),j[J]=oe),oe}function h(O){let V=[],W=[],B=[];for(let J=0;J<t;J++)V[J]=0,W[J]=0,B[J]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:V,enabledAttributes:W,attributeDivisors:B,object:O,attributes:{},index:null}}function f(O,V,W,B){let J=r.attributes,ne=V.attributes,ie=0,de=W.getAttributes();for(let j in de)if(de[j].location>=0){let ue=J[j],Ve=ne[j];if(Ve===void 0&&(j==="instanceMatrix"&&O.instanceMatrix&&(Ve=O.instanceMatrix),j==="instanceColor"&&O.instanceColor&&(Ve=O.instanceColor)),ue===void 0||ue.attribute!==Ve||Ve&&ue.data!==Ve.data)return!0;ie++}return r.attributesNum!==ie||r.index!==B}function g(O,V,W,B){let J={},ne=V.attributes,ie=0,de=W.getAttributes();for(let j in de)if(de[j].location>=0){let ue=ne[j];ue===void 0&&(j==="instanceMatrix"&&O.instanceMatrix&&(ue=O.instanceMatrix),j==="instanceColor"&&O.instanceColor&&(ue=O.instanceColor));let Ve={};Ve.attribute=ue,ue&&ue.data&&(Ve.data=ue.data),J[j]=Ve,ie++}r.attributes=J,r.attributesNum=ie,r.index=B}function v(){let O=r.newAttributes;for(let V=0,W=O.length;V<W;V++)O[V]=0}function m(O){d(O,0)}function d(O,V){let W=r.newAttributes,B=r.enabledAttributes,J=r.attributeDivisors;W[O]=1,B[O]===0&&(i.enableVertexAttribArray(O),B[O]=1),J[O]!==V&&(i.vertexAttribDivisor(O,V),J[O]=V)}function S(){let O=r.newAttributes,V=r.enabledAttributes;for(let W=0,B=V.length;W<B;W++)V[W]!==O[W]&&(i.disableVertexAttribArray(W),V[W]=0)}function E(O,V,W,B,J,ne,ie){ie===!0?i.vertexAttribIPointer(O,V,W,J,ne):i.vertexAttribPointer(O,V,W,B,J,ne)}function y(O,V,W,B){v();let J=B.attributes,ne=W.getAttributes(),ie=V.defaultAttributeValues;for(let de in ne){let j=ne[de];if(j.location>=0){let oe=J[de];if(oe===void 0&&(de==="instanceMatrix"&&O.instanceMatrix&&(oe=O.instanceMatrix),de==="instanceColor"&&O.instanceColor&&(oe=O.instanceColor)),oe!==void 0){let ue=oe.normalized,Ve=oe.itemSize,Ie=e.get(oe);if(Ie===void 0)continue;let pt=Ie.buffer,tt=Ie.type,rt=Ie.bytesPerElement,te=tt===i.INT||tt===i.UNSIGNED_INT||oe.gpuType===xo;if(oe.isInterleavedBufferAttribute){let le=oe.data,Ae=le.stride,Je=oe.offset;if(le.isInstancedInterleavedBuffer){for(let Re=0;Re<j.locationSize;Re++)d(j.location+Re,le.meshPerAttribute);O.isInstancedMesh!==!0&&B._maxInstanceCount===void 0&&(B._maxInstanceCount=le.meshPerAttribute*le.count)}else for(let Re=0;Re<j.locationSize;Re++)m(j.location+Re);i.bindBuffer(i.ARRAY_BUFFER,pt);for(let Re=0;Re<j.locationSize;Re++)E(j.location+Re,Ve/j.locationSize,tt,ue,Ae*rt,(Je+Ve/j.locationSize*Re)*rt,te)}else{if(oe.isInstancedBufferAttribute){for(let le=0;le<j.locationSize;le++)d(j.location+le,oe.meshPerAttribute);O.isInstancedMesh!==!0&&B._maxInstanceCount===void 0&&(B._maxInstanceCount=oe.meshPerAttribute*oe.count)}else for(let le=0;le<j.locationSize;le++)m(j.location+le);i.bindBuffer(i.ARRAY_BUFFER,pt);for(let le=0;le<j.locationSize;le++)E(j.location+le,Ve/j.locationSize,tt,ue,Ve*rt,Ve/j.locationSize*le*rt,te)}}else if(ie!==void 0){let ue=ie[de];if(ue!==void 0)switch(ue.length){case 2:i.vertexAttrib2fv(j.location,ue);break;case 3:i.vertexAttrib3fv(j.location,ue);break;case 4:i.vertexAttrib4fv(j.location,ue);break;default:i.vertexAttrib1fv(j.location,ue)}}}}S()}function b(){w();for(let O in n){let V=n[O];for(let W in V){let B=V[W];for(let J in B){let ne=B[J];for(let ie in ne)u(ne[ie].object),delete ne[ie];delete B[J]}}delete n[O]}}function T(O){if(n[O.id]===void 0)return;let V=n[O.id];for(let W in V){let B=V[W];for(let J in B){let ne=B[J];for(let ie in ne)u(ne[ie].object),delete ne[ie];delete B[J]}}delete n[O.id]}function I(O){for(let V in n){let W=n[V];for(let B in W){let J=W[B];if(J[O.id]===void 0)continue;let ne=J[O.id];for(let ie in ne)u(ne[ie].object),delete ne[ie];delete J[O.id]}}}function x(O){for(let V in n){let W=n[V],B=O.isInstancedMesh===!0?O.id:0,J=W[B];if(J!==void 0){for(let ne in J){let ie=J[ne];for(let de in ie)u(ie[de].object),delete ie[de];delete J[ne]}delete W[B],Object.keys(W).length===0&&delete n[V]}}}function w(){R(),a=!0,r!==s&&(r=s,l(r.object))}function R(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:o,reset:w,resetDefaultState:R,dispose:b,releaseStatesOfGeometry:T,releaseStatesOfObject:x,releaseStatesOfProgram:I,initAttributes:v,enableAttribute:m,disableUnusedAttributes:S}}function zm(i,e,t){let n;function s(c){n=c}function r(c,l){i.drawArrays(n,c,l),t.update(l,n,1)}function a(c,l,u){u!==0&&(i.drawArraysInstanced(n,c,l,u),t.update(l,n,u))}function o(c,l,u){if(u===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,c,0,l,0,u);let h=0;for(let f=0;f<u;f++)h+=l[f];t.update(h,n,1)}this.setMode=s,this.render=r,this.renderInstances=a,this.renderMultiDraw=o}function Gm(i,e,t,n){let s;function r(){if(s!==void 0)return s;if(e.has("EXT_texture_filter_anisotropic")===!0){let I=e.get("EXT_texture_filter_anisotropic");s=i.getParameter(I.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function a(I){return!(I!==Dn&&n.convert(I)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(I){let x=I===Yn&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(I!==bn&&I!==Ln&&!x&&n.convert(I)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE))}function c(I){if(I==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";I="mediump"}return I==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let l=t.precision!==void 0?t.precision:"highp",u=c(l);u!==l&&(qe("WebGLRenderer:",l,"not supported, using",u,"instead."),l=u);let p=t.logarithmicDepthBuffer===!0,h=t.reversedDepthBuffer===!0&&e.has("EXT_clip_control");t.reversedDepthBuffer===!0&&h===!1&&qe("WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer.");let f=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),g=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),v=i.getParameter(i.MAX_TEXTURE_SIZE),m=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),d=i.getParameter(i.MAX_VERTEX_ATTRIBS),S=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),E=i.getParameter(i.MAX_VARYING_VECTORS),y=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),b=i.getParameter(i.MAX_SAMPLES),T=i.getParameter(i.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:c,textureFormatReadable:a,textureTypeReadable:o,precision:l,logarithmicDepthBuffer:p,reversedDepthBuffer:h,maxTextures:f,maxVertexTextures:g,maxTextureSize:v,maxCubemapSize:m,maxAttributes:d,maxVertexUniforms:S,maxVaryings:E,maxFragmentUniforms:y,maxSamples:b,samples:T}}function Vm(i){let e=this,t=null,n=0,s=!1,r=!1,a=new Vn,o=new je,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(p,h){let f=p.length!==0||h||n!==0||s;return s=h,n=p.length,f},this.beginShadows=function(){r=!0,u(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(p,h){t=u(p,h,0)},this.setState=function(p,h,f){let g=p.clippingPlanes,v=p.clipIntersection,m=p.clipShadows,d=i.get(p);if(!s||g===null||g.length===0||r&&!m)r?u(null):l();else{let S=r?0:n,E=S*4,y=d.clippingState||null;c.value=y,y=u(g,h,E,f);for(let b=0;b!==E;++b)y[b]=t[b];d.clippingState=y,this.numIntersection=v?this.numPlanes:0,this.numPlanes+=S}};function l(){c.value!==t&&(c.value=t,c.needsUpdate=n>0),e.numPlanes=n,e.numIntersection=0}function u(p,h,f,g){let v=p!==null?p.length:0,m=null;if(v!==0){if(m=c.value,g!==!0||m===null){let d=f+v*4,S=h.matrixWorldInverse;o.getNormalMatrix(S),(m===null||m.length<d)&&(m=new Float32Array(d));for(let E=0,y=f;E!==v;++E,y+=4)a.copy(p[E]).applyMatrix4(S,o),a.normal.toArray(m,y),m[y+3]=a.constant}c.value=m,c.needsUpdate=!0}return e.numPlanes=v,e.numIntersection=0,m}}var Xs=4,km=6,Hm=20,Wm=256,qr=new Gs,Su=new We,Rc=null,Pc=0,Ic=0,Lc=!1,Xm=new P,as=new P,al=class{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(e,t=0,n=.1,s=100,r={}){let{size:a=256,position:o=Xm}=r;Rc=this._renderer.getRenderTarget(),Pc=this._renderer.getActiveCubeFace(),Ic=this._renderer.getActiveMipmapLevel(),Lc=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(a);let c=this._allocateTargets();return c.depthBuffer=!0,this._sceneToCubeUV(e,n,s,c,o),t>0&&this._blur(c,0,0,t),this._applyPMREM(c),this._cleanup(c),c}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=wu(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Tu(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodMeshes.length;e++)this._lodMeshes[e].geometry.dispose()}_cleanup(e){this._renderer.setRenderTarget(Rc,Pc,Ic),this._renderer.xr.enabled=Lc,e.scissorTest=!1,Ws(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===Gi||e.mapping===ss?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),Rc=this._renderer.getRenderTarget(),Pc=this._renderer.getActiveCubeFace(),Ic=this._renderer.getActiveMipmapLevel(),Lc=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;let n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){let e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:ln,minFilter:ln,generateMipmaps:!1,type:Yn,format:Dn,colorSpace:dr,depthBuffer:!1},s=bu(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=bu(e,t,n);let{_lodMax:r}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods}=qm(r)),this._blurMaterial=Zm(r,e,t),this._ggxMaterial=Ym(r,e,t)}return s}_compileMaterial(e){let t=new Xe(new Rt,e);this._renderer.compile(t,qr)}_sceneToCubeUV(e,t,n,s,r){let c=new an(90,1,t,n),l=[1,-1,1,1,1,1],u=[1,1,1,-1,-1,-1],p=this._renderer,h=p.autoClear,f=p.toneMapping;p.getClearColor(Su),p.toneMapping=Xn,p.autoClear=!1,p.state.buffers.depth.getReversed()&&(p.setRenderTarget(s),p.clearDepth(),p.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new Xe(new pe,new ft({name:"PMREM.Background",side:cn,depthWrite:!1,depthTest:!1})));let v=this._backgroundBox,m=v.material,d=!1,S=e.background;S?S.isColor&&(m.color.copy(S),e.background=null,d=!0):(m.color.copy(Su),d=!0);for(let E=0;E<6;E++){let y=E%3;y===0?(c.up.set(0,l[E],0),c.position.set(r.x,r.y,r.z),c.lookAt(r.x+u[E],r.y,r.z)):y===1?(c.up.set(0,0,l[E]),c.position.set(r.x,r.y,r.z),c.lookAt(r.x,r.y+u[E],r.z)):(c.up.set(0,l[E],0),c.position.set(r.x,r.y,r.z),c.lookAt(r.x,r.y,r.z+u[E]));let b=this._cubeSize;Ws(s,y*b,E>2?b:0,b,b),p.setRenderTarget(s),d&&p.render(v,c),p.render(e,c)}p.toneMapping=f,p.autoClear=h,e.background=S}_textureToCubeUV(e,t){let n=this._renderer,s=e.mapping===Gi||e.mapping===ss;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=wu()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Tu());let r=s?this._cubemapMaterial:this._equirectMaterial,a=this._lodMeshes[0];a.material=r;let o=r.uniforms;o.envMap.value=e;let c=this._cubeSize;Ws(t,0,0,3*c,2*c),n.setRenderTarget(t),n.render(a,qr)}_applyPMREM(e){let t=this._renderer,n=t.autoClear;t.autoClear=!1;let s=this._lodMeshes.length;for(let r=1;r<s;r++)this._applyGGXFilter(e,r-1,r);t.autoClear=n}_applyGGXFilter(e,t,n){let s=this._renderer,r=this._pingPongRenderTarget,a=this._ggxMaterial,o=this._lodMeshes[n];o.material=a;let c=a.uniforms,l=n/(this._lodMeshes.length-1),u=t/(this._lodMeshes.length-1),p=Math.sqrt(l*l-u*u),h=l*1.25,f=p*h,{_lodMax:g}=this,v=this._sizeLods[n],m=3*v*(n>g-Xs?n-g+Xs:0),d=4*(this._cubeSize-v);c.envMap.value=e.texture,c.roughness.value=f,c.mipInt.value=g-t,Ws(r,m,d,3*v,2*v),s.setRenderTarget(r),s.render(o,qr),c.envMap.value=r.texture,c.roughness.value=0,c.mipInt.value=g-n,Ws(e,m,d,3*v,2*v),s.setRenderTarget(e),s.render(o,qr)}_blur(e,t,n,s){let r=this._pingPongRenderTarget,a=Math.min(s,Math.PI)/Math.SQRT2;this._blurPass(e,r,t,n,a),this._blurPass(r,e,n,n,a)}_blurPass(e,t,n,s,r){let a=this._renderer,o=this._blurMaterial,c=this._lodMeshes[s];c.material=o;let l=o.uniforms;l.envMap.value=e.texture,l.sigma.value=r,l.mipInt.value=this._lodMax-n;let u=this._sizeLods[s],p=3*u*(s>this._lodMax-Xs?s-this._lodMax+Xs:0),h=4*(this._cubeSize-u);Ws(t,p,h,3*u,2*u),a.setRenderTarget(t),a.render(c,qr)}};function qm(i){let e=[],t=[],n=i,s=i-Xs+1+km;for(let r=0;r<s;r++){let a=Math.pow(2,n);e.push(a);let o=1/(a-2),c=-o,l=1+o,u=[c,c,l,c,l,l,c,c,l,l,c,l],p=6,h=6,f=3,g=new Float32Array(f*h*p),v=new Float32Array(f*h*p);for(let d=0;d<p;d++){let S=d%3*2/3-1,E=d>2?0:-1,y=[S,E,0,S+2/3,E,0,S+2/3,E+1,0,S,E,0,S+2/3,E+1,0,S,E+1,0];g.set(y,f*h*d);for(let b=0;b<h;b++){let T=u[b*2]*2-1,I=u[b*2+1]*2-1;d===0?as.set(1,I,T):d===1?as.set(-T,1,-I):d===2?as.set(-T,I,1):d===3?as.set(-1,I,-T):d===4?as.set(-T,-1,I):as.set(T,I,-1),as.toArray(v,(d*h+b)*f)}}let m=new Rt;m.setAttribute("position",new Yt(g,f)),m.setAttribute("outputDirection",new Yt(v,f)),t.push(new Xe(m,null)),n>Xs&&n--}return{lodMeshes:t,sizeLods:e}}function bu(i,e,t){let n=new Mn(i,e,t);return n.texture.mapping=Or,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function Ws(i,e,t,n,s){i.viewport.set(e,t,n,s),i.scissor.set(e,t,n,s)}function Ym(i,e,t){return new vn({name:"PMREMGGXConvolution",defines:{GGX_SAMPLES:Wm,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:cl(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float roughness;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359

			// Van der Corput radical inverse
			float radicalInverse_VdC(uint bits) {
				bits = (bits << 16u) | (bits >> 16u);
				bits = ((bits & 0x55555555u) << 1u) | ((bits & 0xAAAAAAAAu) >> 1u);
				bits = ((bits & 0x33333333u) << 2u) | ((bits & 0xCCCCCCCCu) >> 2u);
				bits = ((bits & 0x0F0F0F0Fu) << 4u) | ((bits & 0xF0F0F0F0u) >> 4u);
				bits = ((bits & 0x00FF00FFu) << 8u) | ((bits & 0xFF00FF00u) >> 8u);
				return float(bits) * 2.3283064365386963e-10; // / 0x100000000
			}

			// Hammersley sequence
			vec2 hammersley(uint i, uint N) {
				return vec2(float(i) / float(N), radicalInverse_VdC(i));
			}

			// GGX VNDF importance sampling (Eric Heitz 2018)
			// "Sampling the GGX Distribution of Visible Normals"
			// https://jcgt.org/published/0007/04/01/
			vec3 importanceSampleGGX_VNDF(vec2 Xi, vec3 V, float roughness) {
				float alpha = roughness * roughness;

				// Section 4.1: Orthonormal basis
				vec3 T1 = vec3(1.0, 0.0, 0.0);
				vec3 T2 = cross(V, T1);

				// Section 4.2: Parameterization of projected area
				float r = sqrt(Xi.x);
				float phi = 2.0 * PI * Xi.y;
				float t1 = r * cos(phi);
				float t2 = r * sin(phi);
				float s = 0.5 * (1.0 + V.z);
				t2 = (1.0 - s) * sqrt(1.0 - t1 * t1) + s * t2;

				// Section 4.3: Reprojection onto hemisphere
				vec3 Nh = t1 * T1 + t2 * T2 + sqrt(max(0.0, 1.0 - t1 * t1 - t2 * t2)) * V;

				// Section 3.4: Transform back to ellipsoid configuration
				return normalize(vec3(alpha * Nh.x, alpha * Nh.y, max(0.0, Nh.z)));
			}

			void main() {
				vec3 N = normalize(vOutputDirection);
				vec3 V = N; // Assume view direction equals normal for pre-filtering

				vec3 prefilteredColor = vec3(0.0);
				float totalWeight = 0.0;

				// For very low roughness, just sample the environment directly
				if (roughness < 0.001) {
					gl_FragColor = vec4(bilinearCubeUV(envMap, N, mipInt), 1.0);
					return;
				}

				// Tangent space basis for VNDF sampling
				vec3 up = abs(N.z) < 0.999 ? vec3(0.0, 0.0, 1.0) : vec3(1.0, 0.0, 0.0);
				vec3 tangent = normalize(cross(up, N));
				vec3 bitangent = cross(N, tangent);

				for(uint i = 0u; i < uint(GGX_SAMPLES); i++) {
					vec2 Xi = hammersley(i, uint(GGX_SAMPLES));

					// For PMREM, V = N, so in tangent space V is always (0, 0, 1)
					vec3 H_tangent = importanceSampleGGX_VNDF(Xi, vec3(0.0, 0.0, 1.0), roughness);

					// Transform H back to world space
					vec3 H = normalize(tangent * H_tangent.x + bitangent * H_tangent.y + N * H_tangent.z);
					vec3 L = normalize(2.0 * dot(V, H) * H - V);

					float NdotL = max(dot(N, L), 0.0);

					if(NdotL > 0.0) {
						// Sample environment at fixed mip level
						// VNDF importance sampling handles the distribution filtering
						vec3 sampleColor = bilinearCubeUV(envMap, L, mipInt);

						// Weight by NdotL for the split-sum approximation
						// VNDF PDF naturally accounts for the visible microfacet distribution
						prefilteredColor += sampleColor * NdotL;
						totalWeight += NdotL;
					}
				}

				if (totalWeight > 0.0) {
					prefilteredColor = prefilteredColor / totalWeight;
				}

				gl_FragColor = vec4(prefilteredColor, 1.0);
			}
		`,blending:ii,depthTest:!1,depthWrite:!1})}function Zm(i,e,t){return new vn({name:"SphericalGaussianBlur",defines:{SAMPLES:Hm,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},sigma:{value:0},mipInt:{value:0}},vertexShader:cl(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float sigma;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359
			#define GOLDEN_ANGLE 2.39996322973

			void main() {

				if ( sigma == 0.0 ) {

					gl_FragColor = vec4( bilinearCubeUV( envMap, vOutputDirection, mipInt ), 1.0 );
					return;

				}

				vec3 outputDirection = normalize( vOutputDirection );

				vec3 up = abs( outputDirection.z ) < 0.999 ? vec3( 0.0, 0.0, 1.0 ) : vec3( 1.0, 0.0, 0.0 );
				vec3 tangent = normalize( cross( up, outputDirection ) );
				vec3 bitangent = cross( outputDirection, tangent );

				// Truncate the kernel at three standard deviations or at the antipode.
				float thetaMax = min( 3.0 * sigma, PI );
				float truncation = 1.0 - exp( - 0.5 * thetaMax * thetaMax / ( sigma * sigma ) );

				vec3 accumColor = vec3( 0.0 );
				float accumWeight = 0.0;

				for ( int i = 0; i < SAMPLES; i ++ ) {

					// Stratified inverse-CDF sampling of the Gaussian, placed on a golden-angle spiral.
					float stratum = ( float( i ) + 0.5 ) / float( SAMPLES );
					float theta = sigma * sqrt( - 2.0 * log( 1.0 - stratum * truncation ) );
					float phi = float( i ) * GOLDEN_ANGLE;

					vec3 offset = cos( phi ) * tangent + sin( phi ) * bitangent;
					vec3 sampleDirection = cos( theta ) * outputDirection + sin( theta ) * offset;

					// Correct the planar sample density to solid angle.
					float weight = sin( theta ) / theta;

					accumColor += weight * bilinearCubeUV( envMap, sampleDirection, mipInt );
					accumWeight += weight;

				}

				gl_FragColor = vec4( accumColor / accumWeight, 1.0 );

			}
		`,blending:ii,depthTest:!1,depthWrite:!1})}function Tu(){return new vn({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:cl(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:ii,depthTest:!1,depthWrite:!1})}function wu(){return new vn({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:cl(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:ii,depthTest:!1,depthWrite:!1})}function cl(){return`

		precision mediump float;
		precision mediump int;

		attribute vec3 outputDirection;

		varying vec3 vOutputDirection;

		void main() {

			vOutputDirection = outputDirection;
			gl_Position = vec4( position, 1.0 );

		}
	`}var ol=class extends Mn{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;let n={width:e,height:e,depth:1},s=[n,n,n,n,n,n];this.texture=new wr(s),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;let n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},s=new pe(5,5,5),r=new vn({name:"CubemapFromEquirect",uniforms:rs(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:cn,blending:ii});r.uniforms.tEquirect.value=t;let a=new Xe(s,r),o=t.minFilter;return t.minFilter===Vi&&(t.minFilter=ln),new ho(1,10,this).update(e,a),t.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,t=!0,n=!0,s=!0){let r=e.getRenderTarget();for(let a=0;a<6;a++)e.setRenderTarget(this,a),e.clear(t,n,s);e.setRenderTarget(r)}};function Jm(i){let e=new WeakMap,t=new WeakMap,n=null;function s(h,f=!1){return h==null?null:f?a(h):r(h)}function r(h){if(h&&h.isTexture){let f=h.mapping;if(f===mo||f===go)if(e.has(h)){let g=e.get(h).texture;return o(g,h.mapping)}else{let g=h.image;if(g&&g.height>0){let v=new ol(g.height);return v.fromEquirectangularTexture(i,h),e.set(h,v),h.addEventListener("dispose",l),o(v.texture,h.mapping)}else return null}}return h}function a(h){if(h&&h.isTexture){let f=h.mapping,g=f===mo||f===go,v=f===Gi||f===ss;if(g||v){let m=t.get(h),d=m!==void 0?m.texture.pmremVersion:0;if(h.isRenderTargetTexture&&h.pmremVersion!==d)return n===null&&(n=new al(i)),m=g?n.fromEquirectangular(h,m):n.fromCubemap(h,m),m.texture.pmremVersion=h.pmremVersion,t.set(h,m),m.texture;if(m!==void 0)return m.texture;{let S=h.image;return g&&S&&S.height>0||v&&S&&c(S)?(n===null&&(n=new al(i)),m=g?n.fromEquirectangular(h):n.fromCubemap(h),m.texture.pmremVersion=h.pmremVersion,t.set(h,m),h.addEventListener("dispose",u),m.texture):null}}}return h}function o(h,f){return f===mo?h.mapping=Gi:f===go&&(h.mapping=ss),h}function c(h){let f=0,g=6;for(let v=0;v<g;v++)h[v]!==void 0&&f++;return f===g}function l(h){let f=h.target;f.removeEventListener("dispose",l);let g=e.get(f);g!==void 0&&(e.delete(f),g.dispose())}function u(h){let f=h.target;f.removeEventListener("dispose",u);let g=t.get(f);g!==void 0&&(t.delete(f),g.dispose())}function p(){e=new WeakMap,t=new WeakMap,n!==null&&(n.dispose(),n=null)}return{get:s,dispose:p}}function $m(i){let e={};function t(n){if(e[n]!==void 0)return e[n];let s=i.getExtension(n);return e[n]=s,s}return{has:function(n){return t(n)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(n){let s=t(n);return s===null&&Zi("WebGLRenderer: "+n+" extension not supported."),s}}}function Km(i,e,t,n){let s={},r=new WeakMap;function a(p){let h=p.target;h.index!==null&&e.remove(h.index);for(let g in h.attributes)e.remove(h.attributes[g]);h.removeEventListener("dispose",a),delete s[h.id];let f=r.get(h);f&&(e.remove(f),r.delete(h)),n.releaseStatesOfGeometry(h),h.isInstancedBufferGeometry===!0&&delete h._maxInstanceCount,t.memory.geometries--}function o(p,h){return s[h.id]===!0||(h.addEventListener("dispose",a),s[h.id]=!0,t.memory.geometries++),h}function c(p){let h=p.attributes;for(let f in h)e.update(h[f],i.ARRAY_BUFFER)}function l(p){let h=[],f=p.index,g=p.attributes.position,v=0;if(g===void 0)return;if(f!==null){let S=f.array;v=f.version;for(let E=0,y=S.length;E<y;E+=3){let b=S[E+0],T=S[E+1],I=S[E+2];h.push(b,T,T,I,I,b)}}else{let S=g.array;v=g.version;for(let E=0,y=S.length/3-1;E<y;E+=3){let b=E+0,T=E+1,I=E+2;h.push(b,T,T,I,I,b)}}let m=new(g.count>=65535?vr:yr)(h,1);m.version=v;let d=r.get(p);d&&e.remove(d),r.set(p,m)}function u(p){let h=r.get(p);if(h){let f=p.index;f!==null&&h.version<f.version&&l(p)}else l(p);return r.get(p)}return{get:o,update:c,getWireframeAttribute:u}}function Qm(i,e,t){let n;function s(p){n=p}let r,a;function o(p){r=p.type,a=p.bytesPerElement}function c(p,h){i.drawElements(n,h,r,p*a),t.update(h,n,1)}function l(p,h,f){f!==0&&(i.drawElementsInstanced(n,h,r,p*a,f),t.update(h,n,f))}function u(p,h,f){if(f===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,h,0,r,p,0,f);let v=0;for(let m=0;m<f;m++)v+=h[m];t.update(v,n,1)}this.setMode=s,this.setIndex=o,this.render=c,this.renderInstances=l,this.renderMultiDraw=u}function jm(i){let e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,a,o){switch(t.calls++,a){case i.TRIANGLES:t.triangles+=o*(r/3);break;case i.LINES:t.lines+=o*(r/2);break;case i.LINE_STRIP:t.lines+=o*(r-1);break;case i.LINE_LOOP:t.lines+=o*r;break;case i.POINTS:t.points+=o*r;break;default:Ze("WebGLInfo: Unknown draw mode:",a);break}}function s(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:s,update:n}}function eg(i,e,t){let n=new WeakMap,s=new Gt;function r(a,o,c){let l=a.morphTargetInfluences,u=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,p=u!==void 0?u.length:0,h=n.get(o);if(h===void 0||h.count!==p){let w=function(){I.dispose(),n.delete(o),o.removeEventListener("dispose",w)};h!==void 0&&h.texture.dispose();let f=o.morphAttributes.position!==void 0,g=o.morphAttributes.normal!==void 0,v=o.morphAttributes.color!==void 0,m=o.morphAttributes.position||[],d=o.morphAttributes.normal||[],S=o.morphAttributes.color||[],E=0;f===!0&&(E=1),g===!0&&(E=2),v===!0&&(E=3);let y=o.attributes.position.count*E,b=1;y>e.maxTextureSize&&(b=Math.ceil(y/e.maxTextureSize),y=e.maxTextureSize);let T=new Float32Array(y*b*4*p),I=new _r(T,y,b,p);I.type=Ln,I.needsUpdate=!0;let x=E*4;for(let R=0;R<p;R++){let O=m[R],V=d[R],W=S[R],B=y*b*4*R;for(let J=0;J<O.count;J++){let ne=J*x;f===!0&&(s.fromBufferAttribute(O,J),T[B+ne+0]=s.x,T[B+ne+1]=s.y,T[B+ne+2]=s.z,T[B+ne+3]=0),g===!0&&(s.fromBufferAttribute(V,J),T[B+ne+4]=s.x,T[B+ne+5]=s.y,T[B+ne+6]=s.z,T[B+ne+7]=0),v===!0&&(s.fromBufferAttribute(W,J),T[B+ne+8]=s.x,T[B+ne+9]=s.y,T[B+ne+10]=s.z,T[B+ne+11]=W.itemSize===4?s.w:1)}}h={count:p,texture:I,size:new Pe(y,b)},n.set(o,h),o.addEventListener("dispose",w)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)c.getUniforms().setValue(i,"morphTexture",a.morphTexture,t);else{let f=0;for(let v=0;v<l.length;v++)f+=l[v];let g=o.morphTargetsRelative?1:1-f;c.getUniforms().setValue(i,"morphTargetBaseInfluence",g),c.getUniforms().setValue(i,"morphTargetInfluences",l)}c.getUniforms().setValue(i,"morphTargetsTexture",h.texture,t),c.getUniforms().setValue(i,"morphTargetsTextureSize",h.size)}return{update:r}}function tg(i,e,t,n,s){let r=new WeakMap;function a(l){let u=s.render.frame,p=l.geometry,h=e.get(l,p);if(r.get(h)!==u&&(e.update(h),r.set(h,u)),l.isInstancedMesh&&(l.hasEventListener("dispose",c)===!1&&l.addEventListener("dispose",c),r.get(l)!==u&&(t.update(l.instanceMatrix,i.ARRAY_BUFFER),l.instanceColor!==null&&t.update(l.instanceColor,i.ARRAY_BUFFER),r.set(l,u))),l.isSkinnedMesh){let f=l.skeleton;r.get(f)!==u&&(f.update(),r.set(f,u))}return h}function o(){r=new WeakMap}function c(l){let u=l.target;u.removeEventListener("dispose",c),n.releaseStatesOfObject(u),t.remove(u.instanceMatrix),u.instanceColor!==null&&t.remove(u.instanceColor)}return{update:a,dispose:o}}var ng={[sc]:"LINEAR_TONE_MAPPING",[rc]:"REINHARD_TONE_MAPPING",[ac]:"CINEON_TONE_MAPPING",[Br]:"ACES_FILMIC_TONE_MAPPING",[lc]:"AGX_TONE_MAPPING",[cc]:"NEUTRAL_TONE_MAPPING",[oc]:"CUSTOM_TONE_MAPPING"};function ig(i,e,t,n,s,r){let a=new Mn(e,t,{type:i,depthBuffer:s,stencilBuffer:r,samples:n?4:0,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,resolveDepthBuffer:!1,resolveStencilBuffer:!1}),o=null,c=null,l=new Rt;l.setAttribute("position",new st([-1,3,0,-1,-1,0,3,-1,0],3)),l.setAttribute("uv",new st([0,2,0,0,2,0],2));let u=new Ka({uniforms:{tDiffuse:{value:null}},vertexShader:`
			precision highp float;

			uniform mat4 modelViewMatrix;
			uniform mat4 projectionMatrix;

			attribute vec3 position;
			attribute vec2 uv;

			varying vec2 vUv;

			void main() {
				vUv = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			}`,fragmentShader:`
			precision highp float;

			uniform sampler2D tDiffuse;

			varying vec2 vUv;

			#include <tonemapping_pars_fragment>
			#include <colorspace_pars_fragment>

			void main() {
				gl_FragColor = texture2D( tDiffuse, vUv );

				#ifdef LINEAR_TONE_MAPPING
					gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );
				#elif defined( REINHARD_TONE_MAPPING )
					gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );
				#elif defined( CINEON_TONE_MAPPING )
					gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );
				#elif defined( ACES_FILMIC_TONE_MAPPING )
					gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );
				#elif defined( AGX_TONE_MAPPING )
					gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );
				#elif defined( NEUTRAL_TONE_MAPPING )
					gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );
				#elif defined( CUSTOM_TONE_MAPPING )
					gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );
				#endif

				#ifdef SRGB_TRANSFER
					gl_FragColor = sRGBTransferOETF( gl_FragColor );
				#endif
			}`,depthTest:!1,depthWrite:!1}),p=new Xe(l,u),h=new Gs(-1,1,1,-1,0,1),f=null,g=null,v=!1,m,d=null,S=[],E=!1;this.setSize=function(y,b){a.setSize(y,b),o!==null&&o.setSize(y,b),c!==null&&c.setSize(y,b);for(let T=0;T<S.length;T++){let I=S[T];I.setSize&&I.setSize(y,b)}},this.setEffects=function(y){S=y,E=S.length>0&&S[0].isRenderPass===!0;let b=a.width,T=a.height;S.length>0&&o===null&&(o=new Mn(b,T,{type:Yn,depthBuffer:!1,stencilBuffer:!1}),c=new Mn(b,T,{type:Yn,depthBuffer:!1,stencilBuffer:!1}));for(let I=0;I<S.length;I++){let x=S[I];x.setSize&&x.setSize(b,T)}},this.begin=function(y,b){if(v||y.toneMapping===Xn&&S.length===0)return!1;if(d=b,b!==null){let T=b.width,I=b.height;(a.width!==T||a.height!==I)&&this.setSize(T,I)}return E===!1&&y.setRenderTarget(a),m=y.toneMapping,y.toneMapping=Xn,!0},this.hasRenderPass=function(){return E},this.end=function(y,b){y.toneMapping=m,v=!0;let T=a,I=o;for(let x=0;x<S.length;x++){let w=S[x];w.enabled!==!1&&(w.render(y,I,T,b),w.needsSwap!==!1&&(T=I,I=I===o?c:o))}if(f!==y.outputColorSpace||g!==y.toneMapping){f=y.outputColorSpace,g=y.toneMapping,u.defines={},dt.getTransfer(f)===Tt&&(u.defines.SRGB_TRANSFER="");let x=ng[g];x&&(u.defines[x]=""),u.needsUpdate=!0}u.uniforms.tDiffuse.value=T.texture,y.setRenderTarget(d),y.render(p,h),d=null,v=!1},this.isCompositing=function(){return v},this.dispose=function(){a.dispose(),o!==null&&o.dispose(),c!==null&&c.dispose(),l.dispose(),u.dispose()}}var Xu=new xn,Uc=new Ni(1,1),qu=new _r,Yu=new Oa,Zu=new wr,Au=[],Eu=[],Cu=new Float32Array(16),Ru=new Float32Array(9),Pu=new Float32Array(4);function Ys(i,e,t){let n=i[0];if(n<=0||n>0)return i;let s=e*t,r=Au[s];if(r===void 0&&(r=new Float32Array(s),Au[s]=r),e!==0){n.toArray(r,0);for(let a=1,o=0;a!==e;++a)o+=t,i[a].toArray(r,o)}return r}function en(i,e){if(i.length!==e.length)return!1;for(let t=0,n=i.length;t<n;t++)if(i[t]!==e[t])return!1;return!0}function tn(i,e){for(let t=0,n=e.length;t<n;t++)i[t]=e[t]}function hl(i,e){let t=Eu[e];t===void 0&&(t=new Int32Array(e),Eu[e]=t);for(let n=0;n!==e;++n)t[n]=i.allocateTextureUnit();return t}function sg(i,e){let t=this.cache;t[0]!==e&&(i.uniform1f(this.addr,e),t[0]=e)}function rg(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(en(t,e))return;i.uniform2fv(this.addr,e),tn(t,e)}}function ag(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(i.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(en(t,e))return;i.uniform3fv(this.addr,e),tn(t,e)}}function og(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(en(t,e))return;i.uniform4fv(this.addr,e),tn(t,e)}}function lg(i,e){let t=this.cache,n=e.elements;if(n===void 0){if(en(t,e))return;i.uniformMatrix2fv(this.addr,!1,e),tn(t,e)}else{if(en(t,n))return;Pu.set(n),i.uniformMatrix2fv(this.addr,!1,Pu),tn(t,n)}}function cg(i,e){let t=this.cache,n=e.elements;if(n===void 0){if(en(t,e))return;i.uniformMatrix3fv(this.addr,!1,e),tn(t,e)}else{if(en(t,n))return;Ru.set(n),i.uniformMatrix3fv(this.addr,!1,Ru),tn(t,n)}}function hg(i,e){let t=this.cache,n=e.elements;if(n===void 0){if(en(t,e))return;i.uniformMatrix4fv(this.addr,!1,e),tn(t,e)}else{if(en(t,n))return;Cu.set(n),i.uniformMatrix4fv(this.addr,!1,Cu),tn(t,n)}}function ug(i,e){let t=this.cache;t[0]!==e&&(i.uniform1i(this.addr,e),t[0]=e)}function dg(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(en(t,e))return;i.uniform2iv(this.addr,e),tn(t,e)}}function fg(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(en(t,e))return;i.uniform3iv(this.addr,e),tn(t,e)}}function pg(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(en(t,e))return;i.uniform4iv(this.addr,e),tn(t,e)}}function mg(i,e){let t=this.cache;t[0]!==e&&(i.uniform1ui(this.addr,e),t[0]=e)}function gg(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(en(t,e))return;i.uniform2uiv(this.addr,e),tn(t,e)}}function _g(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(en(t,e))return;i.uniform3uiv(this.addr,e),tn(t,e)}}function xg(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(en(t,e))return;i.uniform4uiv(this.addr,e),tn(t,e)}}function yg(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);let r;this.type===i.SAMPLER_2D_SHADOW?(Uc.compareFunction=t.isReversedDepthBuffer()?il:nl,r=Uc):r=Xu,t.setTexture2D(e||r,s)}function vg(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture3D(e||Yu,s)}function Mg(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTextureCube(e||Zu,s)}function Sg(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture2DArray(e||qu,s)}function bg(i){switch(i){case 5126:return sg;case 35664:return rg;case 35665:return ag;case 35666:return og;case 35674:return lg;case 35675:return cg;case 35676:return hg;case 5124:case 35670:return ug;case 35667:case 35671:return dg;case 35668:case 35672:return fg;case 35669:case 35673:return pg;case 5125:return mg;case 36294:return gg;case 36295:return _g;case 36296:return xg;case 35678:case 36198:case 36298:case 36306:case 35682:return yg;case 35679:case 36299:case 36307:return vg;case 35680:case 36300:case 36308:case 36293:return Mg;case 36289:case 36303:case 36311:case 36292:return Sg}}function Tg(i,e){i.uniform1fv(this.addr,e)}function wg(i,e){let t=Ys(e,this.size,2);i.uniform2fv(this.addr,t)}function Ag(i,e){let t=Ys(e,this.size,3);i.uniform3fv(this.addr,t)}function Eg(i,e){let t=Ys(e,this.size,4);i.uniform4fv(this.addr,t)}function Cg(i,e){let t=Ys(e,this.size,4);i.uniformMatrix2fv(this.addr,!1,t)}function Rg(i,e){let t=Ys(e,this.size,9);i.uniformMatrix3fv(this.addr,!1,t)}function Pg(i,e){let t=Ys(e,this.size,16);i.uniformMatrix4fv(this.addr,!1,t)}function Ig(i,e){i.uniform1iv(this.addr,e)}function Lg(i,e){i.uniform2iv(this.addr,e)}function Dg(i,e){i.uniform3iv(this.addr,e)}function Ng(i,e){i.uniform4iv(this.addr,e)}function Ug(i,e){i.uniform1uiv(this.addr,e)}function Fg(i,e){i.uniform2uiv(this.addr,e)}function Bg(i,e){i.uniform3uiv(this.addr,e)}function Og(i,e){i.uniform4uiv(this.addr,e)}function zg(i,e,t){let n=this.cache,s=e.length,r=hl(t,s);en(n,r)||(i.uniform1iv(this.addr,r),tn(n,r));let a;this.type===i.SAMPLER_2D_SHADOW?a=Uc:a=Xu;for(let o=0;o!==s;++o)t.setTexture2D(e[o]||a,r[o])}function Gg(i,e,t){let n=this.cache,s=e.length,r=hl(t,s);en(n,r)||(i.uniform1iv(this.addr,r),tn(n,r));for(let a=0;a!==s;++a)t.setTexture3D(e[a]||Yu,r[a])}function Vg(i,e,t){let n=this.cache,s=e.length,r=hl(t,s);en(n,r)||(i.uniform1iv(this.addr,r),tn(n,r));for(let a=0;a!==s;++a)t.setTextureCube(e[a]||Zu,r[a])}function kg(i,e,t){let n=this.cache,s=e.length,r=hl(t,s);en(n,r)||(i.uniform1iv(this.addr,r),tn(n,r));for(let a=0;a!==s;++a)t.setTexture2DArray(e[a]||qu,r[a])}function Hg(i){switch(i){case 5126:return Tg;case 35664:return wg;case 35665:return Ag;case 35666:return Eg;case 35674:return Cg;case 35675:return Rg;case 35676:return Pg;case 5124:case 35670:return Ig;case 35667:case 35671:return Lg;case 35668:case 35672:return Dg;case 35669:case 35673:return Ng;case 5125:return Ug;case 36294:return Fg;case 36295:return Bg;case 36296:return Og;case 35678:case 36198:case 36298:case 36306:case 35682:return zg;case 35679:case 36299:case 36307:return Gg;case 35680:case 36300:case 36308:case 36293:return Vg;case 36289:case 36303:case 36311:case 36292:return kg}}var Fc=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=bg(t.type)}},Bc=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=Hg(t.type)}},Oc=class{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){let s=this.seq;for(let r=0,a=s.length;r!==a;++r){let o=s[r];o.setValue(e,t[o.id],n)}}},Dc=/(\w+)(\])?(\[|\.)?/g;function Iu(i,e){i.seq.push(e),i.map[e.id]=e}function Wg(i,e,t){let n=i.name,s=n.length;for(Dc.lastIndex=0;;){let r=Dc.exec(n),a=Dc.lastIndex,o=r[1],c=r[2]==="]",l=r[3];if(c&&(o=o|0),l===void 0||l==="["&&a+2===s){Iu(t,l===void 0?new Fc(o,i,e):new Bc(o,i,e));break}else{let p=t.map[o];p===void 0&&(p=new Oc(o),Iu(t,p)),t=p}}}var qs=class{constructor(e,t){this.seq=[],this.map={};let n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let a=0;a<n;++a){let o=e.getActiveUniform(t,a),c=e.getUniformLocation(t,o.name);Wg(o,c,this)}let s=[],r=[];for(let a of this.seq)a.type===e.SAMPLER_2D_SHADOW||a.type===e.SAMPLER_CUBE_SHADOW||a.type===e.SAMPLER_2D_ARRAY_SHADOW?s.push(a):r.push(a);s.length>0&&(this.seq=s.concat(r))}setValue(e,t,n,s){let r=this.map[t];r!==void 0&&r.setValue(e,n,s)}setOptional(e,t,n){let s=t[n];s!==void 0&&this.setValue(e,n,s)}static upload(e,t,n,s){for(let r=0,a=t.length;r!==a;++r){let o=t[r],c=n[o.id];c.needsUpdate!==!1&&o.setValue(e,c.value,s)}}static seqWithValue(e,t){let n=[];for(let s=0,r=e.length;s!==r;++s){let a=e[s];a.id in t&&n.push(a)}return n}};function Lu(i,e,t){let n=i.createShader(e);return i.shaderSource(n,t),i.compileShader(n),n}var Xg=37297,qg=0;function Yg(i,e){let t=i.split(`
`),n=[],s=Math.max(e-6,0),r=Math.min(e+6,t.length);for(let a=s;a<r;a++){let o=a+1;n.push(`${o===e?">":" "} ${o}: ${t[a]}`)}return n.join(`
`)}var Du=new je;function Zg(i){dt._getMatrix(Du,dt.workingColorSpace,i);let e=`mat3( ${Du.elements.map(t=>t.toFixed(4))} )`;switch(dt.getTransfer(i)){case fr:return[e,"LinearTransferOETF"];case Tt:return[e,"sRGBTransferOETF"];default:return qe("WebGLProgram: Unsupported color space: ",i),[e,"LinearTransferOETF"]}}function Nu(i,e,t){let n=i.getShaderParameter(e,i.COMPILE_STATUS),r=(i.getShaderInfoLog(e)||"").trim();if(n&&r==="")return"";let a=/ERROR: 0:(\d+)/.exec(r);if(a){let o=parseInt(a[1]);return t.toUpperCase()+`

`+r+`

`+Yg(i.getShaderSource(e),o)}else return r}function Jg(i,e){let t=Zg(e);return[`vec4 ${i}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}var $g={[sc]:"Linear",[rc]:"Reinhard",[ac]:"Cineon",[Br]:"ACESFilmic",[lc]:"AgX",[cc]:"Neutral",[oc]:"Custom"};function Kg(i,e){let t=$g[e];return t===void 0?(qe("WebGLProgram: Unsupported toneMapping:",e),"vec3 "+i+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+i+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}var rl=new P;function Qg(){dt.getLuminanceCoefficients(rl);let i=rl.x.toFixed(4),e=rl.y.toFixed(4),t=rl.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function jg(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Zr).join(`
`)}function e0(i){let e=[];for(let t in i){let n=i[t];n!==!1&&e.push("#define "+t+" "+n)}return e.join(`
`)}function t0(i,e){let t={},n=i.getProgramParameter(e,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){let r=i.getActiveAttrib(e,s),a=r.name,o=1;r.type===i.FLOAT_MAT2&&(o=2),r.type===i.FLOAT_MAT3&&(o=3),r.type===i.FLOAT_MAT4&&(o=4),t[a]={type:r.type,location:i.getAttribLocation(e,a),locationSize:o}}return t}function Zr(i){return i!==""}function Uu(i,e){let t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return i.replace(/NUM_SUN_LIGHTS/g,e.numSunLights).replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_SUN_LIGHT_SHADOWS/g,e.numSunLightShadows).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function Fu(i,e){return i.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}var n0=/^[ \t]*#include +<([\w\d./]+)>/gm;function zc(i){return i.replace(n0,s0)}var i0=new Map;function s0(i,e){let t=ot[e];if(t===void 0){let n=i0.get(e);if(n!==void 0)t=ot[n],qe('WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,n);else throw new Error("THREE.WebGLProgram: Can not resolve #include <"+e+">")}return zc(t)}var r0=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Bu(i){return i.replace(r0,a0)}function a0(i,e,t,n){let s="";for(let r=parseInt(e);r<parseInt(t);r++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function Ou(i){let e=`precision ${i.precision} float;
	precision ${i.precision} int;
	precision ${i.precision} sampler2D;
	precision ${i.precision} samplerCube;
	precision ${i.precision} sampler3D;
	precision ${i.precision} sampler2DArray;
	precision ${i.precision} sampler2DShadow;
	precision ${i.precision} samplerCubeShadow;
	precision ${i.precision} sampler2DArrayShadow;
	precision ${i.precision} isampler2D;
	precision ${i.precision} isampler3D;
	precision ${i.precision} isamplerCube;
	precision ${i.precision} isampler2DArray;
	precision ${i.precision} usampler2D;
	precision ${i.precision} usampler3D;
	precision ${i.precision} usamplerCube;
	precision ${i.precision} usampler2DArray;
	`;return i.precision==="highp"?e+=`
#define HIGH_PRECISION`:i.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:i.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}var o0={[ns]:"SHADOWMAP_TYPE_PCF",[Vs]:"SHADOWMAP_TYPE_VSM"};function l0(i){return o0[i.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}var c0={[Gi]:"ENVMAP_TYPE_CUBE",[ss]:"ENVMAP_TYPE_CUBE",[Or]:"ENVMAP_TYPE_CUBE_UV"};function h0(i){return i.envMap===!1?"ENVMAP_TYPE_CUBE":c0[i.envMapMode]||"ENVMAP_TYPE_CUBE"}var u0={[ss]:"ENVMAP_MODE_REFRACTION"};function d0(i){return i.envMap===!1?"ENVMAP_MODE_REFLECTION":u0[i.envMapMode]||"ENVMAP_MODE_REFLECTION"}var f0={[ic]:"ENVMAP_BLENDING_MULTIPLY",[tu]:"ENVMAP_BLENDING_MIX",[nu]:"ENVMAP_BLENDING_ADD"};function p0(i){return i.envMap===!1?"ENVMAP_BLENDING_NONE":f0[i.combine]||"ENVMAP_BLENDING_NONE"}function m0(i){let e=i.envMapCubeUVHeight;if(e===null)return null;let t=Math.log2(e)-2,n=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),7*16)),texelHeight:n,maxMip:t}}function g0(i,e,t,n){let s=i.getContext(),r=t.defines,a=t.vertexShader,o=t.fragmentShader,c=l0(t),l=h0(t),u=d0(t),p=p0(t),h=m0(t),f=jg(t),g=e0(r),v=s.createProgram(),m,d,S=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(m=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(Zr).join(`
`),m.length>0&&(m+=`
`),d=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(Zr).join(`
`),d.length>0&&(d+=`
`)):(m=[Ou(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+u:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexNormals?"#define HAS_NORMAL":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+c:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Zr).join(`
`),d=[Ou(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+l:"",t.envMap?"#define "+u:"",t.envMap?"#define "+p:"",h?"#define CUBEUV_TEXEL_WIDTH "+h.texelWidth:"",h?"#define CUBEUV_TEXEL_HEIGHT "+h.texelHeight:"",h?"#define CUBEUV_MAX_MIP "+h.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.packedNormalMap?"#define USE_PACKED_NORMALMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.retroreflection?"#define USE_RETROREFLECTION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor?"#define USE_COLOR":"",t.vertexAlphas||t.batchingColor?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+c:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.numLightProbeGrids>0?"#define USE_LIGHT_PROBES_GRID":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==Xn?"#define TONE_MAPPING":"",t.toneMapping!==Xn?ot.tonemapping_pars_fragment:"",t.toneMapping!==Xn?Kg("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",ot.colorspace_pars_fragment,Jg("linearToOutputTexel",t.outputColorSpace),Qg(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(Zr).join(`
`)),a=zc(a),a=Uu(a,t),a=Fu(a,t),o=zc(o),o=Uu(o,t),o=Fu(o,t),a=Bu(a),o=Bu(o),t.isRawShaderMaterial!==!0&&(S=`#version 300 es
`,m=[f,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,d=["#define varying in",t.glslVersion===xc?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===xc?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+d);let E=S+m+a,y=S+d+o,b=Lu(s,s.VERTEX_SHADER,E),T=Lu(s,s.FRAGMENT_SHADER,y);s.attachShader(v,b),s.attachShader(v,T),t.index0AttributeName!==void 0?s.bindAttribLocation(v,0,t.index0AttributeName):t.hasPositionAttribute===!0&&s.bindAttribLocation(v,0,"position"),s.linkProgram(v);function I(O){if(i.debug.checkShaderErrors){let V=s.getProgramInfoLog(v)||"",W=s.getShaderInfoLog(b)||"",B=s.getShaderInfoLog(T)||"",J=V.trim(),ne=W.trim(),ie=B.trim(),de=!0,j=!0;if(s.getProgramParameter(v,s.LINK_STATUS)===!1)if(de=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,v,b,T);else{let oe=Nu(s,b,"vertex"),ue=Nu(s,T,"fragment");Ze("WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(v,s.VALIDATE_STATUS)+`

Material Name: `+O.name+`
Material Type: `+O.type+`

Program Info Log: `+J+`
`+oe+`
`+ue)}else J!==""?qe("WebGLProgram: Program Info Log:",J):(ne===""||ie==="")&&(j=!1);j&&(O.diagnostics={runnable:de,programLog:J,vertexShader:{log:ne,prefix:m},fragmentShader:{log:ie,prefix:d}})}s.deleteShader(b),s.deleteShader(T),x=new qs(s,v),w=t0(s,v)}let x;this.getUniforms=function(){return x===void 0&&I(this),x};let w;this.getAttributes=function(){return w===void 0&&I(this),w};let R=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return R===!1&&(R=s.getProgramParameter(v,Xg)),R},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(v),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=qg++,this.cacheKey=e,this.usedTimes=1,this.program=v,this.vertexShader=b,this.fragmentShader=T,this}var _0=0,Gc=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e,t,n){let s=this._getShaderCacheForMaterial(e);return s.has(t)===!1&&(s.add(t),t.usedTimes++),s.has(n)===!1&&(s.add(n),n.usedTimes++),this}remove(e){let t=this.materialCache.get(e);for(let n of t)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(e),this}getVertexShaderStage(e){return this._getShaderStage(e.vertexShader)}getFragmentShaderStage(e){return this._getShaderStage(e.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){let t=this.materialCache,n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){let t=this.shaderCache,n=t.get(e);return n===void 0&&(n=new Vc(e),t.set(e,n)),n}},Vc=class{constructor(e){this.id=_0++,this.code=e,this.usedTimes=0}};function x0(i){return i===Hi||i===Wr||i===Xr}function y0(i,e,t,n,s,r){let a=new Ds,o=new Gc,c=new Set,l=[],u=new Map,p=n.logarithmicDepthBuffer,h=n.precision,f={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function g(x){return c.add(x),x===0?"uv":`uv${x}`}function v(x,w,R,O,V,W){let B=O.fog,J=V.geometry,ne=x.isMeshStandardMaterial||x.isMeshLambertMaterial||x.isMeshPhongMaterial?O.environment:null,ie=x.isMeshStandardMaterial||x.isMeshLambertMaterial&&!x.envMap||x.isMeshPhongMaterial&&!x.envMap,de=e.get(x.envMap||ne,ie),j=de&&de.mapping===Or?de.image.height:null,oe=f[x.type];x.precision!==null&&(h=n.getMaxPrecision(x.precision),h!==x.precision&&qe("WebGLProgram.getParameters:",x.precision,"not supported, using",h,"instead."));let ue=J.morphAttributes.position||J.morphAttributes.normal||J.morphAttributes.color,Ve=ue!==void 0?ue.length:0,Ie=0;J.morphAttributes.position!==void 0&&(Ie=1),J.morphAttributes.normal!==void 0&&(Ie=2),J.morphAttributes.color!==void 0&&(Ie=3);let pt,tt,rt,te;if(oe){let F=ri[oe];pt=F.vertexShader,tt=F.fragmentShader}else{pt=x.vertexShader,tt=x.fragmentShader;let F=o.getVertexShaderStage(x),Q=o.getFragmentShaderStage(x);o.update(x,F,Q),rt=F.id,te=Q.id}let le=i.getRenderTarget(),Ae=i.state.buffers.depth.getReversed(),Je=V.isInstancedMesh===!0,Re=V.isBatchedMesh===!0,nt=!!x.map,It=!!x.matcap,Ke=!!de,lt=!!x.aoMap,mt=!!x.lightMap,it=!!x.bumpMap&&x.wireframe===!1,Mt=!!x.normalMap,Lt=!!x.displacementMap,kt=!!x.emissiveMap,wt=!!x.metalnessMap,Ut=!!x.roughnessMap,k=x.anisotropy>0,Ft=x.clearcoat>0,ct=x.dispersion>0,C=x.retroreflectivity>0,_=x.iridescence>0,X=x.sheen>0,q=x.transmission>0,ee=k&&!!x.anisotropyMap,me=Ft&&!!x.clearcoatMap,ye=Ft&&!!x.clearcoatNormalMap,se=Ft&&!!x.clearcoatRoughnessMap,ce=_&&!!x.iridescenceMap,ve=_&&!!x.iridescenceThicknessMap,Be=X&&!!x.sheenColorMap,xe=X&&!!x.sheenRoughnessMap,Me=!!x.specularMap,De=!!x.specularColorMap,ke=!!x.specularIntensityMap,Qe=q&&!!x.transmissionMap,z=q&&!!x.thicknessMap,Se=!!x.gradientMap,ae=!!x.alphaMap,L=x.alphaTest>0,H=!!x.alphaHash,A=!!x.extensions,D=Xn;x.toneMapped&&(le===null||le.isXRRenderTarget===!0)&&(D=i.toneMapping);let N={shaderID:oe,shaderType:x.type,shaderName:x.name,vertexShader:pt,fragmentShader:tt,defines:x.defines,customVertexShaderID:rt,customFragmentShaderID:te,isRawShaderMaterial:x.isRawShaderMaterial===!0,glslVersion:x.glslVersion,precision:h,batching:Re,batchingColor:Re&&V._colorsTexture!==null,instancing:Je,instancingColor:Je&&V.instanceColor!==null,instancingMorph:Je&&V.morphTexture!==null,outputColorSpace:le===null?i.outputColorSpace:le.isXRRenderTarget===!0?le.texture.colorSpace:dt.workingColorSpace,alphaToCoverage:!!x.alphaToCoverage,map:nt,matcap:It,envMap:Ke,envMapMode:Ke&&de.mapping,envMapCubeUVHeight:j,aoMap:lt,lightMap:mt,bumpMap:it,normalMap:Mt,displacementMap:Lt,emissiveMap:kt,normalMapObjectSpace:Mt&&x.normalMapType===ru,normalMapTangentSpace:Mt&&x.normalMapType===tl,packedNormalMap:Mt&&x.normalMapType===tl&&x0(x.normalMap.format),metalnessMap:wt,roughnessMap:Ut,anisotropy:k,anisotropyMap:ee,clearcoat:Ft,clearcoatMap:me,clearcoatNormalMap:ye,clearcoatRoughnessMap:se,dispersion:ct,retroreflection:C,iridescence:_,iridescenceMap:ce,iridescenceThicknessMap:ve,sheen:X,sheenColorMap:Be,sheenRoughnessMap:xe,specularMap:Me,specularColorMap:De,specularIntensityMap:ke,transmission:q,transmissionMap:Qe,thicknessMap:z,gradientMap:Se,opaque:x.transparent===!1&&x.blending===zi&&x.alphaToCoverage===!1,alphaMap:ae,alphaTest:L,alphaHash:H,combine:x.combine,mapUv:nt&&g(x.map.channel),aoMapUv:lt&&g(x.aoMap.channel),lightMapUv:mt&&g(x.lightMap.channel),bumpMapUv:it&&g(x.bumpMap.channel),normalMapUv:Mt&&g(x.normalMap.channel),displacementMapUv:Lt&&g(x.displacementMap.channel),emissiveMapUv:kt&&g(x.emissiveMap.channel),metalnessMapUv:wt&&g(x.metalnessMap.channel),roughnessMapUv:Ut&&g(x.roughnessMap.channel),anisotropyMapUv:ee&&g(x.anisotropyMap.channel),clearcoatMapUv:me&&g(x.clearcoatMap.channel),clearcoatNormalMapUv:ye&&g(x.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:se&&g(x.clearcoatRoughnessMap.channel),iridescenceMapUv:ce&&g(x.iridescenceMap.channel),iridescenceThicknessMapUv:ve&&g(x.iridescenceThicknessMap.channel),sheenColorMapUv:Be&&g(x.sheenColorMap.channel),sheenRoughnessMapUv:xe&&g(x.sheenRoughnessMap.channel),specularMapUv:Me&&g(x.specularMap.channel),specularColorMapUv:De&&g(x.specularColorMap.channel),specularIntensityMapUv:ke&&g(x.specularIntensityMap.channel),transmissionMapUv:Qe&&g(x.transmissionMap.channel),thicknessMapUv:z&&g(x.thicknessMap.channel),alphaMapUv:ae&&g(x.alphaMap.channel),vertexTangents:!!J.attributes.tangent&&(Mt||k),vertexNormals:!!J.attributes.normal,vertexColors:x.vertexColors,vertexAlphas:x.vertexColors===!0&&!!J.attributes.color&&J.attributes.color.itemSize===4,pointsUvs:V.isPoints===!0&&!!J.attributes.uv&&(nt||ae),fog:!!B,useFog:x.fog===!0,fogExp2:!!B&&B.isFogExp2,flatShading:x.wireframe===!1&&(x.flatShading===!0||J.attributes.normal===void 0&&Mt===!1&&(x.isMeshLambertMaterial||x.isMeshPhongMaterial||x.isMeshStandardMaterial||x.isMeshPhysicalMaterial)),sizeAttenuation:x.sizeAttenuation===!0,logarithmicDepthBuffer:p,reversedDepthBuffer:Ae,skinning:V.isSkinnedMesh===!0,hasPositionAttribute:J.attributes.position!==void 0,morphTargets:J.morphAttributes.position!==void 0,morphNormals:J.morphAttributes.normal!==void 0,morphColors:J.morphAttributes.color!==void 0,morphTargetsCount:Ve,morphTextureStride:Ie,numSunLights:w.sun.length,numDirLights:w.directional.length,numPointLights:w.point.length,numSpotLights:w.spot.length,numSpotLightMaps:w.spotLightMap.length,numRectAreaLights:w.rectArea.length,numHemiLights:w.hemi.length,numSunLightShadows:w.sunShadowMap.length,numDirLightShadows:w.directionalShadowMap.length,numPointLightShadows:w.pointShadowMap.length,numSpotLightShadows:w.spotShadowMap.length,numSpotLightShadowsWithMaps:w.numSpotLightShadowsWithMaps,numLightProbes:w.numLightProbes,numLightProbeGrids:W.length,numClippingPlanes:r.numPlanes,numClipIntersection:r.numIntersection,dithering:x.dithering,shadowMapEnabled:i.shadowMap.enabled&&R.length>0,shadowMapType:i.shadowMap.type,toneMapping:D,decodeVideoTexture:nt&&x.map.isVideoTexture===!0&&dt.getTransfer(x.map.colorSpace)===Tt,decodeVideoTextureEmissive:kt&&x.emissiveMap.isVideoTexture===!0&&dt.getTransfer(x.emissiveMap.colorSpace)===Tt,premultipliedAlpha:x.premultipliedAlpha,doubleSided:x.side===Ht,flipSided:x.side===cn,useDepthPacking:x.depthPacking>=0,depthPacking:x.depthPacking||0,index0AttributeName:x.index0AttributeName,extensionClipCullDistance:A&&x.extensions.clipCullDistance===!0&&t.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(A&&x.extensions.multiDraw===!0||Re)&&t.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:t.has("KHR_parallel_shader_compile"),customProgramCacheKey:x.customProgramCacheKey()};return N.vertexUv1s=c.has(1),N.vertexUv2s=c.has(2),N.vertexUv3s=c.has(3),c.clear(),N}function m(x){let w=[];if(x.shaderID?w.push(x.shaderID):(w.push(x.customVertexShaderID),w.push(x.customFragmentShaderID)),x.defines!==void 0)for(let R in x.defines)w.push(R),w.push(x.defines[R]);return x.isRawShaderMaterial===!1&&(d(w,x),S(w,x),w.push(i.outputColorSpace)),w.push(x.customProgramCacheKey),w.join()}function d(x,w){x.push(w.precision),x.push(w.outputColorSpace),x.push(w.envMapMode),x.push(w.envMapCubeUVHeight),x.push(w.mapUv),x.push(w.alphaMapUv),x.push(w.lightMapUv),x.push(w.aoMapUv),x.push(w.bumpMapUv),x.push(w.normalMapUv),x.push(w.displacementMapUv),x.push(w.emissiveMapUv),x.push(w.metalnessMapUv),x.push(w.roughnessMapUv),x.push(w.anisotropyMapUv),x.push(w.clearcoatMapUv),x.push(w.clearcoatNormalMapUv),x.push(w.clearcoatRoughnessMapUv),x.push(w.iridescenceMapUv),x.push(w.iridescenceThicknessMapUv),x.push(w.sheenColorMapUv),x.push(w.sheenRoughnessMapUv),x.push(w.specularMapUv),x.push(w.specularColorMapUv),x.push(w.specularIntensityMapUv),x.push(w.transmissionMapUv),x.push(w.thicknessMapUv),x.push(w.combine),x.push(w.fogExp2),x.push(w.sizeAttenuation),x.push(w.morphTargetsCount),x.push(w.morphAttributeCount),x.push(w.numSunLights),x.push(w.numDirLights),x.push(w.numPointLights),x.push(w.numSpotLights),x.push(w.numSpotLightMaps),x.push(w.numHemiLights),x.push(w.numRectAreaLights),x.push(w.numSunLightShadows),x.push(w.numDirLightShadows),x.push(w.numPointLightShadows),x.push(w.numSpotLightShadows),x.push(w.numSpotLightShadowsWithMaps),x.push(w.numLightProbes),x.push(w.shadowMapType),x.push(w.toneMapping),x.push(w.numClippingPlanes),x.push(w.numClipIntersection),x.push(w.depthPacking)}function S(x,w){a.disableAll(),w.instancing&&a.enable(0),w.instancingColor&&a.enable(1),w.instancingMorph&&a.enable(2),w.matcap&&a.enable(3),w.envMap&&a.enable(4),w.normalMapObjectSpace&&a.enable(5),w.normalMapTangentSpace&&a.enable(6),w.clearcoat&&a.enable(7),w.iridescence&&a.enable(8),w.alphaTest&&a.enable(9),w.vertexColors&&a.enable(10),w.vertexAlphas&&a.enable(11),w.vertexUv1s&&a.enable(12),w.vertexUv2s&&a.enable(13),w.vertexUv3s&&a.enable(14),w.vertexTangents&&a.enable(15),w.anisotropy&&a.enable(16),w.alphaHash&&a.enable(17),w.batching&&a.enable(18),w.dispersion&&a.enable(19),w.retroreflection&&a.enable(24),w.batchingColor&&a.enable(20),w.gradientMap&&a.enable(21),w.packedNormalMap&&a.enable(22),w.vertexNormals&&a.enable(23),x.push(a.mask),a.disableAll(),w.fog&&a.enable(0),w.useFog&&a.enable(1),w.flatShading&&a.enable(2),w.logarithmicDepthBuffer&&a.enable(3),w.reversedDepthBuffer&&a.enable(4),w.skinning&&a.enable(5),w.morphTargets&&a.enable(6),w.morphNormals&&a.enable(7),w.morphColors&&a.enable(8),w.premultipliedAlpha&&a.enable(9),w.shadowMapEnabled&&a.enable(10),w.doubleSided&&a.enable(11),w.flipSided&&a.enable(12),w.useDepthPacking&&a.enable(13),w.dithering&&a.enable(14),w.transmission&&a.enable(15),w.sheen&&a.enable(16),w.opaque&&a.enable(17),w.pointsUvs&&a.enable(18),w.decodeVideoTexture&&a.enable(19),w.decodeVideoTextureEmissive&&a.enable(20),w.alphaToCoverage&&a.enable(21),w.numLightProbeGrids>0&&a.enable(22),w.hasPositionAttribute&&a.enable(23),x.push(a.mask)}function E(x){let w=f[x.type],R;if(w){let O=ri[w];R=yu.clone(O.uniforms)}else R=x.uniforms;return R}function y(x,w){let R=u.get(w);return R!==void 0?++R.usedTimes:(R=new g0(i,w,x,s),l.push(R),u.set(w,R)),R}function b(x){if(--x.usedTimes===0){let w=l.indexOf(x);l[w]=l[l.length-1],l.pop(),u.delete(x.cacheKey),x.destroy()}}function T(x){o.remove(x)}function I(){o.dispose()}return{getParameters:v,getProgramCacheKey:m,getUniforms:E,acquireProgram:y,releaseProgram:b,releaseShaderCache:T,programs:l,dispose:I}}function v0(){let i=new WeakMap;function e(a){return i.has(a)}function t(a){let o=i.get(a);return o===void 0&&(o={},i.set(a,o)),o}function n(a){i.delete(a)}function s(a,o,c){i.get(a)[o]=c}function r(){i=new WeakMap}return{has:e,get:t,remove:n,update:s,dispose:r}}function M0(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.material.id!==e.material.id?i.material.id-e.material.id:i.materialVariant!==e.materialVariant?i.materialVariant-e.materialVariant:i.z!==e.z?i.z-e.z:i.id-e.id}function zu(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.z!==e.z?e.z-i.z:i.id-e.id}function Gu(){let i=[],e=0,t=[],n=[],s=[];function r(){e=0,t.length=0,n.length=0,s.length=0}function a(h){let f=0;return h.isInstancedMesh&&(f+=2),h.isSkinnedMesh&&(f+=1),f}function o(h,f,g,v,m,d){let S=i[e];return S===void 0?(S={id:h.id,object:h,geometry:f,material:g,materialVariant:a(h),groupOrder:v,renderOrder:h.renderOrder,z:m,group:d},i[e]=S):(S.id=h.id,S.object=h,S.geometry=f,S.material=g,S.materialVariant=a(h),S.groupOrder=v,S.renderOrder=h.renderOrder,S.z=m,S.group=d),e++,S}function c(h,f,g,v,m,d,S){S.reversedDepth===!0&&(m=-m);let E=o(h,f,g,v,m,d);g.transmission>0?n.push(E):g.transparent===!0?s.push(E):t.push(E)}function l(h,f,g,v,m,d){let S=o(h,f,g,v,m,d);g.transmission>0?n.unshift(S):g.transparent===!0?s.unshift(S):t.unshift(S)}function u(h,f){t.length>1&&t.sort(h||M0),n.length>1&&n.sort(f||zu),s.length>1&&s.sort(f||zu)}function p(){for(let h=e,f=i.length;h<f;h++){let g=i[h];if(g.id===null)break;g.id=null,g.object=null,g.geometry=null,g.material=null,g.group=null}}return{opaque:t,transmissive:n,transparent:s,init:r,push:c,unshift:l,finish:p,sort:u}}function S0(){let i=new WeakMap;function e(n,s){let r=i.get(n),a;return r===void 0?(a=new Gu,i.set(n,[a])):s>=r.length?(a=new Gu,r.push(a)):a=r[s],a}function t(){i=new WeakMap}return{get:e,dispose:t}}function b0(){let i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"SunLight":case"DirectionalLight":t={direction:new P,color:new We};break;case"SpotLight":t={position:new P,direction:new P,color:new We,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new P,color:new We,distance:0,decay:0};break;case"HemisphereLight":t={direction:new P,skyColor:new We,groundColor:new We};break;case"RectAreaLight":t={color:new We,position:new P,halfWidth:new P,halfHeight:new P};break}return i[e.id]=t,t}}}function T0(){let i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"SunLight":case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Pe};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Pe};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Pe,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[e.id]=t,t}}}var w0=0;function A0(i,e){return(e.castShadow?2:0)-(i.castShadow?2:0)+(e.map?1:0)-(i.map?1:0)}function E0(i){let e=new b0,t=T0(),n={version:0,hash:{sunLength:-1,directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numSunShadows:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],sun:[],sunShadow:[],sunShadowMap:[],sunShadowMatrix:[],sunShadowCascade:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let l=0;l<9;l++)n.probe.push(new P);let s=new P,r=new gt,a=new gt;function o(l){let u=0,p=0,h=0;for(let V=0;V<9;V++)n.probe[V].set(0,0,0);let f=0,g=0,v=0,m=0,d=0,S=0,E=0,y=0,b=0,T=0,I=0,x=0,w=0,R=0;l.sort(A0);for(let V=0,W=l.length;V<W;V++){let B=l[V],J=B.color,ne=B.intensity,ie=B.distance,de=null;if(B.shadow&&B.shadow.map&&(B.shadow.map.texture.format===Hi?de=B.shadow.map.texture:de=B.shadow.map.depthTexture||B.shadow.map.texture),B.isAmbientLight)u+=J.r*ne,p+=J.g*ne,h+=J.b*ne;else if(B.isLightProbe){for(let j=0;j<9;j++)n.probe[j].addScaledVector(B.sh.coefficients[j],ne);R++}else if(B.isSunLight){let j=e.get(B);if(j.color.copy(B.color).multiplyScalar(B.intensity),B.castShadow){let oe=B.shadow,ue=t.get(B);ue.shadowIntensity=oe.intensity,ue.shadowBias=oe.bias,ue.shadowNormalBias=oe.normalBias,ue.shadowRadius=oe.radius,ue.shadowMapSize.copy(oe.mapSize).multiply(oe.getFrameExtents()),n.sunShadow[g]=ue,n.sunShadowMap[g]=de;let Ve=oe.getViewportCount();for(let Ie=0;Ie<Ve;Ie++)n.sunShadowMatrix[v+Ie]=oe.getMatrix(Ie),n.sunShadowCascade[v+Ie]=oe._cascadeData[Ie];v+=Ve,g++}n.sun[f]=j,f++}else if(B.isDirectionalLight){let j=e.get(B);if(j.color.copy(B.color).multiplyScalar(B.intensity),B.castShadow){let oe=B.shadow,ue=t.get(B);ue.shadowIntensity=oe.intensity,ue.shadowBias=oe.bias,ue.shadowNormalBias=oe.normalBias,ue.shadowRadius=oe.radius,ue.shadowMapSize=oe.mapSize,n.directionalShadow[m]=ue,n.directionalShadowMap[m]=de,n.directionalShadowMatrix[m]=B.shadow.matrix,b++}n.directional[m]=j,m++}else if(B.isSpotLight){let j=e.get(B);j.position.setFromMatrixPosition(B.matrixWorld),j.color.copy(J).multiplyScalar(ne),j.distance=ie,j.coneCos=Math.cos(B.angle),j.penumbraCos=Math.cos(B.angle*(1-B.penumbra)),j.decay=B.decay,n.spot[S]=j;let oe=B.shadow;if(B.map&&(n.spotLightMap[x]=B.map,x++,oe.updateMatrices(B),B.castShadow&&w++),n.spotLightMatrix[S]=oe.matrix,B.castShadow){let ue=t.get(B);ue.shadowIntensity=oe.intensity,ue.shadowBias=oe.bias,ue.shadowNormalBias=oe.normalBias,ue.shadowRadius=oe.radius,ue.shadowMapSize=oe.mapSize,n.spotShadow[S]=ue,n.spotShadowMap[S]=de,I++}S++}else if(B.isRectAreaLight){let j=e.get(B);j.color.copy(J).multiplyScalar(ne),j.halfWidth.set(B.width*.5,0,0),j.halfHeight.set(0,B.height*.5,0),n.rectArea[E]=j,E++}else if(B.isPointLight){let j=e.get(B);if(j.color.copy(B.color).multiplyScalar(B.intensity),j.distance=B.distance,j.decay=B.decay,B.castShadow){let oe=B.shadow,ue=t.get(B);ue.shadowIntensity=oe.intensity,ue.shadowBias=oe.bias,ue.shadowNormalBias=oe.normalBias,ue.shadowRadius=oe.radius,ue.shadowMapSize=oe.mapSize,ue.shadowCameraNear=oe.camera.near,ue.shadowCameraFar=oe.camera.far,n.pointShadow[d]=ue,n.pointShadowMap[d]=de,n.pointShadowMatrix[d]=B.shadow.matrix,T++}n.point[d]=j,d++}else if(B.isHemisphereLight){let j=e.get(B);j.skyColor.copy(B.color).multiplyScalar(ne),j.groundColor.copy(B.groundColor).multiplyScalar(ne),n.hemi[y]=j,y++}}E>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=we.LTC_FLOAT_1,n.rectAreaLTC2=we.LTC_FLOAT_2):(n.rectAreaLTC1=we.LTC_HALF_1,n.rectAreaLTC2=we.LTC_HALF_2)),n.ambient[0]=u,n.ambient[1]=p,n.ambient[2]=h;let O=n.hash;(O.sunLength!==f||O.directionalLength!==m||O.pointLength!==d||O.spotLength!==S||O.rectAreaLength!==E||O.hemiLength!==y||O.numSunShadows!==g||O.numDirectionalShadows!==b||O.numPointShadows!==T||O.numSpotShadows!==I||O.numSpotMaps!==x||O.numLightProbes!==R)&&(n.sun.length=f,n.directional.length=m,n.spot.length=S,n.rectArea.length=E,n.point.length=d,n.hemi.length=y,n.sunShadow.length=g,n.sunShadowMap.length=g,n.sunShadowMatrix.length=v,n.sunShadowCascade.length=v,n.directionalShadow.length=b,n.directionalShadowMap.length=b,n.directionalShadowMatrix.length=b,n.pointShadow.length=T,n.pointShadowMap.length=T,n.pointShadowMatrix.length=T,n.spotShadow.length=I,n.spotShadowMap.length=I,n.spotLightMatrix.length=I+x-w,n.spotLightMap.length=x,n.numSpotLightShadowsWithMaps=w,n.numLightProbes=R,O.sunLength=f,O.directionalLength=m,O.pointLength=d,O.spotLength=S,O.rectAreaLength=E,O.hemiLength=y,O.numSunShadows=g,O.numDirectionalShadows=b,O.numPointShadows=T,O.numSpotShadows=I,O.numSpotMaps=x,O.numLightProbes=R,n.version=w0++)}function c(l,u){let p=0,h=0,f=0,g=0,v=0,m=0,d=u.matrixWorldInverse;for(let S=0,E=l.length;S<E;S++){let y=l[S];if(y.isSunLight){let b=n.sun[p];b.direction.setFromMatrixPosition(y.matrixWorld),b.direction.transformDirection(d),p++}else if(y.isDirectionalLight){let b=n.directional[h];b.direction.setFromMatrixPosition(y.matrixWorld),s.setFromMatrixPosition(y.target.matrixWorld),b.direction.sub(s),b.direction.transformDirection(d),h++}else if(y.isSpotLight){let b=n.spot[g];b.position.setFromMatrixPosition(y.matrixWorld),b.position.applyMatrix4(d),b.direction.setFromMatrixPosition(y.matrixWorld),s.setFromMatrixPosition(y.target.matrixWorld),b.direction.sub(s),b.direction.transformDirection(d),g++}else if(y.isRectAreaLight){let b=n.rectArea[v];b.position.setFromMatrixPosition(y.matrixWorld),b.position.applyMatrix4(d),a.identity(),r.copy(y.matrixWorld),r.premultiply(d),a.extractRotation(r),b.halfWidth.set(y.width*.5,0,0),b.halfHeight.set(0,y.height*.5,0),b.halfWidth.applyMatrix4(a),b.halfHeight.applyMatrix4(a),v++}else if(y.isPointLight){let b=n.point[f];b.position.setFromMatrixPosition(y.matrixWorld),b.position.applyMatrix4(d),f++}else if(y.isHemisphereLight){let b=n.hemi[m];b.direction.setFromMatrixPosition(y.matrixWorld),b.direction.transformDirection(d),m++}}}return{setup:o,setupView:c,state:n}}function Vu(i){let e=new E0(i),t=[],n=[],s=[];function r(h){p.camera=h,t.length=0,n.length=0,s.length=0}function a(h){t.push(h)}function o(h){n.push(h)}function c(h){s.push(h)}function l(){e.setup(t)}function u(h){e.setupView(t,h)}let p={lightsArray:t,shadowsArray:n,lightProbeGridArray:s,camera:null,lights:e,transmissionRenderTarget:{},textureUnits:0};return{init:r,state:p,setupLights:l,setupLightsView:u,pushLight:a,pushShadow:o,pushLightProbeGrid:c}}function C0(i){let e=new WeakMap;function t(s,r=0){let a=e.get(s),o;return a===void 0?(o=new Vu(i),e.set(s,[o])):r>=a.length?(o=new Vu(i),a.push(o)):o=a[r],o}function n(){e=new WeakMap}return{get:t,dispose:n}}var R0=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,P0=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ).rg;
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ).r;
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( max( 0.0, squared_mean - mean * mean ) );
	gl_FragColor = vec4( mean, std_dev, 0.0, 1.0 );
}`,I0=[new P(1,0,0),new P(-1,0,0),new P(0,1,0),new P(0,-1,0),new P(0,0,1),new P(0,0,-1)],L0=[new P(0,-1,0),new P(0,-1,0),new P(0,0,1),new P(0,0,-1),new P(0,-1,0),new P(0,-1,0)],ku=new gt,Yr=new P,Nc=new P;function D0(i,e,t){let n=new Us,s=new Pe,r=new Pe,a=new Gt,o=new Qa,c=new ja,l={},u=t.maxTextureSize,p={[Oi]:cn,[cn]:Oi,[Ht]:Ht},h=new vn({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Pe},radius:{value:4}},vertexShader:R0,fragmentShader:P0}),f=h.clone();f.defines.HORIZONTAL_PASS=1;let g=new Rt;g.setAttribute("position",new Yt(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let v=new Xe(g,h),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=ns;let d=this.type;this.render=function(T,I,x){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||T.length===0)return;this.type===Fh&&(qe("WebGLShadowMap: PCFSoftShadowMap has been removed. Using PCFShadowMap instead."),this.type=ns);let w=i.getRenderTarget(),R=i.getActiveCubeFace(),O=i.getActiveMipmapLevel(),V=i.state;V.setBlending(ii),V.buffers.depth.getReversed()===!0?V.buffers.color.setClear(0,0,0,0):V.buffers.color.setClear(1,1,1,1),V.buffers.depth.setTest(!0),V.setScissorTest(!1);let W=d!==this.type;W&&I.traverse(function(B){B.material&&(Array.isArray(B.material)?B.material.forEach(J=>J.needsUpdate=!0):B.material.needsUpdate=!0)});for(let B=0,J=T.length;B<J;B++){let ne=T[B],ie=ne.shadow;if(ie===void 0){qe("WebGLShadowMap:",ne,"has no shadow.");continue}if(ie.autoUpdate===!1&&ie.needsUpdate===!1)continue;s.copy(ie.mapSize);let de=ie.getFrameExtents();s.multiply(de),r.copy(ie.mapSize),(s.x>u||s.y>u)&&(s.x>u&&(r.x=Math.floor(u/de.x),s.x=r.x*de.x,ie.mapSize.x=r.x),s.y>u&&(r.y=Math.floor(u/de.y),s.y=r.y*de.y,ie.mapSize.y=r.y));let j=i.state.buffers.depth.getReversed();if(ie.camera._reversedDepth=j,ie.map===null||W===!0){if(ie.map!==null&&(ie.map.depthTexture!==null&&(ie.map.depthTexture.dispose(),ie.map.depthTexture=null),ie.map.dispose()),this.type===Vs){if(ne.isPointLight){qe("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}ie.map=new Mn(s.x,s.y,{format:Hi,type:Yn,minFilter:ln,magFilter:ln,generateMipmaps:!1}),ie.map.texture.name=ne.name+".shadowMap",ie.map.depthTexture=new Ni(s.x,s.y,Ln),ie.map.depthTexture.name=ne.name+".shadowMapDepth",ie.map.depthTexture.format=Qn,ie.map.depthTexture.compareFunction=null,ie.map.depthTexture.minFilter=on,ie.map.depthTexture.magFilter=on}else ne.isPointLight?(ie.map=new ol(s.x),ie.map.depthTexture=new Ha(s.x,qn)):(ie.map=new Mn(s.x,s.y),ie.map.depthTexture=new Ni(s.x,s.y,qn)),ie.map.depthTexture.name=ne.name+".shadowMap",ie.map.depthTexture.format=Qn,this.type===ns?(ie.map.depthTexture.compareFunction=j?il:nl,ie.map.depthTexture.minFilter=ln,ie.map.depthTexture.magFilter=ln):(ie.map.depthTexture.compareFunction=null,ie.map.depthTexture.minFilter=on,ie.map.depthTexture.magFilter=on);ie.camera.updateProjectionMatrix()}ie.map.isWebGLCubeRenderTarget!==!0&&(ie.map.width!==s.x||ie.map.height!==s.y)&&ie.map.setSize(s.x,s.y);let oe=ie.map.isWebGLCubeRenderTarget?6:ie.getViewportCount();ne.isPointLight!==!0&&ie.updateMatrices(ne,x);for(let ue=0;ue<oe;ue++){let Ve=ie.getCamera(ue);if(ne.isPointLight){let Ie=ie.camera,pt=ie.matrix,tt=ne.distance||Ie.far;tt!==Ie.far&&(Ie.far=tt,Ie.updateProjectionMatrix()),Yr.setFromMatrixPosition(ne.matrixWorld),Ie.position.copy(Yr),Nc.copy(Ie.position),Nc.add(I0[ue]),Ie.up.copy(L0[ue]),Ie.lookAt(Nc),Ie.updateMatrixWorld(),pt.makeTranslation(-Yr.x,-Yr.y,-Yr.z),ku.multiplyMatrices(Ie.projectionMatrix,Ie.matrixWorldInverse),ie._frustum.setFromProjectionMatrix(ku,Ie.coordinateSystem,Ie.reversedDepth)}if(ie.map.isWebGLCubeRenderTarget)i.setRenderTarget(ie.map,ue),i.clear();else{ue===0&&(i.setRenderTarget(ie.map),i.clear());let Ie=ie.getViewport(ue);a.set(r.x*Ie.x,r.y*Ie.y,r.x*Ie.z,r.y*Ie.w),V.viewport(a)}n=ie.getFrustum(ue),y(I,x,Ve,ne,this.type)}ie.isPointLightShadow!==!0&&this.type===Vs&&S(ie,x),ie.needsUpdate=!1}d=this.type,m.needsUpdate=!1,i.setRenderTarget(w,R,O)};function S(T,I){let x=e.update(v);h.defines.VSM_SAMPLES!==T.blurSamples&&(h.defines.VSM_SAMPLES=T.blurSamples,f.defines.VSM_SAMPLES=T.blurSamples,h.needsUpdate=!0,f.needsUpdate=!0),T.mapPass===null?T.mapPass=new Mn(s.x,s.y,{format:Hi,type:Yn}):(T.mapPass.width!==T.map.width||T.mapPass.height!==T.map.height)&&T.mapPass.setSize(T.map.width,T.map.height),h.uniforms.shadow_pass.value=T.map.depthTexture,h.uniforms.resolution.value.set(T.map.width,T.map.height),h.uniforms.radius.value=T.radius,i.setRenderTarget(T.mapPass),i.clear(),i.renderBufferDirect(I,null,x,h,v,null),f.uniforms.shadow_pass.value=T.mapPass.texture,f.uniforms.resolution.value.set(T.map.width,T.map.height),f.uniforms.radius.value=T.radius,i.setRenderTarget(T.map),i.clear(),i.renderBufferDirect(I,null,x,f,v,null)}function E(T,I,x,w){let R=null,O=x.isPointLight===!0?T.customDistanceMaterial:T.customDepthMaterial;if(O!==void 0)R=O;else if(R=x.isPointLight===!0?c:o,i.localClippingEnabled&&I.clipShadows===!0&&Array.isArray(I.clippingPlanes)&&I.clippingPlanes.length!==0||I.displacementMap&&I.displacementScale!==0||I.alphaMap&&I.alphaTest>0||I.map&&I.alphaTest>0||I.alphaToCoverage===!0){let V=R.uuid,W=I.uuid,B=l[V];B===void 0&&(B={},l[V]=B);let J=B[W];J===void 0&&(J=R.clone(),B[W]=J,I.addEventListener("dispose",b)),R=J}if(R.visible=I.visible,R.wireframe=I.wireframe,w===Vs?R.side=I.shadowSide!==null?I.shadowSide:I.side:R.side=I.shadowSide!==null?I.shadowSide:p[I.side],R.alphaMap=I.alphaMap,R.alphaTest=I.alphaToCoverage===!0?.5:I.alphaTest,R.map=I.map,R.clipShadows=I.clipShadows,R.clippingPlanes=I.clippingPlanes,R.clipIntersection=I.clipIntersection,R.displacementMap=I.displacementMap,R.displacementScale=I.displacementScale,R.displacementBias=I.displacementBias,R.wireframeLinewidth=I.wireframeLinewidth,R.linewidth=I.linewidth,x.isPointLight===!0&&R.isMeshDistanceMaterial===!0){let V=i.properties.get(R);V.light=x}return R}function y(T,I,x,w,R){if(T.visible===!1)return;if(T.layers.test(I.layers)&&(T.isMesh||T.isLine||T.isPoints)&&(T.castShadow||T.receiveShadow&&R===Vs)&&(!T.frustumCulled||T.intersectsFrustum(n))){T.modelViewMatrix.multiplyMatrices(x.matrixWorldInverse,T.matrixWorld);let W=e.update(T),B=T.material;if(Array.isArray(B)){let J=W.groups;for(let ne=0,ie=J.length;ne<ie;ne++){let de=J[ne],j=B[de.materialIndex];if(j&&j.visible){let oe=E(T,j,w,R);T.onBeforeShadow(i,T,I,x,W,oe,de),i.renderBufferDirect(x,null,W,oe,T,de),T.onAfterShadow(i,T,I,x,W,oe,de)}}}else if(B.visible){let J=E(T,B,w,R);T.onBeforeShadow(i,T,I,x,W,J,null),i.renderBufferDirect(x,null,W,J,T,null),T.onAfterShadow(i,T,I,x,W,J,null)}}let V=T.children;for(let W=0,B=V.length;W<B;W++)y(V[W],I,x,w,R)}function b(T){T.target.removeEventListener("dispose",b);for(let x in l){let w=l[x],R=T.target.uuid;R in w&&(w[R].dispose(),delete w[R])}}}function N0(i,e){function t(){let z=!1,Se=new Gt,ae=null,L=new Gt(0,0,0,0);return{setMask:function(H){ae!==H&&!z&&(i.colorMask(H,H,H,H),ae=H)},setLocked:function(H){z=H},setClear:function(H,A,D,N,F){F===!0&&(H*=N,A*=N,D*=N),Se.set(H,A,D,N),L.equals(Se)===!1&&(i.clearColor(H,A,D,N),L.copy(Se))},reset:function(){z=!1,ae=null,L.set(-1,0,0,0)}}}function n(){let z=!1,Se=!1,ae=null,L=null,H=null;return{setReversed:function(A){if(Se!==A){let D=e.get("EXT_clip_control");A?D.clipControlEXT(D.LOWER_LEFT_EXT,D.ZERO_TO_ONE_EXT):D.clipControlEXT(D.LOWER_LEFT_EXT,D.NEGATIVE_ONE_TO_ONE_EXT),Se=A;let N=H;H=null,this.setClear(N)}},getReversed:function(){return Se},setTest:function(A){A?le(i.DEPTH_TEST):Ae(i.DEPTH_TEST)},setMask:function(A){ae!==A&&!z&&(i.depthMask(A),ae=A)},setFunc:function(A){if(Se&&(A=gu[A]),L!==A){switch(A){case Ea:i.depthFunc(i.NEVER);break;case Ca:i.depthFunc(i.ALWAYS);break;case Ra:i.depthFunc(i.LESS);break;case Rs:i.depthFunc(i.LEQUAL);break;case Pa:i.depthFunc(i.EQUAL);break;case Ia:i.depthFunc(i.GEQUAL);break;case La:i.depthFunc(i.GREATER);break;case Da:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}L=A}},setLocked:function(A){z=A},setClear:function(A){H!==A&&(H=A,Se&&(A=1-A),i.clearDepth(A))},reset:function(){z=!1,ae=null,L=null,H=null,Se=!1}}}function s(){let z=!1,Se=null,ae=null,L=null,H=null,A=null,D=null,N=null,F=null;return{setTest:function(Q){z||(Q?le(i.STENCIL_TEST):Ae(i.STENCIL_TEST))},setMask:function(Q){Se!==Q&&!z&&(i.stencilMask(Q),Se=Q)},setFunc:function(Q,_e,be){(ae!==Q||L!==_e||H!==be)&&(i.stencilFunc(Q,_e,be),ae=Q,L=_e,H=be)},setOp:function(Q,_e,be){(A!==Q||D!==_e||N!==be)&&(i.stencilOp(Q,_e,be),A=Q,D=_e,N=be)},setLocked:function(Q){z=Q},setClear:function(Q){F!==Q&&(i.clearStencil(Q),F=Q)},reset:function(){z=!1,Se=null,ae=null,L=null,H=null,A=null,D=null,N=null,F=null}}}let r=new t,a=new n,o=new s,c=new WeakMap,l=new WeakMap,u={},p={},h={},f=new WeakMap,g=[],v=null,m=!1,d=null,S=null,E=null,y=null,b=null,T=null,I=null,x=new We(0,0,0),w=0,R=!1,O=null,V=null,W=null,B=null,J=null,ne=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS),ie=!1,de=0,j=i.getParameter(i.VERSION);j.indexOf("WebGL")!==-1?(de=parseFloat(/^WebGL (\d)/.exec(j)[1]),ie=de>=1):j.indexOf("OpenGL ES")!==-1&&(de=parseFloat(/^OpenGL ES (\d)/.exec(j)[1]),ie=de>=2);let oe=null,ue={},Ve=i.getParameter(i.SCISSOR_BOX),Ie=i.getParameter(i.VIEWPORT),pt=new Gt().fromArray(Ve),tt=new Gt().fromArray(Ie);function rt(z,Se,ae,L){let H=new Uint8Array(4),A=i.createTexture();i.bindTexture(z,A),i.texParameteri(z,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(z,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let D=0;D<ae;D++)z===i.TEXTURE_3D||z===i.TEXTURE_2D_ARRAY?i.texImage3D(Se,0,i.RGBA,1,1,L,0,i.RGBA,i.UNSIGNED_BYTE,H):i.texImage2D(Se+D,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,H);return A}let te={};te[i.TEXTURE_2D]=rt(i.TEXTURE_2D,i.TEXTURE_2D,1),te[i.TEXTURE_CUBE_MAP]=rt(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),te[i.TEXTURE_2D_ARRAY]=rt(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),te[i.TEXTURE_3D]=rt(i.TEXTURE_3D,i.TEXTURE_3D,1,1),r.setClear(0,0,0,1),a.setClear(1),o.setClear(0),le(i.DEPTH_TEST),a.setFunc(Rs),it(!1),Mt(Ql),le(i.CULL_FACE),lt(ii);function le(z){u[z]!==!0&&(i.enable(z),u[z]=!0)}function Ae(z){u[z]!==!1&&(i.disable(z),u[z]=!1)}function Je(z,Se){return h[z]!==Se?(i.bindFramebuffer(z,Se),h[z]=Se,z===i.DRAW_FRAMEBUFFER&&(h[i.FRAMEBUFFER]=Se),z===i.FRAMEBUFFER&&(h[i.DRAW_FRAMEBUFFER]=Se),!0):!1}function Re(z,Se){let ae=g,L=!1;if(z){ae=f.get(Se),ae===void 0&&(ae=[],f.set(Se,ae));let H=z.textures;if(ae.length!==H.length||ae[0]!==i.COLOR_ATTACHMENT0){for(let A=0,D=H.length;A<D;A++)ae[A]=i.COLOR_ATTACHMENT0+A;ae.length=H.length,L=!0}}else ae[0]!==i.BACK&&(ae[0]=i.BACK,L=!0);L&&i.drawBuffers(ae)}function nt(z){return v!==z?(i.useProgram(z),v=z,!0):!1}let It={[is]:i.FUNC_ADD,[Oh]:i.FUNC_SUBTRACT,[zh]:i.FUNC_REVERSE_SUBTRACT};It[Gh]=i.MIN,It[Vh]=i.MAX;let Ke={[kh]:i.ZERO,[Hh]:i.ONE,[Wh]:i.SRC_COLOR,[tc]:i.SRC_ALPHA,[$h]:i.SRC_ALPHA_SATURATE,[Zh]:i.DST_COLOR,[qh]:i.DST_ALPHA,[Xh]:i.ONE_MINUS_SRC_COLOR,[nc]:i.ONE_MINUS_SRC_ALPHA,[Jh]:i.ONE_MINUS_DST_COLOR,[Yh]:i.ONE_MINUS_DST_ALPHA,[Kh]:i.CONSTANT_COLOR,[Qh]:i.ONE_MINUS_CONSTANT_COLOR,[jh]:i.CONSTANT_ALPHA,[eu]:i.ONE_MINUS_CONSTANT_ALPHA};function lt(z,Se,ae,L,H,A,D,N,F,Q){if(z===ii){m===!0&&(Ae(i.BLEND),m=!1);return}if(m===!1&&(le(i.BLEND),m=!0),z!==Bh){if(z!==d||Q!==R){if((S!==is||b!==is)&&(i.blendEquation(i.FUNC_ADD),S=is,b=is),Q)switch(z){case zi:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case jt:i.blendFunc(i.ONE,i.ONE);break;case jl:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case ec:i.blendFuncSeparate(i.DST_COLOR,i.ONE_MINUS_SRC_ALPHA,i.ZERO,i.ONE);break;default:Ze("WebGLState: Invalid blending: ",z);break}else switch(z){case zi:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case jt:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE,i.ONE,i.ONE);break;case jl:Ze("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case ec:Ze("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:Ze("WebGLState: Invalid blending: ",z);break}E=null,y=null,T=null,I=null,x.set(0,0,0),w=0,d=z,R=Q}return}H=H||Se,A=A||ae,D=D||L,(Se!==S||H!==b)&&(i.blendEquationSeparate(It[Se],It[H]),S=Se,b=H),(ae!==E||L!==y||A!==T||D!==I)&&(i.blendFuncSeparate(Ke[ae],Ke[L],Ke[A],Ke[D]),E=ae,y=L,T=A,I=D),(N.equals(x)===!1||F!==w)&&(i.blendColor(N.r,N.g,N.b,F),x.copy(N),w=F),d=z,R=!1}function mt(z,Se){z.side===Ht?Ae(i.CULL_FACE):le(i.CULL_FACE);let ae=z.side===cn;Se&&(ae=!ae),it(ae),z.blending===zi&&z.transparent===!1?lt(ii):lt(z.blending,z.blendEquation,z.blendSrc,z.blendDst,z.blendEquationAlpha,z.blendSrcAlpha,z.blendDstAlpha,z.blendColor,z.blendAlpha,z.premultipliedAlpha),a.setFunc(z.depthFunc),a.setTest(z.depthTest),a.setMask(z.depthWrite),r.setMask(z.colorWrite);let L=z.stencilWrite;o.setTest(L),L&&(o.setMask(z.stencilWriteMask),o.setFunc(z.stencilFunc,z.stencilRef,z.stencilFuncMask),o.setOp(z.stencilFail,z.stencilZFail,z.stencilZPass)),kt(z.polygonOffset,z.polygonOffsetFactor,z.polygonOffsetUnits),z.alphaToCoverage===!0?le(i.SAMPLE_ALPHA_TO_COVERAGE):Ae(i.SAMPLE_ALPHA_TO_COVERAGE)}function it(z){O!==z&&(z?i.frontFace(i.CW):i.frontFace(i.CCW),O=z)}function Mt(z){z!==Nh?(le(i.CULL_FACE),z!==V&&(z===Ql?i.cullFace(i.BACK):z===Uh?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):Ae(i.CULL_FACE),V=z}function Lt(z){z!==W&&(ie&&i.lineWidth(z),W=z)}function kt(z,Se,ae){z?(le(i.POLYGON_OFFSET_FILL),(B!==Se||J!==ae)&&(B=Se,J=ae,a.getReversed()&&(Se=-Se),i.polygonOffset(Se,ae))):Ae(i.POLYGON_OFFSET_FILL)}function wt(z){z?le(i.SCISSOR_TEST):Ae(i.SCISSOR_TEST)}function Ut(z){z===void 0&&(z=i.TEXTURE0+ne-1),oe!==z&&(i.activeTexture(z),oe=z)}function k(z,Se,ae){ae===void 0&&(oe===null?ae=i.TEXTURE0+ne-1:ae=oe);let L=ue[ae];L===void 0&&(L={type:void 0,texture:void 0},ue[ae]=L),(L.type!==z||L.texture!==Se)&&(oe!==ae&&(i.activeTexture(ae),oe=ae),i.bindTexture(z,Se||te[z]),L.type=z,L.texture=Se)}function Ft(){let z=ue[oe];z!==void 0&&z.type!==void 0&&(i.bindTexture(z.type,null),z.type=void 0,z.texture=void 0)}function ct(){try{i.compressedTexImage2D(...arguments)}catch(z){Ze("WebGLState:",z)}}function C(){try{i.compressedTexImage3D(...arguments)}catch(z){Ze("WebGLState:",z)}}function _(){try{i.texSubImage2D(...arguments)}catch(z){Ze("WebGLState:",z)}}function X(){try{i.texSubImage3D(...arguments)}catch(z){Ze("WebGLState:",z)}}function q(){try{i.compressedTexSubImage2D(...arguments)}catch(z){Ze("WebGLState:",z)}}function ee(){try{i.compressedTexSubImage3D(...arguments)}catch(z){Ze("WebGLState:",z)}}function me(){try{i.texStorage2D(...arguments)}catch(z){Ze("WebGLState:",z)}}function ye(){try{i.texStorage3D(...arguments)}catch(z){Ze("WebGLState:",z)}}function se(){try{i.texImage2D(...arguments)}catch(z){Ze("WebGLState:",z)}}function ce(){try{i.texImage3D(...arguments)}catch(z){Ze("WebGLState:",z)}}function ve(z){return p[z]!==void 0?p[z]:i.getParameter(z)}function Be(z,Se){p[z]!==Se&&(i.pixelStorei(z,Se),p[z]=Se)}function xe(z){pt.equals(z)===!1&&(i.scissor(z.x,z.y,z.z,z.w),pt.copy(z))}function Me(z){tt.equals(z)===!1&&(i.viewport(z.x,z.y,z.z,z.w),tt.copy(z))}function De(z,Se){let ae=l.get(Se);ae===void 0&&(ae=new WeakMap,l.set(Se,ae));let L=ae.get(z);L===void 0&&(L=i.getUniformBlockIndex(Se,z.name),ae.set(z,L))}function ke(z,Se){let L=l.get(Se).get(z);c.get(Se)!==L&&(i.uniformBlockBinding(Se,L,z.__bindingPointIndex),c.set(Se,L))}function Qe(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),a.setReversed(!1),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),i.pixelStorei(i.PACK_ALIGNMENT,4),i.pixelStorei(i.UNPACK_ALIGNMENT,4),i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,!1),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,i.BROWSER_DEFAULT_WEBGL),i.pixelStorei(i.PACK_ROW_LENGTH,0),i.pixelStorei(i.PACK_SKIP_PIXELS,0),i.pixelStorei(i.PACK_SKIP_ROWS,0),i.pixelStorei(i.UNPACK_ROW_LENGTH,0),i.pixelStorei(i.UNPACK_IMAGE_HEIGHT,0),i.pixelStorei(i.UNPACK_SKIP_PIXELS,0),i.pixelStorei(i.UNPACK_SKIP_ROWS,0),i.pixelStorei(i.UNPACK_SKIP_IMAGES,0),u={},p={},oe=null,ue={},h={},f=new WeakMap,g=[],v=null,m=!1,d=null,S=null,E=null,y=null,b=null,T=null,I=null,x=new We(0,0,0),w=0,R=!1,O=null,V=null,W=null,B=null,J=null,pt.set(0,0,i.canvas.width,i.canvas.height),tt.set(0,0,i.canvas.width,i.canvas.height),r.reset(),a.reset(),o.reset()}return{buffers:{color:r,depth:a,stencil:o},enable:le,disable:Ae,bindFramebuffer:Je,drawBuffers:Re,useProgram:nt,setBlending:lt,setMaterial:mt,setFlipSided:it,setCullFace:Mt,setLineWidth:Lt,setPolygonOffset:kt,setScissorTest:wt,activeTexture:Ut,bindTexture:k,unbindTexture:Ft,compressedTexImage2D:ct,compressedTexImage3D:C,texImage2D:se,texImage3D:ce,pixelStorei:Be,getParameter:ve,updateUBOMapping:De,uniformBlockBinding:ke,texStorage2D:me,texStorage3D:ye,texSubImage2D:_,texSubImage3D:X,compressedTexSubImage2D:q,compressedTexSubImage3D:ee,scissor:xe,viewport:Me,reset:Qe}}function U0(i,e,t,n,s,r,a){let o=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),l=new Pe,u=new WeakMap,p=new Set,h,f=new WeakMap,g=!1;try{g=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function v(C,_){return g?new OffscreenCanvas(C,_):pr("canvas")}function m(C,_,X){let q=1,ee=ct(C);if((ee.width>X||ee.height>X)&&(q=X/Math.max(ee.width,ee.height)),q<1)if(typeof HTMLImageElement<"u"&&C instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&C instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&C instanceof ImageBitmap||typeof VideoFrame<"u"&&C instanceof VideoFrame){let me=Math.floor(q*ee.width),ye=Math.floor(q*ee.height);h===void 0&&(h=v(me,ye));let se=_?v(me,ye):h;return se.width=me,se.height=ye,se.getContext("2d").drawImage(C,0,0,me,ye),qe("WebGLRenderer: Texture has been resized from ("+ee.width+"x"+ee.height+") to ("+me+"x"+ye+")."),se}else return"data"in C&&qe("WebGLRenderer: Image in DataTexture is too big ("+ee.width+"x"+ee.height+")."),C;return C}function d(C){return C.generateMipmaps}function S(C){i.generateMipmap(C)}function E(C){return C.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:C.isWebGL3DRenderTarget?i.TEXTURE_3D:C.isWebGLArrayRenderTarget||C.isCompressedArrayTexture?i.TEXTURE_2D_ARRAY:i.TEXTURE_2D}function y(C,_,X,q,ee,me=!1){if(C!==null){if(i[C]!==void 0)return i[C];qe("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+C+"'")}let ye;q&&(ye=e.get("EXT_texture_norm16"),ye||qe("WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension"));let se=_;if(_===i.RED&&(X===i.FLOAT&&(se=i.R32F),X===i.HALF_FLOAT&&(se=i.R16F),X===i.UNSIGNED_BYTE&&(se=i.R8),X===i.UNSIGNED_SHORT&&ye&&(se=ye.R16_EXT),X===i.SHORT&&ye&&(se=ye.R16_SNORM_EXT)),_===i.RED_INTEGER&&(X===i.UNSIGNED_BYTE&&(se=i.R8UI),X===i.UNSIGNED_SHORT&&(se=i.R16UI),X===i.UNSIGNED_INT&&(se=i.R32UI),X===i.BYTE&&(se=i.R8I),X===i.SHORT&&(se=i.R16I),X===i.INT&&(se=i.R32I)),_===i.RG&&(X===i.FLOAT&&(se=i.RG32F),X===i.HALF_FLOAT&&(se=i.RG16F),X===i.UNSIGNED_BYTE&&(se=i.RG8),X===i.UNSIGNED_SHORT&&ye&&(se=ye.RG16_EXT),X===i.SHORT&&ye&&(se=ye.RG16_SNORM_EXT)),_===i.RG_INTEGER&&(X===i.UNSIGNED_BYTE&&(se=i.RG8UI),X===i.UNSIGNED_SHORT&&(se=i.RG16UI),X===i.UNSIGNED_INT&&(se=i.RG32UI),X===i.BYTE&&(se=i.RG8I),X===i.SHORT&&(se=i.RG16I),X===i.INT&&(se=i.RG32I)),_===i.RGB_INTEGER&&(X===i.UNSIGNED_BYTE&&(se=i.RGB8UI),X===i.UNSIGNED_SHORT&&(se=i.RGB16UI),X===i.UNSIGNED_INT&&(se=i.RGB32UI),X===i.BYTE&&(se=i.RGB8I),X===i.SHORT&&(se=i.RGB16I),X===i.INT&&(se=i.RGB32I)),_===i.RGBA_INTEGER&&(X===i.UNSIGNED_BYTE&&(se=i.RGBA8UI),X===i.UNSIGNED_SHORT&&(se=i.RGBA16UI),X===i.UNSIGNED_INT&&(se=i.RGBA32UI),X===i.BYTE&&(se=i.RGBA8I),X===i.SHORT&&(se=i.RGBA16I),X===i.INT&&(se=i.RGBA32I)),_===i.RGB&&(X===i.UNSIGNED_SHORT&&ye&&(se=ye.RGB16_EXT),X===i.SHORT&&ye&&(se=ye.RGB16_SNORM_EXT),X===i.UNSIGNED_INT_5_9_9_9_REV&&(se=i.RGB9_E5),X===i.UNSIGNED_INT_10F_11F_11F_REV&&(se=i.R11F_G11F_B10F)),_===i.RGBA){let ce=me?fr:dt.getTransfer(ee);X===i.FLOAT&&(se=i.RGBA32F),X===i.HALF_FLOAT&&(se=i.RGBA16F),X===i.UNSIGNED_BYTE&&(se=ce===Tt?i.SRGB8_ALPHA8:i.RGBA8),X===i.UNSIGNED_SHORT&&ye&&(se=ye.RGBA16_EXT),X===i.SHORT&&ye&&(se=ye.RGBA16_SNORM_EXT),X===i.UNSIGNED_SHORT_4_4_4_4&&(se=i.RGBA4),X===i.UNSIGNED_SHORT_5_5_5_1&&(se=i.RGB5_A1)}return(se===i.R16F||se===i.R32F||se===i.RG16F||se===i.RG32F||se===i.RGBA16F||se===i.RGBA32F)&&e.get("EXT_color_buffer_float"),se}function b(C,_){let X;return C?_===null||_===qn||_===Hs?X=i.DEPTH24_STENCIL8:_===Ln?X=i.DEPTH32F_STENCIL8:_===ks&&(X=i.DEPTH24_STENCIL8,qe("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):_===null||_===qn||_===Hs?X=i.DEPTH_COMPONENT24:_===Ln?X=i.DEPTH_COMPONENT32F:_===ks&&(X=i.DEPTH_COMPONENT16),X}function T(C,_){return d(C)===!0||C.isFramebufferTexture&&C.minFilter!==on&&C.minFilter!==ln?Math.log2(Math.max(_.width,_.height))+1:C.mipmaps!==void 0&&C.mipmaps.length>0?C.mipmaps.length:C.isCompressedTexture&&Array.isArray(C.image)?_.mipmaps.length:1}function I(C){let _=C.target;_.removeEventListener("dispose",I),w(_),_.isVideoTexture&&u.delete(_),_.isHTMLTexture&&p.delete(_)}function x(C){let _=C.target;_.removeEventListener("dispose",x),O(_)}function w(C){let _=n.get(C);if(_.__webglInit===void 0)return;let X=C.source,q=f.get(X);if(q){let ee=q[_.__cacheKey];ee.usedTimes--,ee.usedTimes===0&&R(C),Object.keys(q).length===0&&f.delete(X)}n.remove(C)}function R(C){let _=n.get(C);i.deleteTexture(_.__webglTexture);let X=C.source,q=f.get(X);delete q[_.__cacheKey],a.memory.textures--}function O(C){let _=n.get(C);if(C.depthTexture&&(C.depthTexture.dispose(),n.remove(C.depthTexture)),C.isWebGLCubeRenderTarget)for(let q=0;q<6;q++){if(Array.isArray(_.__webglFramebuffer[q]))for(let ee=0;ee<_.__webglFramebuffer[q].length;ee++)i.deleteFramebuffer(_.__webglFramebuffer[q][ee]);else i.deleteFramebuffer(_.__webglFramebuffer[q]);_.__webglDepthbuffer&&i.deleteRenderbuffer(_.__webglDepthbuffer[q])}else{if(Array.isArray(_.__webglFramebuffer))for(let q=0;q<_.__webglFramebuffer.length;q++)i.deleteFramebuffer(_.__webglFramebuffer[q]);else i.deleteFramebuffer(_.__webglFramebuffer);if(_.__webglDepthbuffer&&i.deleteRenderbuffer(_.__webglDepthbuffer),_.__webglMultisampledFramebuffer&&i.deleteFramebuffer(_.__webglMultisampledFramebuffer),_.__webglColorRenderbuffer)for(let q=0;q<_.__webglColorRenderbuffer.length;q++)_.__webglColorRenderbuffer[q]&&i.deleteRenderbuffer(_.__webglColorRenderbuffer[q]);_.__webglDepthRenderbuffer&&i.deleteRenderbuffer(_.__webglDepthRenderbuffer)}let X=C.textures;for(let q=0,ee=X.length;q<ee;q++){let me=n.get(X[q]);me.__webglTexture&&(i.deleteTexture(me.__webglTexture),a.memory.textures--),n.remove(X[q])}n.remove(C)}let V=0;function W(){V=0}function B(){return V}function J(C){V=C}function ne(){let C=V;return C>=s.maxTextures&&qe("WebGLTextures: Trying to use "+(C+1)+" texture units while this GPU supports only "+s.maxTextures),V+=1,C}function ie(C){let _=[];return _.push(C.wrapS),_.push(C.wrapT),_.push(C.wrapR||0),_.push(C.magFilter),_.push(C.minFilter),_.push(C.anisotropy),_.push(C.internalFormat),_.push(C.format),_.push(C.type),_.push(C.generateMipmaps),_.push(C.premultiplyAlpha),_.push(C.flipY),_.push(C.unpackAlignment),_.push(C.colorSpace),_.join()}function de(C,_){let X=n.get(C);if(C.isVideoTexture&&k(C),C.isRenderTargetTexture===!1&&C.isExternalTexture!==!0&&C.version>0&&X.__version!==C.version){let q=C.image;if(q===null)qe("WebGLRenderer: Texture marked for update but no image data found.");else if(q.complete===!1)qe("WebGLRenderer: Texture marked for update but image is incomplete");else{Ae(X,C,_);return}}else C.isExternalTexture&&(X.__webglTexture=C.sourceTexture?C.sourceTexture:null);t.bindTexture(i.TEXTURE_2D,X.__webglTexture,i.TEXTURE0+_)}function j(C,_){let X=n.get(C);if(C.isRenderTargetTexture===!1&&C.version>0&&X.__version!==C.version){Ae(X,C,_);return}else C.isExternalTexture&&(X.__webglTexture=C.sourceTexture?C.sourceTexture:null);t.bindTexture(i.TEXTURE_2D_ARRAY,X.__webglTexture,i.TEXTURE0+_)}function oe(C,_){let X=n.get(C);if(C.isRenderTargetTexture===!1&&C.version>0&&X.__version!==C.version){Ae(X,C,_);return}t.bindTexture(i.TEXTURE_3D,X.__webglTexture,i.TEXTURE0+_)}function ue(C,_){let X=n.get(C);if(C.isCubeDepthTexture!==!0&&C.version>0&&X.__version!==C.version){Je(X,C,_);return}t.bindTexture(i.TEXTURE_CUBE_MAP,X.__webglTexture,i.TEXTURE0+_)}let Ve={[Ii]:i.REPEAT,[Kn]:i.CLAMP_TO_EDGE,[Na]:i.MIRRORED_REPEAT},Ie={[on]:i.NEAREST,[iu]:i.NEAREST_MIPMAP_NEAREST,[zr]:i.NEAREST_MIPMAP_LINEAR,[ln]:i.LINEAR,[_o]:i.LINEAR_MIPMAP_NEAREST,[Vi]:i.LINEAR_MIPMAP_LINEAR},pt={[ou]:i.NEVER,[du]:i.ALWAYS,[lu]:i.LESS,[nl]:i.LEQUAL,[cu]:i.EQUAL,[il]:i.GEQUAL,[hu]:i.GREATER,[uu]:i.NOTEQUAL};function tt(C,_){if(_.type===Ln&&e.has("OES_texture_float_linear")===!1&&(_.magFilter===ln||_.magFilter===_o||_.magFilter===zr||_.magFilter===Vi||_.minFilter===ln||_.minFilter===_o||_.minFilter===zr||_.minFilter===Vi)&&qe("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(C,i.TEXTURE_WRAP_S,Ve[_.wrapS]),i.texParameteri(C,i.TEXTURE_WRAP_T,Ve[_.wrapT]),(C===i.TEXTURE_3D||C===i.TEXTURE_2D_ARRAY)&&i.texParameteri(C,i.TEXTURE_WRAP_R,Ve[_.wrapR]),i.texParameteri(C,i.TEXTURE_MAG_FILTER,Ie[_.magFilter]),i.texParameteri(C,i.TEXTURE_MIN_FILTER,Ie[_.minFilter]),_.compareFunction&&(i.texParameteri(C,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(C,i.TEXTURE_COMPARE_FUNC,pt[_.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(_.magFilter===on||_.minFilter!==zr&&_.minFilter!==Vi||_.type===Ln&&e.has("OES_texture_float_linear")===!1)return;if(_.anisotropy>1||n.get(_).__currentAnisotropy){let X=e.get("EXT_texture_filter_anisotropic");i.texParameterf(C,X.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(_.anisotropy,s.getMaxAnisotropy())),n.get(_).__currentAnisotropy=_.anisotropy}}}function rt(C,_){let X=!1;C.__webglInit===void 0&&(C.__webglInit=!0,_.addEventListener("dispose",I));let q=_.source,ee=f.get(q);ee===void 0&&(ee={},f.set(q,ee));let me=ie(_);if(me!==C.__cacheKey){ee[me]===void 0&&(ee[me]={texture:i.createTexture(),usedTimes:0},a.memory.textures++,X=!0),ee[me].usedTimes++;let ye=ee[C.__cacheKey];ye!==void 0&&(ee[C.__cacheKey].usedTimes--,ye.usedTimes===0&&R(_)),C.__cacheKey=me,C.__webglTexture=ee[me].texture}return X}function te(C,_,X){return Math.floor(Math.floor(C/X)/_)}function le(C,_,X,q){let me=C.updateRanges;if(me.length===0)t.texSubImage2D(i.TEXTURE_2D,0,0,0,_.width,_.height,X,q,_.data);else{me.sort((Be,xe)=>Be.start-xe.start);let ye=0;for(let Be=1;Be<me.length;Be++){let xe=me[ye],Me=me[Be],De=xe.start+xe.count,ke=te(Me.start,_.width,4),Qe=te(xe.start,_.width,4);Me.start<=De+1&&ke===Qe&&te(Me.start+Me.count-1,_.width,4)===ke?xe.count=Math.max(xe.count,Me.start+Me.count-xe.start):(++ye,me[ye]=Me)}me.length=ye+1;let se=t.getParameter(i.UNPACK_ROW_LENGTH),ce=t.getParameter(i.UNPACK_SKIP_PIXELS),ve=t.getParameter(i.UNPACK_SKIP_ROWS);t.pixelStorei(i.UNPACK_ROW_LENGTH,_.width);for(let Be=0,xe=me.length;Be<xe;Be++){let Me=me[Be],De=Math.floor(Me.start/4),ke=Math.ceil(Me.count/4),Qe=De%_.width,z=Math.floor(De/_.width),Se=ke,ae=1;t.pixelStorei(i.UNPACK_SKIP_PIXELS,Qe),t.pixelStorei(i.UNPACK_SKIP_ROWS,z),t.texSubImage2D(i.TEXTURE_2D,0,Qe,z,Se,ae,X,q,_.data)}C.clearUpdateRanges(),t.pixelStorei(i.UNPACK_ROW_LENGTH,se),t.pixelStorei(i.UNPACK_SKIP_PIXELS,ce),t.pixelStorei(i.UNPACK_SKIP_ROWS,ve)}}function Ae(C,_,X){let q=i.TEXTURE_2D;(_.isDataArrayTexture||_.isCompressedArrayTexture)&&(q=i.TEXTURE_2D_ARRAY),_.isData3DTexture&&(q=i.TEXTURE_3D);let ee=rt(C,_),me=_.source;t.bindTexture(q,C.__webglTexture,i.TEXTURE0+X);let ye=n.get(me);if(me.version!==ye.__version||ee===!0){if(t.activeTexture(i.TEXTURE0+X),(typeof ImageBitmap<"u"&&_.image instanceof ImageBitmap)===!1){let ae=dt.getPrimaries(dt.workingColorSpace),L=_.colorSpace===xi?null:dt.getPrimaries(_.colorSpace),H=_.colorSpace===xi||ae===L?i.NONE:i.BROWSER_DEFAULT_WEBGL;t.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,_.flipY),t.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,_.premultiplyAlpha),t.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,H)}t.pixelStorei(i.UNPACK_ALIGNMENT,_.unpackAlignment);let ce=m(_.image,!1,s.maxTextureSize);ce=Ft(_,ce);let ve=r.convert(_.format,_.colorSpace),Be=r.convert(_.type),xe=y(_.internalFormat,ve,Be,_.normalized,_.colorSpace,_.isVideoTexture);tt(q,_);let Me,De=_.mipmaps,ke=_.isVideoTexture!==!0,Qe=ye.__version===void 0||ee===!0,z=me.dataReady,Se=T(_,ce);if(_.isDepthTexture)xe=b(_.format===ki,_.type),Qe&&(ke?t.texStorage2D(i.TEXTURE_2D,1,xe,ce.width,ce.height):t.texImage2D(i.TEXTURE_2D,0,xe,ce.width,ce.height,0,ve,Be,null));else if(_.isDataTexture)if(De.length>0){ke&&Qe&&t.texStorage2D(i.TEXTURE_2D,Se,xe,De[0].width,De[0].height);for(let ae=0,L=De.length;ae<L;ae++)Me=De[ae],ke?z&&t.texSubImage2D(i.TEXTURE_2D,ae,0,0,Me.width,Me.height,ve,Be,Me.data):t.texImage2D(i.TEXTURE_2D,ae,xe,Me.width,Me.height,0,ve,Be,Me.data);_.generateMipmaps=!1}else ke?(Qe&&t.texStorage2D(i.TEXTURE_2D,Se,xe,ce.width,ce.height),z&&le(_,ce,ve,Be)):t.texImage2D(i.TEXTURE_2D,0,xe,ce.width,ce.height,0,ve,Be,ce.data);else if(_.isCompressedTexture)if(_.isCompressedArrayTexture){ke&&Qe&&t.texStorage3D(i.TEXTURE_2D_ARRAY,Se,xe,De[0].width,De[0].height,ce.depth);for(let ae=0,L=De.length;ae<L;ae++)if(Me=De[ae],_.format!==Dn)if(ve!==null)if(ke){if(z)if(_.layerUpdates.size>0){let H=bc(Me.width,Me.height,_.format,_.type);for(let A of _.layerUpdates){let D=Me.data.subarray(A*H/Me.data.BYTES_PER_ELEMENT,(A+1)*H/Me.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,ae,0,0,A,Me.width,Me.height,1,ve,D)}}else t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,ae,0,0,0,Me.width,Me.height,ce.depth,ve,Me.data)}else t.compressedTexImage3D(i.TEXTURE_2D_ARRAY,ae,xe,Me.width,Me.height,ce.depth,0,Me.data,0,0);else qe("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else ke?z&&t.texSubImage3D(i.TEXTURE_2D_ARRAY,ae,0,0,0,Me.width,Me.height,ce.depth,ve,Be,Me.data):t.texImage3D(i.TEXTURE_2D_ARRAY,ae,xe,Me.width,Me.height,ce.depth,0,ve,Be,Me.data);_.layerUpdates.size>0&&_.clearLayerUpdates()}else{ke&&Qe&&t.texStorage2D(i.TEXTURE_2D,Se,xe,De[0].width,De[0].height);for(let ae=0,L=De.length;ae<L;ae++)Me=De[ae],_.format!==Dn?ve!==null?ke?z&&t.compressedTexSubImage2D(i.TEXTURE_2D,ae,0,0,Me.width,Me.height,ve,Me.data):t.compressedTexImage2D(i.TEXTURE_2D,ae,xe,Me.width,Me.height,0,Me.data):qe("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):ke?z&&t.texSubImage2D(i.TEXTURE_2D,ae,0,0,Me.width,Me.height,ve,Be,Me.data):t.texImage2D(i.TEXTURE_2D,ae,xe,Me.width,Me.height,0,ve,Be,Me.data)}else if(_.isDataArrayTexture)if(ke){if(Qe&&t.texStorage3D(i.TEXTURE_2D_ARRAY,Se,xe,ce.width,ce.height,ce.depth),z)if(_.layerUpdates.size>0){let ae=bc(ce.width,ce.height,_.format,_.type);for(let L of _.layerUpdates){let H=ce.data.subarray(L*ae/ce.data.BYTES_PER_ELEMENT,(L+1)*ae/ce.data.BYTES_PER_ELEMENT);t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,L,ce.width,ce.height,1,ve,Be,H)}_.clearLayerUpdates()}else t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,ce.width,ce.height,ce.depth,ve,Be,ce.data)}else t.texImage3D(i.TEXTURE_2D_ARRAY,0,xe,ce.width,ce.height,ce.depth,0,ve,Be,ce.data);else if(_.isData3DTexture)ke?(Qe&&t.texStorage3D(i.TEXTURE_3D,Se,xe,ce.width,ce.height,ce.depth),z&&t.texSubImage3D(i.TEXTURE_3D,0,0,0,0,ce.width,ce.height,ce.depth,ve,Be,ce.data)):t.texImage3D(i.TEXTURE_3D,0,xe,ce.width,ce.height,ce.depth,0,ve,Be,ce.data);else if(_.isFramebufferTexture){if(Qe)if(ke)t.texStorage2D(i.TEXTURE_2D,Se,xe,ce.width,ce.height);else{let ae=ce.width,L=ce.height;for(let H=0;H<Se;H++)t.texImage2D(i.TEXTURE_2D,H,xe,ae,L,0,ve,Be,null),ae>>=1,L>>=1}}else if(_.isHTMLTexture){if("texElementImage2D"in i){let ae=i.canvas;if(ae.hasAttribute("layoutsubtree")||ae.setAttribute("layoutsubtree","true"),ce.parentNode!==ae){ae.appendChild(ce),p.add(_),ae.onpaint=L=>{let H=L.changedElements;for(let A of p)H.includes(A.image)&&(A.needsUpdate=!0)},ae.requestPaint();return}if(i.texElementImage2D.length===3)i.texElementImage2D(i.TEXTURE_2D,i.RGBA8,ce);else{let H=i.RGBA,A=i.RGBA,D=i.UNSIGNED_BYTE;i.texElementImage2D(i.TEXTURE_2D,0,H,A,D,ce)}i.texParameteri(i.TEXTURE_2D,i.TEXTURE_MIN_FILTER,i.LINEAR),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_S,i.CLAMP_TO_EDGE),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_T,i.CLAMP_TO_EDGE)}}else if(De.length>0){if(ke&&Qe){let ae=ct(De[0]);t.texStorage2D(i.TEXTURE_2D,Se,xe,ae.width,ae.height)}for(let ae=0,L=De.length;ae<L;ae++)Me=De[ae],ke?z&&t.texSubImage2D(i.TEXTURE_2D,ae,0,0,ve,Be,Me):t.texImage2D(i.TEXTURE_2D,ae,xe,ve,Be,Me);_.generateMipmaps=!1}else if(ke){if(Qe){let ae=ct(ce);t.texStorage2D(i.TEXTURE_2D,Se,xe,ae.width,ae.height)}z&&t.texSubImage2D(i.TEXTURE_2D,0,0,0,ve,Be,ce)}else t.texImage2D(i.TEXTURE_2D,0,xe,ve,Be,ce);d(_)&&S(q),ye.__version=me.version,_.onUpdate&&_.onUpdate(_)}C.__version=_.version}function Je(C,_,X){if(_.image.length!==6)return;let q=rt(C,_),ee=_.source;t.bindTexture(i.TEXTURE_CUBE_MAP,C.__webglTexture,i.TEXTURE0+X);let me=n.get(ee);if(ee.version!==me.__version||q===!0){t.activeTexture(i.TEXTURE0+X);let ye=dt.getPrimaries(dt.workingColorSpace),se=_.colorSpace===xi?null:dt.getPrimaries(_.colorSpace),ce=_.colorSpace===xi||ye===se?i.NONE:i.BROWSER_DEFAULT_WEBGL;t.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,_.flipY),t.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,_.premultiplyAlpha),t.pixelStorei(i.UNPACK_ALIGNMENT,_.unpackAlignment),t.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,ce);let ve=_.isCompressedTexture||_.image[0].isCompressedTexture,Be=_.image[0]&&_.image[0].isDataTexture,xe=[];for(let A=0;A<6;A++)!ve&&!Be?xe[A]=m(_.image[A],!0,s.maxCubemapSize):xe[A]=Be?_.image[A].image:_.image[A],xe[A]=Ft(_,xe[A]);let Me=xe[0],De=r.convert(_.format,_.colorSpace),ke=r.convert(_.type),Qe=y(_.internalFormat,De,ke,_.normalized,_.colorSpace),z=_.isVideoTexture!==!0,Se=me.__version===void 0||q===!0,ae=ee.dataReady,L=T(_,Me);tt(i.TEXTURE_CUBE_MAP,_);let H;if(ve){z&&Se&&t.texStorage2D(i.TEXTURE_CUBE_MAP,L,Qe,Me.width,Me.height);for(let A=0;A<6;A++){H=xe[A].mipmaps;for(let D=0;D<H.length;D++){let N=H[D];_.format!==Dn?De!==null?z?ae&&t.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+A,D,0,0,N.width,N.height,De,N.data):t.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+A,D,Qe,N.width,N.height,0,N.data):qe("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):z?ae&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+A,D,0,0,N.width,N.height,De,ke,N.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+A,D,Qe,N.width,N.height,0,De,ke,N.data)}}}else{if(H=_.mipmaps,z&&Se){H.length>0&&L++;let A=ct(xe[0]);t.texStorage2D(i.TEXTURE_CUBE_MAP,L,Qe,A.width,A.height)}for(let A=0;A<6;A++)if(Be){z?ae&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+A,0,0,0,xe[A].width,xe[A].height,De,ke,xe[A].data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+A,0,Qe,xe[A].width,xe[A].height,0,De,ke,xe[A].data);for(let D=0;D<H.length;D++){let F=H[D].image[A].image;z?ae&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+A,D+1,0,0,F.width,F.height,De,ke,F.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+A,D+1,Qe,F.width,F.height,0,De,ke,F.data)}}else{z?ae&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+A,0,0,0,De,ke,xe[A]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+A,0,Qe,De,ke,xe[A]);for(let D=0;D<H.length;D++){let N=H[D];z?ae&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+A,D+1,0,0,De,ke,N.image[A]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+A,D+1,Qe,De,ke,N.image[A])}}}d(_)&&S(i.TEXTURE_CUBE_MAP),me.__version=ee.version,_.onUpdate&&_.onUpdate(_)}C.__version=_.version}function Re(C,_,X,q,ee,me){let ye=r.convert(X.format,X.colorSpace),se=r.convert(X.type),ce=y(X.internalFormat,ye,se,X.normalized,X.colorSpace),ve=n.get(_),Be=n.get(X);if(Be.__renderTarget=_,!ve.__hasExternalTextures){let xe=Math.max(1,_.width>>me),Me=Math.max(1,_.height>>me);ee===i.TEXTURE_3D||ee===i.TEXTURE_2D_ARRAY?t.texImage3D(ee,me,ce,xe,Me,_.depth,0,ye,se,null):t.texImage2D(ee,me,ce,xe,Me,0,ye,se,null)}t.bindFramebuffer(i.FRAMEBUFFER,C),Ut(_)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,q,ee,Be.__webglTexture,0,wt(_)):(ee===i.TEXTURE_2D||ee>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&ee<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,q,ee,Be.__webglTexture,me),t.bindFramebuffer(i.FRAMEBUFFER,null)}function nt(C,_,X){if(i.bindRenderbuffer(i.RENDERBUFFER,C),_.depthBuffer){let q=_.depthTexture,ee=q&&q.isDepthTexture?q.type:null,me=b(_.stencilBuffer,ee),ye=_.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;Ut(_)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,wt(_),me,_.width,_.height):X?i.renderbufferStorageMultisample(i.RENDERBUFFER,wt(_),me,_.width,_.height):i.renderbufferStorage(i.RENDERBUFFER,me,_.width,_.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,ye,i.RENDERBUFFER,C)}else{let q=_.textures;for(let ee=0;ee<q.length;ee++){let me=q[ee],ye=r.convert(me.format,me.colorSpace),se=r.convert(me.type),ce=y(me.internalFormat,ye,se,me.normalized,me.colorSpace);Ut(_)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,wt(_),ce,_.width,_.height):X?i.renderbufferStorageMultisample(i.RENDERBUFFER,wt(_),ce,_.width,_.height):i.renderbufferStorage(i.RENDERBUFFER,ce,_.width,_.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function It(C,_,X){let q=_.isWebGLCubeRenderTarget===!0;if(t.bindFramebuffer(i.FRAMEBUFFER,C),!(_.depthTexture&&_.depthTexture.isDepthTexture))throw new Error("THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.");let ee=n.get(_.depthTexture);if(ee.__renderTarget=_,(!ee.__webglTexture||_.depthTexture.image.width!==_.width||_.depthTexture.image.height!==_.height)&&(_.depthTexture.image.width=_.width,_.depthTexture.image.height=_.height,_.depthTexture.needsUpdate=!0),q){if(ee.__webglInit===void 0&&(ee.__webglInit=!0,_.depthTexture.addEventListener("dispose",I)),ee.__webglTexture===void 0){ee.__webglTexture=i.createTexture(),t.bindTexture(i.TEXTURE_CUBE_MAP,ee.__webglTexture),tt(i.TEXTURE_CUBE_MAP,_.depthTexture);let ve=r.convert(_.depthTexture.format),Be=r.convert(_.depthTexture.type),xe;_.depthTexture.format===Qn?xe=i.DEPTH_COMPONENT24:_.depthTexture.format===ki&&(xe=i.DEPTH24_STENCIL8);for(let Me=0;Me<6;Me++)i.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Me,0,xe,_.width,_.height,0,ve,Be,null)}}else de(_.depthTexture,0);let me=ee.__webglTexture,ye=wt(_),se=q?i.TEXTURE_CUBE_MAP_POSITIVE_X+X:i.TEXTURE_2D,ce=_.depthTexture.format===ki?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;if(_.depthTexture.format===Qn)Ut(_)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,ce,se,me,0,ye):i.framebufferTexture2D(i.FRAMEBUFFER,ce,se,me,0);else if(_.depthTexture.format===ki)Ut(_)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,ce,se,me,0,ye):i.framebufferTexture2D(i.FRAMEBUFFER,ce,se,me,0);else throw new Error("THREE.WebGLTextures: Unknown depthTexture format.")}function Ke(C){let _=n.get(C),X=C.isWebGLCubeRenderTarget===!0;if(_.__boundDepthTexture!==C.depthTexture){let q=C.depthTexture;if(_.__depthDisposeCallback&&_.__depthDisposeCallback(),q){let ee=()=>{delete _.__boundDepthTexture,delete _.__depthDisposeCallback,q.removeEventListener("dispose",ee)};q.addEventListener("dispose",ee),_.__depthDisposeCallback=ee}_.__boundDepthTexture=q}if(C.depthTexture&&!_.__autoAllocateDepthBuffer)if(X)for(let q=0;q<6;q++)It(_.__webglFramebuffer[q],C,q);else{let q=C.texture.mipmaps;q&&q.length>0?It(_.__webglFramebuffer[0],C,0):It(_.__webglFramebuffer,C,0)}else if(X){_.__webglDepthbuffer=[];for(let q=0;q<6;q++)if(t.bindFramebuffer(i.FRAMEBUFFER,_.__webglFramebuffer[q]),_.__webglDepthbuffer[q]===void 0)_.__webglDepthbuffer[q]=i.createRenderbuffer(),nt(_.__webglDepthbuffer[q],C,!1);else{let ee=C.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,me=_.__webglDepthbuffer[q];i.bindRenderbuffer(i.RENDERBUFFER,me),i.framebufferRenderbuffer(i.FRAMEBUFFER,ee,i.RENDERBUFFER,me)}}else{let q=C.texture.mipmaps;if(q&&q.length>0?t.bindFramebuffer(i.FRAMEBUFFER,_.__webglFramebuffer[0]):t.bindFramebuffer(i.FRAMEBUFFER,_.__webglFramebuffer),_.__webglDepthbuffer===void 0)_.__webglDepthbuffer=i.createRenderbuffer(),nt(_.__webglDepthbuffer,C,!1);else{let ee=C.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,me=_.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,me),i.framebufferRenderbuffer(i.FRAMEBUFFER,ee,i.RENDERBUFFER,me)}}t.bindFramebuffer(i.FRAMEBUFFER,null)}function lt(C,_,X){let q=n.get(C);_!==void 0&&Re(q.__webglFramebuffer,C,C.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),X!==void 0&&Ke(C)}function mt(C){let _=C.texture,X=n.get(C),q=n.get(_);C.addEventListener("dispose",x);let ee=C.textures,me=C.isWebGLCubeRenderTarget===!0,ye=ee.length>1;if(ye||(q.__webglTexture===void 0&&(q.__webglTexture=i.createTexture()),q.__version=_.version,a.memory.textures++),me){X.__webglFramebuffer=[];for(let se=0;se<6;se++)if(_.mipmaps&&_.mipmaps.length>0){X.__webglFramebuffer[se]=[];for(let ce=0;ce<_.mipmaps.length;ce++)X.__webglFramebuffer[se][ce]=i.createFramebuffer()}else X.__webglFramebuffer[se]=i.createFramebuffer()}else{if(_.mipmaps&&_.mipmaps.length>0){X.__webglFramebuffer=[];for(let se=0;se<_.mipmaps.length;se++)X.__webglFramebuffer[se]=i.createFramebuffer()}else X.__webglFramebuffer=i.createFramebuffer();if(ye)for(let se=0,ce=ee.length;se<ce;se++){let ve=n.get(ee[se]);ve.__webglTexture===void 0&&(ve.__webglTexture=i.createTexture(),a.memory.textures++)}if(C.samples>0&&Ut(C)===!1){X.__webglMultisampledFramebuffer=i.createFramebuffer(),X.__webglColorRenderbuffer=[],t.bindFramebuffer(i.FRAMEBUFFER,X.__webglMultisampledFramebuffer);for(let se=0;se<ee.length;se++){let ce=ee[se];X.__webglColorRenderbuffer[se]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,X.__webglColorRenderbuffer[se]);let ve=r.convert(ce.format,ce.colorSpace),Be=r.convert(ce.type),xe=y(ce.internalFormat,ve,Be,ce.normalized,ce.colorSpace,C.isXRRenderTarget===!0),Me=wt(C);i.renderbufferStorageMultisample(i.RENDERBUFFER,Me,xe,C.width,C.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+se,i.RENDERBUFFER,X.__webglColorRenderbuffer[se])}i.bindRenderbuffer(i.RENDERBUFFER,null),C.depthBuffer&&(X.__webglDepthRenderbuffer=i.createRenderbuffer(),nt(X.__webglDepthRenderbuffer,C,!0)),t.bindFramebuffer(i.FRAMEBUFFER,null)}}if(me){t.bindTexture(i.TEXTURE_CUBE_MAP,q.__webglTexture),tt(i.TEXTURE_CUBE_MAP,_);for(let se=0;se<6;se++)if(_.mipmaps&&_.mipmaps.length>0)for(let ce=0;ce<_.mipmaps.length;ce++)Re(X.__webglFramebuffer[se][ce],C,_,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+se,ce);else Re(X.__webglFramebuffer[se],C,_,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+se,0);d(_)&&S(i.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(ye){for(let se=0,ce=ee.length;se<ce;se++){let ve=ee[se],Be=n.get(ve),xe=i.TEXTURE_2D;(C.isWebGL3DRenderTarget||C.isWebGLArrayRenderTarget)&&(xe=C.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture(xe,Be.__webglTexture),tt(xe,ve),Re(X.__webglFramebuffer,C,ve,i.COLOR_ATTACHMENT0+se,xe,0),d(ve)&&S(xe)}t.unbindTexture()}else{let se=i.TEXTURE_2D;if((C.isWebGL3DRenderTarget||C.isWebGLArrayRenderTarget)&&(se=C.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture(se,q.__webglTexture),tt(se,_),_.mipmaps&&_.mipmaps.length>0)for(let ce=0;ce<_.mipmaps.length;ce++)Re(X.__webglFramebuffer[ce],C,_,i.COLOR_ATTACHMENT0,se,ce);else Re(X.__webglFramebuffer,C,_,i.COLOR_ATTACHMENT0,se,0);d(_)&&S(se),t.unbindTexture()}C.depthBuffer&&Ke(C)}function it(C){let _=C.textures;for(let X=0,q=_.length;X<q;X++){let ee=_[X];if(d(ee)){let me=E(C),ye=n.get(ee).__webglTexture;t.bindTexture(me,ye),S(me),t.unbindTexture()}}}let Mt=[],Lt=[];function kt(C){if(C.samples>0){if(Ut(C)===!1){let _=C.textures,X=C.width,q=C.height,ee=i.COLOR_BUFFER_BIT,me=C.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,ye=n.get(C),se=_.length>1;if(se)for(let ve=0;ve<_.length;ve++)t.bindFramebuffer(i.FRAMEBUFFER,ye.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+ve,i.RENDERBUFFER,null),t.bindFramebuffer(i.FRAMEBUFFER,ye.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+ve,i.TEXTURE_2D,null,0);t.bindFramebuffer(i.READ_FRAMEBUFFER,ye.__webglMultisampledFramebuffer);let ce=C.texture.mipmaps;ce&&ce.length>0?t.bindFramebuffer(i.DRAW_FRAMEBUFFER,ye.__webglFramebuffer[0]):t.bindFramebuffer(i.DRAW_FRAMEBUFFER,ye.__webglFramebuffer);for(let ve=0;ve<_.length;ve++){if(C.resolveDepthBuffer&&(C.depthBuffer&&(ee|=i.DEPTH_BUFFER_BIT),C.stencilBuffer&&C.resolveStencilBuffer&&(ee|=i.STENCIL_BUFFER_BIT)),se){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,ye.__webglColorRenderbuffer[ve]);let Be=n.get(_[ve]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,Be,0)}i.blitFramebuffer(0,0,X,q,0,0,X,q,ee,i.NEAREST),c===!0&&(Mt.length=0,Lt.length=0,Mt.push(i.COLOR_ATTACHMENT0+ve),C.depthBuffer&&C.storeMultisampledDepthBuffer===!1&&(Mt.push(me),Lt.push(me),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,Lt)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,Mt))}if(t.bindFramebuffer(i.READ_FRAMEBUFFER,null),t.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),se)for(let ve=0;ve<_.length;ve++){t.bindFramebuffer(i.FRAMEBUFFER,ye.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+ve,i.RENDERBUFFER,ye.__webglColorRenderbuffer[ve]);let Be=n.get(_[ve]).__webglTexture;t.bindFramebuffer(i.FRAMEBUFFER,ye.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+ve,i.TEXTURE_2D,Be,0)}t.bindFramebuffer(i.DRAW_FRAMEBUFFER,ye.__webglMultisampledFramebuffer)}else if(C.depthBuffer&&C.storeMultisampledDepthBuffer===!1&&c){let _=C.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[_])}}}function wt(C){return Math.min(s.maxSamples,C.samples)}function Ut(C){let _=n.get(C);return C.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&_.__useRenderToTexture!==!1}function k(C){let _=a.render.frame;u.get(C)!==_&&(u.set(C,_),C.update())}function Ft(C,_){let X=C.colorSpace,q=C.format,ee=C.type;return C.isCompressedTexture===!0||C.isVideoTexture===!0||X!==dr&&X!==xi&&(dt.getTransfer(X)===Tt?(q!==Dn||ee!==bn)&&qe("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):Ze("WebGLTextures: Unsupported texture color space:",X)),_}function ct(C){return typeof HTMLImageElement<"u"&&C instanceof HTMLImageElement?(l.width=C.naturalWidth||C.width,l.height=C.naturalHeight||C.height):typeof VideoFrame<"u"&&C instanceof VideoFrame?(l.width=C.displayWidth,l.height=C.displayHeight):(l.width=C.width,l.height=C.height),l}this.allocateTextureUnit=ne,this.resetTextureUnits=W,this.getTextureUnits=B,this.setTextureUnits=J,this.setTexture2D=de,this.setTexture2DArray=j,this.setTexture3D=oe,this.setTextureCube=ue,this.rebindTextures=lt,this.setupRenderTarget=mt,this.updateRenderTargetMipmap=it,this.updateMultisampleRenderTarget=kt,this.setupDepthRenderbuffer=Ke,this.setupFrameBufferTexture=Re,this.useMultisampledRTT=Ut,this.isReversedDepthBuffer=function(){return t.buffers.depth.getReversed()}}function F0(i,e){function t(n,s=xi){let r,a=dt.getTransfer(s);if(n===bn)return i.UNSIGNED_BYTE;if(n===yo)return i.UNSIGNED_SHORT_4_4_4_4;if(n===vo)return i.UNSIGNED_SHORT_5_5_5_1;if(n===fc)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===pc)return i.UNSIGNED_INT_10F_11F_11F_REV;if(n===uc)return i.BYTE;if(n===dc)return i.SHORT;if(n===ks)return i.UNSIGNED_SHORT;if(n===xo)return i.INT;if(n===qn)return i.UNSIGNED_INT;if(n===Ln)return i.FLOAT;if(n===Yn)return i.HALF_FLOAT;if(n===mc)return i.ALPHA;if(n===gc)return i.RGB;if(n===Dn)return i.RGBA;if(n===Qn)return i.DEPTH_COMPONENT;if(n===ki)return i.DEPTH_STENCIL;if(n===Mo)return i.RED;if(n===So)return i.RED_INTEGER;if(n===Hi)return i.RG;if(n===bo)return i.RG_INTEGER;if(n===To)return i.RGBA_INTEGER;if(n===Gr||n===Vr||n===kr||n===Hr)if(a===Tt)if(r=e.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===Gr)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===Vr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===kr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===Hr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=e.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===Gr)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===Vr)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===kr)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===Hr)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===wo||n===Ao||n===Eo||n===Co)if(r=e.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===wo)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===Ao)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===Eo)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===Co)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===Ro||n===Po||n===Io||n===Lo||n===Do||n===Wr||n===No)if(r=e.get("WEBGL_compressed_texture_etc"),r!==null){if(n===Ro||n===Po)return a===Tt?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===Io)return a===Tt?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC;if(n===Lo)return r.COMPRESSED_R11_EAC;if(n===Do)return r.COMPRESSED_SIGNED_R11_EAC;if(n===Wr)return r.COMPRESSED_RG11_EAC;if(n===No)return r.COMPRESSED_SIGNED_RG11_EAC}else return null;if(n===Uo||n===Fo||n===Bo||n===Oo||n===zo||n===Go||n===Vo||n===ko||n===Ho||n===Wo||n===Xo||n===qo||n===Yo||n===Zo)if(r=e.get("WEBGL_compressed_texture_astc"),r!==null){if(n===Uo)return a===Tt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===Fo)return a===Tt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===Bo)return a===Tt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===Oo)return a===Tt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===zo)return a===Tt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===Go)return a===Tt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===Vo)return a===Tt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===ko)return a===Tt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===Ho)return a===Tt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===Wo)return a===Tt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===Xo)return a===Tt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===qo)return a===Tt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===Yo)return a===Tt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===Zo)return a===Tt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===Jo||n===$o||n===Ko)if(r=e.get("EXT_texture_compression_bptc"),r!==null){if(n===Jo)return a===Tt?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===$o)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===Ko)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===Qo||n===jo||n===Xr||n===el)if(r=e.get("EXT_texture_compression_rgtc"),r!==null){if(n===Qo)return r.COMPRESSED_RED_RGTC1_EXT;if(n===jo)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===Xr)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===el)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===Hs?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:t}}var B0=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,O0=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`,kc=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){let n=new Ar(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=n}}getMesh(e){if(this.texture!==null&&this.mesh===null){let t=e.cameras[0].viewport,n=new vn({vertexShader:B0,fragmentShader:O0,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new Xe(new _t(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},Hc=class extends jn{constructor(e,t){super();let n=this,s=null,r=1,a=null,o="local-floor",c=1,l=null,u=null,p=null,h=null,f=null,g=null,v=typeof XRWebGLBinding<"u",m=new kc,d={},S=t.getContextAttributes(),E=null,y=null,b=[],T=[],I=new Pe,x=null,w=null,R=new an;R.viewport=new Gt;let O=new an;O.viewport=new Gt;let V=[R,O],W=new uo,B=null,J=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(te){let le=b[te];return le===void 0&&(le=new Ns,b[te]=le),le.getTargetRaySpace()},this.getControllerGrip=function(te){let le=b[te];return le===void 0&&(le=new Ns,b[te]=le),le.getGripSpace()},this.getHand=function(te){let le=b[te];return le===void 0&&(le=new Ns,b[te]=le),le.getHandSpace()};function ne(te){let le=T.indexOf(te.inputSource);if(le===-1)return;let Ae=b[le];Ae!==void 0&&(Ae.update(te.inputSource,te.frame,l||a),Ae.dispatchEvent({type:te.type,data:te.inputSource}))}function ie(){s.removeEventListener("select",ne),s.removeEventListener("selectstart",ne),s.removeEventListener("selectend",ne),s.removeEventListener("squeeze",ne),s.removeEventListener("squeezestart",ne),s.removeEventListener("squeezeend",ne),s.removeEventListener("end",ie),s.removeEventListener("inputsourceschange",de);for(let te=0;te<b.length;te++){let le=T[te];le!==null&&(T[te]=null,b[te].disconnect(le))}B=null,J=null,m.reset();for(let te in d)delete d[te];if(e.setRenderTarget(E),f=null,h=null,p=null,s=null,y=null,rt.stop(),n.isPresenting=!1,e.setPixelRatio(x),e.setSize(I.width,I.height,!1),w!==null){let te=w.camera;te.fov=w.fov,te.zoom=w.zoom,te.updateProjectionMatrix(),w=null}n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(te){r=te,n.isPresenting===!0&&qe("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(te){o=te,n.isPresenting===!0&&qe("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return l||a},this.setReferenceSpace=function(te){l=te},this.getBaseLayer=function(){return h!==null?h:f},this.getBinding=function(){return p===null&&v&&(p=new XRWebGLBinding(s,t)),p},this.getFrame=function(){return g},this.getSession=function(){return s},this.setSession=async function(te){if(s=te,s!==null){if(E=e.getRenderTarget(),s.addEventListener("select",ne),s.addEventListener("selectstart",ne),s.addEventListener("selectend",ne),s.addEventListener("squeeze",ne),s.addEventListener("squeezestart",ne),s.addEventListener("squeezeend",ne),s.addEventListener("end",ie),s.addEventListener("inputsourceschange",de),S.xrCompatible!==!0&&await t.makeXRCompatible(),x=e.getPixelRatio(),e.getSize(I),v&&"createProjectionLayer"in XRWebGLBinding.prototype){let Ae=null,Je=null,Re=null;S.depth&&(Re=S.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,Ae=S.stencil?ki:Qn,Je=S.stencil?Hs:qn);let nt={colorFormat:t.RGBA8,depthFormat:Re,scaleFactor:r};p=this.getBinding(),h=p.createProjectionLayer(nt),s.updateRenderState({layers:[h]}),e.setPixelRatio(1),e.setSize(h.textureWidth,h.textureHeight,!1),y=new Mn(h.textureWidth,h.textureHeight,{format:Dn,type:bn,depthTexture:new Ni(h.textureWidth,h.textureHeight,Je,void 0,void 0,void 0,void 0,void 0,void 0,Ae),stencilBuffer:S.stencil,colorSpace:e.outputColorSpace,samples:S.antialias?4:0,resolveDepthBuffer:h.ignoreDepthValues===!1,resolveStencilBuffer:h.ignoreDepthValues===!1,storeMultisampledDepthBuffer:h.ignoreDepthValues===!1,storeMultisampledStencilBuffer:h.ignoreDepthValues===!1})}else{let Ae={antialias:S.antialias,alpha:!0,depth:S.depth,stencil:S.stencil,framebufferScaleFactor:r};f=new XRWebGLLayer(s,t,Ae),s.updateRenderState({baseLayer:f}),e.setPixelRatio(1),e.setSize(f.framebufferWidth,f.framebufferHeight,!1),y=new Mn(f.framebufferWidth,f.framebufferHeight,{format:Dn,type:bn,colorSpace:e.outputColorSpace,stencilBuffer:S.stencil,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1,storeMultisampledDepthBuffer:f.ignoreDepthValues===!1,storeMultisampledStencilBuffer:f.ignoreDepthValues===!1})}y.isXRRenderTarget=!0,this.setFoveation(c),l=null,a=await s.requestReferenceSpace(o),rt.setContext(s),rt.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return m.getDepthTexture()};function de(te){for(let le=0;le<te.removed.length;le++){let Ae=te.removed[le],Je=T.indexOf(Ae);Je>=0&&(T[Je]=null,b[Je].disconnect(Ae))}for(let le=0;le<te.added.length;le++){let Ae=te.added[le],Je=T.indexOf(Ae);if(Je===-1){for(let nt=0;nt<b.length;nt++)if(nt>=T.length){T.push(Ae),Je=nt;break}else if(T[nt]===null){T[nt]=Ae,Je=nt;break}if(Je===-1)break}let Re=b[Je];Re&&Re.connect(Ae)}}let j=new P,oe=new P;function ue(te,le,Ae){j.setFromMatrixPosition(le.matrixWorld),oe.setFromMatrixPosition(Ae.matrixWorld);let Je=j.distanceTo(oe),Re=le.projectionMatrix.elements,nt=Ae.projectionMatrix.elements,It=Re[14]/(Re[10]-1),Ke=Re[14]/(Re[10]+1),lt=(Re[9]+1)/Re[5],mt=(Re[9]-1)/Re[5],it=(Re[8]-1)/Re[0],Mt=(nt[8]+1)/nt[0],Lt=It*it,kt=It*Mt,wt=Je/(-it+Mt),Ut=wt*-it;if(le.matrixWorld.decompose(te.position,te.quaternion,te.scale),te.translateX(Ut),te.translateZ(wt),te.matrixWorld.compose(te.position,te.quaternion,te.scale),te.matrixWorldInverse.copy(te.matrixWorld).invert(),Re[10]===-1)te.projectionMatrix.copy(le.projectionMatrix),te.projectionMatrixInverse.copy(le.projectionMatrixInverse);else{let k=It+wt,Ft=Ke+wt,ct=Lt-Ut,C=kt+(Je-Ut),_=lt*Ke/Ft*k,X=mt*Ke/Ft*k;te.projectionMatrix.makePerspective(ct,C,_,X,k,Ft),te.projectionMatrixInverse.copy(te.projectionMatrix).invert()}}function Ve(te,le){le===null?te.matrixWorld.copy(te.matrix):te.matrixWorld.multiplyMatrices(le.matrixWorld,te.matrix),te.matrixWorldInverse.copy(te.matrixWorld).invert()}this.updateCamera=function(te){if(s===null)return;let le=te.near,Ae=te.far;m.texture!==null&&(m.depthNear>0&&(le=m.depthNear),m.depthFar>0&&(Ae=m.depthFar)),W.near=O.near=R.near=le,W.far=O.far=R.far=Ae,(B!==W.near||J!==W.far)&&(s.updateRenderState({depthNear:W.near,depthFar:W.far}),B=W.near,J=W.far),W.layers.mask=te.layers.mask|6,R.layers.mask=W.layers.mask&-5,O.layers.mask=W.layers.mask&-3;let Je=te.parent,Re=W.cameras;Ve(W,Je);for(let nt=0;nt<Re.length;nt++)Ve(Re[nt],Je);Re.length===2?ue(W,R,O):W.projectionMatrix.copy(R.projectionMatrix),w===null&&te.isPerspectiveCamera&&(w={camera:te,fov:te.fov,zoom:te.zoom}),Ie(te,W,Je)};function Ie(te,le,Ae){Ae===null?te.matrix.copy(le.matrixWorld):(te.matrix.copy(Ae.matrixWorld),te.matrix.invert(),te.matrix.multiply(le.matrixWorld)),te.matrix.decompose(te.position,te.quaternion,te.scale),te.updateMatrixWorld(!0),te.projectionMatrix.copy(le.projectionMatrix),te.projectionMatrixInverse.copy(le.projectionMatrixInverse),te.isPerspectiveCamera&&(te.fov=gr*2*Math.atan(1/te.projectionMatrix.elements[5]),te.zoom=1)}this.getCamera=function(){return W},this.getFoveation=function(){if(!(h===null&&f===null))return c},this.setFoveation=function(te){c=te,h!==null&&(h.fixedFoveation=te),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=te)},this.hasDepthSensing=function(){return m.texture!==null},this.getDepthSensingMesh=function(){return m.getMesh(W)},this.getCameraTexture=function(te){return d[te]};let pt=null;function tt(te,le){if(u=le.getViewerPose(l||a),g=le,u!==null){let Ae=u.views;f!==null&&(e.setRenderTargetFramebuffer(y,f.framebuffer),e.setRenderTarget(y));let Je=!1;Ae.length!==W.cameras.length&&(W.cameras.length=0,Je=!0);for(let Ke=0;Ke<Ae.length;Ke++){let lt=Ae[Ke],mt=null;if(f!==null)mt=f.getViewport(lt);else{let Mt=p.getViewSubImage(h,lt);mt=Mt.viewport,Ke===0&&(e.setRenderTargetTextures(y,Mt.colorTexture,Mt.depthStencilTexture),e.setRenderTarget(y))}let it=V[Ke];it===void 0&&(it=new an,it.layers.enable(Ke),it.viewport=new Gt,V[Ke]=it),it.matrix.fromArray(lt.transform.matrix),it.matrix.decompose(it.position,it.quaternion,it.scale),it.projectionMatrix.fromArray(lt.projectionMatrix),it.projectionMatrixInverse.copy(it.projectionMatrix).invert(),it.viewport.set(mt.x,mt.y,mt.width,mt.height),Ke===0&&(W.matrix.copy(it.matrix),W.matrix.decompose(W.position,W.quaternion,W.scale)),Je===!0&&W.cameras.push(it)}let Re=s.enabledFeatures;if(Re&&Re.includes("depth-sensing")&&s.depthUsage=="gpu-optimized"&&v){p=n.getBinding();let Ke=p.getDepthInformation(Ae[0]);Ke&&Ke.isValid&&Ke.texture&&m.init(Ke,s.renderState)}if(Re&&Re.includes("camera-access")&&v){e.state.unbindTexture(),p=n.getBinding();for(let Ke=0;Ke<Ae.length;Ke++){let lt=Ae[Ke].camera;if(lt){let mt=d[lt];mt||(mt=new Ar,d[lt]=mt);let it=p.getCameraImage(lt);mt.sourceTexture=it}}}}for(let Ae=0;Ae<b.length;Ae++){let Je=T[Ae],Re=b[Ae];Je!==null&&Re!==void 0&&Re.update(Je,le,l||a)}pt&&pt(te,le),le.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:le}),g=null}let rt=new Hu;rt.setAnimationLoop(tt),this.setAnimationLoop=function(te){pt=te},this.dispose=function(){}}},z0=new gt,Ju=new je;Ju.set(-1,0,0,0,1,0,0,0,1);function G0(i,e){function t(m,d){m.matrixAutoUpdate===!0&&m.updateMatrix(),d.value.copy(m.matrix)}function n(m,d){d.color.getRGB(m.fogColor.value,vc(i)),d.isFog?(m.fogNear.value=d.near,m.fogFar.value=d.far):d.isFogExp2&&(m.fogDensity.value=d.density)}function s(m,d,S,E,y){d.isNodeMaterial?d.uniformsNeedUpdate=!1:d.isMeshBasicMaterial?r(m,d):d.isMeshLambertMaterial?(r(m,d),d.envMap&&(m.envMapIntensity.value=d.envMapIntensity)):d.isMeshToonMaterial?(r(m,d),p(m,d)):d.isMeshPhongMaterial?(r(m,d),u(m,d),d.envMap&&(m.envMapIntensity.value=d.envMapIntensity)):d.isMeshStandardMaterial?(r(m,d),h(m,d),d.isMeshPhysicalMaterial&&f(m,d,y)):d.isMeshMatcapMaterial?(r(m,d),g(m,d)):d.isMeshDepthMaterial?r(m,d):d.isMeshDistanceMaterial?(r(m,d),v(m,d)):d.isMeshNormalMaterial?r(m,d):d.isLineBasicMaterial?(a(m,d),d.isLineDashedMaterial&&o(m,d)):d.isPointsMaterial?c(m,d,S,E):d.isSpriteMaterial?l(m,d):d.isShadowMaterial?(m.color.value.copy(d.color),m.opacity.value=d.opacity):d.isShaderMaterial&&(d.uniformsNeedUpdate=!1)}function r(m,d){m.opacity.value=d.opacity,d.color&&m.diffuse.value.copy(d.color),d.emissive&&m.emissive.value.copy(d.emissive).multiplyScalar(d.emissiveIntensity),d.map&&(m.map.value=d.map,t(d.map,m.mapTransform)),d.alphaMap&&(m.alphaMap.value=d.alphaMap,t(d.alphaMap,m.alphaMapTransform)),d.bumpMap&&(m.bumpMap.value=d.bumpMap,t(d.bumpMap,m.bumpMapTransform),m.bumpScale.value=d.bumpScale,d.side===cn&&(m.bumpScale.value*=-1)),d.normalMap&&(m.normalMap.value=d.normalMap,t(d.normalMap,m.normalMapTransform),m.normalScale.value.copy(d.normalScale),d.side===cn&&m.normalScale.value.negate()),d.displacementMap&&(m.displacementMap.value=d.displacementMap,t(d.displacementMap,m.displacementMapTransform),m.displacementScale.value=d.displacementScale,m.displacementBias.value=d.displacementBias),d.emissiveMap&&(m.emissiveMap.value=d.emissiveMap,t(d.emissiveMap,m.emissiveMapTransform)),d.specularMap&&(m.specularMap.value=d.specularMap,t(d.specularMap,m.specularMapTransform)),d.alphaTest>0&&(m.alphaTest.value=d.alphaTest);let S=e.get(d),E=S.envMap,y=S.envMapRotation;E&&(m.envMap.value=E,m.envMapRotation.value.setFromMatrix4(z0.makeRotationFromEuler(y)).transpose(),E.isCubeTexture&&E.isRenderTargetTexture===!1&&m.envMapRotation.value.premultiply(Ju),m.reflectivity.value=d.reflectivity,m.ior.value=d.ior,m.refractionRatio.value=d.refractionRatio),d.lightMap&&(m.lightMap.value=d.lightMap,m.lightMapIntensity.value=d.lightMapIntensity,t(d.lightMap,m.lightMapTransform)),d.aoMap&&(m.aoMap.value=d.aoMap,m.aoMapIntensity.value=d.aoMapIntensity,t(d.aoMap,m.aoMapTransform))}function a(m,d){m.diffuse.value.copy(d.color),m.opacity.value=d.opacity,d.map&&(m.map.value=d.map,t(d.map,m.mapTransform))}function o(m,d){m.dashSize.value=d.dashSize,m.totalSize.value=d.dashSize+d.gapSize,m.scale.value=d.scale}function c(m,d,S,E){m.diffuse.value.copy(d.color),m.opacity.value=d.opacity,m.size.value=d.size*S,m.scale.value=E*.5,d.map&&(m.map.value=d.map,t(d.map,m.uvTransform)),d.alphaMap&&(m.alphaMap.value=d.alphaMap,t(d.alphaMap,m.alphaMapTransform)),d.alphaTest>0&&(m.alphaTest.value=d.alphaTest)}function l(m,d){m.diffuse.value.copy(d.color),m.opacity.value=d.opacity,m.rotation.value=d.rotation,d.map&&(m.map.value=d.map,t(d.map,m.mapTransform)),d.alphaMap&&(m.alphaMap.value=d.alphaMap,t(d.alphaMap,m.alphaMapTransform)),d.alphaTest>0&&(m.alphaTest.value=d.alphaTest)}function u(m,d){m.specular.value.copy(d.specular),m.shininess.value=Math.max(d.shininess,1e-4)}function p(m,d){d.gradientMap&&(m.gradientMap.value=d.gradientMap)}function h(m,d){m.metalness.value=d.metalness,d.metalnessMap&&(m.metalnessMap.value=d.metalnessMap,t(d.metalnessMap,m.metalnessMapTransform)),m.roughness.value=d.roughness,d.roughnessMap&&(m.roughnessMap.value=d.roughnessMap,t(d.roughnessMap,m.roughnessMapTransform)),d.envMap&&(m.envMapIntensity.value=d.envMapIntensity)}function f(m,d,S){m.ior.value=d.ior,d.sheen>0&&(m.sheenColor.value.copy(d.sheenColor).multiplyScalar(d.sheen),m.sheenRoughness.value=d.sheenRoughness,d.sheenColorMap&&(m.sheenColorMap.value=d.sheenColorMap,t(d.sheenColorMap,m.sheenColorMapTransform)),d.sheenRoughnessMap&&(m.sheenRoughnessMap.value=d.sheenRoughnessMap,t(d.sheenRoughnessMap,m.sheenRoughnessMapTransform))),d.clearcoat>0&&(m.clearcoat.value=d.clearcoat,m.clearcoatRoughness.value=d.clearcoatRoughness,d.clearcoatMap&&(m.clearcoatMap.value=d.clearcoatMap,t(d.clearcoatMap,m.clearcoatMapTransform)),d.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=d.clearcoatRoughnessMap,t(d.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),d.clearcoatNormalMap&&(m.clearcoatNormalMap.value=d.clearcoatNormalMap,t(d.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(d.clearcoatNormalScale),d.side===cn&&m.clearcoatNormalScale.value.negate())),d.dispersion>0&&(m.dispersion.value=d.dispersion),d.retroreflectivity>0&&(m.retroreflectivity.value=d.retroreflectivity),d.iridescence>0&&(m.iridescence.value=d.iridescence,m.iridescenceIOR.value=d.iridescenceIOR,m.iridescenceThicknessMinimum.value=d.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=d.iridescenceThicknessRange[1],d.iridescenceMap&&(m.iridescenceMap.value=d.iridescenceMap,t(d.iridescenceMap,m.iridescenceMapTransform)),d.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=d.iridescenceThicknessMap,t(d.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),d.transmission>0&&(m.transmission.value=d.transmission,m.transmissionSamplerMap.value=S.texture,m.transmissionSamplerSize.value.set(S.width,S.height),d.transmissionMap&&(m.transmissionMap.value=d.transmissionMap,t(d.transmissionMap,m.transmissionMapTransform)),m.thickness.value=d.thickness,d.thicknessMap&&(m.thicknessMap.value=d.thicknessMap,t(d.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=d.attenuationDistance,m.attenuationColor.value.copy(d.attenuationColor)),d.anisotropy>0&&(m.anisotropyVector.value.set(d.anisotropy*Math.cos(d.anisotropyRotation),d.anisotropy*Math.sin(d.anisotropyRotation)),d.anisotropyMap&&(m.anisotropyMap.value=d.anisotropyMap,t(d.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=d.specularIntensity,m.specularColor.value.copy(d.specularColor),d.specularColorMap&&(m.specularColorMap.value=d.specularColorMap,t(d.specularColorMap,m.specularColorMapTransform)),d.specularIntensityMap&&(m.specularIntensityMap.value=d.specularIntensityMap,t(d.specularIntensityMap,m.specularIntensityMapTransform))}function g(m,d){d.matcap&&(m.matcap.value=d.matcap)}function v(m,d){let S=e.get(d).light;m.referencePosition.value.setFromMatrixPosition(S.matrixWorld),m.nearDistance.value=S.shadow.camera.near,m.farDistance.value=S.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function V0(i,e,t,n){let s={},r={},a=[],o=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function c(y,b){let T=b.program;n.uniformBlockBinding(y,T)}function l(y,b){let T=s[y.id];T===void 0&&(m(y),T=u(y),s[y.id]=T,y.addEventListener("dispose",S));let I=b.program;n.updateUBOMapping(y,I);let x=e.render.frame;r[y.id]!==x&&(h(y),r[y.id]=x)}function u(y){let b=p();y.__bindingPointIndex=b;let T=i.createBuffer(),I=y.__size,x=y.usage;return i.bindBuffer(i.UNIFORM_BUFFER,T),i.bufferData(i.UNIFORM_BUFFER,I,x),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,b,T),T}function p(){for(let y=0;y<o;y++)if(a.indexOf(y)===-1)return a.push(y),y;return Ze("WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function h(y){let b=s[y.id],T=y.uniforms,I=y.__cache;i.bindBuffer(i.UNIFORM_BUFFER,b);for(let x=0,w=T.length;x<w;x++){let R=T[x];if(Array.isArray(R))for(let O=0,V=R.length;O<V;O++)f(R[O],x,O,I);else f(R,x,0,I)}i.bindBuffer(i.UNIFORM_BUFFER,null)}function f(y,b,T,I){if(v(y,b,T,I)===!0){let x=y.__offset,w=y.value;if(Array.isArray(w)){let R=0;for(let O=0;O<w.length;O++){let V=w[O],W=d(V);g(V,y.__data,R),typeof V!="number"&&typeof V!="boolean"&&!V.isMatrix3&&!ArrayBuffer.isView(V)&&(R+=W.storage/Float32Array.BYTES_PER_ELEMENT)}}else g(w,y.__data,0);i.bufferSubData(i.UNIFORM_BUFFER,x,y.__data)}}function g(y,b,T){typeof y=="number"||typeof y=="boolean"?b[0]=y:y.isMatrix3?(b[0]=y.elements[0],b[1]=y.elements[1],b[2]=y.elements[2],b[3]=0,b[4]=y.elements[3],b[5]=y.elements[4],b[6]=y.elements[5],b[7]=0,b[8]=y.elements[6],b[9]=y.elements[7],b[10]=y.elements[8],b[11]=0):ArrayBuffer.isView(y)?b.set(new y.constructor(y.buffer,y.byteOffset,b.length)):y.toArray(b,T)}function v(y,b,T,I){let x=y.value,w=b+"_"+T;if(I[w]===void 0)return typeof x=="number"||typeof x=="boolean"?I[w]=x:ArrayBuffer.isView(x)?I[w]=x.slice():I[w]=x.clone(),!0;{let R=I[w];if(typeof x=="number"||typeof x=="boolean"){if(R!==x)return I[w]=x,!0}else{if(ArrayBuffer.isView(x))return!0;if(R.equals(x)===!1)return R.copy(x),!0}}return!1}function m(y){let b=y.uniforms,T=0,I=16;for(let w=0,R=b.length;w<R;w++){let O=Array.isArray(b[w])?b[w]:[b[w]];for(let V=0,W=O.length;V<W;V++){let B=O[V],J=Array.isArray(B.value)?B.value:[B.value];for(let ne=0,ie=J.length;ne<ie;ne++){let de=J[ne],j=d(de),oe=T%I,ue=oe%j.boundary,Ve=oe+ue;T+=ue,Ve!==0&&I-Ve<j.storage&&(T+=I-Ve),B.__data=new Float32Array(j.storage/Float32Array.BYTES_PER_ELEMENT),B.__offset=T,T+=j.storage}}}let x=T%I;return x>0&&(T+=I-x),y.__size=T,y.__cache={},this}function d(y){let b={boundary:0,storage:0};return typeof y=="number"||typeof y=="boolean"?(b.boundary=4,b.storage=4):y.isVector2?(b.boundary=8,b.storage=8):y.isVector3||y.isColor?(b.boundary=16,b.storage=12):y.isVector4?(b.boundary=16,b.storage=16):y.isMatrix3?(b.boundary=48,b.storage=48):y.isMatrix4?(b.boundary=64,b.storage=64):y.isTexture?qe("WebGLRenderer: Texture samplers can not be part of an uniforms group."):ArrayBuffer.isView(y)?(b.boundary=16,b.storage=y.byteLength):qe("WebGLRenderer: Unsupported uniform value type.",y),b}function S(y){let b=y.target;b.removeEventListener("dispose",S);let T=a.indexOf(b.__bindingPointIndex);a.splice(T,1),i.deleteBuffer(s[b.id]),delete s[b.id],delete r[b.id]}function E(){for(let y in s)i.deleteBuffer(s[y]);a=[],s={},r={}}return{bind:c,update:l,dispose:E}}var k0=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]),si=null;function H0(){return si===null&&(si=new Sr(k0,16,16,Hi,Yn),si.name="DFG_LUT",si.minFilter=ln,si.magFilter=ln,si.wrapS=Kn,si.wrapT=Kn,si.generateMipmaps=!1,si.needsUpdate=!0),si}var ll=class{constructor(e={}){let{canvas:t=fu(),context:n=null,depth:s=!0,stencil:r=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:l=!1,powerPreference:u="default",failIfMajorPerformanceCaveat:p=!1,reversedDepthBuffer:h=!1,outputBufferType:f=bn}=e;this.isWebGLRenderer=!0;let g;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");g=n.getContextAttributes().alpha}else g=a;let v=f,m=new Set([To,bo,So]),d=new Set([bn,qn,ks,Hs,yo,vo]),S=new Uint32Array(4),E=new Int32Array(4),y=new P,b=null,T=null,I=[],x=[],w=null;this.domElement=t,this.debug={checkShaderErrors:!0,diagnostics:{keywords:!1},onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=Xn,this.toneMappingExposure=1,this.transmissionResolutionScale=1;let R=this,O=!1,V=null,W=null,B=null,J=null;this._outputColorSpace=qt;let ne=0,ie=0,de=null,j=-1,oe=null,ue=new Gt,Ve=new Gt,Ie=null,pt=new We(0),tt=0,rt=t.width,te=t.height,le=1,Ae=null,Je=null,Re=new Gt(0,0,rt,te),nt=new Gt(0,0,rt,te),It=!1,Ke=new Us,lt=!1,mt=!1,it=new gt,Mt=new P,Lt=new Gt,kt={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},wt=!1;function Ut(){return de===null?le:1}let k=n;function Ft(M,G){return t.getContext(M,G)}let ct,C,_,X,q,ee,me,ye,se,ce,ve,Be,xe,Me,De,ke,Qe,z,Se,ae,L,H,A;try{let M={alpha:!0,depth:s,stencil:r,antialias:o,premultipliedAlpha:c,preserveDrawingBuffer:l,powerPreference:u,failIfMajorPerformanceCaveat:p};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${po}`),t.addEventListener("webglcontextlost",F,!1),t.addEventListener("webglcontextrestored",Q,!1),t.addEventListener("webglcontextcreationerror",_e,!1),k===null){let G="webgl2";if(k=Ft(G,M),k===null)throw Ft(G)?new Error("THREE.WebGLRenderer: Error creating WebGL context with your selected attributes."):new Error("THREE.WebGLRenderer: Error creating WebGL context.")}D()}catch(M){throw t.removeEventListener("webglcontextlost",F,!1),t.removeEventListener("webglcontextrestored",Q,!1),t.removeEventListener("webglcontextcreationerror",_e,!1),Ze("WebGLRenderer: "+M.message),M}function D(){ct=new $m(k),ct.init(),L=new F0(k,ct),C=new Gm(k,ct,e,L),_=new N0(k,ct),C.reversedDepthBuffer&&h&&_.buffers.depth.setReversed(!0),W=k.createFramebuffer(),B=k.createFramebuffer(),J=k.createFramebuffer(),X=new jm(k),q=new v0,ee=new U0(k,ct,_,q,C,L,X),me=new Jm(R),ye=new ef(k),H=new Om(k,ye),se=new Km(k,ye,X,H),ce=new tg(k,se,ye,H,X),z=new eg(k,C,ee),De=new Vm(q),ve=new y0(R,me,ct,C,H,De),Be=new G0(R,q),xe=new S0,Me=new C0(ct),Qe=new Bm(R,me,_,ce,g,c),ke=new D0(R,ce,C),A=new V0(k,X,C,_),Se=new zm(k,ct,X),ae=new Qm(k,ct,X),X.programs=ve.programs,R.capabilities=C,R.extensions=ct,R.properties=q,R.renderLists=xe,R.shadowMap=ke,R.state=_,R.info=X}v!==bn&&(w=new ig(v,t.width,t.height,o,s,r));let N=new Hc(R,k);this.xr=N,this.getContext=function(){return k},this.getContextAttributes=function(){return k.getContextAttributes()},this.forceContextLoss=function(){let M=ct.get("WEBGL_lose_context");M&&M.loseContext()},this.forceContextRestore=function(){let M=ct.get("WEBGL_lose_context");M&&M.restoreContext()},this.getPixelRatio=function(){return le},this.setPixelRatio=function(M){M!==void 0&&(le=M,this.setSize(rt,te,!1))},this.getSize=function(M){return M.set(rt,te)},this.setSize=function(M,G,K=!0){if(N.isPresenting){qe("WebGLRenderer: Can't change size while VR device is presenting.");return}rt=M,te=G,t.width=Math.floor(M*le),t.height=Math.floor(G*le),K===!0&&(t.style.width=M+"px",t.style.height=G+"px"),w!==null&&w.setSize(t.width,t.height),this.setViewport(0,0,M,G)},this.getDrawingBufferSize=function(M){return M.set(rt*le,te*le).floor()},this.setDrawingBufferSize=function(M,G,K){rt=M,te=G,le=K,t.width=Math.floor(M*K),t.height=Math.floor(G*K),this.setViewport(0,0,M,G)},this.setEffects=function(M){if(v===bn){Ze("WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(M){for(let G=0;G<M.length;G++)if(M[G].isOutputPass===!0){qe("WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}w.setEffects(M||[])},this.getCurrentViewport=function(M){return M.copy(ue)},this.getViewport=function(M){return M.copy(Re)},this.setViewport=function(M,G,K,Y){M.isVector4?Re.set(M.x,M.y,M.z,M.w):Re.set(M,G,K,Y),_.viewport(ue.copy(Re).multiplyScalar(le).round())},this.getScissor=function(M){return M.copy(nt)},this.setScissor=function(M,G,K,Y){M.isVector4?nt.set(M.x,M.y,M.z,M.w):nt.set(M,G,K,Y),_.scissor(Ve.copy(nt).multiplyScalar(le).round())},this.getScissorTest=function(){return It},this.setScissorTest=function(M){_.setScissorTest(It=M)},this.setOpaqueSort=function(M){Ae=M},this.setTransparentSort=function(M){Je=M},this.getClearColor=function(M){return M.copy(Qe.getClearColor())},this.setClearColor=function(){Qe.setClearColor(...arguments)},this.getClearAlpha=function(){return Qe.getClearAlpha()},this.setClearAlpha=function(){Qe.setClearAlpha(...arguments)},this.clear=function(M=!0,G=!0,K=!0){let Y=0;if(M){let Z=!1;if(de!==null){let Ce=de.texture.format;Z=m.has(Ce)}if(Z){let Ce=de.texture.type,Fe=d.has(Ce),Ee=Qe.getClearColor(),ze=Qe.getClearAlpha(),He=Ee.r,at=Ee.g,ut=Ee.b;Fe?(S[0]=He,S[1]=at,S[2]=ut,S[3]=ze,k.clearBufferuiv(k.COLOR,0,S)):(E[0]=He,E[1]=at,E[2]=ut,E[3]=ze,k.clearBufferiv(k.COLOR,0,E))}else Y|=k.COLOR_BUFFER_BIT}G&&(Y|=k.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),K&&(Y|=k.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),Y!==0&&k.clear(Y)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(M){M.setRenderer(this),V=M},this.dispose=function(){t.removeEventListener("webglcontextlost",F,!1),t.removeEventListener("webglcontextrestored",Q,!1),t.removeEventListener("webglcontextcreationerror",_e,!1),Qe.dispose(),xe.dispose(),Me.dispose(),q.dispose(),me.dispose(),ce.dispose(),H.dispose(),A.dispose(),ve.dispose(),N.dispose(),N.removeEventListener("sessionstart",Ne),N.removeEventListener("sessionend",Ue),Oe.stop()};function F(M){M.preventDefault(),mr("WebGLRenderer: Context Lost."),O=!0}function Q(){mr("WebGLRenderer: Context Restored."),O=!1;let M=X.autoReset,G=ke.enabled,K=ke.autoUpdate,Y=ke.needsUpdate,Z=ke.type;D(),X.autoReset=M,ke.enabled=G,ke.autoUpdate=K,ke.needsUpdate=Y,ke.type=Z}function _e(M){Ze("WebGLRenderer: A WebGL context could not be created. Reason: ",M.statusMessage)}function be(M){let G=M.target;G.removeEventListener("dispose",be),Te(G)}function Te(M){ge(M),q.remove(M)}function ge(M){let G=q.get(M).programs;G!==void 0&&(G.forEach(function(K){ve.releaseProgram(K)}),M.isShaderMaterial&&ve.releaseShaderCache(M))}this.renderBufferDirect=function(M,G,K,Y,Z,Ce){G===null&&(G=kt);let Fe=Z.isMesh&&Z.matrixWorld.determinantAffine()<0,Ee=sn(M,G,K,Y,Z);_.setMaterial(Y,Fe);let ze=K.index,He=1;if(Y.wireframe===!0){if(ze=se.getWireframeAttribute(K),ze===void 0)return;He=2}let at=K.drawRange,ut=K.attributes.position,Ge=at.start*He,bt=(at.start+at.count)*He;Ce!==null&&(Ge=Math.max(Ge,Ce.start*He),bt=Math.min(bt,(Ce.start+Ce.count)*He)),ze!==null?(Ge=Math.max(Ge,0),bt=Math.min(bt,ze.count)):ut!=null&&(Ge=Math.max(Ge,0),bt=Math.min(bt,ut.count));let Zt=bt-Ge;if(Zt<0||Zt===1/0)return;H.setup(Z,Y,Ee,K,ze);let Bt,Pt=Se;if(ze!==null&&(Bt=ye.get(ze),Pt=ae,Pt.setIndex(Bt)),Z.isMesh)Y.wireframe===!0?(_.setLineWidth(Y.wireframeLinewidth*Ut()),Pt.setMode(k.LINES)):Pt.setMode(k.TRIANGLES);else if(Z.isLine){let dn=Y.linewidth;dn===void 0&&(dn=1),_.setLineWidth(dn*Ut()),Z.isLineSegments?Pt.setMode(k.LINES):Z.isLineLoop?Pt.setMode(k.LINE_LOOP):Pt.setMode(k.LINE_STRIP)}else Z.isPoints?Pt.setMode(k.POINTS):Z.isSprite&&Pt.setMode(k.TRIANGLES);if(Z.isBatchedMesh)if(ct.get("WEBGL_multi_draw"))Pt.renderMultiDraw(Z._multiDrawStarts,Z._multiDrawCounts,Z._multiDrawCount);else{let dn=Z._multiDrawStarts,Le=Z._multiDrawCounts,gn=Z._multiDrawCount,yt=ze?ye.get(ze).bytesPerElement:1,Rn=q.get(Y).currentProgram.getUniforms();for(let Zn=0;Zn<gn;Zn++)Rn.setValue(k,"_gl_DrawID",Zn),Pt.render(dn[Zn]/yt,Le[Zn])}else if(Z.isInstancedMesh)Pt.renderInstances(Ge,Zt,Z.count);else if(K.isInstancedBufferGeometry){let dn=K._maxInstanceCount!==void 0?K._maxInstanceCount:1/0,Le=Math.min(K.instanceCount,dn);Pt.renderInstances(Ge,Zt,Le)}else Pt.render(Ge,Zt)};function he(M,G,K,Y){V!==null&&M.isNodeMaterial&&V.setObject(Y,M),lt===!0&&De.setState(M,K,!1),M.transparent===!0&&M.side===Ht&&M.forceSinglePass===!1?(M.side=cn,M.needsUpdate=!0,Qt(M,G,Y),M.side=Oi,M.needsUpdate=!0,Qt(M,G,Y),M.side=Ht):Qt(M,G,Y)}this.compile=function(M,G,K=null){K===null&&(K=M),V!==null&&V.renderStart(M,G,K),T=Me.get(K),T.init(G),x.push(T),K.traverseVisible(function(Z){Z.isLight&&Z.layers.test(G.layers)&&(T.pushLight(Z),Z.castShadow&&T.pushShadow(Z))}),M!==K&&M.traverseVisible(function(Z){Z.isLight&&Z.layers.test(G.layers)&&(T.pushLight(Z),Z.castShadow&&T.pushShadow(Z))}),T.setupLights(),V!==null&&V.updateLights(T.state.lightsArray),mt=this.localClippingEnabled,lt=De.init(this.clippingPlanes,mt),lt===!0&&De.setGlobalState(this.clippingPlanes,G),V!==null&&ke.render(T.state.shadowsArray,K,G);let Y=new Set;return M.traverse(function(Z){if(!(Z.isMesh||Z.isPoints||Z.isLine||Z.isSprite))return;let Ce=Z.material;if(Ce)if(Array.isArray(Ce))for(let Fe=0;Fe<Ce.length;Fe++){let Ee=Ce[Fe];he(Ee,K,G,Z),Y.add(Ee)}else he(Ce,K,G,Z),Y.add(Ce)}),T=x.pop(),V!==null&&V.renderEnd(),Y},this.compileAsync=function(M,G,K=null){let Y=this.compile(M,G,K);return new Promise(Z=>{function Ce(){if(Y.forEach(function(Fe){let ze=q.get(Fe).currentProgram;(ze===void 0||ze.isReady())&&Y.delete(Fe)}),Y.size===0){Z(M);return}setTimeout(Ce,10)}ct.get("KHR_parallel_shader_compile")!==null?Ce():setTimeout(Ce,10)})};let fe=null;function re(M){fe&&fe(M)}function Ne(){Oe.stop()}function Ue(){Oe.start()}let Oe=new Hu;Oe.setAnimationLoop(re),typeof self<"u"&&Oe.setContext(self),this.setAnimationLoop=function(M){fe=M,N.setAnimationLoop(M),M===null?Oe.stop():Oe.start()},N.addEventListener("sessionstart",Ne),N.addEventListener("sessionend",Ue),this.render=function(M,G){if(G!==void 0&&G.isCamera!==!0){Ze("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(O===!0)return;V!==null&&V.renderStart(M,G);let K=N.enabled===!0&&N.isPresenting===!0,Y=w!==null&&(de===null||K)&&w.begin(R,de);if(M.matrixWorldAutoUpdate===!0&&M.updateMatrixWorld(),G.parent===null&&G.matrixWorldAutoUpdate===!0&&G.updateMatrixWorld(),N.enabled===!0&&N.isPresenting===!0&&(w===null||w.isCompositing()===!1)&&(N.cameraAutoUpdate===!0&&N.updateCamera(G),G=N.getCamera()),M.isScene===!0&&M.onBeforeRender(R,M,G,de),T=Me.get(M,x.length),T.init(G),T.state.textureUnits=ee.getTextureUnits(),x.push(T),it.multiplyMatrices(G.projectionMatrix,G.matrixWorldInverse),Ke.setFromProjectionMatrix(it,kn,G.reversedDepth),mt=this.localClippingEnabled,lt=De.init(this.clippingPlanes,mt),b=xe.get(M,I.length),b.init(),I.push(b),N.enabled===!0&&N.isPresenting===!0){let Fe=R.xr.getDepthSensingMesh();Fe!==null&&xt(Fe,G,-1/0,R.sortObjects)}xt(M,G,0,R.sortObjects),b.finish(),V!==null&&V.updateLights(T.state.lightsArray),R.sortObjects===!0&&b.sort(Ae,Je),wt=N.enabled===!1||N.isPresenting===!1||N.hasDepthSensing()===!1,wt&&Qe.addToRenderList(b,M),this.info.render.frame++,this.info.autoReset===!0&&this.info.reset(),lt===!0&&De.beginShadows();let Z=T.state.shadowsArray;if(ke.render(Z,M,G),lt===!0&&De.endShadows(),(Y&&w.hasRenderPass())===!1){let Fe=b.opaque,Ee=b.transmissive;if(T.setupLights(),G.isArrayCamera){let ze=G.cameras;if(Ee.length>0)for(let He=0,at=ze.length;He<at;He++){let ut=ze[He];St(Fe,Ee,M,ut)}wt&&Qe.render(M);for(let He=0,at=ze.length;He<at;He++){let ut=ze[He];Ye(b,M,ut,ut.viewport)}}else Ee.length>0&&St(Fe,Ee,M,G),wt&&Qe.render(M),Ye(b,M,G)}de!==null&&ie===0&&(ee.updateMultisampleRenderTarget(de),ee.updateRenderTargetMipmap(de)),Y&&w.end(R),M.isScene===!0&&M.onAfterRender(R,M,G),H.resetDefaultState(),j=-1,oe=null,x.pop(),x.length>0?(T=x[x.length-1],ee.setTextureUnits(T.state.textureUnits),lt===!0&&De.setGlobalState(R.clippingPlanes,T.state.camera)):T=null,I.pop(),I.length>0?b=I[I.length-1]:b=null,V!==null&&V.renderEnd()};function xt(M,G,K,Y){if(M.visible===!1)return;if(M.layers.test(G.layers)){if(M.isGroup)K=M.renderOrder;else if(M.isLOD)M.autoUpdate===!0&&M.update(G);else if(M.isLightProbeGrid)T.pushLightProbeGrid(M);else if(M.isLight)T.pushLight(M),M.castShadow&&T.pushShadow(M);else if(M.isSprite){if(!M.frustumCulled||M.intersectsFrustum(Ke)){Y&&Lt.setFromMatrixPosition(M.matrixWorld).applyMatrix4(it);let Fe=ce.update(M),Ee=M.material;Ee.visible&&b.push(M,Fe,Ee,K,Lt.z,null,G)}}else if((M.isMesh||M.isLine||M.isPoints)&&(!M.frustumCulled||M.intersectsFrustum(Ke))){let Fe=ce.update(M),Ee=M.material;if(Y&&(M.boundingSphere!==void 0?(M.boundingSphere===null&&M.computeBoundingSphere(),Lt.copy(M.boundingSphere.center)):(Fe.boundingSphere===null&&Fe.computeBoundingSphere(),Lt.copy(Fe.boundingSphere.center)),Lt.applyMatrix4(M.matrixWorld).applyMatrix4(it)),Array.isArray(Ee)){let ze=Fe.groups;for(let He=0,at=ze.length;He<at;He++){let ut=ze[He],Ge=Ee[ut.materialIndex];Ge&&Ge.visible&&b.push(M,Fe,Ge,K,Lt.z,ut,G)}}else Ee.visible&&b.push(M,Fe,Ee,K,Lt.z,null,G)}}let Ce=M.children;for(let Fe=0,Ee=Ce.length;Fe<Ee;Fe++)xt(Ce[Fe],G,K,Y)}function Ye(M,G,K,Y){let{opaque:Z,transmissive:Ce,transparent:Fe}=M;T.setupLightsView(K),lt===!0&&De.setGlobalState(R.clippingPlanes,K),Y&&_.viewport(ue.copy(Y)),Z.length>0&&At(Z,G,K),Ce.length>0&&At(Ce,G,K),Fe.length>0&&At(Fe,G,K),_.buffers.depth.setTest(!0),_.buffers.depth.setMask(!0),_.buffers.color.setMask(!0),_.setPolygonOffset(!1)}function St(M,G,K,Y){if((K.isScene===!0?K.overrideMaterial:null)!==null)return;if(T.state.transmissionRenderTarget[Y.id]===void 0){let Ge=ct.has("EXT_color_buffer_half_float")||ct.has("EXT_color_buffer_float");T.state.transmissionRenderTarget[Y.id]=new Mn(1,1,{generateMipmaps:!0,type:Ge?Yn:bn,minFilter:Vi,samples:Math.max(4,C.samples),stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,colorSpace:dt.workingColorSpace})}let Ce=T.state.transmissionRenderTarget[Y.id],Fe=Y.viewport||ue;Ce.setSize(Fe.z*R.transmissionResolutionScale,Fe.w*R.transmissionResolutionScale);let Ee=R.getRenderTarget(),ze=R.getActiveCubeFace(),He=R.getActiveMipmapLevel();R.setRenderTarget(Ce),R.getClearColor(pt),tt=R.getClearAlpha(),tt<1&&R.setClearColor(16777215,.5),R.clear(),wt&&Qe.render(K);let at=R.toneMapping;R.toneMapping=Xn;let ut=Y.viewport;if(Y.viewport!==void 0&&(Y.viewport=void 0),T.setupLightsView(Y),lt===!0&&De.setGlobalState(R.clippingPlanes,Y),At(M,K,Y),ee.updateMultisampleRenderTarget(Ce),ee.updateRenderTargetMipmap(Ce),ct.has("WEBGL_multisampled_render_to_texture")===!1){let Ge=!1;for(let bt=0,Zt=G.length;bt<Zt;bt++){let Bt=G[bt],{object:Pt,geometry:dn,material:Le,group:gn}=Bt;if(Le.side===Ht&&Pt.layers.test(Y.layers)){let yt=Le.side;Le.side=cn,Le.needsUpdate=!0,Kt(Pt,K,Y,dn,Le,gn),Le.side=yt,Le.needsUpdate=!0,Ge=!0}}Ge===!0&&(ee.updateMultisampleRenderTarget(Ce),ee.updateRenderTargetMipmap(Ce))}R.setRenderTarget(Ee,ze,He),R.setClearColor(pt,tt),ut!==void 0&&(Y.viewport=ut),R.toneMapping=at}function At(M,G,K){let Y=G.isScene===!0?G.overrideMaterial:null;for(let Z=0,Ce=M.length;Z<Ce;Z++){let Fe=M[Z],{object:Ee,geometry:ze,group:He}=Fe,at=Fe.material;at.allowOverride===!0&&Y!==null&&(at=Y),Ee.layers.test(K.layers)&&Kt(Ee,G,K,ze,at,He)}}function Kt(M,G,K,Y,Z,Ce){V!==null&&Z.isNodeMaterial&&V.setObject(M,Z),M.onBeforeRender(R,G,K,Y,Z,Ce),M.modelViewMatrix.multiplyMatrices(K.matrixWorldInverse,M.matrixWorld),M.normalMatrix.getNormalMatrix(M.modelViewMatrix),Z.onBeforeRender(R,G,K,Y,M,Ce),Z.transparent===!0&&Z.side===Ht&&Z.forceSinglePass===!1?(Z.side=cn,Z.needsUpdate=!0,R.renderBufferDirect(K,G,Y,Z,M,Ce),Z.side=Oi,Z.needsUpdate=!0,R.renderBufferDirect(K,G,Y,Z,M,Ce),Z.side=Ht):R.renderBufferDirect(K,G,Y,Z,M,Ce),M.onAfterRender(R,G,K,Y,Z,Ce)}function Qt(M,G,K){G.isScene!==!0&&(G=kt);let Y=q.get(M),Z=T.state.lights,Ce=T.state.shadowsArray,Fe=Z.state.version,Ee=ve.getParameters(M,Z.state,Ce,G,K,T.state.lightProbeGridArray),ze=ve.getProgramCacheKey(Ee),He=Y.programs;Y.environment=M.isMeshStandardMaterial||M.isMeshLambertMaterial||M.isMeshPhongMaterial?G.environment:null,Y.fog=G.fog;let at=M.isMeshStandardMaterial||M.isMeshLambertMaterial&&!M.envMap||M.isMeshPhongMaterial&&!M.envMap;Y.envMap=me.get(M.envMap||Y.environment,at),Y.envMapRotation=Y.environment!==null&&M.envMap===null?G.environmentRotation:M.envMapRotation,He===void 0&&(M.addEventListener("dispose",be),He=new Map,Y.programs=He);let ut=He.get(ze);if(ut!==void 0){if(Y.currentProgram===ut&&Y.lightsStateVersion===Fe)return Mi(M,Ee),ut}else Ee.uniforms=ve.getUniforms(M),V!==null&&M.isNodeMaterial&&V.build(M,K,Ee),M.onBeforeCompile(Ee,R),ut=ve.acquireProgram(Ee,ze),He.set(ze,ut),Y.uniforms=Ee.uniforms;let Ge=Y.uniforms;return(!M.isShaderMaterial&&!M.isRawShaderMaterial||M.clipping===!0)&&(Ge.clippingPlanes=De.uniform),Mi(M,Ee),Y.needsLights=Kr(M),Y.lightsStateVersion=Fe,Y.needsLights&&(Ge.ambientLightColor.value=Z.state.ambient,Ge.lightProbe.value=Z.state.probe,Ge.sunLights.value=Z.state.sun,Ge.sunLightShadows.value=Z.state.sunShadow,Ge.directionalLights.value=Z.state.directional,Ge.directionalLightShadows.value=Z.state.directionalShadow,Ge.spotLights.value=Z.state.spot,Ge.spotLightShadows.value=Z.state.spotShadow,Ge.rectAreaLights.value=Z.state.rectArea,Ge.ltc_1.value=Z.state.rectAreaLTC1,Ge.ltc_2.value=Z.state.rectAreaLTC2,Ge.pointLights.value=Z.state.point,Ge.pointLightShadows.value=Z.state.pointShadow,Ge.hemisphereLights.value=Z.state.hemi,Ge.sunShadowMatrix.value=Z.state.sunShadowMatrix,Ge.sunShadowCascade.value=Z.state.sunShadowCascade,Ge.directionalShadowMatrix.value=Z.state.directionalShadowMatrix,Ge.spotLightMatrix.value=Z.state.spotLightMatrix,Ge.spotLightMap.value=Z.state.spotLightMap,Ge.pointShadowMatrix.value=Z.state.pointShadowMatrix),Y.lightProbeGrid=T.state.lightProbeGridArray.length>0,Y.currentProgram=ut,Y.uniformsList=null,ut}function $s(M){if(M.uniformsList===null){let G=M.currentProgram.getUniforms();M.uniformsList=qs.seqWithValue(G.seq,M.uniforms)}return M.uniformsList}function Mi(M,G){let K=q.get(M);K.outputColorSpace=G.outputColorSpace,K.batching=G.batching,K.batchingColor=G.batchingColor,K.instancing=G.instancing,K.instancingColor=G.instancingColor,K.instancingMorph=G.instancingMorph,K.skinning=G.skinning,K.morphTargets=G.morphTargets,K.morphNormals=G.morphNormals,K.morphColors=G.morphColors,K.morphTargetsCount=G.morphTargetsCount,K.numClippingPlanes=G.numClippingPlanes,K.numIntersection=G.numClipIntersection,K.vertexAlphas=G.vertexAlphas,K.vertexTangents=G.vertexTangents,K.toneMapping=G.toneMapping}function Ks(M,G){if(M.length===0)return null;if(M.length===1)return M[0].texture!==null?M[0]:null;y.setFromMatrixPosition(G.matrixWorld);for(let K=0,Y=M.length;K<Y;K++){let Z=M[K];if(Z.texture!==null&&Z.boundingBox.containsPoint(y))return Z}return null}function sn(M,G,K,Y,Z){G.isScene!==!0&&(G=kt),ee.resetTextureUnits();let Ce=G.fog,Fe=Y.isMeshStandardMaterial||Y.isMeshLambertMaterial||Y.isMeshPhongMaterial?G.environment:null,Ee=de===null?R.outputColorSpace:de.isXRRenderTarget===!0?de.texture.colorSpace:dt.workingColorSpace,ze=Y.isMeshStandardMaterial||Y.isMeshLambertMaterial&&!Y.envMap||Y.isMeshPhongMaterial&&!Y.envMap,He=me.get(Y.envMap||Fe,ze),at=Y.vertexColors===!0&&!!K.attributes.color&&K.attributes.color.itemSize===4,ut=!!K.attributes.tangent&&(!!Y.normalMap||Y.anisotropy>0),Ge=!!K.morphAttributes.position,bt=!!K.morphAttributes.normal,Zt=!!K.morphAttributes.color,Bt=Xn;Y.toneMapped&&(de===null||de.isXRRenderTarget===!0)&&(Bt=R.toneMapping);let Pt=K.morphAttributes.position||K.morphAttributes.normal||K.morphAttributes.color,dn=Pt!==void 0?Pt.length:0,Le=q.get(Y),gn=T.state.lights;if(lt===!0&&(mt===!0||M!==oe)){let Dt=M===oe&&Y.id===j;De.setState(Y,M,Dt)}let yt=!1;Y.version===Le.__version?(Le.needsLights&&Le.lightsStateVersion!==gn.state.version||Le.outputColorSpace!==Ee||Z.isBatchedMesh&&Le.batching===!1||!Z.isBatchedMesh&&Le.batching===!0||Z.isBatchedMesh&&Le.batchingColor===!0&&Z._colorsTexture===null||Z.isBatchedMesh&&Le.batchingColor===!1&&Z._colorsTexture!==null||Z.isInstancedMesh&&Le.instancing===!1||!Z.isInstancedMesh&&Le.instancing===!0||Z.isSkinnedMesh&&Le.skinning===!1||!Z.isSkinnedMesh&&Le.skinning===!0||Z.isInstancedMesh&&Le.instancingColor===!0&&Z.instanceColor===null||Z.isInstancedMesh&&Le.instancingColor===!1&&Z.instanceColor!==null||Z.isInstancedMesh&&Le.instancingMorph===!0&&Z.morphTexture===null||Z.isInstancedMesh&&Le.instancingMorph===!1&&Z.morphTexture!==null||Le.envMap!==He||Y.fog===!0&&Le.fog!==Ce||Le.numClippingPlanes!==void 0&&(Le.numClippingPlanes!==De.numPlanes||Le.numIntersection!==De.numIntersection)||Le.vertexAlphas!==at||Le.vertexTangents!==ut||Le.morphTargets!==Ge||Le.morphNormals!==bt||Le.morphColors!==Zt||Le.toneMapping!==Bt||Le.morphTargetsCount!==dn||!!Le.lightProbeGrid!=T.state.lightProbeGridArray.length>0)&&(yt=!0):(yt=!0,Le.__version=Y.version);let Rn=Le.currentProgram;yt===!0&&(Rn=Qt(Y,G,Z),V&&Y.isNodeMaterial&&V.onUpdateProgram(Y,Rn,Le));let Zn=!1,Si=!1,ls=!1,Et=Rn.getUniforms(),Xt=Le.uniforms;if(_.useProgram(Rn.program)&&(Zn=!0,Si=!0,ls=!0),Y.id!==j&&(j=Y.id,Si=!0),Le.needsLights){let Dt=Ks(T.state.lightProbeGridArray,Z);Le.lightProbeGrid!==Dt&&(Le.lightProbeGrid=Dt,Si=!0)}if(Zn||oe!==M){_.buffers.depth.getReversed()&&M.reversedDepth!==!0&&(M._reversedDepth=!0,M.updateProjectionMatrix()),Et.setValue(k,"projectionMatrix",M.projectionMatrix),Et.setValue(k,"viewMatrix",M.matrixWorldInverse);let Ti=Et.map.cameraPosition;Ti!==void 0&&Ti.setValue(k,Mt.setFromMatrixPosition(M.matrixWorld)),C.logarithmicDepthBuffer&&Et.setValue(k,"logDepthBufFC",2/(Math.log(M.far+1)/Math.LN2)),(Y.isMeshPhongMaterial||Y.isMeshToonMaterial||Y.isMeshLambertMaterial||Y.isMeshBasicMaterial||Y.isMeshStandardMaterial||Y.isShaderMaterial)&&Et.setValue(k,"isOrthographic",M.isOrthographicCamera===!0),oe!==M&&(oe=M,Si=!0,ls=!0)}if(Le.needsLights&&(gn.state.sunShadowMap.length>0&&Et.setValue(k,"sunShadowMap",gn.state.sunShadowMap,ee),gn.state.directionalShadowMap.length>0&&Et.setValue(k,"directionalShadowMap",gn.state.directionalShadowMap,ee),gn.state.spotShadowMap.length>0&&Et.setValue(k,"spotShadowMap",gn.state.spotShadowMap,ee),gn.state.pointShadowMap.length>0&&Et.setValue(k,"pointShadowMap",gn.state.pointShadowMap,ee)),Z.isSkinnedMesh){Et.setOptional(k,Z,"bindMatrix"),Et.setOptional(k,Z,"bindMatrixInverse");let Dt=Z.skeleton;Dt&&(Dt.boneTexture===null&&Dt.computeBoneTexture(),Et.setValue(k,"boneTexture",Dt.boneTexture,ee))}Z.isBatchedMesh&&(Et.setOptional(k,Z,"batchingTexture"),Et.setValue(k,"batchingTexture",Z._matricesTexture,ee),Et.setOptional(k,Z,"batchingIdTexture"),Et.setValue(k,"batchingIdTexture",Z._indirectTexture,ee),Et.setOptional(k,Z,"batchingColorTexture"),Z._colorsTexture!==null&&Et.setValue(k,"batchingColorTexture",Z._colorsTexture,ee));let bi=K.morphAttributes;if((bi.position!==void 0||bi.normal!==void 0||bi.color!==void 0)&&z.update(Z,K,Rn),(Si||Le.receiveShadow!==Z.receiveShadow)&&(Le.receiveShadow=Z.receiveShadow,Et.setValue(k,"receiveShadow",Z.receiveShadow)),(Y.isMeshStandardMaterial||Y.isMeshLambertMaterial||Y.isMeshPhongMaterial)&&Y.envMap===null&&G.environment!==null&&(Xt.envMapIntensity.value=G.environmentIntensity),Xt.dfgLUT!==void 0&&(Xt.dfgLUT.value=H0()),Si){if(Et.setValue(k,"toneMappingExposure",R.toneMappingExposure),Le.needsLights&&Qs(Xt,ls),Ce&&Y.fog===!0&&Be.refreshFogUniforms(Xt,Ce),Be.refreshMaterialUniforms(Xt,Y,le,te,T.state.transmissionRenderTarget[M.id]),Le.needsLights&&Le.lightProbeGrid){let Dt=Le.lightProbeGrid;Xt.probesSH.value=Dt.texture,Xt.probesMin.value.copy(Dt.boundingBox.min),Xt.probesMax.value.copy(Dt.boundingBox.max),Xt.probesResolution.value.copy(Dt.resolution)}qs.upload(k,$s(Le),Xt,ee)}if(Y.isShaderMaterial&&Y.uniformsNeedUpdate===!0&&(qs.upload(k,$s(Le),Xt,ee),Y.uniformsNeedUpdate=!1),Y.isSpriteMaterial&&Et.setValue(k,"center",Z.center),Et.setValue(k,"modelViewMatrix",Z.modelViewMatrix),Et.setValue(k,"normalMatrix",Z.normalMatrix),Et.setValue(k,"modelMatrix",Z.matrixWorld),Y.uniformsGroups!==void 0){let Dt=Y.uniformsGroups;for(let Ti=0,cs=Dt.length;Ti<cs;Ti++){let Kc=Dt[Ti];A.update(Kc,Rn),A.bind(Kc,Rn)}}return Rn}function Qs(M,G){M.ambientLightColor.needsUpdate=G,M.lightProbe.needsUpdate=G,M.sunLights.needsUpdate=G,M.sunLightShadows.needsUpdate=G,M.directionalLights.needsUpdate=G,M.directionalLightShadows.needsUpdate=G,M.pointLights.needsUpdate=G,M.pointLightShadows.needsUpdate=G,M.spotLights.needsUpdate=G,M.spotLightShadows.needsUpdate=G,M.rectAreaLights.needsUpdate=G,M.hemisphereLights.needsUpdate=G}function Kr(M){return M.isMeshLambertMaterial||M.isMeshToonMaterial||M.isMeshPhongMaterial||M.isMeshStandardMaterial||M.isShadowMaterial||M.isShaderMaterial&&M.lights===!0}this.getActiveCubeFace=function(){return ne},this.getActiveMipmapLevel=function(){return ie},this.getRenderTarget=function(){return de},this.setRenderTargetTextures=function(M,G,K){let Y=q.get(M);Y.__autoAllocateDepthBuffer=M.resolveDepthBuffer===!1,Y.__autoAllocateDepthBuffer===!1&&(Y.__useRenderToTexture=!1),q.get(M.texture).__webglTexture=G,q.get(M.depthTexture).__webglTexture=Y.__autoAllocateDepthBuffer?void 0:K,Y.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(M,G){let K=q.get(M);K.__webglFramebuffer=G,K.__useDefaultFramebuffer=G===void 0},this.setRenderTarget=function(M,G=0,K=0){de=M,ne=G,ie=K;let Y=null,Z=!1,Ce=!1;if(M){let Ee=q.get(M);if(Ee.__useDefaultFramebuffer!==void 0){_.bindFramebuffer(k.FRAMEBUFFER,Ee.__webglFramebuffer),ue.copy(M.viewport),Ve.copy(M.scissor),Ie=M.scissorTest,_.viewport(ue),_.scissor(Ve),_.setScissorTest(Ie),j=-1;return}else if(Ee.__webglFramebuffer===void 0)ee.setupRenderTarget(M);else if(Ee.__hasExternalTextures)ee.rebindTextures(M,q.get(M.texture).__webglTexture,q.get(M.depthTexture).__webglTexture);else if(M.depthBuffer){let at=M.depthTexture;if(Ee.__boundDepthTexture!==at){if(at!==null&&q.has(at)&&(M.width!==at.image.width||M.height!==at.image.height))throw new Error("THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.");ee.setupDepthRenderbuffer(M)}}let ze=M.texture;(ze.isData3DTexture||ze.isDataArrayTexture||ze.isCompressedArrayTexture)&&(Ce=!0);let He=q.get(M).__webglFramebuffer;M.isWebGLCubeRenderTarget?(Array.isArray(He[G])?Y=He[G][K]:Y=He[G],Z=!0):M.samples>0&&ee.useMultisampledRTT(M)===!1?Y=q.get(M).__webglMultisampledFramebuffer:Array.isArray(He)?Y=He[K]:Y=He,ue.copy(M.viewport),Ve.copy(M.scissor),Ie=M.scissorTest}else ue.copy(Re).multiplyScalar(le).floor(),Ve.copy(nt).multiplyScalar(le).floor(),Ie=It;if(K!==0&&(Y=W),_.bindFramebuffer(k.FRAMEBUFFER,Y)&&_.drawBuffers(M,Y),_.viewport(ue),_.scissor(Ve),_.setScissorTest(Ie),Z){let Ee=q.get(M.texture);k.framebufferTexture2D(k.FRAMEBUFFER,k.COLOR_ATTACHMENT0,k.TEXTURE_CUBE_MAP_POSITIVE_X+G,Ee.__webglTexture,K)}else if(Ce){let Ee=G;for(let ze=0;ze<M.textures.length;ze++){let He=q.get(M.textures[ze]);k.framebufferTextureLayer(k.FRAMEBUFFER,k.COLOR_ATTACHMENT0+ze,He.__webglTexture,K,Ee)}}else if(M!==null&&K!==0){let Ee=q.get(M.texture);k.framebufferTexture2D(k.FRAMEBUFFER,k.COLOR_ATTACHMENT0,k.TEXTURE_2D,Ee.__webglTexture,K)}j=-1};function $c(M){let G=q.get(M);return(G.__readFormat!==M.format||G.__readType!==M.type)&&(G.__readFormat=M.format,G.__readType=M.type,G.__formatReadable=C.textureFormatReadable(M.format),G.__typeReadable=C.textureTypeReadable(M.type)),G}this.readRenderTargetPixels=function(M,G,K,Y,Z,Ce,Fe,Ee=0){if(!(M&&M.isWebGLRenderTarget)){Ze("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let ze=q.get(M).__webglFramebuffer;if(M.isWebGLCubeRenderTarget&&Fe!==void 0&&(ze=ze[Fe]),ze){_.bindFramebuffer(k.FRAMEBUFFER,ze);try{let He=M.textures[Ee],at=He.format,ut=He.type;M.textures.length>1&&k.readBuffer(k.COLOR_ATTACHMENT0+Ee);let Ge=$c(He);if(Ge.__formatReadable===!1){Ze("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(Ge.__typeReadable===!1){Ze("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}G>=0&&G<=M.width-Y&&K>=0&&K<=M.height-Z&&k.readPixels(G,K,Y,Z,L.convert(at),L.convert(ut),Ce)}finally{let He=de!==null?q.get(de).__webglFramebuffer:null;_.bindFramebuffer(k.FRAMEBUFFER,He)}}},this.readRenderTargetPixelsAsync=async function(M,G,K,Y,Z,Ce,Fe,Ee=0){if(!(M&&M.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let ze=q.get(M).__webglFramebuffer;if(M.isWebGLCubeRenderTarget&&Fe!==void 0&&(ze=ze[Fe]),ze)if(G>=0&&G<=M.width-Y&&K>=0&&K<=M.height-Z){_.bindFramebuffer(k.FRAMEBUFFER,ze);let He=M.textures[Ee],at=He.format,ut=He.type;M.textures.length>1&&k.readBuffer(k.COLOR_ATTACHMENT0+Ee);let Ge=$c(He);if(Ge.__formatReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(Ge.__typeReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");let bt=k.createBuffer();k.bindBuffer(k.PIXEL_PACK_BUFFER,bt),k.bufferData(k.PIXEL_PACK_BUFFER,Ce.byteLength,k.STREAM_READ),k.readPixels(G,K,Y,Z,L.convert(at),L.convert(ut),0),k.bindBuffer(k.PIXEL_PACK_BUFFER,null);let Zt=de!==null?q.get(de).__webglFramebuffer:null;_.bindFramebuffer(k.FRAMEBUFFER,Zt);let Bt=k.fenceSync(k.SYNC_GPU_COMMANDS_COMPLETE,0);return k.flush(),await mu(k,Bt,4),k.bindBuffer(k.PIXEL_PACK_BUFFER,bt),k.getBufferSubData(k.PIXEL_PACK_BUFFER,0,Ce),k.bindBuffer(k.PIXEL_PACK_BUFFER,null),k.deleteBuffer(bt),k.deleteSync(Bt),Ce}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(M,G=null,K=0){let Y=Math.pow(2,-K),Z=Math.floor(M.image.width*Y),Ce=Math.floor(M.image.height*Y),Fe=G!==null?G.x:0,Ee=G!==null?G.y:0;ee.setTexture2D(M,0),k.copyTexSubImage2D(k.TEXTURE_2D,K,0,0,Fe,Ee,Z,Ce),_.unbindTexture()},this.copyTextureToTexture=function(M,G,K=null,Y=null,Z=0,Ce=0){let Fe,Ee,ze,He,at,ut,Ge,bt,Zt,Bt=M.isCompressedTexture?M.mipmaps[Ce]:M.image;if(K!==null)Fe=K.max.x-K.min.x,Ee=K.max.y-K.min.y,ze=K.isBox3?K.max.z-K.min.z:1,He=K.min.x,at=K.min.y,ut=K.isBox3?K.min.z:0;else{let Xt=Math.pow(2,-Z);Fe=Math.floor(Bt.width*Xt),Ee=Math.floor(Bt.height*Xt),M.isDataArrayTexture?ze=Bt.depth:M.isData3DTexture?ze=Math.floor(Bt.depth*Xt):ze=1,He=0,at=0,ut=0}Y!==null?(Ge=Y.x,bt=Y.y,Zt=Y.z):(Ge=0,bt=0,Zt=0);let Pt=L.convert(G.format),dn=L.convert(G.type),Le;G.isData3DTexture?(ee.setTexture3D(G,0),Le=k.TEXTURE_3D):G.isDataArrayTexture||G.isCompressedArrayTexture?(ee.setTexture2DArray(G,0),Le=k.TEXTURE_2D_ARRAY):(ee.setTexture2D(G,0),Le=k.TEXTURE_2D),_.activeTexture(k.TEXTURE0),_.pixelStorei(k.UNPACK_FLIP_Y_WEBGL,G.flipY),_.pixelStorei(k.UNPACK_PREMULTIPLY_ALPHA_WEBGL,G.premultiplyAlpha),_.pixelStorei(k.UNPACK_ALIGNMENT,G.unpackAlignment);let gn=_.getParameter(k.UNPACK_ROW_LENGTH),yt=_.getParameter(k.UNPACK_IMAGE_HEIGHT),Rn=_.getParameter(k.UNPACK_SKIP_PIXELS),Zn=_.getParameter(k.UNPACK_SKIP_ROWS),Si=_.getParameter(k.UNPACK_SKIP_IMAGES);_.pixelStorei(k.UNPACK_ROW_LENGTH,Bt.width),_.pixelStorei(k.UNPACK_IMAGE_HEIGHT,Bt.height),_.pixelStorei(k.UNPACK_SKIP_PIXELS,He),_.pixelStorei(k.UNPACK_SKIP_ROWS,at),_.pixelStorei(k.UNPACK_SKIP_IMAGES,ut);let ls=M.isDataArrayTexture||M.isData3DTexture,Et=G.isDataArrayTexture||G.isData3DTexture;if(M.isDepthTexture){let Xt=q.get(M),bi=q.get(G),Dt=q.get(Xt.__renderTarget),Ti=q.get(bi.__renderTarget);_.bindFramebuffer(k.READ_FRAMEBUFFER,Dt.__webglFramebuffer),_.bindFramebuffer(k.DRAW_FRAMEBUFFER,Ti.__webglFramebuffer);for(let cs=0;cs<ze;cs++)ls&&(k.framebufferTextureLayer(k.READ_FRAMEBUFFER,k.COLOR_ATTACHMENT0,q.get(M).__webglTexture,Z,ut+cs),k.framebufferTextureLayer(k.DRAW_FRAMEBUFFER,k.COLOR_ATTACHMENT0,q.get(G).__webglTexture,Ce,Zt+cs)),k.blitFramebuffer(He,at,Fe,Ee,Ge,bt,Fe,Ee,k.DEPTH_BUFFER_BIT,k.NEAREST);_.bindFramebuffer(k.READ_FRAMEBUFFER,null),_.bindFramebuffer(k.DRAW_FRAMEBUFFER,null)}else if(Z!==0||M.isRenderTargetTexture||q.has(M)){let Xt=q.get(M),bi=q.get(G);_.bindFramebuffer(k.READ_FRAMEBUFFER,B),_.bindFramebuffer(k.DRAW_FRAMEBUFFER,J);for(let Dt=0;Dt<ze;Dt++)ls?k.framebufferTextureLayer(k.READ_FRAMEBUFFER,k.COLOR_ATTACHMENT0,Xt.__webglTexture,Z,ut+Dt):k.framebufferTexture2D(k.READ_FRAMEBUFFER,k.COLOR_ATTACHMENT0,k.TEXTURE_2D,Xt.__webglTexture,Z),Et?k.framebufferTextureLayer(k.DRAW_FRAMEBUFFER,k.COLOR_ATTACHMENT0,bi.__webglTexture,Ce,Zt+Dt):k.framebufferTexture2D(k.DRAW_FRAMEBUFFER,k.COLOR_ATTACHMENT0,k.TEXTURE_2D,bi.__webglTexture,Ce),Z!==0?k.blitFramebuffer(He,at,Fe,Ee,Ge,bt,Fe,Ee,k.COLOR_BUFFER_BIT,k.NEAREST):Et?k.copyTexSubImage3D(Le,Ce,Ge,bt,Zt+Dt,He,at,Fe,Ee):k.copyTexSubImage2D(Le,Ce,Ge,bt,He,at,Fe,Ee);_.bindFramebuffer(k.READ_FRAMEBUFFER,null),_.bindFramebuffer(k.DRAW_FRAMEBUFFER,null)}else Et?M.isDataTexture||M.isData3DTexture?k.texSubImage3D(Le,Ce,Ge,bt,Zt,Fe,Ee,ze,Pt,dn,Bt.data):G.isCompressedArrayTexture?k.compressedTexSubImage3D(Le,Ce,Ge,bt,Zt,Fe,Ee,ze,Pt,Bt.data):k.texSubImage3D(Le,Ce,Ge,bt,Zt,Fe,Ee,ze,Pt,dn,Bt):M.isDataTexture?k.texSubImage2D(k.TEXTURE_2D,Ce,Ge,bt,Fe,Ee,Pt,dn,Bt.data):M.isCompressedTexture?k.compressedTexSubImage2D(k.TEXTURE_2D,Ce,Ge,bt,Bt.width,Bt.height,Pt,Bt.data):k.texSubImage2D(k.TEXTURE_2D,Ce,Ge,bt,Fe,Ee,Pt,dn,Bt);_.pixelStorei(k.UNPACK_ROW_LENGTH,gn),_.pixelStorei(k.UNPACK_IMAGE_HEIGHT,yt),_.pixelStorei(k.UNPACK_SKIP_PIXELS,Rn),_.pixelStorei(k.UNPACK_SKIP_ROWS,Zn),_.pixelStorei(k.UNPACK_SKIP_IMAGES,Si),Ce===0&&G.generateMipmaps&&k.generateMipmap(Le),_.unbindTexture()},this.initRenderTarget=function(M){q.get(M).__webglFramebuffer===void 0&&ee.setupRenderTarget(M)},this.initTexture=function(M){M.isCubeTexture?ee.setTextureCube(M,0):M.isData3DTexture?ee.setTexture3D(M,0):M.isDataArrayTexture||M.isCompressedArrayTexture?ee.setTexture2DArray(M,0):ee.setTexture2D(M,0),_.unbindTexture()},this.resetState=function(){ne=0,ie=0,de=null,_.reset(),H.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return kn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;let t=this.getContext();t.drawingBufferColorSpace=dt._getDrawingBufferColorSpace(e),t.unpackColorSpace=dt._getUnpackColorSpace()}};var Jr=new P;function Nn(i,e,t,n,s,r){let a=2*Math.PI*s/4,o=Math.max(r-2*s,0),c=Math.PI/4;Jr.copy(e),Jr[n]=0,Jr.normalize();let l=.5*a/(a+o),u=1-Jr.angleTo(i)/c;return Math.sign(Jr[t])===1?u*l:o/(a+o)+l+l*(1-u)}var Un=class i extends pe{constructor(e=1,t=1,n=1,s=2,r=.1){let a=s*2+1;if(r=Math.min(e/2,t/2,n/2,r),super(1,1,1,a,a,a),this.type="RoundedBoxGeometry",this.parameters={width:e,height:t,depth:n,segments:s,radius:r},a===1)return;let o=this.toNonIndexed();this.index=null,this.attributes.position=o.attributes.position,this.attributes.normal=o.attributes.normal,this.attributes.uv=o.attributes.uv;let c=new P,l=new P,u=new P(e,t,n).divideScalar(2).subScalar(r),p=this.attributes.position.array,h=this.attributes.normal.array,f=this.attributes.uv.array,g=p.length/6,v=new P,m=.5/a;for(let d=0,S=0;d<p.length;d+=3,S+=2)switch(c.fromArray(p,d),l.copy(c),l.x-=Math.sign(l.x)*m,l.y-=Math.sign(l.y)*m,l.z-=Math.sign(l.z)*m,l.normalize(),p[d+0]=u.x*Math.sign(c.x)+l.x*r,p[d+1]=u.y*Math.sign(c.y)+l.y*r,p[d+2]=u.z*Math.sign(c.z)+l.z*r,h[d+0]=l.x,h[d+1]=l.y,h[d+2]=l.z,Math.floor(d/g)){case 0:v.set(1,0,0),f[S+0]=Nn(v,l,"z","y",r,n),f[S+1]=1-Nn(v,l,"y","z",r,t);break;case 1:v.set(-1,0,0),f[S+0]=1-Nn(v,l,"z","y",r,n),f[S+1]=1-Nn(v,l,"y","z",r,t);break;case 2:v.set(0,1,0),f[S+0]=1-Nn(v,l,"x","z",r,e),f[S+1]=Nn(v,l,"z","x",r,n);break;case 3:v.set(0,-1,0),f[S+0]=1-Nn(v,l,"x","z",r,e),f[S+1]=1-Nn(v,l,"z","x",r,n);break;case 4:v.set(0,0,1),f[S+0]=1-Nn(v,l,"x","y",r,e),f[S+1]=1-Nn(v,l,"y","x",r,t);break;case 5:v.set(0,0,-1),f[S+0]=Nn(v,l,"x","y",r,e),f[S+1]=1-Nn(v,l,"y","x",r,t);break}}static fromJSON(e){return new i(e.width,e.height,e.depth,e.segments,e.radius)}};var hn=(i,e,t)=>Math.min(t,Math.max(e,i)),vi=(i,e,t)=>i+(e-i)*t,Cn=(i,e)=>1-Math.exp(-i*e);function Fn(i){let e=i|0;return()=>{e=e+1831565813|0;let t=Math.imul(e^e>>>15,1|e);return t=t+Math.imul(t^t>>>7,61|t)^t,((t^t>>>14)>>>0)/4294967296}}function Wt(i,e,t,n){let s=document.createElement("canvas");s.width=i,s.height=e,t(s.getContext("2d"),i,e);let r=new mi(s);return r.colorSpace=qt,r.anisotropy=8,n&&(r.wrapS=r.wrapT=Ii,r.repeat.set(...n)),r}function $r(){return Wt(64,64,(i,e,t)=>{let n=i.createRadialGradient(e/2,t/2,0,e/2,t/2,e/2);n.addColorStop(0,"rgba(255,255,255,1)"),n.addColorStop(.35,"rgba(255,255,255,.55)"),n.addColorStop(1,"rgba(255,255,255,0)"),i.fillStyle=n,i.fillRect(0,0,e,t)})}function $u(){return Wt(256,128,(i,e,t)=>{let n=Fn(7);for(let s=0;s<26;s++){let r=e*.2+n()*e*.6,a=t*.4+n()*t*.25,o=18+n()*30,c=i.createRadialGradient(r,a,0,r,a,o);c.addColorStop(0,"rgba(255,255,255,.55)"),c.addColorStop(1,"rgba(255,255,255,0)"),i.fillStyle=c,i.beginPath(),i.arc(r,a,o,0,7),i.fill()}})}function Js(i,e={}){let t=e.w||512,n=e.h||128,s=document.createElement("canvas");s.width=t,s.height=n;let r=new mi(s);r.colorSpace=qt;let a=new Ji(new Li({map:r,depthTest:!1,transparent:!0}));a.renderOrder=20;let o=e.scale||1;return a.scale.set(o*t/n*.5,o*.5,1),a.userData.draw=c=>{let l=s.getContext("2d");l.clearRect(0,0,t,n),l.fillStyle=e.bg||"rgba(255,252,240,.94)",l.beginPath(),l.roundRect(6,10,t-12,n-20,(n-20)/2),l.fill(),l.fillStyle=e.fg||"#1f3d33",l.textAlign="center",l.textBaseline="middle";let u=Math.round(n*.46);if(l.font=e.font||`800 ${u}px Arial, sans-serif`,!e.font&&!e.badge)for(;u>14&&l.measureText(c).width>t*.84;)u-=2,l.font=`800 ${u}px Arial, sans-serif`;e.badge?(l.fillStyle=e.fg||"#1f3d33",l.beginPath(),l.arc(n/2+4,n/2,n/2-18,0,7),l.fill(),l.fillStyle=e.bg||"#fffcf0",l.font=`800 ${Math.round(n*.4)}px Arial, sans-serif`,l.fillText(e.badge,n/2+4,n/2+2),l.fillStyle=e.fg||"#1f3d33",l.font=e.font||`800 ${Math.round(n*.46)}px Arial, sans-serif`,l.fillText(c,n+(t-n)/2-6,n/2+2)):l.fillText(c,t/2,n/2+2),r.needsUpdate=!0},a.userData.draw(i),a.userData.text=i,a}function $(i,e={}){let t=new Nt({color:i,roughness:e.rough??.7,metalness:e.metal??0,emissive:e.emissive??0,emissiveIntensity:e.ei??1,opacity:e.opacity??1});return e.flat&&(t.flatShading=!0),e.transparent&&(t.transparent=!0),e.side!==void 0&&(t.side=e.side),t}function U(i,e,t,n=0,s=0,r=0,a=!0){let o=new Xe(e,t);return o.position.set(n,s,r),o.castShadow=a,o.receiveShadow=!0,i.add(o),o}var yi=class{constructor(e,t,n,s=0,r=!0){Bn(this,"points");Bn(this,"n");Bn(this,"i",0);Bn(this,"pos");Bn(this,"col");Bn(this,"base");Bn(this,"vel");Bn(this,"life");Bn(this,"max");Bn(this,"gravity");this.n=e,this.gravity=s,this.pos=new Float32Array(e*3).fill(-999),this.col=new Float32Array(e*3),this.base=new Float32Array(e*3),this.vel=new Float32Array(e*3),this.life=new Float32Array(e),this.max=new Float32Array(e).fill(1);let a=new Rt;a.setAttribute("position",new Yt(this.pos,3)),a.setAttribute("color",new Yt(this.col,3)),this.points=new Ki(a,new Di({size:t,map:n,vertexColors:!0,transparent:!0,depthWrite:!1,blending:r?jt:zi,sizeAttenuation:!0})),this.points.frustumCulled=!1}emit(e,t,n,s,r,a,o,c){let l=this.i++%this.n,u=l*3;this.pos[u]=e,this.pos[u+1]=t,this.pos[u+2]=n,this.vel[u]=s,this.vel[u+1]=r,this.vel[u+2]=a,this.life[l]=this.max[l]=o,Array.isArray(c)?(this.base[u]=c[0],this.base[u+1]=c[1],this.base[u+2]=c[2]):(this.base[u]=c.r,this.base[u+1]=c.g,this.base[u+2]=c.b)}burst(e,t,n,s,r,a,o,c=1){for(let l=0;l<s;l++){let u=Math.random()*Math.PI*2,p=Math.random()*Math.PI-Math.PI/4,h=r*(.4+Math.random()*.8);this.emit(e,t,n,Math.cos(u)*Math.cos(p)*h,Math.sin(p)*h*c+r*.3,Math.sin(u)*Math.cos(p)*h,a*(.6+Math.random()*.6),o)}}update(e){for(let n=0;n<this.n;n++){let s=n*3;if(this.life[n]>0){this.life[n]-=e,this.vel[s+1]-=this.gravity*e,this.pos[s]+=this.vel[s]*e,this.pos[s+1]+=this.vel[s+1]*e,this.pos[s+2]+=this.vel[s+2]*e;let r=Math.max(0,this.life[n]/this.max[n]);this.col[s]=this.base[s]*r,this.col[s+1]=this.base[s+1]*r,this.col[s+2]=this.base[s+2]*r,this.life[n]<=0&&(this.pos[s+1]=-999)}}let t=this.points.geometry;t.attributes.position.needsUpdate=!0,t.attributes.color.needsUpdate=!0}},W0="varying vec3 vP;void main(){vP=normalize(position);gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);gl_Position.z=gl_Position.w;}";function Ku(i,e){let t=new vn({side:cn,depthWrite:!1,fog:!1,uniforms:{uTop:{value:new We(i)},uHor:{value:new We(e)},uSun:{value:new P(0,.2,-1).normalize()},uSunCol:{value:new We("#ffd9a0")},uFlash:{value:0}},vertexShader:W0,fragmentShader:`uniform vec3 uTop,uHor,uSunCol,uSun;uniform float uFlash;varying vec3 vP;void main(){float h=clamp(vP.y,-.2,1.);vec3 c=mix(uHor,uTop,pow(max(h,0.),.55));float s=max(dot(normalize(vP),uSun),0.);c+=uSunCol*(pow(s,40.)*.45+pow(s,600.)*1.4);c+=vec3(.75,.8,1.)*uFlash*(1.-h*.5);gl_FragColor=vec4(c,1.);
#include <tonemapping_fragment>
#include <colorspace_fragment>
}`}),n=new Xe(new vt(1,32,16),t);return n.scale.setScalar(900),n.renderOrder=-100,n.frustumCulled=!1,n}function Qu(){try{let i=document.createElement("canvas");return!!(window.WebGLRenderingContext&&(i.getContext("webgl2")||i.getContext("webgl")))}catch{return!1}}function ul(i,e={}){let t;try{t=new ll({antialias:!0,powerPreference:"high-performance"})}catch{return null}let n=matchMedia("(pointer:coarse)").matches;t.setPixelRatio(Math.min(devicePixelRatio,e.dprCap??(n?1.5:2))),t.shadowMap.enabled=e.shadows!==!1,t.shadowMap.type=ns,t.outputColorSpace=qt,t.toneMapping=Br,t.toneMappingExposure=e.exposure??1,i.appendChild(t.domElement);let s=t.domElement;s.style.display="block",s.style.width="100%",s.style.height="100%";let r=new xr,a=new an(e.fov??50,1,.1,2500),o=[],c=[],l=!0,u=0,p=performance.now(),h=!1,f=new IntersectionObserver(m=>{l=m[0].isIntersecting});f.observe(i);let g=()=>{let m=Math.max(1,i.clientWidth),d=Math.max(1,i.clientHeight);t.setSize(m,d,!1),a.aspect=m/d,a.updateProjectionMatrix(),c.forEach(S=>S(m,d))},v=new ResizeObserver(g);return v.observe(i),t.setAnimationLoop(m=>{let d=Math.min((m-p)/1e3,.05);p=m,!(!l||h)&&(u+=d,o.forEach(S=>S(d,u)),t.render(r,a))}),g(),{scene:r,camera:a,renderer:t,dom:s,root:i,onFrame:m=>{o.push(m)},onResize:m=>{c.push(m),m(i.clientWidth||1,i.clientHeight||1)},dispose:()=>{h=!0,t.setAnimationLoop(null),f.disconnect(),v.disconnect(),r.traverse(m=>{let d=m;d.geometry?.dispose(),(d.material?Array.isArray(d.material)?d.material:[d.material]:[]).forEach(E=>{E.map?.dispose(),E.dispose()})}),t.dispose();try{t.forceContextLoss()}catch{}s.remove()}}}var nn=13,X0=[-3.4,-1.15,1.15,3.4],q0=[0,5,10,15],Tn=900,ju=["VOCABULARY","GRAMMAR","LISTEN UP","FAST & FLUENT","WORD RACE","SPEAK!"];function ed(i,e){let t=ul(i,{fov:58});if(!t)return null;let{scene:n,camera:s}=t,r=!!e.preview,a=Fn(11),o=new P(0,1,0);n.fog=new Hn(13625079,140,620),n.background=new We(13625079);let c=Ku("#3f86dc","#cfe6f7");c.material.uniforms.uSun.value.set(-.5,.38,-.8).normalize(),n.add(c),n.add(new es(14479359,7113290,1.25));let l=new ts(16773334,3.4);l.castShadow=!0,l.shadow.mapSize.set(2048,2048),Object.assign(l.shadow.camera,{left:-48,right:48,top:48,bottom:-48,near:1,far:200}),l.shadow.bias=-4e-4,l.shadow.normalBias=.04,n.add(l,l.target);let u=[[0,-125],[95,-105],[158,-35],[140,50],[68,92],[-12,70],[-62,112],[-140,66],[-155,-30],[-92,-98]].map(([L,H])=>new P(L,0,H)),h=new gi(u,!0,"centripetal").getSpacedPoints(Tn).slice(0,Tn),f=[],g=0;for(let L=0;L<Tn;L++){let H=h[L],A=h[(L+1)%Tn];g+=H.distanceTo(A),f.push(A.clone().sub(H).setY(0).normalize())}let v=g/Tn,m=g/e.track,d=new P,S=new P,E=new P;function y(L){let H=(L%g+g)%g/v,A=Math.floor(H)%Tn,D=H-Math.floor(H),N=(A+1)%Tn;return d.lerpVectors(h[A],h[N],D),S.lerpVectors(f[A],f[N],D).normalize(),E.set(S.z,0,-S.x),{p:d,t:S,r:E}}let b=(L,H=0,A=0)=>{let D=y(L);return{pos:D.p.clone().addScaledVector(D.r,H).setY(A),tan:D.t.clone(),right:D.r.clone()}},T=Wt(256,256,(L,H,A)=>{L.fillStyle="#6f9a4b",L.fillRect(0,0,H,A);let D=Fn(3);for(let N=0;N<2600;N++)L.fillStyle=`hsla(${85+D()*30},${35+D()*25}%,${30+D()*22}%,.35)`,L.fillRect(D()*H,D()*A,2+D()*4,2+D()*4)},[110,110]),I=U(n,new Sn(1100,64),$("#ffffff",{rough:1}),0,-.06,0,!1);I.rotation.x=-Math.PI/2,I.material.map=T;let x=U(n,new Sn(34,48),new Nt({color:"#3f8fc4",roughness:.12,metalness:.25}),-8,-.02,6,!1);x.rotation.x=-Math.PI/2;let w=Wt(256,512,(L,H,A)=>{L.fillStyle="#3a3f47",L.fillRect(0,0,H,A);let D=Fn(5);for(let N=0;N<9e3;N++){let F=40+D()*40;L.fillStyle=`rgba(${F},${F},${F+4},.5)`,L.fillRect(D()*H,D()*A,1+D()*2,1+D()*2)}L.fillStyle="rgba(15,15,18,.35)",L.fillRect(H*.27,0,H*.1,A),L.fillRect(H*.63,0,H*.1,A),L.fillStyle="#f4f0e6",L.fillRect(H*.03,0,H*.025,A),L.fillRect(H*.945,0,H*.025,A),L.fillStyle="rgba(244,240,230,.85)";for(let N=0;N<A;N+=A/4)L.fillRect(H*.495,N,H*.012,A/8)}),R=Wt(64,128,(L,H,A)=>{L.fillStyle="#e43d3d",L.fillRect(0,0,H,A/2),L.fillStyle="#fafafa",L.fillRect(0,A/2,H,A/2)}),O=Wt(64,64,(L,H,A)=>{L.fillStyle="#d7c28f",L.fillRect(0,0,H,A);let D=Fn(9);for(let N=0;N<300;N++)L.fillStyle=`rgba(120,95,50,${D()*.25})`,L.fillRect(D()*H,D()*A,2,2)});function V(L,H,A,D,N){let F=[],Q=[],_e=[];for(let ge=0;ge<=Tn;ge++){let he=h[ge%Tn],fe=f[ge%Tn],re=fe.z,Ne=-fe.x;F.push(he.x+re*L,N,he.z+Ne*L,he.x+re*H,N,he.z+Ne*H);let Ue=ge*v/D;if(Q.push(0,Ue,1,Ue),ge<Tn){let Oe=ge*2;_e.push(Oe,Oe+1,Oe+2,Oe+1,Oe+3,Oe+2)}}let be=new Rt;be.setAttribute("position",new st(F,3)),be.setAttribute("uv",new st(Q,2)),be.setIndex(_e),be.computeVertexNormals(),A.wrapS=A.wrapT=Ii;let Te=new Xe(be,new Nt({map:A,roughness:.85,side:Ht}));Te.receiveShadow=!0,n.add(Te)}V(-nn/2,nn/2,w,26,.02),V(nn/2,nn/2+1.3,R,2.6,.035),V(-nn/2-1.3,-nn/2,R,2.6,.035),V(nn/2+1.3,nn/2+5,O,5,.005),V(-nn/2-5,-nn/2-1.3,O,5,.005);let W=new Vt,B=new We,J=Math.round(4.4/v),ne=new pi(new pe(.5,1.1,3.7),$("#ffffff",{rough:.6}),Math.ceil(Tn/J)*2);ne.castShadow=!0,ne.receiveShadow=!0;let ie=0;for(let L=0;L<Tn;L+=J){let H=h[L],A=f[L];for(let D of[-1,1]){let N=D*(nn/2+5.4);W.position.set(H.x+A.z*N,.55,H.z-A.x*N),W.rotation.set(0,Math.atan2(A.x,A.z),0),W.updateMatrix(),ne.setMatrixAt(ie,W.matrix),ne.setColorAt(ie,B.set(L/J%2?"#f2f2f2":"#d63c3c")),ie++}}ne.count=ie,n.add(ne);let de=new $e;{let L=y(0);de.position.copy(L.p),de.quaternion.setFromRotationMatrix(new gt().makeBasis(L.r.clone(),o,L.t.clone())),n.add(de)}let j=new Xe(new _t(nn,2.6),new Nt({map:Wt(256,40,(L,H,A)=>{for(let D=0;D<16;D++)for(let N=0;N<2;N++)L.fillStyle=(D+N)%2?"#f6f6f6":"#18181c",L.fillRect(D*H/16,N*A/2,H/16,A/2)}),roughness:.8}));j.rotation.x=-Math.PI/2,j.position.y=.045,de.add(j);for(let L of[-nn/2-1.8,nn/2+1.8])U(de,new pe(.7,7,.9),$("#f2efe6"),L,3.5,0);U(de,new pe(nn+4.4,1.5,1.1),$("#2a3a4a"),0,7.2,0);let oe=Wt(1024,100,(L,H,A)=>{let D=L.createLinearGradient(0,0,H,0);D.addColorStop(0,"#ff7a2f"),D.addColorStop(1,"#ffbf3c"),L.fillStyle=D,L.fillRect(0,0,H,A),L.fillStyle="#fff",L.font="900 64px Arial",L.textAlign="center",L.textBaseline="middle",L.fillText("WORD RACE  \xB7  START / FINISH",H/2,A/2+3)});for(let L of[-.58,.58]){let H=new Xe(new _t(nn+3.8,1.25),new ft({map:oe}));H.position.set(0,7.2,L),H.rotation.y=L<0?Math.PI:0,de.add(H)}let ue=[];for(let L=0;L<5;L++)ue.push(U(de,new vt(.42,16,12),new Nt({color:"#2b2b2b",roughness:.3}),(L-2)*1.5,5.9,-.7,!1));{let L=y(60),H=new $e;H.position.copy(L.p).addScaledVector(L.r,-(nn/2+16)),H.quaternion.setFromRotationMatrix(new gt().makeBasis(L.r.clone().negate(),o,L.t.clone().negate())),n.add(H);let A=6,D=56,N=new pi(new Qi(.22,.45,3,6),$("#ffffff",{rough:.8}),A*Math.floor(D/.9)),F=new Vt,Q=0;for(let _e=0;_e<A;_e++){U(H,new pe(2.2,(_e+1)*.95,D),$(_e%2?"#c9ced6":"#d9dde3"),_e*2.2,(_e+1)*.475,0);for(let be=-D/2+.8;be<D/2-.4;be+=.9)F.position.set(_e*2.2-.2,(_e+1)*.95+.45,be+a()*.3),F.scale.setScalar(.85+a()*.3),F.updateMatrix(),N.setMatrixAt(Q,F.matrix),N.setColorAt(Q++,new We().setHSL(a(),.65,.55))}N.count=Q,N.castShadow=!0,H.add(N),U(H,new pe(A*2.2+1,.25,D+2),$("#e8503a"),A*1.1,A*.95+3.4,0);for(let _e of[-D/2,D/2])for(let be of[0,A*2.2])U(H,new pe(.25,A*.95+3.2,.25),$("#667080"),be,(A*.95+3.2)/2,_e)}ju.forEach((L,H)=>{let A=70+H*(g/ju.length),D=y(A),N=H%2?1:-1,F=D.p.clone().addScaledVector(D.r,N*(nn/2+10.5)),Q=new $e;Q.position.copy(F),n.add(Q);let _e=Wt(512,154,(Te,ge,he)=>{let fe=Te.createLinearGradient(0,0,ge,he);fe.addColorStop(0,["#ff7a2f","#2f7bff","#27b07d","#8f5cff","#ff4f81","#f5b82e"][H]),fe.addColorStop(1,"#1d2433"),Te.fillStyle=fe,Te.fillRect(0,0,ge,he),Te.fillStyle="rgba(255,255,255,.12)",Te.fillRect(0,he-18,ge,18),Te.fillStyle="#fff",Te.font="900 70px Arial",Te.textAlign="center",Te.textBaseline="middle",Te.fillText(L,ge/2,he/2-4)}),be=new Xe(new _t(14,4.2),new ft({map:_e,side:Ht}));be.position.y=4.4,Q.add(be),Q.lookAt(D.p.x,0,D.p.z);for(let Te of[-5,5]){let ge=U(Q,new et(.15,.15,4.4),$("#444b57"),Te,2.2,0)}});let Ve=(L,H)=>{let A=1e9;for(let D=0;D<Tn;D+=3){let N=(h[D].x-L)**2+(h[D].z-H)**2;N<A&&(A=N)}return Math.sqrt(A)},Ie=[];for(let L=0;L<2400&&Ie.length<420;L++){let H=a()*Math.PI*2,A=Math.sqrt(a())*520,D=Math.cos(H)*A,N=Math.sin(H)*A;Ve(D,N)<nn/2+13||Math.hypot(D+8,N-6)<42||Ie.push({x:D,z:N,s:.8+a()*1.1,pine:a()<.55})}let pt=Ie.filter(L=>L.pine).length,tt=new pi(new et(.22,.34,2.2,6),$("#7a5a3a"),Ie.length),rt=new pi(new $t(1.9,3.6,7),$("#2f6a4f",{rough:.9}),pt*2),te=new pi(new Ir(1.8,1),$("#5f9a4f",{rough:.9,flat:!0}),Ie.length-pt),le=0,Ae=0;Ie.forEach((L,H)=>{if(W.rotation.set(0,a()*6,0),W.scale.setScalar(L.s),W.position.set(L.x,1.1*L.s,L.z),W.updateMatrix(),tt.setMatrixAt(H,W.matrix),L.pine)for(let A=0;A<2;A++)W.position.set(L.x,(2.6+A*1.6)*L.s,L.z),W.scale.setScalar(L.s*(1-A*.3)),W.updateMatrix(),rt.setMatrixAt(le++,W.matrix);else W.position.set(L.x,3.1*L.s,L.z),W.scale.set(L.s,L.s*1.1,L.s),W.updateMatrix(),te.setMatrixAt(Ae,W.matrix),te.setColorAt(Ae++,B.setHSL(.24+a()*.08,.42,.34+a()*.1))});for(let L of[tt,rt,te])L.castShadow=!0,L.receiveShadow=!0,n.add(L);for(let L=0;L<24;L++){let H=L/24*Math.PI*2+a()*.2,A=640+a()*120,D=90+a()*140,N=D*(.75+a()*.5),F=5+Math.floor(a()*3),Q=a()*6,_e=Math.cos(H)*A,be=Math.sin(H)*A,Te=U(n,new $t(N,D,F),$(L%3?"#6b7f8f":"#7b8a99",{flat:!0,rough:1}),_e,D/2-6,be,!1);Te.rotation.y=Q;let ge=U(n,new $t(N*.3,D*.3,F),$("#f4f7fb",{flat:!0}),_e,D-6-D*.15+.2,be,!1);ge.rotation.y=Q}let Je=$u(),Re=[];for(let L=0;L<26;L++){let H=new Ji(new Li({map:Je,transparent:!0,opacity:.9,depthWrite:!1,fog:!1})),A=a()*6.28,D=250+a()*500;H.position.set(Math.cos(A)*D,110+a()*80,Math.sin(A)*D),H.scale.set(180+a()*160,90+a()*70,1),n.add(H),Re.push(H)}function nt(L,H){let A=new $e,D=new $e,N=new $e;A.add(D),D.add(N);let F=new Xe(new et(L,L,H,20),$("#1c1e22",{rough:.9}));F.rotation.z=Math.PI/2,F.castShadow=!0,N.add(F);let Q=new Xe(new et(L*.55,L*.55,H+.04,10),$("#d8dce3",{metal:.8,rough:.3}));return Q.rotation.z=Math.PI/2,N.add(Q),N.add(new Xe(new pe(H+.07,L*.25,L*.25),$("#ff7a2f"))),A.userData={steer:D,spin:N},A}function It(L){let H=new $e,A=new $e;H.add(A);let D=new Lr({color:L,roughness:.3,metalness:.15,clearcoat:.8,clearcoatRoughness:.2}),N=$("#23262c",{rough:.5,metal:.3}),F=$("#f5f5f0",{rough:.4});U(A,new Un(1.5,.5,2.8,3,.2),D,0,.62,0),U(A,new Un(.95,.34,1.5,3,.14),D,0,.52,1.9);let Q=U(A,new $t(.3,.7,10),D,0,.5,2.8);Q.rotation.x=Math.PI/2,U(A,new Un(2.3,.1,.55,2,.04),N,0,.28,3.05),U(A,new pe(.1,.3,.5),F,-1.05,.36,3.05),U(A,new pe(.1,.3,.5),F,1.05,.36,3.05);for(let xt of[-.95,.95])U(A,new Un(.5,.38,1.5,2,.12),D,xt,.58,.1);U(A,new pe(.28,.04,2.9),F,0,.89,.1),U(A,new pe(.78,.04,.5),F,0,.9,.9),U(A,new Un(2,.1,.7,2,.04),D,0,1.45,-1.6);for(let xt of[-.5,.5])U(A,new pe(.08,.7,.1),N,xt,1.1,-1.55);U(A,new pe(.1,.45,.8),F,-1,1.45,-1.6),U(A,new pe(.1,.45,.8),F,1,1.45,-1.6),U(A,new Un(.75,.6,.8,2,.18),N,0,.95,-.35),U(A,new vt(.34,18,14),$("#fafafa",{rough:.25}),0,1.46,-.1);let _e=U(A,new vt(.26,14,10,0,Math.PI*2,0,Math.PI/2),$("#1a2230",{rough:.1,metal:.6}),0,1.5,.12);_e.rotation.x=Math.PI/2-.3,_e.scale.set(1,1,.8),U(A,new Un(.52,.42,.46,2,.1),$(L),0,1.05,-.15);let be=U(A,new yn(.22,.04,8,18),N,0,1.18,.35);be.rotation.x=-.9;let Te=[],ge=nt(.43,.42),he=nt(.43,.42),fe=nt(.5,.62),re=nt(.5,.62);ge.position.set(-1,.43,1.75),he.position.set(1,.43,1.75),fe.position.set(-1,.5,-1.2),re.position.set(1,.5,-1.2);for(let xt of[ge,he,fe,re])H.add(xt),Te.push(xt);let Ne=[];for(let xt of[-.35,.35]){let Ye=new Xe(new $t(.2,1.6,10,1,!0),new ft({color:"#ffb43c",transparent:!0,opacity:.85,blending:jt,depthWrite:!1,side:Ht}));Ye.rotation.x=-Math.PI/2,Ye.position.set(xt,.62,-2.2),H.add(Ye),Ne.push(Ye)}let Ue=new Xe(new _t(2.6,4.6),new ft({color:"#4fb7ff",transparent:!0,opacity:0,blending:jt,depthWrite:!1}));Ue.rotation.x=-Math.PI/2,Ue.position.y=.06,H.add(Ue);let Oe=new Xe(new _t(2.4,4.2),new ft({map:$r(),color:"#000",transparent:!0,opacity:.35,depthWrite:!1}));return Oe.rotation.x=-Math.PI/2,Oe.position.y=.05,H.add(Oe),H.userData={wheels:Te,flames:Ne,body:A,glow:Ue,paint:D,color:L},H}let Ke=["#ef4444","#3b82f6","#f59e0b","#22c55e"],lt=Ke.map(L=>{let H=It(L);return n.add(H),H}),mt=[];lt.forEach(L=>{let H=Js("",{w:384,h:96,scale:1.5,bg:"rgba(20,28,40,.78)",fg:"#fff"});H.position.set(0,2.9,0),L.add(H),mt.push(H)});let it=$r(),Mt=new yi(900,.55,it,0,!0),Lt=new yi(300,1.1,it,-.4,!0);n.add(Mt.points,Lt.points);let kt=new Tr(new Rt,new Fs({color:"#ffffff",transparent:!0,opacity:0,depthWrite:!1})),wt=70,Ut=new Float32Array(wt*6),k=Array.from({length:wt},()=>({a:a()*6.283,r:.45+a()*1.1,z:-1-a()*12}));kt.geometry.setAttribute("position",new Yt(Ut,3)),kt.frustumCulled=!1,s.add(kt),n.add(s);let Ft=0,ct=58,C=12,_=!1,X=0,q=new P,ee=new P,me=new P,ye=new We("#ffb04a"),se=new We("#69c8ff"),ce=new We("#ffd35a"),ve=[.38,.38,.38],Be=(L,H)=>{let A=y(L),D=A.p.clone().addScaledVector(A.r,H),N=A.t.clone(),F=A.r.clone(),Q=y(L+4).t,_e=Math.atan2(N.x*Q.z-N.z*Q.x,N.dot(Q))/4;return{pos:D,tan:N,right:F,turn:_e}},xe=[],Me="",De={countdown:0,running:!1},ke={good:0,bad:0},Qe=0,z=0,Se=0,ae=!1;return t.onFrame((L,H)=>{Se=H;let A=xe.length>0,D=xe.find(he=>he.id===Me)||xe[0],N=0,F=0,Q=0,_e=12,be=lt[0];if(lt.forEach((he,fe)=>{let re=xe.find(sn=>sn.slot===fe),Ne=!!re||r;if(he.visible=Ne,!Ne)return;let Ue=re?re.pos:H*24+(3-fe)*8,Oe=re?re.done?4:re.v:26+Math.sin(H*.7+fe)*5,xt=q0[fe]*hn(1-Ue/60,0,1),Ye=hn(Ue*m,0,g)-xt,St=X0[fe]+Math.sin(H*.8+fe*2)*.4*(Oe>6?1:0),At=Be(Ye+0,St);re&&he.userData.color!==re.color&&(he.userData.paint.color.set(re.color),he.userData.color=re.color),he.position.copy(At.pos).setY(.02+Math.sin(H*18+fe*3)*.012*hn(Oe/40,0,1)),he.quaternion.setFromRotationMatrix(new gt().makeBasis(At.right,o,At.tan));let Kt=he.userData.body;Kt.rotation.z=vi(Kt.rotation.z,-At.turn*2.2*hn(Oe/30,0,1.5),Cn(L,6)),he.userData.wheels.forEach((sn,Qs)=>{sn.userData.spin.rotation.x+=L*Oe*m*2.4,Qs<2&&(sn.userData.steer.rotation.y=vi(sn.userData.steer.rotation.y,At.turn*5,Cn(L,8)))});let Qt=hn((Oe-24)/34,0,1);he.userData.flames.forEach((sn,Qs)=>{sn.visible=Oe>9;let Kr=.6+Qt*1.7+Math.sin(H*40+Qs)*.12;sn.scale.set(.6+Qt*.5,Kr,.6+Qt*.5),sn.position.z=-2.15-Kr*.8,sn.material.color.copy(ye).lerp(se,Qt)}),he.userData.glow.material.opacity=Qt*.35*(.7+.3*Math.sin(H*25));let Mi=mt[fe],Ks=re?re.name:["You","Milo","Nova","Finn"][fe];Mi.userData.text!==Ks&&(Mi.userData.draw(Ks),Mi.userData.text=Ks),Mi.visible=!r&&re!==D&&s.position.distanceTo(he.position)>9;{let sn=s.position.distanceTo(he.position);Mi.scale.set(3*hn(sn/16,.55,2.2),.75*hn(sn/16,.55,2.2),1)}if(re&&Oe>12&&Math.random()<L*60){let sn=he.position;Mt.emit(sn.x-At.tan.x*2.4,.65,sn.z-At.tan.z*2.4,-At.tan.x*Oe*.3+(Math.random()-.5)*1.2,(Math.random()-.3)*1.2,-At.tan.z*Oe*.3+(Math.random()-.5)*1.2,.35+Qt*.2,Qt>.4?se:ye)}re&&Oe<9&&Oe>2&&Math.random()<L*40&&Lt.emit(he.position.x-At.tan.x*2,.5,he.position.z-At.tan.z*2,(Math.random()-.5)*2,1+Math.random(),(Math.random()-.5)*2,.9,ve),(re===D||!A&&fe===0)&&(N=Ye,F=At.turn,Q=St,_e=Oe,be=he)}),ke.good>Qe){Qe=ke.good;for(let he=0;he<60;he++){let fe=Math.random()*6.28,re=3+Math.random()*7;Mt.emit(be.position.x,1.2,be.position.z,Math.cos(fe)*re,3+Math.random()*6,Math.sin(fe)*re,.9,ce)}Ft=.5}if(ke.bad>z){z=ke.bad;for(let he=0;he<26;he++)Lt.emit(be.position.x+(Math.random()-.5)*1.5,.6,be.position.z+(Math.random()-.5)*1.5,(Math.random()-.5)*3,1+Math.random()*2,(Math.random()-.5)*3,1,ve);Ft=.7}De.running&&!ae&&(X=H),ae=De.running;let Te=De.countdown;if(ue.forEach((he,fe)=>{let re=he.material,Ne="#2b2b2b",Ue="#000000";Te>0&&fe<hn(5-Te,0,5)+(Te>0?1:0)&&fe<5?Ne=Ue="#ff2a2a":De.running&&H-X<3&&(Ne=Ue="#39ff7a"),re.color.set(Ne),re.emissive.set(Ue),re.emissiveIntensity=Ue==="#000000"?0:1.6}),r){let he=N+6,fe=b(he-26+Math.sin(H*.2)*8,0,0),re=b(he,0,1),Ne=Math.sin(H*.13)>0?1:-1,Ue=fe.pos.clone().addScaledVector(fe.right,Ne*(9+Math.sin(H*.3)*2)).setY(3.2+Math.sin(H*.23)*1.2);q.lerp(Ue,_?Cn(L,3):1),ee.lerp(re.pos,_?Cn(L,6):1),s.position.copy(q),s.lookAt(ee),ct=vi(ct,58,Cn(L,3))}else{let he=b(N-9.5,Q*.55,0),fe=he.pos.clone().setY(3.4+hn((_e-20)/80,0,.6)),re=b(N+15,Q*.5,1.1).pos;_||(q.copy(fe),ee.copy(re)),q.lerp(fe,Cn(L,9)),ee.lerp(re,Cn(L,9)),s.position.copy(q),s.lookAt(ee),ct=vi(ct,58+hn((_e-12)*.28,-3,16),Cn(L,3))}_=!0,Ft=Math.max(0,Ft-L*1.2),Ft>0&&(s.position.x+=(Math.random()-.5)*Ft*.3,s.position.y+=(Math.random()-.5)*Ft*.3),Math.abs(s.fov-ct)>.05&&(s.fov=ct,s.updateProjectionMatrix()),C=vi(C,_e,Cn(L,3));let ge=hn((C-24)/34,0,1)*(r?0:1);kt.material.opacity=ge*.55;for(let he=0;he<wt;he++){let fe=k[he];fe.z+=L*(18+C*1.2),fe.z>-.6&&(fe.z=-14-Math.random()*6,fe.a=Math.random()*6.283,fe.r=.5+Math.random()*1.2);let re=Math.cos(fe.a)*fe.r*-fe.z*.55,Ne=Math.sin(fe.a)*fe.r*-fe.z*.42,Ue=1+ge*3.5;Ut.set([re,Ne,fe.z,re,Ne,fe.z-Ue],he*6)}kt.geometry.attributes.position.needsUpdate=!0,l.target.position.copy(r?ee:be.position),l.position.copy(l.target.position).add(me.set(-45,70,-35)),Re.forEach((he,fe)=>{he.position.x+=L*(1.5+fe%3*.6)}),Mt.update(L),Lt.update(L),c.position.copy(s.position)}),{update:(L,H,A)=>{xe=L,Me=H,De=A},good:()=>{ke.good++},bad:()=>{ke.bad++},destroy:()=>{s.remove(kt),t.dispose()}}}var qc=()=>$("#e7b53c",{metal:.9,rough:.25}),Xc=()=>$("#8a6a46",{rough:.9}),un=(i,e,t,n=.04)=>new Un(i,e,t,2,n);function zt(){return new $e}function Y0(){let i=zt(),e=$("#2e7d5b",{rough:.7});U(i,un(.52,.68,.3,.1),e,0,.38,0),U(i,un(.4,.3,.12,.05),$("#256a4b"),0,.25,.2),U(i,new yn(.14,.025,6,14,Math.PI),$("#1d2a24"),0,.74,0);for(let t of[-.17,.17]){let n=U(i,new pe(.06,.5,.04),$("#1d2a24"),t,.4,-.17)}return U(i,new pe(.3,.04,.02),$("#e8e4d6"),0,.5,.16),i}function Z0(){let i=zt(),e=$("#f2d33a",{rough:.5});for(let t of[-1,0,1]){let n=[0,1,2,3,4,5].map(r=>{let a=r/5;return new P(Math.sin(a*2.2)*.34-.2,.08+t*.02,(a-.5)*.7+t*.16)}),s=new Xe(new Os(new gi(n),12,.065,7),e);s.castShadow=!0,s.position.y=.1,i.add(s),U(i,new vt(.045,6,5),$("#4a3a1c"),n[5].x,.18,n[5].z)}return i.rotation.y=.3,i}function Wc(){let i=zt();return U(i,new et(.16,.16,.55,16),$("#7ec8f2",{rough:.15,transparent:!0,opacity:.75}),0,.3,0),U(i,new et(.145,.145,.34,16),$("#3b9ae0",{rough:.1,transparent:!0,opacity:.9}),0,.22,0),U(i,new et(.07,.12,.12,12),$("#7ec8f2",{transparent:!0,opacity:.75}),0,.62,0),U(i,new et(.075,.075,.08,12),$("#f4f4f4"),0,.7,0),U(i,new et(.162,.162,.12,16,1,!0),$("#f4f4f4",{side:Ht}),0,.32,0),i}function td(){let i=zt();U(i,un(.3,.04,.58,.04),$("#15181d",{rough:.3,metal:.4}),0,.04,0);let e=U(i,new _t(.26,.52),new Nt({color:"#0b1b33",emissive:"#2f7bff",emissiveIntensity:.8}),0,.062,0,!1);e.rotation.x=-Math.PI/2,U(i,new et(.025,.025,.01,8),$("#222"),-.09,.065,-.23,!1),i.rotation.x=-.5,i.position.y=.12;let t=zt();return t.add(i),t}function J0(){let i=zt();U(i,new et(.015,.015,.95,6),$("#444"),0,.48,0);let e=U(i,new vt(.5,18,8,0,Math.PI*2,0,Math.PI/2),$("#d6403a",{rough:.6,side:Ht}),0,.9,0);e.scale.y=.55;for(let n=0;n<8;n++){let s=n/8*Math.PI*2;U(i,new et(.006,.006,.52,4),$("#888"),Math.cos(s)*.25,.99,Math.sin(s)*.25,!1).rotation.set(Math.sin(s)*1.1,0,-Math.cos(s)*1.1)}U(i,new yn(.07,.016,6,10,Math.PI*1.2),$("#333"),.07,0,0),i.rotation.z=.18;let t=zt();return t.add(i),t}function $0(){let i=zt(),e=$("#d9a95a",{rough:.8});U(i,un(.62,.1,.5,.05),e,0,.06,0);let n=U(i,new pe(.66,.03,.54,6,1,4),$("#58b34a"),0,.13,0).geometry.attributes.position;for(let s=0;s<n.count;s++)n.setY(s,n.getY(s)+Math.sin(n.getX(s)*18+n.getZ(s)*12)*.012);return U(i,new et(.14,.14,.025,14),$("#d9473d"),-.12,.16,.05),U(i,new et(.14,.14,.025,14),$("#d9473d"),.14,.16,-.06),U(i,new pe(.56,.03,.46),$("#f2c94c"),0,.19,0),U(i,un(.62,.12,.5,.05),e,0,.28,0),i.rotation.y=.4,i}function K0(){let i=zt();U(i,un(.55,.08,.72,.03),$("#2f6bd6"),0,.06,0),U(i,new pe(.5,.05,.68),$("#f6f2e4"),.01,.1,0),U(i,new pe(.5,.01,.68),$("#2f6bd6"),.01,.14,0);for(let e=0;e<9;e++)U(i,new yn(.03,.008,5,8),$("#ccc",{metal:.8}),-.28,.1,-.28+e*.07,!1).rotation.y=Math.PI/2;return U(i,new pe(.3,.005,.02),$("#9aa3b2"),.04,.147,-.1,!1),U(i,new pe(.3,.005,.02),$("#9aa3b2"),.04,.147,0,!1),i.rotation.y=.35,i}function Q0(){let i=zt(),e=qc();return U(i,new yn(.17,.05,8,18),e,0,.72,0),U(i,new pe(.09,.55,.07),e,0,.36,0),U(i,new pe(.18,.08,.07),e,.09,.1,0),U(i,new pe(.13,.08,.07),e,.07,.24,0),i.rotation.z=.25,i}function j0(){let i=zt(),e=U(i,new $t(.75,.75,3),$("#e9803c",{flat:!0,rough:.9}),0,.375,0);e.rotation.y=Math.PI/2,e.scale.set(1,1,1.1);let t=U(i,new $t(.28,.5,3),$("#26190f",{flat:!0}),0,.26,.45,!1);return t.rotation.y=Math.PI/2,t.scale.set(.8,1,.4),U(i,new pe(.03,.03,1.05),$("#f4eee0"),0,.76,0,!1),i}function e_(){let i=zt();for(let t=0;t<7;t++){let n=t/7*Math.PI*2;U(i,new Cr(.1,0),$("#8d877d",{flat:!0}),Math.cos(n)*.34,.07,Math.sin(n)*.34)}for(let t=0;t<4;t++)U(i,new et(.04,.05,.5,6),$("#4a3223"),Math.sin(t*1.57)*.1,.14,Math.cos(t*1.57)*.1).rotation.set(1.1,t*1.57,0,"YXZ");let e=[["#ff6a1a",.22,.6],["#ffb02e",.15,.46],["#fff0a0",.08,.32]].map(([t,n,s])=>{let r=new Xe(new $t(n,s,8,1,!0),new ft({color:t,transparent:!0,opacity:.85,blending:jt,depthWrite:!1,side:Ht}));return r.position.y=s/2+.12,i.add(r),r});return i.userData.tick=t=>e.forEach((n,s)=>{n.scale.set(1+.1*Math.sin(t*18+s),1+.12*Math.sin(t*13+s*2),1),n.rotation.y=t*(2+s)}),i}function t_(){let i=zt(),e=Wt(256,192,(r,a,o)=>{r.fillStyle="#e9d9a8",r.fillRect(0,0,a,o);let c=Fn(4);for(let l=0;l<140;l++)r.fillStyle=`rgba(120,90,40,${c()*.12})`,r.fillRect(c()*a,c()*o,6+c()*30,2+c()*8);r.fillStyle="#8fb87a",r.beginPath(),r.ellipse(70,60,45,30,.3,0,7),r.fill(),r.fillStyle="#8fb2cc",r.beginPath(),r.ellipse(190,120,48,26,-.2,0,7),r.fill(),r.strokeStyle="#b0452e",r.lineWidth=3,r.setLineDash([8,6]),r.beginPath(),r.moveTo(40,150),r.bezierCurveTo(90,100,120,140,170,60),r.stroke(),r.setLineDash([]),r.strokeStyle="#d6322a",r.lineWidth=6,r.beginPath(),r.moveTo(160,50),r.lineTo(182,72),r.moveTo(182,50),r.lineTo(160,72),r.stroke(),r.strokeStyle="rgba(90,60,20,.7)",r.lineWidth=4,r.strokeRect(2,2,a-4,o-4)}),t=new _t(.9,.68,8,4),n=t.attributes.position;for(let r=0;r<n.count;r++)n.setZ(r,Math.sin(n.getX(r)*5)*.03);t.computeVertexNormals();let s=U(i,t,new Nt({map:e,side:Ht,roughness:.9}),0,.12,0);return s.rotation.x=-Math.PI/2+.05,i}function n_(){let i=zt(),e=$("#c9a56a",{rough:1});for(let n=0;n<5;n++){let s=U(i,new yn(.26-n*.01,.045,6,22),e,0,.05+n*.06,0);s.rotation.x=Math.PI/2,s.scale.set(1,1,1)}let t=new Xe(new Os(new gi([new P(.25,.3,0),new P(.4,.18,.15),new P(.55,.04,.1),new P(.7,.04,.3)]),10,.04,6),e);return t.castShadow=!0,i.add(t),i}function i_(){let i=zt();U(i,new et(.07,.07,.5,12),$("#f2b01e",{rough:.4,metal:.3}),0,.14,0).rotation.z=Math.PI/2,U(i,new et(.12,.08,.16,12),$("#2a2d33",{metal:.5}),.3,.14,0).rotation.z=Math.PI/2;let e=U(i,new et(.1,.1,.02,12),new ft({color:"#fff6c0"}),.39,.14,0,!1);e.rotation.z=Math.PI/2,U(i,new et(.075,.075,.06,10),$("#1c1e22"),-.1,.14,0).rotation.z=Math.PI/2;let t=new Xe(new $t(.3,.9,14,1,!0).translate(0,-.45,0).rotateZ(Math.PI/2),new ft({color:"#fff2b0",transparent:!0,opacity:.18,blending:jt,depthWrite:!1,side:Ht}));t.position.set(.4,.14,0),i.add(t),i.userData.beam=t,i.position.y=.08;let n=zt();return n.add(i),n}function s_(){let i=zt(),e=$("#d9453d",{rough:.8});U(i,new et(.03,.04,1,6),Xc(),0,.5,0),U(i,new et(.22,.26,.06,10),Xc(),0,.03,0),U(i,un(.5,.55,.26,.08),e,0,.62,0);for(let t of[-1,1]){let n=U(i,un(.15,.5,.18,.06),e,t*.33,.56,0);n.rotation.z=t*.28}return U(i,new pe(.02,.5,.27),$("#f3f3f3"),0,.62,0,!1),U(i,un(.3,.1,.28,.04),e,0,.9,0),i}function r_(){let i=zt(),e=$("#5b4630",{rough:.8});U(i,new pe(.06,.95,.08),e,-.3,.48,0),U(i,new pe(.06,.95,.08),e,.3,.48,0),U(i,new pe(.66,.06,.08),e,0,.97,0);let t=new $e;t.position.set(-.27,0,0),i.add(t);let n=U(t,new pe(.54,.9,.04),$("#b98a58",{rough:.7}),.27,.47,0);return U(t,new pe(.4,.3,.045),$("#a97b4b"),.27,.68,0,!1),U(t,new pe(.4,.3,.045),$("#a97b4b"),.27,.28,0,!1),U(t,new vt(.04,8,6),qc(),.46,.47,.04),i.userData.piv=t,i.userData.activate=s=>{i.userData.target=s?-1.35:0},i.userData.tick=()=>{t.rotation.y+=((i.userData.target||0)-t.rotation.y)*.12},i}function a_(){let i=zt(),e=$("#e9e6dd",{rough:.6});for(let n of[[0,.05,.74,.06],[0,.95,.74,.06]])U(i,new pe(n[2],n[3],.08),e,n[0],n[1]+.02,0);for(let n of[-.35,.35])U(i,new pe(.06,.9,.08),e,n,.5,0);let t=new $e;return i.add(t),U(t,new pe(.64,.46,.025),$("#a9d8f5",{rough:.05,transparent:!0,opacity:.5,metal:.2}),0,.72,0,!1),U(t,new pe(.66,.03,.04),e,0,.5,0),U(t,new pe(.66,.03,.04),e,0,.95,0),t.position.y=.18,i.userData.sash=t,i.userData.activate=n=>{i.userData.target=n?-.2:.18},i.userData.tick=()=>{t.position.y+=((i.userData.target??.18)-t.position.y)*.12},U(i,new pe(.9,.05,.18),e,0,0,.06),i}function nd(){let i=zt();U(i,new et(.18,.22,.05,14),$("#3a3f47",{metal:.5}),0,.03,0),U(i,new et(.025,.025,.55,6),$("#c9cbd0",{metal:.8}),0,.3,0);let e=U(i,new $t(.28,.34,16,1,!0),new Nt({color:"#f6e6b8",emissive:"#ffd36a",emissiveIntensity:0,side:Ht,roughness:.9}),0,.68,0,!1);e.rotation.x=Math.PI;let t=U(i,new vt(.07,10,8),new ft({color:"#554d3a"}),0,.62,0,!1),n=new Xe(new Sn(.7,24),new ft({color:"#ffd36a",transparent:!0,opacity:0,blending:jt,depthWrite:!1}));return n.rotation.x=-Math.PI/2,n.position.y=.02,i.add(n),i.userData.activate=s=>{e.material.emissiveIntensity=s?1.8:0,t.material.color.set(s?"#fff3b0":"#554d3a"),n.material.opacity=s?.45:0},i}function id(){let i=zt(),e=$("#c0392b",{rough:.35});U(i,un(.5,.14,.4,.05),e,0,.1,0),U(i,new et(.11,.13,.05,14),$("#f2efe6"),0,.19,.06);let t=U(i,un(.62,.08,.12,.04),e,0,.27,-.1);U(i,new et(.05,.05,.1,8),$("#222"),-.28,.25,-.1),U(i,new et(.05,.05,.1,8),$("#222"),.28,.25,-.1);for(let n=0;n<8;n++){let s=n/8*Math.PI*1.6-.4;U(i,new et(.012,.012,.012,6),$("#555"),Math.cos(s)*.07,.22,.06+Math.sin(s)*.07,!1)}return i}function o_(){let i=zt(),e=Xc();for(let t of[-.2,.2])for(let n of[-.2,.2])U(i,new pe(.05,.45,.05),e,t,.23,n);U(i,un(.5,.06,.5,.02),$("#b98a58"),0,.47,0),U(i,un(.5,.45,.05,.02),$("#b98a58"),0,.75,-.23);for(let t of[-.2,.2])U(i,new pe(.05,.4,.05),e,t,.7,-.23);return i}function l_(){let i=zt();U(i,un(.6,.04,.42,.02),$("#9aa0aa",{metal:.6,rough:.3}),0,.03,0);let e=new $e;e.position.set(0,.05,-.21),e.rotation.x=-.35,i.add(e),U(e,un(.6,.4,.025,.02),$("#9aa0aa",{metal:.6,rough:.3}),0,.2,0);let t=U(e,new _t(.54,.34),new Nt({color:"#0b1b33",emissive:"#4a8cff",emissiveIntensity:.9}),0,.2,.015,!1);return i}function c_(){let i=zt();return U(i,un(.5,.12,.68,.02),$("#c0392b"),0,.07,0),U(i,new pe(.46,.09,.64),$("#f6f2e4"),.02,.07,0),U(i,un(.5,.02,.68,.01),$("#c0392b"),0,.13,0),U(i,new pe(.28,.005,.06),qc(),.02,.145,-.12,!1),i}var h_={bag:Y0,laptop:l_,book:c_,banana:Z0,bottle:Wc,phone:td,umbrella:J0,sandwich:$0,notebook:K0,key:Q0,tent:j0,fire:e_,map:t_,rope:n_,torch:i_,jacket:s_,door:r_,window:a_,lamp:nd,telephone:id,chair:o_,"bottle of water":Wc,"mobile phone":td,water:Wc,light:nd,police:id};function os(i){let e=h_[i];return e?e():(()=>{let t=zt();return U(t,new pe(.4,.4,.4),$("#999"),0,.2,0),t})()}var sd=["#f3cfa8","#e8b88a","#d9a273","#c68a5e"];function Zc(i={}){let e=new $e,t=$(i.skin||"#f0c49c",{rough:.6}),n=$("#5a6240"),s=$("#3a2f29"),r=$("#3e6fae"),a=$(i.vest||"#ff7a1a",{rough:.5}),o=$("#e8ecef",{metal:.4,rough:.3}),c=$(i.cap||"#d6402d"),l=[],u=[],p=new $e;p.position.y=.92,e.add(p);for(let f of[-.15,.15]){let g=new $e;g.position.set(f,.92,0),e.add(g),U(g,new pe(.22,.74,.26),n,0,-.37,0),U(g,new pe(.25,.16,.38),s,0,-.82,.05),l.push(g)}U(p,new pe(.52,.62,.34),r,0,.34,0),U(p,new pe(.58,.5,.4),a,0,.38,0),U(p,new pe(.6,.07,.42),o,0,.48,0),U(p,new pe(.6,.07,.42),o,0,.28,0),U(p,new pe(.4,.52,.22),$("#2f6b4f"),0,.38,-.3);for(let f of[-.36,.36]){let g=new $e;g.position.set(f,.58,0),p.add(g),U(g,new pe(.16,.56,.18),r,0,-.26,0),U(g,new vt(.085,10,8),t,0,-.58,0),u.push(g)}let h=new $e;h.position.set(0,.9,0),p.add(h),U(h,new vt(.22,18,14),t);for(let f of[-.08,.08])U(h,new vt(.03,8,6),$("#1b1b1b"),f,.02,.212,!1);return U(h,new vt(.235,16,10,0,Math.PI*2,0,Math.PI/2),c,0,.04,-.01),U(h,new pe(.3,.025,.2),c,0,.05,.22),U(h,new vt(.16,10,8),$("#4a3223"),0,-.01,-.12),e.userData={legs:l,arms:u,head:h,torso:p},e}function Jc(i,e,t,n=.016){let{legs:s,arms:r,head:a,torso:o}=i.userData,c=(l,u,p=0)=>{l.rotation.x+=(u-l.rotation.x)*hn(n*12,0,1),l.rotation.z+=(p-l.rotation.z)*hn(n*12,0,1)};if(e==="walk"||e==="run"){let l=e==="run"?16:10,u=e==="run"?1.1:.7;s.forEach((p,h)=>c(p,Math.sin(t*l+h*Math.PI)*u)),r.forEach((p,h)=>c(p,Math.sin(t*l+(h+1)*Math.PI)*u*(e==="run"?1.1:1),h?-.15:.15)),c(o,e==="run"?.35:.05)}else e==="sit"?(s.forEach(l=>c(l,-1.5)),r.forEach((l,u)=>c(l,-.9,u?-.1:.1)),c(o,0)):e==="cheer"?(s.forEach(l=>c(l,0)),r.forEach((l,u)=>c(l,-2.7+Math.sin(t*9+u)*.35,u?-.35:.35)),c(o,0)):e==="hurt"?(s.forEach(l=>c(l,0)),r.forEach((l,u)=>c(l,-1.2+Math.sin(t*20+u)*.3,u?-.9:.9)),c(o,.25)):e==="stand"?(s.forEach(l=>c(l,0)),r.forEach((l,u)=>c(l,0,u?-.08:.08)),c(o,-.03)):(s.forEach(l=>c(l,0)),r.forEach((l,u)=>c(l,Math.sin(t*1.6+u)*.04,u?-.12:.12)),c(o,Math.sin(t*1.4)*.015));a.rotation.x=Math.sin(t*1.2)*.03}var Yc=new Map;function u_(i,e){let t=i+e;return Yc.has(t)||Yc.set(t,Wt(128,128,(n,s,r)=>{n.fillStyle=e,n.fillRect(0,0,s,r),n.lineCap="round";let a=(o,c,l=0)=>{n.fillStyle="#fff",n.strokeStyle="#2a2320",n.lineWidth=5,n.beginPath(),n.ellipse(o,c,17,l?10:17,0,0,7),n.fill(),n.stroke(),n.fillStyle="#2a2320",n.beginPath(),n.arc(o,c+(l?2:0),l?6:8,0,7),n.fill(),l&&(n.fillStyle=e,n.fillRect(o-19,c-12,38,12),n.strokeStyle="#2a2320",n.lineWidth=6,n.beginPath(),n.moveTo(o-18,c),n.lineTo(o+18,c),n.stroke(),n.strokeStyle="rgba(110,80,140,.65)",n.lineWidth=6,n.beginPath(),n.moveTo(o-13,c+17),n.quadraticCurveTo(o,c+23,o+13,c+17),n.stroke())};n.strokeStyle="#2a2320",n.lineWidth=8,i==="tired"?(a(38,58,1),a(90,58,1),n.fillStyle="#8a3a3a",n.beginPath(),n.ellipse(64,102,11,8,0,0,7),n.fill(),n.fillStyle="#4a6fd6",n.font="900 26px Arial",n.fillText("z",104,26),n.font="900 18px Arial",n.fillText("z",116,14)):i==="happy"?(a(38,56),a(90,56),n.strokeStyle="#8a2a2a",n.lineWidth=10,n.beginPath(),n.moveTo(34,88),n.quadraticCurveTo(64,122,94,88),n.stroke(),n.fillStyle="rgba(255,120,120,.4)",n.beginPath(),n.arc(20,82,10,0,7),n.arc(108,82,10,0,7),n.fill(),n.strokeStyle="#2a2320",n.lineWidth=7,n.beginPath(),n.moveTo(24,30),n.quadraticCurveTo(38,22,52,30),n.moveTo(76,30),n.quadraticCurveTo(90,22,104,30),n.stroke()):(a(38,58),a(90,58),n.strokeStyle="#8a2a2a",n.lineWidth=9,n.beginPath(),n.moveTo(38,106),n.quadraticCurveTo(64,84,90,106),n.stroke(),n.strokeStyle="#2a2320",n.lineWidth=8,n.beginPath(),n.moveTo(22,40),n.lineTo(52,28),n.moveTo(106,40),n.lineTo(76,28),n.stroke(),n.fillStyle="#6cb8f0",n.beginPath(),n.ellipse(106,86,6,11,0,0,7),n.fill())})),Yc.get(t)}var d_=i=>[...i].reduce((e,t)=>e*31+t.charCodeAt(0)>>>0,7);function rd(i){let[e,t,n,s]=i.split("|");return{who:e,age:t,mood:n,thing:s}}function dl(i,e=0){let t=new $e,n=d_(i.who+i.mood+i.thing+i.age)+e,s=$(sd[n%3],{rough:.6}),r=i.age==="old",a=i.who==="woman"||i.who==="girl",o=i.who==="boy"||i.who==="girl",c={man:1.05,woman:.97,boy:.74,girl:.72}[i.who]||1,l=["#3e7bd6","#d6523e","#4aa86b","#8a5cd6","#e0a43a","#3ea8b8"],u=$(l[n%l.length],{rough:.7}),p=$(a?"#5a3e7a":"#3a4660",{rough:.8}),h=$(r?"#cfcfcf":["#2a1d14","#5a3a22","#1d1a18","#7a4a1e"][n%4],{rough:.9}),f=new $e;if(t.add(f),f.scale.setScalar(c),a){U(f,new $t(.34,.62,14),p,0,.62,0).scale.set(1,1,.8);for(let T of[-.1,.1])U(f,new pe(.12,.38,.14),s,T,.2,0)}else for(let b of[-.15,.15])U(f,new pe(.2,.8,.24),p,b,.42,0),U(f,new pe(.23,.1,.36),$("#2a2420"),b,.04,.05);let g=new $e;g.position.y=.92,g.rotation.x=r?.18:0,f.add(g),U(g,f_(.5,.62,.3),u,0,.34,0);let v=[];for(let b of[-.34,.34]){let T=new $e;T.position.set(b,.58,0),g.add(T),U(T,new pe(.14,.52,.16),u,0,-.24,0),U(T,new vt(.075,10,8),s,0,-.54,0),v.push(T)}let m=new $e;m.position.set(0,.98,.02),m.scale.setScalar(1.3),g.add(m),U(m,new vt(.22,18,14),s);let d=sd[n%3],S=new Xe(new vt(.2225,24,16,Math.PI/2-.62,1.24,Math.PI/2-.55,1.1),new Nt({map:u_(i.mood,d),roughness:.6}));if(m.add(S),(i.who==="man"||i.who==="boy")&&U(m,new vt(.235,16,10,0,Math.PI*2,0,Math.PI/2*(r?.8:1)),h,0,.03,-.01),i.who==="woman"&&(U(m,new vt(.24,16,10,0,Math.PI*2,0,Math.PI/2),h,0,.03,-.02),U(m,new pe(.4,.55,.14),h,0,-.18,-.14)),i.who==="girl"){U(m,new vt(.235,16,10,0,Math.PI*2,0,Math.PI/2),h,0,.03,-.01);for(let b of[-.25,.25])U(m,new vt(.09,8,6),h,b,-.04,-.02),U(m,new pe(.05,.2,.05),h,b,-.18,-.02)}if(r){for(let b of[-.09,.09]){let T=U(m,new yn(.05,.006,6,14),$("#333",{metal:.6}),b,.03,.224,!1)}U(m,new pe(.06,.01,.01),$("#333"),0,.03,.215,!1)}let E=os(i.thing),y=new $e;return v[1].add(y),y.position.set(.02,-.56,.1),i.thing==="umbrella"?(E.rotation.set(0,0,0),E.scale.setScalar(.8),E.position.y=-.1,y.add(E),v[1].rotation.x=-.5):i.thing==="bag"?(E.scale.setScalar(.5),E.position.set(0,.05,-.05),y.add(E)):i.thing==="laptop"?(E.scale.setScalar(.7),E.rotation.set(-1.2,0,0),E.position.set(0,.15,.2),y.add(E),v[1].rotation.x=-.9):i.thing==="mobile phone"?(E.scale.setScalar(.45),E.rotation.set(.2,0,0),E.position.set(0,.05,.1),y.add(E),v[1].rotation.x=-1.4):(E.scale.setScalar(.55),E.rotation.set(-1.4,0,0),E.position.set(0,.14,.2),y.add(E),v[1].rotation.x=-.9),t.userData={arms:v,head:m,torso:g,body:f,mood:i.mood},t}function f_(i,e,t){return new pe(i,e,t)}var ad=Math.PI/180;function p_(){let i=new $e;U(i,new pe(.7,.42,.3),$("#51604a",{rough:.5,metal:.2}),0,.21,0),U(i,new et(.11,.11,.03,16),$("#1b1d1b"),-.17,.24,.16).rotation.x=Math.PI/2,U(i,new pe(.2,.1,.02),$("#9fe6b0",{emissive:"#58d68d",ei:.5}),.15,.3,.16,!1),U(i,new et(.015,.015,.9,6),$("#cfcfcf",{metal:.8}),.28,.85,-.08);let e=U(i,new vt(.05,10,8),new Nt({color:"#400",emissive:"#ff2020",emissiveIntensity:.1}),.28,1.32,-.08,!1),t=[0,1,2].map(()=>{let n=new Xe(new yn(1,.02,6,28),new ft({color:"#bfe6ff",transparent:!0,opacity:0,blending:jt,depthWrite:!1}));return n.position.set(.28,1.32,-.08),n.rotation.x=Math.PI/2,i.add(n),n});return i.userData.tick=(n,s)=>{e.material.emissiveIntensity=s?Math.sin(n*18)>0?3:.4:.1,t.forEach((r,a)=>{let o=s?(n*.9+a/3)%1:1;r.scale.setScalar(.15+o*2),r.material.opacity=s?(1-o)*.7:0})},i}function m_(i,e=.62){let t=new $e;return U(t,new et(e,e+.08,.14,22),$(i,{rough:.7}),0,.07,0),U(t,new et(e-.05,e-.05,.03,22),$("#ffffff",{rough:.5,transparent:!0,opacity:.18}),0,.155,0,!1),t}function g_(i,e="#ff7a1a"){let t=Zc({vest:e});t.scale.setScalar(.5),t.userData.pose=i;let n=new $e;return n.add(t),n.userData.fig=t,n.userData.activate=s=>{n.userData.on=s},n.userData.tick=s=>{Jc(t,n.userData.on?i:i==="sit"?"stand":"idle",s,.016),i==="sit"&&n.userData.on?(t.position.y=-.2,t.userData.legs.forEach(r=>r.rotation.x=-1.5)):t.position.y=0,i==="run"&&n.userData.on?t.rotation.x=.12:t.rotation.x=0},t.rotation.y=.6,n}function od(i,e,t){let n=ul(i,{fov:42,exposure:1});if(!n)return null;let{scene:s,camera:r,dom:a}=n,o=Fn(5),c=$r(),l=!1,u=0,p=1,h=0,f=0,g=0,v=0,m=new yi(500,.32,c,2.5,!0);s.add(m.points);let d=new es(14674431,5589568,1),S=new ts(16777215,2.5);S.position.set(6,12,8),S.castShadow=!0,S.shadow.mapSize.set(1024,1024),Object.assign(S.shadow.camera,{left:-14,right:14,top:14,bottom:-14,near:1,far:60}),S.shadow.bias=-5e-4,S.shadow.normalBias=.04,s.add(d,S);let E=new _i(16777215,0,30,2);E.position.set(0,6,3),s.add(E);let y=[],b=new P,T=new P,I=new P,x=new P(0,1,0),w=.12,R=p_();s.add(R);let O=new $e,V=[];s.add(O);let W=new Bs(.62,.78,40).rotateX(-Math.PI/2);function B(A,D,N,F={}){let Q=new $e;Q.position.copy(N),O.add(Q),F.ped!==void 0&&F.ped!==""&&Q.add(m_(F.ped,F.radius||.62));let _e=F.ped===""?0:.15;D.position.y+=_e,Q.add(D);let be=new Xe(W,new ft({color:"#ffe27a",transparent:!0,opacity:0,blending:jt,depthWrite:!1}));be.position.y=.03,be.scale.setScalar((F.radius||.62)/.62*1.15),Q.add(be);let Te=new Xe(new vt((F.radius||.62)*1.5,8,6),new ft({visible:!1}));Te.position.y=F.hitY??.6,Te.userData.id=A,Q.add(Te);let ge;F.label&&(ge=Js(F.label,{w:420,h:96,scale:1.15,bg:"rgba(255,252,240,.95)"}),ge.position.set(0,F.tagY??.3,1.15),ge.userData.base=ge.scale.clone(),Q.add(ge));let he={id:A,obj:Q,ring:be,hit:Te,tag:ge,model:F.m,state:"idle",hover:0,t:Math.random()*6,base:N.clone(),lift:_e};return V.push(he),he}function J(){s.remove(O),O.traverse(A=>{let D=A;D.geometry?.dispose(),(D.material?Array.isArray(D.material)?D.material:[D.material]:[]).forEach(F=>{F.map?.dispose(),F.dispose()})}),O=new $e,s.add(O),V=[]}let ne=(A,D,N=-90,F=270,Q=0)=>Array.from({length:A},(_e,be)=>{let Te=(N+(F-N)*(be+.5)/A)*ad;return new P(Math.sin(Te)*D,Q,Math.cos(Te)*D)}),ie=(A,D,N=0)=>Array.from({length:A},(F,Q)=>new P((Q-(A-1)/2)*D,0,N)),de=A=>t.labels||A.text,j=null,oe=null,ue=new P,Ve=0,Ie=!1,pt=new $e,tt=new $e,rt=null,te=0,le=2.2,Ae=(A,D)=>new P((A-2)*le,0,(D-2)*le),Je=A=>(2-A)*Math.PI/2,Re=null,nt=null,It=null,Ke=null,lt=null,mt=new We;function it(A,D=40,N){let F=U(s,new Sn(D,48),$(A,{rough:1}),0,0,0,!1);return F.rotation.x=-Math.PI/2,F.receiveShadow=!0,N&&(F.material.map=N),F}function Mt(){s.background=mt.set("#141a24"),s.fog=new Hn(1317412,24,60),d.intensity=.7,d.color.set("#9fb4d8"),S.intensity=1.6,S.color.set("#ffe6c8");let A=Wt(512,512,(re,Ne,Ue)=>{for(let Oe=0;Oe<5;Oe++)for(let xt=0;xt<5;xt++)re.fillStyle=(Oe+xt)%2?"#c5ccd6":"#d9dfe7",re.fillRect(Oe*Ne/5,xt*Ue/5,Ne/5,Ue/5);re.strokeStyle="rgba(60,70,90,.45)",re.lineWidth=3;for(let Oe=0;Oe<=5;Oe++)re.beginPath(),re.moveTo(Oe*Ne/5,0),re.lineTo(Oe*Ne/5,Ue),re.moveTo(0,Oe*Ue/5),re.lineTo(Ne,Oe*Ue/5),re.stroke()}),D=U(s,new _t(5*le,5*le),new Nt({map:A,roughness:.35,metalness:.05}),0,0,0,!1);D.rotation.x=-Math.PI/2,D.receiveShadow=!0,U(s,new _t(60,60),$("#1a1f29",{rough:1}),0,-.02,0,!1).rotation.x=-Math.PI/2;let N=$("#d8d4c9",{rough:.9}),F=3.4,Q=2.5*le;U(s,new pe(5*le+.6,F,.3),N,0,F/2,-Q-.15),U(s,new pe(.3,F,5*le+.6),N,-Q-.15,F/2,0),U(s,new pe(.3,F,5*le+.6),N,Q+.15,F/2,0);let _e=Wt(256,128,(re,Ne,Ue)=>{let Oe=re.createLinearGradient(0,0,0,Ue);Oe.addColorStop(0,"#2a1410"),Oe.addColorStop(1,"#ff6a1a"),re.fillStyle=Oe,re.fillRect(0,0,Ne,Ue),re.fillStyle="rgba(255,200,120,.35)";for(let xt=0;xt<30;xt++)re.fillRect(Math.random()*Ne,Ue*.5+Math.random()*Ue*.5,3,3+Math.random()*20)});for(let re of[-3.4,0,3.4]){let Ne=U(s,new pe(2.3,1.5,.12),$("#2c333d"),re,2.1,-Q+.02,!1),Ue=new Xe(new _t(2.1,1.3),new ft({map:_e}));Ue.position.set(re,2.1,-Q+.1),s.add(Ue)}for(let re of[-2.8,2.2]){let Ne=U(s,new pe(.12,1.5,2.3),$("#2c333d"),-Q+.02,2.1,re,!1),Ue=new Xe(new _t(2.1,1.3),new ft({map:_e}));Ue.position.set(-Q+.1,2.1,re),Ue.rotation.y=Math.PI/2,s.add(Ue)}for(let re of[-3.8,-1.3,1.3,3.8]){U(s,new pe(2,.08,.9),$("#8a6a46"),re,.75,-Q+.7);for(let Ue of[-.9,.9])U(s,new pe(.06,.75,.8),$("#555d68"),re+Ue,.38,-Q+.7);let Ne=U(s,new pe(.7,.45,.05),$("#14171c"),re,1.05,-Q+.9);U(s,new _t(.62,.37),new ft({color:"#3b6fb8"}),re,1.05,-Q+.93,!1)}for(let re of[-3.2,-1,1.2,3.4])U(s,new pe(.6,1.6,.8),$("#7c8794",{metal:.3}),Q-.4,.8,re);for(let[re,Ne]of[[-Q+.6,Q-.6],[Q-.6,Q-.6]]){U(s,new et(.28,.22,.4,12),$("#a9714b"),re,.2,Ne);for(let Ue=0;Ue<7;Ue++){let Oe=Ue/7*6.28;U(s,new vt(.2,6,5),$("#3f8a4b"),re+Math.cos(Oe)*.25,.7+Math.random()*.4,Ne+Math.sin(Oe)*.25).scale.set(1,2,.6)}}let be=new Xe(new _t(1.2,.4),new ft({map:Wt(256,86,(re,Ne,Ue)=>{re.fillStyle="#15a05a",re.fillRect(0,0,Ne,Ue),re.fillStyle="#fff",re.font="900 56px Arial",re.textAlign="center",re.textBaseline="middle",re.fillText("EXIT",Ne/2,Ue/2+3)})}));be.position.set(0,3,-Q+.05),s.add(be),Ke=new _i(16722458,0,18,2),Ke.position.set(0,3.2,0),s.add(Ke);let Te=U(s,new vt(.18,10,8),new ft({color:"#ff3a2a"}),Q-.3,3.1,-Q+.3,!1),ge=new yi(120,2.4,c,-.15,!0);s.add(ge.points);let he=[.2,.19,.2];pt=new $e,tt=new $e,s.add(pt,tt),oe=Zc(),s.add(oe);let fe=new Xe(new Bs(.55,.75,32).rotateX(-Math.PI/2),new ft({color:"#4fb7ff",transparent:!0,opacity:.7,blending:jt,depthWrite:!1}));fe.position.y=.03,s.add(fe),fe.userData.start=!0,T.set(0,13,11.5),b.set(0,0,.6),w=.04,R.position.set(Q-1,0,-Q+1.2),R.scale.setScalar(1.1),y.push((re,Ne)=>{if(Ke.intensity=(Math.sin(Ne*5)>0?1:.1)*(l?22:12),Te.material.color.set(Math.sin(Ne*5)>0?"#ff5a3a":"#551a12"),Math.random()<re*10&&ge.emit((Math.random()-.5)*10,2.8,(Math.random()-.5)*10,(Math.random()-.5)*.4,-.1,(Math.random()-.5)*.4,3.5,he),ge.update(re),j&&oe){let Ue=Ae(j.x,j.y),Oe=Ue.clone().sub(ue);Oe.y=0;let xt=Oe.length();Ie=xt>.04,Ie&&ue.addScaledVector(Oe.normalize(),Math.min(xt,re*4.2)),oe.position.copy(ue);let St=Je(j.h)-Ve;St=Math.atan2(Math.sin(St),Math.cos(St)),Ve+=St*Cn(re,10),oe.rotation.y=Ve,Jc(oe,Ie?"walk":te>0?"cheer":"idle",Ne,re),fe.visible=!!j}rt&&(te=Math.min(1,te+re*2),rt.scale.setScalar(.01+te*.99),rt.rotation.y=Math.sin(Ne*2)*.02)})}function Lt(){s.background=mt.set("#0a1226"),s.fog=new Hn(660006,16,46),d.intensity=.32,d.color.set("#6f86c0"),d.groundColor.set("#1d2418"),S.intensity=.9,S.color.set("#9db4ff"),S.position.set(-6,14,-4);let A=Wt(256,256,(ge,he,fe)=>{ge.fillStyle="#3d4a2e",ge.fillRect(0,0,he,fe);let re=Fn(3);for(let Ne=0;Ne<1800;Ne++)ge.fillStyle=`hsla(${70+re()*40},30%,${14+re()*14}%,.5)`,ge.fillRect(re()*he,re()*fe,2+re()*4,2+re()*4)},[16,16]);it("#fff",60,A);let D=new Rt,N=new Float32Array(500*3);for(let ge=0;ge<500;ge++){let he=o()*6.28,fe=.15+o()*1.2,re=120;N[ge*3]=Math.cos(he)*Math.cos(fe)*re,N[ge*3+1]=Math.sin(fe)*re,N[ge*3+2]=Math.sin(he)*Math.cos(fe)*re}D.setAttribute("position",new Yt(N,3)),s.add(new Ki(D,new Di({size:1.2,color:16777215,sizeAttenuation:!1,fog:!1})));let F=new Xe(new Sn(5,24),new ft({color:"#f6f1d6",fog:!1}));F.position.set(-40,50,-90),F.lookAt(0,0,0),s.add(F);for(let ge=0;ge<46;ge++){let he=o()*6.28,fe=11+o()*18,re=Math.cos(he)*fe,Ne=Math.sin(he)*fe,Ue=.8+o()*1.1,Oe=new $e;Oe.position.set(re,0,Ne),Oe.scale.setScalar(Ue),s.add(Oe),U(Oe,new et(.16,.24,1,6),$("#4a3626"),0,.5,0);for(let xt=0;xt<3;xt++)U(Oe,new $t(1.3-xt*.3,1.7,7),$("#17402e",{flat:!0,rough:1}),0,1.6+xt*.9,0)}let Q=os("fire");Q.scale.setScalar(3),s.add(Q);let _e=new _i(16751164,40,22,2);_e.position.set(0,1.8,0),s.add(_e);for(let ge=0;ge<8;ge++){let he=ge/8*6.28,fe=U(s,new et(.32,.36,2.4,8),$("#6a4a30",{rough:1}),Math.cos(he)*5.6,.2,Math.sin(he)*5.6);fe.rotation.z=Math.PI/2,fe.rotation.y=-he}let be=new yi(80,.22,c,-1,!0);s.add(be.points);let Te=[1,.6,.2];R.position.set(0,.2,-2.6),R.scale.setScalar(1.3),T.set(0,7.2,10.5),b.set(0,.7,.4),w=.18,y.push((ge,he)=>{_e.intensity=34+Math.sin(he*23)*5+Math.sin(he*37)*3,Q.userData.tick(he),Math.random()<ge*20&&be.emit((Math.random()-.5)*.6,1.6,(Math.random()-.5)*.6,(Math.random()-.5)*.8,1.5+Math.random(),(Math.random()-.5)*.8,2,Te),be.update(ge)})}function kt(){s.background=mt.set("#7fb0e8"),s.fog=new Hn(10470382,30,90),d.intensity=1.1,d.color.set("#e6f0ff"),d.groundColor.set("#9a9890"),S.intensity=2.2,S.color.set("#fff3e0");let A=Wt(256,256,(Ye,St,At)=>{Ye.fillStyle="#d9dde4",Ye.fillRect(0,0,St,At),Ye.strokeStyle="rgba(120,130,150,.45)",Ye.lineWidth=2,Ye.strokeRect(0,0,St,At);let Kt=Fn(2);for(let Qt=0;Qt<300;Qt++)Ye.fillStyle=`rgba(255,255,255,${Kt()*.25})`,Ye.fillRect(Kt()*St,Kt()*At,3,3)},[16,10]),D=U(s,new _t(40,26),new Nt({map:A,roughness:.18,metalness:.15}),0,0,-2,!1);D.rotation.x=-Math.PI/2,D.receiveShadow=!0;let N=U(s,new _t(120,50),$("#6c7078",{rough:1}),0,-.05,-34,!1);N.rotation.x=-Math.PI/2;for(let Ye=0;Ye<10;Ye++)U(s,new _t(4,.4),$("#f4f4f4",{rough:1}),-36+Ye*8,-.03,-28,!1).rotation.x=-Math.PI/2;let F=new $e;F.position.set(-7,0,-20),s.add(F);let Q=$("#f4f6f8",{rough:.3,metal:.1});U(F,new Qi(1.5,12,6,16),Q,0,2.6,0).rotation.z=Math.PI/2,U(F,new pe(2.4,.2,15),Q,.8,2.1,0),U(F,new pe(2,.15,5),Q,-5.7,3,0);let _e=U(F,new pe(2.2,3.2,.2),$("#2f7bff"),-5.8,4.4,0);_e.rotation.z=.4;for(let Ye of[-3,3])U(F,new et(.8,.8,1.6,12),$("#9aa3b0",{metal:.6}),1.4,1.4,Ye).rotation.z=Math.PI/2;for(let Ye=0;Ye<10;Ye++)U(F,new Sn(.14,8),$("#254a7a"),4.2-Ye*1.2,3,1.52,!1);let be=new Xe(new _t(40,9),new Nt({color:"#bfe0ff",transparent:!0,opacity:.12,roughness:.05,metalness:.2}));be.position.set(0,4.5,-9),s.add(be);for(let Ye=-4;Ye<=4;Ye++)U(s,new pe(.18,9,.18),$("#cfd5de"),Ye*4.5,4.5,-9);U(s,new pe(40,.3,.3),$("#cfd5de"),0,9,-9);for(let Ye=-3;Ye<=3;Ye++)U(s,new pe(.4,.4,26),$("#e6e8ec"),Ye*5.5,9.4,-2,!1),U(s,new pe(.14,.06,22),new ft({color:"#ffffff"}),Ye*5.5,9.15,-2,!1);for(let Ye of[-14,14])for(let St of[-6,2])U(s,new et(.55,.55,9.4,14),$("#d9dde4",{rough:.4}),Ye,4.7,St);let Te=new $e;Te.position.set(11.5,0,-3),Te.rotation.y=-.6,s.add(Te),U(Te,new pe(4.6,1.05,1.2),$("#2f7bff",{rough:.4}),0,.52,0),U(Te,new pe(4.8,.08,1.3),$("#f2f2f2"),0,1.08,0),U(Te,new pe(.9,.55,.06),$("#15181d"),-1,1.45,-.1);let ge=dl({who:"woman",age:"young",mood:"happy",thing:"notebook"},3);ge.position.set(-1,0,-1.1),ge.rotation.y=Math.PI,Te.add(ge),[[-11,-1,"man"],[-9.4,-.2,"woman"],[-12.5,.6,"boy"],[9,3,"girl"],[-6.5,-5,"woman"],[5,-7,"man"]].forEach(([Ye,St,At],Kt)=>{let Qt=dl({who:At,age:"young",mood:Kt%2?"happy":"tired",thing:Kt%3?"bag":"laptop"},Kt*7);Qt.position.set(Ye,0,St),Qt.rotation.y=o()*6,s.add(Qt);let $s=U(s,__(.6,.9,.3),$(["#c0392b","#2f7bff","#27ae60"][Kt%3],{rough:.5}),Ye+.7,.5,St+.2);$s.rotation.y=o()});for(let Ye of[-5,5])for(let St=0;St<3;St++)U(s,new pe(2,.12,.6),$("#2f3a4a"),Ye+St*0,.45,-5.6+St*1.1,!1);let fe=document.createElement("canvas");fe.width=1024,fe.height=288;let re=fe.getContext("2d"),Ne=new mi(fe);Ne.colorSpace=qt;let Ue=Array.from({length:40},()=>0),Oe=(Ye,St)=>{re.fillStyle="#0b1a2e",re.fillRect(0,0,1024,288),re.fillStyle="#ffcc33",re.font="900 52px Arial",re.textAlign="left",re.fillText("\u2708  ANNOUNCEMENTS",36,76),re.fillStyle="#8fd0ff",re.font="700 28px Arial",re.fillText(St?"Please listen carefully\u2026":"Press \u{1F50A} to hear the announcement",38,128),Ue=Ue.map((At,Kt)=>vi(At,St?.25+.75*Math.abs(Math.sin(Ye*7+Kt*.6)*Math.cos(Ye*3+Kt*.37)):.06,.25)),re.fillStyle=St?"#4ade80":"#3b5b7a",Ue.forEach((At,Kt)=>re.fillRect(40+Kt*24,270-At*110,16,At*110)),Ne.needsUpdate=!0},xt=new Xe(new _t(8,2.25),new ft({map:Ne}));xt.position.set(0,7.2,-8.6),s.add(xt),U(s,new pe(8.3,2.5,.2),$("#1a2230"),0,7.2,-8.75,!1),Re={draw:Ye=>Oe(u,Ye)},Oe(0,!1),R.position.set(-8,0,-4.5),R.scale.setScalar(1.2),T.set(0,5.2,14.5),b.set(0,3.1,-2),w=.1,y.push((Ye,St)=>{(St*30|0)%2===0&&Oe(St,l)})}function wt(){s.background=mt.set("#0c0e13"),s.fog=new Hn(790035,14,34),d.intensity=.75,d.color.set("#b4c0dc"),S.intensity=2.1,S.position.set(2,4,11),S.color.set("#fff2e0"),U(s,new _t(22,16),$("#262a31",{rough:.5,metal:.1}),0,0,0,!1).rotation.x=-Math.PI/2;let A=Wt(1024,512,(F,Q,_e)=>{F.fillStyle="#e9e6dc",F.fillRect(0,0,Q,_e),F.strokeStyle="#14161a",F.fillStyle="#14161a",F.lineWidth=3,F.font="700 22px Arial";for(let be=0;be<=10;be++){let Te=_e-30-be*(_e-60)/10;F.beginPath(),F.moveTo(0,Te),F.lineTo(Q,Te),F.stroke(),F.fillText(String(140+be*10)+" cm",8,Te-6)}F.strokeStyle="rgba(20,22,26,.25)";for(let be=0;be<=50;be++){let Te=_e-30-be*(_e-60)/50;F.beginPath(),F.moveTo(0,Te),F.lineTo(36,Te),F.stroke()}}),D=U(s,new _t(14,7),new Nt({map:A,roughness:.9}),0,3.4,-2.2,!1);U(s,new _t(22,8),$("#1a1d24"),0,4,-2.25,!1),D.position.z=-2.15,U(s,new pe(11,.35,5),$("#3a3f48",{rough:.6}),0,.17,.8),U(s,new pe(.2,3.4,5),$("#14171c"),9.2,2,.5);let N=new Xe(new _t(4.6,3),new Nt({color:"#222a34",roughness:.05,metalness:.8}));N.position.set(9.08,2,.5),N.rotation.y=-Math.PI/2,s.add(N),R.position.set(-8,.4,-1.6),R.scale.setScalar(1.3),T.set(0,2.2,9.4),b.set(0,1.28,0),w=.05,lt={spot:[],people:[]}}function Ut(){s.background=mt.set("#10161f"),s.fog=new Hn(1054239,22,60),d.intensity=.8,d.color.set("#b8c6e0"),S.intensity=1.8,S.color.set("#fff0d8");let A=Wt(256,256,(Te,ge,he)=>{Te.fillStyle="#39414d",Te.fillRect(0,0,ge,he),Te.strokeStyle="rgba(255,255,255,.07)",Te.lineWidth=2,Te.strokeRect(0,0,ge,he),Te.fillStyle="rgba(255,200,40,.5)";for(let fe=0;fe<ge;fe+=32)Te.fillRect(fe,0,16,6)},[18,12]),D=U(s,new _t(36,24),new Nt({map:A,roughness:.6}),0,0,0,!1);D.rotation.x=-Math.PI/2,D.receiveShadow=!0;let N=$("#2a323d",{rough:.9});U(s,new pe(36,10,.4),N,0,5,-6.5),U(s,new pe(.4,10,24),N,-14,5,0),U(s,new pe(.4,10,24),N,14,5,0);for(let Te=-3;Te<=3;Te++)U(s,new pe(.5,10,.6),$("#1f252e"),Te*4.6,5,-6.2,!1);let F=document.createElement("canvas");F.width=512,F.height=256;let Q=F.getContext("2d"),_e=new mi(F);_e.colorSpace=qt,It=(Te,ge)=>{Q.fillStyle="#120a0a",Q.fillRect(0,0,512,256),Q.fillStyle=Te<.25?"#ff3b30":Te<.5?"#ffb020":"#4ade80",Q.font="900 150px monospace",Q.textAlign="center",Q.textBaseline="middle",Q.fillText(String(Math.max(0,Math.ceil(ge))).padStart(2,"0"),256,112),Q.fillRect(40,214,432*Te,18),Q.strokeStyle="#fff3",Q.lineWidth=2,Q.strokeRect(40,214,432,18),_e.needsUpdate=!0},It(1,0);let be=new Xe(new _t(4.2,2.1),new ft({map:_e}));be.position.set(0,5.4,-6.1),s.add(be),U(s,new pe(4.5,2.4,.2),$("#0d1015"),0,5.4,-6.25,!1),Ke=new _i(16726570,0,22,2),Ke.position.set(0,6,-4),s.add(Ke),R.position.set(-10,0,-4.8),R.scale.setScalar(1.3),T.set(0,8.2,12.8),b.set(0,1.6,-1.2),w=.07,y.push((Te,ge)=>{Ke.intensity=p<.3&&h>0?Math.sin(ge*8)>0?20:2:0})}({escape:Mt,camp:Lt,airport:kt,detective:wt,timed:Ut}[e]||Lt)();let Ft=!0,ct=A=>{let D=Js(String(A),{w:96,h:96,scale:.55,bg:"#fcd34d",fg:"#3a2200",font:"900 56px Arial"});return D.position.y=2,D};function C(A){if(J(),rt=null,te=0,tt.clear(),pt.clear(),e==="camp"&&A.tiles){let D=ne(A.tiles.length,3.9,-60,300);A.tiles.forEach((N,F)=>{let Q=os(N.id);Q.scale.setScalar(N.id==="tent"||N.id==="fire"?.9:1.5),B(N.id,Q,D[F],{ped:"#6a5a46",label:de(N)?N.label:void 0,tagY:.3,m:Q,hitY:.7})})}if(e==="timed"&&A.tiles){let D=A.tiles.length,N=ae/L<1.15,F=N?3:4,Q=Math.ceil(D/F),_e=N?3.1:3.4,be=Array.from({length:D},(ge,he)=>new P((he%F-(Math.min(F,D-Math.floor(he/F)*F)-1)/2)*_e,0,(Math.floor(he/F)-(Q-1)/2)*(N?3.2:3.8)+(N?.4:-.6)));z=N?4.6:7.4,H(ae,L);let Te=ge=>({light:"lamp",police:"telephone",water:"bottle",sit:"sit",stand:"stand",run:"run"})[ge]||ge;A.tiles.forEach((ge,he)=>{let fe=Te(ge.id),re=fe==="sit"||fe==="stand"||fe==="run"?g_(fe==="sit"?"sit":fe==="run"?"run":"stand"):os(fe);re.scale.multiplyScalar(fe==="door"||fe==="window"||fe==="lamp"||fe==="telephone"||fe==="chair"?1.5:fe==="sit"||fe==="stand"||fe==="run"?1.6:1.7),B(ge.id,re,be[he],{ped:"#4a5568",label:de(ge)?ge.label:void 0,tagY:.3,m:re,hitY:.8})})}if(e==="detective"&&A.cards){let D=ie(A.cards.length,1.85,.9);A.cards.forEach((N,F)=>{let Q=rd(N.id),_e=dl(Q,F*3);_e.rotation.y=0,D[F].y=.35;let be=B(N.id,_e,D[F],{ped:"",radius:.7,hitY:1}),Te=Js(String(F+1)+" "+{happy:"\u{1F60A}",sad:"\u{1F622}",tired:"\u{1F634}"}[Q.mood],{w:200,h:96,scale:.7,bg:"rgba(255,255,255,.95)",fg:"#14161a",font:"900 54px Arial"});Te.position.set(0,.18,.95),be.obj.add(Te);let ge=new Ur(16774358,60,14,.4,.6,1);ge.position.set(D[F].x,7,D[F].z+1),ge.target.position.copy(D[F]),O.add(ge,ge.target);let he=new Xe(new $t(1.3,5.5,18,1,!0).translate(0,-2.75,0),new ft({color:"#fff4d6",transparent:!0,opacity:.07,blending:jt,depthWrite:!1,side:Ht}));he.position.set(D[F].x,6.2,D[F].z),O.add(he)})}if(e==="airport"&&A.tiles){let D=ie(A.tiles.length,3.1,1.2),N=A.tiles[0].big;A.tiles.forEach((F,Q)=>{let _e=new $e;U(_e,new et(.08,.08,2,8),$("#3b4350",{metal:.5}),0,1,0),U(_e,new et(.5,.55,.1,16),$("#3b4350",{metal:.5}),0,.05,0);let be=Wt(512,320,(he,fe,re)=>{if(N)he.fillStyle="#0f0a0a",he.fillRect(0,0,fe,re),he.fillStyle="#ff4a3a",he.font="900 150px monospace",he.textAlign="center",he.textBaseline="middle",he.fillText(F.label,fe/2,re/2+6),he.fillStyle="#ffffff55",he.font="700 34px Arial",he.fillText("DEPARTURE",fe/2,48);else{let Ne=he.createLinearGradient(0,0,0,re);Ne.addColorStop(0,"#2f7bff"),Ne.addColorStop(1,"#1d4fb0"),he.fillStyle=Ne,he.fillRect(0,0,fe,re),he.fillStyle="#fff",he.font="130px Arial",he.textAlign="center",he.textBaseline="middle",he.fillText(F.e||"\u2708",fe/2,re*.42),he.font="900 54px Arial",he.fillText(F.label,fe/2,re*.82)}}),Te=U(_e,new pe(2.4,1.5,.12),$("#e9eef5"),0,2.2,0),ge=new Xe(new _t(2.25,1.4),new ft({map:be}));ge.position.set(0,2.2,.07),_e.add(ge),_e.scale.setScalar(1),B(F.id,_e,D[Q],{ped:"",radius:.9,hitY:1.8,m:void 0})})}if(e==="escape"&&A.type==="move"){me({...A.start,trail:[{x:A.start.x,y:A.start.y}]},!0);let D=s.children.find(N=>N.userData.start);if(D){let N=Ae(A.start.x,A.start.y);D.position.set(N.x,.03,N.z)}}q([],!1)}let _=[],X=!1;function q(A,D){_=A,X=D,V.forEach(N=>{let F=A.indexOf(N.id),Q=F>=0;if(N.state==="right"||N.state==="wrong")return;if(N.state=Q?"sel":"idle",N.badge&&(N.obj.remove(N.badge),N.badge=void 0),Q&&D){let be=ct(F+1);be.position.y=2.3,N.obj.add(be),N.badge=be}let _e=N.model?.userData.activate||N.model?.userData?.activate;_e&&_e(Q)})}function ee(A,D){V.forEach(N=>{A.includes(N.id)?N.state="right":D.includes(N.id)&&(N.state="wrong")})}function me(A,D){j=A,D&&oe&&(ue.copy(Ae(A.x,A.y)),Ve=Je(A.h),oe.position.copy(ue),oe.rotation.y=Ve),pt.clear();let N=new ft({color:"#4fb7ff",transparent:!0,opacity:.55,blending:jt,depthWrite:!1});A.trail.forEach(F=>{let Q=new Xe(new Sn(.5,24).rotateX(-Math.PI/2),N),_e=Ae(F.x,F.y);Q.position.set(_e.x,.035,_e.z),pt.add(Q)})}function ye(A,D){tt.clear();let N=new ft({color:"#4ade80",transparent:!0,opacity:.5,blending:jt,depthWrite:!1});A.forEach(ge=>{let he=new Xe(new Sn(.45,24).rotateX(-Math.PI/2),N),fe=Ae(ge.x,ge.y);he.position.set(fe.x,.045,fe.z),tt.add(he)});let F=new $e,Q=Ae(D.x,D.y);F.position.set(Q.x,0,Q.z+.7),s.add(F);let _e=os("door");_e.scale.setScalar(2.2),_e.position.set(-.55,0,0),_e.userData.activate(!0),F.add(_e);let be=new Xe(new _t(1.1,.36),new ft({color:"#17c964"}));be.position.set(0,2.55,.05),F.add(be);let Te=new _i(4906624,10,7,2);Te.position.set(0,1.6,.8),F.add(Te),rt=F,te=0,tt.userData.exit=F}function se(A){f=1,g=A==="bad"?.8:.15,E.color.set(A==="good"?"#7dffb0":"#ff4a3a"),E.intensity=A==="good"?30:60;let D=new We(A==="good"?"#ffe27a":"#ff4a3a");m.burst(b.x,1.5,b.z+1,A==="good"?46:24,4.5,.9,D),v=A==="good"?1:0}let ce=new Fr,ve=new Pe,Be=null,xe=null,Me=A=>{let D=a.getBoundingClientRect();ve.set((A.clientX-D.left)/D.width*2-1,-(A.clientY-D.top)/D.height*2+1),ce.setFromCamera(ve,r);let N=ce.intersectObjects(V.map(F=>F.hit),!1);return N.length?N[0].object.userData.id:null},De=A=>{Be={x:A.clientX,y:A.clientY}},ke=A=>{xe=Me(A),a.style.cursor=xe?"pointer":"default"},Qe=A=>{if(!Be)return;let D=Math.hypot(A.clientX-Be.x,A.clientY-Be.y);if(Be=null,D<8){let N=Me(A);N&&t.onPick(N)}};a.style.touchAction="manipulation",a.addEventListener("pointerdown",De),a.addEventListener("pointermove",ke),a.addEventListener("pointerup",Qe),a.addEventListener("pointerleave",()=>{xe=null});let z=6,Se=1,ae=800,L=600,H=(A,D)=>{ae=A,L=D,r.fov=42,r.updateProjectionMatrix();let N=T.distanceTo(b)||10,F=z/(Math.tan(21*ad)*(A/D));Se=Math.max(1,F/N)};return z={escape:7.2,camp:5.8,airport:6.2,detective:4.9,timed:7.4}[e]||6,n.onResize(H),n.onFrame((A,D)=>{u=D,y.forEach(F=>F(A,D)),R.userData.tick(D,l),V.forEach((F,Q)=>{let _e=xe===F.id?1:0;F.hover=vi(F.hover,_e,Cn(A,10)),F.t+=A;let be=F.ring.material,Te=F.state==="sel"?"#fcd34d":F.state==="right"?"#4ade80":F.state==="wrong"?"#f87171":"#ffe27a";be.color.set(Te),be.opacity=F.state==="idle"?.28+.18*Math.sin(F.t*3)+F.hover*.4:.9,F.ring.scale.setScalar((1+.06*Math.sin(F.t*3)+F.hover*.18)*(F.ring.userData.base||1.15));let ge=F.state==="right"?Math.abs(Math.sin(F.t*7))*.18:0,he=F.state==="wrong"?Math.sin(F.t*40)*.05:0,fe=F.state==="sel"?.12:0;F.obj.position.set(F.base.x+he,F.base.y+ge+fe*Math.sin(F.t*5)*.5,F.base.z);let re=F.model;re&&(re.userData.tick&&re.userData.tick(F.t),e!=="detective"&&re.userData.fig);let Ne=F.obj.children.find(Ue=>Ue.userData.arms);if(Ne){let Ue=Ne.userData.mood,Oe=Ne.userData.arms;Ne.userData.torso.rotation.x=(Ne.userData.torso.userData.base??(Ne.userData.torso.userData.base=Ne.userData.torso.rotation.x))+(Ue==="tired"?.12+Math.sin(F.t*1.1)*.03:Ue==="sad"?.1:0),Ne.position.y=Math.sin(F.t*1.8+Q)*.01+(F.state==="sel"?.05:0),Ne.userData.head.rotation.z=Math.sin(F.t*1.3+Q)*(Ue==="happy"?.07:.03)+(Ue==="tired"?.18:0)}if(F.tag){let Ue=r.position.distanceTo(F.obj.position);F.tag.scale.copy(F.tag.userData.base).multiplyScalar((1+F.hover*.12)*hn(Ue/12.5,.6,1.5))}}),m.update(A),f=Math.max(0,f-A*2.5),E.intensity*=Math.pow(.02,A),g=Math.max(0,g-A*1.6);let N=Math.sin(D*.35)*w;I.copy(T).sub(b).multiplyScalar(Se).applyAxisAngle(x,N).add(b),r.position.copy(I),r.position.y+=Math.sin(D*.27)*.12,g>0&&(r.position.x+=(Math.random()-.5)*g*.4,r.position.y+=(Math.random()-.5)*g*.3),r.lookAt(b)}),{setStep:C,setSpeaking:A=>{l=A},setSelected:q,mark:ee,setMove:me,reveal:ye,setTimer:(A,D)=>{p=A,h=D,It&&It(A,D)},flash:se,destroy:()=>{a.removeEventListener("pointerdown",De),a.removeEventListener("pointermove",ke),a.removeEventListener("pointerup",Qe),n.dispose()}}}function __(i,e,t,n=.04){return new pe(i,e,t)}window.L1_3D={available:Qu,race:ed,listen:od};})();
/*! Bundled license information:

three/build/three.core.js:
  (**
   * @license
   * Copyright 2010-2026 Three.js Authors
   * SPDX-License-Identifier: MIT
   *)

three/build/three.module.js:
  (**
   * @license
   * Copyright 2010-2026 Three.js Authors
   * SPDX-License-Identifier: MIT
   *)
*/
