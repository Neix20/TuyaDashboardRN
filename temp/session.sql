CREATE OR ALTER PROCEDURE [dbo].[NSP_TUser_SelectDemoLogin]
(
    @UserId INT
)
AS
    DECLARE @Email NVARCHAR(200) = '';

    SELECT @Email = [Email]
    FROM [dbo].[TUser]
    WHERE 1=1
    AND [User_Id] = @UserId;

    SELECT @UserId AS [User_Id], @Email AS [Email], -1 AS [FirstTimeUserId], 'Normal' AS [ResponseMessage];
-- EXEC [dbo].[NSP_TUser_SelectDemoLogin] 65
GO