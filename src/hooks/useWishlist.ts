
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from './useAuth';
import { addToWishlist, removeFromWishlist, getWishlistItems } from '../services/wooCommerceApi';
import { useToast } from './use-toast';

export const useWishlist = () => {
  const { user, isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: wishlistItems = [], isLoading } = useQuery({
    queryKey: ['wishlist', user?.id],
    queryFn: () => user?.id ? getWishlistItems(user.id) : Promise.resolve([]),
    enabled: !!user?.id && !!isAuthenticated,
    staleTime: 1 * 60 * 1000, // 1 minute
    refetchOnWindowFocus: false,
  });

  const addToWishlistMutation = useMutation({
    mutationFn: ({ userId, productId }: { userId: number; productId: number }) =>
      addToWishlist(userId, productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist', user?.id] });
      toast({
        title: "Added to wishlist",
        description: "Item has been added to your wishlist",
      });
    },
    onError: (error) => {
      console.error('Error adding to wishlist:', error);
      toast({
        title: "Error",
        description: "Failed to add item to wishlist. Please try again.",
        variant: "destructive",
      });
    },
  });

  const removeFromWishlistMutation = useMutation({
    mutationFn: ({ userId, productId }: { userId: number; productId: number }) =>
      removeFromWishlist(userId, productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist', user?.id] });
      toast({
        title: "Removed from wishlist",
        description: "Item has been removed from your wishlist",
      });
    },
    onError: (error) => {
      console.error('Error removing from wishlist:', error);
      toast({
        title: "Error",
        description: "Failed to remove item from wishlist. Please try again.",
        variant: "destructive",
      });
    },
  });

  const toggleWishlist = (productId: number) => {
    if (!user?.id || !isAuthenticated) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to add items to your wishlist",
        variant: "destructive",
      });
      return;
    }

    const isInList = wishlistItems.some(item => item.product_id === productId);
    
    if (isInList) {
      removeFromWishlistMutation.mutate({ userId: user.id, productId });
    } else {
      addToWishlistMutation.mutate({ userId: user.id, productId });
    }
  };

  return {
    wishlistItems,
    isLoading,
    toggleWishlist,
    addToWishlist: (productId: number) => {
      if (user?.id && isAuthenticated) {
        addToWishlistMutation.mutate({ userId: user.id, productId });
      } else {
        toast({
          title: "Please sign in",
          description: "You need to be signed in to add items to your wishlist",
          variant: "destructive",
        });
      }
    },
    removeFromWishlist: (productId: number) => {
      if (user?.id && isAuthenticated) {
        removeFromWishlistMutation.mutate({ userId: user.id, productId });
      }
    },
    isInWishlist: (productId: number) => 
      wishlistItems.some(item => item.product_id === productId),
    isAddingToWishlist: addToWishlistMutation.isPending,
    isRemovingFromWishlist: removeFromWishlistMutation.isPending,
  };
};
