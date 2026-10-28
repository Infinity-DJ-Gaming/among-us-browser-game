# Interface and mechanics reference audit

Inspected October 26–27, 2026. This is a focused audit of the implemented Skeld game and the supplied screenshots, not every article in the wiki.

## Screens

- Main menu: https://among-us.fandom.com/wiki/Main_menu . Left Play/Inventory/Shop plus News/My Account/Settings/Credits; Friends/status strip, ship window and drifting crewmates. The article explicitly labels its menu screenshot 2023.6.13 and also flags outdated details.
- Voting: https://among-us.fandom.com/wiki/Voting . Separate discussion/voting, green check/red cancel, voted status, reporter megaphone, three columns, chat overlay, visible tally and subsequent ejection.
- Report: https://among-us.fandom.com/wiki/Report . Original native corpse/skull art; title/tape are clean invariant reference crops. The original shader algorithm and noise were recovered from https://github.com/itsssskye/amongus-assets/blob/main/Assets/Shader/Unlit_SpeedLines.json and its ReportBodyAnimation prefab. Report material colors were absent and are estimated from the reference.
- Ejection: https://among-us.fandom.com/wiki/Ejection . Ejectee remains alive through the tally and becomes a ghost during ejection. Uncast ballots are not skips. Primary protocol implementation corroboration: https://github.com/Impostor/Impostor/blob/master/src/Impostor.Server/Net/Inner/Objects/InnerMeetingHud.cs .
- Settings: https://among-us.fandom.com/wiki/Options . Task-bar modes, anonymous votes and emergency settings are exposed for this game.

## Tasks and related mechanics

- https://among-us.fandom.com/wiki/Tasks
- https://among-us.fandom.com/wiki/Fix_Wiring — shared common-task type; independent three-panel routes in canonical Electrical, Storage, Admin, Navigation, Cafeteria, Security order.
- https://among-us.fandom.com/wiki/Start_Reactor — five sequences with saved progress after closing.
- https://among-us.fandom.com/wiki/Clear_Asteroids — twenty hits with saved count. Its article and main task table disagree about its Skeld category; this release preserves the existing Long label rather than inventing certainty.
- https://among-us.fandom.com/wiki/Clean_Vent — eject on open, block the specific vent while cleaning, release on cancel; Engineers cannot enter their assigned unfinished cleaning vent.
- https://among-us.fandom.com/wiki/Inspect_Sample — timed incubation and restarting after a wrong result.
- https://among-us.fandom.com/wiki/Align_Engine_Output — long task category and both engines.
- https://among-us.fandom.com/wiki/Empty_Chute — O2 then Storage, alongside the separate Cafeteria garbage job.
- https://among-us.fandom.com/wiki/Emergency_button — meeting usage limits, cooldown and crisis restrictions.
- https://among-us.fandom.com/wiki/Task_Bar — Always/Meetings/Never updates and Comms visibility.
- https://among-us.fandom.com/wiki/Vent
- https://among-us.fandom.com/wiki/Ghost
- https://among-us.fandom.com/wiki/Admin_(ability)

## Asset processing and limits

Menu wall/window/panel, native icons, tablet body/button, portraits, nameplates, vote helmets, confirmation marks and report actors are original image assets. Packed sprites were restored using source UV/mesh data. Native Brook glyph shapes were composed into static English menu labels with reconstructed advances; Barlow TTFs come from its official Google Fonts repository under the included OFL.

The first ten color variants remain from the earlier archive. The eight additions use current wiki display main/shadow pairs from https://among-us.fandom.com/wiki/Module:Common/colors , with exact pairs in assets-colors-v3.json. This does not establish an exact client Palette.PlayerColors version.

The runtime is a new browser implementation. Exact original timing/material values are not all exported. Settings have bounded browser-game choices. This release contains two maps and the expanded selected cosmetic catalog; official accounts, friends services, purchases, official public matchmaking, other maps and modes are not implemented. Bots use authored contextual rules. The Viper victim presentation and limited Influencer card deck retain the limitations documented in README.md.


## v3.0 deeper audit (October 27, 2026)

Traversed all 1,300 entries in Category:Audio, including pagination. The category also contains unsupported Among Us 3D, other maps, Hide n Seek and promotional clips; those are not mapped to unrelated actions. The release has 314 distinct native audio keys: the earlier 181 clips, six external role/acid clips and 127 additional recordings. Three new FLAC audiosprites preserve 22,050 Hz mono samples. The browser decoded all banks successfully. Every clip has its action/source URL in assets-audio-v4.json.

Read the supplied Play, Wardrobe, Shop, News, Account and Stats pages, then relevant links: Local, Online, Practice, How to Play, My Account, Create Game, Find Game, Enter Code, Lobby, Currency, Beans, Stars, Pods, Level, Cosmicubes and the MIRA/Polus/Snack pages. Read Polus/Gallery, its task/location pages, Fix Lights, Reset Seismic Stabilizers, vents, doors and decontamination. Native task/map/cosmetic exports and localized names were checked against those references. This is a focused implementation-related crawl, not every wiki article.

- https://among-us.fandom.com/wiki/Category:Audio
- https://among-us.fandom.com/wiki/Play
- https://among-us.fandom.com/wiki/Wardrobe
- https://among-us.fandom.com/wiki/Shop
- https://among-us.fandom.com/wiki/News
- https://among-us.fandom.com/wiki/Account
- https://among-us.fandom.com/wiki/Stats
- https://among-us.fandom.com/wiki/Polus
- https://among-us.fandom.com/wiki/Polus/Gallery
- https://among-us.fandom.com/wiki/Fix_Lights
- https://among-us.fandom.com/wiki/Reset_Seismic_Stabilizers
- https://among-us.fandom.com/wiki/Cosmicubes
- https://among-us.fandom.com/wiki/MIRA_Cosmicube
- https://among-us.fandom.com/wiki/Polus_Cosmicube
- https://among-us.fandom.com/wiki/Snack_Cosmicube
- https://among-us.fandom.com/wiki/Beans
- https://among-us.fandom.com/wiki/Pods
- https://among-us.fandom.com/wiki/Level

News summaries were checked against the official announcements, not invented updates: https://www.innersloth.com/impostor-month-begins/ (October 1, 2026) and https://www.innersloth.com/new-ghost-crewmate-role-the-influencer-emergency-meeting-44/ (September 29, 2026). The in-game links open the full original posts.

The cosmetic catalog metadata includes sources, original native localization, matched wiki Bean prices, 35 native animated skin sets and calibrated attachment rectangles. All 115 Cosmicube items, costs and marker locations are sourced from the wiki layouts; graph edges were recovered from visible native connector roads. The central hub is a free starting point, not a purchasable node. Stars are premium official-game currency and are not earned as ordinary match rewards. Bundle covers use the supplied reference offers; no official purchase service is simulated.

Native Polus scene sprites, task/vent positions and original ground meshes came from PolusShip and exported texture/sprite data. 106 sprite placements reconstruct the map. Exported vertex colors were unavailable, so flat ground/lava colors were estimated from references. Collision navigation is newly traced and conservative; all task stages, vents and scanner targets were route-checked. Weather mazes, panel animation pacing, door logic and decontamination timing are browser implementations.

New standalone original panel/fog textures: https://raw.githubusercontent.com/itsssskye/amongus-assets/main/Assets/Texture2D/panel_doors_bg.png , panel_door_breaker.png and decontaminationFog.png in that same directory. Fix Lights sprites are restored from SwitchesPanel.png and source sprite rectangles; native UI geometry is preserved while graph traces are drawn at runtime.

Rewards use tasks/correct ejections/kills/wins and a randomized 0.5×–5× level-up multiplier as documented. Exact base rewards and XP thresholds were not exposed, so progression.js states its local tuning directly. The community PeerJS directory is a new browser service and does not claim official servers, account identity, currency synchronization or LAN discovery.


### v3.1 installed-game references

Read-only source: the user's installed `C:/XboxGames/Among Us/Content/Among Us_Data`. No installation files were changed. `initialmaps_assets_all.bundle` supplied Sprite `map` (Skeld), `mapPB` (Polus), and `sabotage_comms`, `sabotage_reactor`, `sabotage_Doors`, `sabotage_O2`, `sabotage_electricity`. The red tint masks retain their original silhouettes/white outlines and are tinted blue or red with translucency for the browser overlay. `sharedassets2.assets` supplied `progress_bar` and `ghost0001`. `resources.assets` supplied `VCR SDF Atlas` and the VCR TMP character/glyph metrics. All original game art and typography remain Innersloth property. These extracts do not include game executables or private game configuration.

The Shhh figure, circle and lettering use the user's supplied original-game screenshot, sampled inside the browser renderer without the surrounding UI. The larger layout, title scale, crew arrangement, individual-role view, task list, and Play cards follow the user's references. Original Wiki task marker: https://among-us.fandom.com/wiki/Personal_map . Additional reference URLs: https://among-us.fandom.com/wiki/Role , https://among-us.fandom.com/wiki/Main_menu , https://among-us.fandom.com/wiki/Play . Installed assets were used for the map instead of embedding Wiki screenshots with a second background/player/UI baked into them.

Firebase Authentication uses the official modular Web SDK from Google's gstatic CDN. Integration reference: https://firebase.google.com/docs/auth/web/password-auth and https://firebase.google.com/docs/web/alt-setup . The public client configuration identifies this dedicated fan-game project and contains no administrator or service-account credentials.


### v3.2 lobby and chat references

User references: https://among-us.fandom.com/wiki/Lobby and the supplied original lobby, Create Game, Play Again, Quit and chat screenshots. The public Lobby page wikitext/image/link listing was read through the Fandom parse API when the regular page could not be loaded. It documents the ten chairs, additional players reusing the first five chairs, white-glow/spawn/jump order, settings summary, lobby music and action sounds. The browser implementation uses a ten-minute idle timeout with a final sixty-second warning; this is an implementation setting.

Read-only installed sources: sharedassets2.assets supplied Dropship, box, dropship_panel, panel_Wardrobe, Spawn0001–Spawn0055 and SpawnGlow frames, CreateGameBackgrounds/CreateGameCrewmates, map icons/banner wordart, tooltip_crewmate, and capacity art. Native sparse spawn frames retain original sprite pivots; a packed atlas plays at 24 fps. Create-card layers use original separate character cutouts, with reconstructed browser positions. sharedassets4.assets supplied lobby summary panes, Start frames, Wardrobe action art, chat panel/message art, send/keyboard/wheel/player-control icons. resources.assets supplied Brook SDF glyph/character metrics for the new 43-label atlas. These new labels use the original metrics; older prepared labels retain their previously documented reconstruction limits.

Native Play Again, Quit and Close images were copied from the user's supplied PNG files. The seven supplied sound files were copied unchanged from Downloads; the MP3's original .mpeg suffix was renamed .mp3 for browser serving. The game uses original art/audio as a fan project and claims no separate ownership or redistribution license. No executable or private installation configuration is included, and the XboxGames installation was not modified. This remains a browser recreation with selected native assets and reconstructed game logic/layouts.
