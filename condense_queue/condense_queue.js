/*jslint
    browser, es6:true
*/
const QUEUE_ITEM_CLASS = "queue-item";
const PROGRESS_BAR_CLASS = "episode-progress";
const SIDEBAR_ID = "sidebar";
const SIDEBAR_ELEM_ID = "sidebar_elements";
const TITLE_TOGGLE_COLOR = "rgb(247, 140, 37)";
const TITLE_TEXT_CLASS = "series-title ellipsis";
const SERIES_TEXT_CLASS = "series-data ellipsis";
const SIDEBAR_TEXT_CLASS = "series-title block ellipsis";
const SIDEBAR_STYLE = 
    "display: inline-block; margin-left: 2px; margin-right: 2px; float: right";
const SIDEBAR_TITLE_STYLE = 
    "display: inline-block; width: 100%; margin-left: 2px; margin-right: 2px";
const SIDEBAR_CONTENT_STYLE = 
    "max-height: 300px; overflow: auto; padding-bottom: 10px";
const TIMER_PERIOD = 50;
const QUEUE_CONTAINER_ID = "container";


function hideWatchedQueueItems() {
    "use strict";
    // Find and hide queue elements. Progress bar width (hackily) allows
    // checking whether the latest episode was finished.

    var up_to_date = [];
    var progress;
    [].forEach.call(
        document.getElementsByClassName(QUEUE_ITEM_CLASS),
        function (queue_item, i) {
            progress = queue_item.getElementsByClassName(
                PROGRESS_BAR_CLASS
            )[0];
            if (
                progress.style.width.length > 2 &&
                progress.style.width[0] > "7" ||
                progress.style.width == "100%"
            ) {
                queue_item.style.display = "none";
                up_to_date.push(queue_item);
                queue_item.id = "up_to_date_" + i;
            }
        }
    )
    return up_to_date;
}


function hideSeriesQueueItems() {
    "use strict";
    // Find and hide new series, also storing current series
    // for reference, but not hiding by default.

    var new_series = [];
    var current_series = [];
    var series_text_elem;
    [].forEach.call(
        document.getElementsByClassName(QUEUE_ITEM_CLASS),
        function (queue_item, i) {
            series_text_elem = queue_item.getElementsByClassName(
                SERIES_TEXT_CLASS
            )[0];
            if (
                // Don't want to have multiple toggles for the same item.
                queue_item.id == ""
            ) {
                if (
                    RegExp('.*Episode 1[^0-9].*').test(series_text_elem.textContent)
                ) {
                    queue_item.style.display = "none";
                    new_series.push(queue_item);
                    queue_item.id = "new_series_" + i;
                } else {
                    current_series.push(queue_item);
                    queue_item.id = "current_series_" + i;
                }
            }
        }
    );
    return [current_series, new_series];
}


function toggleVisibility(item) {
    "use strict";
    item.style.display = (
        item.style.display === "none"
            ? "block"
            : "none"
    );
}


function toggleCategoryDisplay(category_elements) {
    "use strict";
    return function (evt) {
        var to_hide = evt.currentTarget.textContent == "hide all";
        category_elements.forEach(function(show_element){
            show_element.style.display = to_hide ? "none" : "block";
            document.getElementById(
                show_element.id + "_sidebar"
            ).style.color = to_hide ? "" : TITLE_TOGGLE_COLOR;
        });
        evt.currentTarget.textContent = to_hide ? "show all" : "hide all";
    }
}


function toggler(item_id) {
    "use strict";
    return function (evt) {
        var item = document.getElementById(item_id);
        toggleVisibility(item);
        evt.currentTarget.style.color = (
            evt.currentTarget.style.color === TITLE_TOGGLE_COLOR
                ? ""
                : TITLE_TOGGLE_COLOR
        );
    };
}


function createSidebarTitles(
     category_elements,
     category_id,
     category_name,
     start_hidden
) {
    "use strict";
    // Add a way to toggle visiblity (for sorting or if the episode wasn't
    // actually finished)
    var titles = document.createElement("li");
    var titles_content = document.createElement("ul");
    var titles_desc = document.createElement("h3");
    titles_content.id = category_id + "_data";
    titles_desc.id = category_id + "_desc";
    titles_desc.appendChild(document.createTextNode(category_name));
    titles_content.style = SIDEBAR_CONTENT_STYLE;
    titles_content.style.display = "none";

    // Add show / hide / expand.
    var show = document.createElement("button");
    show.appendChild(document.createTextNode(
        start_hidden ? "show all" : "hide all"
    ));
    var expand = document.createElement("button");
    expand.appendChild(document.createTextNode("+"));
    titles_desc.style = SIDEBAR_TITLE_STYLE;
    show.style = SIDEBAR_STYLE;
    expand.style = SIDEBAR_STYLE;
    show.onclick = toggleCategoryDisplay(category_elements);
    expand.onclick = function(evt) {
        var content = document.getElementById(titles_content.id);
        toggleVisibility(content);
        evt.currentTarget.textContent = 
            content.style.display === "none" ? "+": "-"; 
    }

    // Arrange sidebar category.
    titles.appendChild(titles_desc);
    titles_desc.appendChild(show);
    titles_desc.appendChild(expand);
    titles.appendChild(titles_content);

    // Build elements for the category.
    var title_text;
    var title;
    category_elements.forEach(function (show_element) {
        title_text = show_element.getElementsByClassName(
            TITLE_TEXT_CLASS
        )[0].textContent;
        title = document.createElement("li");
        title.style.cursor = "pointer";
        title.className = SIDEBAR_TEXT_CLASS;
        title.appendChild(document.createTextNode(title_text));
        if (!start_hidden) {
            title.style.color = TITLE_TOGGLE_COLOR;
        }
        title.onclick = toggler(show_element.id);
        title.id = show_element.id + "_sidebar";
        titles_content.appendChild(title);
    });

    return titles;
}


var hide_timer;
var main_timer;


function hidePage() {
    "use strict";
    // Prevents rendering before condenser runs.
    if (document.body) {
        document.body.style.display = "none";
        clearInterval(hide_timer);
    }
}


function main() {
    "use strict";
    if (
        // Ensure required elements are present in document.
        document.getElementById(QUEUE_CONTAINER_ID) && 
        document.getElementById(SIDEBAR_ID)
    ) {
        var sidebar_list = document.getElementById(SIDEBAR_ELEM_ID);
        var sidebar = document.getElementById(SIDEBAR_ID);
        sidebar.style.position = "sticky";
        sidebar.style.top = "20px";
        var watched_items = hideWatchedQueueItems();
        var series_items = hideSeriesQueueItems();
        sidebar_list.appendChild(
            createSidebarTitles(series_items[0], "current_series", 
                                "Currently Watching:", false)
        )
        sidebar_list.appendChild(
            createSidebarTitles(series_items[1], "new_series", 
                                "New Series:", true)
        );
        sidebar_list.appendChild(
            createSidebarTitles(watched_items, "up_to_date", 
                                "Up To Date:", true)
        );

        clearInterval(main_timer);
        document.body.style.display = "";
    }
}


hide_timer = setInterval(function () {hidePage();}, TIMER_PERIOD);
main_timer = setInterval(function () {main();}, TIMER_PERIOD);
