export function enter(mode, view) {
	cache.forecast = {
		vs: {
			image: sprites.vs,
			anim: enter
		},
		hp: {
			left: RenderHP.attacker(attacker, Unit.dmg(defender, attacker), sprites),
			right: RenderHP.defender(defender, Unit.dmg(attacker, defender), sprites)
		},
		tags: {
			atk: renderTag(attacker.name, attacker.faction, sprites),
			def: renderTag(defender.name, defender.faction, sprites)
		},
		stats: {
			wpn: {
				image: RenderForecast.renderWeapon(attacker, defender, sprites),
				anim: (_ => {
					let anim = Anims.EaseOut.create(10, 10)
					state.anims.push(anim)
					return anim
				})()
			},
			dmg: {
				image: RenderForecast.renderDamage(attacker, defender, sprites),
				anim: (_ => {
					let anim = Anims.EaseOut.create(10, 13)
					state.anims.push(anim)
					return anim
				})()
			},
			hit: {
				image: RenderForecast.renderHit(attacker, defender, sprites),
				anim: (_ => {
					let anim = Anims.EaseOut.create(10, 16)
					state.anims.push(anim)
					return anim
				})()
			}
		}
	}
}

export function release() {
	if (state.mode === "attack") {
		Unit.move(state.select.unit, state.select.src, map)
		cache.forecast = null
		cache.range = null
		state.mode = "select"
		state.dirty = true
		state.select = null
		state.target = null
	} else {
		let cursor = null
		if (pointer.clicking) {
			cursor = getCell(pointer.pressed)
		}
		if (pointer.select) {
			cursor = getCell(pointer.pos)
		}
		if (cursor) {
			let unit = Map.unitAt(map, cursor)
			if (state.select) {
				let select = state.select
				let unit = select.unit
				let square = null
				if (cache.range && game.phase.pending.includes(unit)) {
					square = cache.range.squares.find(({ cell }) => Cell.equals(cell, cursor))
				}
				if (square && select.path) {
					actions.move(unit, cursor)
				} else if (pointer.clicking) {
					actions.deselect()
				} else {
					actions.unhover()
				}
			} else if (unit) {
				actions.select(unit)
			}
		}
	}
}

export function render(mode, view) {
	let vs = sprites.vs
	let width = vs.width * cache.forecast.vs.anim.x
	let x = view.width / 2 - width  / 2
	let y = view.height * 2 / 3 - vs.height / 2
	layers.ui.push({ image: vs, x, y, width })

	let hpleft = cache.forecast.hp.left
	x = lerp(-hpleft.width, 4, cache.forecast.vs.anim.x)
	y = y + 22
	layers.ui.unshift({ image: hpleft, x, y })

	let hpright = cache.forecast.hp.right
	x = view.width + lerp(hpright.width, -4 - hpright.width, cache.forecast.vs.anim.x)
	layers.ui.unshift({ image: hpright, x, y })

	let atktag = cache.forecast.tags.atk
	x = lerp(-atktag.width, 4, cache.forecast.vs.anim.x)
	y = y - atktag.height - 1
	layers.ui.unshift({ image: atktag, x, y })

	let deftag = cache.forecast.tags.def
	x = view.width + lerp(deftag.width, -4 - deftag.width, cache.forecast.vs.anim.x)
	layers.ui.unshift({ image: deftag, x, y })

	let cached = cache.forecast
	let stats = Object.keys(cached.stats)
	for (let i = 0; i < stats.length; i++) {
		let key = stats[i]
		let data = cached.stats[key]
		let image = data.image
		let height = image.height * data.anim.x
		let x = view.width / 2 - image.width / 2
		let y = view.height * 2 / 3 + 28 + 14 * i - height / 2
		layers.ui.push({ image, x, y, height })
	}

	let button = sprites.buttons.back
	layers.ui.push({ image: button, x: 8, y: 8 })
}
