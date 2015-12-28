HELP FILE

Web Server Configuration

1. Create Database
2. Import phonegap_login.sql (localed in server folder) to database
3. Upload auth.php to your webserver and configure your database connection and database name


Mobile Configuration 

1. Create your phonegap / apache cordova project

cordova create Login com.phonegap.login Login

2. Change Directory

cd Login

3. Add your Platform (android, iOs)

cordova platform add android
cordova platform add ios


4. Replace "WWW" directory content with downloaded "WWW Folder"

5. Compile / Build your app

cordova build
cordova emulate


** NOTE : don't forget to change your domain name in auth.js (www/js/auth.js)