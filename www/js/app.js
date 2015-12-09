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
                ukonczoneZadania: '0',
                wszystkieZadania: '0',
                notyfikacjeDisplay: 'none',
                notyfikacje: '0',
                zadaniaPrzypisaneDoUzytkownika: '0',
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
                        basicItem:'block',
                        milestone:'none',
                        data: '14.12.2015 12:00',
                        dataDzien:'14',
                        dataMiesiac:'GRU',
                        dataGodzina:'12:00',
                        notyfikacjeDisplay: 'none',
                        notyfikacje: '3',
                        lokalizacjaDisplay:'block',
                        brakOsobyDisplay:'none',
                        ukonczoneDisplay:'none',
                        avatarPierwszejOsoby: 'http://themina.net/themes/shema/img/demo/team/team_img_3.jpg',
                        dotatkoweOsoby:'1',
                        dodatkoweOsobyDisplay:'inline-block',
                        nazwa: 'Preztacja projektu',
                        priorytet:'prioImportant0',
                        statusUzytkownika: 'w trakcie',
                        statusClass: 'completionHalf',
                        czasUzytkownika: '12:23',
                        kasaUzytkownika: '215zł',
                        punktyUzytkownika: '5',
                        dodatkowaKlasaListy:'currentUser'
                  },
                    {
                        basicItem:'block',
                        milestone:'none',
                        data: '14.12.2015 12:00',
                        dataDzien:'14',
                        dataMiesiac:'GRU',
                        dataGodzina:'12:00',
                        notyfikacjeDisplay: 'none',
                        notyfikacje: '3',
                        lokalizacjaDisplay:'block',
                        brakOsobyDisplay:'none',
                        ukonczoneDisplay:'none',
                        avatarPierwszejOsoby: 'http://themina.net/themes/shema/img/demo/team/team_img_3.jpg',
                        dotatkoweOsoby:'1',
                        dodatkoweOsobyDisplay:'inline-block',
                        nazwa: 'Preztacja projektu',
                        priorytet:'prioLow',
                        statusUzytkownika: 'w trakcie',
                        statusClass: 'completionHalf',
                        czasUzytkownika: '12:23',
                        kasaUzytkownika: '215zł',
                        punktyUzytkownika: '5',
                        dodatkowaKlasaListy:'currentUser'
                  },
                    {
                        basicItem:'block',
                        milestone:'none',
                        data: '17.12.2015 12:00',
                        dataDzien:'17',
                        dataMiesiac:'GRU',
                        dataGodzina:'12:00',
                        notyfikacjeDisplay: 'block',
                        notyfikacje: '3',
                        lokalizacjaDisplay:'none',
                        brakOsobyDisplay:'none',
                        ukonczoneDisplay:'none',
                        avatarPierwszejOsoby: 'http://lcars.ucip.org/images/a/ac/Jason-statham07.jpg',
                        dotatkoweOsoby:'2',
                        dodatkoweOsobyDisplay:'inline-block',
                        nazwa: 'Preztacja projektu',
                        priorytet:'prioNormal',
                        statusUzytkownika: 'oczekuje',
                        statusClass: 'completionHalf',
                        czasUzytkownika: '12:23',
                        kasaUzytkownika: '215zł',
                        punktyUzytkownika: '5',
                        dodatkowaKlasaListy:'currentUser'
                  },
                    {
                        basicItem:'block',
                        milestone:'none',
                        data: '02.12.2015 12:00',
                        dataDzien:'02',
                        dataMiesiac:'GRU',
                        dataGodzina:'12:00',
                        notyfikacjeDisplay: 'none',
                        notyfikacje: '3',
                        lokalizacjaDisplay:'none',
                        brakOsobyDisplay:'none',
                        ukonczoneDisplay:'block',
                        avatarPierwszejOsoby: 'http://themina.net/themes/shema/img/demo/team/team_img_3.jpg',
                        dotatkoweOsoby:'1',
                        dodatkoweOsobyDisplay:'inline-block',
                        nazwa: 'Preztacja projektu',
                        priorytet:'prioFinished',
                        statusUzytkownika: 'ukończone',
                        statusClass: 'completionHalf',
                        czasUzytkownika: '12:23',
                        kasaUzytkownika: '215zł',
                        punktyUzytkownika: '5',
                        dodatkowaKlasaListy:'currentUser'
                  },
                       {
                        basicItem:'block',
                        milestone:'none',
                        data: '05.12.2015 14:00',
                        dataDzien:'05',
                        dataMiesiac:'GRU',
                        dataGodzina:'14:00',
                        notyfikacjeDisplay: 'none',
                        notyfikacje: '3',
                        lokalizacjaDisplay:'none',
                        brakOsobyDisplay:'block',
                        ukonczoneDisplay:'none',
                        avatarPierwszejOsoby: 'https://dl.dropboxusercontent.com/u/28981503/noPerson.png',
                        dotatkoweOsoby:'0',
                        dodatkoweOsobyDisplay:'none',
                        nazwa: 'Przygotowanie prezentacji opisującej projekt',
                        priorytet:'prioImportant',
                        statusUzytkownika: 'oczekuje',
                        statusClass: 'completionHalf',
                        czasUzytkownika: '0',
                        kasaUzytkownika: '0',
                        punktyUzytkownika: '0',
                        dodatkowaKlasaListy:''
                  },
                     {
                        basicItem:'none',
                        milestone:'block',
                        mileStoneNaglowek:'Milestone 1',
                        milestoneUkonczoneZadaniaProcent:'50',
                        milestoneWykorzystanyBudzetPieniadze:'90',
                        milestoneWykorzystanyBudzetGodziny:'60',
                        data: '09.12.2015 12:00',
                        avatarPierwszejOsoby: 'http://themina.net/themes/shema/img/demo/team/team_img_3.jpg',
                        nazwa: 'Preztacja projektu milestone',
                        statusUzytkownika: 'w trakcie',
                        statusClass: 'completionHalf',
                        czasUzytkownika: '12:23',
                        kasaUzytkownika: '215zł',
                        punktyUzytkownika: '5',
                        dodatkowaKlasaListy:'currentUser'
                  },
                    {
                        basicItem:'none',
                        milestone:'block',
                        mileStoneNaglowek:'Milestone 2',
                        milestoneUkonczoneZadaniaProcent:'0',
                        milestoneWykorzystanyBudzetPieniadze:'30',
                        milestoneWykorzystanyBudzetGodziny:'40',
                        data: '23.12.2015 18:00',
                        avatarPierwszejOsoby: 'http://themina.net/themes/shema/img/demo/team/team_img_3.jpg',
                        nazwa: 'Preztacja projektu milestone',
                        statusUzytkownika: 'w trakcie',
                        statusClass: 'completionHalf',
                        czasUzytkownika: '12:23',
                        kasaUzytkownika: '215zł',
                        punktyUzytkownika: '5',
                        dodatkowaKlasaListy:'currentUser'
                  }
              ],
                przypisaneOsoby: [
                    {
                        avatar: 'http://themina.net/themes/shema/img/demo/team/team_img_3.jpg',
                        iloscZadan: 3,
                        stawka:'20zł',
                        imie:'Natalia Kowalska',
                        czasUzytkownika:'12:22',
                        kasaUzytkownika:'200.50',
                        punktyUzytkownika:'4'
                  },
                    {
                        avatar: 'http://themina.net/themes/shema/img/demo/team/team_img_3.jpg',
                        iloscZadan: 1,
                        stawka:'50zł',
                        imie:'Natalia Kowalska',
                        czasUzytkownika:'12:22',
                        kasaUzytkownika:'100.50',
                        punktyUzytkownika:'4'
                  },
                    {
                        avatar: 'http://themina.net/themes/shema/img/demo/team/team_img_3.jpg',
                        iloscZadan: 12,
                        stawka:'80zł',
                        imie:'Natalia Kowalska',
                        czasUzytkownika:'12:22',
                        kasaUzytkownika:'100.50',
                        punktyUzytkownika:'4'
                  }
              ]
          }
      ];
        return projekty;
    });

})();