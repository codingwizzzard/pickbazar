import type { WishlistPaginator, WishlistQueryOptions } from '@/types';
import axios from 'axios';
import { useTranslation } from 'next-i18next';
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from 'react-query';
import { toast } from 'react-toastify';
import client from './client';
import { API_ENDPOINTS } from './client/api-endpoints';
import { mapPaginatorData } from './utils/data-mappers';
import { useRouter } from 'next/router';

export function useToggleWishlist() {
  const queryClient = useQueryClient();
  const { t } = useTranslation('common');
  
  const {
    mutate: toggleWishlist,
    isLoading,
    isSuccess,
  } = useMutation(client.wishlist.toggle, {
    onSuccess: (data, variables) => {
      // Invalidate the wishlist query to force refetch
      queryClient.invalidateQueries([API_ENDPOINTS.USERS_WISHLIST_TOGGLE]);
      
      toast.success(
        data.in_wishlist 
          ? t('text-added-to-wishlist') 
          : t('text-removed-from-wishlist')
      );
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        toast.error(`${t(error.response?.data.message)}`);
      }
    },
  });

  return { toggleWishlist, isLoading, isSuccess };
}
// export function useRemoveFromWishlist() {
//   const { t } = useTranslation('common');
//   const queryClient = useQueryClient();

//   const {
//     mutate: removeFromWishlist,
//     isLoading,
//     isSuccess,
//   } = useMutation(client.wishlist.remove, {
//     onSuccess: () => {
//       toast.success(`${t('text-removed-from-wishlist')}`);
//       queryClient.invalidateQueries([API_ENDPOINTS.USERS_WISHLIST_TOGGLE]);
//     },
//     onError: (error) => {
//       if (axios.isAxiosError(error)) {
//         toast.error(`${t(error.response?.data.message)}`);
//       }
//     },
//   });

//   return { removeFromWishlist, isLoading, isSuccess };
// }
export function useRemoveFromWishlist() {
  const { t } = useTranslation('common');
  const queryClient = useQueryClient();

  const {
    mutate: removeFromWishlist,
    isLoading,
    isSuccess,
  } = useMutation(client.wishlist.remove, {
    onSuccess: () => {
      toast.success(t('text-removed-from-wishlist'));
      
      // Invalidate both the wishlist and in_wishlist queries
      queryClient.invalidateQueries([API_ENDPOINTS.USERS_WISHLIST_TOGGLE]);
      queryClient.invalidateQueries([`${API_ENDPOINTS.USERS_WISHLIST_TOGGLE}/in_wishlist`]);
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        toast.error(t(error.response?.data.message));
      }
    },
  });

  return { removeFromWishlist, isLoading, isSuccess };
}

export function useWishlist(options?: WishlistQueryOptions) {
  const { locale } = useRouter();

  const formattedOptions = {
    ...options,
    // language: locale
  };

  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
  } = useInfiniteQuery<WishlistPaginator, Error>(
    [API_ENDPOINTS.USERS_WISHLIST_TOGGLE, formattedOptions],
    ({ queryKey, pageParam }) =>
      client.wishlist.all(Object.assign({}, queryKey[1], pageParam)),
    {
      getNextPageParam: ({ current_page, last_page }) =>
        last_page > current_page && { page: current_page + 1 },
    }
  );
  function handleLoadMore() {
    fetchNextPage();
  }
  return {
    wishlists: data?.pages?.flatMap((page) => page.data) ?? [],
    paginatorInfo: Array.isArray(data?.pages)
      ? mapPaginatorData(data?.pages[data.pages.length - 1])
      : null,
    isLoading,
    error,
    isFetching,
    isLoadingMore: isFetchingNextPage,
    loadMore: handleLoadMore,
    hasMore: Boolean(hasNextPage),
  };
}

export function useInWishlist({
  enabled,
  shop_product_variant_id,
}: {
  shop_product_variant_id: string;
  enabled: boolean;
}) {
  const { data, isLoading, error, refetch } = useQuery<boolean, Error>(
    [`${API_ENDPOINTS.WISHLIST}/in_wishlist`, shop_product_variant_id],
    () => client.wishlist.checkIsInWishlist({ shop_product_variant_id }),
    {
      enabled,
    }
  );
  return {
    inWishlist: Boolean(data) ?? false,
    isLoading,
    error,
    refetch,
  };
}
