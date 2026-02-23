# Appointment API Agent

This agent provides access to appointment management endpoints.

## Configuration

```typescript
const BUSINESS_API = variable().BUSINESS_API;
```

## Available Endpoints

### Services

**List Services**
```
GET {{BUSINESS_API}}/appointment/get/services
Query Parameters:
  - search (optional): string
  - limit (optional): number, default 100
```

**Get Service Rules**
```
GET {{BUSINESS_API}}/appointment/get/service-rules
Query Parameters:
  - erp_item_code (required): string
```

**Create/Update Service Rules**
```
POST {{BUSINESS_API}}/appointment/create/service-rules
Body:
{
  "erp_item_code": "string",
  "duration_minutes": number,
  "buffer_before_minutes": number,
  "buffer_after_minutes": number,
  "active": boolean
}
```

### Employees

**List Employees**
```
GET {{BUSINESS_API}}/appointment/get/employees
Query Parameters:
  - search (optional): string
  - limit (optional): number
```

### Customers

**List Customers**
```
GET {{BUSINESS_API}}/appointment/get/customers
Query Parameters:
  - search (optional): string
  - limit (optional): number
```

### Slots

**Get Available Slots**
```
GET {{BUSINESS_API}}/appointment/get/slots
Query Parameters:
  - erp_item_code (required): string
  - date (required): YYYY-MM-DD
  - erp_employee_id (optional): string
```

### Appointments

**Get Single Appointment**
```
GET {{BUSINESS_API}}/appointment/get/appointment
Query Parameters (one required):
  - id: UUID string
  - public_ref: string
```

**List Appointments**
```
GET {{BUSINESS_API}}/appointment/get/list
Query Parameters:
  - from_date (optional): YYYY-MM-DD
  - to_date (optional): YYYY-MM-DD
  - status (optional): string
  - erp_employee_id (optional): string
  - erp_item_code (optional): string
  - limit (optional): number
```

**Create Booking**
```
POST {{BUSINESS_API}}/appointment/create/booking
Body:
{
  "erp_customer_id": "string",
  "erp_item_code": "string",
  "erp_employee_id": "string",
  "start_datetime": "YYYY-MM-DDTHH:mm:ss",
  "notes": "string" (optional)
}
```

**Create Walk-in**
```
POST {{BUSINESS_API}}/appointment/create/walk-in
Body:
{
  "erp_customer_id": "string",
  "erp_item_code": "string",
  "erp_employee_id": "string",
  "start_datetime": "YYYY-MM-DDTHH:mm:ss",
  "notes": "string" (optional)
}
```

**Cancel Appointment**
```
PATCH {{BUSINESS_API}}/appointment/update/cancel
Body (one identifier required):
{
  "id": "uuid" OR "public_ref": "string",
  "cancel_reason": "string"
}
```

**Check-in Appointment**
```
PATCH {{BUSINESS_API}}/appointment/update/check-in
Body:
{
  "id": "uuid"
}
```

**Start Appointment**
```
PATCH {{BUSINESS_API}}/appointment/update/start
Body:
{
  "id": "uuid"
}
```

**Complete Appointment**
```
PATCH {{BUSINESS_API}}/appointment/update/complete
Body:
{
  "id": "uuid"
}
```

**Mark No-Show**
```
PATCH {{BUSINESS_API}}/appointment/update/no-show
Body:
{
  "id": "uuid"
}
```

**Reschedule Appointment**
```
PATCH {{BUSINESS_API}}/appointment/update/reschedule
Body:
{
  "id": "uuid",
  "start_datetime": "YYYY-MM-DDTHH:mm:ss"
}
```

## Authentication

All endpoints require authentication. Include appropriate authentication headers with each request.

## Common Response Codes

- `200` OK: Request successful
- `400` Bad Request: Missing required fields or invalid data
- `404` Not Found: Resource not found
- `409` Conflict: Scheduling conflict (overlap or capacity full)
- `500` Server Error: Unexpected error

## Notes

- All appointments are scoped to the authenticated tenant
- Dates use `YYYY-MM-DD` format
- Datetimes use ISO format `YYYY-MM-DDTHH:mm:ss`
- No timezone conversion is performed
- Service rules must exist before booking
- Seat numbers are assigned automatically based on capacity