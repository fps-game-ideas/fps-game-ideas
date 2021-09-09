
function EmergencyRound(num) {
	return Math.floor(num*100)/100;
}

$.i18n({
    locale: "en",
})

$.extend( $.i18n.parser.emitter, {
	kw: function (nodes) {
		var template = '<div class=\'tooltip keyword_tooltip\'><div class=\'tooltip-arrow\'></div><div class=\'tooltip-inner\'></div></div>';
		var tooltip = '<b>' + $.i18n('keyword-' + nodes[0].toLowerCase() + '-name', 1) + '</b>: ' + $.i18n('keyword-' + nodes[0].toLowerCase());
		return '<span class="keyword" data-toggle="tooltip" data-bs-html="true" data-bs-template="' + template + '" title="' + tooltip + '">' + $.i18n('keyword-' + nodes[0].toLowerCase() + '-name', nodes[1]) + '</span>';
	},
	ability: function (nodes) {
		var ability = char_data.abilities[nodes[0]];
		return '<span class="ability_link" data-ability-id="' + nodes[0] + '">' + ability.name + '</span>';
	},
	talent: function (nodes) {
		var talent = char_data.talents[nodes[0]];
		return '<span class="talent_link" data-talent-id="' + nodes[0] + '">' + talent.name + '</span>';
	},
	card: function (nodes) {
		var card = char_data.card_categories[Number(nodes[0])].cards[Number(nodes[1])];
		return '<span class="card_link" data-category-id="' + nodes[0] + '" data-card-id="' + nodes[1] + '">' + card.name + '</span>';
	},
	scale: function ( nodes ) {
		var base = Number(nodes[0]);
		var scale = Number(nodes[1]);
		return EmergencyRound(base + scale*(current_card_level-1));
	},
	nth: function ( nodes ) {
		return nodes[nodes[0]];
	}
} );

// Order: basic form | -ed form | -ing form | -s form | verb form (if it has)

$.i18n().load({
	en: {
		"keyword-ghostlike-name": "Ghostlike",
		"keyword-ghostlike": "This entity can go through enemies, deployables, shields and most walls (to be more specific, through all that don't result in an instant kill/falling through the map)",
		"keyword-stationary-name": "Stationary",
		"keyword-stationary": "This entity cannot move by foot.",
		"keyword-ethereal-name": "Ethereal",
		"keyword-ethereal": "Immune to Damage, True Damage and Crowd Control. All enemy attacks go through you, as if you were not even there. Allies can still interract with you, though.",
		"keyword-slipping-name": "{{NTH:$1|Slip|Slipped|Slipping|Slips}}",
		"keyword-slipping": "This entity cannot change their current velocity through walking or turning. Movement abilities that do not solely rely on a Movement Speed boost can, however, change it.",
				
		// CC Effects
		"keyword-cripple-name": "{{NTH:$1|Cripple|Crippled|Crippling|Cripples}}",
		"keyword-cripple": "This entity cannot use Movement Abilities.",
		"keyword-root-name": "{{NTH:$1|Root|Rooted|Rooting|Roots}}",
		"keyword-root": "This entity cannot use Movement Abilities and cannot move by foot.",
		"keyword-metamorphosis-name": "Metamorphosis",
		"keyword-metamorphosis": "This entity's appearance is changed, it's Movement Speed and Maximum Health is overwritten, cannot use their previous abilities, all of their effects and Health State are cleared and reapplied when the effect ends.",
		"keyword-stun-name": "{{NTH:$1|Stun|Stunned|Stunning|Stuns}}",
		"keyword-stun": "This entity cannot move or use abilities.",
		"keyword-silence-name": "{{NTH:$1|Silence|Silenced|Silencing|Silences}}",
		"keyword-silence": "This entity cannot use Non-Weapon-Attack abilities.",
		"keyword-disarm-name": "{{NTH:$1|Disarm|Disarmed|Disarming|Disarms}}",
		"keyword-disarm": "This entity cannot use Weapon Attacks.",
		"keyword-excommunication-name": "{{NTH:$1|Excommunication|Excummunicate|Excommunicating|Excommunicates|Excommunicate}}",
		"keyword-excommunication": "This entity is temporarly not a member of any team, being considered as an enemy for everyone else and being unable to contest objectives.",
		"keyword-exile-name": "{{NTH:$1|Exile|Exiled|Exiling|Exiles}}",
		"keyword-exile": "This entity is essentially \"stuck in time\". They cannot move, cannot use abilities and cannot be interracted with by either enemies or allies. Cooldowns, Ultimate Charge, Ability Durations and special meters are also frozen in place for the duration.",
		
		// VD Effects (Vision Distortion)
		"keyword-gloom-name": "{{NTH:$1|Gloom|Gloomed|Glooming|Glooms}}",
		"keyword-gloom": "This entity cannot see past a certain distance.",
		"keyword-flash-name": "{{NTH:$1|Flash|Flashed|Flashing|Flashes}}",
		"keyword-flash": "This entity cannot see anything.",
		"keyword-fixation-name": "{{NTH:$1|Fixation|Fixated|Fixating|Fixates|Fixate}}",
		"keyword-fixation": "This entity cannot face away from the specified entity. This effect is instantly cleansed if the entity this is supposed to be fixated on dies, disappears or your vision on them is obstructed by a solid obsticle.",
		"keyword-paranoia-name": "{{NTH:$1|Paranoia|Paranoiac}}",
		"keyword-paranoia": "This entity will not see the team affiliation outlines of anything for the duration, as well as have a slightly distorted screen. The crosshair will not give any indications, either. The part of the HUD that displays players, their health and Ultimate charge will be completely hidden for the duration.",
		
		// Vision Effects ?
		"keyword-stealth-name": "Stealth",
		"keyword-stealth": "This entity is Invisible, only being seen if someone comes too close to it. If both this and Reveal are applied to the same target, neither take effect visually.",
		"keyword-reveal-name": "{{NTH:$1|Reveal|Revealed|Revealing}}",
		"keyword-reveal": "This entity is seen through walls by enemies. If both this and Stealth are applied to the same target, neither take effect visually.",
		
		"keyword-lifesteal-name": "Lifesteal",
		"keyword-lifesteal": "This entity gets healed by x% of the damage they deal.",
		"keyword-armor-name": "Armor", // Damage Reduction
		"keyword-armor": "This entity negates x% of the Damage they receive.",
		"keyword-invulnerable-name": "Invulnerable", // Damage Immunity
		"keyword-invulnerable": "This entity negates all Damage and True Damage.",
		"keyword-resilience-name": "Resilience", // CC Reduction
		"keyword-resilience": "Enemy Crowd Control effects this entity receives have their duration reduced by x%.",
		"keyword-immovable-name": "Immovable", // CC Immunity
		"keyword-immovable": "This entity is immune to all Crowd Control effects.",
		"keyword-speed-name": "Speed", // Movement Speed buff
		"keyword-speed": "This entity's Movement Speed is increased by x%.",
		"keyword-slow-name": "Slow",
		"keyword-slow": "This entity's Movement Speed is reduced by x%."
	}
})