USE Sandbox_Yatu

SELECT * FROM TDevice td
SELECT * FROM TUser tu;

SELECT * FROM TMerchant

UPDATE [dbo].[TUser] 
SET [Merchant_Id] = 66
WHERE 1=1
AND [User_Id] = 67;

DECLARE @Home_Id INT = 127

SELECT *
FROM TDevice td
WHERE 1=1
AND Home_Id = @Home_Id;


--  Function to Show All User List with Same Merchant
--  Function to Manage User
--      Function to Update User
--      Function to Delete User
--      Function to Add User

SELECT * FROM TMerchantBuilding tmb