# v3.6: direct task controls, eye-level vision and decontamination

Play at https://infinity-dj-gaming.github.io/among-us-browser-game/ . Open the permanent Test Lab at https://infinity-dj-gaming.github.io/among-us-browser-game/?test=1 . It includes every task/stage on all four maps, decontamination buttons and a frozen spray preview.

## Vision and passages

Skeld, MIRA HQ, Polus and Airship now separate movement collisions from vision blockers. Low tables, beds, small consoles and floor objects remain solid for walking while allowing eye-level sight over them. The three newer maps use the installed game's dedicated shadow colliders. Skeld keeps its older artwork alignment and explicitly classifies low furniture. Walls, large machinery, rock formations and tall cargo still obstruct sight. Airship's low gap ledges allow sight across the platform gap. The existing soft per-pixel actor mask remains in place.

MIRA's passage and both Polus passages have original door/button artwork. Nearby buttons open an entry, close and seal it, run a three-second spray, then open the opposite exit. MIRA's door raises; Polus uses original sampled shutter frames. The two doors cannot open together. An occupied threshold delays closure. Players can move inside the chamber, ghosts pass through, and bots operate buttons while following real paths. Closed doors affect movement and sight. Door/button/spray sounds remain positional. Foreground spray can obscure the local crewmate.

## Task interactions

The shared task renderer now retains the original movable sprite layers, native positions, colliders, sprite pivots and pixels-per-unit. Twenty-five task types use these layers directly; the other shared/Polus tasks retain their existing art-based controllers. Controls sit invisibly on the machine or movable object, without separate generic completion buttons.

- Fix Wiring requires dragging the real wire ends to matching sockets. Clicking the two ends does not connect them. The left order varies; right terminals keep their canonical colors and symbols.
- Fill Canisters docks by the bottle neck at the visible nozzle, accepts a forgiving drop range and snaps precisely into place. Fill two bottles, detaching each after filling.
- Enter ID Code lifts or drags the actual card from its wallet. The code is readable on the card, and input uses the native keypad.
- Artifacts has five draggable pieces, excluding inactive controller-highlight duplicates. Samples use native bins and sample sprites.
- Photos, safe dial/handle, breaker lever, ruby/cloth, toilet plunger, fan symbols, watering plants, mannequin garments, weapons, towels, VCR controls, shower and burger ingredients use direct artwork controls. Dynamic mannequin attachments use native pivots and scaling. The burger recipe includes every ingredient and reads from top bun to bottom bun.
- Towels chooses eight unique positions from fourteen native candidates, permits pickups in any order and then requires placing eight towels into the basket. Collected/unassigned towels are removed from the local world view. Picking up a world towel or the Armory weapons does not open an unrelated dialog.
- Records alternates between collecting one of four folders and filing that folder at its destination, four separate trips. Both drawer gaps and bookshelf gaps are interactive.
- Submit Scan uses a larger live-map view and enlarged original top/bottom panels, retaining queueing, original sound and the two native scanning layers.

The new pack contains 470 original task sprites from 50 native prefabs and 172 deduplicated native task sound clips. Native controllers map their task actions to the corresponding clips; shared tasks also retain the earlier sound banks. A sound's presence in the bank does not imply every possible official-game event is implemented.

## Validation and limits

142 automated checks pass. They cover all four maps, task progression, gesture completion/rejection, native task controller construction/progress, shadows, roles, privacy, conversations and decontamination safety/bot traversal. Browser checks include dragging four wires, docking bottles, pulling an ID card and entering its code, mannequin alignment, drawer layers and the sealed spray preview. Installed game files were read without modification.

This remains an independently authored browser runtime. Input timing, some puzzle randomization/animations, the rasterized navigation and spray composition are reconstructions. The earlier limitations in README.md and V3_5_NOTES.md still apply, including Airship manual/random doors and its original spawn-choice interface. This release does not claim a frame-for-frame official client or that every wiki page/video has been reviewed.

## References

- https://among-us.fandom.com/wiki/Decontamination
- https://among-us.fandom.com/wiki/MIRA_HQ
- https://among-us.fandom.com/wiki/Enter_Id_Code
- https://among-us.fandom.com/wiki/Fill_Canisters
- https://among-us.fandom.com/wiki/Fix_Wiring
- https://among-us.fandom.com/wiki/Sort_Records
- https://among-us.fandom.com/wiki/Showers
- https://among-us.fandom.com/wiki/Guide:Faking_tasks
- Original installed initialmaps bundle: task prefabs, sprite layers/geometry, native sounds, door clips and shadow colliders. No installation files were modified.

Among Us artwork and audio © Innersloth LLC. This unofficial, noncommercial fan implementation is not affiliated with Innersloth.
