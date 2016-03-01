'use strict';

// App Module: the name AngularStore matches the ng-app attribute in the main <html> tag
// the route provides parses the URL and injects the appropriate partial page
// Note: I don't recommend passing in'ui.bootstrap' as a dependency UNLESS you love update issues
//
var storeApp = angular.module('AngularStore', ['ngRoute', 'storeApp.config', 'slick', 'favicon', 'igTruncate']).
config(['$routeProvider', function ($routeProvider) {
    $routeProvider.
        when('/store', {
            templateUrl: 'ac_partials/store.htm',
            controller: 'storeController'
        }).
        when('/products/:productSku', {
            templateUrl: 'ac_partials/product.htm',
            controller: 'storeController'
        }).
        when('/cart', {
            templateUrl: 'ac_partials/cart.htm',
            controller: 'storeController'
        }).
        otherwise({
            redirectTo: '/store'
        });
    } 
]);

angular.module("storeApp", ["ngScrollTo"])
.config(function (ngScrollToOptionsProvider) {
    ngScrollToOptionsProvider.extend({
        handler: function (el) {
            $(el).scrollintoview();
        }
    });
});

// the storeController contains two objects & the DataService:
// - store: contains the product list
// - cart: the shopping cart object
// - DataService: called to retrieve products from JSON file
storeApp.controller('storeController', function ($scope, $filter, $routeParams, $location, DataService, $sce, CONFIG) {
    $scope.dataLoaded = false;

    var dataIndex = localStorage["data_src_index"];
    if (dataIndex == null || dataIndex == "undefined") {
        dataIndex = 0;
        localStorage["data_src_index"] = 0;
    }
    $scope.selectedDataIndex = dataIndex;

    /*#####################
    CONFIG
    ######################*/
    /* our global variabls */
    $scope.STORE_ID = CONFIG.CF_STORE_ID;
    $scope.STORE_PAGE = CONFIG.CF_STORE_PAGE;
    $scope.STORE_BG_IMAGE = CONFIG.CF_STORE_BG_IMAGE;
    $scope.DISTRIBUTOR_ID = CONFIG.CF_DISTRIBUTOR_ID;
    $scope.PAYMENT_PAYPAL_BUYNOW = CONFIG.CF_PAYMENT_PAYPAL_BUYNOW;
    $scope.PAYMENT_GOOGLE_WALLET_ID = CONFIG.CF_PAYMENT_GOOGLE_WALLET_ID;
    $scope.PAYMENT_STRIPE = CONFIG.CF_PAYMENT_STRIPE;
    $scope.PRODUCTS_FILE = CONFIG.CF_PRODUCTS_FILE;
    $scope.PRODUCTS_FOLDER = CONFIG.CF_PRODUCTS_FOLDER;
    $scope.NAVBAR_THEME = CONFIG.CF_NAVBAR_THEME;
    $scope.NAVBAR_LOGO_IMAGE = CONFIG.CF_NAVBAR_LOGO_IMAGE;
    $scope.NAVBAR_LOGO_TEXT = CONFIG.CF_NAVBAR_LOGO_TEXT;
    $scope.NAVBAR_LOGO_LINK = CONFIG.CF_NAVBAR_LOGO_LINK;
    $scope.INSIDE_HEADER_SHOW = CONFIG.CF_INSIDE_HEADER_SHOW;
    $scope.INSIDE_HEADER_LINK = CONFIG.CF_INSIDE_HEADER_LINK;
    $scope.INSIDE_HEADER_IMAGE = CONFIG.CF_INSIDE_HEADER_IMAGE;
    $scope.INSIDE_HEADER_TITLE = CONFIG.CF_INSIDE_HEADER_TITLE;
    $scope.CAROUSEL_SHOW = CONFIG.CF_CAROUSEL_SHOW;
    $scope.CAROUSEL_AUTO_PLAY = CONFIG.CF_CAROUSEL_AUTO_PLAY;
    $scope.AN_CAROUSEL_IMG_VIDEO = CONFIG.CF_AN_CAROUSEL_IMG_VIDEO;
    $scope.AN_CAROUSEL_PILL = CONFIG.CF_AN_CAROUSEL_PILL;
    $scope.AN_STORE_IMG_VIDEO = CONFIG.CF_AN_STORE_IMG_VIDEO;
    $scope.AN_STORE_PILL = CONFIG.CF_AN_STORE_PILL;
    $scope.SYSTEM_NAME = CONFIG.CF_SYSTEM_NAME;
    $scope.SYSTEM_LANGUAGE = CONFIG.CF_SYSTEM_LANGUAGE;
    $scope.BASE_URL = CONFIG.CF_BASE_URL;
    $scope.API_URL = CONFIG.CF_API_URL;
    $scope.GOOGLE_ANALYTICS_ID = CONFIG.CF_GOOGLE_ANALYTICS_ID;

    $scope.filteredItems = [];
    $scope.groupedItems = [];
    $scope.pagedItems = [];

    $scope.currentPage = 1;
    $scope.pageSize = 8;



    $scope.products = [];
    $scope.slides = [];

    $scope.isActive = false;

    $scope.sections = [{ name: 'list', class: 'cbp-vm-icon cbp-vm-list' }];

    $scope.updateDisplay = function (section) {
        $scope.selected = section;
        $scope.isActive = !$scope.isActive;

        // let's flip our icons. 
        //<a href="#" class="cbp-vm-icon cbp-vm-grid cbp-vm-selected" data-view="cbp-vm-view-grid">Grid View</a>
        //<a href="#" class="cbp-vm-icon cbp-vm-list" data-view="cbp-vm-view-list">List View</a>
        if (section.class.toString() === 'cbp-vm-icon cbp-vm-grid') {
            $scope.sections = [{ name: 'list', class: 'cbp-vm-icon cbp-vm-list' }];
        }
        else {
            $scope.sections = [{ name: 'grid', class: 'cbp-vm-icon cbp-vm-grid' }];
        }
    }

    $scope.isSelected = function (section) {
        return $scope.selected === section;
    }

    $scope.fToggleOverlay = function () {
        $scope.overlayFlag = !$scope.overlayFlag; // toggle state of overlay flag.
    };

    // get store and cart from service
    $scope.store = DataService.store;
    $scope.cart = DataService.cart;

    // use routing to pick the selected product
    if ($routeParams.productSku != null) {
        $scope.product = $scope.store.getProduct($routeParams.productSku);
    }





    /*#####################
    DataService  Executes when AJAX call completes
    ######################*/
    DataService.store.getProducts().then(function (data) {

        // Build array for products
        $scope.products = data;

        // Build slides[] array for super slick carousel
        for (var i = 0, len = $scope.products.length; i < len; i++) {
            var prod = $scope.products[i];

            if (prod.storeid == "7cc6cb94-0938-4675-b84e-6b97ada53978") {
                if (prod.imagename.length < 1) {
                    prod.imagename = "nopic.png";
                }
                if (prod.carousel) {
                    $scope.slides.push(prod);
                }
            }
        }
        $scope.dataLoaded = true;

        if ($routeParams.productSku != null) {
            var _sku = $routeParams.productSku.toString();
            //if (_sku.length > 0) {
                for (var i = 0, len = $scope.products.length; i < len; i++) {
                    var prod = $scope.products[i];
                    if (prod.sku === _sku) {
                        $scope.product = prod;
                    }
                }
            //}
        }

        //////////////////////////////////////////////////////////////////////////////
        // Author: Bill SerGio, The Infomercial King
        // Substantially better than the TOTAL PIECE OF CRAP FUNCTION "getUrlVars" that throw errors like crazy!
        // Given a query string "?to=email&why=because&first=John&Last=smith"
        // getUrlVar("to")  will return "email"
        // getUrlVar("last") will return "smith"
        // To convert it to a jQuery plug-in, you could try something like this:
        //(function ($) {
        //    $.getUrlVar = function (key) {
        //        var result = new RegExp(key + "=([^&]*)", "i").exec(window.location.search);
        //        return result && unescape(result[1]) || "";
        //    };
        //})(jQuery);
        $scope.getUrlVar = function (key) {
            var result = new RegExp(key + "=([^&]*)", "i").exec(window.location.search);
            return result && unescape(result[1]) || "";
        }
        var _sku = $scope.getUrlVar('sku');
        if (_sku.length > 0) {
            for (var i = 0, len = $scope.products.length; i < len; i++) {
                var prod = $scope.products[i];
                if (prod.sku === _sku) {
                    DataService.cart.addItemUrl(prod.sku, prod.productname, prod.unitprice, +1);
                }
            }
        }
        //////////////////////////////////////////////////////////////////////////////

        $scope.forceAddItem = function (sku, productname, unitprice, quantity) {
            //slick.dataLoaded = true;
            //var sku = "BabyMop";
            //var productname = "Baby Mop";
            //var unitprice = "22.27";
            //var quantity = 1;

            DataService.cart.addItem(sku, productname, unitprice, quantity);

            $scope.$apply(function () {
                $scope.cart.sku = DataService.cart.sku;
                $scope.cart.productname = DataService.cart.productname;
                $scope.cart.unitprice = DataService.cart.unitprice;
            });
            return "item added";
        };


        $scope.pageCount = function () {
            return Math.ceil($scope.products.length / $scope.pageSize);
        };

        $scope.nextPage = function () {
            if ($scope.currentPage >= Math.ceil($scope.products.length / $scope.pageSize) - 1) {
                return true;
            }
            else {
                return false;
            }
        };

        //$scope.$watch('currentPage + pageSize', function () {
        //    var begin = (($scope.currentPage - 1) * $scope.pageSize);
        //    var end = begin + $scope.pageSize;
        //    $scope.filteredItems = $scope.products.slice(begin, end);
        //});

        var searchMatch = function (haystack, needle) {
            if (!needle) {
                return true;
            }
            return haystack.toLowerCase().indexOf(needle.toLowerCase()) !== -1;
        };
        $scope.filterCategory = function (categoryname) {
            //$('#searchfield').val('');
            $scope.filteredItems = $filter('filter')($scope.products, function (product) {
                for (var attr in product) {
                    if (searchMatch(product[categoryname], $scope.query))
                        return true;
                }
                return false;
            });
            $scope.currentPage = 0;
            $scope.groupedPages();
        };
        $scope.filterCategory = function (column, categoryname) {
            //$('#searchfield').val('');
            $scope.filteredItems = $filter('filter')($scope.products, function (product) {
                for (var attr in product) {
                    if (searchMatch(product[column], categoryname))
                        return true;
                }
                return false;
            });
            $scope.currentPage = 0;
            $scope.groupedPages();
        };
        $scope.groupedPages = function () {
            $scope.pagedItems = [];
            for (var i = 0; i < $scope.filteredItems.length; i++) {
                if (i % $scope.pageSize === 0) {
                    $scope.pagedItems[Math.floor(i / $scope.pageSize)] = [$scope.filteredItems[i]];
                } else {
                    $scope.pagedItems[Math.floor(i / $scope.pageSize)].push($scope.filteredItems[i]);
                }
            }
        };

        // functions have been describe process the data for display
        $scope.filterCategory();
        $scope.search();
        ////////////////////////////////////////////////////////////////////////
        $scope.vchr_date = new Date($scope.product.expecteddate);

        $scope.getDate = function (item) {
            //var date = new Date(parseInt(jsonDate.substr(6)));
            //var date = eval(jsonDate.replace(/\/Date\((\d+)\)\//gi, "new Date($1)"));
            return new Date(item);
        };


    }); /* END - DataService */

});


// I created a data service that provides the store and a shopping cart that
// will be shared by all views (instead of creating fresh ones for each view).
storeApp.factory('DataService', function ($http, $q, CONFIG) {

    // Store can be loadded from a JSON file, a local .mdf database, or a remote database.
    //'CF_DATA_FILE': 'ac_products/products.js',
    //'CF_DATA_LOCAL': '/crud.ashx?ac=getproducts&cn=local',
    //'CF_DATA_REMOTE': '/crud.ashx?ac=getproducts&cn=remote',

    var dataIndex = localStorage["data_src_index"];
    if (dataIndex == null || dataIndex == "undefined") {
        dataIndex = 0;
        localStorage["data_src_index"] = 0;
    }

    var dataSource;
    if (dataIndex == 0) {
        dataSource = "/" + CONFIG.CF_DATA_FILE + "?rnd=" + new Date().getTime();
    }
    else if (dataIndex == 1) {
        dataSource = CONFIG.CF_DATA_LOCAL;
    }
    else if (dataIndex == 2) {
        dataSource = CONFIG.CF_DATA_REMOTE;
    }

    function Store() {
        var productsDeferred = $q.defer();
        this.products = productsDeferred.promise; //this.products is a promise

        $http.get(dataSource).success(function (data, status, headers, config) {
            var products = [];
            for (var i = 0, len = data.length; i < len; i++) {
                var prod = data[i];
                if (prod.storeid == "7cc6cb94-0938-4675-b84e-6b97ada53978") {
                    var _expecteddate = new Date(prod.expecteddate);
                    prod.expecteddate = _expecteddate;
                    products.push(prod);
                }
            }
            productsDeferred.resolve(products);
        }).error(function (data, status, headers, config) {
            alert("Please check you have updated ConnectionString with YOUR OWN information!");
            // Please note that in this sample project you need to update "remoteCartConnectionString" with your own data !!!
            //<add name="remoteCartConnectionString" connectionString="ADD_YOUR_CONNECTION_STRING\SQLEXPRESS;Initial Catalog=ACart;user=YOUR_USERNAME;pwd=YOUR_PASSWORD" providerName="System.Data.SqlClient"/>
        });
    }

    Store.prototype.getProduct = function (sku) {
        return this.products.then(function (products) {
            for (var i = 0; i < products.length; i++) { // MUST use products, it's the real value; this.products is a promise
                if (products[i].sku == sku) {
                    var _expecteddate = new Date(products[i].expecteddate);
                    products[i].expecteddate = _expecteddate;
                    //var _unitprice = products[i].unitprice.replace(/,/g, "").replace(/\s/g, "");
                    //products[i].unitprice = _unitprice;
                    return products[i];
                }
            }
            return null;
        });
    };

    Store.prototype.getProducts = function () {
        return this.products.then(function (products) {
            var _expecteddate = new Date(products.expecteddate);
            products.expecteddate = _expecteddate;
            //var _unitprice = products.unitprice.replace(/,/g, "").replace(/\s/g, "");
            //products.unitprice = _unitprice;
            return products;
        });
    };


    // create store
    var myStore = new Store();

    // create shopping cart
    var myCart = new shoppingCart("AngularStore");

    // enable PayPal checkout
    // note: the second parameter identifies the merchant; in order to use the 
    // shopping cart with PayPal, you have to create a merchant account with 
    // PayPal. You can do that here:
    // https://www.paypal.com/webapps/mpp/merchant
    //myCart.addCheckoutParameters("PayPal", "paypaluser@youremail.com");
    myCart.addCheckoutParameters("PayPal", CONFIG.CF_PAYMENT_PAYPAL_BUYNOW);

    // enable Google Wallet checkout
    // note: the second parameter identifies the merchant; in order to use the 
    // shopping cart with Google Wallet, you have to create a merchant account with 
    // Google. You can do that here:
    // https://developers.google.com/commerce/wallet/digital/training/getting-started/merchant-setup
    //myCart.addCheckoutParameters("Google", "GooGle_Wallet_ID",
    myCart.addCheckoutParameters("Google", CONFIG.CF_PAYMENT_GOOGLE_WALLET_ID,
        {
            ship_method_name_1: "UPS Next Day Air",
            ship_method_price_1: "20.00",
            ship_method_currency_1: "USD",
            ship_method_name_2: "UPS Ground",
            ship_method_price_2: "15.00",
            ship_method_currency_2: "USD"
        }
    );

    // enable Stripe checkout
    // note: the second parameter identifies your publishable key; in order to use the 
    // shopping cart with Stripe, you have to create a merchant account with 
    // Stripe. You can do that here:
    // https://manage.stripe.com/register
    //myCart.addCheckoutParameters("Stripe", "pk_test_stripe",
    myCart.addCheckoutParameters("Stripe", CONFIG.CF_PAYMENT_STRIPE,
        {
            chargeurl: "https://localhost:1234/processStripe.aspx"
        }
    );

    // return data object with store and cart
    return {
        store: myStore,
        cart: myCart
    };
});



storeApp.filter('unsafe', function ($sce) {
    return function (val) {
        return $sce.trustAsHtml(val);
    };
});

// AUTHOR: Bill SerGio
// Create a list of categoryname buttons to set categoryname filter
storeApp.filter('unique', function () {
    return function (collection, keyname) {
        var output = [],
            keys = [];

        angular.forEach(collection, function (item) {
            var key = item[keyname];
            if (keys.indexOf(key) === -1) {
                keys.push(key);
                output.push(item);
            }
        });
        return output;
    };
});

storeApp.directive('scrollTo', ['ScrollTo', function (ScrollTo) {
    return {
        restrict: "AC",
        compile: function () {

            return function (scope, element, attr) {
                element.bind("click", function (event) {
                    event.preventDefault();
                    ScrollTo.idOrName(attr.scrollTo, attr.offset);
                });
            };
        }
    };
}])
  .service('ScrollTo', ['$window', 'ngScrollToOptions', function ($window, ngScrollToOptions) {

      this.idOrName = function (idOrName, offset, focus) {//find element with the given id or name and scroll to the first element it finds
          var document = $window.document;

          if (!idOrName) {//move to top if idOrName is not provided
              $window.scrollTo(0, 0);
          }

          if (focus === undefined) { //set default action to focus element
              focus = true;
          }

          //check if an element can be found with id attribute
          var el = document.getElementById(idOrName);
          if (!el) {//check if an element can be found with name attribute if there is no such id
              el = document.getElementsByName(idOrName);

              if (el && el.length)
                  el = el[0];
              else
                  el = null;
          }

          if (el) { //if an element is found, scroll to the element
              if (focus) {
                  el.focus();
              }

              ngScrollToOptions.handler(el, offset);
          }

          //otherwise, ignore
      }

  }])
  .provider("ngScrollToOptions", function () {
      this.options = {
          handler: function (el, offset) {
              if (offset) {
                  var top = $(el).offset().top - offset;
                  window.scrollTo(0, top);
              }
              else {
                  el.scrollIntoView();
              }
          }
      };
      this.$get = function () {
          return this.options;
      };
      this.extend = function (options) {
          this.options = angular.extend(this.options, options);
      };
  });

storeApp.filter('unsafe', function ($sce) {
    return function (val) {
        return $sce.trustAsHtml(val);
    };
});

storeApp.directive('myYoutube', function ($sce) {
    return {
        restrict: 'EA',
        scope: { code: '=' },
        replace: true,
        //template: '<div class="video_container" style="padding:6px 6px 6px 6px !important;max-width:300px !important;max-height:200px !important;"><iframe style="overflow:hidden;max-height:200px;max-width:300px !important" src="{{url}}" frameborder="0" allowfullscreen></iframe></div>',
        template: '<div class="video"><iframe src="{{url}}" frameborder="0" allowfullscreen></iframe></div>',
        link: function (scope) {
            console.log('here');
            scope.$watch('code', function (newVal) {
                if (newVal) {
                    scope.url = $sce.trustAsResourceUrl("http://www.youtube.com/embed/" + newVal);
                }
            });
        }
    };
});


storeApp.directive('embedVideo', function ($sce) {
    return {
        restrict: 'EA',
        scope: { tube: '=', code: '=' },
        replace: true,
        template: '<div class="video"><iframe src="{{url}}" frameborder="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe></div>',
        link: function (scope) {
            //console.log('here');
            //document.cookie="VISITOR_INFO1_LIVE=oKckVSqvaGw; path=/; domain=.youtube.com";window.location.reload();
            scope.url = "about:blank";
            scope.$watch('code', function (videoidVal) {
                if (videoidVal) {
                    if (scope.tube === 'youtube') {
                        scope.url = $sce.trustAsResourceUrl("http://www.youtube.com/embed/" + videoidVal);
                    }
                    else if (scope.tube === 'youku') {
                        scope.url = $sce.trustAsResourceUrl("http://player.youku.com/embed/" + videoidVal);
                    }
                    else if (scope.tube === 'vimeo') {
                        scope.url = $sce.trustAsResourceUrl("http://player.vimeo.com/video/" + videoidVal);
                    }
                    else if (scope.tube === 'dailymotion') {
                        scope.url = $sce.trustAsResourceUrl("http://www.dailymotion.com/embed/video/" + videoidVal);
                    }
                    else if (scope.tube === '5min') {
                        scope.url = $sce.trustAsResourceUrl("http://embed.5min.com/" + videoidVal);
                    }
                    else if (scope.tube === 'cc') {
                        scope.url = $sce.trustAsResourceUrl("http://media.mtvnservices.com/embed/" + videoidVal);
                    }
                    else if (scope.tube === 'metacafe') {
                        scope.url = $sce.trustAsResourceUrl("http://www.metacafe.com/embed/" + videoidVal);
                    }
                    else if (scope.tube === 'liveleak') {
                        scope.url = $sce.trustAsResourceUrl("http://www.liveleak.com/ll_embed?f=" + videoidVal);
                    }
                    else if (scope.tube === 'ebaumsworld') {
                        scope.url = $sce.trustAsResourceUrl("http://www.ebaumsworld.com/media/embed/" + videoidVal);
                    }
                    else if (scope.tube === 'bliptv') {
                        scope.url = $sce.trustAsResourceUrl("http://blip.tv/play/" + videoidVal);
                    }
                    else if (scope.tube === 'funnyordie') {
                        scope.url = $sce.trustAsResourceUrl("http://www.funnyordie.com/embed/" + videoidVal);
                    }
                    else if (scope.tube === 'stupidvideos') {
                        scope.url = $sce.trustAsResourceUrl("http://www.stupidvideos.com/embed/?video=" + videoidVal);
                    }
                    scope.$apply();
                }
            });
        }
    };
});



var favApp = angular.module("favicon", []);
favApp.filter("favicon", function () {
    var provider = "https://www.google.com/s2/favicons?domain=%s";

    return function (url) {
        return provider.replace(/%s/g, url);
    }
})
.directive("favicon", ["faviconFilter", function (faviconFilter) {
    return {
        restrict: "EA",
        replace: true,
        template: '<img ng-src="{{faviconUrl}}" alt="{{description}}">',
        scope: {
            url: "=",
            description: "="
        },
        link: function ($scope, element, attrs) {
            $scope.$watch("url", function (value) {
                $scope.faviconUrl = faviconFilter(value);
            });
        }
    }
} ]);




/*#####################
MyMenu
######################*/
storeApp.controller('MyMenu', function ($scope, $filter, $location, CONFIG) {

    $scope.name = 'MyMenu';
    $scope.isCollapsed = false;
    $scope.dataLoaded = false;

    /*#####################
    CONFIG
    ######################*/
    /* our global variabls */
    $scope.STORE_ID = CONFIG.CF_STORE_ID;
    $scope.STORE_PAGE = CONFIG.CF_STORE_PAGE;
    $scope.STORE_BG_IMAGE = CONFIG.CF_STORE_BG_IMAGE;
    $scope.DISTRIBUTOR_ID = CONFIG.CF_DISTRIBUTOR_ID;
    $scope.PAYMENT_PAYPAL_BUYNOW = CONFIG.CF_PAYMENT_PAYPAL_BUYNOW;
    $scope.PAYMENT_GOOGLE_WALLET_ID = CONFIG.CF_PAYMENT_GOOGLE_WALLET_ID;
    $scope.PAYMENT_STRIPE = CONFIG.CF_PAYMENT_STRIPE;
    $scope.PRODUCTS_FILE = CONFIG.CF_PRODUCTS_FILE;
    $scope.PRODUCTS_FOLDER = CONFIG.CF_PRODUCTS_FOLDER;
    $scope.NAVBAR_THEME = CONFIG.CF_NAVBAR_THEME;
    $scope.NAVBAR_LOGO_IMAGE = CONFIG.CF_NAVBAR_LOGO_IMAGE;
    $scope.NAVBAR_LOGO_TEXT = CONFIG.CF_NAVBAR_LOGO_TEXT;
    $scope.NAVBAR_LOGO_LINK = CONFIG.CF_NAVBAR_LOGO_LINK;
    $scope.INSIDE_HEADER_SHOW = CONFIG.CF_INSIDE_HEADER_SHOW;
    $scope.INSIDE_HEADER_LINK = CONFIG.CF_INSIDE_HEADER_LINK;
    $scope.INSIDE_HEADER_IMAGE = CONFIG.CF_INSIDE_HEADER_IMAGE;
    $scope.INSIDE_HEADER_TITLE = CONFIG.CF_INSIDE_HEADER_TITLE;
    $scope.CAROUSEL_SHOW = CONFIG.CF_CAROUSEL_SHOW;
    $scope.CAROUSEL_AUTO_PLAY = CONFIG.CF_CAROUSEL_AUTO_PLAY;
    $scope.AN_CAROUSEL_IMG_VIDEO = CONFIG.CF_AN_CAROUSEL_IMG_VIDEO;
    $scope.AN_CAROUSEL_PILL = CONFIG.CF_AN_CAROUSEL_PILL;
    $scope.AN_STORE_IMG_VIDEO = CONFIG.CF_AN_STORE_IMG_VIDEO;
    $scope.AN_STORE_PILL = CONFIG.CF_AN_STORE_PILL;
    $scope.SYSTEM_NAME = CONFIG.CF_SYSTEM_NAME;
    $scope.SYSTEM_LANGUAGE = CONFIG.CF_SYSTEM_LANGUAGE;
    $scope.BASE_URL = CONFIG.CF_BASE_URL;
    $scope.API_URL = CONFIG.CF_API_URL;
    $scope.GOOGLE_ANALYTICS_ID = CONFIG.CF_GOOGLE_ANALYTICS_ID;

    if ($scope.CAROUSEL_SHOW) {
        $('#storeslider_wrapper').css('display', 'block');
    }
    else {
        $('#storeslider_wrapper').css('display', 'none');
    }

    if ($scope.INSIDE_HEADER_SHOW) {
        $('.inside_header').css('display', 'block');
    }
    else {
        $('.inside_header').css('display', 'none');
    }

    if ($scope.STORE_BG_IMAGE.length > 0) {
        $("body").css('background-image', '');
        $("body").css("background", "#ffffff url(" + $scope.STORE_BG_IMAGE + ") no-repeat center center fixed");
        localStorage['bg_cart'] = $scope.STORE_BG_IMAGE;
    }

    _navbar_theme = "navbar_dkred_gradient";
    if (localStorage["navbar_theme"]) {
        _navbar_theme = localStorage["navbar_theme"];
    } else {
        _navbar_theme = "navbar_dkred_gradient";
        localStorage["navbar_theme"] = "navbar_dkred_gradient";
    }
    var _path = "ac_css/" + _navbar_theme + ".css";
    $("#link_index").attr("href", _path);
    $scope.NAVBAR_THEME = _navbar_theme;


    $scope.showHideCarousel = function (event) {
        //event.stopPropagation();
        event.preventDefault();

        if ($('#storeslider_wrapper').css('display') === 'block') {
            $('.carousel_trim').css('display', 'none');
            $('#storeslider_wrapper').css('display', 'none');
        }
        else {
            $('.carousel_trim').css('display', 'block');
            $('#storeslider_wrapper').css('display', 'block');
            $("#storeslider").slick('slickPrev');
            $("#storeslider").slick('slickNext');
        }
    }

    $scope.changeBackgroundImage = function (event) {
        //event.stopPropagation();
        event.preventDefault();
        var x = 0
        for (x = 0; x < arBGs.length; x++) {
            if (_bgImage === arBGs[x]) { break; }
        }
        if (x + 1 < arBGs.length) {
            _bgImage = arBGs[x + 1];
        }
        else {
            x = 0;
            _bgImage = arBGs[x];
        }
        $("body").css('background-image', '');

        if (_bgImage === 'ac_img/bg0.jpg') {
            $("body").css("background-color", "#ffffff");
        }
        else {
            $("body").css("background", "#ffffff url(" + _bgImage + ") no-repeat center center fixed");
        }
        localStorage['bg_cart'] = _bgImage;
    }

    $scope.changeNavBar = function (css_name) {
        //event.stopPropagation();
        event.preventDefault();
        var _path = "ac_css/" + css_name + ".css";
        _navbar_theme = css_name;
        localStorage["navbar_theme"] = _navbar_theme;
        $("#link_index").attr("href", _path);
        return false;
    };
  

    $scope.changeAnimation = function (effect_name) {
        var e = '';
        if ($scope.myModel === 'carousel_img_video') {
            e = '.carousel_img_video';
        }
        else if ($scope.myModel === 'carousel_pill') {
            e = '.carousel_pill';
        }
        else if ($scope.myModel === 'store_img_video') {
            e = '.store_img_video';
        }
        else if ($scope.myModel === 'store_pill') {
            //e = '.nav-pills li';
            e = '.store_pill';
        }
        if (e.length > 0) {
            $(e).removeClass(function (index, css) {
                return (css.match(/(^|\s)hvr-\S+/g) || []).join(' ');
            });
            $(e).addClass(effect_name);
        }
    };

    // Author: Bill SerGio - An elegant way to set the active tab is to use ng-controller 
    // to run a single controller outside of the ng-view as shown below.
    $scope.isActive = function (viewLocation) {
        return viewLocation === $location.path();
    };

    $scope.loadData = function ($index) {
        //event.stopPropagation();
        event.preventDefault();
        $scope.selectedDataIndex = $index;
        localStorage["data_src_index"] = $index;
        window.location.reload();
        return false;
    }




    //initiate an array to hold all active tabs
    $scope.activeTabs = [];

    //check if the tab is active
    $scope.isOpenTab = function (tab) {
        //event.stopPropagation();
        event.preventDefault();

        //check if this tab is already in the activeTabs array
        if ($scope.activeTabs.indexOf(tab) > -1) {
            //if so, return true
            return true;
        } else {
            //if not, return false
            return false;
        }
    }

    //function to 'open' a tab
    $scope.openTab = function (tab) {
        //event.stopPropagation();
        event.preventDefault();

        //check if tab is already open
        if ($scope.isOpenTab(tab)) {
            //if it is, remove it from the activeTabs array
            $scope.activeTabs.splice($scope.activeTabs.indexOf(tab), 1);
        } else {
            $scope.activeTabs = [];
            //if it's not, add it!
            $scope.activeTabs.push(tab);
        }
        return false;
    }

    $scope.dataOptions = [
    { name: 'JSON Products File', showinfo: '', img: 'ac_img/_json_file.png' },
    { name: 'Local Database', showinfo: '', img: 'ac_img/_localdb.png' },
    { name: 'Remote Database', showinfo: '', img: 'ac_img/_remotedb.png' }
    ];

    // create a radioButtonGroup for our apply effects options
    $scope.optActions = [
        { id: 'apply', name: 'apply effect', disabled: false, showinfo: '' },
        { id: 'remove', name: 'remove effect', disabled: false, showinfo: '' }
    ];
    $scope.modelAction = 'apply';
    $scope.idProperty = "id";
    $scope.nameProperty = "name";
    $scope.bootstrapSuffix = "x-success";
    $scope.disabledProperty = false;
    $scope.showinfoProperty = "";


    // create a radioButtonGroup for our apply effects options
    //{ id: 'carousel_img_video', name: 'carousel img', disabled: false, showinfo: 'You need to download and install the AngularJS Slick Carousel to apply effects to the Carousel!' },
    //{ id: 'carousel_pill', name: 'carousel pill', disabled: false, showinfo: 'You need to download and install the AngularJS Slick Carousel to apply effects to the Carousel!' }
    $scope.myOptions = [
        { id: 'store_img_video', name: 'store img', disabled: false, showinfo: '' },
        { id: 'store_pill', name: 'store pill', disabled: false, showinfo: '' },
        { id: 'carousel_img_video', name: 'carousel img', disabled: false, showinfo: '' },
        { id: 'carousel_pill', name: 'carousel pill', disabled: false, showinfo: '' }
    ];
    $scope.myModel = 'store_img_video';
    $scope.idProperty = "id";
    $scope.nameProperty = "name";
    $scope.bootstrapSuffix = "xs-success";
    $scope.disabledProperty = false;
    $scope.showinfoProperty = "";


    //$('.carousel_img_video').removeClass(function (index, css) {
    //    return (css.match(/(^|\s)hvr-\S+/g) || []).join(' ');
    //});
    //$('.carousel_pill').addClass($scope.AN_CAROUSEL_IMG_VIDEO);

    //alert($scope.AN_CAROUSEL_IMG_VIDEO);
    //$('.carousel_pill').removeClass(function (index, css) {
    //    return (css.match(/(^|\s)hvr-\S+/g) || []).join(' ');
    //});
    //$('.carousel_pill').addClass($scope.AN_CAROUSEL_PILL);

    //$('.store_img_video').removeClass(function (index, css) {
    //    return (css.match(/(^|\s)hvr-\S+/g) || []).join(' ');
    //});
    //$('.store_img_video').addClass($scope.AN_STORE_IMG_VIDEO);

    //$('.nav-pills li').removeClass(function (index, css) {
    //    return (css.match(/(^|\s)hvr-\S+/g) || []).join(' ');
    //});
    //$('.nav-pills li').addClass($scope.AN_STORE_PILL);

});


storeApp.directive('radioButtonGroup', function () {
    return {
        restrict: 'E',
        scope: { model: '=', options: '=', id: '=', name: '=', suffix: '=', disabled: '=', showinfo: '=' },
        controller: function ($scope) {
            $scope.activate = function (option, $event) {
                if (option.showinfo.length > 0) {
                    alert(option.showinfo);
                    return false;
                }
                $scope.model = option[$scope.id];
                // stop click event to avoid Bootstrap toggling "active" class
                if ($event.stopPropagation) {
                    $event.stopPropagation();
                }
                if ($event.preventDefault) {
                    $event.preventDefault();
                }
                $event.cancelBubble = true;
                $event.returnValue = false;               
            };

            $scope.isActive = function (option) {
                return option[$scope.id] == $scope.model;
            };

            $scope.isDisabled = function (option) {
                return option[$scope.disabled] == $scope.model;
            };

            $scope.getName = function (option) {
                return option[$scope.name];
            }
        },
        template: "<button type='button' class='btn btn-{{suffix}}' " +
            "ng-class='{active: isActive(option)}'" +
            "ng-repeat='option in options' " +
            //The ng-disabled expression is evaluated in the present scope. Hence, 
            //you should NOT USE the extra interpolation with {{..}} which will not work:
            "ng-disabled=option.disabled ng-click='activate(option, $event)'><span ng-bind-html='getName(option) | unsafe'></span>" +
            "</button>"
    };
});




storeApp.controller('DialogCtrl', ['$scope', 'createDialog', function ($scope, createDialogService) {
    $scope.launchSimpleModal = function (item) {
        createDialogService('',
        {
            id: 'cart_display',
            title: item.productname,
            backdrop: true,
            imagename: item.imagename,
            productname: item.productname,
            PRODUCTS_FOLDER: $scope.PRODUCTS_FOLDER,
            description: item.description,
            showvideo: item.showvideo,
            videoid: item.videoid,
            shortdesc: item.shortdesc,
            success: { label: 'Very Cool', fn: function () { console.log('cart_display modal closed'); } }
        });
    };
}])

angular.module('storeMessages.services', []).factory('createDialog', ["$document", "$compile", "$rootScope", "$controller", "$timeout",
  function ($document, $compile, $rootScope, $controller, $timeout) {
      var defaults = {
          id: null,
          imagename: '',
          productname: '',
          PRODUCTS_FOLDER: '',
          description: '',
          showvideo: '',
          videoid: '',
          shortdesc: '',
          template: null,
          templateUrl: null,
          title: 'Default Title',
          backdrop: true,
          success: { label: 'OK', fn: null },
          cancel: { label: 'Close', fn: null },
          controller: null,
          backdropClass: "modal-backdrop",
          backdropCancel: true,
          footerTemplate: null,
          modalClass: "modal",
          css: {
              top: '100px',
              left: '0px',
              margin: '0 auto'
          }
      };
      var body = $document.find('body');

      return function Dialog(templateUrl/*optional*/, options, passedInLocals) {

          // Handle arguments if optional template isn't provided.
          if (angular.isObject(templateUrl)) {
              passedInLocals = options;
              options = templateUrl;
          } else {
              options.templateUrl = templateUrl;
          }

          options = angular.extend({}, defaults, options); //options defined in constructor

          var key;
          var idAttr = options.id ? ' id="' + options.id + '" ' : '';
          var defaultFooter = '<button class="btn btn-primary" ng-click="$modalCancel()">{{$modalCancelLabel}}</button>';
          var footerTemplate = '<div class="modal-footer">' +
        (options.footerTemplate || defaultFooter) +
        '</div>';
          var modalBody = (function () {
              if (options.template) {
                  if (angular.isString(options.template)) {
                      return '<div class="modal-body">' + options.template + '</div>';
                  } else {
                      // jQuery/JQlite wrapped object
                      return '<div class="modal-body">' + options.template.html() + '</div>';
                  }
              } else {
                  // Template url
                  return '<div class="modal-body" ng-include="\'' + options.templateUrl + '\'"></div>'
              }
          })();
          var modalEl = angular.element(
                '<div class="' + options.modalClass + ' fade"' + idAttr + ' style="display: block;">' +
                    '  <div class="modal-dialog">' +
                    '    <div class="modal-content">' +
                    '      <div class="modal-header">' +
                    '        <button type="button" class="close" ng-click="$modalCancel()">&times;</button>' +
                    '        <h2 ng-bind-html="$productname | unsafe"></h2>' +
                    '      </div>' +
          /* modalBody + */
                    '<div style="padding-left: 12px !important;overflow:scroll !important;">' +
                    '<div ng-show="$showvideo < 1">' +
                    '<img ng-src="{{$PRODUCTS_FOLDER}}/{{$imagename}}" alt="{{$productname}}" class="photopopup" style="max-width:280px;" ng-click="close()" />' +
                    '</div>' +
                    '<div ng-show="item.showvideo > 0">' +
                    '<iframe style="max-height: 225px !important;overflow:hidden;height:225px;width:300px" width="300" height="225" src="http://www.youtube.com/embed/{{$videoid}}" frameborder="0" allowfullscreen></iframe>' +
                    '</div>' +
                    '<span style="font-family:Arial Black;font-size:1.8em;font-weight:bold;" ng-bind-html="$productname | unsafe"></span><br />' +
                    '<p class="product_description" ng-bind-html="$description | unsafe"></p><br />' +
                    '</div>' +
                    footerTemplate +
                    '    </div>' +
                    '  </div>' +
                    '</div>');

          for (key in options.css) {
              modalEl.css(key, options.css[key]);
          }
          var divHTML = "<div ";
          if (options.backdropCancel) {
              divHTML += 'ng-click="$modalCancel()"';
          }
          divHTML += ">";
          var backdropEl = angular.element(divHTML);
          backdropEl.addClass(options.backdropClass);
          backdropEl.addClass('fade in');

          var handleEscPressed = function (event) {
              if (event.keyCode === 27) {
                  scope.$modalCancel();
              }
          };

          var closeFn = function () {
              body.unbind('keydown', handleEscPressed);
              modalEl.remove();
              if (options.backdrop) {
                  backdropEl.remove();
              }
          };

          body.bind('keydown', handleEscPressed);

          var ctrl, locals,
        scope = options.scope || $rootScope.$new();

          scope.$imagename = options.imagename;
          scope.$productname = options.productname;
          scope.$PRODUCTS_FOLDER = options.PRODUCTS_FOLDER;
          scope.$description = options.description;
          scope.$showvideo = options.showvideo;
          scope.$videoid = options.videoid;
          scope.$shortdesc = options.shortdesc;

          scope.$title = options.title;
          scope.$modalClose = closeFn;
          scope.$modalCancel = function () {
              var callFn = options.cancel.fn || closeFn;
              callFn.call(this);
              scope.$modalClose();
          };
          scope.$modalSuccess = function () {
              var callFn = options.success.fn || closeFn;
              callFn.call(this);
              scope.$modalClose();
          };
          scope.$modalSuccessLabel = options.success.label;
          scope.$modalCancelLabel = options.cancel.label;

          if (options.controller) {
              locals = angular.extend({ $scope: scope }, passedInLocals);
              ctrl = $controller(options.controller, locals);
              modalEl.contents().data('$ngControllerController', ctrl);
          }

          $compile(modalEl)(scope);
          $compile(backdropEl)(scope);
          body.append(modalEl);
          if (options.backdrop) body.append(backdropEl);

          $timeout(function () {
              modalEl.addClass('in');
          }, 200);
      };
  }]);




angular.module('igTruncate', []).filter('truncate', function () {
    return function (text, length, end) {
        if (text !== undefined) {
            if (isNaN(length)) {
                length = 10;
            }

            if (end === undefined) {
                end = "...";
            }

            if (text.length <= length || text.length - end.length <= length) {
                return text;
            } else {
                return String(text).substring(0, length - end.length) + end;
            }
        }
    };
});

storeApp.directive('aDisabled', function ($compile) {
    return {
        restrict: 'A',
        priority: -99999,
        link: function (scope, element, attrs) {
            scope.$watch(attrs.aDisabled, function (val, oldval) {
                if ( !! val) {
                    element.unbind('click');
                } else if (oldval) {
                    element.bind('click', function () {
                        scope.$apply(attrs.ngClick);
                    });
                }
            });
        }
    };
});


//            var key = 'responsive';
//            var fieldSettings = '[{
//                dots: false,
//                variableWidth: false,
//                arrows: true,
//                infinite: true,
//                speed: 300,
//                slidesToShow: 3,
//                slidesToScroll: 1,
//                autoplay: true,
//                autoplaySpeed: 3000,
//                responsive: [
//                    {
//                        breakpoint: 1024,
//                        settings: {
//                            slidesToShow: 3,
//                            slidesToScroll: 1,
//                            infinite: true,
//                            dots: false
//                        }
//                    },
//                    {
//                        breakpoint: 600,
//                        settings: {
//                            slidesToShow: 2,
//                            slidesToScroll: 1
//                        }
//                    },
//                    {
//                        breakpoint: 480,
//                        settings: {
//                            dots: false,
//                            slidesToShow: 1,
//                            slidesToScroll: 1
//                        }
//                    }
//                    // You can unslick at a given breakpoint now by adding:
//                    // settings: "unslick"
//                    // instead of a settings object
//                ]
//            }]';
//            $('#shitte').slickSetOption(key, fieldSettings, true);





//    $scope.load = function () {

//    }
//    //don't forget to call the load function
//    $scope.load();


//    $scope.$on('$viewContentLoaded', function () {
//        //alert("aaa");
//    });

//    $scope.slickConfig = {
//        onInit: function () {
//            jQuery(window).resize();
//            //console.log('slickcaroseal locded');
//        },
//        dots: false,
//        variableWidth: false,
//        arrows: true,
//        infinite: true,
//        speed: 300,
//        slidesToShow: 3,
//        slidesToScroll: 1,
//        autoplay: true,
//        autoplaySpeed: 3000,
//        responsive: [
//    {
//        breakpoint: 1024,
//        settings: {
//            slidesToShow: 3,
//            slidesToScroll: 1,
//            infinite: true,
//            dots: false
//        }
//    },
//    {
//        breakpoint: 600,
//        settings: {
//            slidesToShow: 2,
//            slidesToScroll: 1
//        }
//    },
//    {
//        breakpoint: 480,
//        settings: {
//            dots: false,
//            slidesToShow: 1,
//            slidesToScroll: 1
//        }
//    }]
//    };


//alert("effect_name: " + effect_name);
//$('.store_img_video_wrapper').attr('class', function (i, c) {
//    return c.replace(/(^|\s)hvr-\S+/g, '');
//});
//$('.store_img_video_wrapper').addClass(effect_name);

//$scope.$apply(function () {
//    $scope.STORE_ANIMATION = effect_name;
//});

/*.nav-pills li:hover{
    background-color: #0088cc !important;  
    color:#fff !important;  
    box-shadow: 0 2px 6px rgba(0,0,0,0.5) !important;    
}*/

//AN_CAROUSEL_IMG_VIDEO);
//AN_CAROUSEL_PILL);
//AN_STORE_IMG_VIDEO);
//AN_STORE_PILL);


//function mycontroller($scope) {
//    $scope.myfunction = function () {
//        //do some stuff here
//    }
//}

//$scope.forceAddItem = function (sku, productname, unitprice, quantity) {
//    DataService.cart.addItemUrl(sku, productname, unitprice, quantity);
//};

//projectsApp.factory("Project", function ($http) {
//    var json = $http.get("project.json").then(function (response) {
//        return response.data;
//    });

//    var Project = function (data) {
//        if (data) angular.copy(data, this);
//    };

//    Project.query = function () {
//        return json.then(function (data) {
//            return data.map(function (project) {
//                return new Project(project);
//            });
//        })
//    };

//    Project.get = function (id) {
//        return json.then(function (data) {
//            var result = null;
//            angular.forEach(data, function (project) {
//                if (project.CF_STORE_ID == id) result = new Project(project);
//            });
//            return result;
//        })
//    };

//    return Project;
//});