# Organization

```json
{
	"data": {
		"created_at": 1654013202977,
		"created_by": "user_1vq84bqWzw7qmFgqSwN4CH1Wp0n",
		"id": "org_29w9IfBrPmcpi0IeBVaKtA7R94W",
		"image_url": "https://img.clerk.com/xxxxxx",
		"logo_url": "https://example.org/example.png",
		"name": "Acme Inc",
		"object": "organization",
		"public_metadata": {},
		"slug": "acme-inc",
		"updated_at": 1654013202977
	},
	"event_attributes": {
		"http_request": {
			"client_ip": "0.0.0.0",
			"user_agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36"
		}
	},
	"object": "event",
	"timestamp": 1654013202977,
	"type": "organization.created"
}
```

```
{
  "data": {
    "deleted": true,
    "id": "org_29w9IfBrPmcpi0IeBVaKtA7R94W",
    "object": "organization"
  },
  "event_attributes": {
    "http_request": {
      "client_ip": "",
      "user_agent": ""
    }
  },
  "object": "event",
  "timestamp": 1661861640000,
  "type": "organization.deleted"
}
```

```
{
  "data": {
    "created_at": 1654013202977,
    "created_by": "user_1vq84bqWzw7qmFgqSwN4CH1Wp0n",
    "id": "org_29w9IfBrPmcpi0IeBVaKtA7R94W",
    "image_url": "https://img.clerk.com/xxxxxx",
    "logo_url": "https://example.com/example.png",
    "name": "Acme Inc",
    "object": "organization",
    "public_metadata": {},
    "slug": "acme-inc",
    "updated_at": 1654013466465
  },
  "event_attributes": {
    "http_request": {
      "client_ip": "",
      "user_agent": ""
    }
  },
  "object": "event",
  "timestamp": 1654013466465,
  "type": "organization.updated"
}
```

# Organization Membership

```
{
  "data": {
    "created_at": 1654013203217,
    "id": "orgmem_29w9IptNja3mP8GDXpquBwN2qR9",
    "object": "organization_membership",
    "organization": {
      "created_at": 1654013202977,
      "created_by": "user_1vq84bqWzw7qmFgqSwN4CH1Wp0n",
      "id": "org_29w9IfBrPmcpi0IeBVaKtA7R94W",
      "image_url": "https://img.clerk.com/xxxxxx",
      "logo_url": "https://example.com/example.png",
      "name": "Acme Inc",
      "object": "organization",
      "public_metadata": {},
      "slug": "acme-inc",
      "updated_at": 1654013202977
    },
    "public_user_data": {
      "first_name": "Example",
      "identifier": "example@example.org",
      "image_url": "https://img.clerk.com/xxxxxx",
      "last_name": "Example",
      "profile_image_url": "https://www.gravatar.com/avatar?d=mp",
      "user_id": "user_29w83sxmDNGwOuEthce5gg56FcC"
    },
    "role": "admin",
    "updated_at": 1654013203217
  },
  "event_attributes": {
    "http_request": {
      "client_ip": "0.0.0.0",
      "user_agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36"
    }
  },
  "object": "event",
  "timestamp": 1654013203217,
  "type": "organizationMembership.created"
}
```

```
{
  "data": {
    "created_at": 1654013847054,
    "id": "orgmem_29wAbjiJs6aZuPq7AzmkW9dwmyl",
    "object": "organization_membership",
    "organization": {
      "created_at": 1654013202977,
      "created_by": "user_1vq84bqWzw7qmFgqSwN4CH1Wp0n",
      "id": "org_29w9IfBrPmcpi0IeBVaKtA7R94W",
      "image_url": "https://img.clerk.com/xxxxxx",
      "logo_url": null,
      "name": "Acme Inc",
      "object": "organization",
      "public_metadata": {},
      "slug": "acme-inc",
      "updated_at": 1654013567994
    },
    "public_user_data": {
      "first_name": null,
      "identifier": "example@example.org",
      "image_url": "https://img.clerk.com/xxxxxx",
      "last_name": null,
      "profile_image_url": "https://www.gravatar.com/avatar?d=mp",
      "user_id": "user_29wACSk1DjeUCwsS6SbbgIgilMy"
    },
    "role": "basic_member",
    "updated_at": 1654013847054
  },
  "event_attributes": {
    "http_request": {
      "client_ip": "0.0.0.0",
      "user_agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36"
    }
  },
  "object": "event",
  "timestamp": 1654013847054,
  "type": "organizationMembership.deleted"
}
```

```
{
  "data": {
    "created_at": 1654013847054,
    "id": "orgmem_29wAbjiJs6aZuPq7AzmkW9dwmyl",
    "object": "organization_membership",
    "organization": {
      "created_at": 1654013202977,
      "created_by": "user_1vq84bqWzw7qmFgqSwN4CH1Wp0n",
      "id": "org_29w9IfBrPmcpi0IeBVaKtA7R94W",
      "image_url": "https://img.clerk.com/xxxxxx",
      "logo_url": null,
      "name": "Acme Inc",
      "object": "organization",
      "public_metadata": {},
      "slug": "acme-inc",
      "updated_at": 1654013567994
    },
    "public_user_data": {
      "first_name": null,
      "identifier": "example@example.org",
      "image_url": "https://img.clerk.com/xxxxxx",
      "last_name": null,
      "profile_image_url": "https://www.gravatar.com/avatar?d=mp",
      "user_id": "user_29wACSk1DjeUCwsS6SbbgIgilMy"
    },
    "role": "basic_member",
    "updated_at": 1654013910646
  },
  "event_attributes": {
    "http_request": {
      "client_ip": "0.0.0.0",
      "user_agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36"
    }
  },
  "object": "event",
  "timestamp": 1654013910646,
  "type": "organizationMembership.updated"
}
```

# User

```
{
  "data": {
    "birthday": "",
    "created_at": 1654012591514,
    "email_addresses": [
      {
        "email_address": "example@example.org",
        "id": "idn_29w83yL7CwVlJXylYLxcslromF1",
        "linked_to": [],
        "object": "email_address",
        "verification": {
          "status": "verified",
          "strategy": "ticket"
        }
      }
    ],
    "external_accounts": [],
    "external_id": "567772",
    "first_name": "Example",
    "gender": "",
    "id": "user_29w83sxmDNGwOuEthce5gg56FcC",
    "image_url": "https://img.clerk.com/xxxxxx",
    "last_name": "Example",
    "last_sign_in_at": 1654012591514,
    "object": "user",
    "password_enabled": true,
    "phone_numbers": [],
    "primary_email_address_id": "idn_29w83yL7CwVlJXylYLxcslromF1",
    "primary_phone_number_id": null,
    "primary_web3_wallet_id": null,
    "private_metadata": {},
    "profile_image_url": "https://www.gravatar.com/avatar?d=mp",
    "public_metadata": {},
    "two_factor_enabled": false,
    "unsafe_metadata": {},
    "updated_at": 1654012591835,
    "username": null,
    "web3_wallets": []
  },
  "event_attributes": {
    "http_request": {
      "client_ip": "0.0.0.0",
      "user_agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36"
    }
  },
  "object": "event",
  "timestamp": 1654012591835,
  "type": "user.created"
}
```

```
{
  "data": {
    "deleted": true,
    "id": "user_29wBMCtzATuFJut8jO2VNTVekS4",
    "object": "user"
  },
  "event_attributes": {
    "http_request": {
      "client_ip": "0.0.0.0",
      "user_agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36"
    }
  },
  "object": "event",
  "timestamp": 1661861640000,
  "type": "user.deleted"
}
```

```
{
  "data": {
    "birthday": "",
    "created_at": 1654012591514,
    "email_addresses": [
      {
        "email_address": "example@example.org",
        "id": "idn_29w83yL7CwVlJXylYLxcslromF1",
        "linked_to": [],
        "object": "email_address",
        "reserved": true,
        "verification": {
          "attempts": null,
          "expire_at": null,
          "status": "verified",
          "strategy": "admin"
        }
      }
    ],
    "external_accounts": [],
    "external_id": null,
    "first_name": "Example",
    "gender": "",
    "id": "user_29w83sxmDNGwOuEthce5gg56FcC",
    "image_url": "https://img.clerk.com/xxxxxx",
    "last_name": null,
    "last_sign_in_at": null,
    "object": "user",
    "password_enabled": true,
    "phone_numbers": [],
    "primary_email_address_id": "idn_29w83yL7CwVlJXylYLxcslromF1",
    "primary_phone_number_id": null,
    "primary_web3_wallet_id": null,
    "private_metadata": {},
    "profile_image_url": "https://www.gravatar.com/avatar?d=mp",
    "public_metadata": {},
    "two_factor_enabled": false,
    "unsafe_metadata": {},
    "updated_at": 1654012824306,
    "username": null,
    "web3_wallets": []
  },
  "event_attributes": {
    "http_request": {
      "client_ip": "0.0.0.0",
      "user_agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36"
    }
  },
  "object": "event",
  "timestamp": 1654012824306,
  "type": "user.updated"
}
```
