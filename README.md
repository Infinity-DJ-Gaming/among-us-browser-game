# Among Us — browser fan game v2.1

A static, unofficial fan implementation with genuine Among Us artwork and sound recordings. Play at https://infinity-dj-gaming.github.io/among-us-browser-game/.

## Play and controls

Run `node serve.mjs` and open http://127.0.0.1:8123 for local play. Bot matches need no API key or game server. GitHub Pages serves the same flat files without a build.

**Play with bots** opens a movable 4–15 player lobby. Walk with WASD/arrows or click the floor. Customize your name, color, hat, visor and Doggy pet in the wardrobe. Solo lobbies offer a practice-role selector; online roles are randomized.

E/Space: use; Q: kill; R: report; V: vent; F: sabotage; C: role ability; Tab/M: map; Esc: close/pause. Touch joystick and action buttons are included. Tasks support native pointer controls and keyboard alternatives; hold Space on the card for 0.35–1.4 seconds to swipe.

**Host Online** uses PeerJS/WebRTC. Share the six-character room code with friends; bots fill spare seats. Keep the host tab open. Some networks require a TURN relay, which is not bundled. Online play is intended for trusted friends rather than competitive anti-cheat.

## Interface refinement

The main menu uses original ship-wall/window/panel layers, icon art and native Brook glyph shapes. Play, Inventory, Shop, News, My Account, Settings, Credits and Friends have functional browser-game equivalents. My Account is a local profile; the included cosmetic catalog is free and does not connect to official purchases or accounts.

Meetings use a three-column, fifteen-slot tablet with a border in your color, cosmetic portraits/nameplates, native vote stamps, a separate chat overlay, green-check/red-X confirmation, actual colored/anonymous ballot icons, a visible tally and subsequent ejection. Abstentions do not count as skips. Vote destinations remain private before the tally, and anonymous results hide voter colors.

Reports now cover the full viewport with the original speed-line shader algorithm and recovered native noise, the white title band, skull bubble, victim-colored report corpse and warning tape. The fixed title and tape are clean original reference crops; the original game renders the title as text. Material colors and some presentation durations are reference-matched choices, rather than verified exact official parameters.

## Included gameplay

- The Skeld with collision navigation, wall occlusion, lighter feathered scenery shadows, ghosts, cameras and Admin occupancy.
- Lobby movement, original twelve-frame redesigned walking art, interpolated movement, eighteen colors, ten hats, six visors and eight nameplates and an animated original Doggy pet.
- Crewmate, Engineer, Scientist, Tracker, Noisemaker, Detective, Judge, Impostor, Shapeshifter, Phantom, Viper, Guardian Angel and Influencer. Role abilities, faction wins, cooldowns and support abilities are implemented; settings use this implementation's balancing values.
- All nineteen named Skeld jobs: Fix Wiring, Swipe Card, Clear Asteroids, Start Reactor, Download/Upload Data, Divert/Accept Power, Submit Scan, Stabilize Steering, Empty Garbage, Empty Chute, Prime Shields, Unlock Manifolds, Refuel Engines, Align Engine Output, Calibrate Distributor, Chart Course, Clean O2 Filter, Clean Vent and Inspect Sample. Multi-room stages, four-step refueling, five reactor sequences and sixty-second sample incubation are included. Selected common task types are shared across the lobby; each player receives an independently randomized, canonically ordered wiring route. Reactor sequences and asteroid counts survive closing the panel. Clean Vent ejects occupants on open and locks the specific vent until closing/completion. Selecting the wrong sample restarts analysis.
- Original task panel artwork and components, per-action task recordings, button tones, footsteps by room material, role sounds, report/emergency sounds and kill audio. The sound bank contains 181 original recordings plus separate role/acid clips. Browser gestures unlock audio.
- Meetings, discussion, votes, ties, ejections, reports in the dead player's color, emergency calls, sabotage/repair and critical-system victories.
- Kill perspectives are separated: the killer stays in the room while the original forty-one-frame corpse animation plays; the victim sees the full kill cinematic. Viper bodies fall with acid and dissolve until they become unreportable.
- Contextual bot dialogue with addressed replies, typing delays, reply threads, consistent route alibis, witnessed evidence, accusations, denials, corroboration and counterarguments. Bots navigate, kill, fake/complete tasks, use special abilities, report, repair and vote. Witnesses identify a disguised killer by the identity they actually saw.
- Configurable common task count, anonymous votes, task-bar update mode and emergency call limits/cooldowns. Communications hides task-bar progress; lights/comms persist across reports while critical sabotage clears. Ghost Impostors retain sabotage.
- Local profile/settings/win record and host-authoritative friend rooms with disconnect replacement.

## Scope and fidelity

This is a browser fan implementation, not the official client. It contains one map, a selection of cosmetics, and authored contextual bot dialogue rather than an LLM. It cannot understand arbitrary conversation and does not connect to official servers or provide public matchmaking/accounts.

The provided menu reference is the 2023.6.13-era layout documented by the wiki, not proof of a specific 2026 client build. Brook menu-letter shapes are native while glyph spacing is reconstructed from the atlas. The eight additional palettes follow the wiki display values and are documented separately from unverified original C# palette constants.

Original source frames and panels are used where available; browser layout, timing, role balance, task controls and transitions are implemented here. The original general kill animations are reconstructed from clean independent color-mask layers. The Viper victim presentation uses clean original acid corpse assets; it does not reproduce the entire official acid-attack cutscene. Influencer uses a limited image-card set. The asset archive's precise client build is unknown; a 2026 wiki revision or video title does not establish that every bundled asset is from the latest client.

## Validation

Run `npm test` (or `node --test tests.mjs tests-v2.mjs`) for the simulation and perspective regression checks. See the accompanying validation report for browser checks. All paths are relative, including when hosted beneath the GitHub repository subpath.

## Wiki audit

The refinement covers the linked Main menu/Voting pages and related implemented Skeld mechanics. It is not a claim to have reproduced every wiki page, official service, map or game mode. See REFERENCE_NOTES.md for the source set and known differences.

## Asset credits and references

Among Us, The Skeld, characters, cosmetics, task/UI artwork and original audio © Innersloth LLC. This noncommercial fan project is not affiliated with or endorsed by Innersloth. No ownership of these assets is claimed. Support the original: https://www.innersloth.com/games/among-us/.

Public archives and references:

- https://github.com/AI0702/Among-Us-clone — Skeld map/collision data and baseline task/UI/audio assets.
- https://github.com/itsssskye/amongus-assets — modern original walk/death/kill/transformation frames, cosmetics, pets, task textures and sound recordings. Tightly packed sprites are restored with their native mesh masks.
- https://github.com/arizkhalid/among-us-clone — lobby and report artwork.
- https://github.com/AlvajoyAsante/among-us-assets — logo and legacy source archive.
- https://www.reddit.com/r/AmongUs/comments/ivepl6/all_of_the_games_assets_for_use_in_your_memes_and/ — all six supplied 2020 asset-gallery photos inspected against the linked archive.
- https://among-us.fandom.com/wiki/Main_menu — menu layout and sections.
- https://among-us.fandom.com/wiki/Voting — confirmation, tally and ejection flow.
- https://among-us.fandom.com/wiki/Category:Images/Game_assets — original role/action icons, current acid corpse fall/dissolve references and audio. Provenance URLs are included in atlas metadata.
- https://www.youtube.com/watch?v=7n5NO4QdYq0 — February 2, 2026 Skeld crewmate footage, including the live-room green asteroid overlay.
- https://www.youtube.com/watch?v=oSbaSD_OZ-A — impostor point-of-view reference, titled 2026 and uploaded December 31, 2025.
- https://www.innersloth.com/new-roles-are-on-the-scene-of-17-0-0-emergency-meeting-41/ — official Detective/Viper mechanics. Other role references are listed below.
- https://www.innersloth.com/role-peek-the-shapeshifter/
- https://www.innersloth.com/new-roles-enter-the-fray-v2024-6-18-emergency-meeting-38/
- https://www.innersloth.com/new-crewmate-role-the-judge-emergency-meeting-43/
- https://www.innersloth.com/new-ghost-crewmate-role-the-influencer-emergency-meeting-44/
- PeerJS 1.5.5, https://github.com/peers/peerjs — MIT; see THIRD_PARTY_NOTICES.md.

Browser simulation, dialogue, task and renderer code is a new implementation. Third-party art/audio retain their ownership and are not covered by a blanket software license.
