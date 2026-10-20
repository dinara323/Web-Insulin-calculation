const {test} = require('node:test');
const assert = require('node:assert/strict');
const base=process.env.LAB4_URL || 'http://localhost:3004';
test('Redis sessions isolate users, protect writes, and revoke cookies on logout',async()=>{
 const suffix=Date.now();
 async function request(path,method='GET',body,cookie){
  const response=await fetch(base+path,{method,headers:{'Content-Type':'application/json',...(cookie?{Cookie:cookie}:{})},body:body===undefined?undefined:JSON.stringify(body)});
  const text=await response.text();return {status:response.status,data:text?JSON.parse(text):null,cookie:response.headers.get('set-cookie')?.split(';')[0]};
 }
 const owner={name:'owner_'+suffix,password:'Lab4-test-password!'},other={name:'other_'+suffix,password:'Lab4-test-password!'};
 assert.equal((await request('/api/services')).status,200);
 assert.equal((await request('/api/services/1/publish','PUT',{})).status,401);
 assert.equal((await request('/api/users/register','POST',owner)).status,201);
 assert.equal((await request('/api/users/register','POST',owner)).status,409);
 assert.equal((await request('/api/users/auth','POST',{...owner,password:'incorrect-password'})).status,401);
 const login=await request('/api/users/auth','POST',owner);assert.equal(login.status,200);assert.ok(login.cookie);
 await request('/api/users/register','POST',other);const second=await request('/api/users/auth','POST',other);
 const draft=await request('/api/services','POST',{name:'ЛР4 проверка изоляции',description:'Автоматическая проверка прав',age:40,weight:70,creatorId:second.data.user.id},login.cookie);
 assert.equal(draft.status,201);assert.equal(draft.data.creatorId,login.data.user.id);
 const url='/api/services/'+draft.data.id;
 assert.equal((await request(url+'/publish','PUT',{age:65,weight:80},second.cookie)).status,404);
 assert.equal((await request(url,'DELETE',undefined,second.cookie)).status,404);
 assert.equal((await request('/api/services/draft','GET',undefined,second.cookie)).data,null);
 assert.equal((await request(url+'/publish','PUT',{age:-1,weight:80},login.cookie)).status,400);
 const published=await request(url+'/publish','PUT',{age:65,weight:80},login.cookie);
 assert.equal(published.status,200);assert.equal(published.data.sensitivityCoefficient,5);assert.equal(published.data.age,65);assert.equal(published.data.weight,80);assert.ok(published.data.formedAt);
 for(let i=0;i<2;i++)assert.equal((await request(url+'/like','POST',{value:1},login.cookie)).status,201);
 const card=await request('/api/services/feed?id='+draft.data.id,'GET',undefined,login.cookie);assert.equal(card.data.likesCount,1);
 assert.equal((await request('/api/services','GET',undefined,'sessionId=invalid')).status,200);
 await request(url,'DELETE',undefined,login.cookie);
 assert.equal((await request('/api/users/logout','POST',{},login.cookie)).status,200);
 assert.equal((await request('/api/users/me','GET',undefined,login.cookie)).status,401);
 assert.equal((await request(url+'/like','POST',{value:1},login.cookie)).status,401);
 await request('/api/users/logout','POST',{},second.cookie);
});
