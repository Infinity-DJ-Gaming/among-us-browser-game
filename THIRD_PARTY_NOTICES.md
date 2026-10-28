# Third-party notices

## Innersloth

Among Us game art and audio are the property of Innersloth LLC. Source archive links and attribution are provided in README.md and in the in-game Credits screen. This fan implementation is not endorsed by Innersloth.

## PeerJS

The bundled peerjs.min.js is PeerJS 1.5.5, distributed under the MIT License.

Copyright (c) 2015 Michelle Bu and Eric Zhang, http://peerjs.com. The unmodified upstream license is also included in PEERJS-LICENSE.txt.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

## Barlow fonts

Barlow Regular, Bold, ExtraBold and Black are redistributed under the SIL Open Font License, Version 1.1. The upstream license is included in BARLOW-OFL.txt. Source: https://github.com/google/fonts/tree/main/ofl/barlow . The original game archive includes Barlow SDF atlases. Native Brook bitmap glyph masks are Among Us artwork; the prepared static labels use reconstructed spacing because original glyph metrics were unavailable.

Additional original menu, tablet, nameplate, palette-mask and shader/noise sources are documented in REFERENCE_NOTES.md and the accompanying atlas metadata. Reference crops are labeled as such and are not claimed to be clean native bitmap exports.


## Expanded v3.0 original assets

The Polus scene/panels/fog, expanded cosmetic and UI atlases, Cosmicube covers/Pods, native skin poses and additional sound recordings are Innersloth game assets. Asset metadata records source URLs and processing. They are included as referenced fan assets; no ownership or separate license to the original game artwork/audio is claimed. The added FLAC banks are processed original recordings, not generated substitutes. Original native English localization supplies cosmetic names. See assets-catalog.json, assets-polus-tasks.json, assets-audio-v4.json and REFERENCE_NOTES.md for provenance and reconstruction limits.


### v3.1 installed-game references

Read-only source: the user's installed `C:/XboxGames/Among Us/Content/Among Us_Data`. No installation files were changed. `initialmaps_assets_all.bundle` supplied Sprite `map` (Skeld), `mapPB` (Polus), and `sabotage_comms`, `sabotage_reactor`, `sabotage_Doors`, `sabotage_O2`, `sabotage_electricity`. The red tint masks retain their original silhouettes/white outlines and are tinted blue or red with translucency for the browser overlay. `sharedassets2.assets` supplied `progress_bar` and `ghost0001`. `resources.assets` supplied `VCR SDF Atlas` and the VCR TMP character/glyph metrics. All original game art and typography remain Innersloth property. These extracts do not include game executables or private game configuration.

The Shhh figure, circle and lettering use the user's supplied original-game screenshot, sampled inside the browser renderer without the surrounding UI. The larger layout, title scale, crew arrangement, individual-role view, task list, and Play cards follow the user's references. Original Wiki task marker: https://among-us.fandom.com/wiki/Personal_map . Additional reference URLs: https://among-us.fandom.com/wiki/Role , https://among-us.fandom.com/wiki/Main_menu , https://among-us.fandom.com/wiki/Play . Installed assets were used for the map instead of embedding Wiki screenshots with a second background/player/UI baked into them.

Firebase Authentication uses the official modular Web SDK from Google's gstatic CDN. Integration reference: https://firebase.google.com/docs/auth/web/password-auth and https://firebase.google.com/docs/web/alt-setup . The public client configuration identifies this dedicated fan-game project and contains no administrator or service-account credentials.


### v3.2 lobby and chat references

User references: https://among-us.fandom.com/wiki/Lobby and the supplied original lobby, Create Game, Play Again, Quit and chat screenshots. The public Lobby page wikitext/image/link listing was read through the Fandom parse API when the regular page could not be loaded. It documents the ten chairs, additional players reusing the first five chairs, white-glow/spawn/jump order, settings summary, lobby music and action sounds. The browser implementation uses a ten-minute idle timeout with a final sixty-second warning; this is an implementation setting.

Read-only installed sources: sharedassets2.assets supplied Dropship, box, dropship_panel, panel_Wardrobe, Spawn0001–Spawn0055 and SpawnGlow frames, CreateGameBackgrounds/CreateGameCrewmates, map icons/banner wordart, tooltip_crewmate, and capacity art. Native sparse spawn frames retain original sprite pivots; a packed atlas plays at 24 fps. Create-card layers use original separate character cutouts, with reconstructed browser positions. sharedassets4.assets supplied lobby summary panes, Start frames, Wardrobe action art, chat panel/message art, send/keyboard/wheel/player-control icons. resources.assets supplied Brook SDF glyph/character metrics for the new 43-label atlas. These new labels use the original metrics; older prepared labels retain their previously documented reconstruction limits.

Native Play Again, Quit and Close images were copied from the user's supplied PNG files. The seven supplied sound files were copied unchanged from Downloads; the MP3's original .mpeg suffix was renamed .mp3 for browser serving. The game uses original art/audio as a fan project and claims no separate ownership or redistribution license. No executable or private installation configuration is included, and the XboxGames installation was not modified. This remains a browser recreation with selected native assets and reconstructed game logic/layouts.
