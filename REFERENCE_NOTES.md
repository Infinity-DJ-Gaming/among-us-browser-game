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

The runtime is a new browser implementation. Exact original timing/material values are not all exported. Settings have bounded browser-game choices. This release contains one map and selected cosmetics; official accounts, friends services, purchases, public matchmaking, other maps and modes are not implemented. Bots use authored contextual rules. The Viper victim presentation and limited Influencer card deck retain the limitations documented in README.md.
