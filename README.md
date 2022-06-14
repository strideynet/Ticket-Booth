Ticket-Booth

## Hacks

### Setting race plate numbers

```sql
SET @x = 0;
UPDATE participants SET plateNumber = (@x:=@x+1) ORDER BY createdAt ASC;
```

### Get participant data

```sql
SELECT 
	TIMESTAMPDIFF(YEAR, p.dob, '2022-08-26' ) as age,
	SUM(CASE WHEN p.gender = 'male' THEN 1 END) as maleCount,
	SUM(CASE WHEN p.gender = 'female' THEN 1 END) as femaleCount,
	SUM(CASE WHEN p.gender NOT IN ('male', 'female') THEN 1 END) as nonBinaryCount
FROM participants p
INNER JOIN orders o ON p.orderId =  o.id
WHERE o.status = 'confirmed'
GROUP BY age
ORDER BY age
```
