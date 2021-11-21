
function ChangePage(id) {
	//console.log("Changing Page To: ", id);
	$(".Page").css("display", "none");
	$("#" + id).css("display", "block");
	$(".btn_nav").removeClass("clicked_nav");
	console.log($("#Nav_" + id));
	$("#Nav_" + id).addClass("clicked_nav");
	window.scrollTo({ top: 0, behavior: 'instant' });
}

var container = $('<div class="container-fluid nav_container"><div class="row"></div></div>');
var row = container.find(".row");

/*
<div class="col">
      Column
    </div>
*/

$(".Page").each(function (i, e) {
	const id = e.id;
	var b = $('<div id="Nav_' + id + '" class="col btn_nav btn-secondary">' + e.getAttribute("page_name") + '</div>');
	//console.log(e, id);	
	b.click(function() {
		ChangePage(id);
	})
	row.append(b);
});

$("#characterContent").append(container);

ChangePage("Bio_Page");

window.onpopstate = function(event) {
	console.log(`location: ${document.location}, state: ${JSON.stringify(event.state)}`);
	HandlePageSetup();
}

var characters = {}

function HandlePageSetup() {
	var params = new URLSearchParams(window.location.search);
	if (params.get("character") != null) {
		console.log("Viewing Character! " + params.get("character"));
		ViewCharacterPage(params.get("character"));
	} else {
		console.log("Viewing Character Select!");
		CharacterSelectionScreen();
	}
}

GetCharactersList(function (data) {
	characters = data;
	HandlePageSetup();
})

