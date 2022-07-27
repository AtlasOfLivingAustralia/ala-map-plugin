// Karma configuration
// Generated on Mon Feb 23 2015 15:47:55 GMT+1100 (AEDT)

module.exports = function (config) {
    config.set({

        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: '',

        plugins: [
            '@metahub/karma-jasmine-jquery',
            'karma-*'
        ],


        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['jquery-3.4.0','jasmine-jquery','jasmine'],

        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {
            'web-app/js/**/*.js': ['coverage']
        },

        // list of files / patterns to load in the browser
        files: [
            'node_modules/underscore/underscore-min.js',
            'node_modules/handlebars/dist/handlebars.min.js',
            'node_modules/leaf/dist/handlebars.min.js',
            'node_modules/leaflet/dist/leaflet.js',
            'node_modules/leaflet-control-geocoder/dist/Control.Geocoder.js',
            'node_modules/leaflet-draw/dist/leaflet.draw.js',
            'node_modules/leaflet-easybutton/src/easy-button.js',
            'node_modules/leaflet-loading/src/Control.Loading.js',
            'node_modules/leaflet-sleep/Leaflet.Sleep.js',
            'node_modules/leaflet.coordinates/dist/Leaflet.Coordinates-0.1.5.min.js',
            'node_modules/leaflet.markercluster/dist/leaflet.markercluster.js',
            'grails-app/assets/javascripts/*.js',
            'grails-app/assets/javascripts/plugins/**/*.js',
            'test/js/specs/**/*.js'
        ],


        // list of files to exclude
        exclude: [],


        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ['progress'
            //, 'coverage'
        ],


        // web server port
        port: 9876,


        // enable / disable colors in the output (reporters and logs)
        colors: true,


        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_DEBUG,


        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,


        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: ['Chrome', "ChromeHeadless"],


        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: true
    });
};
