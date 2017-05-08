'use strict';

angular.module("surfApp", ['ui.router', 'ui.bootstrap', 'ngStorage', 'uiGmapgoogle-maps']).config(["$stateProvider", "$urlRouterProvider", "uiGmapGoogleMapApiProvider", function ($stateProvider, $urlRouterProvider, uiGmapGoogleMapApiProvider) {

    uiGmapGoogleMapApiProvider.configure({
        key: "AIzaSyDSLhJj8LaJItWbZCac0UbkF2b809zK7LE",
        v: "3.26",
        libraries: "weather, geometry, visualization"
    });

    $stateProvider.state({
        name: 'home',
        url: '/home',
        templateUrl: './app/routes/home/homeTmp.html',
        controller: 'homeCtrl'
    }).state({
        name: 'about',
        url: '/about',
        templateUrl: './app/routes/about/aboutTmp.html'
    }).state({
        name: 'gears',
        url: '/surfgear',
        templateUrl: './app/routes/gears/gearsTmp.html',
        controller: 'gearsCtrl'
    }).state({
        name: 'gearsDetails',
        url: '/surf-gears-details/:id',
        templateUrl: './app/routes/gears/gearsDetails.html',
        controller: "gearsCtrl"
    }).state({
        name: 'surfboards',
        url: '/surfboards',
        templateUrl: './app/routes/Surfboards/surfboards.html',
        controller: 'surfboardsCtrl'
    }).state({
        name: 'surfboardsDetails',
        url: '/surfboardsDetails/:id',
        templateUrl: './app/routes/Surfboards/surfboardsDetails.html',
        controller: 'surfboardsCtrl'
    }).state({
        name: 'photos',
        url: '/photos',
        templateUrl: './app/routes/photos/photosTmp.html',
        controller: 'photosCtrl'
    }).state({
        name: 'weather',
        url: "/weather",
        templateUrl: "./app/routes/weather/weatherTmp.html"
    }).state({
        name: 'spots',
        url: '/spots',
        templateUrl: './app/routes/spots/spotsTmp.html',
        controller: 'apiCtrl'

    });

    $urlRouterProvider.otherwise('/home');
}]);
"use strict";

angular.module('surfApp').controller("apiCtrl", ["$scope", "apiService", "$localStorage", "uiGmapGoogleMapApi", function ($scope, apiService, $localStorage, uiGmapGoogleMapApi) {

    $scope.test = "apiCtrl is working!";

    $scope.getSpot = apiService.getSpotLocation().then(function (response) {
        //console.log(response)
        $scope.spotsInfo = response;

        function makeMarkers(arr) {
            var markerArr = [];
            var obj = {};
            for (var i = 0; i < arr.length; i++) {

                obj = {
                    "id": arr[i].spot_id,
                    "coords": {
                        "latitude": arr[i].latitude,
                        "longitude": arr[i].longitude
                    },
                    "window": {
                        "title": arr[i].spot_name
                    }

                };
                markerArr.push(obj);
            }
            return markerArr;
        }

        $scope.markers = makeMarkers($scope.spotsInfo);
    });

    $scope.tide = apiService.getTideInfo().then(function (response) {
        //console.log(response);
        $scope.tideInfo = response;
    });

    $scope.waterTemp = apiService.getWaterTemp().then(function (response) {
        //console.log(response);
        $scope.waterInfo = response;
    });
    $scope.wind = apiService.getWindInfo().then(function (response) {
        //console.log(response);
        $scope.windInfo = response;
    });

    $scope.getWeather = apiService.getWeatherConditions(33.544, -117.792).then(function (response) {
        //console.log(response);
        $scope.weatherInfo = response;
    });

    uiGmapGoogleMapApi.then(function (resolve) {
        return resolve;
    });

    $scope.map = {

        center: {
            latitude: 33.5447656,
            longitude: -117.7928061
        },
        zoom: 10
    };
}]);
"use strict";

angular.module('surfApp').service("apiService", ["$http", function ($http) {

    var key = "ddd1d54b7122ff6ca4dbae6b606df1ba";

    this.getSpotLocation = function () {
        return $http.get("http://api.spitcast.com/api/county/spots/orange-county/").then(function (response) {
            return response.data;
        });
    };

    this.getTideInfo = function () {
        return $http.get('http://api.spitcast.com/api/county/tide/orange-county/').then(function (response) {
            return response.data;
        });
    };

    this.getWaterTemp = function () {
        return $http.get('http://api.spitcast.com/api/county/water-temperature/orange-county/').then(function (response) {
            return response.data;
        });
    };

    this.getWindInfo = function () {
        return $http.get("http://api.spitcast.com/api/county/wind/orange-county/").then(function (response) {
            return response.data;
        });
    };

    this.getWeatherConditions = function (lat, lon) {

        return $http.get('http://api.openweathermap.org/data/2.5/weather?lat=' + lat + '&' + 'lon=' + lon + '&appid=' + key + '&units=imperial').then(function (response) {
            return response.data;
        });
    };
}]);
'use strict';

angular.module('surfApp').directive('apiDirective', function () {

    return {
        restrict: "E",
        templateUrl: "app/directives/apiDirectives/apiTmp.html",
        controller: "apiCtrl"

    };
});
'use strict';

angular.module('surfApp').directive('tideDirective', function () {

    //not using this one yet

    return {
        restrict: "E",
        TemplateUrl: './app/directives/apiDirectives/tideTmp.html',
        controller: 'apiCtrl'
    };
});
'use strict';

angular.module('surfApp').directive('weatherDir', function () {

    return {
        restrict: "E",
        templateUrl: "./app/directives/apiDirectives/weatherDirTmp.html",
        controller: "apiCtrl"
    };
});
'use strict';

angular.module('surfApp').controller('carouselCtrl', ["$scope", "carouselService", function ($scope, carouselService) {

    $scope.myInterval = 3000;
    $scope.active = 0;
    $scope.slides = carouselService.getImages();
    var currIndex = 0;
}]);
'use strict';

angular.module('surfApp').directive('carouselDir', function () {

    return {
        restrict: "E",
        templateUrl: "app/directives/carouselDir/carousel.html",
        controller: 'carouselCtrl',
        scope: {
            bgColor: '='
        },
        link: function link(scope, element, attribute) {
            $('.inner-slide').css({ "width": scope.bgColor });
        }
    };
});
'use strict';

angular.module('surfApp').service('carouselService', function () {

    var images = [{
        id: 1,
        image: './images/banner1.png',
        text: "1"
    }, {
        id: 2,
        image: './images/banner2.png',
        text: "2"
    }, {
        id: 3,
        image: './images/banner3.png',
        text: "3"
    }, {
        id: 4,
        image: './images/banner4.png',
        text: "4"
    }, {
        id: 5,
        image: './images/banner5.png',
        text: "5"
    }, {
        id: 6,
        image: './images/banner6.png',
        text: "6"
    }];

    this.getImages = function () {

        return images;
    };
});
'use strict';

angular.module('surfApp').service('surfboardsService', function () {

    var boards = [{
        'title': 'Lib Tech Round Nose Fish Redux by Lost ',
        'id': 0,
        'images': 'http://images.usoutdoor.com/usoutdoorstore/products/full/lib-lost-round-nose-fish1.jpg',
        'price': 739.95,
        'brandImg': 'http://images.usoutdoor.com/supplierLogo/lib-tech.gif',
        'brand': 'Lib Tech',
        'description': "The Libe Tech X Lost Round Nose Fish Redux is a great single concave, hybrid shape that will perform great in a wide variety of wave conditions. Everything from the V tail shape, to the flat nose is meant to give ultimate board control to the person riding. So no matter if you're on slower less powerful waves, or waves with steep faces you'll have a great time while riding on the Round Nose Fish.",
        "features": {
            'concave': "Board Concave: Single Concave under the front foot",
            'fin': "Fin Setup: 5 fin (Twin/Quad or 2+1)",
            'length': "Length: 5'6",
            'materials': "Materials: Magnesium Fiber, Carbon composite stringer, Nitrogenecell Foam, Hexzylon Foam skin, Woven Basalt, Bio-matrix resin, FOC adjustable Slot fin system, Elasto perimeter dampening fiber, and Sprock blocks for strong and long lasting performance.",
            'rocker': "Rocker: Low stringer-line rocker",
            'thickness': "Thickness: 2.32",
            'volume': "Volume: 28.50CL-42.00CL",
            'width': "Width: 19.50"

        }

    }, {
        'title': "Hayden Shapes 6'2",
        'id': 1,
        'images': 'http://images.usoutdoor.com/usoutdoorstore/products/full/HSHYPTOFF14board.jpg',
        'price': 774.95,
        'brandImg': "http://images.usoutdoor.com/supplierLogo/global-surf.gif",
        'brand': "Golbal Surf Industries",
        'description': "Global Surf Industries' Hypto Krypto FF Surfboard is the most verstaile shape in the Haydenshapes range. You can ride this in waves from 1-8 ft deep, it paddles like a dream due to the volume and flatter rocker. The outline resembles an old school twin fin in the nose, yet pulls into a rounded pin tail which will give you plenty of hold in the bigger stuff.",
        'features': {
            'thickness': "Thickness: 2 3/8 - 2 3/4 in.",
            'width': "Width: 19.75-20.5 in."
        }

    }, {
        'title': 'Lib Tech Lost Short Round',
        'id': 2,
        'images': 'http://images.usoutdoor.com/usoutdoorstore/products/full/lib-x-lost-short-round.jpg',
        'price': 689.95,
        'brandImg': "http://images.usoutdoor.com/supplierLogo/lib-tech.gif",
        'brand': "Lib Tech",
        'description': "A match made in boardsport heaven. Libtech has joined forces with legendary surf brand Lost to create some of the best performing, most durable and environMENTALly friendly surfboards on the planet. The Libtech X Lost Short Round blurs the lines between “groveller” small wave boards and high performance shortboards. A slightly wider nose with low entry rocker makes the Short Round a great wave catcher that easily picks up speed when surfing down the line. Quick vertical turns and hacks come easily thanks to moderate rocker though the double concave squash tail. Lost shaper Matt Biolos describes it best: “A skatey speedster with a high performance hook. Fast and flat, but without the fat”. ",
        'features': {
            'length': "Length: 5’4” - 6’0”",
            'materials': "Due to the nature of surfboards, shaping thickness, width and fin setups may vary. Shop in-store to check out, touch and feel our current inventory.",
            'rocker': "Rocker: Low stringer-line rocker",
            'thickness': "Thickness: 2.32",
            'volume': "Volume: 28.50CL-42.00CL",
            'width': "Width: 19.50"
        }
    }, {
        'title': 'Super Brand PigDog Surfboard',
        'id': 3,
        'images': 'http://images.usoutdoor.com/usoutdoorstore/products/full/super-pigdog-surfboard1.jpg',
        'price': 609.95,
        'brandImg': "./images/board_images/super-brand.png",
        'brand': "Superbrand",
        'description': "The Super Brand PigDog Surfboard has a single to double concave making it easier to make tiny adjustments within the barrel. The PigDog has some added width for paddling into waves easier while the outlying curvature of the board provides more top turn-ability without needing a rail.",
        'features': {
            'concave': "Shape: Single to double concave",
            'fin': "Fin Setup: 5 Plug Setup for tri/quad Option",
            'rocker': "Rocker: Low to mid rocker",
            'width': "Tail: Pulled in rounded pin"
        }

    }, {
        'title': 'Super Brand Toy Surfboard',
        'id': 4,
        'images': 'http://images.usoutdoor.com/usoutdoorstore/products/full/super-toy-surfboard.jpg',
        'price': 609.95,
        'brandImg': "./images/board_images/super-brand.png",
        'brand': "Superbrand",
        'description': "The Toy Surfboard from Super has a wider more full outline than a normal shorboard with low rocker and single to double concave for more paddle power and the ability to thrash is smaller waves. The Toy is the perfect too for intermediate surfers looking to grow their skill set.",
        'features': {
            'length': "Extras: Ride 1-3 inches shorter and half-inch wider than a normal shortboard",
            'materials': "",
            'rocker': "Rocker: Low Rocker",
            'width': "Tail: Swallow Tail"
        }
    }, {
        'title': "Hayden Shapes 6'0",
        'id': 5,
        'images': 'http://images.usoutdoor.com/usoutdoorstore/products/full/global-hs-love-buzz-ff.jpg',
        'price': 749.95,
        'brandImg': "http://images.usoutdoor.com/supplierLogo/global-surf.gif",
        'brand': "Golbal Surf Industries",
        'description': "The Global HS Love Buzz FF Shortboard is a speedy, medium entry rocker design that offers ample response. Featuring medium lift in the tail to create an intuitive ride paired with a carbon fiber frame that performs above and beyond in high speeds. With over two years of testing around the world in a variety of conditions, The Love Buzz FF Shortboard is certain to be a fun ride for intermediate to advanced surfers riding in waves up to four feet.",
        'features': {
            'concave': "Board Concave: Single-Double",
            'fin': "Fin Setup: Future HSL Recommended / Not Supplied",
            'length': 'Length: 5feet 10" - 6feet 0"',
            'materials': "Materials: Carbon Fiber",
            'rocker': "Rocker: Medium / Flat Entry Rocker | HS Flatter Center Rocker",
            'thickness': "Thickness: 2 1/2' - 2 5/8'",
            'width': "Width: 19 3/8' - 19 7/8'"
        }
    }, {
        'title': 'Lib Tech X Lost Puddle Jumper Surfboard',
        'id': 6,
        'images': 'http://images.usoutdoor.com/usoutdoorstore/products/full/lib-x-lost-puddle-jumper.jpg',
        'price': 689.95,
        'brandImg': "http://images.usoutdoor.com/supplierLogo/lib-tech.gif",
        'brand': "Lib Tech",
        'description': "Catered towards pop and speed in a smaller wave surfboard to allow for versatility, the Lib Tech X Lost Puddle Jumper Surfboard has a unique concaved bottom paired with a wide silhouette. Crafted of incredibly durable, eco-friendly materials so you can enjoy Mother Ocean without having a negative impact. ",
        'features': {
            'length': 'Length: 5feet 5" - 5feet 11',
            'materials': "Materials: Nitrogenecell Foam, Hexzylon Fiber Foam, Woven Basalt Fiber, Bio-Matrix Resin",
            'thickness': 'Thickness: 2.38" - 2.75"',
            'volume': "Volume: 30.5 cl - 41.75 cl",
            'width': 'Width 20.5" - 22.0"'
        }
    }, {
        'title': 'Murdey Surfboards Checkered Egg Surfboard',
        'id': 7,
        'images': 'http://images.usoutdoor.com/usoutdoorstore/products/full/murdey-checkered-egg-surfboard.jpg',
        'price': 629.95,
        'brandImg': "http://images.usoutdoor.com/supplierLogo/murdey.gif",
        'brand': "Murdey Surfboards",
        'description': "Like a Swiss army knife for the ocean the Checkered Egg by Murdey Surfboards is one of the most versatile options in the Murdey Surfboards line. Enjoy ample paddle power to boost your wave count on small days and get you into waves a little earlier when the surf picks up. The Checkered Egg is a great stepping stone for surfers who are making the transition from longboard to shortboard surfing or anyone who is looking to add a fun and maneuverable midsize wave magnet to their quiver. ",
        'features': {
            'materials': "Due to the custom nature of hand shaped surfboards graphics, thickness, widths and fin setups may vary. Shop instore to check out, touch and feel our current inventory. "

        }
    }, {
        'title': 'Lib Tech Ramp Waterboard',
        'id': 8,
        'images': 'http://images.usoutdoor.com/usoutdoorstore/products/full/lib-ramp-waterboard1.jpg',
        'price': 735.95,
        'brandImg': "http://images.usoutdoor.com/supplierLogo/lib-tech.gif",
        'brand': "Lib Tech",
        'description': "There is no doubt that the Ramp Waterboard by Lib Technologies' is a stalwart of environmentally friendly material construction. Developed by Mike Olson and co- captained by craftsman, Jeff Henderson, the Ramp Waterboard breaks down every element of traditional surfboard design in order to reinvent ergonomic construction as well as implement new, non-toxic materials. Generated through Isotropic conFusion, the Ramp Waterboard is an amalgam of thirty-one eco friendly materials and components. From the 2D2D Volcanic Organic Basalt Honeycomb Technology which increases dampening properties while maintaining strength, to the MO BOX Fin System which allows for adjustable fin placement of Lib Tech’s new Maximum Intensity Leading Foil (M.I.L.F) fins. ",
        'features': {
            'materials': "Materials: 50% Recylced content; Closed cell alloy formula",
            'width': "Width: Small:20.25 in. Medium: 20.8125 in."
        }
    }, {
        'title': 'Lib Tech Bowl Waterboard',
        'id': 9,
        'images': 'http://images.usoutdoor.com/usoutdoorstore/products/full/lib-bowl-waterboard1.jpg',
        'price': 695.95,
        'brandImg': "http://images.usoutdoor.com/supplierLogo/lib-tech.gif",
        'brand': "Lib Tech",
        'description': "The Northwest may not be known for its epic surfing spots but Lib Tech made their mark on the surfing world with the most durable and environmentally friendly boards in the industry. Lib Tech built the Bowl Waterboard with Horsepower technology featuring a short lower rocker, straighter rail line with a speedy thumb tail and a high performance nose for aggressive acceleration for shredding small to medium waves. The 2D2D Basalt Volcanic Organic Honeycomb technology makes these boards strong, impact resistant and fearless.",
        'features': {
            'length': "Length: Logo: 5 ft 10 in; Blue Girl: 6 ft; Rasta Poly: 6 ft. 2 in.",
            'materials': "Materials: 50% Recylced content; Closed cell alloy formula",
            'width': "Width: Logo: 19.75 in; Blue Girl: 20.25 in; Rasta Poly: 20.8125 in."
        }
    }, {
        'title': 'Lib Tech Bowl Waterboard',
        'id': 10,
        'images': 'http://images.usoutdoor.com/usoutdoorstore/products/full/lib-bowl-waterboard3.jpg',
        'price': 695.95,
        'brandImg': "http://images.usoutdoor.com/supplierLogo/lib-tech.gif",
        'brand': "Lib Tech",
        'description': "The Northwest may not be known for its epic surfing spots but Lib Tech made their mark on the surfing world with the most durable and environmentally friendly boards in the industry. Lib Tech built the Bowl Waterboard with Horsepower technology featuring a short lower rocker, straighter rail line with a speedy thumb tail and a high performance nose for aggressive acceleration for shredding small to medium waves. The 2D2D Basalt Volcanic Organic Honeycomb technology makes these boards strong, impact resistant and fearless.",
        'features': {
            'length': "Length: Logo: 5 ft 10 in; Blue Girl: 6 ft; Rasta Poly: 6 ft. 2 in.",
            'materials': "Materials: 50% Recylced content; Closed cell alloy formula",
            'width': "Width: Logo: 19.75 in; Blue Girl: 20.25 in; Rasta Poly: 20.8125 in."
        }
    }, {
        'title': 'Murdey Surfboards Mini Log Surfboard',
        'id': 11,
        'images': 'http://images.usoutdoor.com/usoutdoorstore/products/full/murdey-mini-log-surfboard.jpg',
        'price': 649.95,
        'brandImg': "http://images.usoutdoor.com/supplierLogo/murdey.gif",
        'brand': "Murdey Surfboards",
        'description': "Year after year the Murdey Mini Log is one of our top selling surfboards. Not as long or as bulky as a traditional longboard the Mini Log still offers plenty of wave catching float but with more maneuverability. This board is a great option for lighter people or newer surfers interested in progressing down to a shorter shape without sacrificing float and stability.",
        'features': {
            'concave': "Due to the custom nature of hand shaped surfboards graphics, thickness, widths and fin setups may vary. Shop instore to check out, touch and feel our current inventory. ",
            'length': 'Typically available in lengths of 7feet 8” - 8feet 10”',
            'materials': "Often available in multiple fin setups and tail shapes. "
        }
    }, {
        'title': "ODYSEA 8'0",
        'id': 12,
        'images': 'http://images.usoutdoor.com/usoutdoorstore/products/full/catch-odysea-log.jpg',
        'price': 299.95,
        'brandImg': "https://media.licdn.com/mpr/mpr/shrink_200_200/AAEAAQAAAAAAAANTAAAAJGViNjg4MzJjLTM3MDQtNDM4NS1iYTkyLTYxNDAwMTQxMjM0MQ.png",
        'brand': "Catch Surf Co",
        'description': "From first time newbies to experienced surfers everyone has a spot in their board quiver for a Log. The Odysea Log is great for beginners thanks to it’s soft foam deck and flexible urethane fins for safety and durability. Odysea boards are crazy buoyant wave catching machines for anyone who wants an easy board that they don’t have to worry about dinging up. ",
        'features': {
            'length': 'Standard Sizes: 7feet 0” - 9feet 0”',
            'materials': "Due to the custom nature of shaping surfboards graphics, thickness, widths and fin setups may vary. Shop instore to check out, touch and feel our current inventory."
        }
    }, {
        'title': 'Lib Tech x Lost Puddle Jumper ',
        'id': 13,
        'images': 'http://images.usoutdoor.com/usoutdoorstore/products/full/lib-lost-puddle-jumper2.jpg',
        'price': 739.95,
        'brandImg': "http://images.usoutdoor.com/supplierLogo/lib-tech.gif",
        'brand': "Lib Tech",
        'description': "Catered towards pop and speed in a smaller wave surfboard to allow for versatility, the Lib Tech X Lost Puddle Jumper Surfboard has a unique concaved bottom paired with a wide silhouette. Crafted out of incredibly durable, eco-friendly materials so you can enjoy the Ocean without having a negative impact.",
        'features': {
            'length': 'Length: 5feet 1" - 6feet 1"',
            'materials': "Materials: Nitrogenecell Foam, Hexzylon Fiber Foam, Woven Basalt Fiber, Bio-Matrix Resin",
            'thickness': 'Thickness: 2.25" - 2.80"',
            'volume': "Volume: 25.5cl - 44.00cl",
            'width': 'Width: 19.5" - 22.5"'
        }
    }, {
        'title': "7S 5'6",
        'id': 14,
        'images': 'http://images.usoutdoor.com/usoutdoorstore/products/full/global-7s-56-sf-sea-shepard.jpg',
        'price': 419.95,
        'brandImg': "http://images.usoutdoor.com/supplierLogo/global-surf.gif",
        'brand': "Global Surf",
        'description': "Industries and Sea Sheperd Conservation and Society come together to give you the limited edition Super Fish board. Get the world famous design of the Super Fish and help protect the worlds oceans: 20 percent of every sale will go toward the the Sea Shepherd Conservation Society. The Super Fish has a fast ans smooth ride, thanks to it's buoyant step deck, high performance rails and low entry rocker.",
        'features': {
            'length': 'Length: 5feet 6"',
            'thickness': 'Thickness: 2 3/8"',
            'width': 'Width: 20"'
        }
    }, {
        'title': "Murdey 6'0 Surfboard",
        'id': 15,
        'images': 'http://images.usoutdoor.com/usoutdoorstore/products/full/murdey-60-surfboard-yelburg.jpg',
        'price': 564.95,
        'brandImg': "http://images.usoutdoor.com/supplierLogo/murdey.gif",
        'brand': "Murdey Surfboards",
        'description': "A retro inspired shortboard custom shaped by local Portland shaper Dan Murdey. It has a low entry rocker with increased volume under chest, it paddles easily into waves, and features a retro style swallow tail. This board works well in all conditions, from small mushy surf to overhead waves. Future fins included.",
        'features': {
            'length': '6feet 0" x 19'
        }
    }, {
        'title': "Murdey 6' 2",
        'id': 16,
        'images': 'http://images.usoutdoor.com/usoutdoorstore/products/full/murdey-6-2-skullet-sword.jpg',
        'price': 599.95,
        'brandImg': "http://images.usoutdoor.com/supplierLogo/murdey.gif",
        'brand': "Murdey Surfboards",
        'description': "Murdey’s Skullet and Sword surfboard is the perfect performance shortboard for the 5mm wetsuit wearing Northwest surfer or anyone who likes a little extra foam under their chest. More volume in the front half of the board and a slightly wider nose give the Skullet and Sword plenty of paddle power while the slim rails and single to double bottom concave really make this board come alive for critical bottom turns and vertical snaps off the lip.",
        'features': {
            'length': 'Typically available in lengths of 5feet 6” - 6feet 6”',
            'materials': "Due to the custom nature of hand shaped surfboards graphics, thickness, widths and fin setups may vary. Shop instore to check out, touch and feel our current inventory."

        }
    }, {
        'title': "Murdey 9' 0",
        'id': 17,
        'images': 'http://images.usoutdoor.com/usoutdoorstore/products/full/murdey-9-0-viper-longboard.jpg',
        'price': 789.95,
        'brandImg': "http://images.usoutdoor.com/supplierLogo/murdey.gif",
        'brand': "Murdey Surfboards",
        'description': 'The Murdey 9feet 0" Viper Longboard is a slightly thinner c',
        'features': {
            'length': 'Dimensions: 9feet 0" X 22 1/2 X2 7/8"',
            'materials': "Due to the custom nature of hand shaped surfboards graphics, thickness, widths and fin setups may vary. Shop instore to check out, touch and feel our current inventory."
        }
    }, {
        'title': "MURDEY 9'0",
        'id': 18,
        'images': 'http://images.usoutdoor.com/usoutdoorstore/products/full/murdey-90-bells-and-whistle.jpg',
        'price': 699.95,
        'brandImg': "http://images.usoutdoor.com/supplierLogo/murdey.gif",
        'brand': "Murdey Surfboards",
        'description': "Just like the name suggests this board has all of the Bells and Whistles of a standard longboard that’s perfect for surfing your favorite point break, the smaller peeling waves of summer or anytime you want to feel the smooth glide of a classic log. Murdey adds concave in the nose combined with a healthy dose of V through the tail to make the Bells and Whistles equally as fun while cross-stepping and hanging 5 or cutting back into the pocket. Built with a 2+1 fin setup you have the option to run a classic single fin or add the two sidebites for a little more hold and performance when the swell picks up. ",
        'features': {
            'length': 'Length 9feet 4" and 10feet 6"',
            'materials': "Due to the custom nature of hand shaped surfboards graphics, thickness, widths and fin setups may vary. Shop instore to check out, touch and feel our current inventory."

        }
    }, {
        'title': "Murdey 9' Viper Longboard",
        'id': 19,
        'images': 'http://images.usoutdoor.com/usoutdoorstore/products/full/murdey-9-viper-longboard.jpg',
        'price': 799.95,
        'brandImg': "http://images.usoutdoor.com/supplierLogo/murdey.gif",
        'brand': "Murdey Surfboards",
        'description': "Narrower and thinner than a classic noserider log the Murdey Viper is a longboard built for performance. Murdey shapes this board with moderate rocker, sharper rails and plenty of V off the tail to create a quick, maneuverable longboard that will really hold when you lay into a bottom turn. The versatile 2+1 fin setup allows you to experiment with various combinations of shapes and sizes between the primary center fin and smaller side bites. ",
        'features': {
            'length': 'Typically available in lengths of 8feet 10” - 9feet 6”',
            'materials': "Due to the custom nature of hand shaped surfboards graphics, thickness, widths and fin setups may vary. Shop instore to check out, touch and feel our current inventory."
        }
    }, {
        'title': "Murdey Surfboards 5'10",
        'id': 20,
        'images': 'http://images.usoutdoor.com/usoutdoorstore/products/full/murdey-5-10-fish.jpg',
        'price': 724.95,
        'brandImg': "http://images.usoutdoor.com/supplierLogo/murdey.gif",
        'brand': "Murdey Surfboards",
        'description': "This traditional Fish shape from Murdey Surfboards is anything but ordinary. This low rockered, and not too blunt shape, with wider pins makes catching waves a dream come true. And features hand foiled glassed in fins made from recycled skate decks!",
        'features': {
            'length': 'Length 5feet 10"',
            'materials': "Due to the custom nature of hand shaped surfboards graphics, thickness, widths and fin setups may vary. Shop instore to check out, touch and feel our current inventory."
        }
    }, {
        'title': "Murdey Surfboards 5'10",
        'id': 21,
        'images': 'http://images.usoutdoor.com/usoutdoorstore/products/full/murdey-5-10-modfish.jpg',
        'price': 614.95,
        'brandImg': "http://images.usoutdoor.com/supplierLogo/murdey.gif",
        'brand': "Murdey Surfboards",
        'description': "The locally hand shaped Mod-Fish from Murdey Surfboards offers a new take on the traditional Fish shape. Featuring a more refined rail foil, low rocker, Venturi speed concave, and a wider point forward shape the Mod-Fish is meant to make paddling and generating speed on the mushiest waves less of a struggle.",
        'features': {
            'length': 'Length 5feet 10"',
            'materials': "Due to the custom nature of hand shaped surfboards graphics, thickness, widths and fin setups may vary. Shop instore to check out, touch and feel our current inventory."
        }
    }, {
        'title': "Murdey Surfboards 5'9",
        'id': 22,
        'images': 'http://images.usoutdoor.com/usoutdoorstore/products/full/murdey-5-9-crescent-wrench.jpg',
        'price': 674.95,
        'brandImg': "http://images.usoutdoor.com/supplierLogo/murdey.gif",
        'brand': "Murdey Surfboards",
        'description': "The low rocker, squash tail, and quad fin placement on the Crescent Wrench from Murdey surfboards allows for keeping a loose maneuverable feel on smaller less powerful waves.",
        'features': {
            'length': 'Length 5feet 10"',
            'materials': "Due to the custom nature of hand shaped surfboards graphics, thickness, widths and fin setups may vary. Shop instore to check out, touch and feel our current inventory."
        }
    }, {
        'title': "Murdey Surfboards 6'6",
        'id': 23,
        'images': 'http://images.usoutdoor.com/usoutdoorstore/products/full/murdey-6-6-larold.jpg',
        'price': 649.95,
        'brandImg': "http://images.usoutdoor.com/supplierLogo/murdey.gif",
        'brand': "Murdey Surfboards",
        'description': "The Larold from Murdey Surfboards is an insane wave catcher. The low rocker, and nose shape make for an easy to paddle, but performance driven board that can excel in a variety of wave conditions. With the ability to be ridden as a single fin or 2+1 set up!",
        'features': {
            'length': 'Length 5feet 10"',
            'materials': "Due to the custom nature of hand shaped surfboards graphics, thickness, widths and fin setups may vary. Shop instore to check out, touch and feel our current inventory."
        }
    }, {
        title: 'Ron Jon 6ft 6" Quad Fish Surfboard',
        id: 24,
        images: "./images/board_images/board1.jpg",
        price: 325,
        'brandImg': "./images/board_images/ronjon-logo.png",
        'brand': "Ron Jon",
        'description': "This Retro Fish shaped board from Ron Jon features a true quad fin setup. No fin box or plugs for a center fin. Without the center fin, this board will tend to ride a bit looser, but the deep swallow tail helps to hold the board on the wave and give more control. With a very full width throughout the board's length, and a very mellow rocker, this board should be fast, catch waves easily, and is well suited for use in small and/or weak wave conditions. ",
        'features': {
            'fin': "Starter set of fins",
            'length': 'Length 6feet 6"',
            'thickness': 'Thickness: 2 3/4"',
            'width': 'Width: 21 1/2"'
        }

    }, {
        title: 'Ron Jon 5ft 10" Fish Surfboard',
        id: 25,
        images: "./images/board_images/board2.jpg",
        price: 325,
        'brandImg': "./images/board_images/ronjon-logo.png",
        'brand': "Ron Jon",
        'description': "Three words about this board. Fast, loose, and skatey. Great in small surf and especially beach breaks. The swallow tail holds in the wave and is like two pintails. Surf it all out and rail to rail. ",
        'features': {
            'fin': "Set of 3 FCS II Performer fins",
            'length': 'Length 5feet 10"',
            'thickness': '2 1/2" thick'
        }
    }, {
        title: 'Ron Jon 6ft 8" Egg Surfboard',
        id: 26,
        images: "./images/board_images/board3.jpg",
        price: 345,
        'brandImg': "./images/board_images/ronjon-logo.png",
        'brand': "Ron Jon",
        'description': "Shaped with the ladies in mind. Well OK, it's a great board for guys too. A fun and stable double ender. We increased the nose rocker and pulled up the 'hips' to make this board very forgiving. Easy to paddle and catches small waves easily. Recommended for experienced riders up to 150 lbs and beginners up to 130 lbs.",
        'features': {
            'fin': "Starter fin set",
            'thickness': '2 9/16" thick',
            'width': '9 13/16" wide'
        }
    }, {
        title: 'Ron Jon 6ft 8" Fish Surfboard',
        id: 27,
        images: "./images/board_images/board4.jpg",
        price: 345,
        'brandImg': "./images/board_images/ronjon-logo.png",
        'brand': "Ron Jon",
        'description': "Surf it all out and rail to rail!  The Fish surfboard is great in small surf and especially beach breaks, its fast, loose and skatey. The swallow tail holds in the wave and is like two pintails.  Recommended for experienced surfers up to 190lbs and beginners up to 160lbs. ",
        'features': {
            'fin': "Tri-fin setup",
            'materials': "Swallow tail",
            'thickness': '2 11/16" thick',
            'width': '20 5/16" wide'
        }
    }];

    this.getBoards = function () {
        return boards;
    };
});
'use strict';

angular.module('surfApp').controller('surfboardsCtrl', function ($scope, surfboardsService, $stateParams) {

    $scope.boards = surfboardsService.getBoards();

    $scope.id = $stateParams.id;

    $scope.board = $scope.boards[$scope.id];
});
"use strict";
"use strict";

angular.module('surfApp').controller("gearsCtrl", ["$scope", "gearsService", "$stateParams", function ($scope, gearsService, $stateParams) {

    $scope.test = "gearsCtrl is working!";

    $scope.surfGears = gearsService.getSuits();

    $scope.id = $stateParams.id;

    $scope.gear = $scope.surfGears[$scope.id];
}]);
'use strict';

angular.module('surfApp').service("gearsService", function () {

    var fullBodySuits = [{
        'images': 'http://images.usoutdoor.com/usoutdoorstore/products/full/bong-504-absolute-x-cz-hd.jpg',
        'title': 'Billabong 5/4 Absolute X Chest Zip Hooded Fullsuit',
        'id': 0,
        "price": 219.95,
        "brandImage": "http://images.usoutdoor.com/supplierLogo/billabong.gif",
        "brandName": "Billabong",
        "description": "The Billabong 5/4 Absolute X Chest Zip Hooded Fullsuit is an incredibly flexible design that features neoprene construction and a thermal liner to keep things toasty. Featuring wind resistancy and liquid sealed seams to keep cold water out.",
        "features": {
            "material": "Material: AX2 Superflex neoprene",
            "seals": "Seals: Liquid Seam Sealed"

        }

    }, {
        'images': 'http://images.usoutdoor.com/usoutdoorstore/products/full/xcel-drylock-hooded-54.jpg',
        'title': 'Xcel Drylock Hooded Wetsuit 5/4',
        'id': 1,
        "price": 579.95,
        "brandImage": "http://images.usoutdoor.com/supplierLogo/xcel.gif",
        "brandName": "Xcel",
        "description": "Fully upgraded for maximized aquatic performance, the Xcel Drylock Hooded Fullsuit 5/4 is the most advanced slice of waterwear in the entire Xcel collection. Now featuring Thermo Dry Celliant, this piece rocks an inner liner that uses smart fibers to recycle body heat and keep you warm, quick, and full of endurance in the water. A 100% waterproof zipper and wrist seals team up to deny chilly water. V Foam material is incredibly lightweight and Ultrastretch Neoprene is the most comfortable stuff out there. Brave the waves with nothing but the best in the Xcel Drylock Hooded Fullsuit 5/4.",
        "features": {
            "material": "Material: Ultrastretch Neoprene, Quickdry Fiber, V Foam",
            "knees": "Knees: Duraflex Knee Panels",
            "thickness": "Thickness: 5/4 mm",
            "contitions": "Conditions: 46° - 53°F",
            "zipper": "Zipper: Waterproof Drylock Zip",
            "construction": "Construction: Fusionweld Seams, Pressure Bonded Seams, Glued & Blindstitched Seams",
            "seals": "Seals: Drylock Wrist Seals, Nexskin Seals"
        }
    }, {
        'images': 'http://images.usoutdoor.com/usoutdoorstore/products/full/on-superfrk-54mm-hdy-flsuit-w3.jpg',
        'title': "O Neill Superfreak 5/4mm Hooded Fullsuit - Women's",
        'id': 2,
        "price": 279.95,
        "brandImage": "http://images.usoutdoor.com/supplierLogo/oneill.gif",
        "brandName": "O' Neill",
        "description": "Look out cold water surf, because the O'Neill Superfreak is here to conquer! This 5/4mm Hooded Fullsuit features the O' Neill FluidFlex Firewall on the chest and back to keep water out and warmth in, seams are glued and blindstitched while the strategic seamless paddled zones make this a long lasting suit.",
        "features": {
            "materials": "Material: 60 FluidFlex, 40% Ultraflex DS",
            "knees": "Knees: Krypto Kneepads",
            "zipper": "Zipper: Black-Out Zipper",
            "construction": "Construction: Strategic Seamless Paddle Zones",
            "neck": "Neck: Double Super Seal Neck",
            "closure": "Closure: F.U.Z.E. Closure System"
        }
    }, {
        'images': 'http://images.usoutdoor.com/usoutdoorstore/products/full/rxy-543-syncro-cz-hooded-fs.jpg',
        'title': "Roxy 5/4/3mm Syncro GBS chest Zip Hooded Fullsuit - Women's",
        'id': 3,
        "price": 194.95,
        "brandImage": "http://images.usoutdoor.com/supplierLogo/roxy.gif",
        "brandName": "Roxy",
        "description": "The Roxy 5/4/3mm Syncro GBS chest Zip Hooded Fullsuit is a lightweight neoprene full suit that features a chest zip for easier access. Featuring a cozy hood and watertight warmth.",
        "features": {
            "materials": "Material: 92% Nylon/Polyamide, 8% Elastane"
        }
    }, {
        'images': 'http://images.usoutdoor.com/usoutdoorstore/products/full/on-psychotech-554-whood.jpg',
        'title': "O'Neill Psychotech 5.5/4 Fullsuit ",
        'id': 4,
        "price": 479.95,
        "brandImage": "http://images.usoutdoor.com/supplierLogo/oneill.gif",
        "brandName": "O' Neill",
        "description": "The O'Neill Psychotech 5.5/4 Fullsuit is a cold water surfing essential. Featuring incredibly stretchy neoprene. A quick-to-dry design paired with a seam-free design creates ultimate comfort.",
        "features": {
            "materials": "Material: Neoprene"
        }
    }, {
        'images': 'http://images.usoutdoor.com/usoutdoorstore/products/full/bong-504-furn-car-x-hd-cz1.jpg',
        'title': 'Billabong 5/4 Furnace Carbon X Chest Zip Hooded Fullsuit',
        'id': 5,
        "price": 419.95,
        "brandImage": "http://images.usoutdoor.com/supplierLogo/billabong.gif",
        "brandName": "Billabong",
        "description": "The Billabong 5/4 Furnace Carbon X Chest Zip Hooded Fullsuit is a cold water catered design that features toasty furnace carbon lining. Offering super flexible neoprene construction and a new design that allows 60% less water absorption.",
        "features": {
            "lining": "Lining: Furnace Carbon lining",
            "material": "Material: AX1 Premium Superflex Neoprene"
        }
    }, {
        'images': 'http://images.usoutdoor.com/usoutdoorstore/products/full/q-syncro-43-bz-fullsuit.jpg',
        'title': 'Quiksilver Syncro 4/3 BZ Fullsuit',
        'id': 6,
        "price": 154.95,
        "brandImage": "http://images.usoutdoor.com/supplierLogo/quiksilver.gif",
        "brandName": "Quicksilver",
        "description": "The Quiksilver Syncro 4/3 BZ Fullsuit offers a lot of cold water high end features without the high end price tag. Featuring F'N Lite, and Thermal Smoothie neoprene for lightweight warmth, and protection from cold winds so that you'll be ready to handle mother nature head on. All while the inside has Warmfight thermal lining, and Glued and Blind stitched seams to help keep your core comfortable and warm for the ultimate in water performance.",
        "features": {
            "closure": "Closure: Back zip entry system, with a Hydrowrap adjustable neck closure",
            "knees": "Knees: Ecto-Flex Knee pads, durable, lightweight & flexible to protect you & your board",
            "material": "Material: F'N Lite, Thermal Smoothie, and Warmfight lining. For the retention of warmth, water repellency , and wind protection.",
            "seams": "Seams: Glued & blind stitched (GBS) seams that reduce sew throughs & water entry to keep you warmer",
            "thickness": "Thickness: 4/3mm",
            "zipper": "Zipper: YKK® #10 back zip"
        }
    }, {
        'images': 'http://images.usoutdoor.com/usoutdoorstore/products/full/on-epic-43-womens.jpg',
        'title': "O'Neill Epic 4/3mm Wetsuit - Women's",
        'id': 7,
        "price": 143.96,
        "brandImage": "http://images.usoutdoor.com/supplierLogo/oneill.gif",
        "brandName": "O' Neill",
        "description": "O'Neill's Epic 4/3mm Wetsuit features the impressively durable and lightweight FluidFlex Firewall neoprene, the Epic also has Krypto Knee Padz, glues and blindstiched seams, a double super seal neck, strategic seamless paddle zones and LSD (Lumbar Seamless Design).",
        "features": {
            "material": "Material: 100% UXT FluidFlex Firewall Neoprene",
            "seams": "Seams: Glued and Blindstitched Seams",
            "knees": "Knees: Krypto Knee Padz",
            "pockets": "Pockets: External key pocket with loop",
            "construction": "Construction: LSD (Lumbar Seamless Design)",
            "neck": "Neck: Double Super Seal Neck"
        }
    }, {
        'images': 'http://images.usoutdoor.com/usoutdoorstore/products/full/xcel-infiniti-x2-hooded-54-w2.jpg',
        'title': "Xcel Infiniti X2 Hooded 5/4 Fullsuit - Women's",
        'id': 8,
        "price": 384.95,
        "brandImage": "http://images.usoutdoor.com/supplierLogo/xcel.gif",
        "brandName": "Xcel",
        "description": "The ocean may be frigid, but inside the Xcel Women’s Infiniti X2 5/4 Hooded Fullsuit is a world of warmth. A revolutionary liner harnesses smart fibers to recycle body heat and transform it into infrared energy to dial up the heat so you can paddle out wherever the best waves are regardless of how many icebergs you might have to dodge. Innovative seams and a lady-specific fit crank up the comfort, and an entry system that makes putting it on super easy enables you to hit the waves quicker. Do the thing you love in a suit that refuses to let you down. Surf in the Xcel Women’s Infiniti X2 5/4 Hooded Fullsuit.",
        "features": {
            "construction": "Construction: Fusion Seam Technology",
            "entry": "Entry: Crossover Neck Entry, X2",
            "fit": "Fit: Back Knee Flex, Duraflex Knee Panels",
            "lining": "Lining: Thermo Dry Celliant",
            "material": "Material: Ultrastretch Neoprene",
            "seals": "Seals: Nexskin Seals",
            "seams": "Seams: Glue and Blindstitched Seams"
        }
    }, {
        'images': 'http://images.usoutdoor.com/usoutdoorstore/products/full/on-thermo-x-vest-wneo-hood.jpg',
        'title': "O'Neill Thermo X Vest W/ Neo Hood",
        'id': 9,
        "price": 59.96,
        "brandImage": "http://images.usoutdoor.com/supplierLogo/oneill.gif",
        "brandName": "O' Neill",
        "description": "The O'Neill Thermo X Vest W/ Neo Hood features a board short connector, quick-drying elements and an ultra-stretchy construction. Ultraviolet and rash protection provides ultimate protection against the elements.",
        "features": {
            "materials": "Material: Polypropelene",
            "construction": "Construction: UPF 50+"
        }
    }, {
        'images': 'http://images.usoutdoor.com/usoutdoorstore/products/full/xcel-infiniti-x2-hooded-54.jpg',
        'title': 'Xcel Infiniti X2 Hooded 5/4 Hooded Fullsuit',
        'id': 10,
        "price": 384.95,
        "brandImage": "http://images.usoutdoor.com/supplierLogo/xcel.gif",
        "brandName": "Xcel",
        "description": "The Xcel Infiniti X2 TDC Hooded Fullsuit 5/4 offer the warmest watertight design with a toasty liner that reflects your body heat back into you. Chafe-free seam sealing keeps things cozy.",
        "features": {
            "lining": "Lining: Quick Dry Lining",
            "material": "Material: Ultrastretch Neoprene",
            "seams": "Seams: Chafe-Free"
        }
    }, {
        'images': 'http://images.usoutdoor.com/usoutdoorstore/products/full/bong-504-syn-ez-cz-hood.jpg',
        'title': 'Billabong 5/4 Absolute X Chest Zip Hooded Fullsuit',
        'id': 11,
        "price": 199.95,
        "brandImage": "http://images.usoutdoor.com/supplierLogo/billabong.gif",
        "brandName": "Billabong",
        "description": "When the ocean demands your best, suit up with the Xcel Infiniti X2 Hooded Fullsuit 5/4. A unique entry system makes it easy to pull this bad boy on and gets you in the water quicker. This piece features the revolutionary inner lining system that utilizes smart fibers to recycle the heat your body produces and transform it into infrared energy that keeps you perfectly warm in the chilliest seas. Nexskin seals at the wrists and ankles holds in warmth and minimizes flushing. The Xcel Infiniti X2 Hooded Fullsuit 5/4 increases your endurance, promotes faster recovery, and amplifies the awesomeness of your surf sessions.",
        "features": {
            "material": "Material: Ultrastretch Neoprene",
            "seams": "Seams: Pressure Bonded Seams, Glued & Blindstitched Seams",
            "lining": "Lining: Quick Dry Lining, Thermo Dry Celliant",
            "knees": "Knees: Back Knee Flex Grooves, Duraflex Knee Panels",
            "entry": "Entry: X2, Crossover Neck Entry",
            "construction": "Construction: Fusion Seam Technology",
            "seals": "Seals: Nexskin Seals"
        }
    }, {
        'images': 'http://images.usoutdoor.com/usoutdoorstore/products/full/rxy-syncro-43mm-bz-fullsuit-w3.jpg',
        'title': "Roxy Syncro 3/4mm Back Zip Wetsuit - Women's",
        'id': 12,
        "price": 154.95,
        "brandImage": "http://images.usoutdoor.com/supplierLogo/roxy.gif",
        "brandName": "Roxy",
        "description": "Stay comfortable in the cold Pacific Northwest water with this cold water wetsuit from Roxy. The Syncro 3/4mm Back Zip Wetsuit is made out of a lightweight Thermal Smoothie Neoprene with a Warmflight thermal lining and features glue and blind stitched seams that minimize water entry to keep you warmer with Ecto-Flex knee pads to help protect you from your board.",
        "features": {
            "closure": "Closure: Hydrowrap adjustable neck closure",
            "entry": "Entry: Back zip entry system",
            "extras": "Extras: Hydroshield water barrier and FN lite neoprene packed with air cells for the lightest of lightweight warmth",
            "features": "Features: Thermal Smoothie Neoprene: Flexible and wind & water repellent to keep you warmer",
            "knees": "Knees: Ecto-Flex Knee pads, durable, lightweight & flexible to protect you & your board",
            "lining": "Lining: Warmflight thermal lining - far infrared technology",
            "material": "Material: 92% Nylon/Polyamide, 8% Elastane",
            "seams": "Seams: Glued & blind stitched (GBS) seams that reduce sew throughs & water entry to keep you warmer",
            "zipper": "Zipper: YKK #10 back zip"
        }
    }, {
        'images': 'http://images.usoutdoor.com/usoutdoorstore/products/full/on-epic-54.jpg',
        'title': "O'Neill Epic 5/4mm Wetsuit",
        'id': 13,
        "price": 151.96,
        "brandImage": "http://images.usoutdoor.com/supplierLogo/oneill.gif",
        "brandName": "O' Neill",
        "description": "O'Neill's Epic 5/4mm Wetsuit is a warm suit with FluidFlex Firewall technology making it lighter, warmer and more flexible suit than others. The SuperStretch neoprene, GBS seams and Double Superseal Neck contribute to your overall comfort and performance in colder temps.",
        "features": {
            "material": "Material: 100% UltraFlex (FluidFlex) Neoprene",
            "seams": "Seams: GBS Seams/Double Superseal Neck",
            "zipper": "Zipper: Blackout Zip",
            "construction": "Construction: LSD (Lumbar Seamless Design)"
        }
    }, {
        'images': 'http://images.usoutdoor.com/usoutdoorstore/products/full/q-ag47-perf-hooded-543-fs1.jpg',
        'title': " Quiksilver AG47 Performance 5/4/3mm Chest Zip Hooded Fullsuit - Men's",
        'id': 14,
        "price": 349.95,
        "brandImage": "http://images.usoutdoor.com/supplierLogo/quiksilver.gif",
        "brandName": "Quicksilver",
        "description": "Stay warm, dry and comfortable while you're sitting in the lineup with the Quiksilver AG47 Performance 5/4/3mm Chest Zip Hooded Fullsuit. Made with FN Lite neoprene, this hooded full suit is very light, yet its Dry Flight infrared heat thermal lining holds in the body heat to keep you warm. The hydrolock seam seal system helps to stop leaks coming through the seams, and the water-block semi dry zip makes a watertight seal to minimizing water shooting through the zipper. It also has fused edges prevent water from flushing inside the suit through the ankles, wrists and neck. So get out there, just don't snake my wave.",
        "features": {
            "pockets": "Pockets: Internal key pocket",
            "thickness": "Thickness: 5/4/3mm",
            "zipper": "Zipper: Chest Zipper",
            "fit": "Fit: Fullsuit",
            "temp": "Water Temp Rating: 45 Degrees to 55 Degrees",
            "material": "Neoprene Type: 100% Stretch"
        }
    }, {
        'images': 'http://images.usoutdoor.com/usoutdoorstore/products/full/xcel-drylock-hooded-431.jpg',
        'title': 'Xcel Drylock Hooded 4/3mm Wetsuit',
        'id': 15,
        "price": 544.95,
        "brandImage": "http://images.usoutdoor.com/supplierLogo/xcel.gif",
        "brandName": "Xcel",
        "description": "Paddle out in the Xcel Drylock Hooded Fullsuit 4/3 and let those chilly waves know that they have met their match. Upgraded with the Thermo Dry Celliant lining with smart fibers to establish itself as the most premiere wetsuit on the market, this piece recycles your body heat to keep you perfectly warm even if you just rode past an iceberg. It further elevates performance by using a diamond pattern in the chest to increase core warmth that allows you to maintain endurance throughout your entire surf session. When all the most advanced fabrics team up with the most innovative tech, you get the Xcel Drylock Hooded Fullsuit 4/3 that was designed to crush cold conditions.",
        "features": {
            "material": "Material: Ultrastretch Neoprene, comfortable with a tighter weave for less water absorption",
            "seams": "Seams: Glue and Blindstitched Seams, Pressure Bonded Seams, Fusionweld Seams",
            "knees": "Knees: Duraflex Knee Panels, Back Knee Flex Grooves",
            "conditions": "Conditions: 49° - 55° F",
            "zipper": "Zipper: Waterproof Drylock Zip",
            "entry": "Entry: Crossover Neck Entry",
            "seals": "Seals: Nexskin Seals, thin band of liquid neoprene on inner wrists and ankles, Drylock Wrist Seals"
        }
    }, {
        'images': 'http://images.usoutdoor.com/usoutdoorstore/products/full/xcel-43-xplore-wmn1.jpg',
        'title': "Xcel 4/3 Xplore Wetsuit - Women's",
        'id': 16,
        "price": 127.96,
        "brandImage": "http://images.usoutdoor.com/supplierLogo/xcel.gif",
        "brandName": "Xcel",
        "description": "The cute and feminine Xcel Women’s Xplorer OS 4/3mm Back Zip Wetsuit is a go to suit for surfing. Constructed with ultra-stretch neoprene plus soft foam and tight weave, the Xplore wetsuit is amazingly durable and absorbs less water. Its back entry zipper design provides flexibility to wear the wetsuit and offers plush comfort throughout. Duraflex knee panels are contoured to increase dexterity and the suit is crafted women specific for an incredible fit.",
        "features": {
            "entry": "Entry: OS Back Entry",
            "knees": "Knees: DuraFlex Knee Panels",
            "material": "Material: 100% Ultrastretch neoprene",
            "seams": "Seams: Glued & Blindstitched Seams",
            "texture": "Texture Skin"
        }
    }, {
        'images': 'http://images.usoutdoor.com/usoutdoorstore/products/full/rxy-syncro-hooded-543-cz3.jpg',
        'title': "Roxy Syncro GBS Chest Zip Hooded Fullsuit - Women's",
        'id': 17,
        "price": 194.95,
        "brandImage": "http://images.usoutdoor.com/supplierLogo/roxy.gif",
        "brandName": "Roxy",
        "description": "Keep your body warm and protected with the Roxy 5/4/3mm Syncro GBS Chest Zip Hooded Fullsuit. Built with F'N Lite neoprene, this wetsuit is very lightweight, and the Dry Flight far infrared heat thermal lining preserves the body heat inside the suit to cocoon you in extra warmth. Hydroshield water barrier and Hydrowrap Adjustable Neck Closure prevents water entering inside the suit via zipper and neck to keep your body warmer. Ecto-flex kneepads safeguard your knees and the internal pocket offers a secured space for keeping keys.",
        "features": {
            "material": "Material: 92% Nylon/Polyamide, 8% Elastane",
            "seams": "Seams: Triple glued & blind stitched",
            "thickness": "Thickness: 5/4/3mm",
            "lining": "Lining: Thermal lining",
            "knees": "Knees: Ecto-Flex",
            "pockets": "Pockets: Internal key pocket",
            "zipper": "Zipper: Chest zip",
            "fit": "Fit: Hooded, long sleeve & long leg",
            "cosure": "Closure: Hydrowrap Adjustable Neck Closure",
            "type": "Type of Waterproofing: Dry Flight",
            "barrier": "Barrier: Hydroshield Water Barrier"
        }
    }, {
        'images': 'http://images.usoutdoor.com/usoutdoorstore/products/full/q-syncro-hooded-543-cz1.jpg',
        'title': 'Quiksilver Syncro Hooded 5/4/3 Chest Zip Wetsuit',
        'id': 18,
        "price": 194.95,
        "brandImage": "http://images.usoutdoor.com/supplierLogo/quiksilver.gif",
        "brandName": "Quicksilver",
        "description": "Your search for lightest, durable and comfortable wet suit ends here! The Syncro GBS 5/4/3mm Hooded Chest Zip Fullsuit uses F'N Lite neoprene that makes this wetsuit lightweight and provides extra warmth. Thermal smoothie neoprene keeps your body warm by repelling water & wind, and the Dry Flight far infrared heat thermal lining prevents the leaking of body heat through the lining. Triple glued & blind stitched seams and Glideskin neck seal prevents water from entering the suit, helping you to stay dry. Knees are equipped with Ecto-flex pads for added protection and the internal key pocket provides space to secure your keys.",
        "features": {
            "material": "Material: 92% Nylon/Polyamide, 8% Elastane",
            "pockets": "Pockets: Internal key pocket",
            "fit": "Fit: Fullsuit with hood",
            "closure": "Closure: Chest Zipper",
            "water": "Water repellent: Wind & water repellent to keep you warmer"
        }
    }, {
        'images': 'http://images.usoutdoor.com/usoutdoorstore/products/full/rxy-543-performance-cz-hood.jpg',
        'title': "Roxy 5/4/3 Performance Chest Zip Hoded Wetsuit - Women's",
        'id': 19,
        "price": 349.95,
        "brandImage": "http://images.usoutdoor.com/supplierLogo/roxy.gif",
        "brandName": "Roxy",
        "description": "The Roxy 5/4/3 Performance Chest Zip Hoded Wetsuit is a thermal lined neoprene construction. Featuring blind-stitched seams for a chafe-free warm and toasty design. Women's specific with a chest zipper.",
        "features": {
            "padding": "Padding: FN Lite Neoprene",
            "seams": "Seams: Sealed/Taped",
            "thickness": "Thickness: 5/4/3mm",
            "zipper": "Zipper: Chest Zip"
        }
    }, {
        'images': 'http://images.usoutdoor.com/usoutdoorstore/products/full/xcel-infiniti-x2-tdc-54-hood.jpg',
        'title': 'Xcel Infiniti X2 TDC Hooded Fullsuit 5/4 ',
        'id': 20,
        "price": 384.95,
        "brandImage": "http://images.usoutdoor.com/supplierLogo/xcel.gif",
        "brandName": "Xcel",
        "description": "The Xcel Infiniti X2 TDC Hooded Fullsuit 5/4 offer the warmest watertight design with a toasty liner that reflects your body heat back into you. Chafe-free seam sealing keeps things cozy.",
        "features": {
            "lining": "Lining: Quick Dry Lining",
            "material": "Material: Ultrastretch Neoprene",
            "seams": "Seams: Chafe-Free"
        }
    }, {
        'images': 'http://images.usoutdoor.com/usoutdoorstore/products/full/xcel-xplorer-43-bz-fullsuit.jpg',
        'title': 'Xcel Explorer 4/3 BZ Fullsuit ',
        'id': 21,
        "price": 159.95,
        "brandImage": "http://images.usoutdoor.com/supplierLogo/xcel.gif",
        "brandName": "Xcel",
        "description": "Getting into your wet suit just got a little easier with the Explorer 4/3 BZ Fullsuit from Xcel. The offset back entry of this suit is not only easy to get into, but keeps zipper pressure off your spine as you paddle. While the premium Ultrastretch Neoprene allows for good flexibility, overall comfort, and warmth.",
        "features": {
            "collar": "Collar: Single layer Smoothskin",
            "entry": "Entry: Off Set Back Zipper",
            "fit": "Fit: Duraflex Knee panels, and less seams for more Stretch",
            "material": "Material: Premium Ultrastretch Neoprene",
            "seams": "Seams: Glued, and Blind Stitched Seams",
            "thickness": "Thickness: 4/3mm"
        }
    }, {
        'images': 'http://images.usoutdoor.com/usoutdoorstore/products/full/JWFU3SC5_BLACK.jpg',
        'title': 'Billabong Synergy Hooded\r5/4 Chest Zip Wetsuit',
        'id': 22,
        "price": 119.40,
        "brandImage": "http://images.usoutdoor.com/supplierLogo/billabong.gif",
        "brandName": "Billabong",
        "description": "The Synergy Hooded Chest Zip Wetsuit from Billabong is built to withstand temperatures ranging from 52F-58F. To reach maximum comfort levels, the Synergy is built using 10mm impact welded external seams, triple glued and blind-stitched to keep you warm, dry and flexible.",
        "features": {
            "material": "Material: Neoprene",
            "seams": "Seams: Triple glued and blindstitched seams for maximum water blockage, Heat tape stress points",
            "hood": "Hood: yes",
            "zipper": "Zipper: Chest Zip Entry"
        }
    }, {
        'images': 'http://images.usoutdoor.com/usoutdoorstore/products/full/xcel-xplorer-54mm-fullsuit-w2.jpg',
        'title': "XCEL Xplorer 5/4 MM Fullsuit - Women's",
        'id': 23,
        "price": 139.96,
        "brandImage": "http://images.usoutdoor.com/supplierLogo/xcel.gif",
        "brandName": "Xcel",
        "description": "Searching for a wetsuit that just gets the job done so you can max your enjoyment of every surf session? Look no further than the Xcel Women's Xplorer 5/4 Fullsuit. Fewer seams equal more stretch for a more comfortable fit that has been engineered to move with your body and never restrict range of motion. Ultrastretch neoprene material has been used to keep this suit super lightweight, cozy, and durable. An offset entry design moves the zipper away from your spine to enhance flexibility and reduce pressure. Focus on catching that next swell and ripping it thoroughly while the Xcel Women's Xplorer 5/4 Fullsuit does the rest.",
        "features": {
            "knees": "Knees: DURAFLEX KNEE PANELS",
            "material": "Material: ULTRASTRETCH NEOPRENE",
            "seams": "Seams: GLUED & BLINDSTITCHED SEAMS",
            "zipper": "Zipper: OFFSET ZIPPER"
        }
    }, {
        'images': 'http://images.usoutdoor.com/usoutdoorstore/products/full/rxy-syncro-543-bz-fullsuit3.jpg',
        'title': 'Roxy Syncro 5/4/3 Back Zip Fullsuit',
        'id': 24,
        "price": 174.95,
        "brandImage": "http://images.usoutdoor.com/supplierLogo/roxy.gif",
        "brandName": "Roxy",
        "description": "Made with 100% FN lite neoprene with a Bio Fleece thermal liner, the Syncro 5/4/3 Backzip Fullsuit keeps you chaffe free due to the glued and blind stitched seams. Enter through the back with YKK standard length back zip and enjoy the warmth that this suit will provide you in cold waters.",
        "features": {
            "lining": "Lining: Bio Fleece Thermal Lined Inner Chest Panel",
            "material": "Material: 100% FN lite neoprene",
            "zipper": "Zipper: YKK Standard Length Back ZIp"
        }
    }, {
        'images': 'http://images.usoutdoor.com/usoutdoorstore/products/full/rxy-syncro-43mm-bz.jpg',
        'title': 'Roxy Syncro 4/3mm Full Back Zip Wetsuit',
        'id': 25,
        "price": 154.95,
        "brandImage": "http://images.usoutdoor.com/supplierLogo/roxy.gif",
        "brandName": "Roxy",
        "description": "Featuring 100% Hyperstretch 3.0 neoprene, the Roxy Syncro 4/3mm Full Back Zip Wetsuit locks out water while keeping a full range of motion for those fun days in the water."
    }, {
        'images': 'http://images.usoutdoor.com/usoutdoorstore/products/full/xcel-infiniti-x2-tdc-hood-43.jpg',
        'title': 'Xcel Infiniti X2 TDC Hooded 4/3 ',
        'id': 26,
        "price": 364.95,
        "brandImage": "http://images.usoutdoor.com/supplierLogo/xcel.gif",
        "brandName": "Xcel",
        "description": "The Infiniti X2 TDC Hooded 4/3 wet suit from Xcel is built for staying warm and comfortable during the highest level of performance. Featuring Xcel's TDC lining on both the front and back of the Torso. This naturally hydrophobic, lightweight, and warm liner material works well in partnership with premium seam taping, Nexskin inner seals, and ultra stretch Neoprene. Making your time in the water better then ever before.",
        "features": {
            "closure": "Closure: Magnetic Zip closure",
            "cuffs": "Cuffs: Inner Nexskin Seals",
            "entry": "Entry: X2 Front Entry system with Smoothskin Hem",
            "fit": "Fit: Back Knee Flex Grooves, Duraflex Knee panels, and less seams for better stretch",
            "material": "Material: Ultrastretch Neoprene, with Quick Dry and TDC lining",
            "neck": "Neck: Crossover Neck entry",
            "seams": "Seams: Glued, and Blind Stitched Seams with interior Seam taping",
            "thickness": "Thickness: 4/3mm"
        }
    }, {
        'images': 'http://images.usoutdoor.com/usoutdoorstore/products/full/q-cypher-543mm-ls-hooded-cz1.jpg',
        'title': 'Quiksilver Cypher 5/4/3 LS Hooded Wetsuit',
        'id': 27,
        "price": 344.95,
        "brandImage": "http://images.usoutdoor.com/supplierLogo/quiksilver.gif",
        "brandName": "Quicksilver",
        "description": "Step into the Cypher wetsuit from Quiksilver and your days of crusty old suits will be a thing of the past. Based around the Biofleece thermal and Fiber-lite neoprenes, the Cypher 5/4/3 keeps you warm all day long, even when you're bobbing in that tub of ice water called the Pacific. The Biofleece neoprene is a perfect combination of XTX closed-cell foam and recycled PET, infused with bamboo, charcoal, and nylon jersey. Fiber-lite closed-cell neoprene is some of the lightest water wear you can find and never holds you back. Thousands of air cells trapped in the material keep things light, soft and trap warmth. Throw in a bamboo charcoal infused nylon jersey and you've got a neoprene that's 14% more flexible, weighs less, absorbs less water, and dries faster. If all that wasn't enough, Quiksilver went ahead and made all their seams with Flexmax seal technology, resulting in incredibly flexible seams that keep water out and don't inhibit your movement. Warm, waterproof, so comfortable you won't even realize the seams are there. The Ecto-flex kneepads are burly enough to take a beating and protect your knees from hard drops, but still flexible enough to allow for a full range of motion. They're low profile so you might not even notice them until you realize that all those hits and jars should be murdering your knees, but you don't feel a thing. Step up your game and get out in the dip anytime with the Quiksilver Cypher.",
        "features": {
            "material": "Material: Biofleece thermal Neoprene back panel, Fiberlite Neoprene",
            "seams": "Seams: Flexmax seam seal",
            "collar": "Collar: YKK mini chest zip entry",
            "knees": "Knees: Ecto flex kneepads",
            "hood": "Hood: Thermal smoothie hood"
        }
    }];

    this.getSuits = function () {
        return fullBodySuits;
    };
});
"use strict";

angular.module('surfApp').controller("homeCtrl", ["$scope", function ($scope) {

    $scope.test = 'homeCtrl is working';
}]);
"use strict";

angular.module('surfApp').controller("photosCtrl", ["$scope", "photosService", function ($scope, photosService) {

    $scope.test = 'photos controller is working!';

    $scope.spots = photosService.getSpots();
}]);
'use strict';

angular.module('surfApp').service('photosService', function () {

    var spots = [{

        spot: '17th Street',
        image: './images/17th_street.jpg'
    }, {
        spot: '36th Street',
        image: './images/36th_street.jpg'
    }, {
        spot: '40th Street',
        image: './images/40th_street.jpg'
    }, {
        spot: '56th Street',
        image: './images/56th_street.jpg'
    }, {
        spot: 'Anderson St',
        image: './images/anderson_st.jpg'
    }, {
        spot: 'Bolsa Chica',
        image: './images/bolsa_chica.jpg'
    }, {

        spot: 'Calafia',
        image: './images/calafia.jpg'
    }, {
        spot: 'Church',
        image: './images/church.jpg'
    }, {
        spot: 'Cotons Point',
        image: './images/cottons_point.jpg'
    }, {
        spot: 'Doheny',
        image: './images/doheny.jpg'
    }, {
        spot: 'Golden West',
        image: './images/golden_west.jpg'
    }, {
        spot: 'Huntington Beach',
        image: './images/huntington_beach.jpg'
    }, {

        spot: 'Huntington Pier',
        image: './images/huntington_pier.jpg'
    }, {
        spot: 'Lausen',
        image: './images/lausen.jpg'
    }, {
        spot: 'Lower Trestles',
        image: './images/lower_trestles.jpg'
    }, {
        spot: 'Newport Pier',
        image: './images/newport_pier.jpg'
    }, {
        spot: 'Northgate',
        image: './images/northgate.jpg'
    }, {
        spot: 'Riviera',
        image: './images/riviera.jpg'
    }, {

        spot: 'Salt Creek',
        image: './images/salt_creek.jpg'
    }, {
        spot: 'San Clemente Pier',
        image: './images/san_clemente_pier.jpg'
    }, {
        spot: 'San Onofre',
        image: './images/san_onofre.jpeg'
    }, {
        spot: 'Seal Beach Pier',
        image: './images/seal_beach_pier.jpeg'
    }, {
        spot: 'State Park',
        image: './images/state_park.jpg'
    }, {
        spot: 'Surfside Jetty',
        image: './images/surfside_jetty.jpg'
    }, {
        spot: 'T Street',
        image: './images/t_street.jpg'
    }, {
        spot: 'The Wedge',
        image: './images/the_wedge.jpg'
    }, {
        spot: 'Upper Trestles',
        image: './images/upper_trestles.jpg'
    }];

    this.getSpots = function () {
        return spots;
    };
});