erDiagram
Organization {
string id PK
string name
string email
string phone
string address
json settings
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
        file avatar
        boolean verified
        boolean emailVisibility
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

    ActivityLog {
        string id PK
        string organizationId FK
        string userId FK
        string equipmentId FK
        json metadata
        date created
        date updated
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
