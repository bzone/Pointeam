(function () {
    'use strict';
    var module = angular.module('app', ['onsen']);
    var logType = 'wszystkie';
    var searchText = 'nie ma takiej mozliwosci';
    var url = "http://pointeam.com/auth.php?callback=?";
    //var url = "http://rabidata.kylos.pl/pointeam/auth.php?callback=?";
    var commentRefresh;
    var globalZadanieUpload = 0;
    var currentproject = 0;
    var selectedItem = "";
    var userGlobalId = 0;

    module.directive('fileModel', ['$parse', function ($parse) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                var model = $parse(attrs.fileModel);
                var modelSetter = model.assign;


                element.bind('change', function () {
                    scope.$apply(function () {
                        modelSetter(scope, element[0].files[0]);
                    });
                });
            }
        };
}]);

    module.service('fileUpload', ['$http', function ($http) {
        this.uploadFileToUrl = function (file, uploadUrl) {
            var fd = new FormData();
            fd.append('file', file);
            fd.append("akuku", "laksjf9s8d7ftasiydfgashdfoa8sd7ftasdfgy!siduya8sd7!!s");
            $http.post(uploadUrl, fd, {
                    transformRequest: angular.identity,
                    headers: {
                        'Content-Type': undefined
                    }
                })
                .success(function (data) {
                    window.console && console.log(data);

                    //$scope.$apply();

                    $.ajax({
                        type: "POST",
                        url: url,
                        data: {
                            file: 'http://pointeam.com/' + data.filename,
                            taskId: globalZadanieUpload,
                            addFileToTask: ''
                        },
                        crossDomain: true,
                        cache: false,
                        beforeSend: function () {},
                        success: function (data) {
                            if (data == "success") {

                                //alert('ok'); 
                            } else if (data = "failed") {

                            }
                        }
                    });


                })
                .error(function (data) {
                    window.console && console.log(data);
                });
        }
}]);


    var l_lang;
    if (navigator.userLanguage) // Explorer
        l_lang = navigator.userLanguage;
    else if (navigator.language) // FF
        l_lang = navigator.language;
    else
        l_lang = "en";


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

    module.filter('trustAsResourceUrl', ['$sce', function ($sce) {
        return function (val) {
            return $sce.trustAsResourceUrl(val);
        };
}])

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

    module.controller('AppController', function ($scope, $http, $projekty, $currentUser, $bazauzytkownikow, $filter, fileUpload) {
        $scope.user = $currentUser.items[0];
        $scope.doSomething = function () {
            setTimeout(function () {
                ons.notification.alert({
                    message: 'tapped'
                });
            }, 100);
        };

        $scope.detectLang = l_lang;
        //alert($scope.detectLang);

        $scope.langpl = {
            sign_in: "Zaloguj się",
            password: "hasło",
            or: 'lub',
            create_new_account: 'Utwórz nowe konto',
            forgot_password: 'zapomniałeś hasła?',
            name: 'imię',
            surname: 'nazwisko',
            create_account_and_sign_in: 'Utwórz konto i zaloguj',
            email_connected_to_account: 'Podaj adres e-mail powiązany z Twoim kontem.',
            recovery_on_email: 'Na podany adres otrzymasz przypomnienia swojego hasła.',
            your_email: 'Twój e-mail',
            reset_password: 'zresetuj hasło',
            add_user_with_nfc: 'Przypisz użytkownika/ów do tego zadania wykorzystując NFC',
            start_nfc: 'rozpocznij udostępnianie',
            finished_multi: 'ukończonych',
            task_multi: 'zadań',
            tasks_assigned_to_you: 'Zadania przypisane do Ciebie: ',
            recover_your_email: 'Podaj adres e-mail powiązany z Twoim kontem.',
            recover_your_email_description: 'Na podany adres otrzymasz przypomnienia swojego hasła.',
            your_email_lower_case: 'twój e-mail',
            nfc_description: 'Przypisz użytkownika/ów do tego zadania wykorzystując NFC',
            nfc_share: 'rozpocznij udostępnianie',
            task_not_assigned: ' Zadania nieprzypisane: ',
            closest_date: '  Najbliższy termin: ',
            tasks_assigned_to_other_people: 'zadania przypisane do innych osób',
            projects: 'Projekty',
            my_tasks: 'Moje zadania',
            informations: 'Informacje',
            comments: 'Komentarze',
            task_description: 'Opis zadania',
            localization: 'Lokalizacja: ',
            end_date_and_priority: 'Data ukończenia i priorytet',
            task_finished: 'Zadanie zakończone',
            priority_low: 'Priorytet niski',
            priority_medium: 'Priorytet normalny',
            priority_high: 'Priorytet wysoki',
            task_budget: 'Budżet zadania',
            done_hours1: 'przepracowanych',
            done_hours2: 'godzin',
            used_money1: 'wykorzystane',
            used_money2: 'pieniądze',
            assigned_people_none: 'Przypisane osoby: brak',
            get_task: 'przyjmij zadanie ',
            assigned_poeple: 'Przypisane osoby:',
            tasks: 'Zadania',
            budget: 'Budżet',
            resources: 'Zasoby',
            progress: 'Postęp',
            statistics: 'Statystyki',
            reported_cost: 'Zgłoszony koszt:',
            cost_accepted: 'koszt zaakceptowany',
            cost_rejected: 'koszt odrzucony',
            cost_rejected: 'koszt odrzucony',
            add_task: 'Dodaj zadanie',
            finished: 'zakończone',
            finished_tasks1: 'ukończone',
            finished_tasks2: 'zadania',
            budget_cost1: 'budżet',
            budget_cost2: 'pieniądze',
            budget_hours1: 'budżet',
            budget_hours2: 'godziny',
            add_resource: 'Dodaj zasób',
            no_reservations: 'brak rezerwacji',
            reservations: 'rezerwacje:',
            change_cost: 'Koszty - zmień ',
            tasks_done1: 'wykonanych',
            tasks_done2: 'zadań',
            not_assigned_tasks: 'nieprzypisane zadania',
            tasks_over_deadline: 'zadania po terminie',
            tasks_over_budget: 'zadania z przekroczonym budżetem',
            all_change: 'Wszystko - zmień ',
            finished_tasks: 'Zakończenie zadania:',
            premium_points_assigned: 'Przyznano punkty premiowe: ',
            new_task: 'Nowe zadanie:',
            project_ending: 'Zakończenie projektu',
            project_start: 'Rozpoczęcie projektu',
            milestone_finish: 'Zakończenie milestone',
            bonus_points: 'Punkty premiowe',
            settings: 'Ustawienia',
            change_avatar: 'zmień awatar',
            modify_personal_data: 'Modyfikuj dane osobowe',
            first_name: 'Imię',
            last_name: 'Nazwisko',
            notifications: 'Powiadomienia',
            notifications_description: 'Aktywując powiadomienia, otrzymasz dwa razy dziennie e-mail z podsumowaniem Twoich zadań.',
            new_project: 'Nowy projekt',
            basic_information: 'Informacje podstawowe',
            name_asterix: 'Nazwa*',
            deadlines: 'Terminy',
            add_deadline: 'dodaj termin',
            your_rate_hour: 'Twoja stawka/h',
            money_budget: 'Budżet pieniężny',
            value: 'Wartość',
            hours_budget: 'Budżet godzinowy',
            new_task2: 'Nowe zadanie',
            description: 'Opis',
            place: 'Miejsce',
            select_localization: 'Wybierz lokalizację',
            deadline_and_priority: 'Termin i priorytet',
            deadline: 'Termin',
            other_date: 'Inna data',
            priority: 'Priorytet',
            low: 'Niski',
            normal: 'Normalny',
            high: 'Wysoki',
            people: 'Osoby',
            add_user: 'dodaj osobę',
            add_user_title: 'Dodaj osobę',
            localization_title: 'Lokalizacja',
            localization_description: 'Kliknij na mapie, by wybrać lokalizację',
            added: 'Dodane',
            add_new: 'Dodaj nową',
            earlier_worked_with: 'Ostatnio pracowałeś z:',
            date: 'Data',
            name_title: 'Nazwa',
            money_title: 'Pieniądze',
            hours_title: 'Godziny',
            resource_information: 'Informacje o zasobie',
            reserve_resource: 'Zarezerwuj zasób',
            select_reservation_date: 'Wybierz okres rezerwacji',
            from: 'Od',
            to: 'Do',
            current_reservations: 'Aktualne rezerwacje',
            report_cost: 'Zgłoś koszt',
            cost_information: 'Informacje o koszcie',
            cost_asterix: 'Kwota*',
            cost_description: 'Administrator projektu może zaakceptować, lub odrzucić koszt. Zostaniesz poinformowany o podjętej decyzji.',
            map_center_at: 'Wyśrodkuj mapę na...',
            search_by_email: 'Wyszukaj przez e-mail',
            new_resource: 'Nowy zasób',
            extra_information: 'Dodatkowe informacje',
            new_cost: 'Nowy koszt',
            account_type: 'Typ konta',
            add_file: 'Dodaj plik',
            added_file: 'Dodany plik',
            text_premium: 'Osiągnięto limit osób w projekcie, aby dodać więcej osób zmień konto na Premium.',
            js_change_cost: 'Koszty - zmień ',
            js_worked_hours: 'Przepracowane godziny - zmień ',
            js_bonus_points: 'Punkty premiowe - zmień ',
            js_reported_cost: 'Zgłoszone koszty - zmień ',
            js_cost_label: 'Koszty',
            js_worked_hours_label: 'Przepracowany godziny',
            js_assigned_tasks_label: 'Przypisane zadania',
            js_bonus_points_label: 'Punkty premiowe',
            js_reported_cost_label: 'Zgłoszone koszty',
            js_budget_type_title: 'Opcje projektu',
            js_budget_type_message: 'co chcesz zrobić?',
            nfc_share: 'Przyłóż Swój telefon do drugiego telefonu aby udostępnić zadanie',
            nfc_share2: 'By przyjąć zadanie przez NFC, musisz przyłożyć swój telefon do telefonu użytkownika, który udostępnia zadanie. W momencie nawiązania łączności, użytkownik udostępniający musi dotknąć ekran, by przesłać Ci zadanie.',
            show_file: 'Zobacz plik',
            task_connected: 'Zadanie powiązane',
            empty: 'brak',
            file_selected: 'Wybrano plik',
            password_forgotten: 'Podane dane są niepoprawne. Zapomniałeś hasła?',
            data_incorrect: 'Podane dane są niepoprawne.',
            email_incorrect: 'Podany adres e-mail jest niepoprawny',
            account_already: 'Hey! Już masz konto! Możesz się zalogować!',
            error_wrong: 'Coś poszło nie tak',
            no_such_account: 'Brak konta powiązanego z tym adresem e-mail',
            pass_sent: 'Twoje hasło zostało wysłane na podany adres e-mail',
            pending: 'oczekuje',
            in_progress: 'w trakcie',
            sharing_message: 'Przesyłanie wiadomości',
            share_failed: 'Niepowodzenie przesyłania ',
            user_assigned: 'Przypisano Cię do nowego zadania.',
            user_cannot_assign: 'Odebrane zadanie nie jest powiązane z projektem, który masz właśnie otwarty.',
            type_name_project: 'Musisz podać nazwę projektu',
            at_least_one_date: 'Musisz dodać minimum jeden termin',
            task_title: 'Opcje zadania',
            task_message: 'co chcesz zrobić?',
            share_nfc: 'Przypisz zadanie przez NFC',
            share: 'Udostępnij',
            timer: 'Timer',
            task_cancel: 'Anuluj',
            currently_working_at: 'Właśnie pracuję nad przydzielonym mi zadaniem: ',
            connected_with: 'połączone z: ',
            time: 'czas: ',
            cash: 'kasa: ',
            task: 'zadanie: ',
            project: 'projekt: ',
            user: 'użytkownik: ',
            location_warning: 'Musisz być w odpowiedniej lokalizacji, by zakonczyć to zadanie',
            location_warning_title: 'Za daleko',
            location_check: 'Sprawdzanie poprawności lokalizacji...',
            message_data: 'Podaj wszystkie dane',
            message_title: 'Brak daty',
            wrong_date: 'Data końcowa nie może być mniejsza niż data początku',
            wrong_date_title: 'Niepoprawne daty',
            reservation_already_made: 'Okres rezerwacji nie może pokrywać się z inną rezerwacją',
            reservation_title: 'Niepoprawne daty',
            cost_title: 'Akceptacja kosztu',
            cost_message: 'Czy chcesz zaakceptować koszt?',
            yes_answer: 'Tak',
            no_answer: 'Nie',
            canel_answer: 'Anuluj',
            cost_message2: 'Podaj nazwę kosztu',
            cost_title2: 'Brak nazwy',
            new_task_message: 'Podaj nazwę zadania',
            new_task_title: 'Brak nazwy',
            new_date_message: 'Podaj termin wykonania zadania',
            new_date_title: 'Brak daty',
            res_message: 'Podaj nazwę zasobu',
            res_title: 'Brak nazwy',
            project_title: 'Opcje projektu',
            project_message: 'co chcesz zrobić',
            project_add_task: 'Dodaj zadanie',
            project_manage_users: 'Zarządzaj osobami',
            project_manage_dates: 'Zarządzaj terminami',
            project_manage_budget: 'Zarządzaj budżetem',
            project_add_res: 'Dodaj zasób',
            project_finish: 'Zakończ projekt',
            project_cancel: 'Anuluj',
            nfc_assign: 'Przyjmij zadanie przez NFC',
            cancel_nfc: 'Anuluj',
            location_click: 'Kliknij na mapie, by wybrać lokalizację',
            no_such_address: 'Nie znaleziono adresu',
            user_already_assigned: 'Ta osoba jest już dodana do tego projektu',
            hour_rate: 'Wpisz stawkę godzinową',
            project_all: 'Wszystkie',
            project_deadlines_crossed: 'Przekroczone terminy',
            project_budget_crossed: 'Przekroczone budżety',
            project_finished_tasks: 'Ukończone zadania',
            project_created_tasks: 'Utworzone zadania',
            how_many_bonus_points: 'Ile punktów chcesz dodać?'


        };

        $scope.langen = {
            sign_in: "Sign in",
            password: "password",
            or: 'or',
            create_new_account: 'Create new account',
            forgot_password: 'forgot password?',
            name: 'first name',
            surname: 'last name',
            create_account_and_sign_in: 'Create account and login',
            email_connected_to_account: 'Type in e-mail connected to your account',
            recovery_on_email: 'You will recieve an e-mail with reset password link in just a minute',
            your_email: 'Your e-mail',
            reset_password: 'reset password',
            add_user_with_nfc: 'Assigned users via NFC',
            start_nfc: 'start sharing',
            finished_multi: 'completed',
            task_multi: 'tasks',
            tasks_assigned_to_you: 'Tasks assigned to you: ',
            recover_your_email: 'Type in e-mail connected to your account.',
            recover_your_email_description: 'You will recieve an e-mail with reset password link in just a minute',
            your_email_lower_case: 'your e-mail',
            nfc_description: 'Assigned users via NFC',
            nfc_share: 'start sharing',
            task_not_assigned: ' Unassigned tasks: ',
            closest_date: '  Closest deadline: ',
            tasks_assigned_to_other_people: 'tasks assigned to other users',
            projects: 'Projects',
            my_tasks: 'My tasks',
            informations: 'Information',
            comments: 'Comments',
            task_description: 'Tasks description',
            localization: 'Localization: ',
            end_date_and_priority: 'Deadline and priority',
            task_finished: 'Task finished',
            priority_low: 'Low priority',
            priority_medium: 'Medium priority',
            priority_high: 'High priority',
            task_budget: 'Task budget',
            done_hours1: 'worked',
            done_hours2: 'hours',
            used_money1: 'money',
            used_money2: 'spent',
            assigned_people_none: 'Assigned users: none',
            get_task: 'take the task ',
            assigned_poeple: 'Assigned users:',
            tasks: 'Tasks',
            budget: 'Budget',
            resources: 'Resources',
            progress: 'Progress',
            statistics: 'Statistics',
            reported_cost: 'Reported cost:',
            cost_accepted: 'cost accepted',
            cost_rejected: 'cost rejected',
            add_task: 'Add a task',
            finished: 'finished',
            finished_tasks1: 'finished',
            finished_tasks2: 'tasks',
            budget_cost1: 'money',
            budget_cost2: 'budget',
            budget_hours1: 'hours',
            budget_hours2: 'budget',
            add_resource: 'Add a resource',
            no_reservations: 'no reservations',
            reservations: 'reservations:',
            change_cost: 'Cost - change ',
            tasks_done1: 'tasks',
            tasks_done2: 'done',
            not_assigned_tasks: 'unassigned tasks',
            tasks_over_deadline: 'tasks after the deadline',
            tasks_over_budget: 'tasks with exceeded budget',
            all_change: 'All - change ',
            finished_tasks: 'Task finish:',
            premium_points_assigned: 'Bonus points assigned: ',
            new_task: 'New task:',
            project_ending: 'Project deadline',
            project_start: 'Project start',
            milestone_finish: 'Milestone deadline',
            bonus_points: 'Bonus points',
            settings: 'Settings',
            change_avatar: 'change avatar',
            modify_personal_data: 'Modify personal data',
            first_name: 'Name',
            last_name: 'Surname',
            notifications: 'Notifications',
            notifications_description: 'With notifications turned on, you will recieve an e-mail with task summary twice a day',
            new_project: 'New project',
            basic_information: 'Basic information',
            name_asterix: 'Name*',
            deadlines: 'Deadlines',
            add_deadline: 'add a deadline',
            your_rate_hour: 'Your rate/h',
            money_budget: 'Money budget',
            value: 'Value',
            hours_budget: 'Hours budget',
            new_task2: 'New task',
            description: 'Description',
            place: 'Place',
            select_localization: 'Select localization',
            deadline_and_priority: 'Deadline and priority',
            deadline: 'Deadline',
            other_date: 'Other date',
            priority: 'Priority',
            low: 'Low',
            normal: 'Normal',
            high: 'High',
            people: 'Users',
            add_user: 'add a user',
            add_user_title: 'Add a user',
            localization_title: 'Localization',
            localization_description: 'Click on the map, to select a localization.',
            added: 'Added',
            add_new: 'Add new',
            earlier_worked_with: 'Recently worked with:',
            date: 'Date',
            name_title: 'Name',
            money_title: 'Money',
            hours_title: 'Hours',
            resource_information: 'Resource information',
            reserve_resource: 'Reserve resource',
            select_reservation_date: 'Select reservation date',
            from: 'From',
            to: 'To',
            current_reservations: 'Current reservations',
            report_cost: 'Report cost',
            cost_information: 'Cost information',
            cost_asterix: 'Cost*',
            cost_description: 'Project administrator can accept or reject reported cost. You will be notified about the decision.',
            map_center_at: 'Center map at...',
            search_by_email: 'Search by e-mail',
            new_resource: 'New resource',
            extra_information: 'Extra information',
            new_cost: 'New cost',
            account_type: 'Account type',
            add_file: 'Add file',
            added_file: 'Added file',
            text_premium: 'Users assigned to project limit has been reached. If you want to add more users change account type to Premium.',
            js_change_cost: 'Cost - change ',
            js_worked_hours: 'Worked hours - change ',
            js_bonus_points: 'Bonus points - change ',
            js_reported_cost: 'Reported costs - change ',
            js_cost_label: 'Costs',
            js_worked_hours_label: 'Worked hours',
            js_assigned_tasks_label: 'Assigned tasks',
            js_bonus_points_label: 'Bonus points',
            js_reported_cost_label: 'Reported costs',
            js_budget_type_title: 'Project options',
            js_budget_type_message: 'what are you up to?',
            nfc_share: 'Touch your phone with other phone to share a task',
            nfc_share2: 'To get the task via NFC, you have to touch your phone with other user phone, who shares the task. When the connection is made, sharing user has to tap the screen to share the task.',
            show_file: 'Show file',
            task_connected: 'Connected task',
            empty: 'none',
            file_selected: 'File selected',
            password_forgotten: 'Data incorrect! Have you forgot your password?',
            data_incorrect: 'Data incorrect.',
            email_incorrect: 'E-mail address incorrect!',
            account_already: 'Hey! You have an account. You can sign in!',
            error_wrong: 'Something went wrong',
            no_such_account: 'No account linked to this e-mail address.',
            pass_sent: 'Your password has been sent to your e-mail address!',
            pending: 'pending',
            in_progress: 'in progress',
            sharing_message: 'Sharing message',
            share_failed: 'Sharing failed ',
            user_assigned: 'You have been assigned to new task.',
            user_cannot_assign: 'Recieved task is not part of project that you have opened.',
            type_name_project: 'You must fill in project name',
            at_least_one_date: 'You must add at least one date',
            task_title: 'Task options',
            task_message: 'what do you want to do?',
            share_nfc: 'Assign task via NFC',
            share: 'Share',
            timer: 'Timer',
            task_cancel: 'Cancel',
            currently_working_at: 'Currently working at: ',
            connected_with: 'linked with: ',
            time: 'time: ',
            cash: 'cash: ',
            task: 'task: ',
            project: 'project: ',
            user: 'user: ',
            location_warning: 'You have to be at exact location to finish this task!',
            location_warning_title: 'Too far',
            location_check: 'Verifying location...',
            message_data: 'All fields required',
            message_title: 'No date',
            wrong_date: 'End date cannot be before start date!',
            wrong_date_title: 'Incorrect dates',
            reservation_already_made: 'Reservation date cannot overlap other reservations',
            reservation_title: 'Incorrect dates',
            cost_title: 'Cost verify',
            cost_message: 'Do you accept this cost?',
            yes_answer: 'Yes',
            no_answer: 'No',
            canel_answer: 'Cancel',
            cost_message2: 'Cost name',
            cost_title2: 'No name',
            new_task_message: 'Type task name',
            new_task_title: 'No name',
            new_date_message: 'Specify deadline',
            new_date_title: 'No date',
            res_message: 'Specify resource name',
            res_title: 'No name',
            project_title: 'Project options',
            project_message: 'what do you want to do?',
            project_add_task: 'Add a task',
            project_manage_users: 'Manage users',
            project_manage_dates: 'Manage deadlines',
            project_manage_budget: 'Manage budgets',
            project_add_res: 'Add a resource',
            project_finish: 'Finish project',
            project_cancel: 'Cancel',
            nfc_assign: 'Get task via NFC',
            cancel_nfc: 'Cancel',
            location_click: 'Click on the map to select location',
            no_such_address: 'Address not found',
            user_already_assigned: 'User is already assigned to this task!',
            hour_rate: 'Specify hour rate',
            project_all: 'All',
            project_deadlines_crossed: 'Deadlines crossed',
            project_budget_crossed: 'Budgets crossed',
            project_finished_tasks: 'Finished tasks',
            project_created_tasks: 'Created tasks',
            how_many_bonus_points: 'How many points would you like to assign?'
        }

        if ($scope.detectLang == 'pl' || $scope.detectLang == 'pl-PL' || $scope.detectLang == 'pl-pl') {
            $scope.lang = $scope.langpl;
        } else {
            $scope.lang = $scope.langen;
        }
        

        $scope.isAndroidTest = function () {
            var ua = navigator.userAgent.toLowerCase();
            var isAndroid = ua.indexOf("android") > -1; //&& ua.indexOf("mobile");
            if (isAndroid) {
                return true;
            } else {
                return false; //change
            }
        }

        $scope.fileSelect = function () {
            $('label[for="fileU"]').text($scope.lang.file_selected);
        }

        $scope.uploadFile = function () {
            var file = $scope.myFile;
            file = $('#fileU').prop('files');
            file = file[0];
            if (file == null) {
                console.dir(file);
            } else {
                //console.log('file is ');
                //console.dir(file);
                var uploadUrl = "http://pointeam.com/upload.php";
                fileUpload.uploadFileToUrl(file, uploadUrl);
            }
        }

        $scope.addLogElement = function (idProjekt, idUser, typ, nazwa, osoba, avatar, data, odczytany) {
            $.ajax({
                type: "POST",
                url: url,
                data: {
                    idProjekt: idProjekt,
                    idUser: idUser,
                    typ: typ,
                    nazwa: nazwa,
                    osoba: osoba,
                    avatar: avatar,
                    data: data,
                    odczytany: odczytany,
                    insertNewLog: ''
                },
                crossDomain: true,
                cache: false,
                beforeSend: function () {},
                success: function (data) {
                    return data;
                }
            });
        }

        $scope.showFile = function (fileurl) {
            $scope.fileUrl = fileurl;
            navi.pushPage('filedetails.html', {
                animation: 'slide'
            });
        }

        $scope.switch = function (nazwa) {
            nazwa = '#' + nazwa;
            $(nazwa).toggleClass('inactive');
        }

        $scope.checkLogin = function () {
            if (localStorage.login == "true") {
                $("#spinner").css('display', 'block');
                $('#spinnerIcon').delay(1500).queue(function (next) {
                    //$(this).hide();
                    next();
                });
                $('#spinnerOk').delay(1500).queue(function (next) {
                    //$(this).show();
                    next();
                });
                var email = localStorage.email;
                $scope.updateUsersBase();
                $scope.getUserData(email, 1);
            }
        }

        $scope.updateUsersBase = function () {
            var dataString = "updateUsersBase=";
            $.ajax({
                type: "POST",
                url: url,
                data: dataString,
                crossDomain: true,
                cache: false,
                beforeSend: function () {},
                success: function (data) {

                    $bazauzytkownikow.items = angular.fromJson(data).osoby;
                }
            });
        }

        $scope.logOut = function () {
            localStorage.login = "false";
            var pages = navi.getPages();
            if (pages.length == 3) {
                navi.getPages()[2].destroy();
                navi.popPage();
            } else {
                navi.getPages()[3].destroy();
                navi.getPages()[2].destroy();
                navi.popPage();
            }
        }

        $scope.loginUser = function () {
            var email = $("#loginEmail").val();
            var password = $("#loginPassword").val();
            var dataString = "email=" + email + "&password=" + password + "&login=";
            if ($.trim(email).length > 0 & $.trim(password).length > 0) {
                $.ajax({
                    type: "POST",
                    url: url,
                    data: dataString,
                    crossDomain: true,
                    cache: false,
                    beforeSend: function () {
                        $("#spinner").css('display', 'block');
                    },
                    success: function (data) {
                        if (data == "success") {
                            localStorage.login = "true";
                            localStorage.email = email;

                            $('#spinnerIcon').delay(1500).queue(function (next) {
                                //$(this).hide();
                                next();
                            });
                            $('#spinnerOk').delay(1500).queue(function (next) {
                                //$(this).show();
                                next();
                            });
                            $scope.updateUsersBase();
                            $scope.getUserData(email, 1);


                        } else if (data = "failed") {
                            $("#spinner").fadeOut(1000);
                            ons.notification.alert({
                                message: $scope.lang.password_forgotten
                            });
                        }
                    }
                });
            } else {
                ons.notification.alert({
                    message: 'Podaj e-mail i hasło'
                });
            }
            return false;
        }


        $scope.updateUser = function () {
            var imie = $scope.user.imie;
            var nazwisko = $scope.user.nazwisko;
            var email = $scope.user.email;
            var powiadomienia = $("#powiadomieniaOption input").prop('checked');
            if (powiadomienia) {
                powiadomienia = 1;
            } else {
                powiadomienia = 0;
            }
            var avatar = $('#capturePhoto').attr('data-avatar');
            if (typeof avatar == typeof undefined) {
                avatar = $scope.user.avatar;
            } else {
                $scope.user.avatar = avatar;
            }

            $.ajax({
                type: "POST",
                url: url,
                data: {
                    imie: imie,
                    nazwisko: nazwisko,
                    email: email,
                    avatar: avatar,
                    powiadomienia: powiadomienia,
                    updateUser: ''
                },
                crossDomain: true,
                cache: false,
                beforeSend: function () {},
                success: function (data) {
                    if (data == "success") {
                        $scope.user.powiadomienia = powiadomienia;
                        if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
                            $scope.$apply();
                        }
                        navi.popPage();
                    } else if (data = "failed") {
                        ons.notification.alert({
                            message: $scope.lang.data_incorrect
                        });
                    }
                }
            });


        }

        $scope.registerUser = function () {

            function validateEmail(email) {
                var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                return re.test(email);
            }

            var imie = $("#newUserName").val();
            var nazwisko = $("#newUserSurName").val();
            var email = $("#newUserEmail").val();
            var password = $("#newUserPassword").val();

            if (!validateEmail(email)) {

                ons.notification.alert({
                    message: $scope.lang.email_incorrect
                });

            } else {

                var dataString = "imie=" + imie + "&nazwisko=" + nazwisko + "&email=" + email + "&password=" + password + "&signup=";

                if ($.trim(imie).length > 0 & $.trim(nazwisko).length > 0 & $.trim(email).length > 0 & $.trim(password).length > 0) {
                    $.ajax({
                        type: "POST",
                        url: url,
                        data: dataString,
                        crossDomain: true,
                        cache: false,
                        beforeSend: function () {
                            $("#spinner").css('display', 'block');
                        },
                        success: function (data) {
                            if (data == "success") {
                                localStorage.login = "true";
                                localStorage.email = email;
                                $('#spinnerIcon').delay(1500).queue(function (next) {
                                    //$(this).hide();
                                    next();
                                });
                                $('#spinnerOk').delay(1500).queue(function (next) {
                                    //$(this).show();
                                    next();
                                });

                                $scope.getUserData(email, 1);
                                $scope.updateUsersBase();

                            } else if (data == "exist") {

                                ons.notification.alert({
                                    message: $scope.lang.account_already
                                });
                                $("#spinner").fadeOut(1000);
                                navi.popPage();
                            } else if (data == "failed") {
                                alert($scope.lang.error_wrong);
                            }
                        }
                    });
                }
            }
            return false;
            //onclick="navi.pushPage('home.html', { animation : 'slide' } )"
        }

        $scope.recoverPassword = function () {
            var email = $("#recoverEmail").val();
            var dataString = "email=" + email + "&forget_password=";
            if ($.trim(email).length > 0) {
                $.ajax({
                    type: "POST",
                    url: url,
                    data: dataString,
                    crossDomain: true,
                    cache: false,
                    beforeSend: function () {},
                    success: function (data) {
                        if (data == "invalid") {
                            ons.notification.alert({
                                message: $scope.lang.no_such_account
                            });
                        } else if (data = "success") {
                            ons.notification.alert({
                                message: $scope.lang.pass_sent
                            });
                            navi.popPage();
                        }
                    }
                });
            }
            return false;
        }

        $scope.getUserData = function (email, go) {
            $("#spinner").css('display', 'block');
            var dataString = "email=" + email + "&getUserData=";
            $.ajax({
                type: "POST",
                url: url,
                data: dataString,
                crossDomain: true,
                cache: false,
                beforeSend: function () {},
                success: function (data) {

                    //alert(data);

                    $('#spinner').delay(1500).queue(function (next) {
                        $scope.user = angular.fromJson(data).user[0];
                        $currentUser.items[0] = angular.fromJson(data).user[0];
                        userGlobalId = $currentUser.items[0].idUser;
                        if (angular.fromJson(data).project) {
                            $projekty.items = angular.fromJson(data).project;
                            $currentUser.items[0].tasks = angular.fromJson(data).usertasks;
                            var iloscProjektow = $projekty.items.length;
                        }
                        window.console && console.log('pobrano dane uzytkownika');
                        $scope.$apply();
                        angular.forEach($projekty.items, function (project, index) {
                            //console.log(project.tytul);
                            $.ajax({
                                type: "POST",
                                url: url,
                                data: {
                                    idProjekt: project.idProjekt,
                                    getLogData: ''
                                },
                                crossDomain: true,
                                cache: false,
                                beforeSend: function () {},
                                success: function (data) {

                                    project.log = angular.fromJson(data).log;
                                    project.log = angular.fromJson(data).log;
                                    project.przypisaneOsoby = angular.fromJson(data).osoby;
                                    project.zadania = angular.fromJson(data).zadania;
                                    project.terminy = angular.fromJson(data).terminy;
                                    project.koszty = angular.fromJson(data).koszty;
                                    project.zasoby = angular.fromJson(data).zasoby;

                                    var found = $filter('filter')(project.przypisaneOsoby, {
                                        idUser: $scope.user.idUser
                                    }, true);

                                    project.kasaUzytkownika = found[0].kasaUzytkownika;
                                    project.czasUzytkownika = found[0].czasUzytkownika;
                                    project.punktyUzytkownika = found[0].punktyUzytkownika;
                                    var czas = parseInt(project.czasUzytkownika);
                                    if (czas == 0) {
                                        project.statusUzytkownika = $scope.lang.pending;
                                        project.statusClass = "completionHalf";
                                    } else {
                                        project.statusUzytkownika = $scope.lang.in_progress
                                        project.statusClass = "completionHalf";
                                    }

                                    if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
                                        $scope.$apply();
                                    }

                                }
                            });

                        });



                        $(this).hide();
                        if (go == 1) {
                            navi.pushPage('home.html', {
                                animation: 'slide'
                            });
                            $scope.reloadProjectsGlobal();
                        }
                        if (go == 2) {
                            navi.popPage();
                            $scope.reloadProjectsGlobal();
                        }
                        if (go == 3) {
                            $scope.reloadProjectsGlobal();
                            $scope.navi.replacePage('procjectview.html', {
                                title: selectedItem.tytul
                            });
                        }
                        $("#spinner").fadeOut(1000);
                        $scope.reloadProjectsGlobal();
                        next();
                    });

                }
            });
        }

        $scope.reloadUserData = function () {
            var email = localStorage.email;
            $scope.getUserData(email, 2);
        }

        $scope.reloadUserDataGoToProject = function () {
            var email = localStorage.email;
            $scope.getUserData(email, 3);
        }

        $scope.reloadProjectsGlobal = function () {
            $scope.$root.$broadcast("reloadProjectsEvent");
        }


        $scope.addCommentGlobal = function () {
            $scope.$root.$broadcast("addCommentEvent");
        }


        $scope.addUserToTaskGlobal = function (user, task) {
            alert(user);
            alert(task);
            var args = {
                userid: user,
                taskid: task
            }
            $scope.$root.$broadcast("addUserToTaskEvent", args);
        }

        var android = true;

        $scope.notifyUser = function (message) {
            if (android) {
                toast.showShort(message);
            } else {
                statusDiv.innerHTML = message;
                setTimeout(function () {
                    statusDiv.innerHTML = "";
                }, 3000);
            }
        }


        $scope.startNFC = function (zadanie, projekt) {
            navi.pushPage('nfcShare.html', {
                animation: 'slide'
            });
            //alert(zadanie);
            var mimeType = 'text/pg';
            var payload = String(zadanie);
            alert(currentproject);
            var record = ndef.mimeMediaRecord(mimeType, nfc.stringToBytes(payload));

            nfc.share(
            [record],
                function () {
                    if (bb10) {

                    } else if (windowsphone) {
                        // Windows phone calls success immediately. Bug?
                        $scope.notifyUser($scope.lang.sharing_message);
                    } else {
                        //alert("Sent Message to Peer");
                    }
                },
                function (reason) {
                    alert($scope.lang.share_failed + reason);
                    checkbox.checked = false;
                }
            );

        }

        $scope.stopNFC = function (zadanie, projekt) {
            nfc.unshare(
                function () {
                    //alert("Message is no longer shared.");
                },
                function (reason) {
                    //alert("Failed to unshare message " + reason);
                }
            );
            navi.popPage();
        }


        $scope.isTaskInProject = function (projekt, task) {
            //alert('projekt:'+projekt+' task:'+task);
            $.ajax({
                type: "POST",
                url: url,
                data: {
                    idZadania: task,
                    idProjekt: projekt,
                    isTaskInProject: ''
                },
                crossDomain: true,
                cache: false,
                beforeSend: function () {},
                success: function (data) {
                    //alert(data);
                    if (parseInt(data) == 1) {
                        //alert('dobry projekt');
                        $scope.addUserToTaskGlobal($scope.user.idUser, task);
                        ons.notification.alert({
                            message: $scope.lang.user_assigned
                        });
                    } else {
                        ons.notification.alert({
                            message: $scope.lang.user_cannot_assign
                        });
                    }
                }
            });
        }



        $scope.lisenNFC = function () {
            //alert($scope.user.idUser);
            //$scope.addUserToTaskGlobal($scope.user.idUser,77);

            //alert('słucham');
            navi.pushPage('nfcLi.html');
            //alert(currentproject);
            function parseTag(nfcEvent) {
                //alert('pobrano');
                var records = nfcEvent.tag;
                var record = '';
                //alert(records.id);
                //alert(records.ndefMessage[0].payload[1]);
                for (var i = 0; i < records.ndefMessage[0].payload.length; i++) {
                    record += String.fromCharCode(records.ndefMessage[0].payload[i]);
                }
                //alert(record);
                $scope.isTaskInProject(currentproject, parseInt(record));
            }

            nfc.addMimeTypeListener(
                'text/pg', parseTag,
                function () {
                    //alert("Success.");
                },
                function () {
                    alert("Fail.");
                }
            );
        }

        $scope.isAdmin = function (projekt) {

            var isadmin = false;
            $.ajax({
                type: "POST",
                url: url,
                data: {
                    idProjekt: projekt,
                    idUser: $scope.user.idUser,
                    isProjectAdmin: ''
                },
                async: false,
                crossDomain: true,
                cache: false,
                beforeSend: function () {},
                success: function (data) {
                    //alert(data);
                    if (parseInt(data) == 1) {
                        isadmin = true;
                    } else {
                        isadmin = false;
                    }
                }
            });
            return isadmin;


            //var found = $filter('filter')($projekty.items, {
            //  idProjekt: projekt
            //}, true);
            //if (found[0].idUser == $scope.user.idUser) {
            //    return true;
            //} else {
            //     return false;
            //}
        }

        $scope.goToDashboard = function () {
            $('.page__background').toggleClass('simpleBG');
            $('.tabMojeZadania').css('display', 'none');
            $('.tabProjekty').css('display', 'none');
            $('.homeTabs').css('display', 'none');
            $('.tabDashboard').css('overflow', 'initial');
            $('.tabDashboard').css('height', 'auto');
            $('#goToList').css('display', 'inline-block');
        };

        $scope.goToProjekty = function () {
            $('.tabMojeZadania').css('display', 'none');
            $('.tabProjekty').css('display', 'block');
            $('.homeTabs').css('display', 'block');
            $('.tabDashboard').css('overflow', 'hidden');
            $('.tabDashboard').css('height', '0');
            $('#goToList').css('display', 'none');
            var email = localStorage.email;
            $scope.getUserData(email, 0);
        }

        $scope.addProject = function () {
            var iteratorTerminow = 0;
            var terminyIlosc = $('.pojedynczyTermin').length;
            window.console && console.log('ilosc terminow:' + terminyIlosc);
            var nazwa = $('#nazwaProjektu').val();
            if (nazwa == '') {
                ons.notification.alert({
                    message: $scope.lang.type_name_project
                });
            } else if (terminyIlosc == 0) {
                ons.notification.alert({
                    message: $scope.lang.at_least_one_date
                });
            } else {
                $scope.items = $projekty.items;
                var today = new Date();
                var dd = today.getDate();
                var mm = today.getMonth() + 1;
                var yyyy = today.getFullYear();
                var gg = today.getHours();
                var min = today.getMinutes();
                var orderKey = orderKeyGen(dd, mm, yyyy, gg, min, 0);
                window.console && console.log('orderKeyToday:' + orderKey);
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
window.console && console.log('budzetPienieznyWartosc: '+budzetPienieznyWartosc);
                window.console && console.log('budzetGodzinowyWartosc: '+budzetGodzinowyWartosc);
                var krotki = nazwa.substring(0, 15) + '...';
                $.ajax({
                    type: "POST",
                    url: url,
                    data: {
                        tytul: nazwa,
                        idUser: $scope.user.idUser,
                        krotkitytul: krotki,
                        avatarAdmina: $scope.user.avatar,
                        imie: $scope.user.imienazwisko,
                        stawka: budzetAdmin,
                        procentUkonczeniaProjektu: 0,
                        budzetPieniezny: budzetPieniezny,
                        budzetPienieznyWartosc: budzetPienieznyWartosc,
                        budzetPienieznyWykorzystanie: 0,
                        budzetGodzinowy: budzetGodzinowy,
                        budzetGodzinowyWartosc: budzetGodzinowyWartosc,
                        budzetGodzinowyWykorzystanie: 0,
                        ukonczoneZadania: 0,
                        wszystkieZadania: 0,
                        zadaniaNieprzypisane: 0,
                        zadaniaPoTerminie: 0,
                        zadaniaPrzekroczonyBudzet: 0,
                        insertNewProject: ''
                    },
                    crossDomain: true,
                    cache: false,
                    beforeSend: function () {},
                    success: function (data) {
                        window.console && console.log('dodano zadanie');
                        var projektID = data;

                        $scope.addLogElement(projektID, $scope.user.idUser, 'rozpoczecieProjektu', '', $scope.user.imienazwisko, $scope.user.avatar, today, 0);


                        var item = {
                            idProjekt: projektID,
                            idUser: $scope.user.idUser,
                            tytul: nazwa,
                            krotkitytul: krotki,
                            avatarAdmina: $scope.user.avatar,
                            statusUzytkownika: 'oczekuje',
                            statusClass: 'completionHalf',
                            czasUzytkownika: '00:0',
                            kasaUzytkownika: '0',
                            punktyUzytkownika: '0',
                            procentUkonczeniaProjektu: 0,
                            budzetPieniezny: budzetPieniezny,
                            budzetPienieznyWartosc: budzetPienieznyWartosc,
                            budzetPienieznyWykorzystanie: 0,
                            budzetGodzinowy: budzetGodzinowy,
                            budzetGodzinowyWartosc: budzetGodzinowyWartosc,
                            budzetGodzinowyWykorzystanie: 0,
                            ukonczoneZadania: 0,
                            wszystkieZadania: 0,
                            notyfikacjeDisplay: 'none',
                            notyfikacje: 0,
                            zadaniaPrzypisaneDoUzytkownika: 0,
                            zadaniaNieprzypisane: 0,
                            zadaniaPoTerminie: 0,
                            zadaniaPrzekroczonyBudzet: 0,
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
                                    idUser: $scope.user.idUser,
                                    avatar: $scope.user.avatar,
                                    iloscZadan: 0,
                                    stawka: budzetAdmin,
                                    imie: $scope.user.imie + ' ' + $scope.user.nazwisko,
                                    czasUzytkownika: 0,
                                    kasaUzytkownika: 0,
                                    punktyUzytkownika: 0,
                                    dodatkowaKlasaListy: 'currentUser'
                  }
              ]
                        };


                        $projekty.items.push(item);
                        if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
                            $scope.$apply();
                        }
                        var index = $scope.items.length;
                        selectedItem = $projekty.items[index - 1];

                        $('.pojedynczyTermin').each(function (x) {




                            var dataTermin = $(this).find('input[type="datetime-local"]').val();
                            //console.log(dataTermin);
                            dd = dataTermin.substring(8, 10);
                            mm = dataTermin.substring(5, 7);
                            yyyy = dataTermin.substring(0, 4);
                            gg = dataTermin.substring(11, 13);
                            min = dataTermin.substring(14, 16);
                            dataTermin = dd + '.' + mm + '.' + yyyy + ' ' + gg + ':' + min;
                            var orderKey2 = orderKeyGen(dd, mm, yyyy, gg, min, 9);
                            var nazwaTermin = $(this).find('input[type="text"]').val();



                            $.ajax({
                                type: "POST",
                                url: url,
                                data: {
                                    idProjekt: projektID,
                                    orderKey: orderKey2,
                                    mileStoneNaglowek: 'Milestone ' + (x + 1),
                                    data: dataTermin,
                                    nazwa: nazwaTermin,
                                    addNewTerm: ''
                                },
                                crossDomain: true,
                                cache: false,
                                beforeSend: function () {},
                                success: function (data) {
                                    var idTerminu = data;


                                    $.ajax({
                                        type: "POST",
                                        url: url,
                                        data: {
                                            idProjekt: projektID,
                                            idTerminu: parseInt(idTerminu),
                                            nazwa: nazwaTermin,
                                            opis: '',
                                            data: dataTermin,
                                            dataDzien: dd,
                                            dataMiesiac: mm,
                                            dataGodzina: gg + ':' + min,
                                            orderKey: orderKey2,
                                            basicItem: 'none',
                                            milestone: 'block',
                                            mileStoneNaglowek: 'Milestone ' + (x + 1),
                                            milestoneUkonczoneZadaniaProcent: 0,
                                            milestoneWykorzystanyBudzetPieniadze: 0,
                                            milestoneWykorzystanyBudzetGodziny: 0,
                                            avatarPierwszejOsoby: '',
                                            dodatkoweOsobyDisplay: 'none',
                                            dotatkoweOsoby: 0,
                                            ukonczoneDisplay: 'none',
                                            brakOsobyDisplay: 'none',
                                            lokalizacjaDisplay: 'none',
                                            lokalizacja: 'none',
                                            latLngPosition: 'none',
                                            priorytet: 'none',
                                            status: 'none',
                                            budzetPieniezny: 'none',
                                            budzetPienieznyWartosc: 0,
                                            budzetPienieznyWykorzystanie: 0,
                                            budzetGodzinowy: 'none',
                                            budzetGodzinowyWartosc: 0,
                                            budzetGodzinowyWykorzystanie: 0,
                                            punktyPremiowe: 'none',
                                            punktyPremioweWartosc: 0,
                                            addTaskToProject: ''
                                        },
                                        crossDomain: true,
                                        cache: false,
                                        beforeSend: function () {},
                                        success: function (data) {
                                            var idZadania = data;

                                            var zadanie = {
                                                idZadania: parseInt(idZadania),
                                                idTerminu: parseInt(idTerminu),
                                                orderKey: orderKey2,
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
                                                idTerminu: parseInt(idTerminu),
                                                orderKey: orderKey2,
                                                mileStoneNaglowek: 'Milestone ' + (x + 1),
                                                data: dataTermin,
                                                nazwa: nazwaTermin
                                            }
                                            $projekty.items[index - 1].zadania.push(zadanie);
                                            $projekty.items[index - 1].terminy.push(termin);


                                            iteratorTerminow++;
                                            if (iteratorTerminow == terminyIlosc) {
                                                $projekty.selectedItem = selectedItem;
                                                $scope.reloadUserDataGoToProject();
                                            }

                                        }
                                    });
                                }
                            });
                        });
                    }
                });
            }
        }
    });


    module.controller('SingleTask', function ($scope, $projekty, $filter, $bazauzytkownikow, $currentUser, $sce) {
        $scope.item = $projekty.selectedTask;
        $scope.projekt = $projekty.selectedItem;
        $scope.taskOptions = function (android, ukonczony, userIn, zadanie, projekt, user, nazwa, admin) {
            if (ukonczony == "none") {
                ukonczony = false;
            } else {
                ukonczony = true;
            }
            window.console && console.log('android: ' + android + ' ukoncozny: ' + ukonczony + ' userOwner: ' + userIn);
            if (admin == user) {
                admin = true;
            } else {
                admin = false
            }
            if (android && !ukonczony && admin) {
                ons.notification.confirm({
                    title: $scope.lang.task_title,
                    message: $scope.lang.task_message,
                    buttonLabels: [$scope.lang.share_nfc, $scope.lang.share, $scope.lang.timer, $scope.lang.task_cancel],
                    primaryButtonIndex: 0,
                    callback: function (index) {
                        if (index == 0) {
                            $scope.startNFC(zadanie, projekt);
                        }
                        if (index == 1) {
                            window.plugins.socialsharing.share($scope.lang.currently_working_at + nazwa, null, 'http://pointeam.com/pointeamshare.jpg', 'http://www.pointeam.com');
                        }
                        if (index == 2) {
                            $scope.startTimer(zadanie, projekt, user);
                        }
                        if (index == 3) {}
                    }
                });
            } else if (!ukonczony && userIn) {
                ons.notification.confirm({
                    title: $scope.lang.task_title,
                    message: $scope.lang.task_message,
                    buttonLabels: [$scope.lang.share, $scope.lang.timer, $scope.lang.task_cancel],
                    primaryButtonIndex: 0,
                    callback: function (index) {
                        if (index == 0) {
                            window.plugins.socialsharing.share($scope.lang.currently_working_at + nazwa, null, 'http://pointeam.com/pointeamshare.jpg', 'http://www.pointeam.com');
                        }
                        if (index == 1) {
                            $scope.startTimer(zadanie, projekt, user);
                        }
                        if (index == 2) {}
                    }
                });
            } else {
                window.plugins.socialsharing.share($scope.lang.currently_working_at + nazwa, null, 'http://pointeam.com/pointeamshare.jpg', 'http://www.pointeam.com');
            }
        }
        $("#spinner").fadeOut(1000);


        $scope.item.candone = true;
        var connectTaskDetails = parseInt($scope.item.polaczone);
        window.console && console.log($scope.lang.connected_with + connectTaskDetails);

        if (connectTaskDetails != 1 && connectTaskDetails != 0) {
            connectTaskDetails = $filter('filter')($scope.projekt.zadania, {
                idZadania: connectTaskDetails
            }, true);
            window.console && console.log($scope.lang.connected_with + connectTaskDetails[0].nazwa);
            $scope.item.nazwapolaczonego = connectTaskDetails[0].nazwa;
            if (connectTaskDetails[0].ukonczoneDisplay == "none") {
                $scope.item.candone = false;
            }
        }
        window.console && console.log($scope.item.candone);

        $scope.baza = $bazauzytkownikow.items;
        $scope.currentuser = $currentUser.items;
        var htmlContent = $scope.item.lokalizacja;
        if (htmlContent) {
            htmlContent = htmlContent.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
        }
        $scope.someSafeContent = $sce.trustAsHtml(htmlContent);
        var found = $filter('filter')($scope.projekt.zadania, {
            data: $scope.item.data
        }, true);
        if (found.length > 0) {
            $scope.milestoneName = found[0];
        }
        var timeinterval;

        $scope.startTimer = function (zadanie, projekt, user) {
            user = $scope.currentuser.idUser;
            var found;
            var foundTask;
            var foundUser;
            var foundUserProject;

            found = $filter('filter')($projekty.items, {
                idProjekt: projekt
            }, true);

            foundTask = $filter('filter')(found[0].zadania, {
                idZadania: zadanie
            }, true);
            var nazwa = foundTask[0].nazwa;
            //console.log($scope.item);
            $('#clockTaskName').text($scope.item.nazwa);

            foundUser = $filter('filter')($scope.item.przypisaneOsoby, {
                idUser: user
            }, true);

            foundUserProject = $filter('filter')(found[0].przypisaneOsoby, {
                idUser: user
            }, true);



            //NOTE: New now point
            var stawka = foundUser[0].stawka;
            var czasStartu = foundUser[0].czasUzytkownika;
            var kasaStartu = foundUser[0].kasaUzytkownika;

            $('#timer').css('display', 'block');
            var minutes = czasStartu;
            var hours = (minutes - (minutes % 60)) / 60;
            var kasa = ((minutes / 60) * stawka / 100).toFixed(2);
            var kasagr = Math.floor((minutes / 60) * stawka);
            var clock = document.getElementById('clockdiv');
            $('.clockAnimation').addClass('animateClock');

            if ((minutes - (hours * 60)) < 10) {
                clock.innerHTML = hours + ':0' + (minutes - (hours * 60)) + ' | ' + kasa + 'zł';
            } else {
                clock.innerHTML = hours + ':' + (minutes - (hours * 60)) + ' | ' + kasa + 'zł';
            }

            timeinterval = setInterval(function () {
                minutes++;
                kasa = ((minutes / 60) * stawka / 100).toFixed(2);
                kasagr = Math.floor((minutes / 60) * stawka);
                hours = (minutes - (minutes % 60)) / 60;
                if ((minutes - (hours * 60)) < 10) {
                    clock.innerHTML = hours + ':0' + (minutes - (hours * 60)) + ' | ' + kasa + 'zł';
                } else {
                    clock.innerHTML = hours + ':' + (minutes - (hours * 60)) + ' | ' + kasa + 'zł';
                }
                foundUser[0].czasUzytkownika = minutes;
                foundUser[0].kasaUzytkownika = kasagr;
            }, 600);



            $('.stopTimer').one("click", function () {
                clearInterval(timeinterval);
                $('.clockAnimation').removeClass('animateClock');
                $('#timer').fadeOut();

                foundTask[0].budzetGodzinowyWykorzystanie += (minutes - czasStartu);
                foundTask[0].budzetPienieznyWykorzystanie += (kasagr - kasaStartu);
                foundUserProject[0].czasUzytkownika += (minutes - czasStartu);
                foundUserProject[0].kasaUzytkownika += (kasagr - kasaStartu);

                window.console && console.log($scope.lang.time + foundUser[0].czasUzytkownika + $scope.lang.cash + foundUser[0].kasaUzytkownika);
                window.console && console.log($scope.lang.task + zadanie + $scope.lang.project + projekt);
                window.console && console.log($scope.lang.user + userGlobalId + $scope.lang.project + projekt);


                $.ajax({
                    type: "POST",
                    url: url,
                    data: {
                        idZadania: zadanie,
                        idProjekt: projekt,
                        idUser: userGlobalId,
                        czasZadanie: foundUser[0].czasUzytkownika,
                        kasaZadanie: foundUser[0].kasaUzytkownika,
                        czasProjekt: foundUserProject[0].czasUzytkownika,
                        kasaProjekt: foundUserProject[0].kasaUzytkownika,
                        updateTime: ''
                    },
                    crossDomain: true,
                    cache: false,
                    beforeSend: function () {},
                    success: function (data) {
                        window.console && console.log(data);
                    }
                });


                if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
                    $scope.$apply();
                }
                $('#taskCharts .chartHours')

                if ($('#taskCharts .chartHours').find('canvas').length) {
                    var newpercent = $('#taskCharts .chartHours').attr('data-percent');
                    $('#taskCharts .chartHours').data('easyPieChart').update(newpercent);
                    newpercent = $('#taskCharts .chartMoney').attr('data-percent');
                    $('#taskCharts .chartMoney').data('easyPieChart').update(newpercent);
                }

                $scope.$root.$broadcast("updateTerms");
            });

        }



        //FUTURE: Mark Task As Complete
        $scope.markAsComplete = function (zadanie, projekt) {
            //NOTE: AS complete

            var currentLocationLat;
            var currentLocationLong;
            var tmpLocation;
            var found;
            var foundTask;

            var onSuccess = function (position) {
                currentLocationLat = position.coords.latitude;
                currentLocationLong = position.coords.longitude;
                tmpLocation = tmpLocation.replace('(', '');
                tmpLocation = tmpLocation.replace(')', '');
                tmpLocation = tmpLocation.split(',');
                var tmpLat = tmpLocation[0];
                var tmpLong = tmpLocation[1];
                var distance = getDistanceFromLatLonInKm(currentLocationLat, currentLocationLong, tmpLat, tmpLong);
                //alert(distance);

                if (distance < 0.3) {

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



                    var newLog = $scope.addLogElement(projekt, $scope.user.idUser, 'koniecZadania', '', $scope.user.imienazwisko, $scope.user.avatar, today, 0);

                    var item = {
                        idLog: newLog,
                        typ: 'koniecZadania',
                        data: today,
                        dataPrezentacja: 'Dziś - ' + gg + ':' + min,
                        odczytane: 0
                    }


                    $scope.projekt.log.push(item);




                    $scope.item.ukonczoneDisplay = 'block';
                    $scope.item.priorytet = 'prioFinished';
                    $.ajax({
                        type: "POST",
                        url: url,
                        data: {
                            idZadania: $scope.item.idZadania,
                            finishTask: ''
                        },
                        crossDomain: true,
                        cache: false,
                        beforeSend: function () {},
                        success: function () {}
                    });
                    if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
                        $scope.$apply();
                    }
                    $scope.$root.$broadcast("updateTerms");
                } else {
                    ons.notification.alert({
                        message: $scope.lang.location_warning,
                        title: $scope.lang.location_warning_title,
                        buttonLabel: 'OK',
                        animation: 'default',
                        callback: function () {}
                    });
                }
            };

            function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
                var R = 6371; // Radius of the earth in km
                var dLat = deg2rad(lat2 - lat1); // deg2rad below
                var dLon = deg2rad(lon2 - lon1);
                var a =
                    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
                    Math.sin(dLon / 2) * Math.sin(dLon / 2);
                var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                var d = R * c; // Distance in km
                return d;
            }

            function deg2rad(deg) {
                return deg * (Math.PI / 180)
            }


            if ($scope.item.latLngPosition == '' || !$scope.item.latLngPosition) {
                $scope.item.ukonczoneDisplay = 'block';
                $scope.item.priorytet = 'prioFinished';
                if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
                    $scope.$apply();
                }

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



                var newLog = $scope.addLogElement(projekt, $scope.user.idUser, 'koniecZadania', '', $scope.user.imienazwisko, $scope.user.avatar, today, 0);

                var item = {
                    idLog: newLog,
                    typ: 'koniecZadania',
                    data: today,
                    dataPrezentacja: 'Dziś - ' + gg + ':' + min,
                    odczytane: 0
                }



                $scope.projekt.log.push(item);


                $.ajax({
                    type: "POST",
                    url: url,
                    data: {
                        idZadania: $scope.item.idZadania,
                        finishTask: ''
                    },
                    crossDomain: true,
                    cache: false,
                    beforeSend: function () {},
                    success: function () {}
                });
                $scope.$root.$broadcast("updateTerms");
            } else {
                alert($scope.lang.location_check);
                var options = {};
                tmpLocation = $scope.item.latLngPosition;
                navigator.geolocation.getCurrentPosition(onSuccess, null, options);
            }

        }


        $scope.isUserIn = function (zadanie, projekt, user) {





            //FUCK!
            var przypisany = false;
            angular.forEach($scope.item.przypisaneOsoby, function (userp, index) {
                if (userp.idUser == user) {
                    przypisany = true;
                }
            });


            return przypisany;

        }



        $scope.closeSingleTask = function () {
            navi.popPage();
            $scope.$root.$broadcast("updateTerms");
            $('#commentForm').css('display', 'none');
        }

        $scope.shortname = String($scope.item.nazwa).substring(0, 15) + '...',

            $scope.addComment = function () {

                var text = $('#newComment').val();


                var todayLog = new Date();
                var dd = todayLog.getDate();
                var mm = todayLog.getMonth() + 1;
                var yyyy = todayLog.getFullYear();
                var gg = todayLog.getHours();
                var min = todayLog.getMinutes();
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
                todayLog = orderKeyGen(dd, mm, yyyy, gg, min, 9);
                var data = dd + '.' + mm + '.' + yyyy + ' ' + gg + ':' + min;


                var komentarz = {
                    idZadania: $scope.item.idZadania,
                    admin: 1,
                    type: 'normal',
                    text: text,
                    data: data,
                    avatar: $scope.currentuser[0].avatar,
                    autor: $scope.currentuser[0].imie
                };

                $.ajax({
                    type: "POST",
                    url: url,
                    data: {
                        idZadania: $scope.item.idZadania,
                        admin: 1,
                        type: 'normal',
                        text: text,
                        data: data,
                        avatar: $scope.currentuser[0].avatar,
                        autor: $scope.currentuser[0].imie,
                        addComment: ''
                    },
                    crossDomain: true,
                    cache: false,
                    beforeSend: function () {},
                    success: function (data) {

                        $.ajax({
                            type: "POST",
                            url: url,
                            data: {
                                idZadania: $scope.item.idZadania,
                                getTaskComments: ''
                            },
                            crossDomain: true,
                            cache: false,
                            beforeSend: function () {},
                            success: function (data) {
                                if ($scope.item.komentarze) {

                                    $scope.item.komentarze = angular.fromJson(data).komentarze;





                                } else {

                                    $scope.item.komentarze = []
                                    $scope.item.komentarze = angular.fromJson(data).komentarze;


                                }
                                if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
                                    $scope.$apply();
                                }
                            }
                        });



                    }
                });


                $('#newComment').val('');

            }


        $scope.$on("addCommentEvent", function (event) {
            $scope.addComment();
        });




        $scope.goToKomentarze = function () {
            $('#informacjeTab').css('display', 'none');
            $('#komentarzeTab').css('display', 'block');
            $('#commentForm').css('display', 'block');

            $.ajax({
                type: "POST",
                url: url,
                data: {
                    idZadania: $scope.item.idZadania,
                    getTaskComments: ''
                },
                crossDomain: true,
                cache: false,
                beforeSend: function () {},
                success: function (data) {
                    if ($scope.item.komentarze) {

                        $scope.item.komentarze = angular.fromJson(data).komentarze;

                    } else {
                        $scope.item.komentarze = []

                        $scope.item.komentarze = angular.fromJson(data).komentarze;

                    }
                    if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
                        $scope.$apply();
                    }
                }
            });


            commentRefresh = setInterval(function () {

                $.ajax({
                    type: "POST",
                    url: url,
                    data: {
                        idZadania: $scope.item.idZadania,
                        getTaskComments: ''
                    },
                    crossDomain: true,
                    cache: false,
                    beforeSend: function () {},
                    success: function (data) {
                        if ($scope.item.komentarze) {

                            $scope.item.komentarze = angular.fromJson(data).komentarze;

                        } else {
                            $scope.item.komentarze = []

                            $scope.item.komentarze = angular.fromJson(data).komentarze;

                        }
                        if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
                            $scope.$apply();
                        }
                    }
                });

            }, 5000);

        }

        $scope.goToInformacje = function () {
            $('#informacjeTab').css('display', 'block');
            $('#komentarzeTab').css('display', 'none');
            $('#commentForm').css('display', 'none');
        }

        $scope.addUserToTask = function (user, zadanie) {
            var found = $filter('filter')($scope.projekt.przypisaneOsoby, {
                idUser: user
            }, true);

            var foundZadanie = $filter('filter')($scope.projekt.zadania, {
                idZadania: zadanie
            }, true);


            var data2 = {
                idZadania: foundZadanie[0].idZadania,
                idUser: found[0].idUser,
                imie: found[0].imie,
                avatar: found[0].avatar,
                stawka: found[0].stawka,
                punktyUzytkownika: foundZadanie[0].punktyPremioweWartosc,
                kasaUzytkownika: 0,
                czasUzytkownika: 0,
            }
            if (foundZadanie[0].przypisaneOsoby) {
                foundZadanie[0].przypisaneOsoby.push(data2);
            } else {
                foundZadanie[0].przypisaneOsoby = [];
                foundZadanie[0].przypisaneOsoby.push(data2);
            }

            foundZadanie[0].avatarPierwszejOsoby = found[0].avatar;
            foundZadanie[0].brakOsobyDisplay = 'none';
            $scope.$root.$broadcast("updateTerms");

            $.ajax({
                type: "POST",
                url: url,
                data: {
                    idZadania: foundZadanie[0].idZadania,
                    idUser: found[0].idUser,
                    imie: found[0].imie,
                    avatar: found[0].avatar,
                    stawka: found[0].stawka,
                    punktyUzytkownika: foundZadanie[0].punktyPremioweWartosc,
                    addUserToTask: ''
                },
                crossDomain: true,
                cache: false,
                beforeSend: function () {},
                success: function (data) {}
            });

        }

    });

    module.controller('ZasobController', function ($scope, $projekty, $filter, $bazauzytkownikow, $currentUser) {
        $scope.item = $projekty.selectedZasob;
        $scope.currentuser = $currentUser.items;
        $scope.currentuser = $scope.currentuser[0];

        $scope.reserveZasobNow = function (idZasobu) {
            var dataOd = $('#rezerwacjaOd input').val();
            var dataDo = $('#rezerwacjaDo input').val();

            if (dataOd == '' || dataDo == '') {
                ons.notification.alert({
                    message: $scope.lang.message_data,
                    title: $scope.lang.message_title,
                    buttonLabel: 'OK',
                    animation: 'default',
                    callback: function () {}
                });
            } else {
                var dd = dataOd.substring(8, 10);
                var mm = dataOd.substring(5, 7);
                var yyyy = dataOd.substring(0, 4);
                var gg = dataOd.substring(11, 13);
                var min = dataOd.substring(14, 16);
                var data = dd + '.' + mm + '.' + yyyy + ' ' + gg + ':' + min;
                var orderKey = orderKeyGen(dd, mm, yyyy, gg, min, 0);

                var dd2 = dataDo.substring(8, 10);
                var mm2 = dataDo.substring(5, 7);
                var yyyy2 = dataDo.substring(0, 4);
                var gg2 = dataDo.substring(11, 13);
                var min2 = dataDo.substring(14, 16);
                var data2 = dd2 + '.' + mm2 + '.' + yyyy2 + ' ' + gg2 + ':' + min2;
                var orderKey2 = orderKeyGen(dd2, mm2, yyyy2, gg2, min2, 0);


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


                if (orderKey >= orderKey2) {
                    ons.notification.alert({
                        message: $scope.lang.wrong_date,
                        title: $scope.lang.wrong_date_title,
                        buttonLabel: 'OK',
                        animation: 'default',
                        callback: function () {}
                    });
                } else {
                    if (!$scope.item.rezerwacje) {
                        alert('dodaje');
                        $.ajax({
                            type: "POST",
                            url: url,
                            data: {
                                idZasob: $scope.item.idZasob,
                                imie: $scope.currentuser.imie,
                                avatar: $scope.currentuser.avatar,
                                dzien: dd,
                                miesiac: mm,
                                dataOd: data,
                                dataDo: data2,
                                odOrder: orderKey,
                                doOrder: orderKey2,
                                submitReservationToBase: ''
                            },
                            crossDomain: true,
                            cache: false,
                            beforeSend: function () {},
                            success: function (idRezerwacji) {
                                var item = {
                                    idRezerwacji: idRezerwacji,
                                    idZasob: $scope.item.idZasob,
                                    imie: $scope.currentuser.imie,
                                    avatar: $scope.currentuser.avatar,
                                    dzien: dd,
                                    miesiac: mm,
                                    dataOd: data,
                                    dataDo: data2,
                                    odOrder: orderKey,
                                    doOrder: orderKey2,
                                }
                                if ($scope.item.rezerwacje) {
                                    $scope.item.rezerwacje.push(item);
                                    if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
                                        $scope.$apply();
                                    }
                                } else {
                                    $scope.item.rezerwacje = [];
                                    $scope.item.rezerwacje.push(item);
                                    if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
                                        $scope.$apply();
                                    }
                                }
                                navi.popPage();
                            }
                        });
                    } else {
                        var error = false;
                        angular.forEach($scope.item.rezerwacje, function (rezerwacja, index) {
                            0
                            alert(rezerwacja.idRezerwacji);
                            if (orderKey >= rezerwacja.odOrder && orderKey <= rezerwacja.doOrder) {
                                error = true;
                            }
                            if (orderKey2 >= rezerwacja.odOrder && orderKey2 <= rezerwacja.doOrder) {
                                error = true;
                            }
                            if (rezerwacja.odOrder >= orderKey && rezerwacja.doOrder <= orderKey2) {
                                error = true;
                            }
                        });
                        if (error) {
                            ons.notification.alert({
                                message: $scope.lang.reservation_already_made,
                                title: $scope.lang.reservation_title,
                                buttonLabel: 'OK',
                                animation: 'default',
                                callback: function () {}
                            });
                        } else {
                            //alert('dodaje');
                            $.ajax({
                                type: "POST",
                                url: url,
                                data: {
                                    idZasob: $scope.item.idZasob,
                                    imie: $scope.currentuser.imie,
                                    avatar: $scope.currentuser.avatar,
                                    dzien: dd,
                                    miesiac: mm,
                                    dataOd: data,
                                    dataDo: data2,
                                    odOrder: orderKey,
                                    doOrder: orderKey2,
                                    submitReservationToBase: ''
                                },
                                crossDomain: true,
                                cache: false,
                                beforeSend: function () {},
                                success: function (idRezerwacji) {
                                    var item = {
                                        idRezerwacji: idRezerwacji,
                                        idZasob: $scope.item.idZasob,
                                        imie: $scope.currentuser.imie,
                                        avatar: $scope.currentuser.avatar,
                                        dzien: dd,
                                        miesiac: mm,
                                        dataOd: data,
                                        dataDo: data2,
                                        odOrder: orderKey,
                                        doOrder: orderKey2,
                                    }
                                    if ($scope.item.rezerwacje) {
                                        $scope.item.rezerwacje.push(item);
                                        if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
                                            $scope.$apply();
                                        }
                                    } else {
                                        $scope.item.rezerwacje = [];
                                        $scope.item.rezerwacje.push(item);
                                        if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
                                            $scope.$apply();
                                        }
                                    }
                                    navi.popPage();
                                }
                            });
                        }
                    }
                }
            }
        }
    });


    module.controller('DetailController', function ($scope, $projekty, $filter, $bazauzytkownikow, $currentUser) {
        $scope.item = $projekty.selectedItem;

        $scope.updateItem = function () {
            $scope.item = $projekty.selectedItem;
        }
        $scope.$on('updateItemEvent', function () {
            $scope.updateItem();
        });

        $scope.baza = $bazauzytkownikow.items;
        $scope.rezerwacja = "";
        var rezerwacja = 0;
        $scope.currentuser = $currentUser.items;
        var dodatkowePunkty = 0;

        $scope.item.krotkitytul = $scope.item.tytul.substring(0, 15) + '...';
        $scope.$on("updateTerms", function (event) {
            $scope.RebuildTerms();
        });

        $scope.acceptNotification = function (idKoszt) {
            var found = $filter('filter')($scope.item.koszty, {
                idKoszt: idKoszt
            }, true);

            $('.notificationBox[data-koszt="' + idKoszt + '"]').fadeOut("fast", function () {
                found[0].zaakceptowanyUser = 1;
            });

            $.ajax({
                type: "POST",
                url: url,
                data: {
                    idKoszt: idKoszt,
                    acceptNotification: ''
                },
                crossDomain: true,
                cache: false,
                beforeSend: function () {},
                success: function (data) {}
            });
        }

        $scope.$on("addUserToTaskEvent", function (event, args) {
            alert(args.userid);
            alert(args.taskid);
            $scope.addUserToTaskGlobalF(args.userid, args.taskid);
        });

        $scope.addUserToTaskGlobalF = function (user, zadanie) {
            var found = $filter('filter')($scope.item.przypisaneOsoby, {
                idUser: user
            }, true);

            var foundZadanie = $filter('filter')($scope.item.zadania, {
                idZadania: zadanie
            }, true);


            var data2 = {
                idZadania: foundZadanie[0].idZadania,
                idUser: found[0].idUser,
                imie: found[0].imie,
                avatar: found[0].avatar,
                stawka: found[0].stawka,
                punktyUzytkownika: foundZadanie[0].punktyPremioweWartosc,
                kasaUzytkownika: 0,
                czasUzytkownika: 0,
            }
            if (foundZadanie[0].przypisaneOsoby) {
                foundZadanie[0].przypisaneOsoby.push(data2);
            } else {
                foundZadanie[0].przypisaneOsoby = [];
                foundZadanie[0].przypisaneOsoby.push(data2);
            }

            foundZadanie[0].avatarPierwszejOsoby = found[0].avatar;
            foundZadanie[0].brakOsobyDisplay = 'none';
            $scope.$root.$broadcast("updateTerms");

            $.ajax({
                type: "POST",
                url: url,
                data: {
                    idZadania: foundZadanie[0].idZadania,
                    idUser: found[0].idUser,
                    imie: found[0].imie,
                    avatar: found[0].avatar,
                    stawka: found[0].stawka,
                    punktyUzytkownika: foundZadanie[0].punktyPremioweWartosc,
                    addUserToTask: ''
                },
                crossDomain: true,
                cache: false,
                beforeSend: function () {},
                success: function (data) {}
            });
        }

        $scope.acceptCost = function (idKoszt) {
            var found = $filter('filter')($scope.item.koszty, {
                idKoszt: idKoszt
            }, true);


            ons.notification.confirm({
                title: $scope.lang.cost_title,
                message: $scope.lang.cost_message,
                buttonLabels: [$scope.lang.yes_answer, $scope.lang.no_answer, $scope.lang.canel_answer],
                primaryButtonIndex: 0,
                callback: function (index) {
                    if (index == 0) {
                        $('.notificationBox[data-koszt="' + idKoszt + '"]').fadeOut("fast", function () {
                            found[0].zaakceptowanyAdmin = 1;
                        });

                        $.ajax({
                            type: "POST",
                            url: url,
                            data: {
                                idKoszt: idKoszt,
                                zaakceptowanyAdmin: 1,
                                answereNotification: ''
                            },
                            crossDomain: true,
                            cache: false,
                            beforeSend: function () {},
                            success: function (data) {}
                        });
                    }
                    if (index == 1) {
                        $('.notificationBox[data-koszt="' + idKoszt + '"]').fadeOut("fast", function () {
                            found[0].zaakceptowanyAdmin = 2;
                        });

                        $.ajax({
                            type: "POST",
                            url: url,
                            data: {
                                idKoszt: idKoszt,
                                zaakceptowanyAdmin: 2,
                                answereNotification: ''
                            },
                            crossDomain: true,
                            cache: false,
                            beforeSend: function () {},
                            success: function (data) {}
                        });
                    }
                    if (index == 2) {}
                }
            });
        }


        $scope.submitCost = function () {
            var idProjekt = $scope.item.idProjekt;
            var kwota = $('#itemCost').val();
            var nazwa = $('#nazwaKosztu').val();
            var idUser = $scope.currentuser[0].idUser;
            var imie = $scope.currentuser[0].imie;
            var avatar = $scope.currentuser[0].avatar;

            if (nazwa == '') {
                ons.notification.alert({
                    message: $scope.lang.cost_message2,
                    title: $scope.lang.cost_title2,
                    buttonLabel: 'OK',
                    animation: 'default',
                    callback: function () {}
                });
            } else {

                $.ajax({
                    type: "POST",
                    url: url,
                    data: {
                        idProjekt: idProjekt,
                        idUser: idUser,
                        imie: imie,
                        avatar: avatar,
                        kwota: kwota,
                        nazwa: nazwa,
                        submitCostToBase: ''
                    },
                    crossDomain: true,
                    cache: false,
                    beforeSend: function () {},
                    success: function (data) {
                        var item = {
                            idKoszt: data,
                            idProjekt: idProjekt,
                            idUser: idUser,
                            imie: imie,
                            avatar: avatar,
                            kwota: kwota,
                            nazwa: nazwa,
                        }
                        if ($scope.item.koszty) {
                            $scope.item.koszty.push(item);
                        } else {
                            $scope.item.koszty = [];
                            $scope.item.koszty.push(item);
                        }
                        navi.popPage();
                    }
                });
            }

        }

        $scope.showTask = function (index) {
            //NOTE: now point]
            $("#spinner").css('display', 'block');
            var found = $filter('filter')($scope.item.zadania, {
                idZadania: index
            }, true);
            var selectedItem = found[0];
            $projekty.selectedTask = selectedItem;
            $scope.navi.pushPage('singleTask.html', {
                title: selectedItem.nazwa
            });
        };


        //NOTE: Dodawanie zadania
        $scope.addNewTask = function () {
            var nazwa = $('#nazwaZadania').val();
            var connectID = $('#wybranyPolaczony select').val();

            var data = $('#wybranyTermin select').val();
            var innaData = 0;
            if (data == "inny") {
                data = $('#innaData input').val();
                innaData = 1;
            }

            if (nazwa == '') {
                ons.notification.alert({
                    message: $scope.lang.new_task_message,
                    title: $scope.lang.new_task_title,
                    buttonLabel: 'OK',
                    animation: 'default',
                    callback: function () {}
                });
            } else if (data == '') {
                ons.notification.alert({
                    message: $scope.lang.new_date_message,
                    title: $scope.lang.new_date_title,
                    buttonLabel: 'OK',
                    animation: 'default',
                    callback: function () {}
                });

            } else {

                var opis = $('#opisZadania').val();


                var pokazLokalizacje = 'none';
                var lokalizacja = $('#lokalizacjaZadania').html();
                //window.console && console.log(lokalizacja);
                var lokalizacjaZadaniaLatLng = $('#lokalizacjaZadaniaLatLng').html();
                if (lokalizacja != "Wybierz lokalizację" && lokalizacja) {
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
                    var dataGlobal = data;
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
                    var dataGlobal = data;
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
                if ($('#zadanieCzyPieniadze input:checked').length == 1) {
                    budzetGodzinowy = 'tak';
                    budzetGodzinowyWartosc = $('#zadanieWartoscBudzetGodziny select').val();
                }
                var budzetPienieznyWartosc = 0;
                var budzetPieniezny = 'nie';
                if ($('#zadanieCzyGodziny input:checked').length == 1) {
                    budzetPieniezny = 'tak';
                    budzetPienieznyWartosc = $('#zadanieWartoscBudzetPieniadze select').val();
                }

                var punktyPremioweWartosc = 0;
                var punktyPremiowe = 'nie';
                if ($('#czyPunktyPremiowe input:checked').length == 1) {
                    punktyPremiowe = 'tak';
                    punktyPremioweWartosc = $('#zadanieWartoscPunktyPremiowe select').val();
                }


                var avatar = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIQAAACECAYAAABRRIOnAAAAAXNSR0IArs4c6QAAE+lJREFUeAHtnWvIHcUZx09iNIkmJtEkGtFEQVRoBW+h+EFFoVXwg2Bt0NZKg0rFWlS00FbSUkX90ItaWrFYKxWrVMQSqKVCUTAfLKhosWAFqUk0F5No7onRXPr/TXa2c+bsOe9eZvfsOe888LwzOzvX5/mfmWdu+3Y6kaIEHAlMcfxj7T106NBMNfBU8Rzx7AxWUGdnBm9X2OopU6bsJcK409gBQoqfJ6WdLz7T48V6LtveQ0q7Vvyex28KKFsVNjZUVkCtEYAAMEuVuUh8WcLnyJ0qboIOqpC3xS8nvEoA2dVEwXWVMZKAEAiWSCDXi68ULxVPEw8kpens37+/c+DAgQ7+gwcPGrZ+Ek+dOrUjhRrX+o844ojOtGnTTPjAAg6/3C/ndfGL4qeV15rDwaPzd2QAIcUdK7FeI75BfLE4s+4oeN++fZ0vvviih5WmNB155JEdn6dPnz4IKAwzr4qfEj8vcOwoXXiDCTOF2mD5ExYlBTMc3Cq+Soxh2EUA4PPPP+989tlnnb179xqXsCaI3mTGjBmdmTNnGveoo47qBxAM0pXiR5VmVRN1K1tGawEhpV6uRt0jBhBdhMJR/q5du4xL998GYpgBHLNmzTIugMkgAHG/3r2U8W7oQZk1HlatpGjqQ08AEC7w68FQAAjgtoDAr6N9BhwAA2ZoyaA3FHa/eKXA0UyXllEJP6g1gBAYmCU8LD7brSS9wc6dOzs7duwwNoH7blT82B7HHntsZ/bs2VlDyjtqx+0CxSttaM/QASGFL5IgfiH+pisQegCAsH37djMzcN+Nqp8Zy5w5cwww6EE8ekbPdwsYG7zwRh+HBggB4Qi19Hvi+8TMIAwBBHoDgND2YcHWuagLGAAGvYYHDGYiK8S/FTAOFM03RPyhAEJgYPHoSTFuStgGn3766dj0CGnD+njoMY477jhjZ3hRWOxaLlDgNkqNA0JguEUtfEg8w7aUaeMnn3xipow2bDK5TF2PP/74DtNWhz6T/06B4jEnrHZvY4AQEBgWHhcvs61iSNi2bZsZHmzYZHYZRubOnesPI89JJjcLGI0sbDUCCIHhXDWKhp1uFc4UctOmTWY52YZFV2vwWiZfuHChP1V9X7JZJlC8VbeMageEwHCdGoG9kE7GMRoZIiL1lwBDCEanQ/vkXy5QPOuEBffWCgiB4XbVGHvBlMMQsWXLls7u3buDN2QcMzzmmGM68+fPd4cQFrDuECh+XVd7awOEwPCAKv0jW3EMx48//jgOEVYgOV2GkBNOOME3OB8UKH6cM4tC0YIDQkBgfeF34httTdh4Agzjuq5g21mXy1oFoGA24tAT8n9XwAi6XhEUEAkYMB6vthVneNi8ebM5g2DDoltcAlJ8Z8GCBR2GEYdekB9jMxgoetZPncLKeOkZUjCw9MxMQkApk1dM40gAGSJLZOoQskbmwSgYIFRhbIZ0mGDpGQMyUlgJIFNk69CNieydoPLeIEOGKsRs4mFbDVAcwWClUY/L7IPdU4fYMa08+6gMCIHhOlXqT2KTFzYDXVuk+iXAApZjUzAuf0ugqLROUQkQAgMrkK+JzaITs4mNGzdGm6F+LJgSMDRPPPFEd/axTy8uVHjpFc3SNoTAwDIaMwoDBrvOoHBT2finfgkga6bzyD4hdPFcohsb1uPqfd+OoDQgVAobVWZvgvWFuM7QI/dGAjJkj07QTQ8JCKeJ+RHf1fMyCSgFCGXKFna6a4kByZ2HSMORALL3jPhliY5MheSfJb5XD++KvyFeoeeF5qX3p2/X4cVLH5URh1r+KTZDRdyoSkUzdI+3IcZ5igvFXxL/XLxI7NITsjVucgPwFwKEwMCyNKeFAYW5ELN+/Xq8kVoigZNOOsndOmcXsWtp06kmdxcu8A3QokPGbcrEgIGxK04vHfG2xMuxAv1wbW36gYH36P4RG9G6uXsIFUKX8x+x2aTn7KO3YmbzjO4QJMAUlPMTGSeuJqrNtUr7ZxupCCCeUaLrSMg0Z926dTaP6A5ZAkcffbQ5rMv9jxK0VmnOEijM9y9yDRnqHS5TIgMGCoynnZDC8IlDuSxMsTVeEgw0YrH4B7Y1E/YQAgNx/iU2N6o4Ks92dqThSYDzEfPmzet3E6xMxfYo0RnqJdZNy5H6KsUxYMCQxHaINDwJYCcABu+CT5UKsSX9M/FGMskDCC7eGmLNgQ9uRGpeAtwq51KPd3ejSkVYSeTOxwr1DNtsRgMBoeHickU0t7DpHeKswoqtORfbACBgOAakfyiv7wsIzBq7aCAgFDPtHTjjACgiNSMBKctMIbm8gz8g/Vv5fbVffn0Bod7hIiWCzUJH7B36iTB8ON+UoFfg7mcI4ocMqBJgfRndyr8qK+9B085bbQJ6h2g7WGnU53KqmqVnDtOGAIMUb85gfvjhh/5ZzFS3fmsy+yJlxGokVqf5ptNHH300sh/r8BvcxmfuXjBzoGcIRXxyiRmhPSuBLXLyySfb7FmEOlG9xA4bYN1+QwZfezNgsF90swmiG04CdOHYCHCoaSRf39u6dWvP7TjC0WXyeSN0i47/4LemHyBusBFZiIoUXgKchcROoHcIQXYWiK3HUJFF6NL53hU67gFEz5ChzJYo4gfiKWS8du3aOLvIkm7JMNYROLfg3cIqmdvhZHk/tEIvtHjxYmtcgprT1EutcQvPMiqvVwQDFMahONV0xVXej5HI0XmMxlBgYAjgPApbCXmMfnSJThNCx+i6i7IAcaWNEYcLK4lqLjYCBl2fr9AVzpwjc4AAMACKIuTpNNW1zaNrANMQgZm7lJcMFw6abPzoFpBAxW3pnpLQCTYCX93BX4bQKWkxaEVL5Z8lf2oodgFCES4WmzCmK3G4QGbFiSkedgL7D6Foz5495thB1cPM6BTdJsYlukbnf7P19AFxqX3BpZtIxSRQw7a0UV7oD7KhW2e2gc77AoKDMIbicGElkc/FPmBxKcQKIyViJDI0sMMcmtAtdk1Cqc55TnsIjSXz9GwO0DLGxB4iEdcEDjMGhodQ29LInq0CFpfqGrLRLeUkdsQ56F7+rTQ1BYT8/FsiM+vAciVBpP4SYEEJIITcluaXy/DAqmKdhG7RcTL9Refoni3xLkCcSQBUd4UOlzKaf/lVcbKZLjf5hVVuCPJm3wHDsSmiTGc9BN1HQBQVfh3b0sP6cKv3o087A3fISAO9yEXlNnbxscgZHhzLvFIb6bLtcnNddsJEFfR0nOo+AmKA5JgxsAEVclsagw47wW5LDyi+1lcDASHEsoKymBqAXi9yrRVrY+bYBtgIcKhtaRaUsBPa8tFWdIyuEztoMRiQf6/tIU6TYsxaZtWVsDYquEidhrEtXaR+IeOi6+SCD7o/VfyuBUS6SpFn1yxkpdqS1zC3pYclA3SdAIIqzOWPBUT6ObNhGTlUZhiEnWCPr4WaRjLHx04ouhPZdPs9XRsMWECkh/kYVyYLYSOUuC3dVzz84lhhZKVxFMjTtcGABcSk6iHq2JZmzwEweEJuNS4G9RApIEapQUWl3eZt6aJtCRHf03XXkJECwkNNiHKHngdTR4YGLsqGshNYRwi9Ld20oDxddwGi6bo0Vt4obUs3JpQBBVkbIrWCQi3EDCizkVejuC3diGCcQjxdGwz0ACJUl+qU26iXbWmWm51vQFcuv6lt6coVLZiBp+tsQHioKVjE8KLTuHHYlm5Sgp6uxwcQ47Qt3TpAeN1Ik/UrXFZd29KsJ0yGJXxP1109xHarjVCHRG1+dbjjvC1dh7z65enp2mDAGpWrlYg16ymhLp/2q0SVcBA97tvSVeRTNK2ja3S/mvQGEBL0Xq1ardXzEoTOil7bzkRMpm1pFFM3oWNnyFgLBijT9hD43xMvwdMmQNSxLc0hFQ6rTOazH+jYIXRvyAfE1wj1Ih+O2fBfpkT2+JqD5Eq1YDsaIMQ7Jz067gsII/BhA2Kyb0tXQn3OxJ6O2wkILsdyutmrbM4m9kZjN28Ut6V7WxI+xLtplgmIN1XsQfFU5vd00972aPhaJTkCAIaHkLegQt2Wrq3RQ8wY3TqAQOfo3lBqQyjSVgHgbYWeRwI2h+q+8IudUMe2NHZC3XVP5DeSDrpFxwm9je7tQwqIJOBluefhp/uuU6hxWzqR+BAc77sV6DwlHxCv6M3dvHXu/aWRQ3jitnQIKVbLw9PtQEC8qqL2i6cxxtCle6dqStckbkuXFl3QhOjUsR/Qddcnjrt6CI0lu2RHvK5I/LtgM2xUvWlEPnFbOqhOK2XGcIFOEnodndsH3C5AJC9elHshfraVqwCC9Nx5cNbMkyLKOfRWw7otXa7G7Uvl3VNF112UQsWGqodg+foDcekPl8ZtaSvNdrkMFxN9uLSnh1AXskagwJa4hK4FROX9zpHdlmYjyumWKkmlLbelKzWiJYnRpaOXV9G1X7UeQCQRnpJ7Cf48gKCQOralOajifWgzqV50ykjAGy7QcQ/1DBnEUA+R+98j0BtgJ4RabsZOoEeq8nHOnlbGAKOfPP8eYWqWrPSL51t4K+07Lrj4xNSF/xm5cOHCYGDAgOUfxI7alThfNm189nS4MtFxT1X7DRlEfFR8LR5WFfnFcs4Qw4QegTCGihAUt6VDSLF/Hth26MshdJtJAzWaGJfm/27xjWUOlAAGQBGCRu22dIg2DyMPNg6x8RJapR/yxfbBdycCxOVK8HcSCRzBegTysnZCqJVQv2Hx+bAE+PGecsop7o/4CgHipX7yGTRkkGaNmNO4c0IND2xLsxvZtjObNHYciZ7B6dHfGAQG2p8JCP2C+bzMT8W39Yuj8ELEbem4LV1IZJUjYzt4xuT9E2XaBQgBgX8UebP4PvH8iRLnec+QwKwh7+JWnjxjnHwSwHZweod3lCqdOfbLoQsQivRX8RX9IhcJx06o+yPeReoz2eKyxe0tRN2h4eLQRHLwpwvPTJQgz3sO1vDvf/igRjQa80gsfBzOpjr0jMDQde7Bedfl7Zpl6FfN82vir3TFyvmAocjwUGWHNGdRMdoACWBIMlwkxCLjWQLEBhswyO0aMuhSRLcrAaDoAsugTOgFWKcY9D8jB6WP78JJgKMGnD9xaEVeMJAmU+kCBRsf33YyzfQqnukNmD1MhtvSmUJoWSD/BtL5SDuHpi8QIA7kraZvQ9h0P5Rnt33o56ogYyNEMPSTULPh3hf7+adpy4uAgdpmAkKZrNe7B4iQQYxFf7ThzHNDfr7H5hvdYhJAB96aw53SIz1EIcoERJLDr+SudnLbJ/+D4jNU0HfkPic2xH+sDXVMzuYZ3fwSQPbowKHnpKPHnOfc3kwbwqaWjfB1+Z8X/0V8twr5r/OOPXFu/JxOGCuRGzZsiNNMhNEgsfC0aNEi9yT1+yr+fOmK2UVhGggIchMolipzTmL3kN6dq0BmJNN5yXG3jRs3NnYFkDInM0kv5kyKc8+CXpwT82+VlcugIcPk2Q8MvEwKXi6vWQGjYgsWLDDp4p/6JYCsHTCgg+VVwECNJwTERM1SBZ5VnDttPIwbbzyzr6IbUALI2DPmMSLRRSWqDAhKV0UekfOgrQmnc5yVMhsc3UASQLbeCagHEx1ULmFCG6JICbIpfq/4N9o0bG5t2bLFPkY3gAToGTwwPCEw3BQga5NFaECwfc509GpbQfY1Nm/eHA1NK5CSrpRu7DNvmHhB2S3Tu9wrkRMVH2TIsIUkFVum5ydsGA3gdLazL29fRTenBJAdMvTAgIyDgoHqBAUEGQIKMV1YalNgCTNXjotXSKgYITNk58wmyACb4abkB1gswwliBx0y/LJkU7Bz+pDYlMOuKDZF3B73JZX9TI+AzeD0rkwtmU1gxNdCtQKCGgsU18l5UjydZ4jjdByeidRfAmxUeXsTLDotFxgqTy37l5r8cgdFCPFOoDhP+fxZbJa5yZPLOZs2bZrUHw9FDj4xRHAbztnCJgrL0dgLpVcg/XL6PdfeQ9iCBQr2Ph4XY3QaYgiJ33uw0tBdh+x/G8ms7WaBodTexP9zz+drDBC2OgLGLfJjV8ywYePwD81sW8q4GIwMEc6nfsiG8wzYC6V2LcvUgzSNA4JCBYpz5GBX4KbE1f/JdPrKfk/DOx2NPDjHsFxgKHyeIRVmSc9QAEFdBQoWsbgIdK+Y4cQQwwhGJ+cz8Y8jMWtgeMBodGYQNJVh4Sfi3wgMwRabyDgvDQ0QtoICxiL5fylmNpISYGDpG2CMyxE9egSAwNKzBwTazezhLgFhQyqEIXiGDgjbZgHjMvkfFp9tw3AVboBBrzGq90H5mAq9AUCQwt3m4edGFZdoct2b8BOHfu6pXegCiuQn5VOfq8T3iC/w0zJVxc6A2z6c0ANgG8DeFNI26w15uGu5UmBgwakV1CpAuBIROC7XM8C4yA3HT6/B7TCAgdsWcAACvgMJCLzvQbpNWKWH+wWCl9zAtvhbCwgrICkfQNwqpueYacOtCziYtnJ8D3DgEtYE0f0zZUT5uEwbCcsg/n3RSvGjeg8gWkuZtW9jbaVkZiLXiG8QXyzOrDtgYGjB3vBZaUoTdoDPDAV9AEA5oPJV8VPi5xWvkYUllVWJMoVaKccGEkvpS1TM9eIrxUvF08QDCaDwSSRmLAwxPLsuienyUbDrMjNgOXmA4t1y9+uBA8l8IfZppVnjvhwF/0gCwhWsFDtLz/QYl4qZqbDYNVXcBB1UISwevSx+RczHQHfJHVkaeUD4khdA5insfPGZHi/Wc9n20v2vFb/n8ZsCwFaFjQ2VFdDICUBAwSA9VTxXPFtMz4JrWd7OTof5pfO8Tbxaijf/11L+SFECk0cC/wPgFSm29GnNzQAAAABJRU5ErkJggg==';

                var iloscOsob = 0;
                if ($scope.currentuser[0].tmp) {
                    iloscOsob = $scope.currentuser[0].tmp.length;
                }
                var brakOsobyDisplay = 'block';
                var dodatkoweOsobyDisplay = 'none';
                if (iloscOsob > 0) {
                    brakOsobyDisplay = 'none';
                    avatar = $scope.currentuser[0].tmp[0].avatar;
                }
                if (iloscOsob > 1) {
                    dodatkoweOsobyDisplay = 'inline-block';
                }
                //alert(iloscOsob);
                var idProjekt = $scope.item.idProjekt;



                //NOTE: ajax zadanie


                $.ajax({
                    type: "POST",
                    url: url,
                    data: {
                        idProjekt: idProjekt,
                        idTerminu: '',
                        nazwa: nazwa,
                        opis: opis,
                        data: data,
                        dataDzien: dd,
                        dataMiesiac: mm,
                        dataGodzina: gg + ':' + min,
                        orderKey: orderKey,
                        basicItem: 'block',
                        milestone: 'none',
                        mileStoneNaglowek: '',
                        milestoneUkonczoneZadaniaProcent: 0,
                        milestoneWykorzystanyBudzetPieniadze: 0,
                        milestoneWykorzystanyBudzetGodziny: 0,
                        avatarPierwszejOsoby: avatar,
                        dodatkoweOsobyDisplay: dodatkoweOsobyDisplay,
                        dotatkoweOsoby: iloscOsob - 1,
                        ukonczoneDisplay: 'none',
                        brakOsobyDisplay: brakOsobyDisplay,
                        lokalizacjaDisplay: pokazLokalizacje,
                        lokalizacja: lokalizacja,
                        latLngPosition: lokalizacjaZadaniaLatLng,
                        priorytet: priorytet,
                        status: 'oczekuje',
                        budzetPieniezny: budzetPieniezny,
                        budzetPienieznyWartosc: budzetPienieznyWartosc,
                        budzetPienieznyWykorzystanie: 0,
                        budzetGodzinowy: budzetGodzinowy,
                        budzetGodzinowyWartosc: budzetGodzinowyWartosc,
                        budzetGodzinowyWykorzystanie: 0,
                        punktyPremiowe: punktyPremiowe,
                        punktyPremioweWartosc: punktyPremioweWartosc,
                        polaczone: connectID,
                        addTaskToProject: ''
                    },
                    crossDomain: true,
                    cache: false,
                    beforeSend: function () {},
                    success: function (data) {

                        var idZadania = parseInt(data);
                        globalZadanieUpload = idZadania;
                        $scope.uploadFile();
                        var zadanie = {
                            idZadania: parseInt(data),
                            orderKey: orderKey,
                            basicItem: 'block',
                            data: dataGlobal,
                            dataDzien: dd,
                            dataMiesiac: mm,
                            dataGodzina: gg + ':' + min,
                            notyfikacjeDisplay: 'none',
                            notyfikacje: 0,
                            lokalizacjaDisplay: pokazLokalizacje,
                            lokalizacja: lokalizacja,
                            latLngPosition: lokalizacjaZadaniaLatLng,
                            brakOsobyDisplay: brakOsobyDisplay,
                            ukonczoneDisplay: 'none',
                            avatarPierwszejOsoby: avatar,
                            dotatkoweOsoby: iloscOsob - 1,
                            dodatkoweOsobyDisplay: dodatkoweOsobyDisplay,
                            nazwa: nazwa,
                            opis: opis,
                            priorytet: priorytet,
                            statusUzytkownika: 'oczekuje',
                            statusClass: 'completionHalf',
                            czasUzytkownika: '00:00',
                            kasaUzytkownika: 0,
                            punktyUzytkownika: 0,
                            budzetPieniezny: budzetPieniezny,
                            budzetPienieznyWartosc: budzetPienieznyWartosc,
                            budzetPienieznyWykorzystanie: 0,
                            budzetGodzinowy: budzetGodzinowy,
                            budzetGodzinowyWartosc: budzetGodzinowyWartosc,
                            budzetGodzinowyWykorzystanie: 0,
                            punktyPremiowe: punktyPremiowe,
                            punktyPremioweWartosc: punktyPremioweWartosc,
                            polaczone: connectID,
                            przypisaneOsoby: angular.copy($scope.currentuser[0].tmp),
                            komentarze: []
                        }

                        angular.forEach($scope.currentuser[0].tmp, function (user, index) {

                            $.ajax({
                                type: "POST",
                                url: url,
                                data: {
                                    idZadania: idZadania,
                                    idUser: user.idUser,
                                    imie: user.imie,
                                    avatar: user.avatar,
                                    stawka: user.stawka,
                                    punktyUzytkownika: punktyPremioweWartosc,
                                    addUserToTask: ''
                                },
                                crossDomain: true,
                                cache: false,
                                beforeSend: function () {},
                                success: function (data) {}
                            });

                        });
                        //NOTE:tutaj



                        if (!$scope.item.zadania) {
                            $scope.item.zadania = [];
                        }
                        $scope.item.zadania.push(zadanie);
                        $scope.$apply();
                        if ($scope.currentuser[0].tmp) {
                            $scope.currentuser[0].tmp.splice(0, iloscOsob);
                        }

                        var todayLog = new Date();
                        dd = todayLog.getDate();
                        mm = todayLog.getMonth() + 1;
                        yyyy = todayLog.getFullYear();
                        gg = todayLog.getHours();
                        min = todayLog.getMinutes();
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
                        todayLog = orderKeyGen(dd, mm, yyyy, gg, min, 9);



                        var today = dd + '.' + mm + '.' + yyyy + ' ' + gg + ':' + min;
                        var newLog = $scope.addLogElement($scope.item.idProjekt, $scope.currentuser[0].idUser, 'noweZadanie', nazwa, $scope.currentuser[0].imienazwisko, $scope.currentuser[0].avatar, today, 0);

                        var logItem = {
                            idLog: newLog,
                            idZadania: idZadania,
                            orderKey: todayLog,
                            typ: 'noweZadanie',
                            nazwa: nazwa,
                            osoba: $scope.currentuser[0].imie + ' ' + $scope.currentuser[0].nazwisko,
                            idOsoby: $scope.currentuser[0].idUser,
                            avatarOsoby: $scope.currentuser[0].avatar,
                            data: dd + '.' + mm + '.' + yyyy + ' ' + gg + ':' + min,
                            dataPrezentacja: 'Dziś - ' + gg + ':' + min,
                            odczytane: 0
                        }


                        $scope.item.log.push(logItem);
                        if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
                            $scope.$apply();
                        }
                        $scope.$emit('updateItemEvent');
                        $scope.RebuildTerms();
                        navi.popPage();



                    }
                });




            }

        }


        $scope.RebuildTerms = function () {


            var email = localStorage.email;
            $scope.getUserData(email, 0);


            var listaTerminow = [];



            //NOTE: analiza zadan

            var naszUser = $scope.currentuser[0].idUser;



            angular.forEach($scope.item.zadania, function (task, index) {
                task.budzetPienieznyWykorzystanie = 0;
                task.budzetGodzinowyWykorzystanie = 0;
                task.statusUzytkownika = "oczekuje";
                task.statusClass = "completionHalf";
                angular.forEach(task.przypisaneOsoby, function (osoba, index) {

                    task.osobaKasa = osoba.kasaUzytkownika;
                    task.osobaCzasTF = 0;
                    task.osobaKasaTF = 0;
                    if (osoba.idUser == naszUser) {

                        task.osobaCzas = osoba.czasUzytkownika;
                        task.osobaKasa = osoba.kasaUzytkownika;
                        task.osobaCzasTF = 1;
                        task.osobaKasaTF = 1;
                    }


                    task.budzetPienieznyWykorzystanie += osoba.kasaUzytkownika;
                    task.budzetGodzinowyWykorzystanie += osoba.czasUzytkownika;

                    if (task.budzetGodzinowyWykorzystanie == 0) {
                        task.statusUzytkownika = "oczekuje";
                        task.statusClass = "completionHalf";
                    } else {
                        task.statusUzytkownika = "w trakcie";
                        task.statusClass = "completionHalf";
                    }


                });
            });


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


            iterator = 0;

            var iloscZadanGlobal = 0;
            var iloscZadanUkonczonychGlobal = 0;
            var nieprzypisaneGlobal = 0;
            var zadaniaPoTerminieGlobal = 0;
            var zadaniaZPrzekroczonymBudzetemGlobal = 0;
            var budzetPienieznyWykorzystanieGlobal = 0;
            var budzetGodzinowyWykorzystanieGlobal = 0;

            $scope.item.budzetPienieznyWykorzystanie = 0;
            $scope.item.budzetGodzinowyWykorzystanie = 0;
            $scope.item.ukonczoneZadania = 0;
            $scope.item.wszystkieZadania = 0;
            $scope.item.zadaniaPrzypisaneDoUzytkownika = 0;
            $scope.item.zadaniaNieprzypisane = 0;
            $scope.item.zadaniaPoTerminie = 0;
            $scope.item.zadaniaPrzekroczonyBudzet = 0;

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
            today = orderKeyGen(dd, mm, yyyy, gg, min, 9);

            //FIXME: nieprzypisane
            angular.forEach($scope.item.zadania, function (task, index) {
                if (!task.idTerminu) {
                    iloscZadanGlobal++;
                    if (task.priorytet == 'prioFinished') {
                        iloscZadanUkonczonychGlobal++;
                    }
                    if (task.przypisaneOsoby) {
                        if (task.przypisaneOsoby.length == 0) {
                            nieprzypisaneGlobal++;
                        }
                    }
                    if (!task.przypisaneOsoby) {
                        nieprzypisaneGlobal++;
                    }
                    if (task.orderKey < today && task.priorytet != "prioFinished") {
                        zadaniaPoTerminieGlobal++;
                    }
                    if (task.budzetPienieznyWartosc < task.budzetPienieznyWykorzystanie || task.budzetGodzinowyWartosc < task.budzetGodzinowyWykorzystanie) {
                        zadaniaZPrzekroczonymBudzetemGlobal++;
                    }
                    budzetPienieznyWykorzystanieGlobal += task.budzetPienieznyWykorzystanie;
                    budzetGodzinowyWykorzystanieGlobal += task.budzetGodzinowyWykorzystanie;
                }
            });

            angular.forEach($scope.item.koszty, function (koszt, index) {
                if (koszt.zaakceptowanyAdmin == 1) {
                    budzetPienieznyWykorzystanieGlobal += koszt.kwota;
                }
            });

            $scope.item.budzetPienieznyWykorzystanie = budzetPienieznyWykorzystanieGlobal;
            $scope.item.budzetGodzinowyWykorzystanie = budzetGodzinowyWykorzystanieGlobal;
            $scope.item.ukonczoneZadania = iloscZadanUkonczonychGlobal;
            $scope.item.wszystkieZadania = iloscZadanGlobal;

            var ukonczenieProjektu = Math.floor(iloscZadanUkonczonychGlobal / iloscZadanGlobal * 100);
            $scope.item.procentUkonczeniaProjektu = ukonczenieProjektu;


            $.ajax({
                type: "POST",
                url: url,
                data: {
                    idProjekt: $scope.item.idProjekt,
                    procentUkonczeniaProjektu: $scope.item.procentUkonczeniaProjektu,
                    updateProjectCompletion: ''
                },
                crossDomain: true,
                cache: false,
                beforeSend: function () {},
                success: function (data) {}
            });


            $scope.item.zadaniaPrzypisaneDoUzytkownika = 0;
            $scope.item.zadaniaNieprzypisane = nieprzypisaneGlobal;
            $scope.item.zadaniaPoTerminie = zadaniaPoTerminieGlobal;
            $scope.item.zadaniaPrzekroczonyBudzet = zadaniaZPrzekroczonymBudzetemGlobal;
            if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
                $scope.$apply();
            }


        }

        $scope.dodajZasob = function () {
            navi.pushPage('addZasob.html', {
                animation: 'slide'
            });
        }

        $scope.reserveZasob = function (idZasobu) {
            var foundCheck = $filter('filter')($scope.item.zasoby, {
                idZasob: idZasobu
            }, true);

            $projekty.selectedZasob = foundCheck[0];
            navi.pushPage('reserveZasob.html', {
                animation: 'slide'
            });
        }


        $scope.addZasob = function () {
            var idProjekt = $scope.item.idProjekt;
            var opis = $('#opisZasob').val();
            var nazwa = $('#nazwaZasob').val();
            var idUser = $scope.currentuser[0].idUser;
            var imie = $scope.currentuser[0].imie;
            var avatar = $scope.currentuser[0].avatar;

            if (nazwa == '') {
                ons.notification.alert({
                    message: $scope.lang.res_message,
                    title: $scope.lang.res_title,
                    buttonLabel: 'OK',
                    animation: 'default',
                    callback: function () {}
                });
            } else {

                $.ajax({
                    type: "POST",
                    url: url,
                    data: {
                        idProjekt: idProjekt,
                        nazwa: nazwa,
                        opis: opis,
                        submitZasobToBase: ''
                    },
                    crossDomain: true,
                    cache: false,
                    beforeSend: function () {},
                    success: function (data) {
                        var item = {
                            idZasob: data,
                            idProjekt: idProjekt,
                            nazwa: nazwa,
                            opis: opis,
                        }
                        if ($scope.item.zasoby) {
                            $scope.item.zasoby.push(item);
                            if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
                                $scope.$apply();
                            }
                        } else {
                            $scope.item.zasoby = [];
                            $scope.item.zasoby.push(item);
                            if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
                                $scope.$apply();
                            }
                        }
                        navi.popPage();
                    }
                });
            }
        }

        $scope.projectOptions = function () {
            ons.notification.confirm({
                title: $scope.lang.project_title,
                message: $scope.lang.project_message,
                buttonLabels: [$scope.lang.project_add_task, $scope.lang.project_manage_users, $scope.lang.project_manage_dates, $scope.lang.project_manage_budget, $scope.lang.project_add_res, $scope.lang.project_finish, $scope.lang.project_cancel],
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
                        navi.pushPage('addZasob.html', {
                            animation: 'slide'
                        });
                    }
                    if (index == 6) {

                    }
                    if (index == 5) {
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
                        var newLog = $scope.addLogElement($scope.item.idProjekt, $scope.currentuser[0].idUser, 'zakonczenieProjektu', '', $scope.currentuser[0].imienazwisko, $scope.currentuser[0].avatar, today, 0);

                        var item = {
                            idLog: newLog,
                            typ: 'zakonczenieProjektu',
                            data: today,
                            dataPrezentacja: 'Dziś - ' + gg + ':' + min,
                            odczytane: 0
                        }
                        $scope.item.log.push(item);
                        if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
                            $scope.$apply();
                        }
                    }
                }
            });
        };


        $scope.projectOptionsUser = function () {
            if ($scope.isAndroidTest()) {
                ons.notification.confirm({
                    title: $scope.lang.project_title,
                    message: $scope.lang.project_message,
                    buttonLabels: [$scope.lang.report_cost, $scope.lang.nfc_assign, $scope.lang.cancel_nfc],
                    primaryButtonIndex: 0,
                    callback: function (index) {
                        if (index == 0) {
                            navi.pushPage('addCost.html', {
                                animation: 'slide'
                            });
                        }
                        if (index == 1) {
                            $scope.lisenNFC();
                        }
                        if (index == 2) {

                        }
                    }
                });
            } else {
                ons.notification.confirm({
                    title: $scope.lang.project_title,
                    message: $scope.lang.project_message,
                    buttonLabels: [$scope.lang.report_cost, $scope.lang.cancel_nfc],
                    primaryButtonIndex: 0,
                    callback: function (index) {
                        if (index == 0) {
                            navi.pushPage('addCost.html', {
                                animation: 'slide'
                            });
                        }
                        if (index == 1) {

                        }
                    }
                });
            }
        };


        //NOTE: Google Maps function
        $scope.applyLocation = function () {
            var location = $('#adressPreview').html();
            if (location != $scope.lang.location_click) {
                $('#lokalizacjaZadania').html(location);
                var latLngTmp = $('#adressPreview small').html();
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
                                $('#adressPreview').html($scope.lang.no_such_address);
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
                    message: $scope.lang.user_already_assigned
                });
            } else {
                ons.notification.prompt({
                    message: $scope.lang.hour_rate,
                    callback: function (age) {
                        var found = $filter('filter')($scope.baza, {
                            idUser: userToAddId
                        }, true);
                        var osoba = {
                            idUser: found[0].idUser,
                            imie: found[0].imienazwisko,
                            email: found[0].email,
                            avatar: found[0].avatar,
                            stawka: age * 100,
                            iloscZadan: 0,
                            czasUzytkownika: 0,
                            kasaUzytkownika: 0,
                            punktyUzytkownika: 0,
                        }

                        //NOTE:dodawanie odoby

                        $.ajax({
                            type: "POST",
                            url: url,
                            data: {
                                idProjekt: $scope.item.idProjekt,
                                idUser: found[0].idUser,
                                imie: found[0].imienazwisko,
                                avatar: found[0].avatar,
                                stawka: age * 100,
                                punktyUzytkownika: 0,
                                addUserToProject: ''
                            },
                            crossDomain: true,
                            cache: false,
                            beforeSend: function () {},
                            success: function (data) {}
                        });

                        $scope.item.przypisaneOsoby.push(osoba);
                        if ($scope.currentuser[0].ostatnieOsoby) {
                            var foundCheck2 = $filter('filter')($scope.currentuser[0].ostatnieOsoby, {
                                idUser: userToAddId
                            }, true);

                            if (foundCheck2.length > 0) {} else {
                                $scope.currentuser[0].ostatnieOsoby.push(osoba);
                            }
                        } else {
                            $scope.currentuser[0].ostatnieOsoby = [];
                            $scope.currentuser[0].ostatnieOsoby.push(osoba);
                        }
                        if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
                            $scope.$apply();
                        }
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
            var foundCheck = $filter('filter')($scope.item.zadania.przypisaneOsoby, {
                idUser: userToAddId
            }, true);
            if (!foundCheck) {
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
                    message: $scope.lang.user_already_assigned
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
                $scope.item.budzetGodzinowyWartosc = parseInt($('#newHourBudgetText').text()) * 60;
            }
            if ($scope.item.budzetPieniezny == 'tak') {
                $scope.item.budzetPienieznyWartosc = parseInt($('#newMoneyBudgetText').text()) * 100;
            }



            $.ajax({
                type: "POST",
                url: url,
                data: {
                    idProjekt: $scope.item.idProjekt,
                    budzetGodzinowyWartosc: parseInt($('#newHourBudgetText').text()) * 60,
                    budzetPienieznyWartosc: parseInt($('#newMoneyBudgetText').text()) * 100,
                    updateBudget: ''
                },
                crossDomain: true,
                cache: false,
                beforeSend: function () {},
                success: function (data) {}
            });

            navi.popPage();
        }

        $scope.updateTerms = function () {
            $('.pojedynczyTerminNowy').each(function (x) {
                var projektID = $scope.item.idProjekt;
                var iloscTerminow = 0;
                if ($scope.item.terminy) {
                    iloscTerminow = $scope.item.terminy.length;
                }
                var dataTermin = $(this).find('input[type="datetime-local"]').val();
                var dd = dataTermin.substring(8, 10);
                var mm = dataTermin.substring(5, 7);
                var yyyy = dataTermin.substring(0, 4);
                var gg = dataTermin.substring(11, 13);
                var min = dataTermin.substring(14, 16);
                dataTermin = dd + '.' + mm + '.' + yyyy + ' ' + gg + ':' + min;
                var orderKey = orderKeyGen(dd, mm, yyyy, gg, min, 9);
                var nazwaTermin = $(this).find('input[type="text"]').val();



                $.ajax({
                    type: "POST",
                    url: url,
                    data: {
                        idProjekt: projektID,
                        orderKey: orderKey,
                        mileStoneNaglowek: 'Milestone ' + (iloscTerminow + x + 1),
                        data: dataTermin,
                        nazwa: nazwaTermin,
                        addNewTerm: ''
                    },
                    crossDomain: true,
                    cache: false,
                    beforeSend: function () {},
                    success: function (data) {
                        var idTerminu = data;


                        $.ajax({
                            type: "POST",
                            url: url,
                            data: {
                                idProjekt: projektID,
                                idTerminu: parseInt(idTerminu),
                                nazwa: nazwaTermin,
                                opis: '',
                                data: dataTermin,
                                dataDzien: dd,
                                dataMiesiac: mm,
                                dataGodzina: gg + ':' + min,
                                orderKey: orderKey,
                                basicItem: 'none',
                                milestone: 'block',
                                mileStoneNaglowek: 'Milestone ' + (iloscTerminow + x + 1),
                                milestoneUkonczoneZadaniaProcent: 0,
                                milestoneWykorzystanyBudzetPieniadze: 0,
                                milestoneWykorzystanyBudzetGodziny: 0,
                                avatarPierwszejOsoby: '',
                                dodatkoweOsobyDisplay: 'none',
                                dotatkoweOsoby: 0,
                                ukonczoneDisplay: 'none',
                                brakOsobyDisplay: 'none',
                                lokalizacjaDisplay: 'none',
                                lokalizacja: 'none',
                                latLngPosition: 'none',
                                priorytet: 'none',
                                status: 'none',
                                budzetPieniezny: 'none',
                                budzetPienieznyWartosc: 0,
                                budzetPienieznyWykorzystanie: 0,
                                budzetGodzinowy: 'none',
                                budzetGodzinowyWartosc: 0,
                                budzetGodzinowyWykorzystanie: 0,
                                punktyPremiowe: 'none',
                                punktyPremioweWartosc: 0,
                                addTaskToProject: ''
                            },
                            crossDomain: true,
                            cache: false,
                            beforeSend: function () {},
                            success: function (data) {
                                var idZadania = data;

                                var zadanie = {
                                    idZadania: parseInt(idZadania),
                                    idTerminu: parseInt(idTerminu),
                                    orderKey: orderKey,
                                    basicItem: 'none',
                                    milestone: 'block',
                                    mileStoneNaglowek: 'Milestone ' + (iloscTerminow + x + 1),
                                    milestoneUkonczoneZadaniaProcent: '0',
                                    milestoneWykorzystanyBudzetPieniadze: '0',
                                    milestoneWykorzystanyBudzetGodziny: '0',
                                    data: dataTermin,
                                    nazwa: nazwaTermin
                                }
                                var termin = {
                                    idTerminu: parseInt(idTerminu),
                                    orderKey: orderKey,
                                    mileStoneNaglowek: 'Milestone ' + (iloscTerminow + x + 1),
                                    data: dataTermin,
                                    nazwa: nazwaTermin
                                }
                                $scope.item.zadania.push(zadanie);
                                $scope.item.terminy.push(termin);
                                if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
                                    $scope.$apply();
                                }
                            }
                        });
                    }
                });

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


            $.ajax({
                type: "POST",
                url: url,
                data: {
                    idTerminu: selectedTermId,
                    removeTerm: ''
                },
                crossDomain: true,
                cache: false,
                beforeSend: function () {},
                success: function (data) {}
            });

        }

        $scope.logType = function () {
            ons.notification.confirm({
                title: $scope.lang.project_title,
                message: $scope.lang.project_message,
                buttonLabels: [$scope.lang.project_all, $scope.lang.project_deadlines_crossed, $scope.lang.project_budget_crossed, $scope.lang.finished_tasks, $scope.lang.project_created_tasks],
                primaryButtonIndex: 0,
                callback: function (index) {
                    if (index == 0) {
                        logType = "wszystkie";
                        if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
                            $scope.$apply();
                        }
                    }
                    if (index == 1) {
                        logType = "przekroczonyTermin";
                        if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
                            $scope.$apply();
                        }
                    }
                    if (index == 2) {
                        logType = "przekroczonyBudzet";
                        if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
                            $scope.$apply();
                        }
                    }
                    if (index == 3) {
                        logType = "koniecZadania";
                        if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
                            $scope.$apply();
                        }
                    }
                    if (index == 4) {
                        logType = "noweZadanie";
                        if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
                            $scope.$apply();
                        }
                    }
                }
            });
        };

        $scope.addPersonToTask = function (idosobyS) {
            if ($scope.currentuser[0].tmp) {
                var foundCheck = $filter('filter')($scope.currentuser[0].tmp, {
                    idUser: idosobyS
                }, true);
                if (foundCheck.length > 0) {
                    ons.notification.alert({
                        message: $scope.lang.user_already_assigned
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
                $scope.currentuser[0].tmp = [];
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
            if ($scope.currentuser[0].tmp) {
                var foundCheck = $filter('filter')($scope.currentuser[0].tmp, {
                    idUser: userToAddId
                }, true);
                if (foundCheck.length > 0) {
                    return true;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        }



        $scope.addPromoPoints = function (indexid) {
            ons.notification.confirm({
                title: $scope.lang.bonus_points,
                message: $scope.lang.how_many_bonus_points,
                buttonLabels: ['1', '2', '3', '4', '5'],
                primaryButtonIndex: 0,
                callback: function (index) {
                    dodatkowePunkty = index + 1;
                    $('.actionButtonHolder[data-id="' + indexid + '"]').fadeOut();
                    $scope.item.log[indexid].przyznanePunkty = dodatkowePunkty;
                    var currentPoints = $scope.item.przypisaneOsoby[$scope.item.log[indexid].idOsoby].punktyUzytkownika;
                    $scope.item.przypisaneOsoby[$scope.item.log[indexid].idOsoby].punktyUzytkownika = currentPoints + dodatkowePunkty;
                    $('.actionInfo[data-id="' + indexid + '"]').fadeIn();
                    if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
                        $scope.$apply();
                    }
                }
            });
        };
    });

    module.controller('MasterController', function ($scope, $projekty, $currentUser, $filter) {
        $scope.items = $projekty.items;
        $scope.user = $currentUser.items[0];
        var userID = $scope.user.idUser;

        $scope.reloadProjects = function () {
            window.console && console.log('test');
            $scope.items = $projekty.items;
            $scope.user = $currentUser.items[0];
        }

        $scope.$on("reloadProjectsEvent", function (event) {
            $scope.reloadProjects();
        });
        //userID = "1";


        $scope.goToMojeZadania = function () {
            if ($scope.user.tasks) {
                var ilosczadan = $scope.user.tasks.length;
                angular.forEach($scope.user.tasks, function (zadanie, index) {

                    var found = $filter('filter')($scope.items, {
                        idProjekt: zadanie.idProjekt
                    }, true);

                    var foundPerson = $filter('filter')(found[0].przypisaneOsoby, {
                        idUser: $scope.user.idUser
                    }, true);

                    zadanie.tytul = found[0].tytul;
                    zadanie.czasUzytkownika = foundPerson[0].czasUzytkownika;
                    zadanie.kasaUzytkownika = foundPerson[0].kasaUzytkownika;
                    zadanie.punktyUzytkownika = foundPerson[0].punktyUzytkownika;

                    if (zadanie.czasUzytkownika == 0) {
                        zadanie.statusUzytkownika = "oczekuje";
                        zadanie.statusClass = "completionHalf";
                    } else {
                        zadanie.statusUzytkownika = "w trakcie";
                        zadanie.statusClass = "completionHalf";
                    }

                    if ((index + 1) == ilosczadan) {
                        $('.tabMojeZadania').css('display', 'block');
                        $('.tabProjekty').css('display', 'none');
                    }
                });
            } else {

                $('.tabMojeZadania').css('display', 'block');
                $('.tabProjekty').css('display', 'none');
            }
        }

        $scope.showDetailByID = function (projectID) {
            var element = 0;

            angular.forEach($projekty.items, function (item, index) {
                if (item.idProjekt == projectID) {
                    element = index;
                    $scope.showDetail(element);
                }
            });

        }


        $scope.showDetail = function (index) {
            var selectedItem = $projekty.items[index];
            $projekty.selectedItem = selectedItem;
            currentproject = $projekty.selectedItem.idProjekt;

            var ilosczadan = 0;
            var iterator = 0;

            if (selectedItem.zasoby) {
                angular.forEach(selectedItem.zasoby, function (zasob, index) {
                    $.ajax({
                        type: "POST",
                        url: url,
                        data: {
                            idZasob: zasob.idZasob,
                            getReservations: ''
                        },
                        crossDomain: true,
                        cache: false,
                        beforeSend: function () {},
                        success: function (data) {
                            zasob.rezerwacje = angular.fromJson(data).rezerwacje;
                        }
                    });
                });
            }



            if (selectedItem.zadania) {
                ilosczadan = selectedItem.zadania.length;

                angular.forEach(selectedItem.zadania, function (zadanie, index) {
                    iterator++;

                    $.ajax({
                        type: "POST",
                        url: url,
                        data: {
                            idZadania: zadanie.idZadania,
                            getTaskDetails: ''
                        },
                        crossDomain: true,
                        cache: false,
                        beforeSend: function () {},
                        success: function (data) {

                            zadanie.przypisaneOsoby = angular.fromJson(data).osoby;
                            if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
                                $scope.$apply();
                            }

                            if (index == (ilosczadan - 1)) {
                                $scope.navi.pushPage('procjectview.html', {
                                    title: selectedItem.tytul
                                });
                            }
                        }
                    });
                });
            }





        };

        $scope.projectDetails = function () {
            //CHANGES: NOW POINT

            angular.forEach($projekty.items, function (project, index) {

                var found = $filter('filter')(project.przypisaneOsoby, {
                    idUser: userID
                }, true);



                //project.kasaUzytkownika=found[0].kasaUzytkownika;

            });

        }

    });

    module.factory('$currentUser', function () {
        var currentUser = {};
        currentUser.items = [
            {
                imie: 'Marcin',
                nazwisko: 'Kowalski',
                idUser: 456,
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
        projekty.items = [];
        return projekty;
    });

    module.factory('$bazauzytkownikow', function () {
        var bazauzytkownikow = {};
        bazauzytkownikow.items = [];
        return bazauzytkownikow;
    });

})();