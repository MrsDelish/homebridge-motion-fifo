#!/bin/bash
mkfifo /tmp/motion-pipe
chmod 777 /tmp/motion-pipe
chown homebridge:motion /tmp/motion-pipe
