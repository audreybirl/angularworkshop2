(function() {
    'use strict';

    angular
        .module('SampleApp.features.userdetails')
        .controller('UserdetailsController', UserdetailsController);

    UserdetailsController.$inject = ['$scope', 'userdetailsRestService'];
    function UserdetailsController($scope, userdetailsRestService) {
        var vm = this;

        vm.saveuser = {
            firstname: '',
            lasttname: '',
            email: '',
            groupId: ''
        };

        vm.totalUsers = 0;
        vm.groupCounts = [];

        vm.getPercentage = function (val) {
            return ((val / vm.totalUsers) * 100);
        };

        vm.getGroupNumber = function (type) {
            var val = 0,
                group = _.filter(vm.groupCounts, { type : type });

            if (group[0] && group[0].count) {
                val = group[0].count;
            }

            return val;
        };

        vm.getCount = function (type, users) {
            var filteredUsers = _.filter(users, function (user) { 
                return user.groupname === type; 
            });

            return filteredUsers.length;
        };

        vm.saveUserToGroup = function () {

            userdetailsRestService.saveUserToGroup(vm.saveuser).
                then(function (results) {
                    $scope.user = results;
                    vm.user = results;
                    vm.getAllUsers();
                });
        };

        vm.getAllUsers = function () {
            userdetailsRestService.getTestData().
                then(function (users) {
                    $scope.user = users;
                    vm.users = users;
                    vm.totalUsers = users.length;

                    userdetailsRestService.getGroups().
                        then(function (results) {
                            $scope.user = results;
                            vm.groups = results;
                                
                            _.forEach(vm.users, function(user, key) {
                                user.groupname = vm.getGroup(user.groupId);
                            });

                            _.forEach(vm.groups, function(group, key) {
                                var gname = group.name;
               
                                vm.groupCounts.push({
                                    type: gname,
                                    count: vm.getCount(gname, vm.users),
                                    groupNo: vm.getGroupNumber(gname),
                                    percent: vm.getPercentage(vm.getGroupNumber(gname))
                                });
                                    
                                group.percent = vm.getPercentage(vm.getCount(gname, vm.users));
                                group.groupNo = vm.getCount(gname, vm.users);
                            });
                        });
                    });
        };

        vm.getGroup = function (id) {

            if(vm.groups[_.findKey(vm.groups, function(o) { return o.id === id; })]) {
                return vm.groups[_.findKey(vm.groups, function(o) { return o.id === id; })].name;
            }

            return '';
        };

        vm.getAllUsers();
        
        userdetailsRestService.getGroups().
            then(function (results) {
                $scope.user = results;
                vm.groups = results;
            });
    }

}());