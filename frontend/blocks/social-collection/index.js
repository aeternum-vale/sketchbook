let eventMixin = require(LIBS + 'eventMixin');
let SocialCollection = function(options) {

    this.elem = options.elem;
    this.socialList = this.elem.querySelector('.social-collection__social-list');
    this.textbox = this.elem.querySelector('.textbox__field');

    this.elem.onclick = e => {

        if (e.target.matches('.textbox-button__button') && this.textbox.value) {
            this.sendSocial(this.textbox.value);
            return;
        }

        if (e.target.matches('.social__close'))
            this.deleteSocial(e.target.closest('.social'));
    };
};

SocialCollection.prototype.sendSocial = function(link) {
    require(LIBS + 'sendRequest')({
        link
    }, 'POST', '/userdata', (err, response) => {

        if (err) {
            this.error(err);
            return;
        }

        this.insertNewSocial(response.linkObj);
        this.textbox.value = '';
    });

};

SocialCollection.prototype.deleteSocial = function(social) {
    require(LIBS + 'sendRequest')({
        link: social.dataset.link
    }, 'DELETE', '/settings', (err, response) => {

        if (err) {
            this.error(err);
            return;
        }

        social.remove();
    });

};

SocialCollection.prototype.insertNewSocial = function(linkObj) {
    let social = require(LIBS + 'renderElement')(require('html-loader!./social'));
    social.dataset.link = linkObj.href;
    social.querySelector('.social__link').setAttribute('href', linkObj.href);
    social.querySelector('.social__host').textContent = linkObj.host;
    this.socialList.appendChild(social);
};

for (let key in eventMixin) {
    SocialCollection.prototype[key] = eventMixin[key];
}

module.exports = SocialCollection;
