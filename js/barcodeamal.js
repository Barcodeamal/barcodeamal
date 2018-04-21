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
    $scope.register = false;
    $scope.switchRegister = function() {
      
      $scope.register = !$scope.register;
    }
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
    $scope.post = function(endpoint, data, callback) {
      $http
        .post(API_BASE_URL + endpoint, data)
        .then(function(resp){return resp.data})
        .then(function(resp){
          if(resp.status){
            callback(resp)
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
  })
  .controller('register', function($scope, $http, $document) {
    $scope.account = {
      id: null,
      fullname: null,
      email: null
    }
    $scope.sebaran = {
      confirm: false,
      title: "",
      description: "",
      media: "",
      latlng: "",
      address: "",
      account: {
        uid: null,
        fullname: null,
        email: null
      }
    }
    $scope.mapUpdate = function(latlng){
      $scope.sebaran.latlng = latlng;
    }
    $scope.geoUpdate = function(address){
      $scope.sebaran.address = address.formatted_address;
    }
    $scope.step = {
      id: 1,
      error: "",
      one: function(){
        $scope.step.id++;
        $scope.sebaran.account.uid = document.getElementById("id").innerText;
        $scope.sebaran.account.fullname = document.getElementById("name").innerText;
        $scope.sebaran.account.email = document.getElementById("email").innerText;
      },
      two: function(){
        $scope.step.id++;
      },
      three: function(){
        $scope.step.id++;
      },
      four: function(){
        $scope.step.id++;
      },
      next: function(){
        $scope.step.id++;
      },
      send: function(){
        $scope.step.next();
        $scope.post('/submission', $scope.sebaran, function(resp){
          if(resp.status !== true){
            $scope.error = resp.message;
          }
        });
      },
      done: function(){
        $scope.register = false;
      },
      upload: function(){
        cloudinary.openUploadWidget({ 
          cloud_name: 'dwiz5w6mk', 
          upload_preset: 'zx3qmvaz'
        }, function(error, result) { 
          if(error === null) {
            $scope.sebaran.media = result[0].url;
            var img = document.getElementById("media");
            img.style.backgroundImage = "url("+result[0].url+")";
          } 
        });
      }
    }
  })

  function onSuccess(googleUser) {
    document.getElementById("id").innerText = googleUser.getBasicProfile().getId();
    document.getElementById("name").innerText = googleUser.getBasicProfile().getName();
    document.getElementById("email").innerText = googleUser.getBasicProfile().getEmail();
    document.getElementById("google-signin").style.display = "none";
    var hidden = document.querySelectorAll('.hide');
    for(i=0;i<hidden.length;i++){
      hidden[i].className = 'show'
    }
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
      document.getElementById('google-signin').remove()
    });
  }
  function onFailure(error) {
    console.log(error);
  }
  function renderButton() {
    gapi.signin2.render('gsign', {
      'scope': 'profile email',
      'width': 240,
      'height': 50,
      'longtitle': true,
      'theme': 'dark',
      'onsuccess': onSuccess,
      'onfailure': onFailure
    });
  }
  var map;
  function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: -6.2349359, lng: 106.7529515},
      zoom: 8
    });

    map.addListener('dragend', function() {
      window.setTimeout(function() {
        var scope = angular.element(document.body).scope();
        scope.$apply(function () {
          scope.mapUpdate(map.getCenter().toUrlValue(12));
        });
        geocoder = new google.maps.Geocoder();
        geocoder.geocode( { 'location': map.getCenter()}, function(results, status) {
          if (status == 'OK') {
            scope.$apply(function () {
              scope.geoUpdate(results[0] || "");
            });
          } else {
            console.log('Geocode was not successful for the following reason: ' + status);
          }
        });
      }, 1000);
    });
  }
