
enum Location {
    USB,
    //% block="Text over USB"
    USB_TEXT,
    P0,
    P1,
    P2
}

enum NoteName {
    C = 0,
    D = 2,
    E = 4,
    F = 5,
    G = 7,
    A = 9,
    B = 11
}

enum NoteOctave {
    //% block="-1"
    Ominus1,
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
    Cminus1 = NoteName.C + 12,
    Dminus1 = NoteName.D + 12,
    Eminus1 = NoteName.E + 12,
    Fminus1 = NoteName.F + 12,
    Gminus1 = NoteName.G + 12,
    Aminus1 = NoteName.A + 12,
    Bminus1 = NoteName.B + 12,
    C0 = Cminus1 + 12,
    D0 = Cminus1 + 12,
    E0 = Cminus1 + 12,
    F0 = Cminus1 + 12,
    G0 = Cminus1 + 12,
    A0 = Cminus1 + 12,
    B0 = Cminus1 + 12,
    C1 = C0 + 12,
    D1 = D0 + 12,
    E1 = E0 + 12,
    F1 = F0 + 12,
    G1 = G0 + 12,
    A1 = A0 + 12,
    B1 = B0 + 12,
    C2 = C1 + 12,
    D2 = D1 + 12,
    E2 = E1 + 12,
    F2 = F1 + 12,
    G2 = G1 + 12,
    A2 = A1 + 12,
    B2 = B1 + 12,
    C3 = C2 + 12,
    D3 = D2 + 12,
    E3 = E2 + 12,
    F3 = F2 + 12,
    G3 = G2 + 12,
    A3 = A2 + 12,
    B3 = B2 + 12,
    C4 = C3 + 12,
    D4 = D3 + 12,
    E4 = E3 + 12,
    F4 = F3 + 12,
    G4 = G3 + 12,
    A4 = A3 + 12,
    B4 = B3 + 12,
    C5 = C4 + 12,
    D5 = D4 + 12,
    E5 = E4 + 12,
    F5 = F4 + 12,
    G5 = G4 + 12,
    A5 = A4 + 12,
    B5 = B4 + 12,
    C6 = C5 + 12,
    D6 = D5 + 12,
    E6 = E5 + 12,
    F6 = F5 + 12,
    G6 = G5 + 12,
    A6 = A5 + 12,
    B6 = B5 + 12,
    C7 = C6 + 12,
    D7 = D6 + 12,
    E7 = E6 + 12,
    F7 = F6 + 12,
    G7 = G6 + 12,
    A7 = A6 + 12,
    B7 = B6 + 12,
    C8 = C7 + 12,
    D8 = D7 + 12,
    E8 = E7 + 12,
    F8 = F7 + 12,
    G8 = G7 + 12,
    A8 = A7 + 12,
    B8 = B7 + 12,
    C9 = C8 + 12,
    D9 = D8 + 12,
    E9 = E8 + 12,
    F9 = F8 + 12,
    G9 = G8 + 12
}

enum Accidental {
    //% block="##"
    Sharp2 = 2,
    //% block="#"
    Sharp1 = 1,
    //% block=" "
    Natural = 0,
    //% block="b"
    Flat1 = -1,
    //% block="bb"
    Flat2 = -2,
}

enum Foreground {
    //% block="Foreground"
    Y,
    //% block="Background"
    N
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

    function playNotesFunc(controller: midi.MidiController, notes: number[], duration: number) {
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

    //% block="$controller chord $notes duration $duration=device_beat || in $foreground"
    //% expandableArgumentMode="toggle"
    //% inlineInputMode=inline
    export function playChord(controller: midi.MidiController, notes: number[], duration: number, foreground: Foreground = Foreground.Y) {
        if (foreground == Foreground.Y)
            playNotesFunc(controller, notes, duration)
        else
            control.inBackground(() => {
                playNotesFunc(controller, notes, duration)
            })
    }

    //% block="$controller note $note duration $duration=device_beat || in $foreground"
    //% expandableArgumentMode="toggle"
    //% inlineInputMode=inline
    export function playNote(controller: midi.MidiController, note: number, duration: number, foreground: Foreground = Foreground.Y) {
        playChord(controller, [note], duration, foreground)
    }
}
