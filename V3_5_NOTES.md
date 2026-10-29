# v3.5: maps, ejections, scans and Test Lab

Open **TEST LAB** on the main menu or visit https://infinity-dj-gaming.github.io/among-us-browser-game/?test=1 . Select a map/role, jump to any task stage, open it, enable autonomous bots, toggle visual tasks, preview each victim kill, test ejection outcomes and Confirm Ejects, use any ladder/platform endpoint, or equip catalog cosmetics. Freeze previews holds scanner/ejection/transport/kill poses. Pause/resume and time advance are available. Test Lab uses separate browser storage and offline practice: no Beans, XP or Pods, and no public room hosting.

## Maps and physical tasks

MIRA HQ includes twenty named jobs, original native room art, native collision paths, its connected vent network, decontamination, Admin and sensor-based Doorlog. Actual human/bot crossings of three native sensors are logged with their five-second cooldown. Communications hides the log and requires codes at both native repair consoles. Reactor requires two distinct simultaneous hand scanners.

The Airship includes twenty-four named jobs, original room/prop textures, native collider paths, twelve native vents, three ladders (six endpoints), and a single-passenger gap platform with empty return travel. Riders board, travel with the platform, then step off. Pathfinding explicitly uses transport links and does not carve walking routes through the gap or upper Meeting Room wall. A separate wall-only sight mask permits vision across the open gap while feet stay on the enclosed floor. Crash Course uses two native code consoles and a ninety-second deadline. Both new maps support task/sabotage overlays and native Create Game cards.

Twenty-three additional original task-panel compositions are included with authored browser controls. Diagnostics has a ninety-second unattended wait followed by anomaly selection. Photos waits sixty seconds before retrieval. Fans requires remembering a code at one physical panel and entering it at the other. Towels uses fourteen native pickup positions plus the basket. Arms has pickup and rack consoles. Records has collection and four filing stages. Wiring now randomizes the left side and keeps the right side red/blue/yellow/magenta.

## Scans, visual tasks and cinematics

Submit Scan leaves the live map and crewmate visible between original top/bottom panels. It queues players, holds them at the scanner for ten seconds, types metadata with original beeps, and plays the supplied Submit_Scan_scanning_sound.ogg unchanged for the scanner. Both original 240-frame beam layers animate around the body; observers see them when Visual Tasks is on. Ghost effects stay private to ghosts. Original garbage debris, asteroid shots and powered Shields are visible on maps where those tasks are visual. MIRA only has the scan visual.

Voting retains its tally, followed by a ten-second map ejection: rotating space on Skeld, sky fall on MIRA/Airship, and lava on Polus. The native Polus cliff, splash/bubble frames and hand artwork are used. Confirmed Impostors give a thumbs-up; crewmates reach for help. Per the requested override, Confirm Ejects OFF always uses the reaching hand and reveals neither faction nor remaining count. Text appears letter by letter using the native VCR font and original beeps, followed by the remaining Impostor count when enabled.

Only the killed player receives the original red/white killBG over the live room. Gun, tongue, neck snap and stab use original sprite sequences. Killer and witness views retain their room/body animation. Native sprite pivots, pixels-per-unit and front/back/left/climb variants now position 224 hats/visors. Four archived items retain visually checked manual anchors. Thirty-five animated skin overlays retain their native body alignment.

## Fidelity limits

This is an independently authored browser runtime. Airship manual/random doors and its original three-location spawn-selection interface remain unimplemented; rounds start in Engine Room. The new task controls are playable approximations of the original interactions. Lava/sky motion, silhouette maps, sprite-track sampling and some cosmetic animation behavior are reconstructed. Extra static pets/skins and the Viper cinematic retain the limitations in README.md. The new maps use existing ambience fallback rather than a completely matched map ambience bank. No claim is made that every task video or every wiki page was reviewed, or that this reproduces the entire official client exactly.

## Reference audit

Read-only extraction used the installed Xbox game's initialmaps, sharedassets2 and cosmetic bundles; the game installation was unchanged. MIRA: 165 active room sprites and 96 collider paths. Airship: 302 room/prop sprites and 110 active collision paths, including its circle-shaped Vault room area. Native transforms, tints, pivots, pixels-per-unit and task-console positions are retained. Enclosed-floor filtering excludes exterior and prop interiors. Metadata records native sprite/clip sources. Compressed pointer tracks are evenly sampled over native duration rather than evaluated by Unity.

Wiki text, images and linked references were inspected for 21 pages: Ejection, Submit Scan, MIRA HQ, The Airship, Visual tasks, Run Diagnostics, Develop Photos, Start Fans, Sort Records, Pick Up Towels, Fix Wiring, Empty Garbage, Clear Asteroids, Prime Shields, Buy Beverage, Assemble Artifact, Sort Samples, Enter ID Code, Process Data, Measure Weather and Water Plants. Enter ID Code returned an empty alias; native console/minigame data supplied its reference.

- https://among-us.fandom.com/wiki/Ejection#Animations
- https://among-us.fandom.com/wiki/Submit_Scan
- https://among-us.fandom.com/wiki/MIRA_HQ
- https://among-us.fandom.com/wiki/The_Airship
- https://among-us.fandom.com/wiki/Visual_tasks
- https://among-us.fandom.com/wiki/Run_Diagnostics
- https://among-us.fandom.com/wiki/Develop_Photos
- https://among-us.fandom.com/wiki/Start_Fans
- https://among-us.fandom.com/wiki/Pick_Up_Towels
- https://among-us.fandom.com/wiki/Sort_Records
- https://among-us.fandom.com/wiki/Fix_Wiring

Both supplied YouTube links were opened: https://www.youtube.com/watch?v=8ptAd2tEBqU and https://www.youtube.com/watch?v=UGgMS9JGKGw . They are MedBay sound references, not walkthroughs of every task. The supplied OGG is copied without conversion. Native ejection text, Polus splash, ladder and platform sounds are linked to their actions. MIRA decontamination/vents are separate from Airship ladders/platform; both maps were requested after clarification.

The wiki describes unconfirmed Polus ejections without a unique faction gesture. The explicit requested override is implemented: reaching hand for everyone, with no remaining-count leak.

Native HatViewData/VisorViewData pivots matched 224 of 228 hat/visor entries. Manual archived items hat_fluffyHat, hat_triplePartyHat, visor_henry and visor_thatFace were visually checked against the native body atlas.

## Validation

Run `node --test tests.mjs tests-v2.mjs tests-v4.mjs tests-v5.mjs tests-v6.mjs tests-v7.mjs tests-v8.mjs tests-v9.mjs`.

The new checks cover console/variant/vent reachability, collision-safe routes, ladder/platform locks, open-gap sight, scan queue/timing/privacy, two-panel repairs, unattended return timers, ejection count privacy, hand selection, Doorlog crossings, atlas bounds, cosmetic anchors and sustained autonomous Airship movement. Release validation and browser screenshots are recorded separately.
