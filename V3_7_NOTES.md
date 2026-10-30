# v3.7: timed abilities, role rules and native task refinements

Play: https://infinity-dj-gaming.github.io/among-us-browser-game/
Test Lab: https://infinity-dj-gaming.github.io/among-us-browser-game/?test=1

The Test Lab has map/role selectors, every task stage, vent placement, nearby targets, a communications toggle, transport/ejection/kill previews, pause and time advance. Its storage and rewards are separate from normal games.

## Roles and movement

Active-duration icons progressively lose color from top to bottom without a drawn divider. Engineer vent time, Shapeshift, Phantom, Tracker, Guardian protection and Scientist battery use their actual remaining duration. Cooldowns recover the icon color. Vent entry/exit uses native hop sprites; adjacent vents have stable clickable world arrows. Polus uses rock vent sounds. The player's own actor disappears inside vents. Down ladders use the native slide pose and faster descent; the lower Electrical approach accepts a larger usable range.

Vitals uses the native SIMSONG bezel and status panels, a reconstructed blue grid, animated ECG traces, dead/disconnected states, a battery countdown and COMMS DISABLED. Completing tasks recharges the configured battery; after all tasks are complete an empty battery recharges after its configured cooldown.

Track targets the nearest player within 125 world pixels and line of sight, plays activation/deactivation SFX, expires, and follows a vanished Phantom. Detective case files persist per victim, use a per-case suspect budget, require touching-range interrogation (72 pixels), record the murder-time location and correct disguised identities at the next meeting. Noisemaker alerts reach crew and ghosts, with an Impostor audience option; communications suppresses the passive alert. The supplied alert GIF marks the body. The first Judge Overrule retains priority and another Judge keeps its unused charge.

Shapeshift accepts all players alive at round start, including other Impostors and players who later died, copies appearance, freezes movement for 1.5 seconds and optionally leaves evidence. Phantom smoke remains at the activation point; living crew cannot see the invisible actor, while Impostors and ghosts can. Comms blocks activation, killing remains disabled while vanished, and venting/tracking remain supported. Transformation audio is restricted by event visibility, line of sight and distance. Bots retain witnessed transformations and prioritize reporting them in meetings. Detective and Influencer bots use their local role actions.

Guardian ghosts have native winged animation, a local shield target and visible shield cracking on a blocked attack. Ghosts retain translucent hats/visors, lose skins and stop leading pets around. Influencer uses a nearby target with crew preference, a server-owned random image deck, up to three cards and a separate refresh cooldown. These targets are chosen by the host so clients do not need hidden faction information.

## Tasks

Thirty-eight task types now use the native layer controller. Fix Wiring sorts terminal geometry by row before randomizing colors and requires actual drags. Start Reactor uses the original two-panel layout, matching sound pitch, progress lights, red error feedback and a full stage-one reset on a mistake. Correct rounds survive closing the task. Download/upload and Process Data open/close folders, animate a file-carrying crewmate, and update their progress; transfers display decreasing joke estimates.

Submit Scan keeps the normal camera, overlays a body-aligned green mesh and native scanning rings, and uses the original scan loop and scan text chirp rather than ejection beeps. Manifold and fuel sounds rise in pitch. Fuel is clipped to the original container silhouette. Engine alignment rotates and uses its original slider. Distributor contacts move around the ring with full/near-empty gauges. Course dragging stays on a dotted route and returns to the last checkpoint off-route. O2 leaves drift, spin, retain throwing momentum and are pulled toward the intake. Empty Chute starts with leaves while garbage uses trash. Vent cleaning removes debris with a puff and its native cleaning sound.

Inspect Sample lifts the platform, moves the dispenser across the tubes, fills and retracts, then lifts again for the anomaly stage. ID and beverage entry displays are centered and ID key pitches vary. Sort Samples draws the colored originals rather than black previews. Card swipes accept only 450–550 ms. Weather mazes are larger and randomized. Tree slider audio uses one adjustable loop. Temperature supports held buttons. Artifact dimensions are derived from connected cutout regions in the actual case texture and snap into those matching slots. Safe dial stops use the eight-number dial and unlock the final handle turn. Fans show a top symbol. Airship shower cleaning fills the body silhouette upward with water.

Killer view stays in the map with a fast lunge, brief slash and the supplied death sound. Victim view plays the murdered chord and variant sound/cinematic. Viper uses original spit, tongue, goop and victim sprite tracks at decoded native key times. The economy exchanges 5,000 earned Beans for 10 browser-game Stars; Stars cosmetics/Cosmicubes can use that balance.

## References and implementation limits

The user's supplied images, role descriptions and recordings guided these changes. Additional native sprites/audio were read from the installed game's initialmaps bundle and sharedassets2, without modifying the installation. Selected task and role sprite tracks are native; the browser runtime, targeting rules, puzzle controllers, screen composition, scan mesh, fog, navigation rasterization and some animation transitions are independently reconstructed. This is not an assertion of exact parity with every version, task or cosmetic in the official game.

Reference pages checked include [Vitals](https://among-us.fandom.com/wiki/Vitals), [Start Reactor](https://among-us.fandom.com/wiki/Start_Reactor), [Track](https://among-us.fandom.com/wiki/Track), [Detective](https://among-us.fandom.com/wiki/Detective), [Shapeshifter](https://among-us.fandom.com/wiki/Shapeshifter), [Phantom](https://among-us.fandom.com/wiki/Phantom), [Noisemaker](https://among-us.fandom.com/wiki/Noisemaker), [Guardian Angel](https://among-us.fandom.com/wiki/Guardian_Angel), [Influencer](https://among-us.fandom.com/wiki/Influencer), and [Comms Sabotaged](https://among-us.fandom.com/wiki/Comms_Sabotaged). Some Fandom page fetches were restricted; available indexed text, the supplied descriptions and installed data were used. No claim is made that every linked wiki page/video was watched or exhaustively audited.
