
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

var icons = {
	cooldown: '<i class="bi bi-clock" title="Cooldown (in seconds)" data-toggle="tooltip"></i>',
	charges: '<i class="bi bi-lightning-charge" title="Ability Charges" data-toggle="tooltip"></i>',
	cost: '<i class="bi bi-currency-dollar" title="Card Cost" data-toggle="tooltip"></i>',
	level: '<i class="bi bi-arrow-up" title="Card Level" data-toggle="tooltip"></i>'
}


function GoToViewCharacterScreen(char_name) {
	history.pushState({}, char_name + " - Character Viewer!", window.location.origin + window.location.pathname + "?character=" + char_name);
	ViewCharacterPage(char_name);
}

function addAllTypingElements(text) {
	return text.replaceAll("\n", "<br>").replaceAll("\t", "&nbsp;&nbsp;&nbsp;&nbsp;");
}

function ViewCharacterPage(char_name) {
	$("title").html(char_name + " - Character Viewer!");
	$("#characterSelection").addClass("hidden");
	$(".nav_container").removeClass("hidden");
	$("#characterContent").removeClass("hidden");
	$(".note").addClass("hidden");
	$("#Navbar").removeClass("hidden");
	GetCharacterJSON(char_name);
	
	var id = characters.findIndex(val => val == char_name);
	if (id == -1) {
		$("#Navbar_Left_Character_Name").html("ERROR!");
		$("#Navbar_Right_Character_Name").html("ERROR!");
		$("#Navbar_Left_Character").unbind("click");
		$("#Navbar_Right_Character").unbind("click");
	} else {
		var id_left = (id == 0 ? characters.length-1 : id-1);
		var id_right = (id == characters.length -1 ? 0 : id+1);
		$("#Navbar_Left_Character_Name").html(characters[id_left]);
		$("#Navbar_Right_Character_Name").html(characters[id_right]);
		$("#Navbar_Left_Character").unbind("click").click(function() {
			GoToViewCharacterScreen(characters[id_left]);
		});
		$("#Navbar_Right_Character").unbind("click").click(function() {
			GoToViewCharacterScreen(characters[id_right]);
		});
	}
}

var char_data = {};
var bio_points = ["origin", "bio", "personality", "appearance", "other_info"];

function GetCharacterJSON(name) {
	$.get("characters/" + name + ".json", function(data) {
		console.log(data);
		char_data = data;
		//var save_data = JSON.parse(data);
		$("#character_name").html(data.name);
		$("#character_role").html(roles[data.role]);
		$("#character_heath").html(data.health);
		$("#character_speed").html(data.speed);
		$(".bio_point").addClass("hidden");
		for (var i=0; i < bio_points.length; i++) {
			var point = bio_points[i];
			if (data[point] && data[point].length > 0) {
				$("#character_" + point).html(data[point].replaceAll('\n', '<br>'));
				$("#character_" + point + "_header").removeClass("hidden");
			} else {
				$("#character_" + point + "_header").addClass("hidden");
			}
		}
		
		
		if (data.stances.length > 1) {
			var html = '';
			for (var i=0; i < data.stances.length; i++) {
				var stance = data.stances[i];
				//html += '<button class="btn btn-secondary" onclick="RefreshCardsPage(' + i + ')">Card Level ' + i + '</button>';
				html += '<option value="' + stance + '">' + stance + '</option>';
			}
			$("#stance_select").html(html);
			$("#stance_select").removeClass("hidden");
		} else {
			$("#stance_select").addClass("hidden");
		}
		
		RefreshAbilitiesPage();
		
		$(".talent:not(.hidden)").remove();
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
		clone.find(".ability_cooldown").html(ability.cooldown + " " + icons.cooldown);
	}
	if (ability.charges && ability.charges > 1) {
		clone.find(".ability_charges").html(ability.charges + " " + icons.charges);
	}
	clone.find(".ability_bind").html(binds[ability.bind]);
	clone.find(".ability_description").html(addAllTypingElements($.i18n(ability.description)));
	if (ability.details.length > 0) {
		clone.find(".ability_details").html(addAllTypingElements($.i18n(ability.details)));
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

var inTooltip = false;

function AddAbilityTooltips(clone) {
	inTooltip = true;
	clone.find(".ability_link").each(function (i, e) {
		if (!e.hasAttribute("data-ability-id")) {
			return;
		}
		var ability = char_data.abilities[Number(e.getAttribute("data-ability-id"))];
		var template = '<div class=\'tooltip ability_tooltip\'><div class=\'tooltip-arrow\'></div><div class=\'tooltip-inner\'></div></div>';
		var dummy = $('<div></div>');
		var tooltip = new bootstrap.Tooltip(e, {
			html: true,
			title: DisplayAbility(ability, dummy),
			template: template
		});
	})
	inTooltip = false;
}

function DisplayTalent(talent, parent) {
	var clone = $(".talent.hidden").clone().removeClass("hidden");
	clone.find(".talent_name").html(talent.name);
	if (talent.cooldown > 0) {
		clone.find(".talent_cooldown").html(talent.cooldown + " " + icons.cooldown);
	}
	clone.find(".talent_description").html(addAllTypingElements($.i18n(talent.description)));
	if (talent.details.length > 0) {
		clone.find(".talent_details").html(addAllTypingElements($.i18n(talent.details)));
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
	inTooltip = true;
	clone.find(".talent_link").each(function (i, e) {
		if (!e.hasAttribute("data-talent-id")) {
			return;
		}
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
	inTooltip = false;
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
	clone.find(".card_description").html(addAllTypingElements($.i18n(card.description)));
	clone.find(".card_cost").html( (card.cost > 0 ? card.cost*current_card_level : '???') + ' ' + icons.cost);
	//console.log(card_level, current_card_level, max_card_level);
	card.cooldown = card.cooldown || 0;
	var displayCooldown = !(card.cooldown == 0);
	if (displayCooldown) {
		clone.find(".card_cooldown").html( $.i18n(card.cooldown.toString()) + ' ' + icons.cooldown);
	} else {
		clone.find(".card_cooldown").addClass("hidden");
	}
	var spanClass = ((current_card_level >= card.max_level) ? "max_level" : "");
	clone.find(".card_level").html( '<span class="' + spanClass + '">' + current_card_level + "/" + card.max_level + ' ' + icons.level + '</span>' );
	clone.find('[data-toggle="tooltip"]').tooltip();
	AddAbilityTooltips(clone);
	AddTalentTooltips(clone);
	AddCardTooltips(clone);
	parent.append(clone);
	return clone;
}

function AddCardTooltips(clone) {
	inTooltip = true;
	clone.find(".card_link").each(function (i, e) {
		if (!e.hasAttribute("data-card-id")) {
			return;
		}
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
	inTooltip = false;
}

function ToggleDetails(e) {
	$(e.parentElement.parentElement.querySelector(".details")).toggleClass("hidden");
}

function ToggleVisibilityOn(selector) {
	$(selector).toggleClass("hidden");
}
