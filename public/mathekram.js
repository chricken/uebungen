
'use strict';

let mathekram = {
    zufallErzeugen(min, max) {
        return Math.random() * (max - min + 1) + min;
    },
    zufallFarbeErzeugen({
        hue = [0, 360],
        sat = [0, 100],
        val = [0, 100]
    } = {}) {
        return `hsl(${this.zufallErzeugen(...hue)},${this.zufallErzeugen(...sat)}%,${this.zufallErzeugen(...val)}%)`
    }
}
export default mathekram;