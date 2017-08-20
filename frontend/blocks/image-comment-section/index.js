let CommentSection = require(BLOCKS + 'comment-section');

let ImageCommentSection = function (options) {
    CommentSection.apply(this, arguments);

    this.commentSectionWrapper = options.commentSectionWrapper;
    this.infoBoard = options.infoBoard;
    this.scrollbarWrapper = options.scrollbarWrapper;
    this.scrollbar = this.scrollbarWrapper.querySelector('.image__comment-section-scrollbar');
    this.scrollbarOffset = this.scrollbarWrapper.querySelector('.image__comment-section-scrollbar-offset');
    this.scrollbarSlider = this.scrollbarWrapper.querySelector('.image__comment-section-slider');

    this.commentSectionWrapper.onscroll = e => {

        let scrollRate = (this.commentSectionWrapper.scrollTop) /
            (this.commentSectionWrapper.scrollHeight - this.commentSectionWrapper.offsetHeight) * 100;

        if (!this.onDragging)
            this.scrollbarSlider.style.top = `${(1 - this.sliderSizeRate) * scrollRate}%`;
    };


    this.scrollbarSlider.onmousedown = e => {

        console.log('this.scrollbarSlider.onmousedown');

        this.onDragging = true;

        let sliderCoords = getCoords(this.scrollbarSlider);
        let shiftY = e.pageY - sliderCoords.top;

        let scrollbarCoords = getCoords(this.scrollbar);
        let newTop;

        document.onmousemove = e => {
            newTop = e.pageY - shiftY - scrollbarCoords.top;
            if (newTop < 0) newTop = 0;
            let bottomEdge = this.scrollbar.offsetHeight - this.scrollbarSlider.offsetHeight;
            if (newTop > bottomEdge) newTop = bottomEdge;

            this.scrollbarSlider.style.top = newTop + 'px';

            this.commentSectionWrapper.scrollTop = (newTop / this.scrollbar.offsetHeight) / (1 - this.sliderSizeRate) *


                (this.commentSectionWrapper.scrollHeight - this.commentSectionWrapper.offsetHeight);
        };

        document.onmouseup = e => {
            console.log('onmouseup', newTop, this.scrollbar.offsetHeight);
            this.scrollbarSlider.style.top = (newTop * 100 / this.scrollbar.offsetHeight) + '%';
            this.onDragging = false;
            document.onmousemove = document.onmouseup = null;
        };

        return false; // disable selection start (cursor change)
    };

    this.scrollbarSlider.ondragstart = function () {
        return false;
    };

    function getCoords(elem) { // кроме IE8-
        let box = elem.getBoundingClientRect();

        return {
            top: box.top + pageYOffset,
            left: box.left + pageXOffset
        };

    }

};
ImageCommentSection.prototype = Object.create(CommentSection.prototype);
ImageCommentSection.prototype.constructor = ImageCommentSection;

ImageCommentSection.prototype.set = function () {
    CommentSection.prototype.set.apply(this, arguments);

    this.infoBoardHeight = this.infoBoard.offsetHeight;
    this.scrollbarOffset.style.height = `${this.infoBoardHeight}px`;
    this.scrollbar.style.height = `calc(100% - ${this.infoBoardHeight}px)`;

    this.sliderSizeRate = this.scrollbar.offsetHeight / this.commentsWrapper.scrollHeight;
    this.scrollbarSlider.style.height = `${this.sliderSizeRate * 100}%`;

    this.scrollbarSlider.classList.remove('image_invisible-scrollbar');
};


module.exports = ImageCommentSection;