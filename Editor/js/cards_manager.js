
function AddCardCategory() {
	var clone = $(".card_category.hidden").clone().removeClass("hidden");
	$("#Cards_Page").append(clone);
	return clone;
}

// Card category removal.

var card_category_remove_modal;
var last_card_category_remove_button;

function InitCardCategoryRemovePrompt() {
	var html = $(`
	<div id="card_category_remove_modal" class="modal text-light" tabindex="-1">
		<div class="modal-dialog">
			<div class="modal-content ">
				<div class="modal-header">
					<h5 class="modal-title">Remove Category!</h5>
					<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
				</div>
				<div class="modal-body" id="card_category_remove_body">
					<p>Are you sure you want to remove this card category and all of its cards?</p>
				</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel!</button>
					<button type="button" class="btn btn-primary" data-bs-dismiss="modal" onclick="RemoveCardCategory()">Remove!</button>
				</div>
			</div>
		</div>
	</div>`);
	$("body").append(html);
	card_category_remove_modal = new bootstrap.Modal(html);
}

function PromptCardCategoryRemoval(btn) {
	last_card_category_remove_button = btn;
	card_category_remove_modal.show();
}

function RemoveCardCategory() {
	last_card_category_remove_button.closest(".card_category").remove();
}

InitCardCategoryRemovePrompt();

// Card category icon selection.

function OpenImageSelectorForCardCategory(images, btn) {
	OpenImageSelector(images, function (img) {CardCategoryChoseImage(img, btn)});
}

function CardCategoryChoseImage (img, btn) {
	console.log(img, btn);
	var img_element = btn;
	CardCategoryImageSet(img.url, img_element);
}

function CardCategoryImageSet(img_url, img_element) {
	img_element.setAttribute("data-image", img_url);
	img_element.style.backgroundImage = "url(\"" + img_url + "\")";
}

// Add/remove cards

function AddCard(btn) {
	var clone = $(".game_card.hidden").clone().removeClass("hidden");
	$(btn.closest(".card_category")).find(".card_category_cards").append(clone);
	return clone;
}

function RemoveCard(e) {
	e.closest(".game_card").remove();
}

// Card Image

function OpenImageSelectorForCard(images, btn) {
	OpenImageSelector(images, function (img) {CardChoseImage(img, btn)});
}

function CardChoseImage (img, btn) {
	console.log(img, btn);
	var img_element = btn;
	CardImageSet(img.url, img_element);
}

function CardImageSet(img_url, img_element) {
	img_element.setAttribute("data-image", img_url);
	img_element.style.backgroundImage = "url(\"" + img_url + "\")";
}