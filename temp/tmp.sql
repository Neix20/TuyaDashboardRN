-- Select List of Devices from Merchant
-- DECLARE @User_Id INT = -1;
-- DECLARE @Merchant_Id INT = -1;

-- SELECT @Merchant_Id = [Merchant_Id]
-- FROM [dbo].[TUser]
-- WHERE 1=1
-- AND [User_Id] = @User_Id;

-- SELECT *
-- FROM TDevice td
-- WHERE 1=1
-- AND td.Merchant_Id = @Merchant_Id;

-- Add User
DECLARE @User_Id INT = -1;
DECLARE @Merchant_Id INT = -1;

SELECT @Merchant_Id = [Merchant_Id]
FROM [dbo].[TUser]
WHERE 1=1
AND [User_Id] = @User_Id;

-- Upgrade User
-- DECLARE @User_Id INT = -1;

-- UPDATE [dbo].[TUser] 
-- SET 
--     [IsManager] = 1,
--     [Last_Updated_By] = 'Merchant',
--     [Last_Updated_Date] = GETDATE()
-- WHERE 1=1;

-- Delete User
-- DECLARE @User_Id INT = -1;

-- UPDATE [dbo].[TUser] 
-- SET 
--     [Merchant_Id] = -1,
--     [Last_Updated_By] = 'Merchant',
--     [Last_Updated_Date] = GETDATE()
-- WHERE 1=1;