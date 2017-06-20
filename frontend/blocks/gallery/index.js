let Image = require(BLOCKS + 'image');

let eventMixin = require(LIBS + 'eventMixin');


let Gallery = function(options) {
    this.elem = options.elem;
    this.isLogged = options.isLogged;

    this.elem.onclick = e => {
        if (!e.target.matches('.image-preview')) return;
        e.preventDefault();
        this.renderImage(e.target.dataset.id);
    };
};

Gallery.prototype.renderImage = function(id) {

    let parent = document.createElement('DIV');
    require(LIBS + 'sendRequest')(null, 'GET', '/image/' + id, (err, response) => {
        if (err) {
            this.error(err);
            return;
        }

        parent.innerHTML = response.html;
        let imageElem = parent.firstElementChild;
        document.body.insertBefore(imageElem, document.body.firstElementChild);
        console.log(response.viewModel);


        this.image = new Image({
            elem: imageElem,
            isLogged: this.isLogged,
            viewModel: response.viewModel
        });

    });
};


for (let key in eventMixin) {
    Gallery.prototype[key] = eventMixin[key];
}

module.exports = Gallery;
