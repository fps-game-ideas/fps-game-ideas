
function GetSelectMultipleArray(element) {
	var arr = $(element).find("option:selected").map(function(){ return this.value }).get();
	console.log(arr);
	return arr;
}

function SaveAbilities() {
	var abilities = [];
	$(".ability").each(function(i, e) {
		if (e.className.includes("hidden")) {
			return;
		}
		console.log("Ability To Process: ", e);
		abilities.push({
			name: e.querySelector(".ability_name").value,
			image: e.querySelector(".ability_image").getAttribute("data-image") || "",
			cooldown: Number(e.querySelector(".ability_cooldown").value),
			charges: Number(e.querySelector(".ability_charges").value || "1"),
			bind: e.querySelector(".ability_bind").value,
			description: e.querySelector(".ability_description").value,
			hidden: e.querySelector(".ability_hidden").checked,
			stances: GetSelectMultipleArray(e.querySelector(".ability_stances")),
			details: e.querySelector(".ability_details").value
		});
	})
	return abilities;
}

function SaveTalents() {
	var talents = [];
	$(".talent").each(function(i, e) {
		if (e.className.includes("hidden")) {
			return;
		}
		talents.push({
			name: e.querySelector(".talent_name").value,
			image: e.querySelector(".talent_image").getAttribute("data-image") || "",
			cooldown: Number(e.querySelector(".talent_cooldown").value),
			description: e.querySelector(".talent_description").value,
			details: e.querySelector(".talent_details").value
		});
	})
	return talents;
}

function SaveCards(category) {
	var cards = [];
	$(category).find(".game_card").each(function (i, e) {
		cards.push({
			name: e.querySelector(".card_name_input").value,
			image: e.querySelector(".card_image").getAttribute("data-image") || "",
			description: e.querySelector(".card_description_input").value,
			cost: Number(e.querySelector(".card_cost_input").value),
			max_level: Number(e.querySelector(".card_max_level_input").value),
			cooldown: e.querySelector(".card_cooldown_input").value,
		})
	});
	return cards;
}

function SaveCardCategories() {
	var card_categories = [];
	$(".card_category").each(function(i, e) {
		if (e.className.includes("hidden")) {
			return;
		}
		card_categories.push({
			name: e.querySelector(".card_category_name").value,
			image: e.querySelector(".card_category_image").getAttribute("data-image") || "",
			cards: SaveCards(e)
		})
	})
	return card_categories;
}

function Save() {
	var save_data = {
		name: $("#character_name").val(),
		role: $("#character_role").val(),
		health: $("#character_hp").val(),
		speed: $("#character_spd").val(),
		origin: $("#character_origin").val(),
		bio: $("#character_bio").val(),
		personality: $("#character_personality").val(),
		appearance: $("#character_appearance").val(),
		bio: $("#character_bio").val(),
		other_info: $("#character_other_info").val(),
		abilities : SaveAbilities(),
		talents: SaveTalents(),
		stances: GetStancesArray(),
		card_categories: SaveCardCategories()
	};
	return save_data;
}

function DownloadObjectJSON(obj, name) {
	var a = document.createElement("a");
	var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(obj));
	a.setAttribute("href", dataStr);
	a.setAttribute("download", name + ".json");
	document.body.appendChild(a);
	a.click();
	a.remove();
}

function SaveFile() {
	var save_data = Save();
	DownloadObjectJSON(save_data, save_data.name || ("unnamed_" + save_data.role + "_character"));
}

var fr;

function LoadFile() {
	var file = $("#loadFile")[0].files[0];
	fr = new FileReader();
	fr.onload = ReceivedSaveData;
	fr.readAsText(file);
	//fr.readAsBinaryString(file); //as bit work with base64 for example upload to server
	//fr.readAsDataURL(file);
}

function ReceivedSaveData() {
	var save_data = JSON.parse(fr.result);
	console.log(save_data);
	
	$("#character_name").val(save_data.name);
	$("#character_role").val(save_data.role);
	$("#character_hp").val(save_data.health);
	$("#character_spd").val(save_data.speed);
	$("#character_hp").val(save_data.health);
	$("#character_origin").val(save_data.origin || "");
	$("#character_bio").val(save_data.bio);
	$("#character_personality").val(save_data.personality || "");
	$("#character_appearance").val(save_data.appearance || "");
	$("#character_other_info").val(save_data.other_info || "");
	$("#character_stances").val(save_data.stances.join(", "));
	
	Clear();
	ApplyStances();
	
	LoadAbilities(save_data.abilities);
	LoadTalents(save_data.talents);
	LoadCardCategories(save_data.card_categories);
}

function LoadAbilities(abilities) {
	for (var i=0; i < abilities.length; i++) {
		var ability = abilities[i];
		var clone = AddAbility(false)[0];
		clone.querySelector(".ability_name").value = ability.name;
		AbilityImageSet(ability.image, clone.querySelector(".ability_image"))
		clone.querySelector(".ability_cooldown").value = ability.cooldown;
		clone.querySelector(".ability_charges").value = ability.charges;
		clone.querySelector(".ability_bind").value = ability.bind;
		ApplyAbilityBindChange(clone.querySelector(".ability_bind"));
		setContentsOfHighlightedInput(clone.querySelector(".ability_description"), ability.description);
		clone.querySelector(".ability_hidden").checked = ability.hidden;
		//clone.querySelector(".ability_stances").value = ability.stances;
		clone.querySelector(".ability_details").value = ability.details;
		var options = clone.querySelectorAll(".ability_stances option");
		var stances = ability.stances || [];
		for (var j=0; j < options.length; j++) {
			var option = options[j];
			if (stances.includes(option.value)) {
				option.selected = true;
			}
		}
	}
	UpdateAbilityIDs();
}

function LoadTalents(talents) {
	for (var i=0; i < talents.length; i++) {
		var talent = talents[i];
		var clone = AddTalent(false)[0];
		clone.querySelector(".talent_name").value = talent.name;
		TalentImageSet(talent.image, clone.querySelector(".talent_image"))
		clone.querySelector(".talent_cooldown").value = talent.cooldown;
		setContentsOfHighlightedInput(clone.querySelector(".talent_description"), talent.description);
		clone.querySelector(".talent_details").value = talent.details;
	}
	UpdateTalentIDs();
}

function LoadCardCategories(categories) {
	for (var i=0; i < categories.length; i++) {
		var category = categories[i];
		var clone = AddCardCategory()[0];
		clone.querySelector(".card_category_name").value = category.name;
		CardCategoryImageSet(category.image, clone.querySelector(".card_category_image"));
		LoadCards(category.cards, clone.querySelector(".add_card_btn"));
	}
}

function LoadCards(cards, add_btn) {
	for (var i=0; i < cards.length; i++) {
		var card = cards[i];
		var clone = AddCard(add_btn)[0];
		clone.querySelector(".card_name_input").value = card.name;
		CardCategoryImageSet(card.image, clone.querySelector(".card_image"));
		clone.querySelector(".card_description_input").value = card.description;
		clone.querySelector(".card_cost_input").value = card.cost;
		clone.querySelector(".card_max_level_input").value = card.max_level;
		clone.querySelector(".card_cooldown_input").value = card.cooldown;
	}
}

function Clear() {
	$(".ability").each(function(i, e) {
		if (e.className.includes("hidden")) {
			return;
		}
		e.remove();
	})
	$(".talent").each(function(i, e) {
		if (e.className.includes("hidden")) {
			return;
		}
		e.remove();
	})
	$(".card_category").each(function(i, e) {
		if (e.className.includes("hidden")) {
			return;
		}
		e.remove();
	})
}