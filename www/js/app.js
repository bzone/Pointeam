(function () {
    'use strict';
    var module = angular.module('app', ['onsen']);
    var logType = 'wszystkie';
    var searchText = 'nie ma takiej mozliwosci';

    module.filter('logfilter', function () {
        return function (items, search) {
            if (logType == 'wszystkie') {
                return items
            } else {
                return items.filter(function (element, index, array) {
                    return element.typ == logType;
                });
            }
        };
    });

    module.filter('searchText', function () {
        return function (items, search) {
            var searchText = element(by.model('searchText'));
            if (searchText == '') {
                return items.filter(function (element, index, array) {
                    return element.email == "nie ma takiej mozliwosci";
                });
            } else {
                return items.filter(function (element, index, array) {
                    return element.email == searchText;
                });
            }
        };
    });

    module.controller('AppController', function ($scope, $projekty, $currentUser, $bazauzytkownikow) {
        $scope.user = $currentUser.items[0];
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
            var today = new Date();
            var dd = today.getDate();
            var mm = today.getMonth() + 1;
            var yyyy = today.getFullYear();
            var gg = today.getHours();
            var min = today.getMinutes();
            if (dd < 10) {
                dd = '0' + dd
            }
            if (mm < 10) {
                mm = '0' + mm
            }
            if (gg < 10) {
                gg = '0' + gg
            }
            if (min < 10) {
                min = '0' + min
            }
            today = dd + '.' + mm + '.' + yyyy + ' ' + gg + ':' + min;

            var budzetAdmin = $('#twojaStawkaGodzinowa select').val();

            var budzetGodzinowyWartosc = 0;
            var budzetGodzinowy = 'nie';
            if ($('#budzetGodzinowy input:checked').length == 1) {
                budzetGodzinowy = 'tak';
                budzetGodzinowyWartosc = $('#wartoscBudzetGodziny select').val();
            }
            var budzetPienieznyWartosc = 0;
            var budzetPieniezny = 'nie';
            if ($('#budzetPieniadze input:checked').length == 1) {
                budzetPieniezny = 'tak';
                budzetPienieznyWartosc = $('#wartoscBudzetPieniadze select').val();
            }

            var item = {
                tytul: nazwa,
                krotkitytul: nazwa.substring(0, 15) + '...',
                avatarAdmina: $scope.user.avatar,
                statusUzytkownika: 'oczekuje',
                statusClass: 'completionHalf',
                czasUzytkownika: '00:0',
                kasaUzytkownika: '0',
                punktyUzytkownika: '0',
                procentUkonczeniaProjektu: '0',
                budzetPieniezny: budzetPieniezny,
                budzetPienieznyWartosc: budzetPienieznyWartosc,
                budzetPienieznyWykorzystanie: 0,
                budzetGodzinowy: budzetGodzinowy,
                budzetGodzinowyWartosc: budzetGodzinowyWartosc,
                budzetGodzinowyWykorzystanie: 0,
                ukonczoneZadania: '0',
                wszystkieZadania: '0',
                notyfikacjeDisplay: 'none',
                notyfikacje: '0',
                zadaniaPrzypisaneDoUzytkownika: '0',
                zadaniaNieprzypisane: '0',
                zadaniaPoTerminie: '0',
                zadaniaPrzekroczonyBudzet: '0',
                terminy: [],
                zadania: [],
                log: [
                    {
                        idLog: 0,
                        typ: 'rozpoczecieProjektu',
                        data: today,
                        dataPrezentacja: 'Dziś - ' + gg + ':' + min,
                        odczytane: 0
                        }
                ],
                przypisaneOsoby: [
                    {
                        idUser: 0,
                        avatar: $scope.user.avatar,
                        iloscZadan: 0,
                        stawka: budzetAdmin,
                        imie: $scope.user.imie + ' ' + $scope.user.nazwisko,
                        czasUzytkownika: '00:00',
                        kasaUzytkownika: '00.00',
                        punktyUzytkownika: 0,
                        dodatkowaKlasaListy: 'currentUser'
                  }
              ]
            };
            $scope.items.push(item);
            $scope.$apply;
            var index = $scope.items.length;
            var selectedItem = $projekty.items[index - 1];

            $('.pojedynczyTermin').each(function (x) {
                var dataTermin = $(this).find('input[type="datetime-local"]').val();
                dataTermin = dataTermin.substring(8, 10) + '.' + dataTermin.substring(5, 7) + '.' + (parseInt(dataTermin.substring(0, 4))) + ' ' + dataTermin.substring(11, 13) + ':' + dataTermin.substring(14, 16);
                var nazwaTermin = $(this).find('input[type="text"]').val();
                var zadanie = {
                    idZadania: x,
                    basicItem: 'none',
                    milestone: 'block',
                    mileStoneNaglowek: 'Milestone ' + (x + 1),
                    milestoneUkonczoneZadaniaProcent: '0',
                    milestoneWykorzystanyBudzetPieniadze: '0',
                    milestoneWykorzystanyBudzetGodziny: '0',
                    data: dataTermin,
                    nazwa: nazwaTermin
                }
                var termin = {
                    idTerminu: x,
                    mileStoneNaglowek: 'Milestone ' + (x + 1),
                    data: dataTermin,
                    nazwa: nazwaTermin
                }
                $projekty.items[index - 1].zadania.push(zadanie);
                $projekty.items[index - 1].terminy.push(termin);
            });

            $projekty.selectedItem = selectedItem;
            $scope.navi.pushPage('procjectview.html', {
                title: selectedItem.tytul
            });
        }
    });

    module.controller('DetailController', function ($scope, $projekty, $filter, $bazauzytkownikow, $currentUser) {
        $scope.item = $projekty.selectedItem;
        $scope.baza = $bazauzytkownikow.items;
        $scope.currentuser = $currentUser.items;
        var dodatkowePunkty = 0;
        $scope.projectOptions = function () {
            ons.notification.confirm({
                title: 'Opcje projektu',
                message: "co chcesz zrobić?",
                buttonLabels: ['Dodaj zadanie', 'Zarządzaj osobami', 'Zarządzaj terminami', 'Zarządzaj budżetem', 'Zakończ projekt'],
                primaryButtonIndex: 0,
                callback: function (index) {
                    if (index == 0) {
                        navi.pushPage('newtask.html', {
                            animation: 'slide'
                        });
                    }
                    if (index == 1) {
                        navi.pushPage('editPeople.html', {
                            animation: 'slide'
                        });
                    }
                    if (index == 2) {
                        navi.pushPage('editTerms.html', {
                            animation: 'slide'
                        });
                    }
                    if (index == 3) {
                        navi.pushPage('editBudget.html', {
                            animation: 'slide'
                        });
                    }
                    if (index == 4) {
                        $scope.item.zamkniety = 'tak';
                        var today = new Date();
                        var dd = today.getDate();
                        var mm = today.getMonth() + 1;
                        var yyyy = today.getFullYear();
                        var gg = today.getHours();
                        var min = today.getMinutes();
                        if (dd < 10) {
                            dd = '0' + dd
                        }
                        if (mm < 10) {
                            mm = '0' + mm
                        }
                        if (gg < 10) {
                            gg = '0' + gg
                        }
                        if (min < 10) {
                            min = '0' + min
                        }
                        today = dd + '.' + mm + '.' + yyyy + ' ' + gg + ':' + min;
                        var item = {
                            idLog: $scope.item.log.length + 1,
                            typ: 'zakonczenieProjektu',
                            data: today,
                            dataPrezentacja: 'Dziś - ' + gg + ':' + min,
                            odczytane: 0
                        }
                        $scope.item.log.push(item);
                        $scope.$apply();
                    }
                }
            });
        };
        
        
        $scope.initMap = function() {
            
            var currentLocationLat=0;
            var currentLocationLong=0;
            var map;
            var onSuccess = function(position) {
                
            //.$('#map_canvas').height($(window).innerHeight()-150); 
                
                
            currentLocationLat=position.coords.latitude;
            currentLocationLong=position.coords.longitude;
            canterMap(currentLocationLat,currentLocationLong,map);
};
            
            var options = { };
           
                var marker = null;
                    var geocoder;


                    function GoogleMap() {
                        this.initialize = function () {
                            map = showMap();
                            navigator.geolocation.getCurrentPosition(onSuccess, null, options);  
                        }
                        var showMap = function () {
                            var mapOptions = {
                                zoom: 12,
                                disableDefaultUI: true,
                                center: new google.maps.LatLng(currentLocationLat, currentLocationLong),
                                mapTypeId: google.maps.MapTypeId.ROADMAP
                            }

                            var map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
                            map.addListener('click', function (e) {
                                placeMarkerAndPanTo(e.latLng, map);

                            });
                            geocoder = new google.maps.Geocoder();
                                 // Create the search box and link it to the UI element.
                            var input = document.getElementById('pac-input');
                            var searchBox = new google.maps.places.SearchBox(input);
                            map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

                            // Bias the SearchBox results towards current map's viewport.
                            map.addListener('bounds_changed', function () {
                                searchBox.setBounds(map.getBounds());
                            });
                            
                             var markers = [];

                            searchBox.addListener('places_changed', function () {
                                var places = searchBox.getPlaces();

                                if (places.length == 0) {
                                    return;
                                }

                            
                               
                                // For each place, get the icon, name and location.
                                var bounds = new google.maps.LatLngBounds();
                                places.forEach(function (place) {
                                    var icon = {
                                        url: place.icon,
                                        size: new google.maps.Size(71, 71),
                                        origin: new google.maps.Point(0, 0),
                                        anchor: new google.maps.Point(17, 34),
                                        scaledSize: new google.maps.Size(25, 25)
                                    };

                                    

                                    if (place.geometry.viewport) {
                                        // Only geocodes have viewport.
                                        bounds.union(place.geometry.viewport);
                                    } else {
                                        bounds.extend(place.geometry.location);
                                    }
                                });
                                map.fitBounds(bounds);
                                map.setZoom(12);
                            });
                                 
                            return map;
                            
                        }

                    }

                    function placeMarkerAndPanTo(latLng, map) {

                        if (marker != null) {
                            marker.setMap(null);
                        }
                        marker = new google.maps.Marker({
                            position: latLng,
                            map: map
                        });
                        getAddress(latLng);
                        map.panTo(latLng);
                    }
            
                    function canterMap(lat,lng,map) {
                        map.setCenter(new google.maps.LatLng(lat,lng));
                    }

                    function getAddress(latLng) {
                        geocoder.geocode({
                                'latLng': latLng
                            },
                            function (results, status) {
                                if (status == google.maps.GeocoderStatus.OK) {
                                    if (results[0]) {
                                        alert(results[0].address_components[1].short_name);
                                        document.getElementById("address").value = results[0].address_components[1].short_name;
                                    } else {
                                        alert('brak');
                                        document.getElementById("address").value = "No results";
                                    }
                                } else {
                                    document.getElementById("address").value = status;
                                }
                            });
                    }
                    

                    var map = new GoogleMap();
                    map.initialize();
        }
        
        $scope.goToAddNewPersonTab = function() {
            $('#currentProjectPeopleTab').css('display','none');
            $('#addNewPersonTab').css('display','block');
        }
        
        $scope.goToPersonListTab = function() {
            $('#currentProjectPeopleTab').css('display','block');
            $('#addNewPersonTab').css('display','none');
        }
    
        $scope.addPersonNew = function (userToAddId) {
            var foundCheck = $filter('filter')($scope.item.przypisaneOsoby, {
                idUser: userToAddId
            }, true);
            if (foundCheck.length > 0) {
                ons.notification.alert({
                    message: 'Ta osoba jest już dodana do tego projektu'
                });
            } else {
                ons.notification.prompt({
                    message: "Wpisz stawkę godzinową",
                    callback: function (age) {
                        var found = $filter('filter')($scope.baza, {
                            idUser: userToAddId
                        }, true);
                        var osoba = {
                            idUser: found[0].idUser,
                            imie: found[0].imie,
                            email: found[0].email,
                            avatar: found[0].avatar,
                            stawka: age,
                            iloscZadan:0,
                            czasUzytkownika:'00:00',
                            kasaUzytkownika:'0',
                            punktyUzytkownika:0,
                        }
                        var foundCheck2 = $filter('filter')($scope.currentuser[0].ostatnieOsoby, {
                idUser: userToAddId   }, true);
                        $scope.item.przypisaneOsoby.push(osoba);
                        if (foundCheck2.length > 0) {} else {
                        $scope.currentuser[0].ostatnieOsoby.push(osoba);
                            }
                        $scope.$apply();
                    }
                });

            }
        }
        
        $scope.userAdded = function (userToAddId) {
            var foundCheck = $filter('filter')($scope.item.przypisaneOsoby, {
                idUser: userToAddId
            }, true);
            if (foundCheck.length > 0) { return true; } else { return false; }
        }
        
        $scope.userNoTask = function (userToAddId) {
             var foundCheck = $filter('filter')($scope.item.przypisaneOsoby, {
                idUser: userToAddId
            }, true);
            if(foundCheck[0].iloscZadan==0) { return true; } else { return false; }
        }
        
        $scope.removePerson = function (userToAddId) {
         var found = $filter('filter')($scope.item.przypisaneOsoby, {
                idUser: userToAddId
            }, true);
            var tmpIndex = $scope.item.przypisaneOsoby.indexOf(found[0]);
              $scope.item.przypisaneOsoby.splice(tmpIndex, 1);
        }
        
        $scope.addPersonLast = function (userToAddId) {
            var foundCheck = $filter('filter')($scope.item.przypisaneOsoby, {
                idUser: userToAddId
            }, true);
            if (foundCheck.length > 0) {
                ons.notification.alert({
                    message: 'Ta osoba jest już dodana do tego projektu'
                });
            } else {
                var found = $filter('filter')($scope.currentuser[0].ostatnieOsoby, {
                    idUser: userToAddId
                }, true);
                var osoba = {
                    idUser: found[0].idUser,
                    imie: found[0].imie,
                    email: found[0].email,
                    avatar: found[0].avatar,
                    stawka: found[0].stawka,
                    iloscZadan:0,
                    czasUzytkownika:'00:00',
                    kasaUzytkownika:'0',
                    punktyUzytkownika:0,
                }
                $scope.item.przypisaneOsoby.push(osoba);
            }
        }

        $scope.addTermTemplate = function () {
            var item = $('<li class="list__item pojedynczyTerminNowy" style="padding-right:8px; display:none;"><ons-row align="center" class="row ons-row-inner row-center" style="padding-right:1px;"><ons-col class="col ons-col-inner">Data*</ons-col><ons-col class="col ons-col-inner" style="padding-right:8px;"><input type="datetime-local"  class="inputClear" value="' + new Date().toJSON().slice(0, 19) + '" ></ons-col></ons-row><ons-row align="center" class="row ons-row-inner row-center"><ons-col class="col ons-col-inner">Nazwa*</ons-col><ons-col class="col ons-col-inner"><input type="text" class="text-input text-input--transparent inputWithLabel" placeholder="Nazwa terminu"></ons-col></ons-row></li>');
            $('#terminyNowe').append(item);
            $(item).fadeIn(2000);
        }



        $scope.updateBudget = function () {
            if ($scope.item.budzetGodzinowy == 'tak') {
                $scope.item.budzetGodzinowyWartosc = $('#newHourBudgetText').text();
            }
            if ($scope.item.budzetPieniezny == 'tak') {
                $scope.item.budzetPienieznyWartosc = $('#newMoneyBudgetText').text();
            }
            navi.popPage();
        }

        $scope.updateTerms = function () {
            $('.pojedynczyTerminNowy').each(function (x) {
                var dataTermin = $(this).find('input[type="datetime-local"]').val();
                dataTermin = dataTermin.substring(8, 10) + '.' + dataTermin.substring(5, 7) + '.' + (parseInt(dataTermin.substring(0, 4))) + ' ' + dataTermin.substring(11, 13) + ':' + dataTermin.substring(14, 16);
                var nazwaTermin = $(this).find('input[type="text"]').val();
                var zadanie = {
                    idZadania: x,
                    basicItem: 'none',
                    milestone: 'block',
                    mileStoneNaglowek: 'Milestone ' + (x + 1),
                    milestoneUkonczoneZadaniaProcent: '0',
                    milestoneWykorzystanyBudzetPieniadze: '0',
                    milestoneWykorzystanyBudzetGodziny: '0',
                    data: dataTermin,
                    nazwa: nazwaTermin
                }
                var termin = {
                    idTerminu: x,
                    mileStoneNaglowek: 'Milestone ' + (x + 1),
                    data: dataTermin,
                    nazwa: nazwaTermin
                }
                $scope.item.zadania.push(zadanie);
                $scope.item.terminy.push(termin);

            });
            navi.popPage();

        }


        $scope.removeTerm = function (selectedTermId) {
            var found = $filter('filter')($scope.item.terminy, {
                idTerminu: selectedTermId
            }, true);
            var tmpIndex = $scope.item.terminy.indexOf(found[0]);
            $scope.item.terminy.splice(tmpIndex, 1);
            found = $filter('filter')($scope.item.zadania, {
                idTerminu: selectedTermId
            }, true);
            tmpIndex = $scope.item.zadania.indexOf(found[0]);
            $scope.item.zadania.splice(tmpIndex, 1);
        }

        $scope.logType = function () {
            ons.notification.confirm({
                title: 'Opcje projektu',
                message: "co chcesz zrobić?",
                buttonLabels: ['Wszystkie', 'Przekroczone terminy', 'Przekroczone budżety', 'Ukończone zadania', 'Utworzone zadania'],
                primaryButtonIndex: 0,
                callback: function (index) {
                    if (index == 0) {
                        logType = "wszystkie";
                        $scope.$apply();
                    }
                    if (index == 1) {
                        logType = "przekroczonyTermin";
                        $scope.$apply();
                    }
                    if (index == 2) {
                        logType = "przekroczonyBudzet";
                        $scope.$apply();
                    }
                    if (index == 3) {
                        logType = "koniecZadania";
                        $scope.$apply();
                    }
                    if (index == 4) {
                        logType = "noweZadanie";
                        $scope.$apply();
                    }
                }
            });
        };

        $scope.addPersonToTask = function (idosobyS) {
            var foundCheck = $filter('filter')($scope.currentuser[0].tmp, {
                idUser: idosobyS
            }, true);
            if (foundCheck.length > 0) {
                ons.notification.alert({
                    message: 'Ta osoba jest już dodana do tego zadania'
                });
            } else {
            var found = $filter('filter')($scope.item.przypisaneOsoby, {
                idUser: idosobyS
            }, true);
            var osoba = {
                            idUser: found[0].idUser,
                            imie: found[0].imie,
                            email: found[0].email,
                            avatar: found[0].avatar,
                            stawka: found[0].stawka,
                            iloscZadan:0,
                            czasUzytkownika:'00:00',
                            kasaUzytkownika:'0',
                            punktyUzytkownika:0,
            }
            $scope.currentuser[0].tmp.push(osoba);
            navi.popPage();
            }
        };
        
        $scope.removePersonFromTask = function (userToAddId) {
         var found = $filter('filter')($scope.currentuser[0].tmp, {
                idUser: userToAddId
            }, true);
            var tmpIndex = $scope.currentuser[0].tmp.indexOf(found[0]);
            $scope.currentuser[0].tmp.splice(tmpIndex, 1);
        }
        
        $scope.userAddedToTemp = function (userToAddId) {
            var foundCheck = $filter('filter')($scope.currentuser[0].tmp, {
                idUser: userToAddId
            }, true);
            if (foundCheck.length > 0) { return true; } else { return false; }
        }
        


        $scope.addPromoPoints = function (indexid) {
            ons.notification.confirm({
                title: 'Punkty premiowe',
                message: "ile punktów chcesz dodać?",
                buttonLabels: ['1', '2', '3', '4', '5'],
                primaryButtonIndex: 0,
                callback: function (index) {
                    dodatkowePunkty = index + 1;
                    $('.actionButtonHolder[data-id="' + indexid + '"]').fadeOut();
                    $scope.item.log[indexid].przyznanePunkty = dodatkowePunkty;
                    var currentPoints = $scope.item.przypisaneOsoby[$scope.item.log[indexid].idOsoby].punktyUzytkownika;
                    $scope.item.przypisaneOsoby[$scope.item.log[indexid].idOsoby].punktyUzytkownika = currentPoints + dodatkowePunkty;
                    $('.actionInfo[data-id="' + indexid + '"]').fadeIn();
                    $scope.$apply();
                }
            });
        };
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

    module.factory('$currentUser', function () {
        var currentUser = {};
        currentUser.items = [
            {
                imie: 'Marcin',
                nazwisko: 'Kowalski',
                avatar: 'http://themina.net/themes/shema/img/demo/team/team_img_3.jpg',
                tmp:[],
                ostatnieOsoby: [
                    {
                        idUser: 12,
                        imie: 'Piotr Kowalski',
                        email: 'piotr@kowalski.pl',
                        avatar: 'http://api.adorable.io/avatars/209/abott@3.io.png',
                        stawka: 20
            },
                    {
                        idUser: 13,
                        imie: 'Marcin Kowalski',
                        email: 'marcin@kowalski.pl',
                        avatar: 'http://api.adorable.io/avatars/209/abott@4.io.png',
                        stawka: 20
            },
                    {
                        idUser: 14,
                        imie: 'Dominik Kowalski',
                        email: 'dominik@kowalski.pl',
                        avatar: 'http://api.adorable.io/avatars/209/abott@44.io.png',
                        stawka: 50
            }
                ]
            }];
        return currentUser;
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
                budzetPieniezny: 'tak',
                budzetPienieznyWartosc: '4000',
                budzetPienieznyWykorzystanie: '1000',
                budzetGodzinowy: 'tak',
                budzetGodzinowyWartosc: '4000',
                budzetGodzinowyWykorzystanie: '1000',
                ukonczoneZadania: '3',
                wszystkieZadania: '10',
                notyfikacjeDisplay: 'block',
                notyfikacje: '3',
                zadaniaPrzypisaneDoUzytkownika: '2',
                zadaniaNieprzypisane: '0',
                zadaniaPoTerminie: '4',
                zadaniaPrzekroczonyBudzet: '4',
                terminy: [
                    {
                        idTerminu: 0,
                        data: '12.12.2015 12:00',
                        nazwa: 'Preztacja projektu'
                  },
                    {
                        idTerminu: 1,
                        data: '22.12.2015 15:00',
                        nazwa: 'Zakonczenie projektu'
                  }
              ],
                log: [
                    {
                        idLog: 0,
                        idZadania: 1,
                        typ: 'koniecZadania',
                        nazwa: 'Preztacja projektu',
                        osoba: 'Natalia Kowalska',
                        idOsoby: 1,
                        avatarOsoby: 'http://themina.net/themes/shema/img/demo/team/team_img_3.jpg',
                        data: '09.12.2015 12:00',
                        dataPrezentacja: 'Wczoraj - 12:42',
                        odczytane: 0
                    },
                    {
                        idLog: 1,
                        idZadania: 1,
                        typ: 'koniecZadania',
                        nazwa: 'Preztacja projektu',
                        osoba: 'Natalia Kowalska',
                        idOsoby: 1,
                        avatarOsoby: 'http://themina.net/themes/shema/img/demo/team/team_img_3.jpg',
                        data: '03.12.2015 12:00',
                        dataPrezentacja: 'Wczoraj - 12:42',
                        odczytane: 0
                    },
                    {
                        idLog: 2,
                        idZadania: 1,
                        typ: 'noweZadanie',
                        nazwa: 'Preztacja projektu',
                        osoba: 'Natalia Kowalska',
                        idOsoby: 1,
                        avatarOsoby: 'http://themina.net/themes/shema/img/demo/team/team_img_3.jpg',
                        data: '08.12.2015 12:00',
                        dataPrezentacja: 'Wczoraj - 12:42',
                        odczytane: 0
                    },
                    {
                        idLog: 4,
                        typ: 'zakonczenieMilestone',
                        nazwa: 'Długa nazwa milestone',
                        data: '09.12.2015 14:00',
                        dataPrezentacja: 'Wczoraj - 14:22',
                        odczytane: 0
                    }
                ],
                zadania: [
                    {
                        idZadania: 1,
                        basicItem: 'block',
                        milestone: 'none',
                        data: '14.12.2015 12:00',
                        dataDzien: '14',
                        dataMiesiac: 'GRU',
                        dataGodzina: '12:00',
                        notyfikacjeDisplay: 'none',
                        notyfikacje: '3',
                        lokalizacjaDisplay: 'block',
                        brakOsobyDisplay: 'none',
                        ukonczoneDisplay: 'none',
                        avatarPierwszejOsoby: 'http://themina.net/themes/shema/img/demo/team/team_img_3.jpg',
                        dotatkoweOsoby: '1',
                        dodatkoweOsobyDisplay: 'inline-block',
                        nazwa: 'Preztacja projektu',
                        priorytet: 'prioImportant0',
                        statusUzytkownika: 'w trakcie',
                        statusClass: 'completionHalf',
                        czasUzytkownika: '12:23',
                        kasaUzytkownika: '215zł',
                        punktyUzytkownika: '5',
                        dodatkowaKlasaListy: 'currentUser'
                  },
                    {
                        idZadania: 2,
                        basicItem: 'block',
                        milestone: 'none',
                        data: '14.12.2015 12:00',
                        dataDzien: '14',
                        dataMiesiac: 'GRU',
                        dataGodzina: '12:00',
                        notyfikacjeDisplay: 'none',
                        notyfikacje: '3',
                        lokalizacjaDisplay: 'block',
                        brakOsobyDisplay: 'none',
                        ukonczoneDisplay: 'none',
                        avatarPierwszejOsoby: 'http://themina.net/themes/shema/img/demo/team/team_img_3.jpg',
                        dotatkoweOsoby: '1',
                        dodatkoweOsobyDisplay: 'inline-block',
                        nazwa: 'Preztacja projektu',
                        priorytet: 'prioLow',
                        statusUzytkownika: 'w trakcie',
                        statusClass: 'completionHalf',
                        czasUzytkownika: '12:23',
                        kasaUzytkownika: '215zł',
                        punktyUzytkownika: '5',
                        dodatkowaKlasaListy: 'currentUser'
                  },
                    {
                        idZadania: 3,
                        basicItem: 'block',
                        milestone: 'none',
                        data: '17.12.2015 12:00',
                        dataDzien: '17',
                        dataMiesiac: 'GRU',
                        dataGodzina: '12:00',
                        notyfikacjeDisplay: 'block',
                        notyfikacje: '3',
                        lokalizacjaDisplay: 'none',
                        brakOsobyDisplay: 'none',
                        ukonczoneDisplay: 'none',
                        avatarPierwszejOsoby: 'http://lcars.ucip.org/images/a/ac/Jason-statham07.jpg',
                        dotatkoweOsoby: '2',
                        dodatkoweOsobyDisplay: 'inline-block',
                        nazwa: 'Preztacja projektu',
                        priorytet: 'prioNormal',
                        statusUzytkownika: 'oczekuje',
                        statusClass: 'completionHalf',
                        czasUzytkownika: '12:23',
                        kasaUzytkownika: '215zł',
                        punktyUzytkownika: '5',
                        dodatkowaKlasaListy: 'currentUser'
                  },
                    {
                        idZadania: 4,
                        basicItem: 'block',
                        milestone: 'none',
                        data: '02.12.2015 12:00',
                        dataDzien: '02',
                        dataMiesiac: 'GRU',
                        dataGodzina: '12:00',
                        notyfikacjeDisplay: 'none',
                        notyfikacje: '3',
                        lokalizacjaDisplay: 'none',
                        brakOsobyDisplay: 'none',
                        ukonczoneDisplay: 'block',
                        avatarPierwszejOsoby: 'http://themina.net/themes/shema/img/demo/team/team_img_3.jpg',
                        dotatkoweOsoby: '1',
                        dodatkoweOsobyDisplay: 'inline-block',
                        nazwa: 'Preztacja projektu',
                        priorytet: 'prioFinished',
                        statusUzytkownika: 'ukończone',
                        statusClass: 'completionHalf',
                        czasUzytkownika: '12:23',
                        kasaUzytkownika: '215zł',
                        punktyUzytkownika: '5',
                        dodatkowaKlasaListy: 'currentUser'
                  },
                    {
                        idZadania: 5,
                        basicItem: 'block',
                        milestone: 'none',
                        data: '05.12.2015 14:00',
                        dataDzien: '05',
                        dataMiesiac: 'GRU',
                        dataGodzina: '14:00',
                        notyfikacjeDisplay: 'none',
                        notyfikacje: '3',
                        lokalizacjaDisplay: 'none',
                        brakOsobyDisplay: 'block',
                        ukonczoneDisplay: 'none',
                        avatarPierwszejOsoby: 'https://dl.dropboxusercontent.com/u/28981503/noPerson.png',
                        dotatkoweOsoby: '0',
                        dodatkoweOsobyDisplay: 'none',
                        nazwa: 'Przygotowanie prezentacji opisującej projekt',
                        priorytet: 'prioImportant',
                        statusUzytkownika: 'oczekuje',
                        statusClass: 'completionHalf',
                        czasUzytkownika: '0',
                        kasaUzytkownika: '0',
                        punktyUzytkownika: '0',
                        dodatkowaKlasaListy: ''
                  },
                    {
                        idZadania: 6,
                        idTerminu: 0,
                        basicItem: 'none',
                        milestone: 'block',
                        mileStoneNaglowek: 'Milestone 1',
                        milestoneUkonczoneZadaniaProcent: '50',
                        milestoneWykorzystanyBudzetPieniadze: '90',
                        milestoneWykorzystanyBudzetGodziny: '60',
                        data: '09.12.2015 12:00',
                        avatarPierwszejOsoby: 'http://themina.net/themes/shema/img/demo/team/team_img_3.jpg',
                        nazwa: 'Preztacja projektu milestone',
                        statusUzytkownika: 'w trakcie',
                        statusClass: 'completionHalf',
                        czasUzytkownika: '12:23',
                        kasaUzytkownika: '215zł',
                        punktyUzytkownika: '5',
                        dodatkowaKlasaListy: 'currentUser'
                  },
                    {
                        idZadania: "7",
                        idTerminu: 0,
                        basicItem: 'none',
                        milestone: 'block',
                        mileStoneNaglowek: 'Milestone 2',
                        milestoneUkonczoneZadaniaProcent: '0',
                        milestoneWykorzystanyBudzetPieniadze: '30',
                        milestoneWykorzystanyBudzetGodziny: '40',
                        data: '23.12.2015 18:00',
                        avatarPierwszejOsoby: 'http://themina.net/themes/shema/img/demo/team/team_img_3.jpg',
                        nazwa: 'Preztacja projektu milestone',
                        statusUzytkownika: 'w trakcie',
                        statusClass: 'completionHalf',
                        czasUzytkownika: '12:23',
                        kasaUzytkownika: '215zł',
                        punktyUzytkownika: '5',
                        dodatkowaKlasaListy: 'currentUser'
                  }
              ],
                przypisaneOsoby: [
                    {
                        idUser: 1,
                        avatar: 'http://themina.net/themes/shema/img/demo/team/team_img_3.jpg',
                        iloscZadan: 3,
                        stawka: '20zł',
                        imie: 'Catalia Kowalska',
                        czasUzytkownika: '18:22',
                        kasaUzytkownika: '200.50',
                        punktyUzytkownika: 2,
                        dodatkowaKlasaListy: 'currentUser'
                  },
                    {
                        idUser: 2,
                        avatar: 'http://themina.net/themes/shema/img/demo/team/team_img_3.jpg',
                        iloscZadan: 1,
                        stawka: '50zł',
                        imie: 'Natalia Kowalska',
                        czasUzytkownika: '11:22',
                        kasaUzytkownika: '100.50',
                        punktyUzytkownika: 4,
                        dodatkowaKlasaListy: 'currentUser'
                  },
                    {
                        idUser: 3,
                        avatar: 'http://themina.net/themes/shema/img/demo/team/team_img_3.jpg',
                        iloscZadan: 22,
                        stawka: '80zł',
                        imie: 'Aatalia Kowalska',
                        czasUzytkownika: '12:22',
                        kasaUzytkownika: '500.50',
                        punktyUzytkownika: 14,
                        dodatkowaKlasaListy: 'currentUser'
                  },
                    {
                        idUser: 4,
                        avatar: 'http://themina.net/themes/shema/img/demo/team/team_img_3.jpg',
                        iloscZadan: 12,
                        stawka: '80zł',
                        imie: 'Zatalia Kowalska',
                        czasUzytkownika: '12:22',
                        kasaUzytkownika: '500.50',
                        punktyUzytkownika: 5,
                        dodatkowaKlasaListy: 'currentUser'
                  }
              ]
          }
      ];
        return projekty;
    });

    module.factory('$bazauzytkownikow', function () {
        var bazauzytkownikow = {};
        bazauzytkownikow.items = [
            {
                idUser: 10,
                imie: 'Jan Kowalski',
                email: 'jan@kowalski.pl',
                avatar: 'http://api.adorable.io/avatars/209/abott@1.io.png',
            },
            {
                idUser: 11,
                imie: 'Adam Kowalski',
                email: 'adam@kowalski.pl',
                avatar: 'http://api.adorable.io/avatars/209/abott@2.io.png',
            },
            {
                idUser: 12,
                imie: 'Piotr Kowalski',
                email: 'piotr@kowalski.pl',
                avatar: 'http://api.adorable.io/avatars/209/abott@3.io.png',
            },
            {
                idUser: 13,
                imie: 'Marcin Kowalski',
                email: 'marcin@kowalski.pl',
                avatar: 'http://api.adorable.io/avatars/209/abott@4.io.png',
            },
            {
                idUser: 14,
                imie: 'Dominik Kowalski',
                email: 'dominik@kowalski.pl',
                avatar: 'http://api.adorable.io/avatars/209/abott@44.io.png',
            },
            {
                idUser: 15,
                imie: 'Maciej Kowalski',
                email: 'maciej@kowalski.pl',
                avatar: 'http://api.adorable.io/avatars/209/abott@45.io.png',
            },
            {
                idUser: 16,
                imie: 'Michał Kowalski',
                email: 'michal@kowalski.pl',
                avatar: 'http://api.adorable.io/avatars/209/abott@46.io.png',
            },
        ];
        return bazauzytkownikow;
    });

})();