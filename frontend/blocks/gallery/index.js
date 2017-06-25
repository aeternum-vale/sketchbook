let Image = require(BLOCKS + 'image');

let eventMixin = require(LIBS + 'eventMixin');

let Gallery = function(options) {

    this.elem = options.elem;
    this.isLogged = options.isLogged;
    this.preloadEntityCount = options.preloadEntityCount;

    this.viewModels = {};
    this.gallery = [];

    this.elem.onclick = e => {
        if (!e.target.matches('.image-preview')) return;
        e.preventDefault();
        this.renderImage(e.target.dataset.id);
        this.currentImageId = +e.target.dataset.id;
    };
};

Gallery.prototype.resizeImage = function() {
    if (this.image)
        this.image.resize();
};

Gallery.prototype.renderImage = function(id) {
    this.requestViewModel(id, response => {
        let parent = document.createElement('DIV');
        parent.innerHTML = response.html;
        let imageElem = parent.firstElementChild;
        document.body.insertBefore(imageElem, document.body.firstElementChild);
        this.setImage(imageElem, response.viewModels[id]);
    });
};

Gallery.prototype.requestViewModel = function(id, cb) {
    let knownImages = [];
    for (let key in this.viewModels)
        knownImages.push(key);

    require(LIBS + 'sendRequest')({
        id,
        knownImages
    }, 'POST', '/gallery', (err, response) => {

        if (err) {
            this.error(err);
            return;
        }

        this.gallery = response.gallery;
        for (let key in response.viewModels)
            this.viewModels[key] = response.viewModels[key];

        if (cb)
            cb(response);
    });
};

Gallery.prototype.setImage = function(elem, viewModel) {
    this.image = new Image({
        elem,
        isLogged: this.isLogged,
        viewModel
    });

    this.image.on('image_next-clicked', e => {
        console.log(this.gallery);
        this.switchToNext();
    });

};

Gallery.prototype.switchToNext = function() {
    this.getNextImageViewModel().then(nextViewModel => {
        this.image.setViewModel(nextViewModel);
        this.currentImageId = this.getNextImageId();

        for (let i = 0; i < this.preloadEntityCount; i++) {
            let nextImageId = this.getNextImageId();
            if (!this.viewModels[nextImageId])
                this.requestViewModel(nextImageId);
        }
    });

};

Gallery.prototype.getNextImageId = function() {
    let index = this.gallery.indexOf(this.currentImageId);
    return this.gallery[(index + 1) % this.gallery.length];
};



Gallery.prototype.getNextImageViewModel = function() {
    return new Promise((resolve, reject) => {
        let nextImageId = this.getNextImageId();
        let nextViewModel = this.viewModels[nextImageId];
        if (!nextViewModel)
            this.requestViewModel(nextImageId, () => {
                resolve(this.viewModels[nextImageId]);
            });
        else
            resolve(this.viewModels[nextImageId]);
    });
};


for (let key in eventMixin) {
    Gallery.prototype[key] = eventMixin[key];
}

module.exports = Gallery;
