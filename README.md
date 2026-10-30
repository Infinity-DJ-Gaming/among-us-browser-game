# Among Us — browser fan game v3.7

Latest update: active-duration icon wipes, native Vitals/battery, close-range role targeting, persistent Detective files, witnessed transformation dialogue, vent hops/arrows, native task refinements and the 5,000 Beans → 10 Stars exchange. See [V3_7_NOTES.md](V3_7_NOTES.md) for changes, references and fidelity limits. The permanent [Test Lab](https://infinity-dj-gaming.github.io/among-us-browser-game/?test=1) includes every task stage and role/transport controls. The history below describes earlier releases.

Play: https://infinity-dj-gaming.github.io/among-us-browser-game/

A static, unofficial fan browser implementation with original Among Us artwork and original audio recordings. Run `node serve.mjs` and open http://127.0.0.1:8123. No build or API key is needed for bot games.

## Playing

Play offers Local, Online, How to Play, Practice and a bot-match option. Create Game selects The Skeld, MIRA HQ, Polus or the Airship, 4–15 players and 1–3 Impostors. The host starts a five-second countdown. Bots fill empty seats. Practice uses stationary dummies and grants no match rewards. Local browser rooms use an internet room code; automatic LAN discovery belongs to the official game.

WASD/arrows: move; E/Space: use; Q: kill; R: report; V: vent; F: sabotage; C: role ability; Tab/M: map; Esc: close/pause. Task panels have pointer controls and keyboard alternatives. Walk in the lobby and use the laptop to edit game settings, or Wardrobe to customize.

Online uses PeerJS/WebRTC. Create a private room and share its six-character code, or switch PRIVATE to PUBLIC for the community Find Game list. Select a region and filter by map/Impostor count. The directory is an ephemeral connected-browser service: hosts re-advertise after a directory keeper leaves. It is separate from official matchmaking. Keep the host tab open and active. No TURN relay is bundled, so some networks cannot connect. The host can kick/ban connected players; disconnected players become bots. Browser-local identity is not competitive anti-cheat.

## Maps and gameplay

- The Skeld: nineteen named jobs with physical stages, collision navigation, cameras, Admin, vents, sabotage, ghosts and feathered vision.
- Polus: original native scene artwork/object positions, twenty-three named jobs, twelve vents with the original adjacency graph, six cameras, Admin and Vitals, both decontamination passages and manually opened doors. Reset Seismic Stabilizers requires two simultaneous scanner holds, at different panels, within sixty seconds. No Oxygen sabotage or Clean Vent job is added to Polus.
- Polus jobs include Keys, Boarding Pass, weather-node maze/return switch, Telescope, Drill, Temperature, Tree, two Canisters, Artifacts, three Waterways valves in any order, Water Jug, sixty-second Wifi reboot/return, and the shared tasks. Weather nodes and download locations vary. Keys use the player's join-order slot.
- Fix Lights uses the original five-switch panel. One to five switches start off. All living players share reversible switches; all five ON clears it. Crew vision shrinks smoothly to one fifth; Impostors, ghosts and cameras are unaffected. Reports preserve Lights/Comms and clear critical sabotages.
- Thirteen roles: Crewmate, Engineer, Scientist, Tracker, Noisemaker, Detective, Judge, Impostor, Shapeshifter, Phantom, Viper, Guardian Angel and Influencer. Lobby role practice, private information, faction wins and cooldowns are implemented.
- Contextual bots remember sightings, navigate, complete/fake tasks, kill, transform, repair, report, accuse, corroborate, deny, reply in threads and vote from their own evidence. Dialogue uses authored logic, not an LLM.
- Meetings retain the original fifteen-slot color-matched tablet, chat overlay, portraits/nameplates, vote confirmation and colored/anonymous tally pips. Abstentions remain separate from Skip. Ejection follows the tally.
- The killer remains in the room with the native body-fall animation; only the victim receives the full kill cinematic. Viper bodies dissolve and become unreportable. Reports use the victim's color.

## Cosmetics, progression and sound

The wardrobe has all seven categories: colors, hats, skins, visors, pets, nameplates and Cosmicubes. The native shop includes category tabs, item previews, ownership checks and Bean purchases. Included catalog: 166 hats, 40 skins, 62 visors, 7 pets and 80 nameplates (355 items). Thirty-five skins have original idle and twelve walking overlays; five skins and six additional pets use static original art. Doggy retains its original animated states. Hat offsets are individually calibrated to the native body instead of enlarged uniform cells.

Completed matches award Beans, XP and Pods for the one active Cosmicube. Tasks, correct votes, kills, winning and level-up multipliers affect rewards. The original exact base-award/XP formulas are not published in the researched pages; this implementation uses documented local tuning in progression.js. Levels cap at 100. Rewards are committed once per match; abandoning or practicing earns nothing. Progress, owned items and Classic/role statistics are stored in this browser.

MIRA Cosmicube is free (37 items); Polus costs 3,000 Beans (48 items); Snack costs 2,500 Beans (30 items). Their original node positions, Pod costs and connected paths are included. Activate/deactivate one cube, earn its unique Pods and unlock adjacent nodes. Completed cubes cannot be activated. Stars and bundle covers are displayed as official-game offers; this fan game has no payment flow, premium wallet or official account connection.

Original footsteps vary by floor material. Room ambience changes with location; menu/lobby music uses a separate volume control. Shapeshift, Phantom, switches, Polus doors and decontamination sounds use world distance, line-of-sight filtering and stereo direction, with a hard audible cutoff. Noisemaker remains a global role alert. Transformation sprites use the same source-to-world scale as the native crewmate. Actor pixels are softly clipped by the visibility mask, preserving the lit portion of a partly shadowed player.

## Fidelity and sources

This is a new browser runtime with four maps and selected native assets. Official accounts, purchases, platform services, automatic LAN discovery, the Fungle, Hide n Seek and official matchmaking are not connected. Browser reward tuning, task controls, balancing and some animation timing are implementation choices. Polus artwork, native ground mesh colors and object placements are original; native collisions are rasterized for browser navigation. Viper victim presentation remains limited; Influencer retains a limited image-card set.

The menu/reference images span older versions; no claim is made that every bundled asset is from one specific 2026 client build. Brook glyph shapes are native with reconstructed advances. Report title/tape are labeled reference crops; the report shader uses original noise/math with estimated final material colors. Some skin/pet animations remain limited as described above.

Sources and the deeper linked-wiki audit are in REFERENCE_NOTES.md and atlas metadata. Among Us, its characters, maps, cosmetics and original artwork/audio © Innersloth LLC. This noncommercial fan project is not affiliated with or endorsed by Innersloth. Support the original at https://www.innersloth.com/games/among-us/.

Archives: https://github.com/itsssskye/amongus-assets , https://github.com/AI0702/Among-Us-clone , https://github.com/arizkhalid/among-us-clone , https://github.com/AlvajoyAsante/among-us-assets . PeerJS and Barlow notices are included.

## Checks

Run `npm test` (`node --test tests*.mjs`). The suite covers roles, tasks, maps, partial visibility, audio falloff, Lights, Polus systems, progression/ownership/path rules, privacy and complete seeded matches. The accompanying validation report records browser checks. Temporary QA pages are excluded from releases.


## v3.1 map, reveal and accounts

The installed Xbox game supplied the original Skeld/Polus personal-map silhouettes, five sabotage icons, task-bar frame, VCR font atlas/metrics, and ghost sprite. The blue personal map is translucent and stays open during WASD, touch movement and click-to-walk. Task markers remain usable without closing it. F opens the red sabotage map with the native system icons. Reports and phase changes close the overlay. Communications hides task markers.

The nine-second intro has separate Shhh, faction lineup/count, and individual role phases. Role audio plays once on the individual-role transition. Every crewmate appears in the crew lineup; an Impostor sees their team. The local player stands at the front. Victory/Defeat shows the winning team, including native translucent ghosts, followed by Continue and the earned-rewards view. Play uses the full Local/Online card artwork and original labels. The HUD uses an outlined compact task list, vertical Tasks tab, completed-stage counts and segmented task bar.

My Account supports real Firebase email/password sign-up, sign-in, sign-out, display-name changes, verification emails and password-recovery emails. The production project is `among-us-browser-game`, with Email/Password enabled and `infinity-dj-gaming.github.io` authorized. Firebase uses session persistence and does not store raw passwords in this game's local storage. Guests can keep playing when Firebase is unavailable. These are accounts for this fan game, separate from official Among Us accounts. Wallets, cosmetics and statistics remain browser-local; Firebase cloud progression is not implemented. See FIREBASE_SETUP.md.


## v3.2 native lobby, creation and chat

Local and Online keep the same full artwork shown on the initial Play cards. The full-screen Create Game route uses the original map artwork, map icons, Brook labels, capacity-dependent crewmates, General/Chat tabs, capacity, Impostor count, skill tag and region. Only the implemented Skeld/Polus maps and Classic mode are enabled.

The dropship uses the installed original background, separate crates/laptop/Wardrobe station, right-side map/code/capacity/privacy panel, host controls and native action art. Joining runs the original 55-frame chair materialization/jump sequence at 24 fps before movement unlocks. Ten physical seats wrap for players eleven through fifteen. Existing players retain their positions when someone joins. Bots and click-to-walk route around the floor props. Keyboard and touch movement work in the lobby. Idle rooms warn at sixty seconds remaining and close after ten minutes.

Lobby chat now follows the supplied original reference: translucent gray panel, wide white rows, color/cosmetic portraits, outlined sender names, input, 100-character counter and Send state. Native controls switch between Free Chat and Quick Chat; Quick Chat rooms reject arbitrary human text on the host. Player controls support local mute/unmute, plus host kick/ban for connected humans. Replies and typing cues remain connected to the evidence-based dialogue system. The native Play Again and Quit art is used after rewards.

All seven user-supplied recordings are packaged unchanged: Spawn_in_lobby, Player_kick, Lobby_theme, Lobby_options_update, Lobby_timeout, Lobby_code_copy and The_Skeld_ambience. Spawn/leave/settings/timeout/code copy use their matching action. Lobby theme and the supplied atmosphere loop simultaneously on separate music/effects buses, and stop on leaving the lobby. They respect audio preferences. No official matchmaking, moderation/report service or crossplay is claimed.


## v3.3 meeting chat and Polus fidelity

Meetings and lobbies share the same native chat component: translucent panel, original white message art, cosmetic portraits, outlined sender names, reply references, typing, 100-character input/counter, Free/Quick Chat and player controls. The meeting panel spans 78% of the viewport width, with larger rows/text. Ghost messages remain private to ghosts in authoritative snapshots. Opening/closing chat still returns to normal discussion/voting.

Polus now retains the installed game's original Ground, Cliff and LavaOrange mesh vertex colors, including the purple terrain, paths, snow patches, ground markings and lava bands. The prior imported mesh had lost all colors, and the renderer substituted three flat fills. The new baked map uses the original installed mesh data instead; native room/prop art stays registered at the existing world coordinates. `assets-polus-ground.json` records the three native mesh IDs/counts.

Navigation is rebuilt from 72 active, non-trigger native Polus collider paths, with original transforms/offsets. Shadow-only and dynamic door colliders are excluded from the static mask. A 16-pixel browser foot radius and 16-pixel navigation cells preserve the narrow drill-yard access and actual entrances. The flood fill retains the playable connected floor; roofs, cliffs, lava and obstacles remain blocked. This is native geometry rasterized for the browser, not the Unity physics engine. All twelve door approaches, both specimen tunnels and all station variants are checked. Manual and automatic movement use small collision-checked steps; automatic movement no longer snaps through a nearby closed door. Ghost movement remains unrestricted by walls.


## v3.4 contextual conversations and disguise perception

Chat parses actor, victim, room and addressee separately. Colors and full player names work with common room slang, kill/vent/fake-task accusations, personal alibis, body-location questions, proof requests, clears, skips, role claims, corrections and follow-up pronouns. Bots use short authored phrases, sometimes caps/slang/emojis, with typing gaps. They deny accusations with consistent alibis, challenge contradictory claims, ask named players to vouch, distinguish rumors from witnessed evidence, and can counteraccuse. Replies are bounded and repeated lines suppressed. This is local rule-based game AI; arbitrary language understanding is not claimed.

Each bot knows only its own observations and public statements. Witnessed scans can counter rumors; venting alone allows the Engineer possibility. Repeated or relayed accusations do not become multiple independent witnesses. The report banner/chat no longer announces the hidden room automatically. A reporter answers where; other players can state where they were. Crowded sightings preserve discrete kill/transform evidence. Votes use firsthand evidence and bounded suspicion, with skips on weak information.

Unseen Shapeshifter kills, vents and sightings use the copied identity. Bots that see the current transformation/unshift can identify the real shifter; seeing two copies creates ambiguity. Knowledge of an older transformation cannot expose a later unseen disguise. Shapeshift and unshift immobilize humans and bots for the animation, including direct movement, queued path movement and killing. Held input resumes after completion.

Other players' transformation events are delivered only to observers who could see the actor when the event happened. Distance falloff and a hard line-of-sight audio gate apply at playback; walls, reduced vision and invisibility mute hidden actions. Entering sight later does not replay an unheard transformation. The local actor hears their own effect. Noisemaker alerts retain their global role behavior. Lobby music/atmosphere are unchanged.

Validation: 102 deterministic checks across tests.mjs, tests-v2.mjs and tests-v4.mjs through tests-v8.mjs. Run with `node --test tests*.mjs tests-v8.mjs`.
