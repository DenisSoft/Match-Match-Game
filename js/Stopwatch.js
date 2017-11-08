class Stopwatch {
    constructor(display) {
        this.running = false;
        this.display = display;
        this.reset();
        this.print(this.times);
    }

    reset() {
        this.times = [ 0, 0, 0, 0 ];
    }

    pause() {
        this.running ? this.stop() : this.start();
    }

    start() {
        if (!this.time) this.time = performance.now();
        if (!this.running) {
            this.running = true;
            requestAnimationFrame(this.step.bind(this));
        }
    }

    stop() {
        this.running = false;
        this.time = null;
    }

    restart() {
        if (!this.time) this.time = performance.now();
        if (!this.running) {
            this.running = true;
            requestAnimationFrame(this.step.bind(this));
        }
        this.reset();
    }

    clear() {
        clearChildren(this.results);
    }

    step(timestamp) {
        if (!this.running) return;
        this.calculate(timestamp);
        this.time = timestamp;
        this.print();
        requestAnimationFrame(this.step.bind(this));
    }

    calculate(timestamp) {
        let diff = timestamp - this.time;
        this.times[3] += diff / 10;
        if (this.times[3] >= 100) {
            this.times[2] += 1;
            this.times[3] -= 100;
        }
        if (this.times[2] >= 60) {
            this.times[1] += 1;
            this.times[2] -= 60;
        }
        if (this.times[1] >= 60) {
            this.times[0] += 1;
            this.times[1] -= 60;
        }
        if (this.times[0] >= 24) {
            this.reset();
        }
    }

    print() {
        this.display.innerText = Stopwatch.format(this.times);
    }

    static format(times) {
        return pad0(times[0], 2) +':' +pad0(times[1], 2)+':' +pad0(times[2], 2);
    }
}

function pad0(value, count) {
    let result = value.toString();
    for (; result.length < count; --count)
        result = '0' + result;
    return result;
}
