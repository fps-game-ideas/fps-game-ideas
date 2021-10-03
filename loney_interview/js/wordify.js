
function Wordify() {
	console.log(questions_data);
	var dialogues = [];
	var callbacks_received = 0;
	for (var i=0; i < questions_data.length; i++) {
		const index = i;
		$.get("questions/" + questions_data[i].file_name + ".json", {}, function (data) {
			dialogues[index] = data;
			callbacks_received++;
			if (callbacks_received >= questions_data.length) {
				Wordify_Step2(dialogues);
			}
		})
	}
}

function Wordify_Step2(dialogues) {
	$.get("no_censor.json", {}, function (data) {
		dialogues.unshift(data);
		$.get("beginning.json", {}, function (data) {
			dialogues.unshift(data);
			Wordify_Step3(dialogues);
		})
	})
}

function Wordify_Step3(dialogues) {
	console.log(dialogues);
	last_speaker_id = "";
	var string = "<p>";
	for (var i=0; i < dialogues.length; i++) {
		var dialogue = dialogues[i];
		for (var j=0; j < dialogue.length; j++) {
			var txt_data = GetMeessageAndSpeakerFromString(dialogue[j]);
			//console.log(txt_data);
			if (last_speaker_id != txt_data[1]) {
				string += '</p><p><b>' + speakers[txt_data[1]].name + ':</b> ';
				last_speaker_id = txt_data[1];
			}
			string += txt_data[0] + '<br>';
		}
	}
	string += "</p>";
	/*
	clipboard.copy({
		"text/html": string
	});*/
	//copyToClipboard(string);
	//var blob = new Blob(string, {type: "text/html"});
	//console.log(blob);
	//var test_blob = blob;
	//navigator.clipboard.write(blob).then(
	//	(a) => {console.log("success", a)},
	//	(a) => {console.log("faliure", a)}
	//)
	console.log(string);
	copyToClip(string);
}

function copyToClip(str) {
	function listener(e) {
		e.clipboardData.setData("text/html", str);
		e.clipboardData.setData("text/plain", str);
		e.preventDefault();
	}
	document.addEventListener("copy", listener);
	document.execCommand("copy");
	document.removeEventListener("copy", listener);
};