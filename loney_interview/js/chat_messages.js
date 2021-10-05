
var speakers = {
	L : {
		name: "Loney",
		name_color: "777777",
		pfp: "img/Loney_Grey.png"
	},
	H : {
		name: "Interviewer66",
		name_color: "EE4444",
		pfp: "img/Interviewer_NoStars.png"
	}
}

function ReturnMessageRow(message) {
	return `<div class="message_container">${message}</div>`;
}

function ReturnChatMessageHTML(message, speaker) {
	return `
		<div class="chat_message">
			<div class="pfp_container">
				<div class="pfp" style="background-image: url('${speaker.pfp}')"></div>
			</div>
			
			<div class="name_and_message_container">
				<div class="name_container" style="color:${speaker.name_color};">${speaker.name}</div>
				${ReturnMessageRow(message)}
			</div>
		</div>
	`;
}

var last_speaker_id = "";
function GetMeessageAndSpeakerFromString(string) {
	var speaker_id = last_speaker_id;
	var message = string;
	if (string[0] == '[') {
		var pos = string.indexOf("]");
		speaker_id = string.substr(1, pos-1);
		message = string.substr(pos+1);
	}
	return [message, speaker_id];
}


function AppendMessage(string) {
	var data = GetMeessageAndSpeakerFromString(string);
	var message = data[0];
	var speaker_id = data[1];
	if (no_profanity_mode) {
		message = ProfanityProof(message);
	}
	//console.log(string, speaker_id, message);
	if (speaker_id == last_speaker_id) {
		$(".chat_message:last").find(".name_and_message_container").append(ReturnMessageRow(message));
	} else {
		$("#chat_container").append(ReturnChatMessageHTML(message, speakers[speaker_id]));
	}
	last_speaker_id = speaker_id;
	window.scrollTo(0,document.body.scrollHeight);
}

var current_messages = [];
function WriteMessage(index) {
	if (index >= current_messages.length) {
		timer = -1;
		message_index = -1;
		DisplayQuestion(next_question);
		return;
	}
	var message = current_messages[index];
	AppendMessage(message);
	//setTimeout(function () {
		//WriteMessage(index + 1);
	//}, message.length * 40);
	message_index = index+1;
	timer = message.length * 3;
}

var timer = -1;
var message_index = -1;

function Update() {
	//console.log("Update!", timer, message_index);
	if (message_index >= 0) {
		timer = timer - message_speed;
		if (timer <= 0) {
			WriteMessage(message_index);
		}
	}
	window.requestAnimationFrame(Update);
}

window.requestAnimationFrame(Update);

var message_speed = 1;
$("body").keypress(function (e) {
	console.log(e);
	if (e.code == "KeyC") {
		if (message_speed == 1) {
			message_speed = 2;
		} else if (message_speed == 2) {
			message_speed = 4;
		} else {
			message_speed = 1;
		}
		$("#fast_forward_text").html((message_speed != 1) ? (message_speed + "x Speed!") : "");
	}
	if (e.code == "KeyX") {
		if (message_speed == 99999) {
			message_speed = 1;
			$("#fast_forward_text").html("");
		} else {
			message_speed = 99999;
			$("#fast_forward_text").html("Instant Skip!");
		}
	}
	if (e.code == "KeyZ") {
		timer = 0;
	}
	if (e.code == "KeyS") {
		Wordify();
	}
})

function LoadDialogue(file_name, repl = true) {
	$.get(file_name, {}, function (data) {
		//console.log("data", data);
		if (repl) { // repl stands for "replace"
			current_messages = data;
		} else {
			current_messages = current_messages.concat(data);
		}
		WriteMessage(0);
	});
}

/*
var next_question = {
	title: "Do you want me to censor swear words, profanity and words of a sexual or offensive nature?",
	answers: ["Yes, please!", "No! Show me the juicy details!"],
	callback: function (i, name) {
		no_profanity_mode = i==0;
		//LoadDialogue("beginning2.json", false);
		LoadDialogue(no_profanity_mode ? "yes_censor.json" : "no_censor.json");
		next_question = main_question;
	},
	long_answers : false,
	fade_map: [false, false]
}*/

function DisplayQuestion(title, answers, callback, long_answers = false, fade_map = []) {
	if ((typeof title) == "object") {
		console.log("Title!", title);
		answers = title.answers;
		callback = title.callback;
		long_answers = title.long_answers;
		fade_map = title.fade_map;
		title = title.title;
	}
	const container = $(`
		<div id="question_container">
			<div class="question_title">${title}</div>
		</div>
	`);
	console.log("Fade Map", fade_map);
	for (var i=0; i < answers.length; i++) {
		const index = i;
		const answer = answers[i];
		var faded = fade_map[i] ? "faded_answer" : "";
		console.log( i, "Faded = ", faded);
		var q = $(`<div class="question_answer ${long_answers ? "long_answer" : ""} ${faded}">${answer}</div>`);
		q.click(function () {
			callback(index, answer);
			container.remove();
		});
		container.append(q);
	}
	$("#chat_container").append(container);
	window.scrollTo(0,document.body.scrollHeight);
}

var no_profanity_mode = true;
var profanity = [
	"FUCK",
	"SHIT",
	"ASS",
	"BITCH",
	"WHORE",
	"SEX", // Should also catch "Sexual", "Sexy" etc.
	"CUCK",
	"PROSTI", // Should catch all forms of "Prostitute"
	"MASTUR", // Should catch all forms of "Masturbate"
	"GAY",
	"DICK",
	"COCK"
];

var profanity_exceptions = [
	"SASS",
	"CLASS",
	"BYPASS",
	"ASSAULT"
]

function ProfanityProof(message) {
	var words = message.split(" ");
	for (var i=0; i < words.length; i++) {
		var upper_word = words[i].toUpperCase();
		for (var j=0; j < profanity_exceptions.length; j++) {
			var exception = false;
			if (upper_word.includes(profanity_exceptions[j])) {
				exception = true;
				break;
			}
		}
		if (!exception) {
			for (var j=0; j < profanity.length; j++) {
				if (upper_word.includes(profanity[j])) {
					words[i] = '<span class="censored" onclick="Uncensor(this)">' + words[i] + '</span>';
					break;
				}
			}
		}
	}
	return words.join(' ');
}

function Uncensor(ele) {
	ele.className += " uncensored";
}

var main_question = {};

function GenerateMainQuestion(data) {
	console.log("question_catalogue.json", data);
	main_question = {
		title: "Please choose a question to ask me.",
		answers: [],
		callback: function(i, name) {
			questions_data[i].answered = true;
			LoadDialogue("questions/" + data[i].file_name + ".json");
			GenerateMainQuestion(questions_data);
			next_question = main_question;
			if (data[i].file_name == "ending") { // Hardcoded end for this thing.
				next_question = end_question;
			}
		},
		long_answers: true,
		fade_map: []
	};
	for (var i=0; i < data.length; i++) {
		main_question.answers.push(data[i].name);
		main_question.fade_map.push(!(!data[i].answered));
	}
	console.log(main_question);
}

var end_question = {
	title: "<span style='color:red;'>Conversation Finished!</span>",
	answers: [],
	callback: function() {},
	long_answers: false,
	fade_map: []
}

var questions_data = [];
$.get("question_catalogue.json", {}, function (data) {
	questions_data = data;
	GenerateMainQuestion(data);
	next_question = main_question;
});

LoadDialogue("beginning.json");