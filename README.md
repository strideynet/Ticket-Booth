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
	p.gender as gender,
	o.status as status,
	SUM(1) as count
FROM participants p
INNER JOIN orders o ON p.orderId =  o.id
WHERE status = 'confirmed'
GROUP BY age, gender
ORDER BY age, gender
```
