'use strict';

//var fs = require('fs');
var  FIFO = require('fifo-js');
//var spawn = require('child_process').spawn;

var Service, Characteristic, Accessory;

module.exports = function(homebridge) {
  Service = homebridge.hap.Service;
  Characteristic = homebridge.hap.Characteristic;
 // uuid = homebridge.hap.uuid;
 // StreamController = homebridge.hap.StreamController;
  Accessory = homebridge.platformAccessory;
 // hap = homebridge.hap;

  homebridge.registerAccessory('homebridge-motion-fifo', 'MotionFifo', MotionFifoAccessory);
}

function MotionFifoAccessory(log,config) {

    this.log = log;
//    this.api = api;
  log(`MotionFifo accessory starting`);
//     config = config;
  //  if (!config) return;

    this.name = config.name || 'Motion Detector';
    this.pipePath = config.motion_pipe || '/tmp/motion-pipe';
    this.timeout = config.motion_timeout !== undefined ? config.motion_timeout : 5000;

    this.pipe = new FIFO(this.pipePath);
    this.pipe.setReader(this.onPipeRead.bind(this));

    this.motionService = new Service.MotionSensor(this.name);
    this.setMotion(false);
}
MotionFifoAccessory.prototype - {

  setMotion: function(detected){
    this.motionService
      .getCharacteristic(Characteristic.MotionDetected)
      .setValue(detected);
  },

  onPipeRead: function(text) {
        this.setMotion(true);

    setTimeout(() => this.setMotion(false), this.timeout); // TODO: is this how this works?
   }.bind(this),

 // getServices: function() {
 //   return [this.motionService];
 // }
};
