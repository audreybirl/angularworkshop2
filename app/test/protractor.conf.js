'use strict';

var _ = require('lodash'),
    argv = require('yargs').argv,
    logger = require('log4js').getLogger(),
   // PropertyLoader = require('../test/properties/PropertyLoader'),
    HtmlScreenshotReporter = require('protractor-jasmine2-screenshot-reporter'),
    configDir = '',
    SELENIUM_STANDALONE_JAR = '../node_modules/aopui-common/node_modules/protractor/selenium/selenium-server-standalone-2.47.1.jar',
    GRID_URL = 'http://m-qa-aopseleniummaster-01.aol.com:4444/wd/hub',
    options,
    mock = {},
    dirName = '';

 function getConfig () {
    
    var config = {
        // Really only useful locally (because it needs chrome/firefox)
        seleniumAddress:  'http://127.0.0.1:4444/wd/hub',
        framework: 'jasmine2',
        jasmineNodeOpts: {
            showColors: true,
            defaultTimeoutInterval: 180000,
            isVerbose: true,
            includeStackTrace: true
        },
        capabilities: {
            browserName: 'chrome' // argv.browser || 'firefox'
        },
        allScriptsTimeout: 30000
    };

    options = options || {};

    if (argv.grid) {
        logger.info('Using Selenium grid:', GRID_URL);
        config.capabilities.seleniumAddress = GRID_URL;
    } else {
        logger.info('Using Selenium standalone server');
        config.seleniumServerJar = SELENIUM_STANDALONE_JAR;
    }

    if (argv.parallel) {
        logger.info('Running', argv.parallel, 'threads in parallel');
        _.assign(config.capabilities, {
            maxInstances: argv.parallel,
            shardTestFiles: true
        });
    }

   // _.assign(config, PropertyLoader.properties());
    config.baseUrl = argv.baseUrl || config.baseUrl;
    logger.info('Running tests against', config.baseUrl);

    function setupReporter(prefix) {
        var jasmineReporters = require('jasmine-reporters');
        jasmine.getEnv().addReporter(new jasmineReporters.JUnitXmlReporter({
            consolidateAll: false,
            savePath: 'test-results',
            modifySuiteName: function(generatedSuiteName) {
                return (prefix ? prefix + '.' : '') + generatedSuiteName;
            }
        }));
        jasmine.getEnv().addReporter(new HtmlScreenshotReporter({
            captureOnlyFailedSpecs: true,
            reportOnlyFailedSpecs: true,
            browserName: config.capabilities.browserName,
            dest: 'test-results/screenshots'
        }));
    }

    if (argv.useMocks) {
        logger.info('Using Protractor mocks');
        config.mocks = {
            dir: './functional/mocks',
            default: options.defaultMocks || []
        };
        config.onPrepare = function() {
            setupReporter('functional');

            mock.config = {
                rootDirectory: dirName,
                protractorConfig: 'protractor.conf.js'
            };
        };
    } else {
        logger.info('Using real data');

        config.onPrepare = function() {
            setupReporter('smoke');
        };
    }

    return config;
};

exports.config = getConfig();
