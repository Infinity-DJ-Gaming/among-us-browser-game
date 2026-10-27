# Among Us — browser fan game v3.1

Play: https://infinity-dj-gaming.github.io/among-us-browser-game/

A static, unofficial fan browser implementation with original Among Us artwork and 314 original audio clips. Run `node serve.mjs` and open http://127.0.0.1:8123. No build or API key is needed for bot games.

## Playing

Play offers Local, Online, How to Play, Practice and a bot-match option. Create Game selects The Skeld or Polus, 4–15 players and 1–3 Impostors. The host starts a five-second countdown. Bots fill empty seats. Practice uses stationary dummies and grants no match rewards. Local browser rooms use an internet room code; automatic LAN discovery belongs to the official game.

WASD/arrows: move; E/Space: use; Q: kill; R: report; V: vent; F: sabotage; C: role ability; Tab/M: map; Esc: close/pause. Task panels have pointer controls and keyboard alternatives. Walk in the lobby and use the laptop/Wardrobe to customize.

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

Original footsteps vary by floor material. Room ambience changes with location; menu/lobby music uses a separate volume control. Shapeshift, Phantom, switches, Polus doors and decontamination sounds use world distance, occlusion attenuation and stereo direction, with a hard audible cutoff. Noisemaker remains a global role alert. Transformation sprites use the same source-to-world scale as the native crewmate. Actor pixels are softly clipped by the visibility mask, preserving the lit portion of a partly shadowed player.

## Fidelity and sources

This is a new browser runtime, with two maps and selected native assets, not the official client. Official accounts, purchases, platform services, automatic LAN discovery, other maps, Hide n Seek and official matchmaking are not connected. Browser reward tuning, collisions, scene ground colors, task controls, balancing, some timings and cosmetic anchors are implementation choices. Polus room artwork/placements are original; ground colors and a conservative collision grid are reconstructed. Viper victim presentation uses clean acid corpse art rather than the complete official attack cinematic; Influencer retains a limited image-card set.

The menu/reference images span older versions; no claim is made that every bundled asset is from one specific 2026 client build. Brook glyph shapes are native with reconstructed advances. Report title/tape are labeled reference crops; the report shader uses original noise/math with estimated final material colors. Some skin/pet animations remain limited as described above.

Sources and the deeper linked-wiki audit are in REFERENCE_NOTES.md and atlas metadata. Among Us, its characters, maps, cosmetics and original artwork/audio © Innersloth LLC. This noncommercial fan project is not affiliated with or endorsed by Innersloth. Support the original at https://www.innersloth.com/games/among-us/.

Archives: https://github.com/itsssskye/amongus-assets , https://github.com/AI0702/Among-Us-clone , https://github.com/arizkhalid/among-us-clone , https://github.com/AlvajoyAsante/among-us-assets . PeerJS and Barlow notices are included.

## Checks

Run `npm test` (`node --test tests.mjs tests-v2.mjs tests-v4.mjs tests-v5.mjs`). The suite covers roles, tasks, maps, partial visibility, audio falloff, Lights, Polus systems, progression/ownership/path rules, privacy and complete seeded matches. The accompanying validation report records browser checks. Temporary QA pages are excluded from releases.


## v3.1 map, reveal and accounts

The installed Xbox game supplied the original Skeld/Polus personal-map silhouettes, five sabotage icons, task-bar frame, VCR font atlas/metrics, and ghost sprite. The blue personal map is translucent and stays open during WASD, touch movement and click-to-walk. Task markers remain usable without closing it. F opens the red sabotage map with the native system icons. Reports and phase changes close the overlay. Communications hides task markers.

The nine-second intro has separate Shhh, faction lineup/count, and individual role phases. Role audio plays once on the individual-role transition. Every crewmate appears in the crew lineup; an Impostor sees their team. The local player stands at the front. Victory/Defeat shows the winning team, including native translucent ghosts, followed by Continue and the earned-rewards view. Play uses the full Local/Online card artwork and original labels. The HUD uses an outlined compact task list, vertical Tasks tab, completed-stage counts and segmented task bar.

My Account supports real Firebase email/password sign-up, sign-in, sign-out, display-name changes, verification emails and password-recovery emails. The production project is `among-us-browser-game`, with Email/Password enabled and `infinity-dj-gaming.github.io` authorized. Firebase uses session persistence and does not store raw passwords in this game's local storage. Guests can keep playing when Firebase is unavailable. These are accounts for this fan game, separate from official Among Us accounts. Wallets, cosmetics and statistics remain browser-local; Firebase cloud progression is not implemented. See FIREBASE_SETUP.md.
