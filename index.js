'use strict';

const fs = require('fs');
const FIFO = require('fifo-js');
const spawn = require('child_process').spawn;

let Service, Characteristic, Accessory;

module.exports = (homebridge) => {
  Service = homebridge.hap.Service;
  Characteristic = homebridge.hap.Characteristic;
 // uuid = homebridge.hap.uuid;
 // StreamController = homebridge.hap.StreamController;
  Accessory = homebridge.platformAccessory;
 // hap = homebridge.hap;

  homebridge.registerAccessory('homebridge-motion-fifo', 'MotionFifo', MotionFifoAccessory, true);
};

// An accessory with a MotionSensor service
class MotionFifoAccessory
{
  constructor(log, config, api) {
    log(`MotionFifo accessory starting`);
    this.log = log;
    this.api = api;
    
    config = config || {};
    this.name = config.name || 'Motion Detector';
    this.pipePath = config.motion_pipe || '/tmp/motion-pipe';
    this.timeout = config.motion_timeout !== undefined ? config.motion_timeout : 5000;

    this.pipe = new FIFO(this.pipePath);
    this.pipe.setReader(this.onPipeRead.bind(this));

    this.motionService = new Service.MotionSensor(this.name);
    this.setMotion(false);
  }

  setMotion(detected) {
    this.motionService
      .getCharacteristic(Characteristic.MotionDetected)
      .setValue(detected);
  }

  onPipeRead(text) {
    console.log(`got from pipe: |${text}|`);
    // on_picture_save printf '%f\t%n\t%v\t%i\t%J\t%K\t%L\t%N\t%D\n' > /tmp/camera-pipe
    // http://htmlpreview.github.io/?https://github.com/Motion-Project/motion/blob/master/motion_guide.html#conversion_specifiers
    // %f filename with full path
    // %n number indicating filetype
    // %v event
    // %i width of motion area
    // %J height of motion area
    // %K X coordinates of motion center
    // %L Y coordinates of motion center
    // %N noise level
    // %D changed pixels
    const [filename, filetype, event, width, height, x, y, noise, dpixels] = text.trim().split('\t');
    console.log('filename is',filename);

    this.setMotion(true);

    setTimeout(() => this.setMotion(false), this.timeout); // TODO: is this how this works?
  }

  getServices() {
    return [this.motionService];
  }
}



