
var roles = {
	unknown: "Unknown",
	tank: "Tank",
	flank: "Flank",
	damage: "Damage",
	healer: "Healer"
}

var binds = {
	passive: "Passive",
	primary: "Primary Fire",
	secondary: "Secondary Fire",
	ability1: "Ability 1",
	ability2: "Ability 2",
	ultimate: "Ultimate"
}

function ViewCharacterPage(char_name) {
	$("#characterSelection").addClass("hidden");
	GetCharacterJSON(char_name);
}

var char_data = {};

function GetCharacterJSON(name) {
	$.get("characters/" + name + ".json", function(data) {
		console.log(data);
		char_data = data;
		//var save_data = JSON.parse(data);
		$("#character_name").html(data.name);
		$("#character_role").html(roles[data.role]);
		$("#character_heath").html(data.health);
		$("#character_speed").html(data.speed);
		$("#character_bio").html(data.bio.replaceAll('\n', '<br>'));
		
		if (data.stances.length > 1) {
			var html = '';
			for (var i=0; i < data.stances.length; i++) {
				var stance = data.stances[i];
				//html += '<button class="btn btn-secondary" onclick="RefreshCardsPage(' + i + ')">Card Level ' + i + '</button>';
				html += '<option value="' + stance + '">' + stance + '</option>';
			}
			$("#stance_select").html(html);
		} else {
			$("#stance_select").addClass("hidden");
		}
		
		RefreshAbilitiesPage();
		
		for (var i=0; i < data.talents.length; i++) {
			var talent = data.talents[i];
			DisplayTalent(talent, $("#Talents_Page"));
		}
		
		RefreshCardsPage(1);
		var html = '';
		for (var i=1; i <= max_card_level; i++) {
			//html += '<button class="btn btn-secondary" onclick="RefreshCardsPage(' + i + ')">Card Level ' + i + '</button>';
			html += '<option value="' + i + '">Card Level ' + i + '</option>';
		}
		$("#card_level_select").html(html);
	})
}

function CanDisplayAbility(ability) {
	if (ability.hidden) {
		return false;
	}
	if (char_data.stances.length <= 1) {
		return true;
	}
	return ability.stances.includes($("#stance_select").val());
}

function RefreshAbilitiesPage() {
	$(".ability:not(.hidden)").remove();
	for (var i=0; i < char_data.abilities.length; i++) {
		var ability = char_data.abilities[i];
		if (CanDisplayAbility(ability)) {
			DisplayAbility(ability, $("#Ability_Page"));
		}
	}
}

function DisplayAbility(ability, parent) {
	var clone = $(".ability.hidden").clone().removeClass("hidden");
	clone.find(".ability_name").html(ability.name);
	if (ability.cooldown > 0) {
		clone.find(".ability_cooldown").html(ability.cooldown + " sec.");
	}
	clone.find(".ability_bind").html(binds[ability.bind]);
	clone.find(".ability_description").html($.i18n(ability.description));
	if (ability.details.length > 0) {
		clone.find(".ability_details").html($.i18n(ability.details).replaceAll('\n', '<br>'));
	} else {
		clone.find(".ability_details_label").addClass("hidden");
	}
	clone.find(".ability_image").css("background-image", 'url("' + ability.image + '")').addClass(ability.bind == "ultimate" ? "ultimate_image" : "");
	clone.find('[data-toggle="tooltip"]').tooltip();
	AddAbilityTooltips(clone);
	AddTalentTooltips(clone);
	AddCardTooltips(clone);
	parent.append(clone);
	return clone;
}

function AddAbilityTooltips(clone) {
	clone.find(".ability_link").each(function (i, e) {
		var ability = char_data.abilities[Number(e.getAttribute("data-ability-id"))];
		var template = '<div class=\'tooltip ability_tooltip\'><div class=\'tooltip-arrow\'></div><div class=\'tooltip-inner\'></div></div>';
		var dummy = $('<div></div>');
		var tooltip = new bootstrap.Tooltip(e, {
			html: true,
			title: DisplayAbility(ability, dummy),
			template: template
		});
	})
}

function DisplayTalent(talent, parent) {
	var clone = $(".talent.hidden").clone().removeClass("hidden");
	clone.find(".talent_name").html(talent.name);
	if (talent.cooldown > 0) {
		clone.find(".talent_cooldown").html(talent.cooldown + " sec.");
	}
	clone.find(".talent_description").html($.i18n(talent.description));
	if (talent.details.length > 0) {
		clone.find(".talent_details").html($.i18n(talent.details).replaceAll('\n', '<br>'));
	} else {
		clone.find(".talent_details_label").addClass("hidden");
	}
	clone.find(".talent_image").css("background-image", 'url("' + talent.image + '")');
	clone.find('[data-toggle="tooltip"]').tooltip();
	AddAbilityTooltips(clone);
	AddTalentTooltips(clone);
	AddCardTooltips(clone);
	parent.append(clone);
	return clone;
}

function AddTalentTooltips(clone) {
	clone.find(".talent_link").each(function (i, e) {
		var talent = char_data.talents[Number(e.getAttribute("data-talent-id"))];
		var template = '<div class=\'tooltip talent_tooltip\'><div class=\'tooltip-arrow\'></div><div class=\'tooltip-inner\'></div></div>';
		var dummy = $('<div></div>');
		console.log(talent);
		var tooltip = new bootstrap.Tooltip(e, {
			html: true,
			title: DisplayTalent(talent, dummy),
			template: template
		});
	})
}

var card_level = 1; // Global card level
var current_card_level = 1; // Workaround for local card level, capped based on the currently processed card's max level.
var max_card_level = -1;

function RefreshCardsPage(level) {
	//console.log("Cards page refresh!", level, Number(level))
	card_level = Number(level);
	$(".card_category:not(.hidden)").remove();
	for (var i=0; i < char_data.card_categories.length; i++) {
		var category = char_data.card_categories[i];
		DisplayCardCategory(category, $("#Cards_Page"));
	}
}

function DisplayCardCategory(category, parent) {
	var clone = $(".card_category.hidden").clone().removeClass("hidden");
	clone.find(".card_category_name").html(category.name);
	clone.find(".card_category_image").css("background-image", 'url("' + category.image + '")');
	var card_parent = clone.find(".card_category_cards");
	for (var i=0; i < category.cards.length; i++) {
		var card = category.cards[i];
		DisplayCard(card, card_parent);
	}
	parent.append(clone);
	return clone;
}

function DisplayCard(card, parent, level) {
	var clone = $(".game_card.hidden").clone().removeClass("hidden");
	current_card_level = Math.min(card_level, card.max_level)
	max_card_level = Math.max(card.max_level, max_card_level);
	clone.find(".card_name").html(card.name);
	clone.find(".card_image").css("background-image", 'url("' + card.image + '")');
	clone.find(".card_description").html($.i18n(card.description));
	clone.find(".card_cost").html( (card.cost > 0 ? card.cost*current_card_level : '???') + ' <i class="bi bi-currency-dollar"></i>');
	//console.log(card_level, current_card_level, max_card_level);
	var displayCooldown = !(card.cooldown === 0);
	if (displayCooldown) {
		clone.find(".card_cooldown").html( $.i18n(card.cooldown.toString()) + ' <i class="bi bi-clock"></i>' );
	} else {
		clone.find(".card_cooldown").addClass("hidden");
	}
	var spanClass = ((current_card_level >= card.max_level) ? "max_level" : "");
	clone.find(".card_level").html( '<span class="' + spanClass + '">' + current_card_level + "/" + card.max_level + ' <i class="bi bi-arrow-up"></i></span>' );
	clone.find('[data-toggle="tooltip"]').tooltip();
	AddAbilityTooltips(clone);
	AddTalentTooltips(clone);
	AddCardTooltips(clone);
	parent.append(clone);
	return clone;
}

function AddCardTooltips(clone) {
	clone.find(".card_link").each(function (i, e) {
		var card = char_data.card_categories[Number(e.getAttribute("data-category-id"))].cards[Number(e.getAttribute("data-card-id"))];
		var template = '<div class=\'tooltip card_tooltip\'><div class=\'tooltip-arrow\'></div><div class=\'tooltip-inner\'></div></div>';
		var dummy = $('<div></div>');
		console.log(card);
		var tooltip = new bootstrap.Tooltip(e, {
			html: true,
			title: DisplayCard(card, dummy),
			template: template
		});
	})
}

function ToggleDetails(e) {
	$(e.parentElement.parentElement.querySelector(".details")).toggleClass("hidden");
}