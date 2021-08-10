Ticket-Booth

## Hacks

### Setting race plate numbers

```sql
SET @x = 0;
UPDATE participants SET plateNumber = (@x:=@x+1) ORDER BY createdAt ASC;
```
