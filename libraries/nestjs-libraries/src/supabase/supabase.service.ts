import { Injectable, Logger } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

export interface ScheduledPost {
  id: string;
  user_id: string;
  content: string;
  platforms: string[];
  media_urls: string[];
  status: string;
  scheduled_for: string;
  posted_at: string | null;
  error: string | null;
  created_at: string;
}

export interface SocialAccount {
  id: string;
  user_id: string;
  platform: string;
  platform_id: string;
  access_token: string;
  refresh_token: string | null;
  token_expires_at: string | null;
  account_name: string;
  account_username: string;
  created_at: string;
}

@Injectable()
export class SupabaseService {
  private readonly logger = new Logger(SupabaseService.name);
  private client: SupabaseClient | null = null;

  constructor() {
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_KEY;

    if (!url || !key) {
      this.logger.warn(
        'SUPABASE_URL or SUPABASE_SERVICE_KEY not set — Supabase disabled'
      );
      this.client = null;
      return;
    }

    this.client = createClient(url, key);
  }

  getClient(): SupabaseClient | null {
    return this.client;
  }

  async getScheduledPost(postId: string): Promise<ScheduledPost | null> {
    if (!this.client) return null;

    const { data, error } = await this.client
      .from('scheduled_posts')
      .select('*')
      .eq('id', postId)
      .single();

    if (error) {
      this.logger.error(`Failed to fetch post ${postId}: ${error.message}`);
      return null;
    }
    return data;
  }

  async getSocialAccount(
    userId: string,
    platform: string
  ): Promise<SocialAccount | null> {
    if (!this.client) return null;

    const { data, error } = await this.client
      .from('social_accounts')
      .select('*')
      .eq('user_id', userId)
      .eq('platform', platform)
      .single();

    if (error) {
      this.logger.error(
        `Failed to fetch social account for user=${userId} platform=${platform}: ${error.message}`
      );
      return null;
    }
    return data;
  }

  async updatePostStatus(
    postId: string,
    status: 'posted' | 'failed' | 'publishing',
    extra: { error?: string; posted_at?: string } = {}
  ): Promise<void> {
    if (!this.client) return;

    const { error } = await this.client
      .from('scheduled_posts')
      .update({ status, ...extra })
      .eq('id', postId);

    if (error) {
      this.logger.error(
        `Failed to update post ${postId} status to ${status}: ${error.message}`
      );
    }
  }
}
