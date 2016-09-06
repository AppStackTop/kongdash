/* global app:true Chart:true */
(function (angular, app, Chart) { 'use strict';

    var controller = 'DashboardController';

    if (typeof app === 'undefined') throw (controller + ': app is undefined');

    Chart.defaults.global.defaultFontColor = '#9db4be';
    Chart.defaults.global.defaultFontStyle = 'bold';

    var createChart = function (container, data) {
        if (typeof data.options === 'undefined') data.options = {responsive: true, scales: {xAxes: [{ticks: {beginAtZero: true}}]}};

        return new Chart (angular.element(container).getContext('2d'), data);
    };

    app.controller(controller, ['$scope', 'ajax', 'toast', 'viewFactory', function ($scope, ajax, toast, viewFactory) {

        viewFactory.title = 'Dashboard';
        viewFactory.prevUrl = null;

        ajax.get({ resource: '/' }).then(function (response) {
            $scope.kongStat = response.data;
            $scope.database = $scope.kongStat.configuration.database;

            createChart('#timersChart', {
                type: 'horizontalBar',
                data: { labels: ['Running', 'Pending'], datasets: [{
                    data: [$scope.kongStat.timers.running, $scope.kongStat.timers.pending],
                    label: 'Timers', backgroundColor:['#10C469', '#FFCE56']
                }] }
            });

        }, function () {
            toast.error('Could not populate data');
        });

        ajax.get({ resource: '/status' }).then(function (response) {
            var server = response.data.server;

            var chartConfig = {
                labels: ['Handled', 'Accepted', 'Active', 'Waiting', 'Reading', 'Writing'],
                data: [server.connections_handled, server.connections_accepted, server.connections_active,
                    server.connections_waiting, server.connections_reading, server.connections_writing],
                backgrounds: ['rgba(24, 138, 226, 0.5)', 'rgba(16, 196, 105, 0.5)', 'rgba(128, 197, 218, 0.5)',
                    'rgba(248, 142, 15, 0.5)', 'rgba(207, 32, 241, 0.5)', 'rgba(91, 105, 188, 0.5)'],
                borders: ['#188AE2', '#10C469', '#80C5DA', '#F88E0F', '#CF20F1', '#5B69BC']
            };

            createChart('#clusterStatChart', {
                type: 'bar',
                data: { labels: ['Handled', 'Accepted', 'Active', 'Waiting', 'Reading', 'Writing'], datasets: [{
                    data: [server.connections_handled, server.connections_accepted, server.connections_active,
                        server.connections_waiting, server.connections_reading, server.connections_writing],
                    backgroundColor: ['rgba(24, 138, 226, 0.5)', 'rgba(16, 196, 105, 0.5)', 'rgba(128, 197, 218, 0.5)',
                        'rgba(248, 142, 15, 0.5)', 'rgba(207, 32, 241, 0.5)', 'rgba(91, 105, 188, 0.5)'],
                    borderColor: ['#188AE2', '#10C469', '#80C5DA', '#F88E0F', '#CF20F1', '#5B69BC'],
                    borderWidth: 1
                }] }
            });

        }, function () {
            toast.error('Could not populate chart data');
        });
    }]);

})(window.angular, app, Chart);