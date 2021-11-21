
function GoToCharacterSelectionScreen() {
	history.pushState({}, "Character Viewer!", window.location.origin + window.location.pathname);
	CharacterSelectionScreen();
}

function CharacterSelectionScreen() {
	$("title").html("Character Viewer!");
	$(".nav_container").addClass("hidden");
	$("#characterContent").addClass("hidden");
	$("#characterSelection").removeClass("hidden");
	$("#Navbar").addClass("hidden");
	$(".note").removeClass("hidden");
	//var html = '<h1>Choose a character!</h1>';
	var html = '';
	for (var i=0; i < characters.length; i++) {
		var character = characters[i];
		html += '<div class="CharacterSelectName" onclick="ChangePage(\'Bio_Page\');GoToViewCharacterScreen(\'' + character + '\');"><div class="character_icon" style="background-image: url(\'img/character_icons/' + character + '.png\')"></div>' + character + '</div>';
	}
	$("#characterList").html(html);
	
}

function GetCharactersList(callback) {
	var characters = [];
	$.get("https://api.github.com/repos/fps-game-ideas/fps-game-ideas/contents/characters", function(data) {
		//var page = $(data);
		console.log(data);
		for (var i=0; i < data.length; i++) {
			var file = data[i];
			characters.push(file.name.substr(0, file.name.length-5));
		}
		/*
		page.find("a").each( function (i, e) {
			console.log(e);
			if (!e.href.includes(".json")) {
				return;
			}
			
			characters.push(e.innerHTML.substr(1).substr(0, e.innerHTML.length-6));
		})
		*/
		console.log(characters);
		callback(characters);
	})
}