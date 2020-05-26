require.config({
    baseUrl: "javascripts",
    paths: {
        jquery: [
            // 'https://ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min',
            'lib/jquery-min-1.8.2'
        ],
        jqueryui: [
            // 'https://code.jquery.com/ui/1.12.1/jquery-ui.min.js',
            'lib/jquery-ui-min-1.12.1'
        ],
        angular: [
            // https://ajax.googleapis.com/ajax/libs/angularjs/1.7.8/angular.min.js',
            'lib/angular-min-1.7.8'
        ],
        angularRoute: [
            'lib/angular-route-1.7.8'
        ]
    },
    shim: {
        jqueryui: {
            deps: ['jquery']
        },
        angular: {
            deps: ['jquery'],
            exports: 'angular'
        },
        angularRoute: {
            deps: ['angular']
        }
    }
});

// Start the app:
require(['app'], function (app) {
    app.start();
});