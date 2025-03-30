/**
 * Types for webhook events and data
 */
import { WebhookEvent } from "@clerk/nextjs/server";

// Clerk Organization Webhook Data
export interface ClerkOrganizationWebhookData {
  id: string;
  name: string;
  slug?: string;
  logo_url?: string;
  image_url?: string;
  created_at?: number;
  updated_at?: number;
  created_by?: string;
  public_metadata?: Record<string, any>;
  deleted?: boolean;
}

// Clerk Organization Membership Webhook Data
export interface ClerkMembershipWebhookData {
  id: string;
  role: string;
  created_at?: number;
  updated_at?: number;
  organization: {
    id: string;
    name: string;
    slug?: string;
  };
  public_user_data: {
    user_id: string;
    first_name?: string;
    last_name?: string;
    identifier: string;
    image_url?: string;
    profile_image_url?: string;
  };
  deleted?: boolean;
}

// Clerk User Webhook Data
export interface ClerkUserWebhookData {
  id: string;
  email_addresses?: Array<{
    email_address: string;
    id: string;
  }>;
  first_name?: string;
  last_name?: string;
  profile_image_url?: string;
  image_url?: string;
  primary_email_address_id?: string;
  deleted?: boolean;
}

// Webhook Processing Result
export interface WebhookProcessingResult {
  success: boolean;
  message: string;
}

// Webhook Handler Function Type
export type WebhookHandler = (event: WebhookEvent) => Promise<WebhookProcessingResult>; 