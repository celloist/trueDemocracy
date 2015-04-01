/**
 * @author Alhric Lacle <alhriclacle@gmail.com>
 * @project TrueDemocracy
 * @created 01-Apr-15 8:48 PM
 */

angular.module('ngCordova.plugins.vibration', [])

    .factory('$cordovaVibration', [function () {

        return {
            vibrate: function (times) {
                return navigator.notification.vibrate(times);
            },
            vibrateWithPattern: function (pattern, repeat) {
                return navigator.notification.vibrateWithPattern(pattern, repeat);
            },
            cancelVibration: function () {
                return navigator.notification.cancelVibration();
            }
        };
    }]);