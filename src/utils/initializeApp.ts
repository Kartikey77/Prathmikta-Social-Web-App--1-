// App initialization utilities for Supabase integration

import { projectId, publicAnonKey } from './supabase/info';

const SERVER_URL = `https://${projectId}.supabase.co/functions/v1/server`;

export async function initializeApp(): Promise<boolean> {
  try {
    console.log('Initializing Prathmikta app...');
    
    // Add timeout for connection test to prevent hanging
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout
    
    // Test connection to Supabase backend
    const healthResponse = await fetch(`${SERVER_URL}/make-server-c3689432/health`, {
      signal: controller.signal,
      headers: {
        'Authorization': `Bearer ${publicAnonKey}`,
      },
    });

    clearTimeout(timeoutId);

    if (healthResponse.ok) {
      console.log('✅ Connected to Supabase database');
      
      // Initialize default data on the server
      try {
        await fetch(`${SERVER_URL}/make-server-c3689432/initialize`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`,
          },
        });
        console.log('✅ Server data initialized');
      } catch (initError) {
        console.log('⚠️ Failed to initialize server data, continuing anyway');
      }
      
      return true;
    } else {
      console.log('📱 Demo mode: Server health check failed, using localStorage');
      return false;
    }
  } catch (error) {
    // In demo mode, this is expected - don't show as error
    if (error instanceof Error && (
      error.name === 'AbortError' || 
      error.message.includes('Failed to fetch') ||
      error.message.includes('TypeError')
    )) {
      console.log('📱 Demo mode: Running with localStorage storage');
    } else {
      console.log('❌ Connection failed, using localStorage fallback:', error instanceof Error ? error.message : 'Unknown error');
    }
    return false;
  }
}

export async function testSupabaseConnection(): Promise<{ connected: boolean; message: string }> {
  try {
    // Add timeout to prevent hanging
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);
    
    const response = await fetch(`${SERVER_URL}/make-server-c3689432/health`, {
      signal: controller.signal,
      headers: {
        'Authorization': `Bearer ${publicAnonKey}`,
      },
    });
    
    clearTimeout(timeoutId);
    
    if (response.ok) {
      return {
        connected: true,
        message: 'Successfully connected to Supabase database'
      };
    } else {
      return {
        connected: false,
        message: `Server responded with status: ${response.status}`
      };
    }
  } catch (error) {
    // In demo mode, provide user-friendly message
    if (error instanceof Error && (
      error.name === 'AbortError' || 
      error.message.includes('Failed to fetch') ||
      error.message.includes('TypeError')
    )) {
      return {
        connected: false,
        message: 'Running in demo mode with local storage'
      };
    }
    
    return {
      connected: false,
      message: `Connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}