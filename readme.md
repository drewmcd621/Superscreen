#### Superscreen

Superscreen is a server which co-ordinates the transfer of "particles" between multiple applications.  It is designed for multi screen displays that can interact in some way with each other.

This project inspired by the [Exquisite Donut](https://github.com/workergnome/exquisite_donut)

A demo can be found at [superscreen.flyingkiwibird.com](http://superscreen.flyingkiwibird.com/)

### API

The server uses an JSON based API to inform other screen applications of particle transfers.

##  Register

Register a screen in the display

URL: /api/register

Params:

* name - a name for this screen
* x - the x co-ordinate of this screen
* y - the y co-ordinate of this screen
(e.g. if this is the top-left most screen x = 0, y = 0)
* callbback - a URL this screen will listen to for particle transfers

## Transmit

Transmit a partical from this screen to another one

URL : /api/transmit

* to - the relative destination (**U** p, **D** own, **L** eft, **R** ight)
* channel - Channel is a way to distinguish two different displays using the same superscreen setup (e.g. as the demo is on the internet it uses the channel so multiple people can view the demo correctly at the same time)
* left - distance from left of the screen / total screen width [0-1]
* right - distance from top of the screen / total screen height [0-1]
* xspeed - Speed in X direction (% of horizontal screen / s)
* yspeed - Speed in Y direction (% of vertical screen / s)
* xaccel - Acceleration in the X direction (% of horizontal screen / s^2)
* yaccel - Acceleration in the Y direction (% of vertical screen / s^2)
* info - JSON structured data to be passed between screens with the item, can be anything really

## Start

Starts a fresh superscreen display (i.e. truncates the screen table)

URL: /api/start

### Improvements / TODO

* Implement a "pooling" method for transmission rather than callback (although callback is strictly better)
* Allow for multiple superscreen display sets handled by a single server
