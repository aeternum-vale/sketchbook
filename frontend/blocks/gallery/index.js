let Image = require(BLOCKS + 'image');

let eventMixin = require(LIBS + 'eventMixin');

let Gallery = function(options) {

    this.elem = options.elem;
    this.isLogged = options.isLogged;
    this.preloadEntityCount = options.preloadEntityCount;

    this.viewModels = {};
    this.gallery = [];

    this.imageElem = null;

    this.elem.onclick = e => {
        if (!e.target.matches('.image-preview')) return;
        e.preventDefault();

        if (!this.imageElem)
            this.renderImage(+e.target.dataset.id);
        else
            this.getViewModelById(+e.target.dataset.id).then(viewModel => {
                this.image.setViewModel(viewModel);
                this.image.activate();
            });
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
        this.imageElem = parent.firstElementChild;
        document.body.insertBefore(this.imageElem, document.body.firstElementChild);
        this.setImage(this.imageElem, response.viewModels[id]);
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
        viewModel,
        isEmbedded: true
    });

    this.image.on('image_next-clicked', e => {
        this.switchToNext();
    });

    this.image.on('image_changed', e => {
        delete this.viewModels[this.image.viewModel._id];
    });

};

Gallery.prototype.switchToNext = function() {
    this.getNextImageViewModel().then(nextViewModel => {
        this.image.setViewModel(nextViewModel);

        for (let i = 0; i < this.preloadEntityCount; i++) {
            let nextImageId = this.getNextImageId();
            if (!this.viewModels[nextImageId])
                this.requestViewModel(nextImageId);
        }
    });

};

Gallery.prototype.getNextImageId = function() {
    let index = this.gallery.indexOf(this.image.viewModel._id);
    return this.gallery[(index + 1) % this.gallery.length];
};

Gallery.prototype.getNextImageViewModel = function() {
    let nextImageId = this.getNextImageId();
    return this.getViewModelById(nextImageId);
};

Gallery.prototype.getViewModelById = function(id) {
    return new Promise((resolve, reject) => {
        let resultViewModel = this.viewModels[id];
        if (!resultViewModel)
            this.requestViewModel(id, () => {
                resolve(this.viewModels[id]);
            });
        else
            resolve(resultViewModel);
    });
};

for (let key in eventMixin)
    Gallery.prototype[key] = eventMixin[key];

module.exports = Gallery;
