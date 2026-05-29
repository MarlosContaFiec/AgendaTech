var API=import.meta.env.VITE_API_URL||'http://localhost:3000';
var _a=null,_r=null,_rf=null;
export function setTokens(a,r){_a=a;_r=r;}
export function clearTokens(){_a=null;_r=null;}
async function doRefresh(){if(!_r)return null;try{var res=await fetch(API+'/api/auth/refresh',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({refresh_token:_r})});var d=await res.json();if(d.success){_a=d.data.tokens.access;_r=d.data.tokens.refresh;localStorage.setItem('access_token',_a);localStorage.setItem('refresh_token',_r);return _a;}}catch(e){}return null;}
export async function api(method,path,body,token){
  var t=token||_a;var h={'Content-Type':'application/json'};if(t)h['Authorization']='Bearer '+t;
  try{var res=await fetch(API+path,{method:method,headers:h,body:body?JSON.stringify(body):undefined});
  if(res.status===401&&t&&_r){if(!_rf)_rf=doRefresh();var nt=await _rf;_rf=null;if(nt){h['Authorization']='Bearer '+nt;res=await fetch(API+path,{method:method,headers:h,body:body?JSON.stringify(body):undefined});}else{window.dispatchEvent(new Event('auth:expired'));}}
  return res.json();}catch(e){return{success:false,message:'Erro de conexao'};}
}
export async function uploadFile(file,token){var t=token||_a;var fd=new FormData();fd.append('arquivo',file);try{var res=await fetch(API+'/api/upload/single',{method:'POST',headers:{'Authorization':'Bearer '+t},body:fd});return res.json();}catch(e){return{success:false};}}
export async function uploadMultiple(files,token){var t=token||_a;var fd=new FormData();for(var i=0;i<files.length;i++)fd.append('arquivos',files[i]);try{var res=await fetch(API+'/api/upload/multiple',{method:'POST',headers:{'Authorization':'Bearer '+t},body:fd});return res.json();}catch(e){return{success:false};}}
export function getFileUrl(p){if(!p)return'';if(p.startsWith('http'))return p;return API+p;}