---
config:
  theme: base
---

erDiagram
Organization {
string id PK
string name
string email
string phone
string address
json settings
datetime createdAt
datetime updatedAt
}
User {
string id PK
string organizationId FK
string name
string email
string phone
string role
boolean isAdmin
boolean canLogin
datetime lastLogin
datetime createdAt
datetime updatedAt
}
Equipment {
string id PK
string organizationId FK
string name
string qrNfcCode
string[] tags
string notes
datetime acquisitionDate
string parentEquipmentId FK
datetime createdAt
datetime updatedAt
}
Project {
string id PK
string organizationId FK
string name
string address
string notes
datetime startDate
datetime endDate
datetime createdAt
datetime updatedAt
}
Assignment {
string id PK
string organizationId FK
string equipmentId FK
string assignedToUserId FK
string assignedToProjectId FK
datetime startDate
datetime endDate
string notes
datetime createdAt
datetime updatedAt
}
ActivityLog {
string id PK
string organizationId FK
string userId FK
string equipmentId FK
string resourceType
string resourceId
string action
json metadata
datetime createdAt
}

    Organization ||--o{ User : has
    Organization ||--o{ Equipment : owns
    Organization ||--o{ Project : manages
    Organization ||--o{ Assignment : oversees
    Organization ||--o{ ActivityLog : records

    User }o--o{ Assignment : "is assigned to"
    User }|--o{ ActivityLog : performs

    Equipment }o--o{ Assignment : "is assigned via"
    Equipment }|--o{ ActivityLog : generates
    Equipment }o--o{ Equipment : "parent/child"

    Project }o--o{ Assignment : includes

---

See on figma for the editable diagram.
