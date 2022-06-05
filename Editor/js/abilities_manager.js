

function AddAbility(doUpdate = true) {
	var clone = $(".ability.hidden").clone().removeClass("hidden");
	$("#Ability_Page").append(clone);
	appendHighlightInput(clone.find(".abilityDescPlace"), "ability_description");
	if (doUpdate) {
		UpdateAbilityIDs();
	}
	return clone;
}

function RemoveAbility(e) {
	e.parentElement.parentElement.remove();
	UpdateAbilityIDs();
}

function UpdateAbilityIDs() {
	var list = $("#Ability_Page .ability:not(.hidden)");
	for (var i=0; i < list.length; i++) {
		var e = list[i].querySelector(".ability_id");
		e.innerHTML = "ID: " + i;
		const refText = "{{ABILITY:" + i + "}}";
		addCopyHover(e, refText);
	}
}

function OpenImageSelectorForAbility(images, btn) {
	OpenImageSelector(images, function (img) {AbilityChoseImage(img, btn)});
}

function AbilityChoseImage(img, btn) {
	console.log(img, btn);
	var img_element = btn.parentElement.firstElementChild;
	AbilityImageSet(img.url, img_element)
}

function AbilityImageSet(img_url, img_element) {
	img_element.setAttribute("data-image", img_url);
	img_element.style.backgroundImage = "url(\"" + img_url + "\")";
}

function ApplyAbilityBindChange(e) {
	var img_element = $(e.closest(".ability").querySelector(".ability_image"));
	console.log("Bind Changed!", e, img_element);
	if (e.value == "ultimate") {
		img_element.addClass("ultimate_image");
	} else {
		img_element.removeClass("ultimate_image");
	}
}

function GetStancesArray() {
	var stances = $("#character_stances").val().split(",");
	for (var i=0; i < stances.length; i++) {
		stances[i] = stances[i].trim();
	}
	return stances;
}

function ApplyStances() {
	var stances = GetStancesArray();
	var html = "";
	for (var i=0; i < stances.length; i++) {
		var stance = stances[i];
		html += '<option value="' + stance + '">' + stance + '</option>';
	}
	$(".ability_stances").html(html);
	$(".ability_stances_container").css("display", (stances.length <= 1) ? "none" : "block");
}

ApplyStances();