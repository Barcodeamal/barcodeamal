const API_BASE_URL = 'https://barcodeamal-api.herokuapp.com'
~
angular
  .module('barcodeamal', [])
  .controller('barcodeamal', function($scope, $http, $document) {
    var bg = [
      'https://images.unsplash.com/photo-1517458047551-6766fa5a9362?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=429b01927f1e5fd769f5e8a0fe8fc954&auto=format&fit=crop&w=1534&q=80',
      'https://images.unsplash.com/photo-1491438590914-bc09fcaaf77a?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=56c7f9756b4386446903856e0fc99dd5&auto=format&fit=crop&w=1500&q=80',
      'https://images.unsplash.com/photo-1426260193283-c4daed7c2024?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=510736e9d9454f5184f4eed1d5b005b0&auto=format&fit=crop&w=1510&q=80',
      'https://images.unsplash.com/photo-1491515554378-d827a5ffcf43?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=8e21494b9c0ec2c66eee8b074741dfc0&auto=format&fit=crop&w=1566&q=80',
      'https://images.unsplash.com/photo-1521446370169-0f10e8a09f8a?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=3e0afab85bbc878109b20b3da77fe1c5&auto=format&fit=crop&w=1502&q=80',
      'https://images.unsplash.com/photo-1490424660416-359912d314b3?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=75849dd2a245dded86c3bfdfdd69d28c&auto=format&fit=crop&w=1500&q=80',

    ]
    $scope.page = {
      template: 'main',
      media: bg[Math.round(Math.random() * 1000) % bg.length]
    }    
    $scope.getCurrentPage = function() {
      return '/pages/' + $scope.page.template + '.html';
    }
    $scope.setBackground = function() {
      return $scope.page.media;
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
  .controller('campaign', function($scope, $http, $document) {
    $scope.info = {}
    $scope.init = function(){
      var img = $document.find('section')[0];
      var path = window.location.pathname.substring(1);
      if(path.indexOf('/') === -1 && path.length == 6){
        $scope.api('/campaign/'+path, function(data){
          $scope.page.template = "info";
          img.style.backgroundImage = "url("+data.media.replace("c_scale,w_512/","")+")";
          $scope.info = data;
        })
      }else if(path.indexOf('page/') === 0){
        $scope.page.template = path.split("/")[1];
        img.style.backgroundImage = "url("+$scope.page.media+")";
      }
    }

    $scope.init();
    console.log($document.find('section'))
  })