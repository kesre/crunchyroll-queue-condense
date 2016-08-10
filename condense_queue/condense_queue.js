/*jslint browser:true */
var QUEUE_ITEM_CLASS = "queue-item";
var PROGRESS_BAR_CLASS = "episode-progress";
var SIDEBAR_ID = "sidebar_elements";
var TITLE_TOGGLE_COLOR = "gold";
var TITLE_TEXT_CLASS = "series-title ellipsis";
var SIDEBAR_TEXT_CLASS = "series-title block ellipsis";

function hideWatchedQueueItems() {
    "use strict";
    // Find and hide queue elements. Progress bar width (hackily) allows
    // checking whether the latest episode was finished.

    var up_to_date = [];
    var progress;
    var index;
    [].forEach.call(
        document.getElementsByClassName(QUEUE_ITEM_CLASS),
        function (queue_item) {
            progress = queue_item.getElementsByClassName(
                PROGRESS_BAR_CLASS
            )[0];
            if (
                progress.style.width.length > 2 &&
                progress.style.width[0] > "7"
            ) {
                queue_item.style.display = "none";
                index = up_to_date.push(queue_item);
                queue_item.id = "up_to_date_" + (index - 1);
            }
        }
    );
    return up_to_date;
}


function toggleVisibility(title_id) {
    "use strict";
    var queue_item = document.getElementById(title_id);
    queue_item.style.display = (
        queue_item.style.display === "block"
            ? "none"
            : "block"
    );
}


function titleToggler(title_id) {
    "use strict";
    return function (evt) {
        toggleVisibility(title_id);
        evt.currentTarget.style.color = (
            evt.currentTarget.style.color === TITLE_TOGGLE_COLOR
                ? ""
                : TITLE_TOGGLE_COLOR
        );
    };
}


function createSidebarTitles(up_to_date) {
    "use strict";
    // Add a way to toggle visiblity (for sorting or if the episode wasn't
    // actually finished)
    var titles = document.createElement("li");
    var titles_content = document.createElement("ul");
    var titles_desc = document.createElement("h3");
    titles_desc.appendChild(document.createTextNode("Up to date"));
    titles.appendChild(titles_desc);
    titles.appendChild(titles_content);

    var title_text;
    var title;
    var title_id;
    up_to_date.forEach(function (show_element, i) {
        title_text = show_element.getElementsByClassName(
            TITLE_TEXT_CLASS
        )[0].textContent;
        title = document.createElement("li");
        title.style.cursor = "pointer";
        title.className = SIDEBAR_TEXT_CLASS;
        title.appendChild(document.createTextNode(title_text));
        title_id = "up_to_date_" + i;
        title.onclick = titleToggler(title_id);
        titles_content.appendChild(title);
    });

    return titles;
}


function main() {
    "use strict";
    var sidebar_list = document.getElementById(SIDEBAR_ID);
    var up_to_date_container = hideWatchedQueueItems();
    sidebar_list.appendChild(
        createSidebarTitles(up_to_date_container)
    );
}


main();
