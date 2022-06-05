
function ChangePage(id) {
	//console.log("Changing Page To: ", id);
	$(".Page").css("display", "none");
	$("#" + id).css("display", "block");
}

var container = $('<div class="container-fluid nav_container"><div class="row"></div></div>');
var row = container.find(".row");

/*
<div class="col">
      Column
    </div>
*/

$(".Page").each(function (i, e) {
	var b = $('<div class="col btn_nav btn-secondary">' + e.getAttribute("page_name") + '</div>');
	const id = e.id;
	//console.log(e, id);	
	b.click(function() {
		ChangePage(id);
	})
	row.append(b);
});

$(".mainContent").append(container);

ChangePage("Bio_Page");