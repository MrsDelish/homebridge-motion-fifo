# homebridge-motion-fifo

[Motion](https://motion-project.github.io) camera plugin for [Homebridge](https://github.com/nfarina/homebridge)

## Installation
1.	Install Homebridge using `npm install -g homebridge`
2.	Install this plugin `npm install -g homebridge-motion-fifo`
3.	Update your configuration file - see below for an example
4.	Install and configure [Motion](https://motion-project.github.io)

Add to your `~/.motion/motion.conf`:

```
on_picture_save printf '%f\t%n\t%v\t%i\t%J\t%K\t%L\t%N\t%D\n' > /tmp/motion-pipe
target_dir /tmp
```

## Configuration
* `accessory`: "CameraMotion"
* `name`: descriptive name of the Camera service and platform
* `name_motion`: name of MotionDetector service
* `motion_pipe`: path to a [Unix named pipe](https://en.wikipedia.org/wiki/Named_pipe) where motion events are written (will be created if needed, should match output file pipe written to by Motion `on_picture_save`)
* `motion_timeout`: reset the motion detector after this many milliseconds

Example configuration:

```
    "Accessories": [
        {
    	"Accessory": "MotionFifo",
		"name": "Motion Sensor",
		"motion_pipe": "/tmp/motion-pipe",
		"motion_timeout": 5000
        }
    ]
```

Creates a MotionSensor service.


This is stripped out motion sensor from Homebridge-camera-motion (https://github.com/rxseger/homebridge-camera-motion) orignal code by rxseger.

## License

MIT

