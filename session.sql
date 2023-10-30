USE Sandbox_Yatu

DECLARE @User_Id INT = 37
DECLARE @Merchant_Id INT = 36
DECLARE @Home_Id INT = 85

-- Make This Dynamic

DECLARE @AC_Temp_Humd INT = 12;
DECLARE @AC_Smart_Plug INT = 9;
DECLARE @AC_Air_Quality INT = 1;

DECLARE @IAC_Temp_Humd INT = 5;
DECLARE @IAC_Smart_Plug INT = 3;
DECLARE @IAC_Air_Quality INT = 0;

-- Active Count
SELECT 
    @AC_Temp_Humd = SUM(mdc.IsTempHumd), 
    @AC_Smart_Plug = SUM(mdc.IsSmartCamera), 
    @AC_Air_Quality = SUM(mdc.IsAirQuality)
FROM TDevice td
JOIN MDevice md
ON td.M_Device_Id = md.Id
JOIN MDeviceCategory mdc
ON md.Device_Category_Id = mdc.Id
WHERE 1=1
AND td.Home_Id = @Home_Id
AND td.Status = 1

-- InActive Count
SELECT 
    @IAC_Temp_Humd = SUM(mdc.IsTempHumd), 
    @IAC_Smart_Plug = SUM(mdc.IsSmartCamera), 
    @IAC_Air_Quality = SUM(mdc.IsAirQuality)
FROM TDevice td
JOIN MDevice md
ON td.M_Device_Id = md.Id
JOIN MDeviceCategory mdc
ON md.Device_Category_Id = mdc.Id
WHERE 1=1
AND td.Home_Id = @Home_Id

SELECT 
    (
        SELECT
            @AC_Temp_Humd AS [Active],
            @IAC_Temp_Humd - @AC_Temp_Humd AS [Inactive],
            @IAC_Temp_Humd AS [Total]
        FOR JSON PATH, WITHOUT_ARRAY_WRAPPER
    ) AS [Temp_Humd],
    (
        SELECT
            @AC_Smart_Plug AS [Active],
            @IAC_Smart_Plug - @AC_Smart_Plug AS [Inactive],
            @IAC_Smart_Plug AS [Total]
        FOR JSON PATH, WITHOUT_ARRAY_WRAPPER
    ) AS [Smart_Plug],
    (
        SELECT
            @AC_Air_Quality AS [Active],
            @IAC_Air_Quality - @AC_Air_Quality AS [Inactive],
            @IAC_Air_Quality AS [Total]
        FOR JSON PATH, WITHOUT_ARRAY_WRAPPER
    ) AS [Air_Quality]
FOR JSON PATH, WITHOUT_ARRAY_WRAPPER;
