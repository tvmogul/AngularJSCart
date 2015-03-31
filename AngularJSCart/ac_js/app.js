'use strict';

// App Module: the name AngularStore matches the ng-app attribute in the main <html> tag
// the route provides parses the URL and injects the appropriate partial page
// Note: I don't recommend passing in'ui.bootstrap' as a dependency UNLESS you love update issues
//
var storeApp = angular.module('AngularStore', ['ngRoute', 'storeApp.config', 'favicon', 'igTruncate']).
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


// the storeController contains two objects & the DataService:
// - store: contains the product list
// - cart: the shopping cart object
// - DataService: called to retrieve products from JSON file
storeApp.controller('storeController', function ($scope, $filter, $routeParams, $location, DataService, $sce, CONFIG) {
    $scope.dataLoaded = false;

    /*#####################
    CONFIG
    ######################*/
    /* our global variabls */
    $scope.STORE_ID = CONFIG.STORE_ID;
    $scope.STORE_PAGE = CONFIG.STORE_PAGE;
    $scope.STORE_BG_IMAGE = CONFIG.STORE_BG_IMAGE;
    $scope.DISTRIBUTOR_ID = CONFIG.DISTRIBUTOR_ID;
    $scope.PRODUCTS_FILE = CONFIG.PRODUCTS_FILE;
    $scope.PRODUCTS_FOLDER = CONFIG.PRODUCTS_FOLDER;
    $scope.NAVBAR_THEME = CONFIG.NAVBAR_THEME;
    $scope.NAVBAR_LOGO_TEXT = CONFIG.NAVBAR_LOGO_TEXT;
    $scope.NAVBAR_LOGO_LINK = CONFIG.NAVBAR_LOGO_LINK;
    $scope.INSIDE_HEADER_SHOW = CONFIG.INSIDE_HEADER_SHOW;
    $scope.INSIDE_HEADER_LINK = CONFIG.INSIDE_HEADER_LINK;
    $scope.INSIDE_HEADER_IMAGE = CONFIG.INSIDE_HEADER_IMAGE;
    $scope.INSIDE_HEADER_TITLE = CONFIG.INSIDE_HEADER_TITLE;
    $scope.CAROUSEL_SHOW = CONFIG.CAROUSEL_SHOW;
    $scope.SYSTEM_NAME = CONFIG.SYSTEM_NAME;
    $scope.SYSTEM_LANGUAGE = CONFIG.SYSTEM_LANGUAGE;
    $scope.BASE_URL = CONFIG.BASE_URL;
    $scope.API_URL = CONFIG.API_URL;
    $scope.GOOGLE_ANALYTICS_ID = CONFIG.GOOGLE_ANALYTICS_ID;
    /* for future versions */
    //$scope.DB = CONFIG.DB;
    //$scope.DATABASENAME = CONFIG.DATABASENAME;
    //$scope.TABLE1 = CONFIG.TABLE1;
    //$scope.TABLE2 = CONFIG.TABLE2;
    //$scope.KEYPATH1 = CONFIG.KEYPATH1;
    //$scope.KEYPATH2 = CONFIG.KEYPATH2;
    //$scope.INDEX1 = CONFIG.INDEX1;
    //$scope.INDEX2 = CONFIG.INDEX2;
    //$scope.INDEX3 = CONFIG.INDEX3;
    //$scope.DB_VERSION = CONFIG.DB_VERSION;
    //$scope.GLOBALCOUNTER = CONFIG.GLOBALCOUNTER;
    //$scope.LOADED = CONFIG.LOADED;
    //$scope.SERVICEORDERS = CONFIG.SERVICEORDERS;

    $scope.filteredItems = [];
    $scope.groupedItems = [];
    $scope.pagedItems = [];

    $scope.currentPage = 1;
    $scope.pageSize = 9;

    $scope.products = [];
    $scope.slides = [];

    $scope.isActive = false;

    /* AUTHOR: BILL SERGIO - To start with I wanted to include a Pinterest Style Layout so I decided to use a common one that
       I have seen used often, namely, Codrops famous ViewModeSwitch, that you can find at: https://github.com/codrops/ViewModeSwitch.  
       ViewModeSwitch is a CSS solution which can be incorporated "AS IS" into an AnglarJS project that dozens of people have copied 
       for use in both AngularJS and non-AngularJS shopping carts. It provides the CSS Styling and animation used in this project.
    */
    $scope.sections = [{ name: 'list', class: 'cbp-vm-icon cbp-vm-list' }];

    $scope.updateDisplay = function (section) {
        $scope.selected = section;
        $scope.isActive = !$scope.isActive;

        // let's flip our icons. 
        // SEE: https://github.com/codrops/ViewModeSwitch.  
        // Code below is from Codrops ViewModeSwitch:
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
        // BILL SERGIO - Code below alows Links on NON-AngularJS websitesis to "add to cart" 
        // The standard "getUrlVars" has a LOT of bugs but the code below works perfectly!
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
        var _distid = $scope.getUrlVar('distid');
        if (_distid.length > 0) {
            // Do something with _distid so you can pay the commissions you owe!
        }
        //////////////////////////////////////////////////////////////////////////////

        /* AUTHOR: BILL SERGIO - the code for pagination comes DIRECTLY from:
        // http://fdietz.github.io/recipes-with-angular-js/common-user-interface-patterns/paginating-using-infinite-results.html
        */

        $scope.pageCount = function () {
            return Math.ceil($scope.products.length / $scope.pageSize);
        };

        $scope.nextPage = function () {
            if($scope.currentPage >= Math.ceil($scope.products.length / $scope.pageSize) - 1) {
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

    }); /* END - DataService */

});

//$scope.numPages = function () {
//    return Math.ceil($scope.products.length / $scope.numPerPage);
//};

//$scope.$watch('currentPage + numPerPage', function () {
//    var begin = (($scope.currentPage - 1) * $scope.numPerPage);
//    var end = begin + $scope.numPerPage;
//    $scope.filteredProducts = $scope.products.slice(begin, end);
//});

 // create a data service that provides a store and a shopping cart that
// will be shared by all views (instead of creating fresh ones for each view).
storeApp.factory('DataService', function ($http, $q, CONFIG) {

    function Store() {
        var productsDeferred = $q.defer();
        this.products = productsDeferred.promise; //this.products is a promise
        $http.get(CONFIG.PRODUCTS_FILE).success(function (data) {
            var products = [];
            for (var i = 0, len = data.length; i < len; i++) {
                var prod = data[i];
                if (prod.storeid == "7cc6cb94-0938-4675-b84e-6b97ada53978") {
                    products.push(prod);
                }
            }
            productsDeferred.resolve(products);
        });
    }

    Store.prototype.getProduct = function (sku) {
        return this.products.then(function (products) {
            for (var i = 0; i < products.length; i++) { // MUST use products, it's the real value; this.products is a promise
                if (products[i].sku == sku)
                    return products[i];
            }
            return null;
        });
    };

    Store.prototype.getProducts = function () {
        return this.products.then(function (products) {
            return products;
        });
    };

    // create store
    var myStore = new Store();

    // create shopping cart and pass in out CONFIG!!!
    var myCart = new shoppingCart("AngularStore", CONFIG);

    // enable PayPal checkout
    // note: the second parameter identifies the merchant; in order to use the 
    // shopping cart with PayPal, you have to create a merchant account with 
    // PayPal. You can do that here:
    // https://www.paypal.com/webapps/mpp/merchant
    //myCart.addCheckoutParameters("PayPal", "paypaluser@youremail.com");
    myCart.addCheckoutParameters("PayPal", "paypaluser@youremail.com");

    // enable Google Wallet checkout
    // note: the second parameter identifies the merchant; in order to use the 
    // shopping cart with Google Wallet, you have to create a merchant account with 
    // Google. You can do that here:
    // https://developers.google.com/commerce/wallet/digital/training/getting-started/merchant-setup
    myCart.addCheckoutParameters("Google", "GooGle_Wallet_ID",
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
    myCart.addCheckoutParameters("Stripe", "pk_test_stripe",
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

storeApp.directive('myYoutube', function ($sce) {
    return {
        restrict: 'EA',
        scope: { code: '=' },
        replace: true,
        template: '<div class="video-container" style="height:200px !important;"><iframe style="overflow:hidden;max-height:200px !important;max-width:300px !important" src="{{url}}" frameborder="0" allowfullscreen></iframe></div>',
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
    $scope.STORE_ID = CONFIG.STORE_ID;
    $scope.STORE_PAGE = CONFIG.STORE_PAGE;
    $scope.STORE_BG_IMAGE = CONFIG.STORE_BG_IMAGE;
    $scope.PRODUCTS_FILE = CONFIG.PRODUCTS_FILE;
    $scope.PRODUCTS_FOLDER = CONFIG.PRODUCTS_FOLDER;
    $scope.NAVBAR_THEME = CONFIG.NAVBAR_THEME;
    $scope.NAVBAR_LOGO_TEXT = CONFIG.NAVBAR_LOGO_TEXT;
    $scope.NAVBAR_LOGO_LINK = CONFIG.NAVBAR_LOGO_LINK;
    $scope.INSIDE_HEADER_SHOW = CONFIG.INSIDE_HEADER_SHOW;
    $scope.INSIDE_HEADER_LINK = CONFIG.INSIDE_HEADER_LINK;
    $scope.INSIDE_HEADER_IMAGE = CONFIG.INSIDE_HEADER_IMAGE;
    $scope.INSIDE_HEADER_TITLE = CONFIG.INSIDE_HEADER_TITLE;
    $scope.CAROUSEL_SHOW = CONFIG.CAROUSEL_SHOW;
    $scope.SYSTEM_NAME = CONFIG.SYSTEM_NAME;
    $scope.SYSTEM_LANGUAGE = CONFIG.SYSTEM_LANGUAGE;
    $scope.BASE_URL = CONFIG.BASE_URL;
    $scope.API_URL = CONFIG.API_URL;
    $scope.GOOGLE_ANALYTICS_ID = CONFIG.GOOGLE_ANALYTICS_ID;


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

    _navbar_theme = "navbar_gray_gradient";
    if (localStorage["navbar_theme"]) {
        _navbar_theme = localStorage["navbar_theme"];
    } else {
        _navbar_theme = "navbar_gray_gradient";
        localStorage["navbar_theme"] = "navbar_gray_gradient";
    }
    var _path = "ac_css/" + _navbar_theme + ".css";
    $("#link_index").attr("href", _path);
    $scope.NAVBAR_THEME = _navbar_theme;

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
        $("body").css("background", "#ffffff url(" + _bgImage + ") no-repeat center center fixed");
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

    // Author: Bill SerGio - An elegant way to set the active tab is to use ng-controller 
    // to run a single controller outside of the ng-view as shown below.
    $scope.isActive = function (viewLocation) {
        return viewLocation === $location.path();
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
                    '        <h2 ng-bind-html-unsafe="$productname"></h2>' +
                    '      </div>' +
          /* modalBody + */
                    '<div style="padding-left: 12px !important;overflow:scroll !important;">' +
                    '<div ng-show="$showvideo < 1">' +
                    '<img ng-src="{{$PRODUCTS_FOLDER}}/{{$imagename}}" alt="{{$productname}}" class="photopopup" style="max-width:280px;" ng-click="close()" />' +
                    '</div>' +
                    '<div ng-show="item.showvideo > 0">' +
                    '<iframe style="max-height: 225px !important;overflow:hidden;height:225px;width:300px" width="300" height="225" src="http://www.youtube.com/embed/{{$videoid}}" frameborder="0" allowfullscreen></iframe>' +
                    '</div>' +
                    '<span style="font-family:Arial Black;font-size:1.8em;font-weight:bold;" ng-bind-html-unsafe="$productname"></span><br />' +
                    '<p class="product-desc" ng-bind-html-unsafe="$description"></p><br />' +
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


