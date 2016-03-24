// Karma configuration
// Generated on Thu Mar 03 2016 11:54:22 GMT-0500 (EST)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine-jquery', 'jasmine'],


    // list of files / patterns to load in the browser
    files: [
      // using angular from cdn
      'https://ajax.googleapis.com/ajax/libs/angularjs/1.4.8/angular.min.js',
      'http://ajax.googleapis.com/ajax/libs/angularjs/1.4.8/angular-animate.min.js',
      'http://ajax.googleapis.com/ajax/libs/angularjs/1.4.8/angular-aria.min.js',
      'http://ajax.googleapis.com/ajax/libs/angularjs/1.4.8/angular-messages.min.js',
      'http://ajax.googleapis.com/ajax/libs/angular_material/1.0.0/angular-material.min.js',
      'https://cdn.firebase.com/js/client/2.3.2/firebase.js',
      'https://cdn.firebase.com/libs/angularfire/1.1.3/angularfire.min.js',
      'https://cdnjs.cloudflare.com/ajax/libs/angular-ui-router/0.2.13/angular-ui-router.min.js',
      'https://cdnjs.cloudflare.com/ajax/libs/buzz/1.1.0/buzz.min.js',
      '../../node_modules/angular-route/angular-route.js',
      '../../node_modules/angular-mocks/angular-mocks.js',
      '../../app/scripts/app.js',
      '../../app/**/*.js',
      '../../app/**/*.html',
      '../**/*[sS]pec.js'
    ],


    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
        '**/*.html': ['ng-html2js']
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress'],


    // web server port
    port: 3015,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_DEBUG,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity,
    
  })
}
