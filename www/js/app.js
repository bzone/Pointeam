(function () {
    'use strict';
    var module = angular.module('app', ['onsen']);

    module.controller('AppController', function ($scope, $projekty) {
        $scope.doSomething = function () {
            setTimeout(function () {
                ons.notification.alert({
                    message: 'tapped'
                });
            }, 100);
        };


        $scope.goToDashboard = function () {

            $('.page__background').toggleClass('simpleBG');
            $('.tabMojeZadania').css('display', 'none');
            $('.tabProjekty').css('display', 'none');
            $('.homeTabs').css('display', 'none');
            $(this).css('display', 'none');
            $('.tabDashboard').css('overflow', 'initial');
            $('.tabDashboard').css('height', 'auto');
            $('#goToList').css('display', 'inline-block');

        };

        $scope.addProject = function () {
            var nazwa = $('#nazwaProjektu').val();
            $scope.items = $projekty.items;
            var item = {
                tytul: nazwa,
                krotkitytul: nazwa,
                avatarAdmina: 'http://themina.net/themes/shema/img/demo/team/team_img_3.jpg',
                statusUzytkownika: 'oczekuje',
                statusClass: 'completionHalf',
                czasUzytkownika: '00:00',
                kasaUzytkownika: '0zł',
                punktyUzytkownika: '0',
                procentUkonczeniaProjektu: '0',
                notyfikacjeDisplay: 'none',
                notyfikacje: '0',
                przypisaneOsoby: [
                    {
                        avatar: 'http://themina.net/themes/shema/img/demo/team/team_img_3.jpg',
                        iloscZadan: 3,
                  },
                    {
                        avatar: 'http://themina.net/themes/shema/img/demo/team/team_img_3.jpg',
                        iloscZadan: 1,
                  },
                    {
                        avatar: 'http://themina.net/themes/shema/img/demo/team/team_img_3.jpg',
                        iloscZadan: 12,
                  }
              ]
            };
            $scope.items.push(item);
            var index = $scope.items.length;
            var selectedItem = $projekty.items[index - 1];
            $projekty.selectedItem = selectedItem;
            $scope.navi.pushPage('procjectview.html', {
                title: selectedItem.tytul
            });
        }
    });

    module.controller('DetailController', function ($scope, $projekty) {
        $scope.item = $projekty.selectedItem;
    });

    module.controller('MasterController', function ($scope, $projekty) {
        $scope.items = $projekty.items;
        $scope.showDetail = function (index) {
            var selectedItem = $projekty.items[index];
            $projekty.selectedItem = selectedItem;
            $scope.navi.pushPage('procjectview.html', {
                title: selectedItem.tytul
            });
        };

    });


    module.factory('$projekty', function () {
        var projekty = {};
        projekty.items = [
            {
                tytul: 'Strona internetowa pointeam',
                krotkitytul: 'Strona inter...',
                avatarAdmina: 'http://themina.net/themes/shema/img/demo/team/team_img_3.jpg',
                statusUzytkownika: 'w trakcie',
                statusClass: 'completionHalf',
                czasUzytkownika: '12:23',
                kasaUzytkownika: '215zł',
                punktyUzytkownika: '5',
                procentUkonczeniaProjektu: '30',
                ukonczoneZadania: '3',
                wszystkieZadania: '10',
                notyfikacjeDisplay: 'block',
                notyfikacje: '3',
                zadaniaPrzypisaneDoUzytkownika: '2',
                zadaniaNieprzypisane: '0',
                terminy: [
                    {
                        data: '12.12.2015 12:00',
                        nazwa: 'Preztacja projektu'
                  },
                    {
                        data: '22.12.2015 15:00',
                        nazwa: 'Zakonczenie projektu'
                  }
              ],
                zadania: [
                    {
                        data: '12.12.2015 12:00',
                        nazwa: 'Preztacja projektu',
                        statusUzytkownika: 'w trakcie',
                        statusClass: 'completionHalf',
                        czasUzytkownika: '12:23',
                        kasaUzytkownika: '215zł',
                        punktyUzytkownika: '5'
                  },
                    {
                        data: '22.12.2015 15:00',
                        nazwa: 'Zakonczenie projektu',
                        statusUzytkownika: 'w trakcie',
                        statusClass: 'completionHalf',
                        czasUzytkownika: '15:23',
                        kasaUzytkownika: '15zł',
                        punktyUzytkownika: '0'
                  }
              ],
                przypisaneOsoby: [
                    {
                        avatar: 'http://themina.net/themes/shema/img/demo/team/team_img_3.jpg',
                        iloscZadan: 3,
                  },
                    {
                        avatar: 'http://themina.net/themes/shema/img/demo/team/team_img_3.jpg',
                        iloscZadan: 1,
                  },
                    {
                        avatar: 'http://themina.net/themes/shema/img/demo/team/team_img_3.jpg',
                        iloscZadan: 12,
                  }
              ]
          }
      ];
        return projekty;
    });

})();