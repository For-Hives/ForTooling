# Diagram

```text
erDiagram
Organization {
    string id PK
    string name
    string email
    string phone
    string address
    json settings
    string clerkId
    string stripeCustomerId
    string subscriptionId
    string subscriptionStatus
    string priceId
    date created
    date updated
}

User {
    string id PK
    string name
    string email
    string phone
    string role
    boolean isAdmin
    boolean canLogin
    string lastLogin
    file avatar
    boolean verified
    boolean emailVisibility
    string clerkId
    date created
    date updated
}

Equipment {
    string id PK
    string organizationId FK
    string name
    string qrNfcCode
    string tags
    editor notes
    date acquisitionDate
    string parentEquipmentId FK
    date created
    date updated
}

Project {
    string id PK
    string organizationId FK
    string name
    string address
    editor notes
    date startDate
    date endDate
    date created
    date updated
}

Assignment {
    string id PK
    string organizationId FK
    string equipmentId FK
    string assignedToUserId FK
    string assignedToProjectId FK
    date startDate
    date endDate
    editor notes
    date created
    date updated
}

Image {
    string id PK
    string title
    string alt
    string caption
    file image
    date created
    date updated
}

Organization ||--o{ User : has
Organization ||--o{ Equipment : owns
Organization ||--o{ Project : manages
Organization ||--o{ Assignment : oversees

User }o--o{ Assignment : "is assigned to"

Equipment }o--o{ Assignment : "is assigned via"
Equipment }o--o{ Equipment : "parent/child"

Project }o--o{ Assignment : includes
```
