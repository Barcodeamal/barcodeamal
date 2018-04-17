const API_BASE_URL = 'http://localhost:5000'
~
angular
  .module('barcodeamal', [])
  .controller('barcodeamal', function($scope, $http) {
    $scope.page = 'main';
    $scope.getCurrentPage = function() {
      return '/pages/' + $scope.page + '.html';
    }
    $scope.app = {
      title: 'Barcodeamal',
      subTitle: 'Platform kotak amal digital'
    }
    $scope.list = [];
    $scope.api = function(endpoint, callback) {
      $http
        .get(API_BASE_URL + endpoint)
        .then(function(resp){return resp.data})
        .then(function(resp){
          if(resp.status){
            callback(resp.data)
          }else{
            console.log("ERROR: ", resp.message);
          }
        })
    }

    $scope.api('/campaigns', function(data){
      $scope.list = data;
    })
  })
  .controller('campaign', function($scope, $http) {
    $scope.info = {}
    $scope.init = function(){
      var path = window.location.pathname.substring(1);
      if(path.indexOf('/') === -1){
        $scope.api('/campaign/'+path, function(data){
          console.log(data);  
          $scope.info = data;
        })
      }
    }

    $scope.init();
  })