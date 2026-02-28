import Map "mo:core/Map";
import Text "mo:core/Text";
import Array "mo:core/Array";
import Principal "mo:core/Principal";
import List "mo:core/List";
import Runtime "mo:core/Runtime";
import Iter "mo:core/Iter";

import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";

actor {
  // Mixins
  include MixinStorage();

  // Authorization
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // User Types and Storage
  public type UserProfile = {
    username : Text;
    location : Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view their profile");
    };
    switch (userProfiles.get(caller)) {
      case (null) { Runtime.trap("User not found") };
      case (profile) { profile };
    };
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized access");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Soil Image Analysis Types
  public type SoilAnalysisResult = {
    recommendedCrops : [Text];
    preventionTips : [Text];
  };

  public shared ({ caller }) func analyzeSoilImage(image : Blob) : async SoilAnalysisResult {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can analyze soil images");
    };
    let crops = ["Wheat", "Corn", "Rice"];
    let tips = ["Rotate crops annually", "Use organic fertilizers"];

    {
      recommendedCrops = crops;
      preventionTips = tips;
    };
  };

  // Crop Advisory Types
  public type CropAdvisoryParams = {
    soilType : Text;
    pHLevel : Float;
    moisture : Float;
    region : Text;
  };

  public type CropRecommendation = {
    crops : [Text];
    sustainablePractices : [Text];
    riskReductionTips : [Text];
  };

  public shared ({ caller }) func getSmartCropAdvisory(params : CropAdvisoryParams) : async CropRecommendation {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can get crop advisory");
    };
    let crops = ["Soybean", "Sorghum", "Barley"];
    let practices = ["Use drip irrigation", "Plant cover crops"];
    let tips = ["Monitor moisture levels", "Test soil regularly"];

    {
      crops;
      sustainablePractices = practices;
      riskReductionTips = tips;
    };
  };

  // Marketplace Product Types and Storage
  public type Product = {
    id : Text;
    name : Text;
    description : Text;
    price : Float;
    location : Text;
    seller : Principal;
  };

  let products = Map.empty<Text, Product>();

  public shared ({ caller }) func addProduct(name : Text, description : Text, price : Float, location : Text) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add products");
    };

    let id = name # "_product";
    let product : Product = {
      id;
      name;
      description;
      price;
      location;
      seller = caller;
    };
    products.add(id, product);
    id;
  };

  public query ({ caller }) func getProductsByLocation(location : Text) : async [Product] {
    let filtered = products.values().toArray().filter(
      func(p) { p.location == location }
    );
    filtered;
  };

  // In-App Store Product Types and Storage
  public type StoreItem = {
    id : Text;
    name : Text;
    price : Float;
    stock : Nat;
  };

  let storeItems = Map.empty<Text, StoreItem>();

  public shared ({ caller }) func addStoreItem(name : Text, price : Float, stock : Nat) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add store items");
    };
    let id = name # "_storeitem";
    let item : StoreItem = {
      id;
      name;
      price;
      stock;
    };
    storeItems.add(id, item);
    id;
  };

  // Farmer Marketplace Types and Storage
  public type CropListing = {
    id : Text;
    cropName : Text;
    quantity : Float;
    pricePerUnit : Float;
    location : Text;
    farmer : Principal;
  };

  let cropListings = Map.empty<Text, CropListing>();

  public shared ({ caller }) func addCropListing(cropName : Text, quantity : Float, pricePerUnit : Float, location : Text) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add crop listings");
    };

    let id = cropName # "_listing";
    let listing : CropListing = {
      id;
      cropName;
      quantity;
      pricePerUnit;
      location;
      farmer = caller;
    };
    cropListings.add(id, listing);
    id;
  };

  public query ({ caller }) func getCropListingsByLocation(location : Text) : async [CropListing] {
    let filtered = cropListings.values().toArray().filter(
      func(l) { l.location == location }
    );
    filtered;
  };

  // Payment and Order Processing Types
  public type PaymentMethod = {
    cardHolderName : Text;
    cardNumber : Text;
    expiryDate : Text;
    cvv : Text;
  };

  public type Order = {
    userId : Principal;
    items : [StoreItem];
    total : Float;
    paymentMethod : PaymentMethod;
    status : Text;
    confirmationNumber : Text;
  };

  let orders = Map.empty<Principal, List.List<Order>>();

  // Process Purchase
  public shared ({ caller }) func checkout(
    items : [StoreItem],
    total : Float,
    paymentMethod : PaymentMethod
  ) : async Order {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can checkout");
    };

    // Simulate payment processing
    let confirmationNumber = "CONFIRM_" # total.toText();

    let order : Order = {
      userId = caller;
      items;
      total;
      paymentMethod;
      status = "Confirmed";
      confirmationNumber;
    };

    // Store order in user's order list
    let existingOrders = switch (orders.get(caller)) {
      case (?list) { list };
      case (null) { List.empty<Order>() };
    };
    existingOrders.add(order);
    orders.add(caller, existingOrders);

    order;
  };

  // Retrieve orders for a user
  public query ({ caller }) func getOrders(userId : Principal) : async [Order] {
    if (caller != userId and not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized access to orders");
    };
    switch (orders.get(userId)) {
      case (?ordersList) { ordersList.toArray() };
      case (null) { [] };
    };
  };
};
