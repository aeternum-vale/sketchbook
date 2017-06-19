let Image = require(BLOCKS + 'image');

let eventMixin = require(LIBS + 'eventMixin');


let Gallery = function(options) {
    this.elem = options.elem;
    //this.imagesInfo = JSON.parse(this.elem.querySelector('.gallery__obj').textContent);

    this.elem.onclick = e => {
        if (!e.target.matches('.image-preview')) return;

        e.preventDefault();

        this.renderImage(e.target.dataset.id);
        //this.image = new Image({
        //    elem: this.renderImage(e.target.dataset.id)
        //});


    };
};

Gallery.prototype.renderImage = function(id) {
    let parent = document.createElement('DIV');
    require(LIBS + 'sendRequest')(null, 'GET', '/image/' + id, (err, response) => {
        if (err) {
            this.error(err);
            return;
        }
        console.log(response.html);
        parent.innerHTML = response.html;
        this.image = parent.firstElementChild;
        document.body.appendChild(this.image); //upper!
    });

};


for (let key in eventMixin) {
    Gallery.prototype[key] = eventMixin[key];
}

module.exports = Gallery;
