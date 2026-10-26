# Among Us — browser fan game

A static, unofficial browser implementation using genuine Among Us artwork and sound effects. No build, API key, or game server is needed for bot matches.

## Play

Serve this folder over HTTP. With Node installed, run `node serve.mjs`, then open http://127.0.0.1:8123. ES modules and map data require an HTTP server, rather than double-clicking index.html.

- **Play with bots** opens a customizable 4–10-player lobby.
- **Host Online** opens a WebRTC friend lobby. Share the six-character code; friends use **Enter Code**. Bots fill remaining slots. The host must keep the tab open. PeerJS Cloud provides signaling; some NATs/firewalls prevent connections without a separately configured TURN relay.
- Select **Your Role** in a solo lobby to practice; online roles are random.

## Controls

WASD / arrows: move; click the floor, a task entry, or a map marker to walk there. E / Space: use. Q: kill. R: report. V: vent. F: sabotage. C: scientist vitals. Tab / M: map. Esc: close / pause. Touch joystick and action buttons are included. Tasks accept touch; wiring supports both click-pairing and dragging. Card swipe also supports holding and releasing Space for 0.35–1.4 seconds.

## Implemented

- Full Skeld artwork with collision geometry, connected navigation, line of sight, limited vision, and ghosts.
- Crewmate, Impostor, Engineer and Scientist roles; randomized assignment, team wins, cooldowns, reports, emergency meetings and ejections.
- Twelve playable task locations: wiring, card swipe, asteroids, reactor memory, data download, divert power, MedBay scan, steering, garbage, shields, manifolds and fueling.
- Lights, reactor, oxygen (two panels), communications and cafeteria doors; crew repairs and sabotage victories.
- Security camera feeds, Admin occupancy and Scientist vitals.
- Bot personalities, task navigation, visual-task clears, local memories, witnessed kills/vents, body reports, opportunistic kills, fake tasks, vent escapes, sabotage repairs, evidence-based discussions and votes. Chat uses authored contextual responses and evidence rules; it is not an LLM and cannot understand arbitrary conversation.
- Local settings, profile and win record; real sound effects; responsive touch controls.
- Host-authoritative friend lobbies with private roles, online chat and bot replacement after disconnects. Designed for trusted friends, not competitive anti-cheat.

## GitHub Pages

All game paths are relative and work under a repository subpath. Upload the **files at the top level of this folder** into a public repository, then choose **Settings → Pages → Deploy from a branch → main → /(root) → Save**. No Node server runs on Pages. `serve.mjs` is only a local preview server.

Run `node tests.mjs` for simulation tests. All runtime assets are named `assets-…` so the complete static game can be uploaded in one batch through GitHub’s web interface.

## Scope

This is a playable fan implementation, not the official client. It includes one map and four roles, not every official map, cosmetic, role, account system, matchmaking service or game mode. It does not connect to official Among Us servers.

## Asset credits

Among Us, The Skeld, characters, task/UI artwork and original audio © Innersloth LLC. No ownership or exclusive rights to those assets are claimed. This noncommercial fan project is not affiliated with or endorsed by Innersloth. Support the original: https://www.innersloth.com/games/among-us/.

Public asset sources:

- https://github.com/AI0702/Among-Us-clone — Skeld map/collision data, RGB player animations, bodies, tasks, meeting/result artwork and sounds. Sprite masks are recolored using the crewmate palette.
- https://github.com/AlvajoyAsante/among-us-assets — Among Us logo.
- https://github.com/arizkhalid/among-us-clone — lobby image.
- PeerJS 1.5.5, https://github.com/peers/peerjs — MIT; see THIRD_PARTY_NOTICES.md.

Original browser simulation, UI and task code was created for this project. Third-party art/audio retain their original ownership and are not covered by a new blanket software license.
