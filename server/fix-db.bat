@echo off
echo Entrez votre mot de passe MySQL lorsque vous y êtes invité
mysql -u root -p business_tracker < src/fix-schema.sql
pause 