import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useListingAnalytics = () => {
  const { user } = useAuth();

  const trackListingView = async (listingId: string) => {
    try {
      // Track in analytics table
      await supabase
        .from('listing_analytics')
        .insert({
          listing_id: listingId,
          event_type: 'view',
          user_id: user?.id,
          event_data: {
            timestamp: new Date().toISOString(),
            user_agent: navigator.userAgent
          }
        });

      // Update view count on the listing
      await supabase.rpc('increment_view_count', { listing_id: listingId });
    } catch (error) {
      console.error('Error tracking listing view:', error);
    }
  };

  const trackListingClick = async (listingId: string, clickType: string = 'general') => {
    try {
      // Track in analytics table
      await supabase
        .from('listing_analytics')
        .insert({
          listing_id: listingId,
          event_type: 'click',
          user_id: user?.id,
          event_data: {
            click_type: clickType,
            timestamp: new Date().toISOString()
          }
        });

      // Update click count on the listing
      await supabase.rpc('increment_click_count', { listing_id: listingId });
    } catch (error) {
      console.error('Error tracking listing click:', error);
    }
  };

  const trackListingContact = async (listingId: string, contactMethod: string) => {
    try {
      await supabase
        .from('listing_analytics')
        .insert({
          listing_id: listingId,
          event_type: 'contact',
          user_id: user?.id,
          event_data: {
            contact_method: contactMethod,
            timestamp: new Date().toISOString()
          }
        });
    } catch (error) {
      console.error('Error tracking listing contact:', error);
    }
  };

  const checkForPromotionSuggestions = async (listingId: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('boost-suggestion-agent', {
        body: {
          listingId,
          action: 'evaluate'
        }
      });

      if (error) {
        console.error('Error checking promotion suggestions:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error checking promotion suggestions:', error);
      return null;
    }
  };

  return {
    trackListingView,
    trackListingClick,
    trackListingContact,
    checkForPromotionSuggestions
  };
};