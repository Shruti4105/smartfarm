import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type {
  UserProfile,
  SoilAnalysisResult,
  CropAdvisoryParams,
  CropRecommendation,
  Product,
  CropListing,
  StoreItem,
  PaymentMethod,
  Order,
} from '../backend';
import { useInternetIdentity } from './useInternetIdentity';

// ─── User Profile ────────────────────────────────────────────────────────────

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      try {
        return await actor.getCallerUserProfile();
      } catch {
        return null;
      }
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      await actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

// ─── Soil Analysis ───────────────────────────────────────────────────────────

export function useAnalyzeSoilImage() {
  const { actor } = useActor();

  return useMutation<SoilAnalysisResult, Error, Uint8Array>({
    mutationFn: async (image: Uint8Array) => {
      if (!actor) throw new Error('Actor not available');
      return actor.analyzeSoilImage(image);
    },
  });
}

// ─── Crop Advisory ───────────────────────────────────────────────────────────

export function useGetSmartCropAdvisory() {
  const { actor } = useActor();

  return useMutation<CropRecommendation, Error, CropAdvisoryParams>({
    mutationFn: async (params: CropAdvisoryParams) => {
      if (!actor) throw new Error('Actor not available');
      return actor.getSmartCropAdvisory(params);
    },
  });
}

// ─── Marketplace Products ────────────────────────────────────────────────────

export function useGetProductsByLocation(location: string) {
  const { actor, isFetching } = useActor();

  return useQuery<Product[]>({
    queryKey: ['products', location],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getProductsByLocation(location);
    },
    enabled: !!actor && !isFetching,
  });
}

/** Fetches all products (empty location string returns all from backend) */
export function useGetAllProducts() {
  const { actor, isFetching } = useActor();

  return useQuery<Product[]>({
    queryKey: ['products', 'all'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getProductsByLocation('');
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddProduct() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      name,
      description,
      price,
      location,
    }: {
      name: string;
      description: string;
      price: number;
      location: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addProduct(name, description, price, location);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

// ─── Store Items ─────────────────────────────────────────────────────────────

export function useGetStoreItems() {
  const { actor, isFetching } = useActor();

  return useQuery<StoreItem[]>({
    queryKey: ['storeItems'],
    queryFn: async () => {
      if (!actor) return [];
      // Return mock store items since backend only allows admin to add
      return [
        { id: 'fertilizer_storeitem', name: 'Premium Organic Fertilizer', price: 29.99, stock: BigInt(100) },
        { id: 'seeds_storeitem', name: 'Hybrid Corn Seeds (5kg)', price: 45.00, stock: BigInt(50) },
        { id: 'pesticide_storeitem', name: 'Bio Pesticide Spray', price: 18.50, stock: BigInt(75) },
        { id: 'tools_storeitem', name: 'Garden Tool Set', price: 65.00, stock: BigInt(30) },
        { id: 'soil_storeitem', name: 'Enriched Potting Soil (20L)', price: 22.00, stock: BigInt(60) },
        { id: 'irrigation_storeitem', name: 'Drip Irrigation Kit', price: 89.99, stock: BigInt(20) },
      ];
    },
    enabled: !!actor && !isFetching,
  });
}

// ─── Crop Listings ───────────────────────────────────────────────────────────

export function useGetCropListingsByLocation(location: string) {
  const { actor, isFetching } = useActor();

  return useQuery<CropListing[]>({
    queryKey: ['cropListings', location],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getCropListingsByLocation(location);
    },
    enabled: !!actor && !isFetching,
  });
}

/** Fetches all crop listings (empty location string returns all from backend) */
export function useGetAllCropListings() {
  const { actor, isFetching } = useActor();

  return useQuery<CropListing[]>({
    queryKey: ['cropListings', 'all'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getCropListingsByLocation('');
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddCropListing() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      cropName,
      quantity,
      pricePerUnit,
      location,
    }: {
      cropName: string;
      quantity: number;
      pricePerUnit: number;
      location: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addCropListing(cropName, quantity, pricePerUnit, location);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cropListings'] });
    },
  });
}

// ─── Checkout & Orders ───────────────────────────────────────────────────────

export function useCheckout() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation<Order, Error, { items: StoreItem[]; total: number; paymentMethod: PaymentMethod }>({
    mutationFn: async ({ items, total, paymentMethod }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.checkout(items, total, paymentMethod);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
}

export function useGetOrders() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<Order[]>({
    queryKey: ['orders'],
    queryFn: async () => {
      if (!actor || !identity) return [];
      const userId = identity.getPrincipal();
      return actor.getOrders(userId);
    },
    enabled: !!actor && !isFetching && !!identity,
  });
}
