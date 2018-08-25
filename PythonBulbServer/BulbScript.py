# coding: utf-8
import socket
from yeelight import Bulb
from yeelight import discover_bulbs
import sys
ip = "192.168.0.23"
bulb = Bulb(ip)

#possible command : set on|off
command = sys.argv[1]
key = command.split(' ')[0]
try:
    if key == 'set':
        arg = command.split(' ')[1]
        if arg == 'on':
            bulb.turn_on()
        elif arg == 'off':
            bulb.turn_off()
    print("success")
except Exception as e:
    print("error")