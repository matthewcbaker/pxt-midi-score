
enum NoteName {
    C1,
    D1
}

/**
 * Musical Score
 */
//% weight=84 icon="\uf039" color="#5ea9dd"
namespace score {
    //% block="score key"
    export function setKey() {

    }

    //% block="$name"
    export function note(name: NoteName): number {
        return 60
    }
}
