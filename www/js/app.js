(function () {
    'use strict';
    var module = angular.module('app', ['onsen']);
    var logType = 'wszystkie';
    var searchText = 'nie ma takiej mozliwosci';


    function orderKeyGen(dd, mm, yyyy, gg, min, p) {
        dd = parseInt(dd);
        mm = parseInt(mm);
        yyyy = parseInt(yyyy);
        gg = parseInt(gg);
        min = parseInt(min);
        p = parseInt(p);
        return ((((dd + mm * 31 + yyyy * 365) * 10000) + gg * 60 + min) * 10) + p;
    }

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
            var orderKey = orderKeyGen(dd, mm, yyyy, gg, min, 0);
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
                        orderKey: orderKey,
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
                dd = dataTermin.substring(8, 10);
                mm = dataTermin.substring(5, 7);
                yyyy = dataTermin.substring(0, 4);
                gg = dataTermin.substring(11, 13);
                min = dataTermin.substring(14, 16);
                dataTermin = dd + '.' + mm + '.' + yyyy + ' ' + gg + ':' + min;
                orderKey = orderKeyGen(dd, mm, yyyy, gg, min, 9);
                var nazwaTermin = $(this).find('input[type="text"]').val();
                var zadanie = {
                    idZadania: (x + 1) * 1000,
                    idTerminu: (x + 1) * 1000,
                    orderKey: orderKey,
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
                    idTerminu: (x + 1) * 1000,
                    orderKey: orderKey,
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

        //NOTE: Dodawanie zadania
        $scope.addNewTask = function () {
            var nazwa = $('#nazwaZadania').val();

            var data = $('#wybranyTermin select').val();
            var innaData = 0;
            if (data == "inny") {
                data = $('#innaData input').val();
                innaData = 1;
            }

            if (nazwa == '') {
                ons.notification.alert({
                    message: 'Podaj nazwę zadania',
                    title: 'Brak nazwy',
                    buttonLabel: 'OK',
                    animation: 'default',
                    callback: function () {}
                });
            } else if (data == '') {
                ons.notification.alert({
                    message: 'Podaj termin wykonania zadania',
                    title: 'Brak daty',
                    buttonLabel: 'OK',
                    animation: 'default',
                    callback: function () {}
                });
            } else {
                var opis = $('#opisZadania');

                var pokazLokalizacje = 'none';
                var lokalizacja = $('#lokalizacjaZadania').html();
                var lokalizacjaZadaniaLatLng=$('#lokalizacjaZadaniaLatLng').html();
                if (lokalizacja != "Wybierz lokalizację") {
                    pokazLokalizacje = 'block';
                }


                var priorytet = $('#wybranyPriorytet select').val();
                var priorytetValue = 0;
                if (priorytet == "niski") {
                    priorytet = 'prioLow';
                    priorytetValue = 3;
                }
                if (priorytet == "normalny") {
                    priorytet = 'prioNormal';
                    priorytetValue = 2;
                }
                if (priorytet == "wysoki") {
                    priorytet = 'prioImportant';
                    priorytetValue = 1;
                }

                //NOTE: now point
                var orderKey;
                var dd;
                var mm;
                var yyyy;
                var gg;
                var min;

                if (innaData == 0) {
                    data = parseInt(data);
                    var found = $filter('filter')($scope.item.terminy, {
                        idTerminu: data
                    }, true);
                    orderKey = found[0].orderKey - 9 + priorytetValue;
                    data = found[0].data;
                    dd = data.substring(0, 2);
                    mm = data.substring(3, 5);
                    yyyy = data.substring(6, 10);
                    gg = data.substring(11, 13);
                    min = data.substring(14, 16);
                    
                } else {
                    dd = data.substring(8, 10);
                    mm = data.substring(5, 7);
                    yyyy = data.substring(0, 4);
                    gg = data.substring(11, 13);
                    min = data.substring(14, 16);
                    data = dd + '.' + mm + '.' + yyyy + ' ' + gg + ':' + min;
                    orderKey = orderKeyGen(dd, mm, yyyy, gg, min, priorytetValue);
                }
                if (mm == '01') {
                        mm = 'STY';
                    }
                    if (mm == '02') {
                        mm = 'LUT';
                    }
                    if (mm == '03') {
                        mm = 'MAR';
                    }
                    if (mm == '04') {
                        mm = 'KWI';
                    }
                    if (mm == '05') {
                        mm = 'MAJ';
                    }
                    if (mm == '06') {
                        mm = 'CZE';
                    }
                    if (mm == '07') {
                        mm = 'LIP';
                    }
                    if (mm == '08') {
                        mm = 'SIE';
                    }
                    if (mm == '09') {
                        mm = 'WRZ';
                    }
                    if (mm == '10') {
                        mm = 'PAZ';
                    }
                    if (mm == '11') {
                        mm = 'LIS';
                    }
                    if (mm == '12') {
                        mm = 'GRU';
                    }
                
                
                
            var budzetGodzinowyWartosc = 0;
            var budzetGodzinowy = 'nie';
            if ($('#zadanieWartoscBudzetGodziny input:checked').length == 1) {
                budzetGodzinowy = 'tak';
                budzetGodzinowyWartosc = $('#zadanieWartoscBudzetGodziny select').val();
            }
            var budzetPienieznyWartosc = 0;
            var budzetPieniezny = 'nie';
            if ($('#zadanieWartoscBudzetPieniadze input:checked').length == 1) {
                budzetPieniezny = 'tak';
                budzetPienieznyWartosc = $('#zadanieWartoscBudzetPieniadze select').val();
            }


                var zadanie = {
                    idZadania: 5,
                    orderKey: orderKey,
                    basicItem: 'block',
                    data: data,
                    dataDzien: dd,
                    dataMiesiac: mm,
                    dataGodzina: gg + ':' + min,
                    notyfikacjeDisplay: 'none',
                    notyfikacje: 0,
                    lokalizacjaDisplay:pokazLokalizacje,
                    lokalizacja:lokalizacja,
                    latLngPosition:lokalizacjaZadaniaLatLng,
                    brakOsobyDisplay: 'block',
                    ukonczoneDisplay: 'none',
                    avatarPierwszejOsoby: 'https://dl.dropboxusercontent.com/u/28981503/noPerson.png',
                    dotatkoweOsoby: '0',
                    dodatkoweOsobyDisplay: 'none',
                    nazwa: nazwa,
                    opis: opis,
                    priorytet: priorytet,
                    statusUzytkownika:'oczekuje',
                    statusClass:'completionHalf',
                    czasUzytkownika:'00:00',
                    kasaUzytkownika:0,
                    punktyUzytkownika:0,
                    budzetPieniezny:budzetPieniezny,
                    budzetPienieznyWartosc:budzetPienieznyWartosc,
                    budzetPienieznyWykorzystanie:0,
                    budzetGodzinowy:budzetGodzinowy,
                    budzetGodzinowyWartosc:budzetGodzinowyWartosc,
                    budzetGodzinowyWykorzystanie:0,
                }
                $scope.item.zadania.push(zadanie);
                $scope.RebuildTerms();
                navi.popPage();
            }

        }


        $scope.RebuildTerms = function () {
            var listaTerminow = [];
            angular.forEach($scope.item.terminy, function (term, index) {
                var found = $filter('filter')($scope.item.zadania, {
                    idTerminu: term.idTerminu
                }, true);
                var orderKeyTmp = found[0].orderKey;
                listaTerminow[index] = orderKeyTmp;
            });
            listaTerminow.sort();


            var iterator = 0;
            listaTerminow.forEach(function (entry) {


                var found = $filter('filter')($scope.item.zadania, {
                    orderKey: entry
                }, true);


                var orderKeyTmp = found[0].orderKey;
                found[0].mileStoneNaglowek = 'Milestone ' + (iterator + 1);
                found[0].milestoneUkonczoneZadaniaProcent = 0;
                found[0].milestoneWykorzystanyBudzetPieniadze = 0;
                found[0].milestoneWykorzystanyBudzetGodziny = 0;
                var iloscZadan = 0;
                var iloscZadanUkonczonych = 0;
                var przydzielonyBudzetPieniadze = 0;
                var przydzielonyBudzetPieniadzeWykorzystany = 0;
                var przydzielonyBudzetGodziny = 0;
                var przydzielonyBudzetGodzinyWykorzystany = 0;

                angular.forEach($scope.item.zadania, function (task, index) {
                    if (iterator == 0) {
                        if (task.orderKey <= orderKeyTmp && task.orderKey > 0) {
                            if (!task.idTerminu) {
                                iloscZadan++;
                                if (task.priorytet == 'prioFinished') {
                                    iloscZadanUkonczonych++;
                                }
                                if (task.budzetPieniezny == 'tak') {
                                    przydzielonyBudzetPieniadze += task.budzetPienieznyWartosc;
                                    przydzielonyBudzetPieniadzeWykorzystany += task.budzetPienieznyWykorzystanie;
                                }
                                if (task.budzetGodzinowy == 'tak') {
                                    przydzielonyBudzetGodziny += task.budzetGodzinowyWartosc;
                                    przydzielonyBudzetGodzinyWykorzystany += task.budzetGodzinowyWykorzystanie;
                                }
                            }
                        }
                    } else {
                        if (task.orderKey <= orderKeyTmp && task.orderKey > listaTerminow[iterator - 1]) {
                            if (!task.idTerminu) {
                                iloscZadan++;
                                if (task.priorytet == 'prioFinished') {
                                    iloscZadanUkonczonych++;
                                }
                                if (task.budzetPieniezny == 'tak') {
                                    przydzielonyBudzetPieniadze += task.budzetPienieznyWartosc;
                                    przydzielonyBudzetPieniadzeWykorzystany += task.budzetPienieznyWykorzystanie;
                                }
                                if (task.budzetGodzinowy == 'tak') {
                                    przydzielonyBudzetGodziny += task.budzetGodzinowyWartosc;
                                    przydzielonyBudzetGodzinyWykorzystany += task.budzetGodzinowyWykorzystanie;
                                }
                            }
                        }
                    }
                });

                if (iloscZadan > 0) {
                    found[0].milestoneUkonczoneZadaniaProcent = iloscZadanUkonczonych / iloscZadan * 100;
                }
                if (przydzielonyBudzetPieniadze > 0) {
                    found[0].milestoneWykorzystanyBudzetPieniadze = przydzielonyBudzetPieniadzeWykorzystany / przydzielonyBudzetPieniadze * 100;
                }
                if (przydzielonyBudzetGodziny > 0) {
                    found[0].milestoneWykorzystanyBudzetGodziny = przydzielonyBudzetGodzinyWykorzystany / przydzielonyBudzetGodziny * 100;
                }

                iterator++;
            });

        }

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



        //NOTE: Google Maps function
        $scope.applyLocation = function () {
            var location = $('#adressPreview').html();
            if (location != 'Kliknij na mapie, by wybrać lokalizację') {
                $('#lokalizacjaZadania').html(location);
                var latLngTmp=$('#adressPreview small').html();
                $('#lokalizacjaZadaniaLatLng').html(latLngTmp);
            }
            navi.popPage();
        }

        $scope.initMap = function () {

            var currentLocationLat = 0;
            var currentLocationLong = 0;
            var map;
            var onSuccess = function (position) {

                //.$('#map_canvas').height($(window).innerHeight()-150); 


                currentLocationLat = position.coords.latitude;
                currentLocationLong = position.coords.longitude;
                canterMap(currentLocationLat, currentLocationLong, map);
            };

            var options = {};

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

            function canterMap(lat, lng, map) {
                map.setCenter(new google.maps.LatLng(lat, lng));
            }

            function getAddress(latLng) {
                geocoder.geocode({
                        'latLng': latLng
                    },
                    function (results, status) {
                        if (status == google.maps.GeocoderStatus.OK) {
                            if (results[0]) {
                                var ilosc = results[0].address_components.length;
                                var ulica = '';
                                var numer = '';
                                var miasto = '';
                                var kodPocztowy = '';
                                for (i = 0; i < ilosc; i++) {
                                    if (results[0].address_components[i].types[0] == 'street_number') {
                                        numer = results[0].address_components[i].short_name;
                                    }
                                    if (results[0].address_components[i].types[0] == 'route') {
                                        ulica = results[0].address_components[i].short_name;
                                    }
                                    if (results[0].address_components[i].types[0] == 'locality') {
                                        miasto = results[0].address_components[i].short_name;
                                    }
                                    if (results[0].address_components[i].types[0] == 'postal_code') {
                                        kodPocztowy = results[0].address_components[i].short_name;
                                    }
                                }
                                
                                if (ulica != '' && kodPocztowy != '') {
                                    $('#adressPreview').html(ulica + ' ' + numer + '<br/>' + kodPocztowy + ' ' + miasto + '<br/>' + '<small>' + latLng + '</small>');
                                   
                                } else if (ulica != '') {
                                    $('#adressPreview').html(ulica + ' ' + numer + '<br/>' + '<small>' + latLng + '</small>');
                                } else if (kodPocztowy != '') {
                                    $('#adressPreview').html(kodPocztowy + ' ' + miasto + '<br/>' + '<small>' + latLng + '</small>');
                                }

                            } else {
                                $('#adressPreview').html("Nie znaleziono adresu");
                            }
                        } else {
                            $('#adressPreview').html(status);
                        }
                    });
            }


            var map = new GoogleMap();
            map.initialize();
        }

        $scope.goToAddNewPersonTab = function () {
            $('#currentProjectPeopleTab').css('display', 'none');
            $('#addNewPersonTab').css('display', 'block');
        }

        $scope.goToPersonListTab = function () {
            $('#currentProjectPeopleTab').css('display', 'block');
            $('#addNewPersonTab').css('display', 'none');
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
                            iloscZadan: 0,
                            czasUzytkownika: '00:00',
                            kasaUzytkownika: '0',
                            punktyUzytkownika: 0,
                        }
                        var foundCheck2 = $filter('filter')($scope.currentuser[0].ostatnieOsoby, {
                            idUser: userToAddId
                        }, true);
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
            if (foundCheck.length > 0) {
                return true;
            } else {
                return false;
            }
        }

        $scope.userNoTask = function (userToAddId) {
            var foundCheck = $filter('filter')($scope.item.przypisaneOsoby, {
                idUser: userToAddId
            }, true);
            if (foundCheck[0].iloscZadan == 0) {
                return true;
            } else {
                return false;
            }
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
                    iloscZadan: 0,
                    czasUzytkownika: '00:00',
                    kasaUzytkownika: '0',
                    punktyUzytkownika: 0,
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
                var dd = dataTermin.substring(8, 10);
                var mm = dataTermin.substring(5, 7);
                var yyyy = dataTermin.substring(0, 4);
                var gg = dataTermin.substring(11, 13);
                var min = dataTermin.substring(14, 16);
                dataTermin = dd + '.' + mm + '.' + yyyy + ' ' + gg + ':' + min;
                var orderKey = orderKeyGen(dd, mm, yyyy, gg, min, 9);
                var nazwaTermin = $(this).find('input[type="text"]').val();
                var countTerms = $scope.item.terminy.length;
                var zadanie = {
                    idZadania: (countTerms + x + 1) * 1000,
                    idTerminu: (countTerms + x + 1) * 1000,
                    orderKey: orderKey,
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
                    idTerminu: (countTerms + x + 1) * 1000,
                    orderKey: orderKey,
                    mileStoneNaglowek: 'Milestone ' + (x + 1),
                    data: dataTermin,
                    nazwa: nazwaTermin
                }
                $scope.item.zadania.push(zadanie);
                $scope.item.terminy.push(termin);


            });
            $scope.RebuildTerms();

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
                    iloscZadan: 0,
                    czasUzytkownika: '00:00',
                    kasaUzytkownika: '0',
                    punktyUzytkownika: 0,
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
            if (foundCheck.length > 0) {
                return true;
            } else {
                return false;
            }
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
                tmp: [],
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
        //NOTE: Lista projekty
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
                budzetPienieznyWartosc: 4000,
                budzetPienieznyWykorzystanie: 1000,
                budzetGodzinowy: 'tak',
                budzetGodzinowyWartosc: 4000,
                budzetGodzinowyWykorzystanie: 1000,
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
                        idTerminu: 1000,
                        orderKey: 73585607209,
                        data: '09.12.2015 12:00',
                        nazwa: 'Preztacja projektu'
                  },
                    {
                        idTerminu: 2000,
                        orderKey: 73587010809,
                        data: '23.12.2015 15:00',
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
                        orderKey: 73586107201,
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
                        priorytet: 'prioImportant',
                        statusUzytkownika: 'w trakcie',
                        statusClass: 'completionHalf',
                        czasUzytkownika: '12:23',
                        kasaUzytkownika: '215zł',
                        punktyUzytkownika: '5',
                        dodatkowaKlasaListy: 'currentUser',
                        budzetPieniezny: 'tak',
                        budzetPienieznyWartosc: 4000,
                        budzetPienieznyWykorzystanie: 1000,
                        budzetGodzinowy: 'tak',
                        budzetGodzinowyWartosc: 4000,
                        budzetGodzinowyWykorzystanie: 1000,
                  },
                    {
                        idZadania: 2,
                        orderKey: 73586107203,
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
                        dodatkowaKlasaListy: 'currentUser',
                        budzetPieniezny: 'tak',
                        budzetPienieznyWartosc: 600,
                        budzetPienieznyWykorzystanie: 260,
                        budzetGodzinowy: 'tak',
                        budzetGodzinowyWartosc: 30,
                        budzetGodzinowyWykorzystanie: 15,
                  },
                    {
                        idZadania: 3,
                        orderKey: 73586407202,
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
                        dodatkowaKlasaListy: 'currentUser',
                        budzetPieniezny: 'tak',
                        budzetPienieznyWartosc: 600,
                        budzetPienieznyWykorzystanie: 260,
                        budzetGodzinowy: 'tak',
                        budzetGodzinowyWartosc: 30,
                        budzetGodzinowyWykorzystanie: 15,
                  },
                    {
                        idZadania: 4,
                        orderKey: 73584907204,
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
                        dodatkowaKlasaListy: 'currentUser',
                        budzetPieniezny: 'tak',
                        budzetPienieznyWartosc: 600,
                        budzetPienieznyWykorzystanie: 260,
                        budzetGodzinowy: 'tak',
                        budzetGodzinowyWartosc: 30,
                        budzetGodzinowyWykorzystanie: 15,
                  },
                    {
                        idZadania: 5,
                        orderKey: 73585207201,
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
                        dodatkowaKlasaListy: '',
                        budzetPieniezny: 'tak',
                        budzetPienieznyWartosc: 600,
                        budzetPienieznyWykorzystanie: 140,
                        budzetGodzinowy: 'nie',
                        budzetGodzinowyWartosc: 0,
                        budzetGodzinowyWykorzystanie: 0,
                  },
                    {
                        idZadania: 6,
                        idTerminu: 1000,
                        orderKey: 73585607209,
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
                        idZadania: 7,
                        idTerminu: 2000,
                        orderKey: 73587010809,
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