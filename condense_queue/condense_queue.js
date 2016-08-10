var queue_items = document.getElementsByClassName("queue-item");
var up_to_date = [];

for (i=0; i < queue_items.length; i++) {
    queue_item = queue_items[i];
    var progress = queue_item.getElementsByClassName("episode-progress")[0];
    if (progress.style.width.length > 2 & progress.style.width[0] > "7") {
        queue_item.style.display = "none";
        var index = up_to_date.push(queue_item);
        queue_item.id = "up_to_date_" + (index - 1)
    }
}


var titles = document.createElement('li');
var titles_content = document.createElement('ul');
var titles_desc = document.createElement('h3');
titles_desc.appendChild(document.createTextNode("Up to date"));
titles.appendChild(titles_desc);
titles.appendChild(titles_content);

function toggleVisibility(title_id) {
    var queue_item = document.getElementById(title_id);
    queue_item.style.display = queue_item.style.display == 'block'? 'none' : 'block';
}

function titleToggler(title_id) {
    return function(evt) {
        toggleVisibility(title_id)
        evt.currentTarget.style.color = evt.currentTarget.style.color == 'gold'? '': 'gold';
    };
}

for (i=0; i < up_to_date.length; i++) {
    title_text = up_to_date[i].getElementsByClassName(
        'series-title ellipsis'
    )[0].textContent;
    var title = document.createElement('li');
    title.style.cursor = 'pointer';
    title.className = "series-title block ellipsis";
    title.appendChild(document.createTextNode(title_text));
    var title_id = 'up_to_date_' + i;
    title.onclick = titleToggler(title_id);
    titles_content.appendChild(title);
}
var sidebar_list = document.getElementById("sidebar_elements");
sidebar_list.appendChild(titles);

