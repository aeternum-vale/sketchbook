module.exports = function(html) {
    let parent = document.createElement('DIV');
    parent.innerHTML = html;
    return parent.firstElementChild;
};
