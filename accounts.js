import {firebaseConfig} from './firebase-config.js?v=3.1.0';
const loadSDK=async()=>{
 const [app,auth]=await Promise.all([import('https://www.gstatic.com/firebasejs/13.1.0/firebase-app.js'),import('https://www.gstatic.com/firebasejs/13.1.0/firebase-auth.js')]);
 return {...app,...auth};
};
export function accountError(error){return ({'auth/invalid-email':'Enter a valid email address.','auth/email-already-in-use':'That email already has an account. Sign in instead.','auth/weak-password':'Choose a stronger password with at least 8 characters.','auth/invalid-credential':'Email or password is incorrect.','auth/wrong-password':'Email or password is incorrect.','auth/user-not-found':'Email or password is incorrect.','auth/too-many-requests':'Too many attempts. Please try again later.','auth/network-request-failed':'Unable to reach Firebase. Check your connection and try again.','auth/operation-not-allowed':'Email sign-in is unavailable. Please try again later.','auth/user-disabled':'This account has been disabled.'})[error?.code]||'Unable to complete the account request. Please try again.';}
export function createAccounts({sdkLoader=loadSDK,config=firebaseConfig,emulatorURL=null}={}){
 const listeners=new Set();let sdk,auth;const account={user:null,error:null};
 const emit=()=>{for(const fn of listeners)fn(account.user);};
 account.ready=(async()=>{sdk=await sdkLoader();auth=sdk.getAuth(sdk.initializeApp(config));if(emulatorURL)sdk.connectAuthEmulator(auth,emulatorURL,{disableWarnings:true});await sdk.setPersistence(auth,sdk.browserSessionPersistence);await new Promise((resolve,reject)=>{let first=true;sdk.onAuthStateChanged(auth,user=>{account.user=user;emit();if(first){first=false;resolve();}},reject);});return account;})();
 // Offline authentication must not stop local matches from loading.
 account.ready.catch(error=>{account.error=error;});
 account.subscribe=fn=>{listeners.add(fn);fn(account.user);return()=>listeners.delete(fn);};
 account.create=async(name,email,password)=>{await account.ready;const result=await sdk.createUserWithEmailAndPassword(auth,email.trim(),password);await sdk.updateProfile(result.user,{displayName:name.trim().slice(0,14)||'Player'});account.user=result.user;emit();return result.user;};
 account.signIn=async(email,password)=>{await account.ready;return sdk.signInWithEmailAndPassword(auth,email.trim(),password);};
 account.signOut=async()=>{await account.ready;await sdk.signOut(auth);};
 account.rename=async name=>{await account.ready;if(!account.user)return;await sdk.updateProfile(account.user,{displayName:name.trim().slice(0,14)||'Player'});emit();};
 account.reset=async email=>{await account.ready;return sdk.sendPasswordResetEmail(auth,email.trim());};
 account.verify=async()=>{await account.ready;if(account.user)return sdk.sendEmailVerification(account.user);};
 return account;
}
export function createAccountUI(api){
 const {$,$$,modal,escape,accounts,profile,inventory,progression,updateProfile,statsMenu,toast}=api;
 function screen(){const user=accounts.user;
  modal('<h2>Account</h2><div class="native-account"><canvas width="300" height="300"></canvas><div><h3>'+escape(user?.displayName||profile.name)+'</h3><p>3′ 6″ &nbsp; 92 lbs</p><p>Level '+progression.data.level+' &nbsp; XP '+progression.data.xp+'</p><p class="account-state">'+(user?'SIGNED IN':'GUEST')+'</p>'+(user?'<p>'+escape(user.email||'')+'</p><p>'+ (user.emailVerified?'Email verified':'Email not verified')+'</p>':'<p>Create a Firebase account to keep your player identity.</p>')+'</div></div><div class="account-actions">'+(user?'<button id="account-rename" class="au-button small">CHANGE NAME</button>'+(!user.emailVerified?'<button id="account-verify" class="au-button small">VERIFY EMAIL</button>':'')+'<button id="account-signout" class="au-button small">SIGN OUT</button>':'<button id="account-signin" class="au-button primary">SIGN IN</button><button id="account-create" class="au-button">CREATE ACCOUNT</button>')+'<button id="account-stats" class="au-button small">STATS</button></div><p class="account-notice">'+(user?'Firebase account · browser fan game':'Guest play is available without signing in.')+'<br>Beans, cosmetics and match statistics are saved on this browser.</p><p id="account-feedback" role="status"></p>','account');
  inventory.paint($('.native-account canvas'),{type:'none'},profile.color,true);$('#account-stats').onclick=statsMenu;
  if(!user){$('#account-signin').onclick=()=>form();$('#account-create').onclick=()=>form('create');return;}
  $('#account-signout').onclick=async()=>run(()=>accounts.signOut(),screen);
  if($('#account-verify'))$('#account-verify').onclick=()=>run(()=>accounts.verify(),()=>{$('#account-feedback').textContent='Verification email sent. Check your inbox.';});
  $('#account-rename').onclick=()=>{modal('<h2>Change Name</h2><form id="rename-form"><label for="account-name">PLAYER NAME</label><input id="account-name" maxlength="14" required value="'+escape(user.displayName||profile.name)+'"><p id="account-feedback" role="status"></p><button class="au-button primary">CONFIRM</button></form>','account');$('#rename-form').onsubmit=e=>{e.preventDefault();run(()=>accounts.rename($('#account-name').value),()=>{profile.name=accounts.user.displayName;updateProfile();screen();});};};
 }
 async function run(action,done){const root=$('#modal'),buttons=[...root.querySelectorAll('button')];buttons.forEach(b=>b.disabled=true);try{await action();done?.();}catch(e){if($('#account-feedback'))$('#account-feedback').textContent=accountError(e);else toast(accountError(e));}finally{if(root.isConnected)buttons.forEach(b=>b.disabled=false);}}
 function form(mode='signin'){
  const create=mode==='create',reset=mode==='reset';modal('<h2>'+ (create?'Create Account':reset?'Recover Account':'Sign In')+'</h2><form id="auth-form" class="account-form">'+(create?'<label for="auth-name">PLAYER NAME</label><input id="auth-name" maxlength="14" required autocomplete="nickname" value="'+escape(profile.name)+'">':'')+'<label for="auth-email">EMAIL</label><input id="auth-email" type="email" required autocomplete="email">'+(!reset?'<label for="auth-password">PASSWORD</label><input id="auth-password" type="password" '+(create?'minlength="8"':'')+' required autocomplete="'+(create?'new-password':'current-password')+'">'+(create?'<label for="auth-confirm">CONFIRM PASSWORD</label><input id="auth-confirm" type="password" minlength="8" required autocomplete="new-password">':''):'')+'<p id="account-feedback" role="status" aria-live="polite"></p><button type="submit" class="au-button primary">'+(create?'CREATE ACCOUNT':reset?'SEND RECOVERY EMAIL':'SIGN IN')+'</button></form><div class="account-actions"><button id="auth-back" class="au-button small">BACK</button>'+(!reset?'<button id="auth-reset" class="au-button small">FORGOT PASSWORD?</button>':'')+'</div><p class="account-notice">Your email and password go directly to Firebase Authentication. This is an account for this browser fan game.</p>','account');
  $('#auth-back').onclick=screen;if($('#auth-reset'))$('#auth-reset').onclick=()=>form('reset');
  $('#auth-form').onsubmit=e=>{e.preventDefault();const email=$('#auth-email').value,password=$('#auth-password')?.value;if(create&&password!==$('#auth-confirm').value){$('#account-feedback').textContent='Passwords do not match.';return;}run(()=>reset?accounts.reset(email):create?accounts.create($('#auth-name').value,email,password):accounts.signIn(email,password),()=>{if(reset){$('#account-feedback').textContent='If an account exists for that email, a recovery email has been sent.';return;}$('#auth-password').value='';if($('#auth-confirm'))$('#auth-confirm').value='';screen();});};
 }
 return {screen,form};
}
