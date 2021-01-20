# tactics
> A tabletop-style strategy game built around fixed unit interactions, perfect information, and deterministic combat.

[Play the demo](https://semibran.github.io/tactics-new)

![Preview image of tactics project](tactics.png)

A small [TRPG](https://en.wikipedia.org/wiki/Tactical_role-playing_game) primarily inspired by [Fire Emblem](https://en.wikipedia.org/wiki/Tactical_role-playing_game). I've attempted to remove any and all elements that hamper strategic gameplay in favor of determinism and semi-perfect information a la chess, so no RNG-based combat or unexpected reinforcements. However, predictable AI and RPS-style unit interactions are still alive and well.

## Controls
All interactions are performed with mouse or touch inputs, depending on the client device.
- Press and hold a unit, then drop it on the square or enemy you want to move to or attack.
- Alternatively, click a unit to select it, then click on a blue or red square to move or attack. You can pan around or deselect by dragging or clicking outside of the unit's "range" (i.e. colored squares).

As a disclaimer: the stage design here is a bit unforgiving. Consider checking out [a previous iteration of this project](https://github.com/semibran/tactics) which is a tad lighter on the boss segment and has slightly fancier backgrounds and VFX.

## Development
```sh
$ git clone git@github.com:semibran/tactics-new
$ cd tactics-new
$ pnpm i
$ make dev
$ pnpx serve dist
```
