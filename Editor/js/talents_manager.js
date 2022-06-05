
function AddTalent(doUpdate = true) {
	var clone = $(".talent.hidden").clone().removeClass("hidden");
	$("#Talents_Page").append(clone);
	appendHighlightInput(clone.find(".talentDescPlace"), "talent_description");
	if (doUpdate) {
		UpdateTalentIDs();
	}
	return clone;
}

function RemoveTalent(e) {
	e.parentElement.parentElement.remove();
	UpdateTalentIDs();
}

function UpdateTalentIDs() {
	var list = $("#Talents_Page .talent:not(.hidden)");
	for (var i=0; i < list.length; i++) {
		var e = list[i].querySelector(".talent_id");
		e.innerHTML = "ID: " + i;
		const refText = "{{TALENT:" + i + "}}";
		addCopyHover(e, refText);
	}
}

function OpenImageSelectorForTalent(images, btn) {
	OpenImageSelector(images, function (img) {TalentChoseImage(img, btn)});
}

function TalentChoseImage (img, btn) {
	console.log(img, btn);
	var img_element = btn.parentElement.firstElementChild;
	TalentImageSet(img.url, img_element);
}

function TalentImageSet(img_url, img_element) {
	img_element.setAttribute("data-image", img_url);
	img_element.style.backgroundImage = "url(\"" + img_url + "\")";
}