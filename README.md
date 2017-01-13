# homebridge-motion-fifo

[Motion](https://motion-project.github.io) camera plugin for [Homebridge](https://github.com/nfarina/homebridge)

## Installation
1.	Install Homebridge using `npm install -g homebridge`
2.	Install this plugin `npm install -g https://github.com/MrsDelish/homebridge-motion-fifo`
3.	Update your configuration file - see below for an example
4.	Make fifo `cd /tmp` and `mkfifo motion-pipe` set rw for all `chmod 777 motion-pipe`
5.	Install and configure [Motion](https://motion-project.github.io) (motion needs to be running)	
6.	If we run motion and and homebridge as different users than what we logged in with, see below.

Add to `~/.motion/motion.conf` or if running as service`/etc/motion/motion.conf` :

```
on_picture_save printf '%f\t%n\t%v\t%i\t%J\t%K\t%L\t%N\t%D\n' > /tmp/motion-pipe
target_dir /tmp
```
`output_pictures first` sensor will trigger at first motion.
`snapshot_interval 0` this can't be on since it will trigger our pipe.

## Configuration
* `accessory`: "MotionFifo"
* `name`: descriptive name of the Motion Sensor service and platform
* `name_motion`: name of MotionDetector service
* `motion_pipe`: path to a [Unix named pipe](https://en.wikipedia.org/wiki/Named_pipe) where motion events are written (will be created if needed, should match output file pipe written to by Motion `on_picture_save`)
* `motion_timeout`: reset the motion detector after this many milliseconds

Example configuration:

```
    "accessories": [
        {
         "accessory": "MotionFifo",
         "name": "Motion Sensor",
         "motion_pipe": "/tmp/motion-pipe",
         "motion_timeout": 5000
        }
    ]
```
Setup if we are running with different users on motion and homebridge:
Be sure the user running motion has write access to your fifo, and the user running homebridge has read access. fifo pipe gets reset on each reboot, so it needs to be fixed after boot.

to check who owns and who has permission:
`cd /tmp`
`ls -la`

For testing we can use motion webadmin, usually on port 8082 (from local machine http://localhost:8082/0/action/snapshot) to make a snapshot and check if motion is triggered.

I use crontab to run a script at boot to fix mine (adding script to /etc/rc.local also works)
first go to home `cd` then
`crontab -e`

add to the end of your file
`@reboot /home/pi/homebridge-fixfifo.sh`

content of my homebridge-fixfifo.sh (set to the user:group running):

```
#!/bin/bash
mkfifo /tmp/motion-pipe
chmod 777 /tmp/motion-pipe
chown pi:motion /tmp/motion-pipe
```
(to make this python script nano homebridge-fixfifo.sh paste, cmd + x , y , enter ) 
it is included with this install `cp /usr/local/lib/node_modules/homebridge-motion-fifo/homebridge-fixfifo.sh ~/`

test the commands so they work without sudo, we probably want to be in the same groups, as the users you choose to chown to.
how to add to group `sudo adduser <username> <groupname> `

remember to set executable
`chmod +x homebridge-fixfifo.sh`


Creates a MotionSensor service.


This is stripped out motion sensor from Homebridge-camera-motion (https://github.com/rxseger/homebridge-camera-motion) orignal code by rxseger.

## License

MIT

