'use strict';

// App Module: the name AngularStore matches the ng-app attribute in the main <html> tag
// the route provides parses the URL and injects the appropriate partial page
// Note: I don't recommend passing in'ui.bootstrap' as a dependency because of potential update issues
// If you do add ui.bootstrap then also add:
// <script src="ac_js/ui-bootstrap.min.js" type="text/javascript"></script>
// <script src="ac_js/ui-bootstrap-tpls-0.12.1.min.js" type="text/javascript"></script>
// var storeApp = angular.module('AngularStore', ['ui.bootstrap', 'favicon'])
//
var storeApp = angular.module('AngularStore', ['favicon', 'storeMessages.services'])
  .config(['$routeProvider', function ($routeProvider) {
    //var _isNotMobile = (function () {
    //    var check = false;
    //    (function (a) { if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true })(navigator.userAgent || navigator.vendor || window.opera);
    //    return !check;
    //})();

  $routeProvider.
    when('/store', {
        // DO NOT Swap out different HTML because you want to say, hide a video etc.
        // Author: DO NOT switch views here based on mobile vs. laptop because it only works ONE time 
        // when AngularJS Bootstrap itself the FIRST Time and no switch after that !!!
        //templateUrl: (_isNotMobile) ? 'ac_partials/store.htm' : 'ac_partials/store_mobile.htm',
        templateUrl: 'ac_partials/store.htm',
        controller: storeController
    }).
    when('/products/:productSku', {
        templateUrl: 'ac_partials/product.htm',
        //templateUrl: (_isNotMobile) ? 'ac_partials/product.htm' : 'ac_partials/product_mobile.htm',
        controller: storeController
    }).
    when('/cart', {
        templateUrl: 'ac_partials/cart.htm',
        //templateUrl: (_isNotMobile) ? 'ac_partials/cart.htm' : 'ac_partials/cart_mobile.htm',
        controller: storeController
    }).
    otherwise({
        redirectTo: '/store'
    });
  } ]);




//function detectmob() {
//    if (window.innerWidth <= 800 && window.innerHeight <= 600) {
//        return true;
//    } else {
//        return false;
//    }
//}

// the storeController contains two objects & the DataService:
// - store: contains the product list
// - cart: the shopping cart object
// - DataService: called to retrieve products from JSON file
function storeController($scope, $filter, $routeParams, DataService) {
    $scope.isActive = false;
    $scope.sections = [{ name: 'list', class: 'cbp-vm-icon cbp-vm-list' }];

    $scope.setMaster = function (section) {
        $scope.selected = section;
        $scope.isActive = !$scope.isActive;

        // let's flip our icons.
        //<a href="#" class="cbp-vm-icon cbp-vm-grid cbp-vm-selected" data-view="cbp-vm-view-grid">Grid View</a>
        //<a href="#" class="cbp-vm-icon cbp-vm-list" data-view="cbp-vm-view-list">List View</a>
        if (section.class.toString() === 'cbp-vm-icon cbp-vm-grid') {
            $scope.sections = [{ name: 'list', class: 'cbp-vm-icon cbp-vm-list'}];
        }
        else {
            $scope.sections = [{ name: 'grid', class: 'cbp-vm-icon cbp-vm-grid'}];
        }
    }

    $scope.isSelected = function (section) {
        return $scope.selected === section;
    }

    $scope.fToggleOverlay = function () {
        $scope.overlayFlag = !$scope.overlayFlag; // toggle state of overlay flag.
    };

    $scope.filteredItems = [];
    $scope.groupedItems = [];
    $scope.pagedItems = [];

    $scope.currentPage = 1;
    $scope.pageSize = 9;
    $scope.maxSize = 25;

    // get store & cart from service
    $scope.store = DataService.store;
    $scope.cart = DataService.cart;
    $scope.products = [];

    // use routing to pick the selected product
    if ($routeParams.productSku != null) {
        $scope.product = $scope.store.getProduct($routeParams.productSku);
    }

    DataService.store.getProducts().then(function (data) {

        //Executes when AJAX call completes
        $scope.products = data;

        $scope.numberOfPages = function () {
            return Math.ceil($scope.products.length / $scope.pageSize);
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
        $scope.myFilter = function (categoryname) {
            //$('#searchfield').val('');
            $scope.filteredItems = $filter('filter')($scope.products, function (product) {
                for (var attr in product) {
                    if (searchMatch(product[categoryname], $scope.query))
                        return true;
                }
                return false;
            });
            $scope.currentPage = 0;
            $scope.groupToPages();
        };
        $scope.myFilter = function (column, categoryname) {
            //$('#searchfield').val('');
            $scope.filteredItems = $filter('filter')($scope.products, function (product) {
                for (var attr in product) {
                    if (searchMatch(product[column], categoryname))
                        return true;
                }
                return false;
            });
            $scope.currentPage = 0;
            $scope.groupToPages();
        };
        $scope.groupToPages = function () {
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
        $scope.myFilter();
        $scope.search();
    });

    //$(window).on("resize.doResize", function () {
    //    //alert(window.innerWidth);

    //    if (window.innerWidth <= 800 && window.innerHeight <= 600) {
    //        $scope.$apply(function () {
    //            //do something to update current scope based on the new innerWidth and let angular update the view.
    //            $scope.sections = [{ name: 'grid', class: 'cbp-vm-icon cbp-vm-grid' }];
    //        });
    //        return true;
    //    } else {
    //        return false;
    //    }
    //});

    //$scope.$on("$destroy", function () {
    //    $(window).off("resize.doResize"); //remove the handler added earlier
    //});

}


//We already have a limitTo filter built-in to angular,
//let's make a startFrom filter
storeApp.filter('startFrom', function () {
    return function (input, start) {
        start = +start; //parse to int
        return input.slice(start);
    }
});

// create a data service that provides a store and a shopping cart that
// will be shared by all views (instead of creating fresh ones for each view).
storeApp.factory('DataService', function ($http, $q) {

    function Store() {
        var productsDeferred = $q.defer();
        this.products = productsDeferred.promise; //this.products is a promise
        $http.get('ac_products/products.txt').success(function (data) {
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

    // create shopping cart
    var myCart = new shoppingCart("AngularStore");

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


// dialog is injected in the specified controller
function EditCtrl($scope, item, dialog) {
    $scope.item = item;
    $scope.save = function () {
        dialog.close($scope.item);
    };
    $scope.close = function () {
        dialog.close(undefined);
    };
}

function MyMenu($scope, $location) {
    $scope.name = 'MyMenu';
    $scope.isCollapsed = false;

    $scope.changeBackgroundImage = function (event) {
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
    
    $scope.changeColor = function (event) {
        event.preventDefault();

        $('#picker').colpick();

        //$("body").css('background-image', '');
        //$("body").css("background", "#ffffff url(" + _bgImage + ") no-repeat center center fixed");
        //localStorage['bg_cart'] = _bgImage;
    }

    $scope.changeNavBar = function (css_name) {
        event.preventDefault();
        var _path = "ac_css/" + css_name + ".css";
        $("#link_index").attr("href", _path);

        _navbar_theme = css_name;
        localStorage["navbar_theme"] = _navbar_theme;

        return false;
    }

    // Author: Bill SerGio - An elegant way to set the active tab is to use ng-controller 
    // to run a single controller outside of the ng-view as shown below.
    $scope.isActive = function (viewLocation) {
        return viewLocation === $location.path();
    };
}



storeApp.controller('DialogCtrl', ['$scope', 'createDialog', function ($scope, createDialogService) {
	$scope.launchSimpleModal = function(item) {
	    createDialogService('', 
        {
            id: 'cart_display',
            title: item.productname,
            backdrop: true,
            imagename: item.imagename,
            productname: item.productname,
            description: item.description,
            showvideo: item.showvideo,
            videoid: item.videoid,
            shortdesc: item.shortdesc,
            success: { label: 'Very Cool', fn: function () { console.log('cart_display modal closed'); } }
        });
	};
} ])

angular.module('storeMessages.services', []).factory('createDialog', ["$document", "$compile", "$rootScope", "$controller", "$timeout",
  function ($document, $compile, $rootScope, $controller, $timeout) {
      var defaults = {
          id: null,
          imagename: '',
          productname: '',
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
                    '<img ng-src="ac_products/{{$imagename}}" alt="{{$productname}}" class="photopopup" style="max-width:280px;" ng-click="close()" />' +
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
  } ]);






