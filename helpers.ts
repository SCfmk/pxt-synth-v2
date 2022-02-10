/**
* blocks that make life easier
*/


let helperNoteFreq: number[] = [131, 139, 147, 156, 165, 175, 185, 196, 208, 220, 233, 247, 262, 277, 294, 311, 330, 349, 370, 392, 415, 440, 466, 494, 523, 555, 587, 622, 659, 698, 740, 784, 831, 880, 932, 988]

let synthIsRunningInSimulator = true
if (pins.digitalReadPin(DigitalPin.P20)) {
    synthIsRunningInSimulator = false
}

enum sequences {
    //%block="sequence one"
    sequenceOne = 81,
    //%block="sequence two"
    sequenceTwo = 82,
    //%block="sequence three"
    sequenceThree = 83,
    //%block="sequence four"
    sequenceFour = 84
}


enum transpositions {
    //% block="same as oscillator 1"
    same = 0,
    //% block="+2 octaves"
    plus2 = 2,
    //% block="+1 octave"
    plus1 = 1,
    //% block="-1 octave"
    minus1 = 3,
    //% block="-2 octaves"
    minus2 = 4,
    //% block="+ fifth"
    fifth = 5,
}

enum oscShapes {
    //% block="Saw"
    saw = 0,
    //% block="Pulse"
    pulse = 1,
    //% block="Triangle"
    triangle = 2,
}

/**
 * Custom blocks
 */
//% weight=100 color=#0fbc11 icon=""

namespace synthBlocks {
    /**
     * import preset string
     */

    //% blockID="importPresetString" block="import preset $preset|string $presetString"
    export function importPresetString(preset: SynthPreset, presetString: string) {
        let myString = presetString
        myString = myString.replace(' ', '')
        myString = myString.replace('{', '')
        myString = myString.replace('}', '')
        let splittedString = myString.split(",")

        ///////
        splittedString.splice(9, 1); // remove filterType 
        ///////

        for (let i = 0; i < splittedString.length; i++) {
            let thisParamVal = 0
            console.log(splittedString[i])
            let currentParamString = splittedString[i]
            if (currentParamString.includes("Saw")) {
                console.log("caught saw")
            } else if (currentParamString.includes("Pulse")) {
                console.log("caught pulse")
            } else if (currentParamString.includes("Triangle")) {
                console.log("caught triangle")
            } else if (currentParamString.includes("LPF")) {
                console.log("caught filtertype subtracting 1 from i")
            } else {
                thisParamVal = parseFloat(splittedString[i])
            }
            console.log("parameter " + i + " is " + thisParamVal)

            orchestra.setParameter(preset, i, thisParamVal)

        }
    }

    /**

     */

    //% block="play note $note|duration $duration|velocity $velocity|sound $voice"
    //% note.shadow="device_note"
    //% velocity.defl=127
    //% duration.defl=200
    export function playSynthNote(note: number, duration: number, velocity: number, voice: SynthPreset): void {
        console.log(note)
        if (synthIsRunningInSimulator) {
            music.playTone(note, duration)
            //music.playTone(noteFreq[note % noteFreq.length], duration)
        } else {
            for (let i = 0; i < helperNoteFreq.length; i++) {
                //let noteNumber = 440 * (pow(2, (i - 69) / 12)


                if (helperNoteFreq[i] == note) {
                    orchestra.note(i + 48, duration, velocity, voice)
                    console.log("used voice" + voice)
                }
            }
        }
    }


    //%block="start parallell| $seqSelex"
    export function startParallelSequence(seqSelex: sequences): void {
        control.raiseEvent(seqSelex, 1337)
    }

    //%block="setup parallell| $seqSelex"
    export function parallellSequence(seqSelex: sequences, thing: () => void) {
        control.onEvent(seqSelex, 1337, thing);
    }

    /**
     * setup your synth sound
     * @param preset select your preset
     */
    //blockId="MBORCH_makeASimplerSequencer" block="make a simple sequencer:|number of steps = $NumberOfSteps|the instrument I am controlling is called $masterName the first sound I want to control is $note1|the second sound I want to control is $note2|the third sound I want to control is $note3|the fourth sound I want to control is $note4"
    //% blockID="setupSynthSound" block="Set sound for Preset $preset | Oscillator 1|shape $osc1Shape|level $myOsc1Gain|pulse width $myPW1|pulse width modulation $myPWM1 | Oscillator 2|shape $osc2Shape|level $myOsc2Gain|pulse width $myPW2|pulse width modulation $myPWM2|transposition $osc2Transpose | Filter|cutoff $filtCut|resonance $filtRes|envelope amount $filtEnv|key follow amount $filtKey|LFO amount $filtLFO | Envelope|Attack $myEnvA|Decay $myEnvD|Sustain $myEnvS|Release $myEnvR | LFO frequency in Hz $myLfoFreq|LFO shape $myLFOShape|vibrato frequency in Hz $myVibFreq|vibrato amount $myVibAmount|FM amount $myFMAmount | sound volume $myLevel"
    //% myOsc1Gain.min=0 myOsc1Gain.max=100
    //% myOsc1Gain.defl=50
    //% myOsc2Gain.min=0 myOsc2Gain.max=100
    //% myOsc2Gain.defl=50
    //% myPW1.min=0 myPW1.max=100
    //% myPW1.defl=50
    //% myPWM1.min=0 myPWM1.max=100
    //% myPW2.min=0 myPW2.max=100
    //% myPW2.defl=50
    //% myPWM2.min=0 myPWM2.max=100
    //% filtCut.min=0 filtCut.max=100
    //% filtCut.defl=100
    //% filtRes.min=0 filtRes.max=100
    //% filtEnv.min=0 filtEnv.max=100
    //% filtEnv.defl=30
    //% filtKey.min=0 filtKey.max=100
    //% filtLFO.min=0 filtLFO.max=100 
    //% myEnvA.min=0 myEnvA.max=100 
    //% myEnvA.defl=0
    //% myEnvD.min=0 myEnvD.max=100
    //% myEnvD.defl=20
    //% myEnvS.min=0 myEnvS.max=100
    //% myEnvS.defl=50
    //% myEnvR.min=0 myEnvR.max=100 
    //% myEnvR.defl=60
    //% myLevel.min=0 myLevel.max=100
    //% myLevel.defl=80
    //% LFOFreq.defl = 1 

    export function setupSound(preset: SynthPreset, osc1Shape: oscShapes, osc2Shape: oscShapes, myOsc1Gain: number, myOsc2Gain: number, osc2Transpose: transpositions, myPW1: number, myPWM1: number, myPW2: number, myPWM2: number, filtCut: number, filtRes: number, filtEnv: number, filtKey: number, filtLFO: number, myEnvA: number, myEnvD: number, myEnvS: number, myEnvR: number, myLfoFreq: number, myVibFreq: number, myVibAmount: number, myLevel: number, myLFOShape: oscShapes, myFMAmount: number): void {
        orchestra.setParameter(preset, SynthParameter.Osc1Shape, osc1Shape)
        orchestra.setParameter(preset, SynthParameter.Osc2Shape, osc2Shape)
        let myOsc2Transpose = 0
        switch (osc2Transpose) {
            case 0:
                myOsc2Transpose = 1
                break

            case 2:
                myOsc2Transpose = 4
                break

            case 1:
                myOsc2Transpose = 2
                break

            case 3:
                myOsc2Transpose = 0.5
                break

            case 4:
                myOsc2Transpose = 0.25
                break

            case 5:
                myOsc2Transpose = 1.5
                break
        }
        orchestra.setParameter(preset, SynthParameter.Osc2Transpose, myOsc2Transpose)
        orchestra.setParameter(preset, SynthParameter.Osc1Gain, pins.map(myOsc1Gain, 0, 100, 0, 1))
        orchestra.setParameter(preset, SynthParameter.Osc2Gain, pins.map(myOsc2Gain, 0, 100, 0, 1))
        orchestra.setParameter(preset, SynthParameter.Cutoff, pins.map(filtCut, 0, 100, 0, 1))
        orchestra.setParameter(preset, SynthParameter.Resonance, pins.map(filtRes, 0, 100, 0, 1))
        orchestra.setParameter(preset, SynthParameter.FilterEnvAmount, pins.map(filtEnv, 0, 100, 0, 1))
        orchestra.setParameter(preset, SynthParameter.EnvAttackTime, pins.map(myEnvA, 0, 100, 0, 1))
        orchestra.setParameter(preset, SynthParameter.EnvDecayTime, pins.map(myEnvD, 0, 100, 0, 1))
        orchestra.setParameter(preset, SynthParameter.EnvSustainLevel, pins.map(myEnvS, 0, 100, 0, 1))
        orchestra.setParameter(preset, SynthParameter.EnvRelease, pins.map(myEnvR, 0, 100, 0, 1))
        orchestra.setParameter(preset, SynthParameter.Gain, pins.map(myLevel, 0, 100, 0, 1))
        orchestra.setParameter(preset, SynthParameter.FilterKeyFollow, pins.map(filtKey, 0, 100, 0, 1))
        orchestra.setParameter(preset, SynthParameter.FilterLfoAmount, pins.map(filtLFO, 0, 100, 0, 1))
        orchestra.setParameter(preset, SynthParameter.LFOFreq, pins.map(myLfoFreq, 0, 100, 0, 10))
        orchestra.setParameter(preset, SynthParameter.Osc1Pw, pins.map(myPW1, 0, 100, -1, 1))
        orchestra.setParameter(preset, SynthParameter.Osc2Pw, pins.map(myPW2, 0, 100, -1, 1))
        orchestra.setParameter(preset, SynthParameter.Osc1Pwm, pins.map(myPWM1, 0, 100, 0, 1))
        orchestra.setParameter(preset, SynthParameter.Osc2Pwm, pins.map(myPWM2, 0, 100, 0, 1))
        orchestra.setParameter(preset, SynthParameter.VibratoAmount, pins.map(myVibAmount, 0, 100, 0, 1))
        orchestra.setParameter(preset, SynthParameter.VibratoFreq, pins.map(myVibFreq, 0, 100, 0, 10))
        orchestra.setParameter(preset, SynthParameter.LFOShape, myLFOShape)
        orchestra.setParameter(preset, SynthParameter.OscFm, myFMAmount)
    }

}

