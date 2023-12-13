USE Sandbox_Yatu;
SELECT * FROM TUserQueue;

SELECT * FROM MParameter WHERE P_Key LIKE '%Tuya%';

SELECT * FROM MSubscriptionPlan

SELECT * FROM TSubscription WHERE MerchantId = 64

UPDATE TSubscription SET SubscriptionCode = 'MSSP0007' WHERE MerchantId = 64

DECLARE @data NVARCHAR(MAX) = N'';
EXEC NSP_MParameter_UpdatePair 'Yatu_PolicyData', @data, 'System';

EXEC NSP_MParameter_UpdatePair 'Tuya_LinkFlag', 'False', 'System';