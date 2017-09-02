const PI = Math.PI;
const POLYGON_PERIOD = 60;
const UNWANTED_ANGLE_RATE = .2;

let canvasWidth = 0;
let canvasHeight = 0;
let canvasCenter;
let startCircleRadius;

let canvas;
let ctx;

function moveTo(point) {
    ctx.moveTo(point.x, point.y);
}

function lineTo(point) {
    ctx.lineTo(point.x, point.y);
}

function getCoords(center, radius, angle) {
    return new Point(center.x + Math.cos(angle) * radius,
        center.y + Math.sin(angle) * radius);
}


function Point(x, y) {
    this.x = x || 0;
    this.y = y || 0;
}


function PassportAnimation(options) {
    canvas = options.canvasElem;
    ctx = canvas.getContext('2d');

    this.beforeNewPolygonLeft = 1;
    this.startAngle = 0;
    this.startAngleSpeed = .01;

    window.requestAnimFrame = (function () {
        return window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function (callback) {
                window.setTimeout(callback, 4);
            };
    })();

    this.polygons = [];
    let self = this;
    // (function animloop(time) {
    //     self.update();
    //     self.draw();
    //     requestAnimFrame(animloop, canvas);
    // })();

    let start = performance.now();
    let UPDATE_TIME = 20;
    (function animloop(time) {
        let timePassed = time - start;
        if (timePassed >= UPDATE_TIME) {
            if (self.isPlaying)
                self.update();
            start = time;
        }
        if (self.isPlaying)
            self.draw();
        requestAnimFrame(animloop, canvas);
    })();
}

PassportAnimation.prototype.init = function (_canvasWidth, _canvasHeight) {
    this.isPlaying = true;

    this.polygons = [];
    this.beforeNewPolygonLeft = 1;

    canvasWidth = _canvasWidth;
    canvasHeight = _canvasHeight;
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    canvasCenter = new Point(canvasWidth / 2, canvasHeight / 2);
    startCircleRadius = Math.min(canvasWidth, canvasHeight);
};

PassportAnimation.prototype.pause = function () {
    this.isPlaying = false;
};

PassportAnimation.prototype.play = function () {
    this.isPlaying = true;
};

PassportAnimation.prototype.clearScreen = function () {
    ctx.save();
    ctx.fillStyle = "#383838";
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    ctx.restore();
};

PassportAnimation.prototype.update = function () {
    this.startAngle += this.startAngleSpeed;
    this.startAngle %= PI * 2;

    this.beforeNewPolygonLeft--;
    if (this.beforeNewPolygonLeft <= 0) {
        this.polygons.push(new Polygon({
            initAngle: this.startAngle
        }));
        this.beforeNewPolygonLeft = POLYGON_PERIOD;
    }

    this.polygons.forEach((polygon, i) => {
        polygon.update();
        if (polygon.isFinished)
            this.polygons.splice(i--, 1);
    });

};

PassportAnimation.prototype.draw = function () {
    this.clearScreen();
    for (let i = this.polygons.length - 1; i >= 0; i--)
        this.polygons[i].draw();
};


function Polygon(options) {

    this.initAngle = (options && options.initAngle) || 0;
    this.vertexCount = (options && options.vertexCount) || 4;

    this.center = canvasCenter;
    this.width = .6;
    this.radius = 0;
    this.endRadius = Math.max(canvasWidth, canvasHeight) * 6;
    this.isFinished = false;
    this.opacity = 0;
    this.opacityVelocity = .001;
    this.maxOpacity = .2;
    this.distRate = 0;

    let globalSpeedRate = .17;
    this.speed = .1 * globalSpeedRate;
    this.acceleration = .08 * globalSpeedRate;
    this.distRateSpeed = .025 * globalSpeedRate;
    this.distRateAcceleration = .01 * globalSpeedRate;
    this.rotationSpeed = .05 * globalSpeedRate;

    this.rotationAngle = Math.random() * PI * 2;

    this.vertexAngles = [];

    for (let i = 0; i < this.vertexCount; i++)
        this.vertexAngles[i] = 2 * PI / this.vertexCount *
            (Math.random() * (1 - 2 * UNWANTED_ANGLE_RATE) + UNWANTED_ANGLE_RATE)
            + 2 * PI / this.vertexCount * i;
}


Polygon.prototype.getVertexCoords = function (angle) {
    return getCoords(new Point(), this.radius, angle);
};

Polygon.prototype.update = function () {

    this.distRate += this.distRateSpeed;
    this.distRateSpeed -= this.distRateSpeed * this.distRateAcceleration;

    this.center = getCoords(canvasCenter, startCircleRadius * (1 - this.distRate), this.initAngle);
    this.radius += this.speed;
    if (this.radius >= this.endRadius) this.isFinished = true;

    this.speed += this.acceleration * this.speed;
    this.width += this.acceleration * this.width;

    this.opacity += this.opacityVelocity;
    if (this.opacity >= this.maxOpacity) this.opacity = this.maxOpacity;

    this.rotationAngle -= this.rotationSpeed;
};

Polygon.prototype.draw = function () {
    ctx.save();

    ctx.strokeStyle = `rgba(255, 255, 255, ${this.opacity})`;
    ctx.lineWidth = this.width;
    ctx.lineJoin = 'mitter';
    ctx.translate(this.center.x, this.center.y);
    ctx.rotate(this.rotationAngle);


    ctx.beginPath();
    moveTo(this.getVertexCoords(this.vertexAngles[0]));
    for (let i = 1; i < this.vertexCount; i++)
        lineTo(this.getVertexCoords(this.vertexAngles[i]));
    lineTo(this.getVertexCoords(this.vertexAngles[0]));
    ctx.closePath();

    ctx.stroke();
    ctx.restore();
};


module.exports = PassportAnimation;