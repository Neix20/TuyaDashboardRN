USE Sandbox_Yatu

UPDATE [dbo].[TUser] 
SET [Merchant_Id] = 66
WHERE 1=1
AND [User_Id] = 67;

DECLARE @Home_Id INT = 127

SELECT *
FROM TDevice td
WHERE 1=1
AND Home_Id = @Home_Id

SELECT * FROM TUser

SELECT SUM(mdc.IsTempHumd), SUM(mdc.IsSmartCamera), SUM(mdc.IsAirQuality)
FROM TDevice td
JOIN MDevice md
ON td.M_Device_Id = md.Id
JOIN MDeviceCategory mdc
ON md.Device_Category_Id = mdc.Id
WHERE 1=1
AND td.Home_Id = @Home_Id

DECLARE @Merchant_Id INT = -1;

SELECT * 
FROM TDevice td

--  [X] Function to Show All User List with Same Merchant
--  [ ] Function to Manage User
--  [ ]    Function to Update User
--  [ ]    Function to Delete User
--  [ ]    Function to Add User

SELECT * 
FROM TMerchantBuilding tmb