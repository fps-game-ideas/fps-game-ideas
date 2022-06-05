
var modal;
var ability_images = [];

var current_images;
var current_callback;

function InitImageSelector() {
	var html = $(`
	<div id="image_selector_modal" class="modal text-light" tabindex="-1">
		<div class="modal-dialog modal-xl">
			<div class="modal-content">
				<div class="modal-header">
					<h5 class="modal-title">Pick an Image!</h5>
					<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
				</div>
				<div class="modal-body" id="image_selector_body">
					<p>Modal body text goes here.</p>
				</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
				</div>
			</div>
		</div>
	</div>`);
	$("body").append(html);
	modal = new bootstrap.Modal(html);
}

function OnSelect(nr) {
	modal.hide();
	current_callback(current_images[nr]);
}

function OnSearchChange() {
	var search_val = $("#image_selector_search").val().toLowerCase();
	console.log(search_val);
	var elements = document.querySelectorAll("#image_selector_body img")
	for (var i=0; i < current_images.length; i++) {
		elements[i].style.display = isRemoved(current_images[i], search_val) ? "none" : "inline-block";
	}
}

function PermaHide(i) {
	document.querySelectorAll("#image_selector_body img")[i].style.display = "none";
	current_images[i].alwaysHidden = true;
}

function OpenImageSelector(images, callback) {
	current_images = images;
	current_callback = callback;
	var html = '<input id="image_selector_search" class="form-control bg-dark text-light" onkeyup="OnSearchChange()" >';
	for (var i=0; i < images.length; i++) {
		var image = images[i];
		html += '<img src="'+ image.url +'" onclick="OnSelect(' + i + ')" onerror="PermaHide(' + i + ')">';
	}
	$("#image_selector_body").html(html);
	modal.show();
}

function pad(num, size) {
    num = num.toString();
    while (num.length < size) num = "0" + num;
    return num;
}

function isRemoved(obj, search_val) {
	if (obj.alwaysHidden) {
		return true;
	}
	if (search_val.length <= 0) {
		return false;
	}
	var findableString = obj.nr.toString();
	if (obj.grey) {
		findableString = findableString + " grey";
	}
	console.log("findableString: ", findableString, "search_val", search_val.toLowerCase(), "obj", obj, findableString.includes(search_val.toLowerCase()) );
	return !findableString.includes(search_val.toLowerCase());
}

function PopulateImages(max = 1175) {
	for (var i=1; i <= max; i++) {
		var str = "img/abilities/skill_" + pad(i, 5) + ".png";
		var str2 = "img/abilities/skill_" + pad(i, 5) + "_grey.png";
		ability_images.push({url: str, nr: i, grey: false});
		ability_images.push({url: str2, nr: i, grey: true});
	}
}

InitImageSelector();
PopulateImages();