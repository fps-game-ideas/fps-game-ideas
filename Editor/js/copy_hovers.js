
const CLIPBOARD_COPY_DEFAULT = "Copy to clipboard!";
const CLIPBOARD_COPY_DONE = "Copied!";

function addCopyHover(e, text) {
    var tooltip = new bootstrap.Tooltip(e, {
        title: CLIPBOARD_COPY_DEFAULT,
    });
    e.onclick = function() {
        navigator.clipboard.writeText(text);
        $(e).attr('data-bs-original-title', CLIPBOARD_COPY_DONE).tooltip('show');
    }
    e.onmouseout = function() {
        $(e).attr('data-bs-original-title', CLIPBOARD_COPY_DEFAULT);
    }
}