
var highlightFunc = {
    kw: (og, sub, params) => {
        return `<span data-original-text="${og.substring(2, og.length-2)}" class="highlight_kw proper_highlight">${params}</span>`
    },
    ability: (og, sub, params) => {
        /*
        var ability = $(".ability_name")[Number(params)];
        if (!ability) {
            return false;
        }*/
        return `<span data-original-text="${og.substring(2, og.length-2)}" class="highlight_ability proper_highlight">${params}</span>`
    }
}

function highlightSegment(og) {
    var sep = og.indexOf(":");
    if (sep < 0) {
        return `<span class="highlight_">${og}</span>`;
    }
    var sub = og.substring(2, sep).toLowerCase();
    var params = og.substring(sep+1, og.length-2);
    if (!highlightFunc[sub]) {
        return og;
    }
    return highlightFunc[sub](og, sub, params) || `<span class="highlight_">${og}</span>`;
}

function addHighlights(text) {
    return text
        .replace(/{{[^}]*}}/g, highlightSegment);
}


function appendHighlightInput(parent, textareaClass) {
    var input = $(`
        <div contenteditable="true" class="${textareaClass} full_width_textarea form-control bg-dark text-light"></div>
    `);

    function handleInput() {

        var caretPos;
        try {
            caretPos = getCaretCharacterOffsetWithin(this);
        } catch (e) {
            // Do nothing!
        }

        var text = input.html();
        var highlighted = addHighlights(text)
        
        $(this).empty().append(highlighted);

        try {
            setCursor(this, caretPos);
        } catch(e) {
            // Do nothing.
            //console.log(e);
        }
        
    }

    input.on({
        'input': handleInput
    });

    parent.append(input);
}

function setContentsOfHighlightedInput(input, val) {
    $(input).text(val).trigger("input");
}

function getCaretCharacterOffsetWithin(element) {
    var caretOffset = 0;
    if (typeof window.getSelection != "undefined") {
        var range = window.getSelection().getRangeAt(0);
        var preCaretRange = range.cloneRange();
        preCaretRange.selectNodeContents(element);
        preCaretRange.setEnd(range.endContainer, range.endOffset);
        caretOffset = preCaretRange.toString().length;
    } else if (typeof document.selection != "undefined" && document.selection.type != "Control") {
        var textRange = document.selection.createRange();
        var preCaretTextRange = document.body.createTextRange();
        preCaretTextRange.moveToElementText(element);
        preCaretTextRange.setEndPoint("EndToEnd", textRange);
        caretOffset = preCaretTextRange.text.length;
    }
    return caretOffset;
}

function setCursor(node, pos) {
    if (!node) {
        return false;
    } else if (document.createRange) {
        range = document.createRange();
        range.selectNodeContents(node);
        range.setStart(node, pos);
        range.setEnd(node, pos);
        selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
    } else if (node.createTextRange) {
        var textRange = node.createTextRange();
        textRange.collapse(true);
        textRange.moveEnd(pos);
        textRange.moveStart(pos);
        textRange.select();
        return true;
    } else if (node.setSelectionRange) {
        node.setSelectionRange(pos, pos);
        return true;
    }
    return false;
}

/*
function setContentsOfHighlightedInput(txta, val) {
    $(txta).val(val).trigger("input").trigger("scroll");
}
*/