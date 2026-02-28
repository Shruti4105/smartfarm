import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Product {
    id: string;
    name: string;
    description: string;
    seller: Principal;
    price: number;
    location: string;
}
export interface CropListing {
    id: string;
    pricePerUnit: number;
    quantity: number;
    cropName: string;
    location: string;
    farmer: Principal;
}
export interface SoilAnalysisResult {
    recommendedCrops: Array<string>;
    preventionTips: Array<string>;
}
export interface StoreItem {
    id: string;
    name: string;
    stock: bigint;
    price: number;
}
export interface CropAdvisoryParams {
    region: string;
    pHLevel: number;
    soilType: string;
    moisture: number;
}
export interface PaymentMethod {
    cvv: string;
    expiryDate: string;
    cardHolderName: string;
    cardNumber: string;
}
export interface CropRecommendation {
    riskReductionTips: Array<string>;
    crops: Array<string>;
    sustainablePractices: Array<string>;
}
export interface Order {
    status: string;
    total: number;
    paymentMethod: PaymentMethod;
    userId: Principal;
    confirmationNumber: string;
    items: Array<StoreItem>;
}
export interface UserProfile {
    username: string;
    location: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addCropListing(cropName: string, quantity: number, pricePerUnit: number, location: string): Promise<string>;
    addProduct(name: string, description: string, price: number, location: string): Promise<string>;
    addStoreItem(name: string, price: number, stock: bigint): Promise<string>;
    analyzeSoilImage(image: Uint8Array): Promise<SoilAnalysisResult>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    checkout(items: Array<StoreItem>, total: number, paymentMethod: PaymentMethod): Promise<Order>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCropListingsByLocation(location: string): Promise<Array<CropListing>>;
    getOrders(userId: Principal): Promise<Array<Order>>;
    getProductsByLocation(location: string): Promise<Array<Product>>;
    getSmartCropAdvisory(params: CropAdvisoryParams): Promise<CropRecommendation>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
}
