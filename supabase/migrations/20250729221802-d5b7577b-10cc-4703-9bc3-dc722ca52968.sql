-- Test: Feature a listing for Nigeria to debug the issue
UPDATE car_parts 
SET is_featured = true, featured_country = 'NG' 
WHERE id = '4536ba99-4afa-49c7-84a5-ac4990c735e8' AND supplier_id = 'f1074e01-636c-40bb-b0ec-d9466a3d586a';