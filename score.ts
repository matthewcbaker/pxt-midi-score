
enum Location {
    USB,
    //% block="Text over USB"
    USB_TEXT,
    P0,
    P1,
    P2
}

enum NoteName {
    C,
    //% block="C#"
    Cs,
    D,
    E,
    F,
    G,
    A,
    B
}

enum NoteOctave {
    //% block="-1"
    Om1,
    //% block="0"
    O0,
    //% block="1"
    O1,
    //% block="2"
    O2,
    //% block="3"
    O3,
    //% block="4"
    O4,
    //% block="5"
    O5,
    //% block="6"
    O6,
    //% block="7"
    O7,
    //% block="8"
    O8,
    //% block="9"
    O9
}

enum NoteNameOctave {
    G2 = 43,
    A2 = 45,
    A3 = 57,
    C4 = 60,
    //% block="C#4"
    Cs4,
    D4,
    E4,
    F4,
    G4,
    A4 = 69,
    B4,
    C5 = 72,
    //% block="C#5"
    Cs5,
    D5,
    E5 = 76,
    F5,
    G5,
    A5,
    B5
}

/**
 * Musical Score
 */
//% weight=84 icon="\uf039" color="#5ea9dd"
namespace score {
    //% block="score send midi to $location"
    export function use(location: Location) {
        if (location == Location.USB_TEXT) {
            midi.useSerial()
            return
        } else if (location == Location.USB) {
            midi.useRawSerial()
            return
        }
        let pin = SerialPin.P0
        if (location == Location.P1)
            pin = SerialPin.P1
        else if (location == Location.P2)
            pin = SerialPin.P2
        serial.redirect(pin, pin, BaudRate.BaudRate31250)
        midi.useRawSerial()
    }

    //% block="score key"
    export function setKey() {

    }

    function convertNoteToKey(note: number): number {
        if (note == 24 || note == 36 || note == 48 || note == 60 || note == 72) {
            return note + 1
        } else if (note == 29 || note == 41 || note == 53 || note == 65 || note == 77) {
            return note + 1
        } else {
            return note
        }
    }

    function convertNotesToKey(notes: number[]): number[] {
        let ret: number[] = []
        for (let note of notes) {
            ret.push(convertNoteToKey(note))
        }
        return ret
    }

    //% block="$name"
    export function note(name: NoteNameOctave): number {
        return convertNoteToKey(name)
    }

    //% block="name2 $name $octave"
    //% octave.min=-1 octave.max=9 octave.defl=4
    export function note2(name: NoteName, octave: number): number {
        return 60
    }

    //% block="name3 $name $octave"
    //% octave.defl=O4
    export function note3(name: NoteName, octave: NoteOctave): number {
        return 60
    }

    //% block="$controller notes $notes duration $duration=device_beat"
    export function playNotes(controller: midi.MidiController, notes: number[], duration: number) {
        if (duration > 0) {
            for (let note of notes) {
                controller.noteOn(note)
            }
            basic.pause(duration);
        }
        for (let note of notes) {
            controller.noteOff(note);
        }
        basic.pause(6);
    }
}
