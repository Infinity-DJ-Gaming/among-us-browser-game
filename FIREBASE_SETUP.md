# Firebase Authentication

Production project: [among-us-browser-game](https://console.firebase.google.com/project/among-us-browser-game/authentication/providers). Created on the no-cost Spark plan; Analytics and Hosting were not enabled. GitHub Pages serves the game.

Email/Password is enabled. Authorized origins include the project's default Firebase domains, localhost, and `infinity-dj-gaming.github.io`. The web app is named Among Us GitHub Pages. Public client identifiers are in `firebase-config.js`; these are not service-account or administrator credentials.

Open **My Account → Create Account** to register your own email and password. Sign In, Sign Out, Change Name, Verify Email and Forgot Password use Firebase's official Authentication SDK. Password recovery sends an email; it does not change a password inside this game's UI. The SDK manages session tokens using browser-session persistence. Raw passwords are not saved by the game. Reloading the same browser session restores the signed-in identity; signing out ends it.

No Firestore database, public storage access, cloud wallet, official Innersloth account link, or paid Firebase service was provisioned. Beans, cosmetics and statistics retain the existing local progression store. Guest play loads independently of Firebase and continues if the authentication SDK cannot load.

Validation: production console shows Email/Password Enabled and the Pages domain in Authorized domains. The live Firebase project rejected a nonexistent test identity through the shipped UI with the expected friendly invalid-credentials message. The same account controller passed local Auth Emulator checks for create, duplicate rejection, sign out, wrong-password rejection, sign in with stable UID, rename, verification, and password-recovery email generation. No real player's password was chosen or entered by automation, and no production test account or real verification/recovery email was created.
